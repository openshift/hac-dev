import * as React from 'react';
import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  DrawerActions,
  DrawerCloseButton,
  DrawerHead,
  DrawerPanelBody,
  Label,
} from '@patternfly/react-core';
import { ServerIcon } from '@patternfly/react-icons/dist/js/icons/server-icon';
import { ElementModel, GraphElement } from '@patternfly/react-topology';
import { EnvironmentKindWithHealthStatus } from '../../../../hooks/useAllApplicationEnvironmentsWithHealthStatus';
import {
  ApplicationEnvironmentStatus,
  getEnvironmentDeploymentStrategyLabel,
} from '../../../../utils/environment-utils';
import {
  EnvironmentType,
  getEnvironmentType,
  getEnvironmentTypeLabel,
} from '../../../Environment/environment-utils';
import { CommitWorkflowNodeModelData } from '../visualization/commit-visualization-types';

export interface EnvironmentSidePanelBodyProps {
  onClose: () => void;
  workflowNode: GraphElement<ElementModel, CommitWorkflowNodeModelData>;
}

const EnvironmentSidePanel: React.FC<EnvironmentSidePanelBodyProps> = ({
  workflowNode,
  onClose,
}) => {
  const workflowData = workflowNode.getData();
  const environment = workflowData.resource as EnvironmentKindWithHealthStatus;
  const environmentType = getEnvironmentType(environment);

  if (!environment) {
    return null;
  }

  return (
    <>
      <div className="commit-side-panel__head">
        <DrawerHead data-testid="env-side-panel-head">
          <span className="commit-side-panel__head-title">
            {environment.spec?.displayName ?? environment.metadata.name}
          </span>
          <span className="pf-v5-u-mt-xs commit-side-panel__subtext">
            <ServerIcon /> Environment
          </span>
          <DrawerActions>
            <DrawerCloseButton onClick={onClose} />
          </DrawerActions>
        </DrawerHead>
        <DrawerPanelBody data-testid="env-side-panel-body">
          <DescriptionList
            data-test="pipeline-run-details"
            columnModifier={{
              default: '1Col',
            }}
          >
            <DescriptionListGroup>
              <DescriptionListDescription>
                <Label
                  color={
                    environmentType === EnvironmentType.managed
                      ? 'green'
                      : environmentType === EnvironmentType.static
                      ? 'gold'
                      : 'cyan'
                  }
                >
                  {getEnvironmentTypeLabel(environmentType)}
                </Label>
              </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>Deployment strategy</DescriptionListTerm>
              <DescriptionListDescription>
                <Label>{getEnvironmentDeploymentStrategyLabel(environment)}</Label>
              </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <ApplicationEnvironmentStatus environment={environment} />
            </DescriptionListGroup>
          </DescriptionList>
        </DrawerPanelBody>
      </div>
    </>
  );
};

export default EnvironmentSidePanel;
