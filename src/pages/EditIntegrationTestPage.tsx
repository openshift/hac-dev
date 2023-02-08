import React from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { Bullseye, Spinner } from '@patternfly/react-core';
import ErrorEmptyState from '../components/EmptyState/ErrorEmptyState';
import IntegrationTestView from '../components/IntegrationTest/IntegrationTestForm/IntegrationTestView';
import NamespacedPage from '../components/NamespacedPage/NamespacedPage';
import { IntegrationTestScenarioGroupVersionKind } from '../models';
import { HttpError } from '../shared/utils/error/http-error';
import { IntegrationTestScenarioKind } from '../types/coreBuildService';
import { useNamespace } from '../utils/namespace-context-utils';

const EditIntegrationTestPage: React.FunctionComponent = () => {
  const { name } = useParams();

  const namespace = useNamespace();

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

  return (
    <NamespacedPage>
      <Helmet>
        <title>Edit integration test</title>
      </Helmet>
      {loaded ? (
        <IntegrationTestView
          applicationName={integrationTest.spec.application}
          integrationTest={integrationTest}
        />
      ) : (
        <Bullseye>
          <Spinner data-test="spinner" />
        </Bullseye>
      )}
    </NamespacedPage>
  );
};

export default EditIntegrationTestPage;
