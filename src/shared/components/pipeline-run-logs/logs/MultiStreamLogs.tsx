import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Flex, FlexItem } from '@patternfly/react-core';
import {
  DownloadIcon,
  CompressIcon,
  ExpandIcon,
  OutlinedPlayCircleIcon,
} from '@patternfly/react-icons/dist/js/icons';
import classNames from 'classnames';
import { saveAs } from 'file-saver';
import { useFullscreen } from '../../../hooks/fullscreen';
import { useScrollDirection, ScrollDirection } from '../../../hooks/scroll';
import { LoadingInline } from '../../status-box/StatusBox';
import { PodKind } from '../../types';
import { containerToLogSourceStatus, LOG_SOURCE_WAITING } from '../utils';
import Logs from './Logs';
import { getRenderContainers } from './logs-utils';

import './MultiStreamLogs.scss';

type MultiStreamLogsProps = {
  resource: PodKind;
  resourceName: string;
  taskName: string;
  downloadAllLabel?: string;
  onDownloadAll?: () => Promise<Error>;
  errorMessage?: string;
};

export const MultiStreamLogs: React.FC<MultiStreamLogsProps> = ({
  resource,
  taskName,
  resourceName,
  downloadAllLabel,
  onDownloadAll,
  errorMessage,
}) => {
  const { t } = useTranslation();
  const scrollPane = React.useRef<HTMLDivElement>();
  const completedRef = React.useRef<boolean[]>([]);
  const [renderToCount, setRenderToCount] = React.useState(0);
  const [isFullscreen, fullscreenRef, fullscreenToggle] = useFullscreen<HTMLDivElement>();
  const [scrollDirection, handleScrollCallback] = useScrollDirection();
  const { containers, stillFetching } = getRenderContainers(resource);
  const [downloadAllStatus, setDownloadAllStatus] = React.useState(false);
  const dataRef = React.useRef(null);
  dataRef.current = containers;
  const logViewerRef = React.useRef<HTMLDivElement>();

  const handleClick = React.useCallback(() => {
    logViewerRef.current.scrollTop = logViewerRef.current.scrollHeight;
  }, []);

  const loadingContainers = resource?.metadata?.name !== resourceName;

  const handleComplete = React.useCallback((containerName) => {
    const index = dataRef.current.findIndex(({ name }) => name === containerName);
    completedRef.current[index] = true;
    const newRenderTo = dataRef.current.findIndex((c, i) => completedRef.current[i] !== true);
    if (newRenderTo === -1) {
      setRenderToCount(dataRef.current.length);
    } else {
      setRenderToCount(newRenderTo);
    }
  }, []);

  const autoScroll =
    scrollDirection == null || scrollDirection === ScrollDirection.scrolledToBottom;

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
    saveAs(blob, `${taskName}.log`);
  };

  const containerStatus = resource?.status?.containerStatuses ?? [];
  const divider = <FlexItem className="multi-stream-logs__divider">|</FlexItem>;
  return (
    <div ref={fullscreenRef} className="multi-stream-logs">
      <Flex
        className={(classNames as any)({
          'multi-stream-logs--fullscreen': isFullscreen,
        })}
      >
        <FlexItem className="multi-stream-logs__button" align={{ default: 'alignRight' }}>
          <Button variant="link" onClick={downloadLogs} isInline>
            <DownloadIcon className="multi-stream-logs__icon" />
            {t('Download')}
          </Button>
        </FlexItem>
        {divider}
        {onDownloadAll && (
          <>
            <FlexItem className="multi-stream-logs__button">
              <Button
                variant="link"
                onClick={startDownloadAll}
                isDisabled={downloadAllStatus}
                isInline
              >
                <DownloadIcon className="multi-stream-logs__icon" />
                {downloadAllLabel || t('Download all')}
                {downloadAllStatus && <LoadingInline />}
              </Button>
            </FlexItem>
            {divider}
          </>
        )}
        {fullscreenToggle && (
          <FlexItem className="multi-stream-logs__button">
            <Button variant="link" onClick={fullscreenToggle} isInline>
              {isFullscreen ? (
                <>
                  <CompressIcon className="multi-stream-logs__icon" />
                  {t('Collapse')}
                </>
              ) : (
                <>
                  <ExpandIcon className="multi-stream-logs__icon" />
                  {t('Expand')}
                </>
              )}
            </Button>
          </FlexItem>
        )}
      </Flex>
      <div className="multi-stream-logs__taskName" data-testid="logs-taskName">
        {taskName}
        {(loadingContainers || stillFetching) && resource && (
          <span className="multi-stream-logs__taskName__loading-indicator">
            <LoadingInline />
          </span>
        )}
      </div>
      <div
        className="multi-stream-logs__container"
        onScroll={handleScrollCallback}
        data-testid="logs-task-container"
        ref={logViewerRef}
      >
        <div className="multi-stream-logs__container__logs" ref={scrollPane}>
          {resource === null && errorMessage && (
            <div className="pipeline-run-logs__logtext" data-testid="logs-error-message">
              {errorMessage}
            </div>
          )}
          {!loadingContainers &&
            containers.map((container, idx) => {
              const statusIndex = containerStatus.findIndex((c) => c.name === container.name);
              const resourceStatus = containerToLogSourceStatus(containerStatus[statusIndex]);
              return (
                resourceStatus !== LOG_SOURCE_WAITING && (
                  <Logs
                    key={`${taskName}-${container.name}`}
                    resource={resource}
                    container={container}
                    resourceStatus={resourceStatus}
                    onComplete={handleComplete}
                    render={renderToCount >= idx}
                    autoScroll={autoScroll}
                  />
                )
              );
            })}
        </div>
      </div>
      <div>
        {autoScroll ? null : (
          <Button data-testid="resume-log-stream" isBlock onClick={handleClick}>
            <OutlinedPlayCircleIcon /> Resume log stream
          </Button>
        )}
      </div>
    </div>
  );
};
