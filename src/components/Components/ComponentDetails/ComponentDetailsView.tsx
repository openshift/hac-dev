import React from 'react';
import {
  Bullseye,
  Button,
  ButtonVariant,
  Spinner,
  Text,
  TextVariants,
} from '@patternfly/react-core';
import { useComponent } from '../../../hooks/useComponents';
import pipelineImg from '../../../imgs/Pipeline.svg';
import { ComponentGroupVersionKind, ComponentModel } from '../../../models';
import DetailsPage, { Action } from '../../../shared/components/details-page/DetailsPage';
import ErrorEmptyState from '../../../shared/components/empty-state/ErrorEmptyState';
import { HttpError } from '../../../shared/utils/error/http-error';
import { useApplicationBreadcrumbs } from '../../../utils/breadcrumb-utils';
import { isPACEnabled, startNewBuild } from '../../../utils/component-utils';
import { useAccessReviewForModel } from '../../../utils/rbac';
import { useWorkspaceInfo } from '../../../utils/workspace-context-utils';
import { createCustomizeAllPipelinesModalLauncher } from '../../CustomizedPipeline/CustomizePipelinesModal';
import { GettingStartedCard } from '../../GettingStartedCard/GettingStartedCard';
import { useModalLauncher } from '../../modal/ModalProvider';
import { componentDeleteModal } from '../../modal/resource-modals';
import { ComponentActivityTab } from './tabs/ComponentActivityTab';
import ComponentDetailsTab from './tabs/ComponentDetailsTab';

import './ComponentDetailsView.scss';

type ComponentDetailsViewProps = {
  applicationName: string;
  componentName: string;
};

export const COMPONENTS_GS_LOCAL_STORAGE_KEY = 'components-getting-started-modal';

const ComponentDetailsView: React.FC<ComponentDetailsViewProps> = ({
  componentName,
  applicationName,
}) => {
  const { namespace, workspace } = useWorkspaceInfo();
  const applicationBreadcrumbs = useApplicationBreadcrumbs();
  const showModal = useModalLauncher();
  const [component, loaded, componentError] = useComponent(namespace, componentName);
  const [canPatchComponent] = useAccessReviewForModel(ComponentModel, 'patch');
  const [canDeleteComponent] = useAccessReviewForModel(ComponentModel, 'delete');

  const actions: Action[] = React.useMemo(() => {
    if (!loaded || !component || componentError) {
      return [];
    }
    const componentActions: Action[] = [];
    if (!isPACEnabled(component)) {
      componentActions.push({
        onClick: () => startNewBuild(component),
        key: 'rebuild',
        id: 'rebuild',
        label: 'Rebuild',
        disabled: !canPatchComponent,
        disabledTooltip: "You don't have access to rebuild the component",
      });
    }
    componentActions.push({
      onClick: () => showModal(componentDeleteModal(component)),
      key: `delete-${component.metadata.name.toLowerCase()}`,
      id: `delete-${component.metadata.name.toLowerCase()}`,
      label: 'Delete',
      disabled: !canDeleteComponent,
      disabledTooltip: "You don't have access to delete the component",
    });
    return componentActions;
  }, [loaded, component, componentError, canDeleteComponent, canPatchComponent, showModal]);

  if (componentError || (loaded && !component)) {
    return (
      <ErrorEmptyState
        httpError={HttpError.fromCode(componentError ? (componentError as any).code : 404)}
        title={`Could not load ${ComponentGroupVersionKind.kind}`}
        body={(componentError as any)?.message ?? 'Not found'}
      />
    );
  }

  if (!loaded) {
    return (
      <Bullseye>
        <Spinner data-test="spinner" />
      </Bullseye>
    );
  }

  return (
    <>
      <DetailsPage
        data-test="component-details-test-id"
        headTitle={component.spec.componentName}
        preComponent={
          <GettingStartedCard
            imgClassName="component-details__gs-image"
            localStorageKey={COMPONENTS_GS_LOCAL_STORAGE_KEY}
            title="For maximum security, upgrade the build pipeline plans for your component."
            imgSrc={pipelineImg}
            imgAlt="build pipeline plans"
            isLight
          >
            <div>
              Using the Advanced or Custom build pipeline, you can enable all additional tasks for
              added security.
            </div>
            <Button
              className="pf-u-mt-xl"
              variant={ButtonVariant.secondary}
              onClick={() =>
                showModal(createCustomizeAllPipelinesModalLauncher(applicationName, namespace))
              }
            >
              Manage build pipelines
            </Button>
          </GettingStartedCard>
        }
        breadcrumbs={[
          ...applicationBreadcrumbs,
          {
            path: `/application-pipeline/workspaces/${workspace}/applications/${applicationName}/components`,
            name: 'components',
          },
          {
            path: `/application-pipeline/workspaces/${workspace}/applications/${applicationName}/components/${componentName}`,
            name: component.spec.componentName,
          },
        ]}
        title={
          <Text component={TextVariants.h2}>
            <span className="pf-u-mr-sm">
              <b>{component.spec.componentName}</b>
            </span>
          </Text>
        }
        actions={actions}
        baseURL={`/application-pipeline/workspaces/${workspace}/applications/${applicationName}/components/${componentName}`}
        tabs={[
          {
            key: 'details',
            label: 'Component details',
            isFilled: true,
            component: <ComponentDetailsTab component={component} />,
          },
          {
            key: 'activity',
            label: 'Activity',
            component: <ComponentActivityTab component={component} />,
          },
        ]}
      />
    </>
  );
};

export default ComponentDetailsView;
