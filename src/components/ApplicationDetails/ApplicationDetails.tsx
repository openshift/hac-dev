import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useFeatureFlag } from '@openshift/dynamic-plugin-sdk';
import { Bullseye, Spinner } from '@patternfly/react-core';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { useApplication } from '../../hooks/useApplications';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import {
  ApplicationModel,
  ComponentModel,
  EnvironmentModel,
  IntegrationTestScenarioModel,
} from '../../models';
import { HttpError } from '../../shared/utils/error/http-error';
import { useTrackEvent, TrackEvents } from '../../utils/analytics';
import { useApplicationBreadcrumbs } from '../../utils/breadcrumb-utils';
import { MVP_FLAG } from '../../utils/flag-utils';
import { useAccessReviewForModel } from '../../utils/rbac';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';
import { ACTIVITY_SECONDARY_TAB_KEY, ActivityTab } from '../Activity/ActivityTab';
import { createCustomizeAllPipelinesModalLauncher } from '../CustomizedPipeline/CustomizePipelinesModal';
import ErrorEmptyState from '../EmptyState/ErrorEmptyState';
import { useModalLauncher } from '../modal/ModalProvider';
import { applicationDeleteModal } from '../modal/resource-modals';
import { ApplicationHeader } from './ApplicationHeader';
import { applicationQuickstartContent } from './ApplicationQuickstartContent';
import DetailsPage from './DetailsPage';
import ApplicationOverviewTab from './tabs/ApplicationOverviewTab';
import ComponentsTab from './tabs/ComponentsTab';
import EnvironmentsTab from './tabs/EnvironmentsTab';
import IntegrationTestsTab from './tabs/IntegrationTestsTab';

import './ApplicationDetails.scss';

type HacbsApplicationDetailsProps = {
  applicationName: string;
};

const ApplicationDetails: React.FC<HacbsApplicationDetailsProps> = ({ applicationName }) => {
  const track = useTrackEvent();
  const { namespace, workspace } = useWorkspaceInfo();
  const [canCreateComponent] = useAccessReviewForModel(ComponentModel, 'create');
  const [canCreateEnvironment] = useAccessReviewForModel(EnvironmentModel, 'create');
  const [canCreateIntegrationTest] = useAccessReviewForModel(
    IntegrationTestScenarioModel,
    'create',
  );
  const [canDeleteApplication] = useAccessReviewForModel(ApplicationModel, 'delete');
  const { activity: subTab } = useParams();
  const [lastActivitySubTab] = useLocalStorage<string>(ACTIVITY_SECONDARY_TAB_KEY);
  const activitySubTab = subTab || lastActivitySubTab || 'latest-commits';

  const navigate = useNavigate();
  const { quickStarts } = useChrome();
  const showModal = useModalLauncher();
  const [mvpFeature] = useFeatureFlag(MVP_FLAG);

  const [application, applicationLoaded, applicationError] = useApplication(
    namespace,
    applicationName,
  );

  const appDisplayName = application?.spec?.displayName || application?.metadata?.name || '';
  const applicationBreadcrumbs = useApplicationBreadcrumbs(appDisplayName, false);

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
      <DetailsPage
        data-test="application-details-test-id"
        headTitle={appDisplayName}
        breadcrumbs={applicationBreadcrumbs}
        title={<ApplicationHeader application={application} />}
        actions={[
          {
            onClick: () => {
              track(TrackEvents.ButtonClicked, {
                link_name: 'manage-build-pipelines',
                link_location: 'application-actions',
                app_name: applicationName,
                workspace,
              });
              showModal(createCustomizeAllPipelinesModalLauncher(applicationName, namespace));
            },
            key: 'manage-build-pipelines',
            label: 'Manage build pipelines',
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
                to={`/application-pipeline/workspaces/${workspace}/import?application=${applicationName}`}
                onClick={() => {
                  track(TrackEvents.ButtonClicked, {
                    link_name: 'add-component',
                    link_location: 'application-details-actions',
                    app_name: applicationName,
                    workspace,
                  });
                }}
              >
                Add component
              </Link>
            ),
            isDisabled: !canCreateComponent,
            disabledTooltip: "You don't have access to add a component",
          },
          {
            key: 'add-integration-test',
            label: 'Add integration test',
            component: (
              <Link
                to={`/application-pipeline/workspaces/${workspace}/applications/${applicationName}/integrationtests/add`}
                onClick={() => {
                  track(TrackEvents.ButtonClicked, {
                    link_name: 'add-integration-test',
                    link_location: 'application-details-actions',
                    app_name: applicationName,
                    workspace,
                  });
                }}
              >
                Add integration test
              </Link>
            ),
            isDisabled: !canCreateIntegrationTest,
            disabledTooltip: "You don't have access to add an integration test",
          },
          {
            key: 'create-environment',
            label: 'Create environment',
            component: (
              <Link
                to={`/application-pipeline/workspaces/${workspace}/workspace-settings/environment/create`}
                onClick={() => {
                  track(TrackEvents.ButtonClicked, {
                    link_name: 'add-environment',
                    link_location: 'application-details-actions',
                    app_name: applicationName,
                    workspace,
                  });
                }}
              >
                Create environment
              </Link>
            ),
            hidden: mvpFeature,
            isDisabled: !canCreateEnvironment,
            disabledTooltip: "You don't have access to create an environment",
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
                if (submitClicked) navigate('/application-pipeline/workspaces');
              }),
            isDisabled: !canDeleteApplication,
            disabledTooltip: "You don't have access to delete this application",
          },
        ]}
        baseURL={`/application-pipeline/workspaces/${workspace}/applications/${applicationName}`}
        tabs={[
          {
            key: 'overview',
            label: 'Overview',
            isFilled: true,
            component: <ApplicationOverviewTab applicationName={applicationName} />,
          },
          {
            key: `activity/${activitySubTab}`,
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
          {
            key: 'integrationtests',
            label: 'Integration tests',
            component: <IntegrationTestsTab applicationName={applicationName} />,
          },
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
