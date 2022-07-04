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

type CommitTabProps = {
  applicationName: string;
};

const CommitsTab: React.FC<CommitTabProps> = ({ applicationName }) => {
  return (
    <EmptyState>
      <EmptyStateIcon icon={OutlinedFileImageIcon} />
      <Title headingLevel="h4" size="lg">
        Monitor your commits and their pipeline progression across all components
      </Title>
      <EmptyStateBody>
        No commits found yet. <br />
        To get started, create components and merge their pull request for build pipeline.
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

export default CommitsTab;
