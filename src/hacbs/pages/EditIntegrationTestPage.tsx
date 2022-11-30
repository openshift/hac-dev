import React from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import {
  Bullseye,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Spinner,
  Title,
} from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
import NamespacedPage from '../../components/NamespacedPage/NamespacedPage';
import { useNamespace } from '../../utils/namespace-context-utils';
import IntegrationTestView from '../components/IntegrationTestForm/IntegrationTestView';
import { IntegrationTestScenarioGroupVersionKind } from '../models';
import { IntegrationTestScenarioKind } from '../types/coreBuildService';

const IntegrationTestPage: React.FunctionComponent = () => {
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

  return (
    <NamespacedPage>
      <Helmet>
        <title>Edit integration test</title>
      </Helmet>
      {loadErr ? (
        <Bullseye>
          <EmptyState>
            <EmptyStateIcon
              style={{ color: 'var(--pf-global--danger-color--100)' }}
              icon={ExclamationCircleIcon}
            />
            <Title size="lg" headingLevel="h4">
              {`Could not load ${IntegrationTestScenarioGroupVersionKind.kind} named ${name}.`}
            </Title>
            <EmptyStateBody>Not found</EmptyStateBody>
          </EmptyState>
        </Bullseye>
      ) : loaded ? (
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

export default IntegrationTestPage;
