import React from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import NamespacedPage from '../../components/NamespacedPage/NamespacedPage';
import { useQuickstartCloseOnUnmount } from '../../hooks/useQuickstartCloseOnUnmount';
import CommitDetailsView from '../components/Commits/CommitDetailsView';

const CommitsPage = () => {
  useQuickstartCloseOnUnmount();
  const params = useParams();
  const { commitName, appName } = params;

  if (!appName || !commitName) {
    return <>Not found</>;
  }

  return (
    <NamespacedPage>
      <>
        <Helmet>
          <title>Commit Details</title>
        </Helmet>
        <CommitDetailsView commitName={commitName} applicationName={appName} />
      </>
    </NamespacedPage>
  );
};

export default CommitsPage;
