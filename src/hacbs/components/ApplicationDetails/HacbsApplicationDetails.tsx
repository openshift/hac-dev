import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { Bullseye, Spinner } from '@patternfly/react-core';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
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
            path: `/app-studio/applications/:${applicationName}`,
            name: appDisplayName,
          },
        ]}
        title={appDisplayName}
        actions={[
          {
            key: 'add-component',
            label: 'Add Component',
            onClick: () => {
              navigate(`/app-studio/import?application=${applicationName}`);
            },
          },
          {
            key: 'add-environment',
            label: 'Add Environement',
            href: '',
            isDisabled: true,
          },
          {
            key: 'add-integration-tests',
            label: 'Add Integration test',
            href: '',
            isDisabled: true,
          },
          {
            key: 'delete-application',
            label: 'Delete Application',
            href: '',
            isDisabled: true,
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
            label: 'Learning Resources',
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
            label: 'Pipelineruns',
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
