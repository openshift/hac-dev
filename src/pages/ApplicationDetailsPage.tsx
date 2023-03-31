import React from 'react';
import { useParams } from 'react-router-dom';
import ApplicationDetails from '../components/ApplicationDetails/ApplicationDetails';
import NamespacedPage from '../components/NamespacedPage/NamespacedPage';
import PageAccessCheck from '../components/PageAccess/PageAccessCheck';
import {
  ApplicationModel,
  ComponentModel,
  EnvironmentModel,
  IntegrationTestScenarioModel,
  PipelineRunModel,
  SnapshotEnvironmentBindingModel,
} from '../models';
import { AccessReviewResources } from '../types';

const ApplicationDetailsPage = () => {
  const { appName } = useParams();

  const accessReviewResources: AccessReviewResources = [
    { model: ComponentModel, verb: 'get' },
    { model: ApplicationModel, verb: 'get' },
    { model: PipelineRunModel, verb: 'get' },
    { model: EnvironmentModel, verb: 'get' },
    { model: SnapshotEnvironmentBindingModel, verb: 'get' },
    { model: IntegrationTestScenarioModel, verb: 'get' },
    { model: SnapshotEnvironmentBindingModel, verb: 'get' },
  ];

  return (
    <NamespacedPage>
      <PageAccessCheck accessReviewResources={accessReviewResources}>
        <ApplicationDetails applicationName={appName} />
      </PageAccessCheck>
    </NamespacedPage>
  );
};

export default ApplicationDetailsPage;
