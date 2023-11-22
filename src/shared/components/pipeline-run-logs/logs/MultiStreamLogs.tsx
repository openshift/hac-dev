import * as React from 'react';
import { Button } from '@patternfly/react-core';
import { OutlinedPlayCircleIcon } from '@patternfly/react-icons/dist/js/icons';
import { TaskRunKind } from '../../../../types';
import { useScrollDirection, ScrollDirection } from '../../../hooks/scroll';
import { LoadingInline } from '../../status-box/StatusBox';
import { PodKind } from '../../types';
import { containerToLogSourceStatus, LOG_SOURCE_WAITING } from '../utils';
import Logs from './Logs';
import { getRenderContainers } from './logs-utils';
import LogsTaskDuration from './LogsTaskDuration';

import './MultiStreamLogs.scss';

type MultiStreamLogsProps = {
  resource: PodKind;
  taskRun?: TaskRunKind;
  resourceName: string;
  setCurrentLogsGetter: (getter: () => string) => void;
};

export const MultiStreamLogs: React.FC<React.PropsWithChildren<MultiStreamLogsProps>> = ({
  resource,
  taskRun,
  resourceName,
  setCurrentLogsGetter,
}) => {
  const scrollPane = React.useRef<HTMLDivElement>();
  const completedRef = React.useRef<boolean[]>([]);
  const [renderToCount, setRenderToCount] = React.useState(0);
  const [scrollDirection, handleScrollCallback] = useScrollDirection();
  const { containers, stillFetching } = getRenderContainers(resource);
  const dataRef = React.useRef(null);
  dataRef.current = containers;
  const logViewerRef = React.useRef<HTMLDivElement>();
  const taskName = taskRun?.spec.taskRef?.name ?? taskRun?.metadata.name;

  React.useEffect(() => {
    setCurrentLogsGetter(() => {
      return scrollPane.current?.innerText;
    });
  }, [setCurrentLogsGetter]);

  const handleClick = React.useCallback(() => {
    logViewerRef.current.scrollTop = logViewerRef.current.scrollHeight;
  }, []);

  const loadingContainers = resource?.metadata?.name !== resourceName;

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

  const autoScroll =
    scrollDirection == null || scrollDirection === ScrollDirection.scrolledToBottom;

  const containerStatus = resource?.status?.containerStatuses ?? [];
  return (
    <>
      <div className="multi-stream-logs__taskName" data-testid="logs-taskName">
        {taskName} <LogsTaskDuration taskRun={taskRun} />
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
    </>
  );
};
