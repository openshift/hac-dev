import * as React from 'react';
import { Text } from '@patternfly/react-core';
import { pipelineRunFilterReducer } from '../../../shared';
import { Timestamp } from '../../../shared/components/timestamp/Timestamp';
import { PipelineRunKind } from '../../types';
import { showPLRMessage, showPLRType } from '../../utils/commits-utils';

export interface CommitSidePanelBodyProps {
  selectedPipelineRun?: PipelineRunKind;
}

const CommitSidePanelBody: React.FC<CommitSidePanelBodyProps> = ({ selectedPipelineRun }) => {
  return selectedPipelineRun ? (
    <>
      <Text component="h3">
        <b>{showPLRType(selectedPipelineRun) ?? selectedPipelineRun.metadata.name}</b>
      </Text>
      <p>
        {showPLRMessage(selectedPipelineRun) ?? pipelineRunFilterReducer(selectedPipelineRun)},
        started at <Timestamp timestamp={selectedPipelineRun?.status?.startTime} />
      </p>
    </>
  ) : (
    <>No Pipeline runs found</>
  );
};

export default CommitSidePanelBody;
