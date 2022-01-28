import * as React from 'react';
import { useK8sWatchResource } from '../../dynamic-plugin-sdk';
import { useActiveNamespace } from '../../hooks/useActiveNamespace';
import { ApplicationGroupVersionKind } from '../../models';
import { useQueryParams } from '../../shared';
import { StatusBox } from '../../shared/components/status-box/StatusBox';
import { ApplicationKind } from '../../types';
import { Page } from '.././Page/Page';
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
    <StatusBox data={application} loaded={loaded}>
      <Page
        breadcrumbs={[
          { path: `?${queryParams.toString()}`, name: 'Workspaces' },
          { path: `?${queryParams.toString()}`, name: 'Purple_workspace' },
          { path: `?${queryParams.toString()}`, name: application?.spec.displayName },
        ]}
        heading={application?.spec.displayName}
      >
        <ComponentListViewPage application={applicationName} />
      </Page>
    </StatusBox>
  );
};

export default ComponentListView;
