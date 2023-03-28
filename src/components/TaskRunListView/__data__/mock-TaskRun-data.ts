import { TaskRunKind } from '../../../types/task-run';

export const testTaskRuns: TaskRunKind[] = [
  {
    apiVersion: 'tekton.dev/v1beta1',
    kind: 'TaskRun',
    metadata: {
      annotations: {
        'pipeline.tekton.dev/release': '6b5710c',
      },
      resourceVersion: '145324',
      name: 'example',
      uid: '4fc6c725-e385-41c9-ac23-f2cd32230894',
      creationTimestamp: '2022-08-15T14:14:08Z',
      generation: 1,
      managedFields: [
        {
          apiVersion: 'tekton.dev/v1beta1',
          fieldsType: 'FieldsV1',
          fieldsV1: {
            'f:spec': {
              '.': {},
              'f:taskRef': {
                '.': {},
                'f:kind': {},
                'f:name': {},
              },
            },
          },
          manager: 'Mozilla',
          operation: 'Update',
          time: '2022-08-15T14:14:08Z',
        },
        {
          apiVersion: 'tekton.dev/v1beta1',
          fieldsType: 'FieldsV1',
          fieldsV1: {
            'f:metadata': {
              'f:annotations': {
                '.': {},
                'f:pipeline.tekton.dev/release': {},
              },
              'f:labels': {
                'f:tekton.dev/task': {},
              },
            },
          },
          manager: 'openshift-pipelines-controller',
          operation: 'Update',
          time: '2022-08-15T14:14:08Z',
        },
        {
          apiVersion: 'tekton.dev/v1beta1',
          fieldsType: 'FieldsV1',
          fieldsV1: {
            'f:status': {
              '.': {},
              'f:completionTime': {},
              'f:conditions': {},
              'f:podName': {},
              'f:startTime': {},
              'f:taskSpec': {
                '.': {},
                'f:params': {},
                'f:steps': {},
              },
            },
          },
          manager: 'openshift-pipelines-controller',
          operation: 'Update',
          subresource: 'status',
          time: '2022-08-15T14:14:08Z',
        },
      ],
      namespace: 'test',
      labels: {
        'app.kubernetes.io/managed-by': 'tekton-pipelines',
        'tekton.dev/task': 'example-task',
        'tekton.dev/pipelineRun': 'example-pipelinerun',
        'appstudio.openshift.io/application': 'example-app',
      },
    },
    spec: {
      serviceAccountName: 'pipeline',
      taskRef: {
        kind: 'Task',
        name: 'example-task',
      },
      timeout: '1h0m0s',
    },
    status: {
      completionTime: '2022-08-15T14:14:08Z',
      conditions: [
        {
          lastTransitionTime: '2022-08-15T14:14:08Z',
          message:
            'invalid input params for task example-task: missing values for these params which have no default values: [appName]',
          reason: 'TaskRunValidationFailed',
          status: 'False',
          type: 'Succeeded',
        },
      ],
      podName: '',
      startTime: '2022-08-15T14:14:08Z',
      taskSpec: {
        description: 'Task description goes here.',
        params: [
          {
            name: 'appName',
            type: 'string',
          },
        ],
        steps: [
          {
            command: ['/bin/bash', '-c', 'echo', '$(inputs.params.appName)'],
            image: 'registry.redhat.io/ubi7/ubi-minimal',
            name: '',
            resources: {},
          },
        ],
      },
    },
  },
  {
    apiVersion: 'tekton.dev/v1beta1',
    kind: 'TaskRun',
    metadata: {
      annotations: {
        'pipeline.tekton.dev/release': '6b5710c',
      },
      resourceVersion: '145324',
      name: 'example-234',
      uid: '4fc6c725-e385-41c9-ac23-f2cd32230894',
      creationTimestamp: '2022-08-15T14:14:08Z',
      generation: 1,
      managedFields: [
        {
          apiVersion: 'tekton.dev/v1beta1',
          fieldsType: 'FieldsV1',
          fieldsV1: {
            'f:spec': {
              '.': {},
              'f:taskRef': {
                '.': {},
                'f:kind': {},
                'f:name': {},
              },
            },
          },
          manager: 'Mozilla',
          operation: 'Update',
          time: '2022-08-15T14:14:08Z',
        },
        {
          apiVersion: 'tekton.dev/v1beta1',
          fieldsType: 'FieldsV1',
          fieldsV1: {
            'f:metadata': {
              'f:annotations': {
                '.': {},
                'f:pipeline.tekton.dev/release': {},
              },
              'f:labels': {
                'f:tekton.dev/task': {},
              },
            },
          },
          manager: 'openshift-pipelines-controller',
          operation: 'Update',
          time: '2022-08-15T14:14:08Z',
        },
        {
          apiVersion: 'tekton.dev/v1beta1',
          fieldsType: 'FieldsV1',
          fieldsV1: {
            'f:status': {
              '.': {},
              'f:completionTime': {},
              'f:conditions': {},
              'f:podName': {},
              'f:startTime': {},
              'f:taskSpec': {
                '.': {},
                'f:params': {},
                'f:steps': {},
              },
            },
          },
          manager: 'openshift-pipelines-controller',
          operation: 'Update',
          subresource: 'status',
          time: '2022-08-15T14:14:08Z',
        },
      ],
      namespace: 'test',
      labels: {
        'app.kubernetes.io/managed-by': 'tekton-pipelines',
        'tekton.dev/task': 'example-task',
      },
    },
    spec: {
      serviceAccountName: 'pipeline',
      taskRef: {
        kind: 'Task',
        name: 'example-task',
      },
      timeout: '1h0m0s',
    },
    status: {
      completionTime: '2022-08-15T14:14:08Z',
      conditions: [
        {
          lastTransitionTime: '2022-08-15T14:14:08Z',
          message:
            'invalid input params for task example-task: missing values for these params which have no default values: [appName]',
          reason: 'TaskRunValidationFailed',
          status: 'False',
          type: 'Succeeded',
        },
      ],
      podName: '',
      startTime: '2022-08-15T14:14:08Z',
      taskSpec: {
        params: [
          {
            name: 'appName',
            type: 'string',
          },
        ],
        steps: [
          {
            command: ['/bin/bash', '-c', 'echo', '$(inputs.params.appName)'],
            image: 'registry.redhat.io/ubi7/ubi-minimal',
            name: '',
            resources: {},
          },
        ],
      },
    },
  },
];
