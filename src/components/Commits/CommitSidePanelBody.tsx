import * as React from 'react';
import { Text } from '@patternfly/react-core';
import { Timestamp } from '../../shared/components/timestamp/Timestamp';
import { PipelineRunKind } from '../../types';
import { showPLRMessage, showPLRType } from '../../utils/commits-utils';
import { pipelineRunStatus } from '../../utils/pipeline-utils';

export interface CommitSidePanelBodyProps {
  selectedPipelineRun?: PipelineRunKind;
}

const CommitSidePanelBody: React.FC<React.PropsWithChildren<CommitSidePanelBodyProps>> = ({
  selectedPipelineRun,
}) => {
  return selectedPipelineRun ? (
    <>
      <Text component="h3">
        <b>{showPLRType(selectedPipelineRun) ?? selectedPipelineRun.metadata.name}</b>
      </Text>
      <p>
        {showPLRMessage(selectedPipelineRun) ?? pipelineRunStatus(selectedPipelineRun)}, started at{' '}
        <Timestamp timestamp={selectedPipelineRun?.status?.startTime} />
      </p>
    </>
  ) : (
    <>No Pipeline runs found</>
  );
};

export default CommitSidePanelBody;
