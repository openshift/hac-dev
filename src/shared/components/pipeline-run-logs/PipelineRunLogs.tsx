import * as React from 'react';
import { Nav, NavItem, NavList } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import get from 'lodash/get';
import { ColoredStatusIcon } from '../../../components/topology/StatusIcon';
import { WatchK8sResource } from '../../../dynamic-plugin-sdk';
import { PodGroupVersionKind } from '../../../models/pod';
import { PipelineRunKind, PipelineTask, TaskRunKind, TektonResourceLabel } from '../../../types';
import { pipelineRunStatus, runStatus, taskRunStatus } from '../../../utils/pipeline-utils';
import { ErrorDetailsWithStaticLog } from './logs/log-snippet-types';
import { getDownloadAllLogsCallback } from './logs/logs-utils';
import LogsWrapperComponent from './logs/LogsWrapperComponent';
import { getPLRLogSnippet } from './logs/pipelineRunLogSnippet';
import './PipelineRunLogs.scss';

interface PipelineRunLogsProps {
  className?: string;
  obj: PipelineRunKind;
  taskRuns: TaskRunKind[];
  activeTask?: string;
  workspace: string;
  onActiveTaskChange?: (value: string) => void;
}
interface PipelineRunLogsState {
  activeItem: string;
  navUntouched: boolean;
}
class PipelineRunLogs extends React.Component<PipelineRunLogsProps, PipelineRunLogsState> {
  constructor(props: PipelineRunLogsProps) {
    super(props);
    this.state = { activeItem: null, navUntouched: true };
  }

  componentDidMount() {
    const { activeTask, taskRuns, obj, onActiveTaskChange } = this.props;
    const sortedTaskRuns = this.getSortedTaskRun(taskRuns, [
      ...(obj?.status?.pipelineSpec?.tasks || []),
      ...(obj?.status?.pipelineSpec?.finally || []),
    ]);
    const activeItem = this.getActiveTaskRun(sortedTaskRuns, activeTask);
    const taskName = this.getTaskRunName(activeItem);
    !activeTask && onActiveTaskChange?.(taskName);
    this.setState({ activeItem });
  }

  UNSAFE_componentWillReceiveProps(nextProps: PipelineRunLogsProps) {
    if (this.props.obj !== nextProps.obj || this.props.taskRuns !== nextProps.taskRuns) {
      const { activeTask, taskRuns } = this.props;
      const sortedTaskRuns = this.getSortedTaskRun(taskRuns, [
        ...(this.props?.obj?.status?.pipelineSpec?.tasks || []),
        ...(this.props?.obj?.status?.pipelineSpec?.finally || []),
      ]);
      const activeItem = this.getActiveTaskRun(sortedTaskRuns, activeTask);
      this.state.navUntouched && this.setState({ activeItem });
    }
  }

  getActiveTaskRun = (taskRuns: TaskRunKind[], activeTask: string): string => {
    const activeTaskRun = activeTask
      ? taskRuns.find((taskRun) => taskRun.metadata.name.includes(activeTask))
      : taskRuns.find((taskRun) => taskRunStatus(taskRun) === runStatus.Failed) ||
        taskRuns[taskRuns.length - 1];

    return activeTaskRun?.metadata.name;
  };

  getTaskRunName = (taskRunName: string) => {
    return this.props.taskRuns.find((taskRun) => taskRun.metadata.name === taskRunName)?.metadata
      ?.labels?.[TektonResourceLabel.pipelineTask];
  };

  getSortedTaskRun = (tRuns: TaskRunKind[], tasks: PipelineTask[]): TaskRunKind[] => {
    const taskRuns = tRuns?.sort((a, b) => {
      if (get(a, ['status', 'completionTime'], false)) {
        return b.status?.completionTime &&
          new Date(a.status.completionTime) > new Date(b.status.completionTime)
          ? 1
          : -1;
      }
      return b.status?.completionTime ||
        new Date(a.status?.startTime) > new Date(b.status?.startTime)
        ? 1
        : -1;
    });

    const pipelineTaskNames = tasks?.map((t) => t?.name);
    return (
      taskRuns?.sort(
        (c, d) =>
          pipelineTaskNames?.indexOf(c?.metadata?.labels?.[TektonResourceLabel.pipelineTask]) -
          pipelineTaskNames?.indexOf(d?.metadata?.labels?.[TektonResourceLabel.pipelineTask]),
      ) || []
    );
  };

  onNavSelect = (item: { itemId: number | string }) => {
    const { onActiveTaskChange } = this.props;
    onActiveTaskChange?.(this.getTaskRunName(item.itemId as string));
    this.setState({
      activeItem: item.itemId as string,
      navUntouched: false,
    });
  };

  render() {
    const { className, obj, taskRuns, workspace } = this.props;
    const { activeItem } = this.state;

    const taskRunNames = this.getSortedTaskRun(taskRuns, [
      ...(obj?.status?.pipelineSpec?.tasks || []),
      ...(obj?.status?.pipelineSpec?.finally || []),
    ])?.map((t) => t.metadata.name);

    const logDetails = getPLRLogSnippet(obj, taskRuns) as ErrorDetailsWithStaticLog;
    const pipelineStatus = pipelineRunStatus(obj);

    const taskCount = taskRunNames.length;
    const downloadAllCallback =
      taskCount > 1
        ? getDownloadAllLogsCallback(
            taskRunNames,
            taskRuns,
            workspace,
            obj.metadata?.namespace,
            obj.metadata?.name,
            obj.metadata?.uid,
          )
        : undefined;
    const activeTaskRun = taskRuns.find((taskRun) => taskRun.metadata.name === activeItem);
    const podName = activeTaskRun?.status?.podName;
    const resource: WatchK8sResource = taskCount > 0 &&
      podName && {
        name: podName,
        groupVersionKind: PodGroupVersionKind,
        namespace: obj.metadata.namespace,
        isList: false,
      };

    const waitingForPods = !!(activeItem && !resource);
    const taskName = activeTaskRun?.metadata?.labels?.[TektonResourceLabel.pipelineTask] || '-';
    const pipelineRunFinished = pipelineStatus !== runStatus.Running;

    const selectedItemRef = (item: HTMLSpanElement) => {
      if (item?.scrollIntoView) {
        item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    };

    return (
      <div className={css('pipeline-run-logs', className)}>
        <div className="pipeline-run-logs__tasklist" data-testid="logs-tasklist">
          {taskCount > 0 ? (
            <Nav onSelect={(_event, item) => this.onNavSelect(item)} theme="light">
              <NavList className="pipeline-run-logs__nav">
                {taskRunNames.map((taskRunName) => {
                  const taskRun = taskRuns.find((t) => t.metadata.name === taskRunName);
                  return (
                    <NavItem
                      key={taskRunName}
                      itemId={taskRunName}
                      isActive={activeItem === taskRunName}
                      className="pipeline-run-logs__navitem"
                    >
                      <span ref={activeItem === taskRunName ? selectedItemRef : undefined}>
                        <ColoredStatusIcon status={taskRunStatus(taskRun)} />
                        <span className="pipeline-run-logs__namespan">
                          {taskRun?.metadata?.labels?.[TektonResourceLabel.pipelineTask] || '-'}
                        </span>
                      </span>
                    </NavItem>
                  );
                })}
              </NavList>
            </Nav>
          ) : (
            <div className="pipeline-run-logs__nav">{'No task runs found'}</div>
          )}
        </div>
        <div className="pipeline-run-logs__container">
          {activeItem && resource ? (
            <LogsWrapperComponent
              pipelineRunUID={obj.metadata?.uid}
              resource={resource}
              taskRun={activeTaskRun}
              downloadAllLabel={'Download all task logs'}
              onDownloadAll={downloadAllCallback}
            />
          ) : (
            <div className="pipeline-run-logs__log">
              <div className="pipeline-run-logs__logtext" data-testid="task-logs-error">
                {waitingForPods && !pipelineRunFinished && `Waiting for ${taskName} task to start `}
                {!resource && pipelineRunFinished && !obj.status && 'No logs found'}
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
