import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import {
  Bullseye,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Spinner,
  Text,
  TextVariants,
  Title,
} from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
import { SearchIcon } from '@patternfly/react-icons/dist/js/icons';
import { useModalLauncher } from '../../../components/modal/ModalProvider';
import { useNamespace } from '../../../utils/namespace-context-utils';
import { IntegrationTestScenarioGroupVersionKind } from '../../models';
import { IntegrationTestScenarioKind } from '../../types/coreBuildService';
import DetailsPage from '../ApplicationDetails/DetailsPage';
import { integrationTestDeleteModalAndNavigate } from '../IntegrationTestsListView/useIntegrationTestActions';
import IntegrationTestOverviewTab from './tabs/IntegrationTestOverviewTab';
import IntegrationTestPipelineRunTab from './tabs/IntegrationTestPipelineRunTab';

type IntegrationTestDetailsViewProps = {
  applicationName: string;
  testName: string;
};

const IntegrationTestDetailsView: React.FC<IntegrationTestDetailsViewProps> = ({
  testName,
  applicationName,
}) => {
  const namespace = useNamespace();
  const showModal = useModalLauncher();
  const navigate = useNavigate();

  const [integrationTest, loaded, loadErr] = useK8sWatchResource<IntegrationTestScenarioKind>({
    groupVersionKind: IntegrationTestScenarioGroupVersionKind,
    isList: false,
    name: testName,
    namespace,
  });

  if (loadErr || (loaded && !integrationTest)) {
    return (
      <Bullseye>
        <EmptyState>
          <EmptyStateIcon
            style={{ color: 'var(--pf-global--danger-color--100)' }}
            icon={loadErr ? ExclamationCircleIcon : SearchIcon}
          />
          <Title size="lg" headingLevel="h4">
            {loadErr
              ? `Could not load ${IntegrationTestScenarioGroupVersionKind.kind}`
              : 'Integration test not found'}
          </Title>
          <EmptyStateBody>{loadErr ? 'Not found' : 'No such Integration test'}</EmptyStateBody>
        </EmptyState>
      </Bullseye>
    );
  }

  if (integrationTest?.metadata) {
    return (
      <DetailsPage
        breadcrumbs={[
          { path: '/app-studio/applications', name: 'Applications' },
          {
            path: `/app-studio/applications/${applicationName}`,
            name: applicationName,
          },
          {
            path: `/app-studio/applications/${applicationName}?activeTab=integrationtests`,
            name: 'Integration tests',
          },
          {
            path: `/app-studio/applications/${applicationName}/test/${testName}`,
            name: integrationTest.metadata.name,
          },
        ]}
        title={
          <Text component={TextVariants.h2}>
            <b data-test="test-name">{integrationTest.metadata.name}</b>
          </Text>
        }
        actions={[
          {
            key: 'edit',
            label: 'Edit',
            component: <Link to={`/app-studio/integration-test/${testName}/edit`}>Edit</Link>,
          },
          {
            onClick: () =>
              showModal<{ submitClicked: boolean }>(
                integrationTestDeleteModalAndNavigate(integrationTest),
              ).closed.then(({ submitClicked }) => {
                if (submitClicked)
                  navigate(
                    `/app-studio/applications/${applicationName}?activeTab=integrationtests`,
                  );
              }),
            key: `delete-${integrationTest.metadata.name.toLowerCase()}`,
            label: 'Delete',
          },
        ]}
        tabs={[
          {
            key: 'overview',
            label: 'Overview',
            isFilled: true,
            component: <IntegrationTestOverviewTab integrationTest={integrationTest} />,
          },
          {
            key: 'pipelineruns',
            label: 'Pipeline runs',
            component: (
              <IntegrationTestPipelineRunTab
                applicationName={integrationTest.spec.application}
                testName={integrationTest.metadata.name}
              />
            ),
          },
        ]}
      />
    );
  }

  return (
    <Bullseye>
      <Spinner data-test="spinner" />
    </Bullseye>
  );
};

export default IntegrationTestDetailsView;
