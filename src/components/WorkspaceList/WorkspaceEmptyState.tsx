import * as React from 'react';
import ErrorEmptyState from '../../shared/components/empty-state/ErrorEmptyState';

const WorkspaceListView: React.FC = () => (
  <ErrorEmptyState title="Unable to load workspaces" body={'Something went wrong'} />
);

export default WorkspaceListView;
