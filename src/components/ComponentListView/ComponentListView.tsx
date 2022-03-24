import * as React from 'react';
import { PageSection } from '@patternfly/react-core';
import { useK8sWatchResource } from '../../dynamic-plugin-sdk';
import { useActiveNamespace } from '../../hooks/useActiveNamespace';
import { ApplicationGroupVersionKind } from '../../models';
import { useQueryParams } from '../../shared';
import { StatusBox } from '../../shared/components/status-box/StatusBox';
import { ApplicationKind } from '../../types';
import PageLayout from '../layout/PageLayout';
import { ComponentListViewPage } from './ComponentListViewPage';

const ComponentListView: React.FC = () => {
  const queryParams = useQueryParams();
  const applicationName = queryParams.get('application');
  const namespace = useActiveNamespace();
  const [application, appLoaded] = useK8sWatchResource<ApplicationKind>({
    groupVersionKind: ApplicationGroupVersionKind,
    name: applicationName,
    namespace,
  });
  const loaded = namespace && appLoaded;

  return (
    <React.Fragment>
      <StatusBox data={application} loaded={loaded}>
        <PageLayout
          breadcrumbs={[
            { path: '/app-studio/applications', name: 'Applications' },
            { path: `?${queryParams.toString()}`, name: application?.spec?.displayName },
          ]}
          title={application?.spec?.displayName}
        >
          <PageSection isFilled>
            <ComponentListViewPage application={applicationName} />
          </PageSection>
        </PageLayout>
      </StatusBox>
    </React.Fragment>
  );
};

export default ComponentListView;
