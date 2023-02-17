import React from 'react';
import { Link } from 'react-router-dom';
import { Button, EmptyStateBody, EmptyStateSecondaryActions } from '@patternfly/react-core';
import emptyStateImgUrl from '../../imgs/Commit.svg';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';
import AppEmptyState from '../EmptyState/AppEmptyState';

type CommitsEmptyStateProps = {
  applicationName: string;
};

const CommitsEmptyState: React.FC<CommitsEmptyStateProps> = ({ applicationName }) => {
  const { workspace } = useWorkspaceInfo();

  return (
    <AppEmptyState
      emptyStateImg={emptyStateImgUrl}
      title="Monitor your CI/CD activity in one place"
    >
      <EmptyStateBody>
        Monitor any activity that happens once you push a commit. We’ll build and test your source
        code, for both pull requests and merged code.
        <br />
        To get started, add a component and merge its pull request for a build pipeline.
      </EmptyStateBody>
      <EmptyStateSecondaryActions>
        <Button
          component={(props) => (
            <Link
              {...props}
              to={`/stonesoup/workspaces/${workspace}/import?application=${applicationName}`}
            />
          )}
          variant="secondary"
        >
          Add component
        </Button>
      </EmptyStateSecondaryActions>
    </AppEmptyState>
  );
};

export default CommitsEmptyState;
