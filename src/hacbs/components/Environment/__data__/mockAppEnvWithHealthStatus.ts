export const mockAppEnvWithHealthStatus = [
  {
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    kind: 'Environment',
    metadata: {
      creationTimestamp: '2022-09-15T18:07:55Z',
      generation: 1,
      managedFields: [
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          fieldsType: 'FieldsV1',
          fieldsV1: {
            'f:spec': {
              '.': {},
              'f:deploymentStrategy': {},
              'f:displayName': {},
              'f:type': {},
            },
          },
          manager: 'Mozilla',
          operation: 'Update',
          time: '2022-09-15T18:07:55Z',
        },
      ],
      name: 'development',
      namespace: 'jephilli',
      resourceVersion: '1090586556',
      uid: '59fc1b40-a230-42b1-87fe-f7984ce07a4f',
    },
    spec: {
      deploymentStrategy: 'AppStudioAutomated',
      displayName: 'Development',
      type: 'poc',
    },
    healthStatus: 'Missing',
  },
  {
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    kind: 'Environment',
    metadata: {
      creationTimestamp: '2022-09-15T18:09:04Z',
      generation: 1,
      managedFields: [
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          fieldsType: 'FieldsV1',
          fieldsV1: {
            'f:spec': {
              '.': {},
              'f:deploymentStrategy': {},
              'f:displayName': {},
              'f:parentEnvironment': {},
              'f:type': {},
            },
          },
          manager: 'Mozilla',
          operation: 'Update',
          time: '2022-09-15T18:09:04Z',
        },
      ],
      name: 'production',
      namespace: 'jephilli',
      resourceVersion: '1090589270',
      uid: 'c56a99ea-f208-4601-b7d4-509511c146de',
    },
    spec: {
      deploymentStrategy: 'Manual',
      displayName: 'Production',
      parentEnvironment: 'staging',
      type: 'non-poc',
    },
    healthStatus: 'Missing',
  },
  {
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    kind: 'Environment',
    metadata: {
      creationTimestamp: '2022-09-15T18:08:46Z',
      generation: 1,
      managedFields: [
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          fieldsType: 'FieldsV1',
          fieldsV1: {
            'f:spec': {
              '.': {},
              'f:deploymentStrategy': {},
              'f:displayName': {},
              'f:parentEnvironment': {},
              'f:type': {},
            },
          },
          manager: 'Mozilla',
          operation: 'Update',
          time: '2022-09-15T18:08:46Z',
        },
      ],
      name: 'staging',
      namespace: 'jephilli',
      resourceVersion: '1090588522',
      uid: '76a54ef3-f655-4fda-ab30-dc2348ca250d',
    },
    spec: {
      deploymentStrategy: 'Manual',
      displayName: 'Staging',
      parentEnvironment: 'development',
      type: 'poc',
    },
    healthStatus: 'Missing',
  },
];
