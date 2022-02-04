import * as React from 'react';
import { useQueryParams } from '../../shared';
import DetailsPage from '../../shared/components/details-page/DetailsPage';
import ApplicationList from '../ApplicationListView/ApplicationList';
import WorkspaceDetailsPage from './WorkspaceDetailsPage';

const WorkspaceView: React.FC = () => {
  const queryParams = useQueryParams();
  const workspaceName = queryParams.get('workspace');
  return (
    <DetailsPage
      pageHeading={workspaceName}
      tabs={[
        { name: 'Details', component: <WorkspaceDetailsPage /> },
        { name: 'Applications', component: <ApplicationList /> },
      ]}
    />
  );
};

export default WorkspaceView;
