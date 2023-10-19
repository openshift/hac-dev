import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Flex, FlexItem, ModalVariant, Stack, StackItem } from '@patternfly/react-core';
import { DownloadIcon, CompressIcon, ExpandIcon } from '@patternfly/react-icons/dist/js/icons';
import { classNames } from '@patternfly/react-table';
import { RunStatus } from '@patternfly/react-topology';
import { saveAs } from 'file-saver';
import Logs from '../../shared/components/pipeline-run-logs/logs/Logs';
import { getRenderContainers } from '../../shared/components/pipeline-run-logs/logs/logs-utils';
import { EmptyBox, LoadingBox, LoadingInline } from '../../shared/components/status-box/StatusBox';
import { PodKind } from '../../shared/components/types';
import { useFullscreen } from '../../shared/hooks/fullscreen';
import { ScrollDirection, useScrollDirection } from '../../shared/hooks/scroll';
import { calculateDuration } from '../../utils/pipeline-utils';
import { ComponentProps, createModalLauncher } from '../modal/createModalLauncher';
import { useModalLauncher } from '../modal/ModalProvider';
import { ContainerNavList } from './ContainerNavList';
import { getPodStatus } from './utils/pod-log-utils';
import './PodLogsViewer.scss';

type PodLogViewerProps = ComponentProps & {
  pod: PodKind;
  downloadAllLabel?: string;
  onDownloadAll?: () => Promise<Error>;
};

export const PodLogViewer: React.FC<React.PropsWithChildren<PodLogViewerProps>> = ({
  pod,
  downloadAllLabel,
  onDownloadAll,
}) => {
  const { t } = useTranslation();
  const scrollPane = React.useRef<HTMLDivElement>();
  const completedRef = React.useRef<boolean[]>([]);
  const [, setRenderToCount] = React.useState(0);
  const [selectedContainer, setSelectedContainer] = React.useState(pod?.spec?.containers[0]);
  const [isFullscreen, fullscreenRef, fullscreenToggle] = useFullscreen<HTMLDivElement>();
  const [scrollDirection, handleScrollCallback] = useScrollDirection();
  const [autoScroll, setAutoScroll] = React.useState(true);
  const { containers } = getRenderContainers(pod);
  const [downloadAllStatus, setDownloadAllStatus] = React.useState(false);
  const dataRef = React.useRef(null);
  dataRef.current = containers;

  const handleComplete = React.useCallback((containerName: any) => {
    const index = dataRef.current.findIndex(({ name }) => name === containerName);
    completedRef.current[index] = true;
    const newRenderTo = dataRef.current.findIndex((c, i) => completedRef.current[i] !== true);
    if (newRenderTo === -1) {
      setRenderToCount(dataRef.current.length);
    } else {
      setRenderToCount(newRenderTo);
    }
  }, []);

  React.useEffect(() => {
    if (!scrollDirection) return;
    if (scrollDirection === ScrollDirection.scrollingUp && autoScroll === true) {
      setAutoScroll(false);
    }
    if (scrollDirection === ScrollDirection.scrolledToBottom && autoScroll === false) {
      setAutoScroll(true);
    }
  }, [autoScroll, scrollDirection]);

  const startDownloadAll = () => {
    setDownloadAllStatus(true);
    onDownloadAll()
      .then(() => {
        setDownloadAllStatus(false);
      })
      .catch((err: Error) => {
        setDownloadAllStatus(false);
        // eslint-disable-next-line no-console
        console.warn(err.message || t('Error downloading logs.'));
      });
  };

  const downloadLogs = () => {
    if (!scrollPane.current) return;
    const logString = scrollPane.current.innerText;
    const blob = new Blob([logString], {
      type: 'text/plain;charset=utf-8',
    });
    saveAs(blob, `${pod.metadata.name}.log`);
  };

  const divider = <FlexItem className="pod-logs__divider">|</FlexItem>;

  if (!pod || !pod.spec) {
    return <EmptyBox label="pod not found" />;
  }

  return (
    <Stack>
      <StackItem>
        <span style={{ marginRight: 'var(--pf-v5-global--spacer--lg)' }}>
          {' '}
          <b>Pod status:</b> {getPodStatus(pod)}
        </span>

        {pod?.status.containerStatuses.length > 0 && (
          <span style={{ marginRight: 'var(--pf-v5-global--spacer--lg)' }}>
            {' '}
            <b>Number of restarts:</b> {pod?.status.containerStatuses[0].restartCount}
          </span>
        )}
        <span>
          {' '}
          <b> Age:</b>{' '}
          {pod?.status?.startTime
            ? calculateDuration(pod.status?.startTime, pod.status?.completionTime)
            : '-'}
        </span>
      </StackItem>
      <StackItem isFilled>
        <div className="pod-logs">
          <div className="pod-logs__navList" data-test="pod-log-navlist">
            <ContainerNavList
              initContainers={pod.spec.initContainers}
              containers={containers}
              selectedContainer={selectedContainer}
              onChange={setSelectedContainer}
            />
          </div>
          <div
            className="pod-logs__log-container"
            onScroll={handleScrollCallback}
            data-testid="logs-task-container"
            ref={fullscreenRef}
          >
            <Flex
              className={(classNames as any)({
                'pod-logs--fullscreen': isFullscreen,
              })}
            >
              <FlexItem className="pod-logs__button" align={{ default: 'alignRight' }}>
                <Button variant="link" onClick={downloadLogs} isInline>
                  <DownloadIcon className="pod-logs__icon" />
                  {t('Download')}
                </Button>
              </FlexItem>
              {divider}
              {onDownloadAll && (
                <>
                  <FlexItem className="pod-logs__button">
                    <Button
                      variant="link"
                      onClick={startDownloadAll}
                      isDisabled={downloadAllStatus}
                      isInline
                    >
                      <DownloadIcon className="pod-logs__icon" />
                      {downloadAllLabel || t('Download all')}
                      {downloadAllStatus && <LoadingInline />}
                    </Button>
                  </FlexItem>
                  {divider}
                </>
              )}
              {fullscreenToggle && (
                <FlexItem className="pod-logs__button">
                  <Button variant="link" onClick={fullscreenToggle} isInline>
                    {isFullscreen ? (
                      <>
                        <CompressIcon className="pod-logs__icon" />
                        {t('Collapse')}
                      </>
                    ) : (
                      <>
                        <ExpandIcon className="pod-logs__icon" />
                        {t('Expand')}
                      </>
                    )}
                  </Button>
                </FlexItem>
              )}
            </Flex>
            <div
              className="pod-logs__container"
              onScroll={handleScrollCallback}
              data-testid="pod-logs-container"
            >
              <div className="pod-logs__container__logs" ref={scrollPane}>
                {pod?.spec?.containers ? (
                  <Logs
                    resource={pod}
                    container={selectedContainer}
                    resourceStatus={RunStatus.Running}
                    render={true}
                    onComplete={handleComplete}
                    autoScroll={true}
                  />
                ) : (
                  <LoadingBox />
                )}
              </div>
            </div>
          </div>
        </div>
      </StackItem>
    </Stack>
  );
};

export const podLogViewerLauncher = createModalLauncher(PodLogViewer, {
  className: 'build-log-viewer',
  'data-testid': 'view-build-logs-modal',
  variant: ModalVariant.large,
  title: 'View pod logs',
});

export const usePodLogViewerModal = (pod: PodKind) => {
  const showModal = useModalLauncher();
  return React.useCallback(() => showModal(podLogViewerLauncher({ pod })), [pod, showModal]);
};
