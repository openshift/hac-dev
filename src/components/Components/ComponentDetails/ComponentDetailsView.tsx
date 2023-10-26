import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bullseye,
  Button,
  ButtonVariant,
  Spinner,
  Text,
  TextVariants,
} from '@patternfly/react-core';
import isFunction from 'lodash/isFunction';
import isObject from 'lodash/isObject';
import { useComponent } from '../../../hooks/useComponents';
import pipelineImg from '../../../imgs/Pipeline.svg';
import { ComponentGroupVersionKind } from '../../../models';
import DetailsPage, { Action } from '../../../shared/components/details-page/DetailsPage';
import ErrorEmptyState from '../../../shared/components/empty-state/ErrorEmptyState';
import { HttpError } from '../../../shared/utils/error/http-error';
import { useApplicationBreadcrumbs } from '../../../utils/breadcrumb-utils';
import { useWorkspaceInfo } from '../../../utils/workspace-context-utils';
import { useComponentActions } from '../../ApplicationDetails/component-actions';
import { createCustomizeComponentPipelineModalLauncher } from '../../CustomizedPipeline/CustomizePipelinesModal';
import { GettingStartedCard } from '../../GettingStartedCard/GettingStartedCard';
import { useModalLauncher } from '../../modal/ModalProvider';
import { ComponentActivityTab } from './tabs/ComponentActivityTab';
import { ComponentDeploymentsTab } from './tabs/ComponentDeploymentsTab';
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
  const navigate = useNavigate();
  const { namespace, workspace } = useWorkspaceInfo();
  const applicationBreadcrumbs = useApplicationBreadcrumbs();
  const showModal = useModalLauncher();
  const [component, loaded, componentError] = useComponent(namespace, componentName);

  const componentActions = useComponentActions(loaded ? component : undefined, componentName);
  const actions: Action[] = React.useMemo(
    () =>
      componentActions.map((compAction) => ({
        key: compAction.id,
        label: compAction.label,
        disabled: compAction.disabled,
        disabledTooltip: compAction.disabledTooltip,
        onClick: () => {
          if (isFunction(compAction.cta)) {
            compAction.cta();
          } else if (isObject(compAction.cta)) {
            if (!compAction.cta.external) {
              navigate(compAction.cta.href);
            }
          }
        },
      })),
    [componentActions, navigate],
  );

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
                showModal(
                  createCustomizeComponentPipelineModalLauncher(
                    component.metadata.name,
                    component.metadata.namespace,
                  ),
                )
              }
            >
              Edit build pipeline plan
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
          {
            key: 'deployments',
            label: 'Deployments',
            component: <ComponentDeploymentsTab component={component} />,
          },
        ]}
      />
    </>
  );
};

export default ComponentDetailsView;
