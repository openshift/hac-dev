import React from 'react';
import { Link } from 'react-router-dom';
import { EmptyStateBody, EmptyStateSecondaryActions } from '@patternfly/react-core';
import emptyStateImgUrl from '../../../imgs/Commit.svg';
import { ComponentModel } from '../../../models';
import { useAccessReviewForModel } from '../../../utils/rbac';
import { useWorkspaceInfo } from '../../../utils/workspace-context-utils';
import { ButtonWithAccessTooltip } from '../../ButtonWithAccessTooltip';
import AppEmptyState from '../../EmptyState/AppEmptyState';

type SnapshotComponentsEmptyStateProps = {
  applicationName: string;
};

const SnapshotComponentsEmptyState: React.FC<SnapshotComponentsEmptyStateProps> = ({
  applicationName,
}) => {
  const { workspace } = useWorkspaceInfo();
  const [canCreateComponent] = useAccessReviewForModel(ComponentModel, 'create');

  return (
    <AppEmptyState emptyStateImg={emptyStateImgUrl} title="Component builds in this snapshots">
      <EmptyStateBody>
        No components found attached to this snapshot
        <br />
        To get started, add a component and merge its pull request for a build pipeline.
      </EmptyStateBody>
      <EmptyStateSecondaryActions>
        <ButtonWithAccessTooltip
          component={(props) => (
            <Link
              {...props}
              to={`/application-pipeline/workspaces/${workspace}/import?application=${applicationName}`}
            />
          )}
          variant="secondary"
          isDisabled={!canCreateComponent}
          tooltip="You don't have access to add a component"
          analytics={{
            link_name: 'add-component',
            link_location: 'commits-empty-state',
            app_name: applicationName,
            workspace,
          }}
        >
          Add component
        </ButtonWithAccessTooltip>
      </EmptyStateSecondaryActions>
    </AppEmptyState>
  );
};

export default SnapshotComponentsEmptyState;
