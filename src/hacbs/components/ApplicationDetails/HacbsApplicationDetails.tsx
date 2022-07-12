import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { Bullseye, Spinner } from '@patternfly/react-core';
import { NamespaceContext } from '../../../components/NamespacedPage/NamespacedPage';
import { ApplicationGroupVersionKind } from '../../../models';
import { ApplicationKind } from '../../../types';
import DetailsPage from './DetailsPage';
import ApplicationOverviewTab from './tabs/ApplicationOverviewTab';
import CommitsTab from './tabs/CommitsTab';
import ComponentsTab from './tabs/ComponentsTab';
import EnvironmentsTab from './tabs/EnvironmentsTab';
import PipelineRunsTab from './tabs/PipelineRunsTab';

type HacbsApplicationDetailsProps = {
  applicationName: string;
};

const HacbsApplicationDetails: React.FC<HacbsApplicationDetailsProps> = ({ applicationName }) => {
  const { namespace } = React.useContext(NamespaceContext);
  const navigate = useNavigate();
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
            type: 'seperator',
            key: 'seperator',
            label: '',
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
