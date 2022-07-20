import * as React from 'react';
import { EmptyState, EmptyStateIcon, Title, EmptyStateBody } from '@patternfly/react-core';
import { OutlinedFileImageIcon } from '@patternfly/react-icons/dist/esm/icons/outlined-file-image-icon';

type PipelineRunYamlTabProps = {
  pipelineRun: any;
};

const PipelineRunYamlTab: React.FC<PipelineRunYamlTabProps> = () => {
  return (
    <EmptyState>
      <EmptyStateIcon icon={OutlinedFileImageIcon} />
      <Title headingLevel="h4" size="lg">
        View YAML for this pipelinerun
      </Title>
      <EmptyStateBody>
        No YAML markup found yet.
        <br />
        To get Started, create a pipelinerun or connect to a pipelinerun environment.
      </EmptyStateBody>
    </EmptyState>
  );
};

export default PipelineRunYamlTab;
