import React from 'react';
import { RowFunctionArgs, TableData } from '../../shared/components/table';
import { Timestamp } from '../../shared/components/timestamp/Timestamp';
import { TaskRunKind } from '../../types/task-run';
import { taskRunStatus } from '../../utils/pipeline-utils';
import { StatusIconWithText } from '../topology/StatusIcon';
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
      <StatusIconWithText dataTestAttribute="taskrun-status" status={taskRunStatus(obj)} />
    </TableData>
    <TableData className={taskRunTableColumnClasses.kebab}>
      <div />
    </TableData>
  </>
);

export default TaskRunListRow;
