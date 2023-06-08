import { IntegrationTestScenarioKind, ResolverType } from '../../../../types/coreBuildService';
import { IntegrationTestLabels } from '../../IntegrationTestForm/types';

export const MockIntegrationTests = [
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
      application: 'test-app',
      bundle: 'https://quay.io/test-rep/test-bundle:test-2',
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

export const MockIntegrationTestsWithBundles: IntegrationTestScenarioKind[] = [
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
      resolverRef: {
        resolver: ResolverType.BUNDLES,
        params: [
          {
            name: 'bundle',
            value: 'quay.io/redhat-appstudio/example-tekton-bundle:integration-pipeline-pass',
          },
          { name: 'name', value: 'integration-pipeline-pass' },
          { name: 'kind', value: 'pipeline' },
        ],
      },
      contexts: [
        {
          description: 'Application testing 1',
          name: 'application',
        },
      ],
    },
  },
];

export const MockIntegrationTestsWithGit: IntegrationTestScenarioKind[] = [
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
      resolverRef: {
        resolver: ResolverType.GIT,
        params: [
          { name: 'url', value: 'https://test-url' },
          { name: 'revision', value: 'main' },
          { name: 'pathInRepo', value: 'test-path' },
        ],
      },
      contexts: [
        {
          description: 'Application testing 1',
          name: 'application',
        },
      ],
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
      application: 'test-app',
      resolverRef: {
        resolver: ResolverType.GIT,
        params: [
          { name: 'url', value: 'test-url2' },
          { name: 'revision', value: 'main2' },
          { name: 'pathInRepo', value: 'test-path2' },
        ],
      },
      contexts: [
        {
          description: 'Application testing 2',
          name: 'application',
        },
      ],
    },
  },
  {
    apiVersion: 'appstudio.redhat.com/v1beta1',
    kind: 'IntegrationTestScenario',
    metadata: {
      creationTimestamp: '2023-04-26T11:16:32Z',
      generation: 1,
      managedFields: [],
      name: 'example-git',
      namespace: 'default',
      resourceVersion: '1031539',
      uid: '19b590b6-c583-4651-8342-a60d98a1bcb1',
    },
    spec: {
      application: 'example-app',
      resolverRef: {
        params: [
          {
            name: 'url',
            value: 'https://github.com/redhat-appstudio/integration-examples.git',
          },
          {
            name: 'revision',
            value: 'main',
          },
          {
            name: 'pathInRepo',
            value: 'pipelines/integration_pipeline_pass.yaml',
          },
        ],
        resolver: ResolverType.GIT,
      },
    },
    status: {
      conditions: [
        {
          lastTransitionTime: '2023-04-26T11:16:32Z',
          message: 'Failed to get application for scenario.',
          reason: 'Invalid',
          status: 'False',
          type: 'IntegrationTestScenarioValid',
        },
      ],
    },
  },
];
