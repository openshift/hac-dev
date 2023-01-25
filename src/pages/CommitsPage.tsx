import React from 'react';
import { useParams } from 'react-router-dom';
import CommitDetailsView from '../components/Commits/CommitDetailsView';
import NamespacedPage from '../components/NamespacedPage/NamespacedPage';
import { useQuickstartCloseOnUnmount } from '../hooks/useQuickstartCloseOnUnmount';

const CommitsPage = () => {
  useQuickstartCloseOnUnmount();
  const params = useParams();
  const { commitName, appName } = params;

  if (!appName || !commitName) {
    return <>Not found</>;
  }

  return (
    <NamespacedPage>
      <CommitDetailsView commitName={commitName} applicationName={appName} />
    </NamespacedPage>
  );
};

export default CommitsPage;
