import React from 'react';
import { pipelineRunFilterReducer } from '../../shared/components/pipeline-run-logs';
import { StatusIconWithText } from '../../shared/components/pipeline-run-logs/StatusIcon';
import { RowFunctionArgs, TableData } from '../../shared/components/table';
import { Timestamp } from '../../shared/components/timestamp/Timestamp';
import { TaskRunKind } from '../../types/task-run';
import { taskRunTableColumnClasses } from './TaskRunListHeader';

const TaskRunListRow: React.FC<RowFunctionArgs<TaskRunKind>> = ({ obj }) => (
  <>
    <TableData className={taskRunTableColumnClasses.name}>{obj.metadata.name}</TableData>
    <TableData className={taskRunTableColumnClasses.task}>
      {obj.spec.taskRef?.name ?? '-'}
    </TableData>
    <TableData className={taskRunTableColumnClasses.started}>
      <Timestamp timestamp={obj.status?.startTime} />
    </TableData>
    <TableData className={taskRunTableColumnClasses.status}>
      <StatusIconWithText
        dataTestAttribute="taskrun-status"
        status={pipelineRunFilterReducer(obj)}
      />
    </TableData>
    <TableData className={taskRunTableColumnClasses.kebab}>
      <div />
    </TableData>
  </>
);

export default TaskRunListRow;
