export const mockIntegrationTestScenariosData = [
  {
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    kind: 'IntegrationTestScenario',
    metadata: {
      annotations: {
        'app.kubernetes.io/display-name': 'One more test',
      },
      creationTimestamp: '2022-09-22T12:34:12Z',
      generation: 1,
      managedFields: [
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          fieldsType: 'FieldsV1',
          fieldsV1: {
            'f:metadata': {
              'f:annotations': {
                '.': {},
                'f:app.kubernetes.io/display-name': {},
              },
            },
            'f:spec': {
              '.': {},
              'f:application': {},
              'f:bundle': {},
              'f:contexts': {},
              'f:pipeline': {},
            },
          },
          manager: 'Mozilla',
          operation: 'Update',
          time: '2022-09-22T12:34:12Z',
        },
      ],
      name: 'one-more-test',
      namespace: 'test-ns',
      resourceVersion: '1118784417',
      uid: '2788a8de-133e-4f7a-acae-6ae8444c35b1',
    },
    spec: {
      application: 'test-dev-samples',
      bundle: 'quay.io/test_phillips_18/odh-dashboard:latest',
      contexts: [
        {
          description: 'Application testing',
          name: 'application',
        },
      ],
      pipeline: 'odh-dashboard',
    },
  },
  {
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    kind: 'IntegrationTestScenario',
    metadata: {
      annotations: {
        'app.kubernetes.io/display-name': 'Test again',
      },
      creationTimestamp: '2022-09-22T12:32:40Z',
      generation: 1,
      managedFields: [
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          fieldsType: 'FieldsV1',
          fieldsV1: {
            'f:metadata': {
              'f:annotations': {
                '.': {},
                'f:app.kubernetes.io/display-name': {},
              },
            },
            'f:spec': {
              '.': {},
              'f:application': {},
              'f:bundle': {},
              'f:contexts': {},
              'f:pipeline': {},
            },
          },
          manager: 'Mozilla',
          operation: 'Update',
          time: '2022-09-22T12:32:40Z',
        },
      ],
      name: 'test-again',
      namespace: 'test-ns',
      resourceVersion: '1118777718',
      uid: '4a0a519f-f051-499e-99f5-3e692c86601c',
    },
    spec: {
      application: 'test-dev-samples',
      bundle: 'quay.io/test_phillips_18/odh-dashboard:latest',
      contexts: [
        {
          description: 'Application testing',
          name: 'application',
        },
      ],
      pipeline: 'odh-dashboard',
    },
  },
  {
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    kind: 'IntegrationTestScenario',
    metadata: {
      annotations: {
        'app.kubernetes.io/display-name': 'test some stuff some more',
      },
      creationTimestamp: '2022-09-15T14:06:41Z',
      generation: 1,
      managedFields: [
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          fieldsType: 'FieldsV1',
          fieldsV1: {
            'f:metadata': {
              'f:annotations': {
                '.': {},
                'f:app.kubernetes.io/display-name': {},
              },
            },
            'f:spec': {
              '.': {},
              'f:application': {},
              'f:bundle': {},
              'f:contexts': {},
              'f:pipeline': {},
            },
          },
          manager: 'Mozilla',
          operation: 'Update',
          time: '2022-09-15T14:06:41Z',
        },
      ],
      name: 'test-some-stuff-some-more',
      namespace: 'test-ns',
      resourceVersion: '1089932294',
      uid: '6996ff90-112e-48b1-9ff6-672542e110a9',
    },
    spec: {
      application: 'test-dev-samples',
      bundle: 'quay.io/kpavic/test-bundle:pipeline',
      contexts: [
        {
          description: 'Application testing',
          name: 'application',
        },
      ],
      pipeline: 'demo-pipeline',
    },
  },
  {
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    kind: 'IntegrationTestScenario',
    metadata: {
      annotations: {
        'app.kubernetes.io/display-name': 'Private test',
      },
      creationTimestamp: '2022-09-22T12:29:02Z',
      generation: 1,
      managedFields: [
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          fieldsType: 'FieldsV1',
          fieldsV1: {
            'f:metadata': {
              'f:annotations': {
                '.': {},
                'f:app.kubernetes.io/display-name': {},
              },
            },
            'f:spec': {
              '.': {},
              'f:application': {},
              'f:bundle': {},
              'f:contexts': {},
              'f:pipeline': {},
            },
          },
          manager: 'Mozilla',
          operation: 'Update',
          time: '2022-09-22T12:29:02Z',
        },
      ],
      name: 'private-test',
      namespace: 'test-ns',
      resourceVersion: '1118762046',
      uid: '4bf97ab5-4066-4f64-bc81-3d98fce4341e',
    },
    spec: {
      application: 'test-dev-samples',
      bundle: 'quay.io/test_phillips_18/odh-dashboard:latest',
      contexts: [
        {
          description: 'Application testing',
          name: 'application',
        },
      ],
      pipeline: 'odh-dashboard',
    },
  },
];
