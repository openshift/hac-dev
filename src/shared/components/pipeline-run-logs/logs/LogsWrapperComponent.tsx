import * as React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { Button, Flex, FlexItem } from '@patternfly/react-core';
import { CompressIcon, DownloadIcon, ExpandIcon } from '@patternfly/react-icons/dist/js/icons';
import classNames from 'classnames';
import { saveAs } from 'file-saver';
import { WatchK8sResource } from '../../../../dynamic-plugin-sdk';
import { TaskRunKind } from '../../../../types';
import { useFullscreen } from '../../../hooks/fullscreen';
import { LoadingInline } from '../../status-box/StatusBox';
import { PodKind } from '../../types';
import { MultiStreamLogs } from './MultiStreamLogs';
import { TektonTaskRunLog } from './TektonTaskRunLog';

type LogsWrapperComponentProps = {
  taskRun: TaskRunKind;
  downloadAllLabel?: string;
  onDownloadAll?: () => Promise<Error>;
  resource: WatchK8sResource;
};

const LogsWrapperComponent: React.FC<React.PropsWithChildren<LogsWrapperComponentProps>> = ({
  resource,
  taskRun,
  onDownloadAll,
  downloadAllLabel = 'Download all',
  ...props
}) => {
  const resourceRef = React.useRef(null);
  const [obj, loaded, error] = useK8sWatchResource<PodKind>(resource);
  const [isFullscreen, fullscreenRef, fullscreenToggle] = useFullscreen<HTMLDivElement>();
  const [downloadAllStatus, setDownloadAllStatus] = React.useState(false);
  const currentLogGetterRef = React.useRef<() => string>();

  const taskName = taskRun?.spec.taskRef?.name ?? taskRun?.metadata.name;

  if (loaded && !error && resource.name === obj.metadata.name) {
    resourceRef.current = obj;
  } else if (error) {
    resourceRef.current = null;
  }

  const downloadLogs = () => {
    if (!currentLogGetterRef.current) return;
    const logString = currentLogGetterRef.current();
    const blob = new Blob([logString], {
      type: 'text/plain;charset=utf-8',
    });
    saveAs(blob, `${taskName}.log`);
  };

  const setLogGetter = React.useCallback(
    (getter: any) => (currentLogGetterRef.current = getter),
    [],
  );

  const startDownloadAll = () => {
    setDownloadAllStatus(true);
    onDownloadAll()
      .then(() => {
        setDownloadAllStatus(false);
      })
      .catch((err: Error) => {
        setDownloadAllStatus(false);
        // eslint-disable-next-line no-console
        console.warn(err.message || 'Error downloading logs.');
      });
  };
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
            Download
          </Button>
        </FlexItem>
        <FlexItem className="multi-stream-logs__divider">|</FlexItem>
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
                {downloadAllLabel}
                {downloadAllStatus && <LoadingInline />}
              </Button>
            </FlexItem>
            <FlexItem className="multi-stream-logs__divider">|</FlexItem>
          </>
        )}
        {fullscreenToggle && (
          <FlexItem className="multi-stream-logs__button">
            <Button variant="link" onClick={fullscreenToggle} isInline>
              {isFullscreen ? (
                <>
                  <CompressIcon className="multi-stream-logs__icon" />
                  Collapse
                </>
              ) : (
                <>
                  <ExpandIcon className="multi-stream-logs__icon" />
                  Expand
                </>
              )}
            </Button>
          </FlexItem>
        )}
      </Flex>
      {loaded || error ? (
        <>
          {!error ? (
            <MultiStreamLogs
              {...props}
              taskRun={taskRun}
              resourceName={resource?.name}
              resource={resourceRef.current}
              setCurrentLogsGetter={setLogGetter}
            />
          ) : (
            <TektonTaskRunLog taskRun={taskRun} setCurrentLogsGetter={setLogGetter} />
          )}
        </>
      ) : (
        <span
          className="multi-stream-logs__taskName__loading-indicator"
          data-testid="loading-indicator"
        >
          <LoadingInline />
        </span>
      )}
    </div>
  );
};

export default LogsWrapperComponent;
