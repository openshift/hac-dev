import * as React from 'react';
import { EmptyState, EmptyStateIcon, Title, EmptyStateBody } from '@patternfly/react-core';
import { OutlinedFileImageIcon } from '@patternfly/react-icons/dist/esm/icons/outlined-file-image-icon';

type PipelineRunTaskRunsTabProps = {
  pipelineRun: any;
};

const PipelineRunTaskRunsTab: React.FC<PipelineRunTaskRunsTabProps> = () => {
  return (
    <EmptyState>
      <EmptyStateIcon icon={OutlinedFileImageIcon} />
      <Title headingLevel="h4" size="lg">
        View task runs for this pipelinerun
      </Title>
      <EmptyStateBody>
        No task runs found yet.
        <br />
        To get Started, create a pipelinerun or connect to a pipelinerun environment.
      </EmptyStateBody>
    </EmptyState>
  );
};

export default PipelineRunTaskRunsTab;
