import * as React from 'react';
import { Link } from 'react-router-dom';
import { Button, EmptyStateBody, EmptyStateSecondaryActions } from '@patternfly/react-core';
import emptyStateImgUrl from '../../imgs/Pipeline.svg';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';
import AppEmptyState from '../EmptyState/AppEmptyState';

interface PipelineRunEmptyStateProps {
  applicationName: string;
}

const PipelineRunEmptyState: React.FC<PipelineRunEmptyStateProps> = ({ applicationName }) => {
  const { workspace } = useWorkspaceInfo();

  return (
    <AppEmptyState emptyStateImg={emptyStateImgUrl} title="Keep tabs on components and activity">
      <EmptyStateBody>
        Monitor your components with pipelines and oversee CI/CD activity.
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

export default PipelineRunEmptyState;
