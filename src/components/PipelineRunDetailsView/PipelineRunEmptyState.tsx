import * as React from 'react';
import { Link } from 'react-router-dom';
import { EmptyStateBody, EmptyStateActions } from '@patternfly/react-core';
import emptyStateImgUrl from '../../imgs/Pipeline.svg';
import { ComponentModel } from '../../models';
import { useAccessReviewForModel } from '../../utils/rbac';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';
import { ButtonWithAccessTooltip } from '../ButtonWithAccessTooltip';
import AppEmptyState from '../EmptyState/AppEmptyState';

interface PipelineRunEmptyStateProps {
  applicationName: string;
}

const PipelineRunEmptyState: React.FC<PipelineRunEmptyStateProps> = ({ applicationName }) => {
  const { workspace } = useWorkspaceInfo();
  const [canCreateComponent] = useAccessReviewForModel(ComponentModel, 'create');

  return (
    <AppEmptyState emptyStateImg={emptyStateImgUrl} title="Keep tabs on components and activity">
      <EmptyStateBody>
        Monitor your components with pipelines and oversee CI/CD activity.
        <br />
        To get started, add a component and merge its pull request for a build pipeline.
      </EmptyStateBody>
      <EmptyStateActions>
        <ButtonWithAccessTooltip
          component={(props) => (
            <Link
              {...props}
              to={`/application-pipeline/workspaces/${workspace}/import?application=${applicationName}`}
            />
          )}
          variant="secondary"
          isDisabled={!canCreateComponent}
          tooltip="You don't have access to add components"
          analytics={{
            link_name: 'add-component',
            link_location: 'pipeline-run-empty-state',
            app_name: applicationName,
            workspace,
          }}
        >
          Add component
        </ButtonWithAccessTooltip>
      </EmptyStateActions>
    </AppEmptyState>
  );
};

export default PipelineRunEmptyState;
