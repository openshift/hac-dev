import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { Bullseye, Spinner } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons/dist/esm/icons/external-link-alt-icon';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { useModalLauncher } from '../../../components/modal/ModalProvider';
import { applicationDeleteModal } from '../../../components/modal/resource-modals';
import { ApplicationGroupVersionKind } from '../../../models';
import ExternalLink from '../../../shared/components/links/ExternalLink';
import { ApplicationKind } from '../../../types';
import { useNamespace } from '../../../utils/namespace-context-utils';
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

const HacbsApplicationDetails: React.FC<HacbsApplicationDetailsProps> = ({ applicationName }) => {
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
          { path: '/app-studio/applications', name: 'Applications' },
          {
            path: `/app-studio/applications/${applicationName}`,
            name: appDisplayName,
          },
        ]}
        title={appDisplayName}
        actions={[
          {
            key: 'promote-app',
            label: 'Promote application',
            component: (
              <Link to={`/app-studio/import?application=${applicationName}`}>
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
              <Link to={`/app-studio/import?application=${applicationName}`}>Add component</Link>
            ),
          },
          {
            key: 'add-integration-test',
            label: 'Add integration tests',
            component: (
              <Link to={`/app-studio/applications/${applicationName}/integration-test`}>
                Add integration test
              </Link>
            ),
            isDisabled: false,
          },
          {
            key: 'create-environment',
            label: 'Create environment',
            component: (
              <Link to="/app-studio/workspace-settings/environment/create">Create environment</Link>
            ),
          },
          {
            key: 'delete-application',
            label: 'Delete application',
            onClick: () =>
              showModal<{ submitClicked: boolean }>(
                applicationDeleteModal(application),
              ).closed.then(({ submitClicked }) => {
                if (submitClicked) navigate('/app-studio');
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
                if (submitClicked) navigate('/app-studio');
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

export default HacbsApplicationDetails;
