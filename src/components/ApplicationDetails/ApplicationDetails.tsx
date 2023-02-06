import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFeatureFlag } from '@openshift/dynamic-plugin-sdk';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { Bullseye, Flex, FlexItem, Spinner, Text, Tooltip } from '@patternfly/react-core';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { useGitOpsDeploymentCR } from '../../hooks/useGitOpsDeploymentCR';
import { ApplicationGroupVersionKind } from '../../models';
import { ApplicationKind } from '../../types';
import { MVP_FLAG } from '../../utils/flag-utils';
import { getGitOpsDeploymentHealthStatusIcon } from '../../utils/gitops-utils';
import { useNamespace } from '../../utils/namespace-context-utils';
import { ActivityTab } from '../Activity/ActivityTab';
import { createCustomizeAllPipelinesModalLauncher } from '../CustomizedPipeline/CustomizePipelinesModal';
import { useModalLauncher } from '../modal/ModalProvider';
import { applicationDeleteModal } from '../modal/resource-modals';
import ApplicationModal, { HACBS_APPLICATION_MODAL_HIDE_KEY } from './ApplicationModal';
import { applicationQuickstartContent } from './ApplicationQuickstartContent';
import { ApplicationSwitcher } from './ApplicationSwitcher';
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
  const [showApplicationModal, setShowApplicationModal] = React.useState<boolean>(
    window.localStorage.getItem(HACBS_APPLICATION_MODAL_HIDE_KEY) !== 'true',
  );

  const onModalClose = () => {
    setShowApplicationModal(false);
    localStorage.setItem(HACBS_APPLICATION_MODAL_HIDE_KEY, 'true');
  };

  const namespace = useNamespace();
  const navigate = useNavigate();
  const { quickStarts } = useChrome();
  const showModal = useModalLauncher();
  const [mvpFeature] = useFeatureFlag(MVP_FLAG);

  const [gitOpsDeployment, gitOpsDeploymentLoaded] = useGitOpsDeploymentCR(
    applicationName,
    namespace,
  );
  const gitOpsDeploymentHealthStatus = gitOpsDeploymentLoaded
    ? gitOpsDeployment?.status?.health?.status
    : null;
  const gitOpsDeploymentHealthStatusIcon = getGitOpsDeploymentHealthStatusIcon(
    gitOpsDeploymentHealthStatus,
  );

  const [application, applicationsLoaded] = useK8sWatchResource<ApplicationKind>({
    groupVersionKind: ApplicationGroupVersionKind,
    name: applicationName,
    namespace,
  });
  const appDisplayName = application?.spec?.displayName || '';

  const loading = (
    <Bullseye>
      <Spinner data-test="spinner" />
    </Bullseye>
  );

  if (!applicationsLoaded) {
    return loading;
  }

  return (
    <React.Fragment>
      <ApplicationModal showApplicationModal={showApplicationModal} onClose={onModalClose} />
      <DetailsPage
        data-test="application-details-test-id"
        headTitle={appDisplayName}
        breadcrumbs={[
          { path: '/stonesoup/applications', name: 'Applications' },
          {
            path: `/stonesoup/applications/${applicationName}`,
            name: appDisplayName,
          },
        ]}
        title={
          <Flex>
            <FlexItem>
              <Text component="h1" data-test="details__title">
                {appDisplayName}
              </Text>
            </FlexItem>
            <FlexItem>
              <Tooltip content={`Application ${gitOpsDeploymentHealthStatus}`}>
                {gitOpsDeploymentHealthStatusIcon}
              </Tooltip>
            </FlexItem>
          </Flex>
        }
        breadcrumbItems={<ApplicationSwitcher selectedApplication={application.metadata.name} />}
        actions={[
          {
            onClick: () =>
              showModal(createCustomizeAllPipelinesModalLauncher(applicationName, namespace)),
            key: 'customize-build-pipelines',
            label: 'Customize build pipelines',
          },
          {
            type: 'separator',
            key: 'add-separator',
            label: '',
          },
          {
            type: 'section-label',
            key: 'add',
            label: 'Add',
          },
          {
            key: 'add-component',
            label: 'Add components',
            component: (
              <Link to={`/stonesoup/import?application=${applicationName}`}>Add component</Link>
            ),
          },
          {
            key: 'add-integration-test',
            label: 'Add integration tests',
            component: (
              <Link to={`/stonesoup/applications/${applicationName}/integration-test`}>
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
              <Link to="/stonesoup/workspace-settings/environment/create">Create environment</Link>
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
        baseURL={`/stonesoup/applications/${applicationName}`}
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
