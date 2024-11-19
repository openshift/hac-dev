import * as React from 'react';
import { useTRTaskRunLog } from '../../../../hooks/useTektonResults';
import { TaskRunKind } from '../../../../types';
import { HttpError } from '../../../utils/error/http-error';
import { LoadingInline } from '../../status-box/StatusBox';
import LogsTaskDuration from './LogsTaskDuration';

import './Logs.scss';
import './MultiStreamLogs.scss';

type TektonTaskRunLogProps = {
  taskRun?: TaskRunKind;
  setCurrentLogsGetter: (getter: () => string) => void;
};

export const TektonTaskRunLog: React.FC<React.PropsWithChildren<TektonTaskRunLogProps>> = ({
  taskRun,
  setCurrentLogsGetter,
}) => {
  const scrollPane = React.useRef<HTMLDivElement>();
  const taskName = taskRun?.spec.taskRef?.name ?? taskRun?.metadata.name;
  const [trResults, trLoaded, trError] = useTRTaskRunLog(taskRun.metadata.namespace, taskRun);

  React.useEffect(() => {
    setCurrentLogsGetter(() => scrollPane.current?.innerText);
  }, [setCurrentLogsGetter]);

  React.useEffect(() => {
    if (!trError && trLoaded && scrollPane.current && trResults) {
      scrollPane.current.scrollTop = scrollPane.current.scrollHeight;
    }
  }, [trError, trLoaded, trResults]);

  const errorMessage =
    (trError as HttpError)?.code === 404
      ? `Logs are no longer accessible for ${taskName} task`
      : null;

  return (
    <>
      <div className="multi-stream-logs__taskName" data-testid="logs-taskName">
        {taskName}
        <LogsTaskDuration taskRun={taskRun} />
        {!trLoaded && (
          <span
            className="multi-stream-logs__taskName__loading-indicator"
            data-testid="loading-indicator"
          >
            <LoadingInline />
          </span>
        )}
      </div>
      <div
        className="multi-stream-logs__container"
        data-testid="tr-logs-task-container"
        ref={scrollPane}
      >
        <div className="multi-stream-logs__container__logs" data-testid="tr-logs-container">
          {errorMessage && (
            <div className="pipeline-run-logs__logtext" data-testid="tr-logs-error-message">
              {errorMessage}
            </div>
          )}
          {!errorMessage && trLoaded ? (
            <div className="logs" data-testid="tr-logs-container">
              <p className="logs__name">{taskName}</p>
              <div>
                <div className="logs__content" data-testid="tr-logs-content">
                  {trResults}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};
