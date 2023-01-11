import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateSecondaryActions,
  Title,
} from '@patternfly/react-core';
import { OutlinedFileImageIcon } from '@patternfly/react-icons/dist/esm/icons/outlined-file-image-icon';

interface PipelineRunEmptyStateProps {
  applicationName: string;
}

const PipelineRunEmptyState: React.FC<PipelineRunEmptyStateProps> = ({ applicationName }) => {
  return (
    <EmptyState>
      <EmptyStateIcon icon={OutlinedFileImageIcon} />
      <Title headingLevel="h4" size="lg">
        Manage your components via pipelines. Monitor CI/CD activity.
      </Title>
      <EmptyStateBody>
        No pipeline run triggered yet.
        <br />
        To get started, create components and merge their pull request for build pipeline.
      </EmptyStateBody>
      <EmptyStateSecondaryActions>
        <Button
          component={(props) => (
            <Link {...props} to={`/stonesoup/applications/${applicationName}/components`} />
          )}
          variant="secondary"
        >
          Go to components tab
        </Button>
      </EmptyStateSecondaryActions>
    </EmptyState>
  );
};

export default PipelineRunEmptyState;
