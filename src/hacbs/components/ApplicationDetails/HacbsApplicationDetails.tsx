import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { Bullseye, Spinner } from '@patternfly/react-core';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { useModalLauncher } from '../../../components/modal/ModalProvider';
import { applicationDeleteModal } from '../../../components/modal/resource-modals';
import { ApplicationGroupVersionKind } from '../../../models';
import { ApplicationKind } from '../../../types';
import { useNamespace } from '../../../utils/namespace-context-utils';
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

  useEffect(() => {
    const hacbsShowAppQs = localStorage.getItem('hacbs/showApplicationQuickstart');
    if (hacbsShowAppQs === null) {
      localStorage.setItem('hacbs/showApplicationQuickstart', 'false');
      // TODO Need to revisit once we have ability to add new quickstarts to an existing chrome store
      // See https://issues.redhat.com/browse/RHCLOUD-20677
      quickStarts.set('hac-dev', [applicationQuickstartContent]);
      quickStarts.toggle('hacbs-getting-started-app');
    }
    // dependencies not needed since we only want to run once when component mounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            key: 'add-component',
            label: 'Add component',
            component: (
              <Link to={`/app-studio/import?application=${applicationName}`}>Add component</Link>
            ),
          },
          {
            key: 'add-integration-test',
            label: 'Add integration test',
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
            type: 'separator',
            key: 'separator',
            label: '',
          },
          {
            key: 'application-quickstart',
            label: 'Getting started with an app',
            onClick: () => {
              quickStarts.set('hac-dev', [applicationQuickstartContent]);
              quickStarts.toggle('hacbs-getting-started-app');
            },
          },
          {
            key: 'learning-resources',
            label: 'Learning resources',
            href: '',
            isDisabled: true,
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
            component: <EnvironmentsTab />,
          },
        ]}
      />
    </React.Fragment>
  );
};

export default HacbsApplicationDetails;
