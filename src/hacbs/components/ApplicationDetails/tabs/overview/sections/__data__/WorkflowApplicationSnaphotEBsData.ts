export const mockApplicationSnapshotEBs = [
  {
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    kind: 'ApplicationSnapshotEnvironmentBinding',
    metadata: {
      generateName: 'test-application-development-binding-',
      resourceVersion: '199299',
      name: 'test-application-development-binding-8h9wl',
      uid: 'ddc191ed-aa42-43d5-9820-826ae24601ad',
      creationTimestamp: '2022-11-09T17:33:45Z',
      generation: 1,
      managedFields: [
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          fieldsType: 'FieldsV1',
          fieldsV1: {
            'f:metadata': {
              'f:generateName': {},
              'f:labels': {
                '.': {},
                'f:appstudio.application': {},
                'f:appstudio.environment': {},
              },
              'f:ownerReferences': {
                '.': {},
                'k:{"uid":"71b08538-64ff-4e6c-9a35-fef2e5c0c779"}': {},
              },
            },
            'f:spec': {
              '.': {},
              'f:application': {},
              'f:components': {},
              'f:environment': {},
              'f:snapshot': {},
            },
          },
          manager: 'Go-http-client',
          operation: 'Update',
          time: '2022-11-09T17:33:45Z',
        },
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          fieldsType: 'FieldsV1',
          fieldsV1: {
            'f:status': {
              '.': {},
              'f:components': {},
              'f:gitopsDeployments': {},
              'f:gitopsRepoConditions': {},
            },
          },
          manager: 'Go-http-client',
          operation: 'Update',
          subresource: 'status',
          time: '2022-11-09T17:33:47Z',
        },
      ],
      namespace: 'jephilli',
      ownerReferences: [
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          blockOwnerDeletion: true,
          controller: true,
          kind: 'Application',
          name: 'test-application',
          uid: '71b08538-64ff-4e6c-9a35-fef2e5c0c779',
        },
      ],
      labels: {
        'appstudio.application': 'test-application',
        'appstudio.environment': 'development',
      },
    },
    spec: {
      application: 'test-application',
      components: [
        {
          configuration: {
            replicas: 1,
          },
          name: 'test-nodeapp',
        },
      ],
      environment: 'development',
      snapshot: 'test-application-dgkqg',
    },
    status: {
      components: [
        {
          gitopsRepository: {
            branch: 'main',
            commitID: '95598ffacde7586c92a1eecf7c813080b8a9a1c8\n',
            generatedResources: ['deployment-patch.yaml'],
            path: 'components/test-nodeapp/overlays/development',
            url: 'https://github.com/HACbs-ui-org/test-application-jephilli-define-laugh',
          },
          name: 'test-nodeapp',
        },
      ],
      gitopsDeployments: [
        {
          componentName: 'test-nodeapp',
          gitopsDeployment:
            'test-application-development-binding-8h9wl-test-application-development-test-nodeapp',
        },
      ],
      gitopsRepoConditions: [
        {
          lastTransitionTime: '2022-11-09T17:33:47Z',
          message: 'GitOps repository sync successful',
          reason: 'OK',
          status: 'True',
          type: 'GitOpsResourcesGenerated',
        },
      ],
    },
  },
];
