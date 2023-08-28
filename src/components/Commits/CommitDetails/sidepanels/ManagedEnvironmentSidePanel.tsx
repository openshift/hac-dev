import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  DrawerActions,
  DrawerCloseButton,
  DrawerHead,
  DrawerPanelBody,
} from '@patternfly/react-core';
import { ServerIcon } from '@patternfly/react-icons/dist/js/icons/server-icon';
import { ElementModel, GraphElement } from '@patternfly/react-topology';
import { MANAGED_ENV_DESC } from '../../../../utils/pipeline-utils';
import { useWorkspaceInfo } from '../../../../utils/workspace-context-utils';
import { StatusIconWithTextLabel } from '../../../topology/StatusIcon';
import { CommitWorkflowNodeModelData } from '../visualization/commit-visualization-types';

export interface ManagedEnvironmentSidePanelBodyProps {
  onClose: () => void;
  workflowNode: GraphElement<ElementModel, CommitWorkflowNodeModelData>;
}

const ManagedEnvironmentSidePanel: React.FC<ManagedEnvironmentSidePanelBodyProps> = ({
  workflowNode,
  onClose,
}) => {
  const { workspace } = useWorkspaceInfo();
  const workflowData = workflowNode.getData();
  const managedEnv = workflowData.resource;

  return (
    <>
      <div className="commit-side-panel__head">
        <DrawerHead data-testid="managed-env-side-panel-head">
          <span className="commit-side-panel__head-title">
            {workflowNode ? workflowNode.getLabel() : 'Managed environment'}
            {managedEnv ? <StatusIconWithTextLabel status={workflowNode.getData().status} /> : null}
          </span>
          <span className="pf-v5-u-mt-xs commit-side-panel__subtext">
            <ServerIcon /> Environment
          </span>
          <DrawerActions>
            <DrawerCloseButton onClick={onClose} />
          </DrawerActions>
        </DrawerHead>
        <DrawerPanelBody data-testid="managed-env-side-panel-body">
          <DescriptionList
            data-test="pipeline-run-details"
            columnModifier={{
              default: '1Col',
            }}
          >
            <DescriptionListGroup>
              {!managedEnv ? (
                <DescriptionListTerm>No managed environments yet</DescriptionListTerm>
              ) : null}
              <DescriptionListDescription>{MANAGED_ENV_DESC}</DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListDescription>
                <Link
                  to={`/application-pipeline/workspaces/${workspace}/applications/${workflowData.application}/environments`}
                >
                  View environments
                </Link>
              </DescriptionListDescription>
            </DescriptionListGroup>
          </DescriptionList>
        </DrawerPanelBody>
      </div>
    </>
  );
};

export default ManagedEnvironmentSidePanel;
