import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, ButtonVariant } from '@patternfly/react-core';
import DetailsSection from '../../../../shared/components/details-page/DetailsSection';
import { ComponentKind } from '../../../../types';
import { TrackEvents, useTrackEvent } from '../../../../utils/analytics';
import { useWorkspaceInfo } from '../../../../utils/workspace-context-utils';
import { createCustomizeComponentPipelineModalLauncher } from '../../../CustomizedPipeline/CustomizePipelinesModal';
import { useModalLauncher } from '../../../modal/ModalProvider';
import ComponentBuildSettings from './ComponentBuildSettings';
import ComponentDeploymentSettings from './ComponentDeploymentSettings';
import ComponentDetails from './ComponentDetails';
import ComponentLatestBuild from './ComponentLatestBuild';

type ComponentDetailsTabProps = {
  component: ComponentKind;
};

const ComponentDetailsTab: React.FC<ComponentDetailsTabProps> = ({ component }) => {
  const navigate = useNavigate();
  const { appName } = useParams();
  const { workspace } = useWorkspaceInfo();
  const { componentName } = component.spec;
  const track = useTrackEvent();
  const showModal = useModalLauncher();

  const customizePipeline = () => {
    track(TrackEvents.ButtonClicked, {
      link_name: 'manage-build-pipeline',
      link_location: 'component-list-label',
      component_name: component.metadata.name,
      app_name: component.spec.application,
      workspace,
    });
    showModal(
      createCustomizeComponentPipelineModalLauncher(
        component.metadata.name,
        component.metadata.namespace,
      ),
    );
  };

  const editDeploymentSettings = () => {
    navigate(
      `/application-pipeline/workspaces/${workspace}/applications/${appName}/components/${componentName}/deployment-settings`,
    );
  };

  return (
    <div className="component-details">
      <DetailsSection title="Component details">
        <ComponentDetails component={component} />
      </DetailsSection>
      <DetailsSection
        title="Latest build"
        description="All information is based on the latest successful build of this component."
      >
        <ComponentLatestBuild component={component} />
      </DetailsSection>
      <DetailsSection
        title="Build settings"
        description={
          <span>
            Define how to build images from this component.{` `}
            <Button variant={ButtonVariant.link} isInline onClick={customizePipeline}>
              Edit build pipeline plan
            </Button>
          </span>
        }
      >
        <ComponentBuildSettings component={component} />
      </DetailsSection>
      <DetailsSection
        title="Deployment settings"
        description={
          <span>
            These properties are set independently for each environment the component is deployed
            to.{` `}
            <Button variant={ButtonVariant.link} isInline onClick={editDeploymentSettings}>
              Edit deployment settings
            </Button>
          </span>
        }
      >
        <ComponentDeploymentSettings component={component} />
      </DetailsSection>
    </div>
  );
};

export default React.memo(ComponentDetailsTab);
