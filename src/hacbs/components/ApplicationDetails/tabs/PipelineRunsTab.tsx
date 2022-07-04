import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  EmptyState,
  EmptyStateIcon,
  Title,
  EmptyStateBody,
  Button,
  EmptyStateSecondaryActions,
} from '@patternfly/react-core';
import { OutlinedFileImageIcon } from '@patternfly/react-icons/dist/esm/icons/outlined-file-image-icon';

type PipelineRunsTabProps = {
  applicationName: string;
};

const PipelineRunsTab: React.FC<PipelineRunsTabProps> = ({ applicationName }) => {
  return (
    <EmptyState>
      <EmptyStateIcon icon={OutlinedFileImageIcon} />
      <Title headingLevel="h4" size="lg">
        Manage your components via pipelines. Monitor CI/CD activity.
      </Title>
      <EmptyStateBody>
        No pipeline run triggered yet.
        <br />
        To get Started, create components and merge their pull request for build pipeline.
      </EmptyStateBody>
      <EmptyStateSecondaryActions>
        <Button
          component={(props) => (
            <Link
              {...props}
              to={`/app-studio/applications?name=${applicationName}&activeTab=components&hacbs=true`}
            />
          )}
          variant="secondary"
        >
          Go to components tab
        </Button>
      </EmptyStateSecondaryActions>
    </EmptyState>
  );
};

export default PipelineRunsTab;
