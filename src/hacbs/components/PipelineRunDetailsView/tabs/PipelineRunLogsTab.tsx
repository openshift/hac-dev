import * as React from 'react';
import { EmptyState, EmptyStateIcon, Title, EmptyStateBody } from '@patternfly/react-core';
import { OutlinedFileImageIcon } from '@patternfly/react-icons/dist/esm/icons/outlined-file-image-icon';

type PipelineRunLogsTabProps = {
  pipelineRun: any;
};

const PipelineRunLogsTab: React.FC<PipelineRunLogsTabProps> = () => {
  return (
    <EmptyState>
      <EmptyStateIcon icon={OutlinedFileImageIcon} />
      <Title headingLevel="h4" size="lg">
        View logs for this pipelinerun
      </Title>
      <EmptyStateBody>
        No logs found yet.
        <br />
        To get Started, create a pipelinerun or connect to a pipelinerun environment.
      </EmptyStateBody>
    </EmptyState>
  );
};

export default PipelineRunLogsTab;
