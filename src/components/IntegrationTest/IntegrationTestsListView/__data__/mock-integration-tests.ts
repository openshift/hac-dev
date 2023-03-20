import { IntegrationTestScenarioKind } from '../../../../types/coreBuildService';
import { IntegrationTestLabels } from '../../IntegrationTestForm/types';

export const MockIntegrationTests: IntegrationTestScenarioKind[] = [
  {
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    kind: 'IntegrationTestScenario',
    metadata: {
      labels: {
        [IntegrationTestLabels.OPTIONAL]: 'true',
      },
      annotations: {
        'app.kubernetes.io/display-name': 'Test 1',
      },
      name: 'test-app-test-1',
      namespace: 'test-namespace',
      uid: 'ed722704-74bc-4152-b27b-bee29cc7bfd2',
    },
    spec: {
      application: 'test-app',
      bundle: 'quay.io/test-rep/test-bundle:test-1',
      resolverRef: { type: 'git', params: { url: 'test', revision: '1', path: '' } },
      contexts: [
        {
          description: 'Application testing 1',
          name: 'application',
        },
      ],
      pipeline: 'pipeline-1',
    },
  },
  {
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    kind: 'IntegrationTestScenario',
    metadata: {
      annotations: {
        'app.kubernetes.io/display-name': 'Test 2',
      },
      name: 'test-app-test-2',
      namespace: 'test-namespace',
      uid: 'ed722704-74bc-4152-b27b-bee29cc7bfd3',
    },
    spec: {
      resolverRef: { type: 'git', params: { url: 'test', revision: '1', path: '' } },
      application: 'test-app',
      bundle: 'quay.io/test-rep/test-bundle:test-2',
      contexts: [
        {
          description: 'Application testing 2',
          name: 'application',
        },
      ],
      pipeline: 'pipeline-2',
    },
  },
];
