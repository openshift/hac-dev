import * as React from 'react';
import { Nav, NavItem, NavList } from '@patternfly/react-core';
import get from 'lodash/get';
import { WatchK8sResource } from '../../../dynamic-plugin-sdk';
import { ErrorDetailsWithStaticLog } from './logs/log-snippet-types';
import { getDownloadAllLogsCallback } from './logs/logs-utils';
import LogsWrapperComponent from './logs/LogsWrapperComponent';
import { getPLRLogSnippet } from './logs/pipelineRunLogSnippet';
import { ColoredStatusIcon } from './StatusIcon';
import { PipelineRunKind } from './types/pipelineRun';
import { PodGroupVersionKind, pipelineRunFilterReducer, runStatus } from './utils';
import './PipelineRunLogs.scss';

interface PipelineRunLogsProps {
  obj: PipelineRunKind;
  activeTask?: string;
}
interface PipelineRunLogsState {
  activeItem: string;
  navUntouched: boolean;
}
class PipelineRunLogs extends React.Component<PipelineRunLogsProps, PipelineRunLogsState> {
  constructor(props) {
    super(props);
    this.state = { activeItem: null, navUntouched: true };
  }

  componentDidMount() {
    const { obj, activeTask } = this.props;
    const taskRunFromYaml = get(obj, ['status', 'taskRuns'], {});
    const taskRuns = this.getSortedTaskRun(taskRunFromYaml);
    const activeItem = this.getActiveTaskRun(taskRuns, activeTask);
    this.setState({ activeItem });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.obj !== nextProps.obj) {
      const { obj, activeTask } = this.props;
      const taskRunFromYaml = get(obj, ['status', 'taskRuns'], {});
      const taskRuns = this.getSortedTaskRun(taskRunFromYaml);
      const activeItem = this.getActiveTaskRun(taskRuns, activeTask);
      this.state.navUntouched && this.setState({ activeItem });
    }
  }

  getActiveTaskRun = (taskRuns: string[], activeTask: string): string =>
    activeTask
      ? taskRuns.find((taskRun) => taskRun.includes(activeTask))
      : taskRuns[taskRuns.length - 1];

  getSortedTaskRun = (taskRunFromYaml) => {
    const taskRuns = Object.keys(taskRunFromYaml).sort((a, b) => {
      if (get(taskRunFromYaml, [a, 'status', 'completionTime'], false)) {
        return taskRunFromYaml[b].status?.completionTime &&
          new Date(taskRunFromYaml[a].status.completionTime) >
            new Date(taskRunFromYaml[b].status.completionTime)
          ? 1
          : -1;
      }
      return taskRunFromYaml[b].status?.completionTime ||
        new Date(taskRunFromYaml[a].status?.startTime) >
          new Date(taskRunFromYaml[b].status?.startTime)
        ? 1
        : -1;
    });
    return taskRuns;
  };

  onNavSelect = (item) => {
    this.setState({
      activeItem: item.itemId,
      navUntouched: false,
    });
  };

  render() {
    const { obj } = this.props;
    const { activeItem } = this.state;
    const taskRunFromYaml = get(obj, ['status', 'taskRuns'], {});
    const taskRuns = this.getSortedTaskRun(taskRunFromYaml);
    const logDetails = getPLRLogSnippet(obj) as ErrorDetailsWithStaticLog;
    const pipelineRunStatus = pipelineRunFilterReducer(obj);

    const taskCount = taskRuns.length;
    const downloadAllCallback =
      taskCount > 1
        ? getDownloadAllLogsCallback(
            taskRuns,
            taskRunFromYaml,
            obj.metadata?.namespace,
            obj.metadata?.name,
          )
        : undefined;
    const podName = taskRunFromYaml[activeItem]?.status?.podName;
    const resource: WatchK8sResource = taskCount > 0 &&
      podName && {
        name: podName,
        groupVersionKind: PodGroupVersionKind,
        namespace: obj.metadata.namespace,
        isList: false,
      };

    const waitingForPods = !!(activeItem && !resource);
    const taskName = get(taskRunFromYaml, [activeItem, 'pipelineTaskName'], '-');
    const pipelineRunFinished = pipelineRunStatus !== runStatus.Running;

    return (
      <div className="pipeline-run-logs">
        <div className="pipeline-run-logs__tasklist" data-testid="logs-tasklist">
          {taskCount > 0 ? (
            <Nav onSelect={this.onNavSelect} theme="light">
              <NavList className="pipeline-run-logs__nav">
                {taskRuns.map((task) => {
                  return (
                    <NavItem
                      key={task}
                      itemId={task}
                      isActive={activeItem === task}
                      className="pipeline-run-logs__navitem"
                    >
                      <span>
                        <ColoredStatusIcon
                          status={pipelineRunFilterReducer(get(obj, ['status', 'taskRuns', task]))}
                        />
                        <span className="pipeline-run-logs__namespan">
                          {get(taskRunFromYaml, [task, `pipelineTaskName`], '-')}
                        </span>
                      </span>
                    </NavItem>
                  );
                })}
              </NavList>
            </Nav>
          ) : (
            <div className="pipeline-run-logs__nav">{'No TaskRuns found'}</div>
          )}
        </div>
        <div className="pipeline-run-logs__container">
          {activeItem && resource ? (
            <LogsWrapperComponent
              resource={resource}
              taskName={taskName}
              downloadAllLabel={'Download all task logs'}
              onDownloadAll={downloadAllCallback}
            />
          ) : (
            <div className="pipeline-run-logs__log">
              <div className="pipeline-run-logs__logtext" data-testid="task-logs-error">
                {waitingForPods && !pipelineRunFinished && `Waiting for ${taskName} task to start `}
                {!resource &&
                  pipelineRunFinished &&
                  get(obj, ['status', 'conditions', 0, 'message'], 'No logs found')}
                {logDetails && (
                  <div className="pipeline-run-logs__logsnippet">{logDetails.staticMessage}</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default PipelineRunLogs;
