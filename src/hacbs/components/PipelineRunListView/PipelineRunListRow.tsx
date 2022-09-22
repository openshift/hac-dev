import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, DropdownItem, KebabToggle } from '@patternfly/react-core';
import { RowFunctionArgs, TableData } from '../../../shared/components/table';
import { Timestamp } from '../../../shared/components/timestamp/Timestamp';
import { PipelineRunLabel } from '../../consts/pipelinerun';
import { PipelineRunKind } from '../../types';
import { calculateDuration } from '../../utils/pipeline-utils';
import { pipelineRunTableColumnClasses } from './PipelineRunListHeader';

const PipelineListRow: React.FC<RowFunctionArgs<PipelineRunKind>> = ({ obj }) => {
  const [kebabOpen, setKebabOpen] = useState(false);

  const capitalize = (label: string) => {
    return label.charAt(0).toUpperCase() + label.slice(1);
  };
  return (
    <>
      <TableData className={pipelineRunTableColumnClasses.name}>
        <Link to={`/app-studio/pipelineruns/${obj.metadata.name}`} title={obj.metadata.name}>
          {obj.metadata.name}
        </Link>
      </TableData>
      <TableData className={pipelineRunTableColumnClasses.started}>
        <Timestamp
          timestamp={typeof obj.status?.startTime === 'string' ? obj.status.startTime : ''}
        />
      </TableData>
      <TableData className={pipelineRunTableColumnClasses.duration}>
        {calculateDuration(
          typeof obj.status?.startTime === 'string' ? obj.status.startTime : '',
          typeof obj.status?.completionTime === 'string' ? obj.status.completionTime : '',
        )}
      </TableData>
      <TableData className={pipelineRunTableColumnClasses.status}>
        {obj.status?.conditions[0].status === 'False' ? 'Failed' : 'Succeeded'}
      </TableData>
      <TableData className={pipelineRunTableColumnClasses.type}>
        {capitalize(obj.metadata.labels[PipelineRunLabel.PIPELINE_TYPE])}
      </TableData>
      <TableData className={pipelineRunTableColumnClasses.kebab}>
        <Dropdown
          toggle={<KebabToggle onToggle={setKebabOpen} />}
          isOpen={kebabOpen}
          isPlain
          dropdownItems={[
            <DropdownItem
              key="rerunAction"
              component="button"
              onClick={() => {
                setKebabOpen(false);
              }}
              isDisabled={true}
            >
              Rerun
            </DropdownItem>,
            <DropdownItem
              key="cancel"
              component="button"
              onClick={() => {
                setKebabOpen(false);
              }}
              isDisabled={true}
            >
              Cancel
            </DropdownItem>,
            <DropdownItem
              key="stopAction"
              component="button"
              onClick={() => {
                setKebabOpen(false);
              }}
              isDisabled={true}
            >
              Stop
            </DropdownItem>,
          ]}
        />
      </TableData>
    </>
  );
};

export default PipelineListRow;
