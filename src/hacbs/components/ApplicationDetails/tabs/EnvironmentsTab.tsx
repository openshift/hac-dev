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

type EnvironmentTabProps = {
  applicationName: string;
};

const EnvironmentTab: React.FC<EnvironmentTabProps> = ({ applicationName }) => {
  return (
    <EmptyState>
      <EmptyStateIcon icon={OutlinedFileImageIcon} />
      <Title headingLevel="h4" size="lg">
        Add static environments or link to external, managed environments as your release
        destination
      </Title>
      <EmptyStateBody>
        No environments found yet.
        <br />
        To get Started, create an environment or connect to a release environment.
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

export default EnvironmentTab;
