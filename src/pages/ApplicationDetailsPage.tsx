import React from 'react';
import { useParams } from 'react-router-dom';
import ApplicationDetails from '../components/ApplicationDetails/ApplicationDetails';
import NamespacedPage from '../components/NamespacedPage/NamespacedPage';

const ApplicationDetailsPage = () => {
  const { appName } = useParams();

  return (
    <NamespacedPage>
      <ApplicationDetails applicationName={appName} />
    </NamespacedPage>
  );
};

export default ApplicationDetailsPage;
