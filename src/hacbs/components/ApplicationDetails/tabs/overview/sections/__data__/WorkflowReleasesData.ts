export const mockReleasesData = [
  {
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    kind: 'Release',
    metadata: {
      generateName: 'test-application-dgkqg-',
      annotations: {
        'pipelinesascode.tekton.dev/on-target-branch': '[main,master]',
        'pipelinesascode.tekton.dev/repo-url': 'https://github.com/karthikjeeyar/test-nodeapp',
        'pipelinesascode.tekton.dev/sha-title': 'Appstudio update test-nodeapp',
        'pipelinesascode.tekton.dev/git-auth-secret': 'pac-gitauth-mpiw',
        'pipelinesascode.tekton.dev/max-keep-runs': '3',
        'pipelinesascode.tekton.dev/pull-request': '9',
        'pipelinesascode.tekton.dev/sha-url':
          'https://github.com/karthikjeeyar/test-nodeapp/commit/cd96b58bcf8199ae94873105fbdcd7b2ea53d2b5',
        'pipelinesascode.tekton.dev/on-event': '[pull_request]',
        'pipelinesascode.tekton.dev/installation-id': '29976162',
      },
      resourceVersion: '199419',
      name: 'test-application-dgkqg-dcdwr',
      uid: 'b9c88600-ce95-4d61-9c4e-38f4ab7ab741',
      creationTimestamp: '2022-11-09T17:33:45Z',
      generation: 1,
      managedFields: [
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          fieldsType: 'FieldsV1',
          fieldsV1: {
            'f:metadata': {
              'f:annotations': {
                'f:pipelinesascode.tekton.dev/pull-request': {},
                'f:pipelinesascode.tekton.dev/on-event': {},
                'f:pipelinesascode.tekton.dev/max-keep-runs': {},
                'f:pipelinesascode.tekton.dev/on-target-branch': {},
                '.': {},
                'f:pipelinesascode.tekton.dev/repo-url': {},
                'f:pipelinesascode.tekton.dev/sha-url': {},
                'f:pipelinesascode.tekton.dev/installation-id': {},
                'f:pipelinesascode.tekton.dev/sha-title': {},
                'f:pipelinesascode.tekton.dev/git-auth-secret': {},
              },
              'f:finalizers': {
                '.': {},
                'v:"appstudio.redhat.com/release-finalizer"': {},
              },
              'f:generateName': {},
              'f:labels': {
                'f:pipelinesascode.tekton.dev/url-repository': {},
                'f:pipelinesascode.tekton.dev/repository': {},
                'f:pipelinesascode.tekton.dev/url-org': {},
                'f:pipelinesascode.tekton.dev/git-provider': {},
                'f:pipelinesascode.tekton.dev/event-type': {},
                'f:pipelinesascode.tekton.dev/original-prname': {},
                '.': {},
                'f:pipelinesascode.tekton.dev/sha': {},
                'f:pipelinesascode.tekton.dev/sender': {},
                'f:pipelinesascode.tekton.dev/state': {},
                'f:pipelinesascode.tekton.dev/branch': {},
              },
              'f:ownerReferences': {
                '.': {},
                'k:{"uid":"71b08538-64ff-4e6c-9a35-fef2e5c0c779"}': {},
              },
            },
            'f:spec': {
              '.': {},
              'f:applicationSnapshot': {},
              'f:releasePlan': {},
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
              'f:completionTime': {},
              'f:conditions': {},
              'f:releasePipelineRun': {},
              'f:releaseStrategy': {},
              'f:startTime': {},
              'f:target': {
                '.': {},
                'f:namespace': {},
              },
            },
          },
          manager: 'Go-http-client',
          operation: 'Update',
          subresource: 'status',
          time: '2022-11-09T17:33:49Z',
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
      finalizers: ['appstudio.redhat.com/release-finalizer'],
      labels: {
        'pipelinesascode.tekton.dev/state': 'started',
        'pipelinesascode.tekton.dev/sender': 'karthikjeeyar',
        'pipelinesascode.tekton.dev/branch': 'main',
        'pipelinesascode.tekton.dev/url-org': 'karthikjeeyar',
        'pipelinesascode.tekton.dev/original-prname': 'test-nodeapp-on-pull-request',
        'pipelinesascode.tekton.dev/url-repository': 'test-nodeapp',
        'pipelinesascode.tekton.dev/repository': 'test-nodeapp',
        'pipelinesascode.tekton.dev/sha': 'cd96b58bcf8199ae94873105fbdcd7b2ea53d2b5',
        'pipelinesascode.tekton.dev/git-provider': 'github',
        'pipelinesascode.tekton.dev/event-type': 'pull_request',
      },
    },
    spec: {
      applicationSnapshot: 'test-application-dgkqg',
      releasePlan: 'sre-production',
    },
    status: {
      completionTime: '2022-11-09T17:33:49Z',
      conditions: [
        {
          lastTransitionTime: '2022-11-09T17:33:49Z',
          message: 'Tasks Completed: 2 (Failed: 2, Cancelled 0), Skipped: 3',
          reason: 'ReleasePipelineFailed',
          status: 'False',
          type: 'Succeeded',
        },
      ],
      releasePipelineRun: 'jeff-managed-hacbs/release-pipelinerun-5tcx7',
      releaseStrategy: 'jeff-managed-hacbs/m7-strategy',
      startTime: '2022-11-09T17:33:46Z',
      target: {
        namespace: 'jeff-managed-hacbs',
      },
    },
  },
  {
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    kind: 'Release',
    metadata: {
      creationTimestamp: '2022-11-09T17:36:38Z',
      finalizers: ['appstudio.redhat.com/release-finalizer'],
      generation: 1,
      managedFields: [
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          fieldsType: 'FieldsV1',
          fieldsV1: {
            'f:metadata': {
              'f:finalizers': {
                '.': {},
                'v:"appstudio.redhat.com/release-finalizer"': {},
              },
            },
          },
          manager: 'Go-http-client',
          operation: 'Update',
          time: '2022-11-09T17:36:38Z',
        },
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          fieldsType: 'FieldsV1',
          fieldsV1: {
            'f:spec': {
              '.': {},
              'f:applicationSnapshot': {},
              'f:releasePlan': {},
            },
          },
          manager: 'Mozilla',
          operation: 'Update',
          time: '2022-11-09T17:36:38Z',
        },
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          fieldsType: 'FieldsV1',
          fieldsV1: {
            'f:status': {
              '.': {},
              'f:completionTime': {},
              'f:conditions': {},
              'f:releasePipelineRun': {},
              'f:releaseStrategy': {},
              'f:startTime': {},
              'f:target': {
                '.': {},
                'f:namespace': {},
              },
            },
          },
          manager: 'Go-http-client',
          operation: 'Update',
          subresource: 'status',
          time: '2022-11-09T17:37:44Z',
        },
      ],
      name: 'test-application-j7p95-testing-release',
      namespace: 'jephilli',
      resourceVersion: '208504',
      uid: '362aacf6-2b4a-400e-bb56-f10343066e0f',
    },
    spec: {
      applicationSnapshot: 'test-application-dgkqg',
      releasePlan: 'sre-production',
    },
    status: {
      completionTime: '2022-11-09T17:37:44Z',
      conditions: [
        {
          lastTransitionTime: '2022-11-09T17:37:44Z',
          message: '',
          reason: 'Succeeded',
          status: 'True',
          type: 'Succeeded',
        },
      ],
      releasePipelineRun: 'jeff-managed-hacbs/release-pipelinerun-2v88q',
      releaseStrategy: 'jeff-managed-hacbs/m7-strategy',
      startTime: '2022-11-09T17:36:38Z',
      target: {
        namespace: 'jeff-managed-hacbs',
      },
    },
  },
];
