import * as React from 'react';
import AppBanner from '../../AppBanner';
import { useK8sWatchResource } from '../../dynamic-plugin-sdk';
import { useActiveNamespace } from '../../hooks/useActiveNamespace';
import { ApplicationGroupVersionKind } from '../../models';
import { useQueryParams, Page } from '../../shared';
import { StatusBox } from '../../shared/components/status-box/StatusBox';
import { ApplicationKind } from '../../types';
import { ComponentListViewPage } from './ComponentListViewPage';

import '../../App.scss';
import '../../shared/style.scss';

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
      <AppBanner />
      <StatusBox data={application} loaded={loaded}>
        <Page
          breadcrumbs={[
            { path: `?${queryParams.toString()}`, name: 'Workspaces' },
            { path: `?${queryParams.toString()}`, name: 'Purple_workspace' },
            { path: `?${queryParams.toString()}`, name: application?.spec?.displayName },
          ]}
          heading={application?.spec?.displayName}
        >
          <ComponentListViewPage application={applicationName} />
        </Page>
      </StatusBox>
    </React.Fragment>
  );
};

export default ComponentListView;
