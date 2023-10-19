import React from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { Bullseye, Spinner } from '@patternfly/react-core';
import IntegrationTestView from '../components/IntegrationTest/IntegrationTestForm/IntegrationTestView';
import NamespacedPage from '../components/NamespacedPage/NamespacedPage';
import PageAccessCheck from '../components/PageAccess/PageAccessCheck';
import { IntegrationTestScenarioGroupVersionKind, IntegrationTestScenarioModel } from '../models';
import ErrorEmptyState from '../shared/components/empty-state/ErrorEmptyState';
import { HttpError } from '../shared/utils/error/http-error';
import { AccessReviewResources } from '../types';
import { IntegrationTestScenarioKind } from '../types/coreBuildService';
import { useWorkspaceInfo } from '../utils/workspace-context-utils';

const EditIntegrationTestPage: React.FunctionComponent<React.PropsWithChildren<unknown>> = () => {
  const { name } = useParams();

  const { namespace } = useWorkspaceInfo();
  const accessReviewResources: AccessReviewResources = [
    { model: IntegrationTestScenarioModel, verb: 'update' },
  ];

  const [integrationTest, loaded, loadErr] = useK8sWatchResource<IntegrationTestScenarioKind>(
    namespace
      ? {
          groupVersionKind: IntegrationTestScenarioGroupVersionKind,
          isList: false,
          name,
          namespace,
        }
      : null,
  );

  if (loadErr) {
    const httpError = HttpError.fromCode((loadErr as any).code);
    return (
      <ErrorEmptyState
        httpError={HttpError.fromCode((loadErr as any).code)}
        title={`Unable to load integration test ${name}`}
        body={httpError.message}
      />
    );
  }

  if (!loaded) {
    return (
      <Bullseye>
        <Spinner data-test="spinner" />
      </Bullseye>
    );
  }

  return (
    <NamespacedPage>
      <Helmet>
        <title>Edit integration test</title>
      </Helmet>
      <PageAccessCheck accessReviewResources={accessReviewResources}>
        <IntegrationTestView
          applicationName={integrationTest?.spec?.application}
          integrationTest={integrationTest}
        />
      </PageAccessCheck>
    </NamespacedPage>
  );
};

export default EditIntegrationTestPage;
