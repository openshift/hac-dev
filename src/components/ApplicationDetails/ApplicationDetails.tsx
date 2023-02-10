import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFeatureFlag } from '@openshift/dynamic-plugin-sdk';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { Badge, BreadcrumbItem, Bullseye, Spinner } from '@patternfly/react-core';
import styles from '@patternfly/react-styles/css/components/Breadcrumb/breadcrumb';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { ApplicationGroupVersionKind } from '../../models';
import { HttpError } from '../../shared/utils/error/http-error';
import { ApplicationKind } from '../../types';
import { MVP_FLAG } from '../../utils/flag-utils';
import { useNamespace } from '../../utils/namespace-context-utils';
import { useWorkspace } from '../../utils/workspace-context-utils';
import { ActivityTab } from '../Activity/ActivityTab';
import { createCustomizeAllPipelinesModalLauncher } from '../CustomizedPipeline/CustomizePipelinesModal';
import ErrorEmptyState from '../EmptyState/ErrorEmptyState';
import { useModalLauncher } from '../modal/ModalProvider';
import { applicationDeleteModal } from '../modal/resource-modals';
import { ApplicationHeader } from './ApplicationHeader';
import ApplicationModal, { HACBS_APPLICATION_MODAL_HIDE_KEY } from './ApplicationModal';
import { applicationQuickstartContent } from './ApplicationQuickstartContent';
import { ApplicationSwitcher } from './ApplicationSwitcher';
import DetailsPage from './DetailsPage';
import ApplicationOverviewTab from './tabs/ApplicationOverviewTab';
import ComponentsTab from './tabs/ComponentsTab';
import EnvironmentsTab from './tabs/EnvironmentsTab';
import IntegrationTestsTab from './tabs/IntegrationTestsTab';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';

import './ApplicationDetails.scss';

type HacbsApplicationDetailsProps = {
  applicationName: string;
};

const ApplicationDetails: React.FC<HacbsApplicationDetailsProps> = ({ applicationName }) => {
  const [showApplicationModal, setShowApplicationModal] = React.useState<boolean>(
    window.localStorage.getItem(HACBS_APPLICATION_MODAL_HIDE_KEY) !== 'true',
  );

  const onModalClose = () => {
    setShowApplicationModal(false);
    localStorage.setItem(HACBS_APPLICATION_MODAL_HIDE_KEY, 'true');
  };

  const namespace = useNamespace();
  const workspace = useWorkspace();
  const navigate = useNavigate();
  const { quickStarts } = useChrome();
  const showModal = useModalLauncher();
  const [mvpFeature] = useFeatureFlag(MVP_FLAG);

  const [application, applicationLoaded, applicationError] = useK8sWatchResource<ApplicationKind>({
    groupVersionKind: ApplicationGroupVersionKind,
    name: applicationName,
    namespace,
  });

  const appDisplayName = application?.spec?.displayName || application?.metadata?.name || '';

  if (applicationError) {
    const appError = HttpError.fromCode((applicationError as any).code);
    return (
      <ErrorEmptyState
        httpError={appError}
        title={`Unable to load application ${appDisplayName}`}
        body={appError.message}
      />
    );
  }
  const loading = (
    <Bullseye>
      <Spinner data-test="spinner" />
    </Bullseye>
  );

  if (!applicationLoaded) {
    return loading;
  }

  return (
    <React.Fragment>
      <ApplicationModal showApplicationModal={showApplicationModal} onClose={onModalClose} />
      <DetailsPage
        data-test="application-details-test-id"
        headTitle={appDisplayName}
        breadcrumbs={[
          <Badge key="badge" isRead>
            WS
          </Badge>,
          <span key="badge-divider" className={styles.breadcrumbItemDivider} />,
          <BreadcrumbItem key="workspace-link" to="#">
            <Link className="pf-c-breadcrumb__link" to="#">
              {workspace}
            </Link>
          </BreadcrumbItem>,
          <WorkspaceSwitcher key="workspace" />,
          <span key="workspace-divider" className={styles.breadcrumbItemDivider}>
            |
          </span>,
          <BreadcrumbItem key="app-link">
            <Link
              className="pf-c-breadcrumb__link"
              to={`/stonesoup/workspaces/${workspace}/applications`}
            >
              Applications
            </Link>
          </BreadcrumbItem>,
          {
            path: '',
            name: appDisplayName,
          },
          <ApplicationSwitcher key="app" selectedApplication={application.metadata.name} />,
        ]}
        title={<ApplicationHeader application={application} />}
        actions={[
          {
            onClick: () =>
              showModal(createCustomizeAllPipelinesModalLauncher(applicationName, namespace)),
            key: 'customize-build-pipelines',
            label: 'Customize build pipelines',
          },
          ...(!mvpFeature
            ? [
                {
                  type: 'section-label',
                  key: 'add',
                  label: 'Add',
                },
              ]
            : []),
          {
            key: 'add-component',
            label: 'Add component',
            component: (
              <Link
                to={`/stonesoup/workspaces/${workspace}/applications/import?application=${applicationName}`}
              >
                Add component
              </Link>
            ),
          },
          {
            key: 'add-integration-test',
            label: 'Add integration test',
            component: (
              <Link
                to={`/stonesoup/workspaces/${workspace}/applications/${applicationName}/integrationtests/add`}
              >
                Add integration test
              </Link>
            ),
            isDisabled: false,
            hidden: mvpFeature,
          },
          {
            key: 'create-environment',
            label: 'Create environment',
            component: (
              <Link to={`/stonesoup/workspaces/${workspace}/workspace-settings/environment/create`}>
                Create environment
              </Link>
            ),
            hidden: mvpFeature,
          },
          {
            key: 'application-quickstart',
            label: 'Getting started with an application',
            onClick: () => {
              quickStarts.set('hac-dev', [applicationQuickstartContent]);
              quickStarts.toggle('hacbs-getting-started-app');
            },
            hidden: mvpFeature,
          },
          ...(!mvpFeature
            ? [
                {
                  type: 'separator',
                  key: 'delete-separator',
                  label: '',
                },
              ]
            : []),
          {
            key: 'delete-application',
            label: 'Delete application',
            onClick: () =>
              showModal<{ submitClicked: boolean }>(
                applicationDeleteModal(application),
              ).closed.then(({ submitClicked }) => {
                if (submitClicked) navigate('/stonesoup');
              }),
          },
        ]}
        baseURL={`/stonesoup/workspaces/${workspace}/applications/${applicationName}`}
        tabs={[
          {
            key: 'overview',
            label: 'Overview',
            isFilled: true,
            component: <ApplicationOverviewTab applicationName={applicationName} />,
          },
          {
            key: 'activity',
            label: 'Activity',
            isFilled: true,
            className: 'application-details__activity',
            component: <ActivityTab applicationName={applicationName} />,
          },
          {
            key: 'components',
            label: 'Components',
            isFilled: true,
            component: <ComponentsTab applicationName={applicationName} />,
          },

          ...(mvpFeature
            ? []
            : [
                {
                  key: 'integrationtests',
                  label: 'Integration tests',
                  component: <IntegrationTestsTab applicationName={applicationName} />,
                },
              ]),

          {
            key: 'environments',
            label: 'Environments',
            component: <EnvironmentsTab applicationName={applicationName} />,
          },
        ]}
      />
    </React.Fragment>
  );
};

export default ApplicationDetails;
