import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { Bullseye, Flex, FlexItem, Spinner, Text, Tooltip } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons/dist/esm/icons/external-link-alt-icon';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { useGitOpsDeploymentCR } from '../../hooks/useGitOpsDeploymentCR';
import { ApplicationGroupVersionKind } from '../../models';
import ExternalLink from '../../shared/components/links/ExternalLink';
import { ApplicationKind } from '../../types';
import { getGitOpsDeploymentHealthStatusIcon } from '../../utils/gitops-utils';
import { useNamespace } from '../../utils/namespace-context-utils';
import { useModalLauncher } from '../modal/ModalProvider';
import { applicationDeleteModal } from '../modal/resource-modals';
import ApplicationModal, { HACBS_APPLICATION_MODAL_HIDE_KEY } from './ApplicationModal';
import { applicationQuickstartContent } from './ApplicationQuickstartContent';
import DetailsPage from './DetailsPage';
import ApplicationOverviewTab from './tabs/ApplicationOverviewTab';
import CommitsTab from './tabs/CommitsTab';
import ComponentsTab from './tabs/ComponentsTab';
import EnvironmentsTab from './tabs/EnvironmentsTab';
import IntegrationTestsTab from './tabs/IntegrationTestsTab';
import PipelineRunsTab from './tabs/PipelineRunsTab';

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
        actions={[
          {
            key: 'promote-app',
            label: 'Promote application',
            component: (
              <Link to={`/stonesoup/import?application=${applicationName}`}>
                Promote Application
              </Link>
            ),
          },
          {
            type: 'section-label',
            key: 'add',
            label: 'Add',
          },
          {
            type: 'separator',
            key: 'separator',
            label: '',
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
          },
          {
            key: 'create-environment',
            label: 'Create environment',
            component: (
              <Link to="/stonesoup/workspace-settings/environment/create">Create environment</Link>
            ),
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
          {
            type: 'section-label',
            key: 'help',
            label: 'Help',
          },
          {
            type: 'separator',
            key: 'separator',
            label: '',
          },
          {
            key: 'application-quickstart',
            label: 'Getting started with an application',
            onClick: () => {
              quickStarts.set('hac-dev', [applicationQuickstartContent]);
              quickStarts.toggle('hacbs-getting-started-app');
            },
          },
          {
            key: 'explore-documentation',
            label: (
              <ExternalLink href="https://red-hat-hybrid-application-cloud-build-services-documentation.pages.redhat.com/hacbs-documentation">
                Explore Documentation <ExternalLinkAltIcon />
              </ExternalLink>
            ),
          },

          {
            type: 'separator',
            key: 'separator',
            label: '',
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
        tabs={[
          {
            key: 'overview',
            label: 'Overview',
            isFilled: true,
            component: <ApplicationOverviewTab applicationName={applicationName} />,
          },
          {
            key: 'components',
            label: 'Components',
            isFilled: true,
            component: <ComponentsTab applicationName={applicationName} namespace={namespace} />,
          },
          {
            key: 'commits',
            label: 'Commits',
            component: <CommitsTab applicationName={applicationName} />,
          },
          {
            key: 'pipelineruns',
            label: 'Pipeline runs',
            component: <PipelineRunsTab applicationName={applicationName} />,
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
