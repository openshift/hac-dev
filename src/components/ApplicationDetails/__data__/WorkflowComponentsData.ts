export const mockComponentsData = [
  {
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    kind: 'Component',
    metadata: {
      annotations: {},
      resourceVersion: '999994539',
      name: 'test-dotnet60',
      uid: 'fcabf01f-808e-4b6e-a416-378e77eb3920',
      creationTimestamp: '2022-08-25T17:53:45Z',
      generation: 2,
      managedFields: [
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          fieldsType: 'FieldsV1',
          fieldsV1: {
            'f:metadata': {
              'f:finalizers': {
                '.': {},
                'v:"component.appstudio.redhat.com/finalizer"': {},
              },
              'f:ownerReferences': {
                '.': {},
                'k:{"uid":"b8e8aaa0-b7f1-49ab-afc3-59072017490f"}': {},
              },
            },
            'f:spec': {
              'f:containerImage': {},
            },
          },
          manager: 'Go-http-client',
          operation: 'Update',
          time: '2022-08-25T17:53:45Z',
        },
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          fieldsType: 'FieldsV1',
          fieldsV1: {
            'f:metadata': {
              'f:annotations': {
                '.': {},
              },
            },
            'f:spec': {
              '.': {},
              'f:application': {},
              'f:componentName': {},
              'f:replicas': {},
              'f:resources': {
                '.': {},
                'f:requests': {
                  '.': {},
                  'f:cpu': {},
                  'f:memory': {},
                },
              },
              'f:secret': {},
              'f:source': {
                '.': {},
                'f:git': {
                  '.': {},
                  'f:dockerfileUrl': {},
                  'f:url': {},
                },
              },
              'f:targetPort': {},
            },
          },
          manager: 'Mozilla',
          operation: 'Update',
          time: '2022-08-25T17:53:45Z',
        },
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          fieldsType: 'FieldsV1',
          fieldsV1: {
            'f:status': {
              '.': {},
              'f:conditions': {},
              'f:containerImage': {},
              'f:devfile': {},
              'f:gitops': {
                '.': {},
                'f:context': {},
                'f:repositoryURL': {},
              },
            },
          },
          manager: 'Go-http-client',
          operation: 'Update',
          subresource: 'status',
          time: '2022-08-25T17:53:46Z',
        },
      ],
      namespace: 'test-ns',
      ownerReferences: [
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          kind: 'Application',
          name: 'test-dev-samples',
          uid: 'b8e8aaa0-b7f1-49ab-afc3-59072017490f',
        },
      ],
      finalizers: ['component.appstudio.redhat.com/finalizer'],
    },
    spec: {
      application: 'test-dev-samples',
      componentName: 'test-dotnet60',
      containerImage: 'quay.io/redhat-appstudio/user-workload:test-ns-test-dotnet60',
      replicas: 1,
      resources: {
        requests: {
          cpu: '10m',
          memory: '100Mi',
        },
      },
      source: {
        git: {
          dockerfileUrl:
            'https://raw.githubusercontent.com/test-user-1/devfile-sample-dotnet60-basic/main/docker/Dockerfile',
          url: 'https://github.com/test-user-1/devfile-sample-dotnet60-basic.git',
        },
      },
      targetPort: 8081,
    },
    status: {
      conditions: [
        {
          lastTransitionTime: '2022-08-25T17:53:46Z',
          message: 'GitOps resource generated successfully',
          reason: 'OK',
          status: 'True',
          type: 'GitOpsResourcesGenerated',
        },
        {
          lastTransitionTime: '2022-08-25T17:53:46Z',
          message: 'Component has been successfully created',
          reason: 'OK',
          status: 'True',
          type: 'Created',
        },
      ],
      containerImage: 'quay.io/redhat-appstudio/user-workload:test-ns-test-dotnet60',
      devfile:
        'commands:\n- apply:\n    component: dockerfile-build\n  id: build-image\ncomponents:\n- image:\n    dockerfile:\n      rootRequired: false\n      uri: https://raw.githubusercontent.com/test-user-1/devfile-sample-dotnet60-basic/main/docker/Dockerfile\n    imageName: ""\n  name: dockerfile-build\n- attributes:\n    deployment/container-port: 8081\n    deployment/cpuRequest: 10m\n    deployment/memoryRequest: 100Mi\n    deployment/replicas: 1\n    deployment/storageRequest: "0"\n  kubernetes:\n    inlined: placeholder\n  name: kubernetes\nmetadata:\n  description: Basic Devfile for a Dockerfile Component\n  name: dockerfile-component\nschemaVersion: 2.2.0\n',
      gitops: {
        context: './',
        repositoryURL:
          'https://github.com/redhat-appstudio-appdata/test-dev-samples-test-ns-implement-owe',
      },
    },
  },
  {
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    kind: 'Component',
    metadata: {
      annotations: {},
      resourceVersion: '999922571',
      name: 'test-go',
      uid: '9bef4308-642a-4d0d-b180-f53f0a797f0e',
      creationTimestamp: '2022-08-25T17:30:23Z',
      generation: 2,
      managedFields: [
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          fieldsType: 'FieldsV1',
          fieldsV1: {
            'f:metadata': {
              'f:finalizers': {
                '.': {},
                'v:"component.appstudio.redhat.com/finalizer"': {},
              },
              'f:ownerReferences': {
                '.': {},
                'k:{"uid":"b8e8aaa0-b7f1-49ab-afc3-59072017490f"}': {},
              },
            },
            'f:spec': {
              'f:containerImage': {},
            },
          },
          manager: 'Go-http-client',
          operation: 'Update',
          time: '2022-08-25T17:30:23Z',
        },
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          fieldsType: 'FieldsV1',
          fieldsV1: {
            'f:metadata': {
              'f:annotations': {
                '.': {},
              },
            },
            'f:spec': {
              '.': {},
              'f:application': {},
              'f:componentName': {},
              'f:replicas': {},
              'f:resources': {
                '.': {},
                'f:requests': {
                  '.': {},
                  'f:cpu': {},
                  'f:memory': {},
                },
              },
              'f:secret': {},
              'f:source': {
                '.': {},
                'f:git': {
                  '.': {},
                  'f:dockerfileUrl': {},
                  'f:url': {},
                },
              },
              'f:targetPort': {},
            },
          },
          manager: 'Mozilla',
          operation: 'Update',
          time: '2022-08-25T17:30:23Z',
        },
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          fieldsType: 'FieldsV1',
          fieldsV1: {
            'f:status': {
              '.': {},
              'f:conditions': {},
              'f:containerImage': {},
              'f:devfile': {},
              'f:gitops': {
                '.': {},
                'f:context': {},
                'f:repositoryURL': {},
              },
            },
          },
          manager: 'Go-http-client',
          operation: 'Update',
          subresource: 'status',
          time: '2022-08-25T17:30:24Z',
        },
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          fieldsType: 'FieldsV1',
          fieldsV1: {
            'f:metadata': {
              'f:annotations': {},
            },
          },
          manager: 'manager',
          operation: 'Update',
          time: '2022-08-25T17:30:26Z',
        },
      ],
      namespace: 'test-ns',
      ownerReferences: [
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          kind: 'Application',
          name: 'test-dev-samples',
          uid: 'b8e8aaa0-b7f1-49ab-afc3-59072017490f',
        },
      ],
      finalizers: ['component.appstudio.redhat.com/finalizer'],
    },
    spec: {
      application: 'test-dev-samples',
      componentName: 'test-go',
      containerImage: 'quay.io/redhat-appstudio/user-workload:test-ns-test-go',
      replicas: 2,
      resources: {
        requests: {
          cpu: '10m',
          memory: '10Mi',
        },
      },
      source: {
        git: {
          dockerfileUrl:
            'https://raw.githubusercontent.com/test-user-1/devfile-sample-go-basic/main/docker/Dockerfile',
          url: 'https://github.com/test-user-1/devfile-sample-go-basic',
          revision: 'main',
        },
      },
      targetPort: 8081,
    },
    status: {
      conditions: [
        {
          lastTransitionTime: '2022-08-25T17:30:24Z',
          message: 'GitOps resource generated successfully',
          reason: 'OK',
          status: 'True',
          type: 'GitOpsResourcesGenerated',
        },
        {
          lastTransitionTime: '2022-08-25T17:30:24Z',
          message: 'Component has been successfully created',
          reason: 'OK',
          status: 'True',
          type: 'Created',
        },
      ],
      containerImage: 'quay.io/redhat-appstudio/user-workload:test-ns-test-go',
      devfile:
        'commands:\n- apply:\n    component: dockerfile-build\n  id: build-image\ncomponents:\n- image:\n    dockerfile:\n      rootRequired: false\n      uri: https://raw.githubusercontent.com/test-user-1/devfile-sample-go-basic/main/docker/Dockerfile\n    imageName: ""\n  name: dockerfile-build\n- attributes:\n    deployment/container-port: 8081\n    deployment/cpuRequest: 10m\n    deployment/memoryRequest: 10Mi\n    deployment/replicas: 2\n    deployment/storageRequest: "0"\n  kubernetes:\n    inlined: placeholder\n  name: kubernetes\nmetadata:\n  description: Basic Devfile for a Dockerfile Component\n  name: dockerfile-component\nschemaVersion: 2.2.0\n',
      gitops: {
        context: './',
        repositoryURL:
          'https://github.com/redhat-appstudio-appdata/test-dev-samples-test-ns-implement-owe',
      },
    },
  },
  {
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    kind: 'Component',
    metadata: {
      annotations: {},
      resourceVersion: '1089930845',
      name: 'nodejs-test',
      uid: '3628db9d-1ac1-4fe3-8ed5-a4c5664fb9c4',
      creationTimestamp: '2022-09-15T14:06:15Z',
      generation: 2,
      managedFields: [
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          fieldsType: 'FieldsV1',
          fieldsV1: {
            'f:metadata': {
              'f:finalizers': {
                '.': {},
                'v:"component.appstudio.redhat.com/finalizer"': {},
              },
              'f:ownerReferences': {
                '.': {},
                'k:{"uid":"b8e8aaa0-b7f1-49ab-afc3-59072017490f"}': {},
              },
            },
            'f:spec': {
              'f:containerImage': {},
            },
          },
          manager: 'Go-http-client',
          operation: 'Update',
          time: '2022-09-15T14:06:15Z',
        },
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          fieldsType: 'FieldsV1',
          fieldsV1: {
            'f:metadata': {
              'f:annotations': {
                '.': {},
              },
            },
            'f:spec': {
              '.': {},
              'f:application': {},
              'f:componentName': {},
              'f:replicas': {},
              'f:resources': {
                '.': {},
                'f:requests': {
                  '.': {},
                  'f:cpu': {},
                  'f:memory': {},
                },
              },
              'f:secret': {},
              'f:source': {
                '.': {},
                'f:git': {
                  '.': {},
                  'f:devfileUrl': {},
                  'f:dockerfileUrl': {},
                  'f:url': {},
                },
              },
              'f:targetPort': {},
            },
          },
          manager: 'Mozilla',
          operation: 'Update',
          time: '2022-09-15T14:06:15Z',
        },
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          fieldsType: 'FieldsV1',
          fieldsV1: {
            'f:status': {
              '.': {},
              'f:conditions': {},
              'f:containerImage': {},
              'f:devfile': {},
              'f:gitops': {
                '.': {},
                'f:commitID': {},
                'f:context': {},
                'f:repositoryURL': {},
              },
            },
          },
          manager: 'Go-http-client',
          operation: 'Update',
          subresource: 'status',
          time: '2022-09-15T14:06:16Z',
        },
      ],
      namespace: 'test-ns',
      ownerReferences: [
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          kind: 'Application',
          name: 'test-dev-samples',
          uid: 'b8e8aaa0-b7f1-49ab-afc3-59072017490f',
        },
      ],
      finalizers: ['component.appstudio.redhat.com/finalizer'],
    },
    spec: {
      application: 'test-dev-samples',
      componentName: 'nodejs-test',
      containerImage: 'quay.io/redhat-appstudio/user-workload:test-ns-nodejs-test',
      replicas: 1,
      resources: {
        requests: {
          cpu: '10m',
          memory: '50Mi',
        },
      },
      source: {
        git: {
          devfileUrl: 'https://registry.devfile.io/devfiles/nodejs-basic',
          dockerfileUrl:
            'https://raw.githubusercontent.com/nodeshift-starters/devfile-sample/main/Dockerfile',
          url: 'https://github.com/sclorg/nodejs-ex.git',
        },
      },
      targetPort: 3001,
    },
    status: {
      conditions: [
        {
          lastTransitionTime: '2022-09-15T14:06:16Z',
          message: 'GitOps resource generated successfully',
          reason: 'OK',
          status: 'True',
          type: 'GitOpsResourcesGenerated',
        },
        {
          lastTransitionTime: '2022-09-15T14:06:16Z',
          message: 'Component has been successfully created',
          reason: 'OK',
          status: 'True',
          type: 'Created',
        },
      ],
      containerImage: 'quay.io/redhat-appstudio/user-workload:test-ns-nodejs-test',
      devfile:
        'commands:\n- apply:\n    component: dockerfile-build\n  id: build-image\ncomponents:\n- image:\n    dockerfile:\n      rootRequired: false\n      uri: https://raw.githubusercontent.com/nodeshift-starters/devfile-sample/main/Dockerfile\n    imageName: ""\n  name: dockerfile-build\n- attributes:\n    deployment/container-port: 3001\n    deployment/cpuRequest: 10m\n    deployment/memoryRequest: 50Mi\n    deployment/replicas: 1\n    deployment/storageRequest: "0"\n  kubernetes:\n    inlined: placeholder\n  name: kubernetes\nmetadata:\n  description: Basic Devfile for a Dockerfile Component\n  name: dockerfile-component\nschemaVersion: 2.2.0\n',
      gitops: {
        commitID: '97c05ca3e5c1be0ca8a854e4d344b50cbfa13d93\n',
        context: './',
        repositoryURL:
          'https://github.com/redhat-appstudio-appdata/test-dev-samples-test-ns-implement-owe',
      },
    },
  },
];
