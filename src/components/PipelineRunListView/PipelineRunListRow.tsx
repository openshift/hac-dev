import React from 'react';
import { Link } from 'react-router-dom';
import { PipelineRunLabel } from '../../consts/pipelinerun';
import { pipelineRunFilterReducer } from '../../shared';
import ActionMenu from '../../shared/components/action-menu/ActionMenu';
import { StatusIconWithText } from '../../shared/components/pipeline-run-logs/StatusIcon';
import { RowFunctionArgs, TableData } from '../../shared/components/table';
import { Timestamp } from '../../shared/components/timestamp/Timestamp';
import { PipelineRunKind } from '../../types';
import { calculateDuration } from '../../utils/pipeline-utils';
import { usePipelinerunActions } from './pipelinerun-actions';
import { pipelineRunTableColumnClasses } from './PipelineRunListHeader';

const PipelineListRow: React.FC<RowFunctionArgs<PipelineRunKind>> = ({ obj }) => {
  const capitalize = (label: string) => {
    return label.charAt(0).toUpperCase() + label.slice(1);
  };

  const status = pipelineRunFilterReducer(obj);
  const actions = usePipelinerunActions(obj);

  return (
    <>
      <TableData className={pipelineRunTableColumnClasses.name}>
        <Link to={`/stonesoup/pipelineruns/${obj.metadata?.name}`} title={obj.metadata?.name}>
          {obj.metadata?.name}
        </Link>
      </TableData>
      <TableData className={pipelineRunTableColumnClasses.started}>
        <Timestamp
          timestamp={typeof obj.status?.startTime === 'string' ? obj.status?.startTime : ''}
        />
      </TableData>
      <TableData className={pipelineRunTableColumnClasses.duration}>
        {calculateDuration(
          typeof obj.status?.startTime === 'string' ? obj.status?.startTime : '',
          typeof obj.status?.completionTime === 'string' ? obj.status?.completionTime : '',
        )}
      </TableData>
      <TableData className={pipelineRunTableColumnClasses.status}>
        <StatusIconWithText status={status} />
      </TableData>
      <TableData className={pipelineRunTableColumnClasses.type}>
        {capitalize(obj.metadata?.labels[PipelineRunLabel.PIPELINE_TYPE])}
      </TableData>
      <TableData data-testid="plr-list-row-kebab" className={pipelineRunTableColumnClasses.kebab}>
        <ActionMenu actions={actions} />
      </TableData>
    </>
  );
};

export default PipelineListRow;
