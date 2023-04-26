import * as React from 'react';
import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
} from '@patternfly/react-core';
import { Timestamp } from '../../../shared/components/timestamp/Timestamp';
import { TaskRunKind } from '../../../types';
import { calculateDuration, runStatus } from '../../../utils/pipeline-utils';
import RunResultsList from '../tabs/RunResultsList';
import ScanDescriptionListGroup from '../tabs/ScanDescriptionListGroup';

type Props = {
  taskRun?: TaskRunKind;
  status: runStatus;
};

const TaskRunDetails: React.FC<Props> = ({ taskRun, status }) => (
  <>
    {status !== runStatus.Skipped ? (
      <>
        <DescriptionList columnModifier={{ default: '2Col' }}>
          <DescriptionListGroup>
            <DescriptionListTerm>Started</DescriptionListTerm>
            <DescriptionListDescription>
              <Timestamp timestamp={taskRun?.status?.startTime} />
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Duration</DescriptionListTerm>
            <DescriptionListDescription>
              {taskRun?.status?.startTime
                ? calculateDuration(taskRun.status?.startTime, taskRun.status?.completionTime)
                : '-'}
            </DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
        <DescriptionList className="pf-u-mt-lg">
          <DescriptionListGroup>
            <DescriptionListTerm>Description</DescriptionListTerm>
            <DescriptionListDescription>
              {taskRun?.status?.taskSpec?.description || '-'}
            </DescriptionListDescription>
          </DescriptionListGroup>
          <ScanDescriptionListGroup taskRuns={[taskRun]} hideIfNotFound />
        </DescriptionList>
      </>
    ) : (
      'This task was skipped.'
    )}
    {taskRun?.status?.taskResults?.length ? (
      <>
        <br />
        <RunResultsList status={status} results={taskRun.status.taskResults} compressed />
      </>
    ) : null}
  </>
);

export default TaskRunDetails;
