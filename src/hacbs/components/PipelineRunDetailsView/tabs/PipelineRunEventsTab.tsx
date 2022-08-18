import * as React from 'react';
import { EmptyState, EmptyStateIcon, Title, EmptyStateBody } from '@patternfly/react-core';
import { OutlinedFileImageIcon } from '@patternfly/react-icons/dist/esm/icons/outlined-file-image-icon';

type PipelineRunEventsTabProps = {
  pipelineRun: any;
};

const PipelineRunEventsTab: React.FC<PipelineRunEventsTabProps> = () => {
  return (
    <EmptyState>
      <EmptyStateIcon icon={OutlinedFileImageIcon} />
      <Title headingLevel="h4" size="lg">
        Monitor your events for this pipelinerun
      </Title>
      <EmptyStateBody>
        No pipelinerun events found yet.
        <br />
        To get started, create a pipelinerun or connect to a pipelinerun environment.
      </EmptyStateBody>
    </EmptyState>
  );
};

export default PipelineRunEventsTab;
