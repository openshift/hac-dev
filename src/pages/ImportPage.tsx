import React from 'react';
import ImportForm from '../components/ImportForm/ImportForm';
import NamespacedPage from '../components/NamespacedPage/NamespacedPage';
import PageLayout from '../components/PageLayout/PageLayout';
import { useQuickstartCloseOnUnmount } from '../hooks/useQuickstartCloseOnUnmount';
import { getQueryArgument } from '../shared/utils';
import { useWorkspaceInfo } from '../utils/workspace-context-utils';

const ImportPage: React.FunctionComponent = () => {
  useQuickstartCloseOnUnmount();

  const { workspace } = useWorkspaceInfo();
  const applicationName = getQueryArgument('application');

  const title = applicationName ? 'Add component' : 'Create application';

  return (
    <NamespacedPage>
      <PageLayout
        breadcrumbs={[
          { path: `/stonesoup/workspaces/${workspace}/applications`, name: 'Applications' },
          { path: '#', name: 'Import' },
        ]}
        title={title}
      >
        <ImportForm applicationName={applicationName} />
      </PageLayout>
    </NamespacedPage>
  );
};

export default ImportPage;
