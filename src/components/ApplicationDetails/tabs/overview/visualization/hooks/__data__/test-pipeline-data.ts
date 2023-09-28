import { PipelineRunKind } from '../../../../../../../types';

export const testPipelineRuns: PipelineRunKind[] = [
  {
    apiVersion: 'tekton.dev/v1beta1',
    kind: 'PipelineRun',
    metadata: {
      generateName: 'my-app-hr725-',
      annotations: {
        'pac.test.appstudio.openshift.io/on-event': '[push]',
        'pac.test.appstudio.openshift.io/log-url':
          'https://console-openshift-console.apps.stone-prd-m01.84db.p1.openshiftapps.com/k8s/ns/test-ns/tekton.dev~v1beta1~PipelineRun/node-express-hello-hwnl-on-push-9qmrg',
        'pac.test.appstudio.openshift.io/max-keep-runs': '3',
        'pac.test.appstudio.openshift.io/on-target-branch': '[main,master]',
        'chains.tekton.dev/signed': 'true',
        'pac.test.appstudio.openshift.io/repo-url':
          'https://github.com/karthikjeeyar/node-express-hello',
        'pac.test.appstudio.openshift.io/installation-id': '34969693',
        'pac.test.appstudio.openshift.io/sha-url':
          'https://github.com/karthikjeeyar/node-express-hello/commit/7d58d34fb06eb791d513f46f220e9f8f296f6e26',
        'pac.test.appstudio.openshift.io/sha-title': 'Update index.html',
        'pac.test.appstudio.openshift.io/git-auth-secret': 'pac-gitauth-ztea',
      },
      name: 'my-app-hr725-4f7g5',
      uid: '37b11fa2-9ae9-44c8-b72b-580ae89f7e62',
      creationTimestamp: '2023-03-07T10:11:36Z',
      namespace: 'test-ns',
      labels: {
        'appstudio.openshift.io/snapshot': 'my-app-hr725',
        'appstudio.openshift.io/component': 'node-express-hello-hwnl',
        'pac.test.appstudio.openshift.io/url-repository': 'node-express-hello',
        'pac.test.appstudio.openshift.io/repository': 'node-express-hello-hwnl',
        'pac.test.appstudio.openshift.io/git-provider': 'github',
        'pac.test.appstudio.openshift.io/event-type': 'push',
        'pac.test.appstudio.openshift.io/original-prname': 'node-express-hello-hwnl-on-push',
        'test.appstudio.openshift.io/scenario': 'one-more-test',
        'pac.test.appstudio.openshift.io/sha': '7d58d34fb06eb791d513f46f220e9f8f296f6e26',
        'tekton.dev/pipeline': 'integration-pipeline-pass',
        'appstudio.openshift.io/application': 'my-app',
        'pac.test.appstudio.openshift.io/state': 'started',
        'pipelines.appstudio.openshift.io/type': 'test',
        'pac.test.appstudio.openshift.io/branch': 'refs-heads-main',
        'pac.test.appstudio.openshift.io/check-run-id': '11817852169',
      },
    },
    spec: {
      params: [
        {
          name: 'SNAPSHOT',
          value:
            '{"application":"my-app","components":[{"name":"node-express-hello-hwnl","containerImage":"quay.io/redhat-appstudio/user-workload@sha256:68a4a3a6d23f5feb109638ee553ee2a8b6d0c79126f2acc1d5ff6cab94b4c92c"}],"artifacts":{}}',
        },
      ],
      pipelineRef: {
        bundle: 'quay.io/redhat-appstudio/example-tekton-bundle:integration-pipeline-pass',
        name: 'integration-pipeline-pass',
      },
      serviceAccountName: 'appstudio-pipeline',
      timeout: '1h0m0s',
    },
    status: {
      completionTime: '2023-03-07T10:11:46Z',
      conditions: [
        { status: 'True', type: 'Failure' },
        { status: 'False', type: 'Succeeded' },
      ],
      pipelineSpec: {
        tasks: [
          {
            name: 'task-success',
            params: [
              {
                name: 'RESULT',
                value: 'SUCCESS',
              },
            ],
            taskRef: {
              bundle: 'quay.io/redhat-appstudio/example-tekton-bundle:test-output',
              kind: 'Task',
              name: 'test-output',
            },
          },
          {
            name: 'task-success-2',
            params: [
              {
                name: 'RESULT',
                value: 'SUCCESS',
              },
            ],
            taskRef: {
              bundle: 'quay.io/redhat-appstudio/example-tekton-bundle:test-output',
              kind: 'Task',
              name: 'test-output',
            },
          },
          {
            name: 'task-skipped',
            params: [
              {
                name: 'RESULT',
                value: 'SKIPPED',
              },
            ],
            taskRef: {
              bundle: 'quay.io/redhat-appstudio/example-tekton-bundle:test-output',
              kind: 'Task',
              name: 'test-output',
            },
          },
        ],
      },
      startTime: '2023-03-07T10:11:37Z',
      taskRuns: {
        'my-app-hr725-4f7g5-task-skipped': {
          pipelineTaskName: 'task-skipped',
          status: {
            completionTime: '2023-03-07T10:11:46Z',
            conditions: [
              {
                lastTransitionTime: '2023-03-07T10:11:46Z',
                message: 'All Steps have completed executing',
                reason: 'Succeeded',
                status: 'True',
                type: 'Succeeded',
              },
            ],
            podName: 'my-app-hr725-4f7g5-task-skipped-pod',
            startTime: '2023-03-07T10:11:38Z',
            steps: [
              {
                container: 'step-unnamed-0',
                imageID:
                  'quay.io/redhat-appstudio/hacbs-test@sha256:581f9e27c748f9900e32a152293b6dffbaa3e390775f3c36c3860c6ed6c87b73',
                name: 'unnamed-0',
                terminated: {
                  containerID:
                    'cri-o://a875008d1fd5ca77609a25f1a2b3016e087142f120d53acb231c600c754e3674',
                  exitCode: 0,
                  finishedAt: '2023-03-07T10:11:46Z',
                  message:
                    '[{"key":"TEST_OUTPUT","value":"{\\"result\\":\\"SKIPPED\\",\\"timestamp\\":\\"1678183906\\",\\"failures\\":0,\\"successes\\":0}\\n","type":1}]',
                  reason: 'Completed',
                  startedAt: '2023-03-07T10:11:46Z',
                },
              },
            ],
            taskResults: [
              {
                name: 'TEST_OUTPUT',
                type: 'string',
                value: '{"result":"SUCCESS","timestamp":"1678183906","failures":0,"successes":0}\n',
              },
            ],
            taskSpec: {
              params: [
                {
                  default: 'SUCCESS',
                  description: 'Test result to be generated',
                  name: 'RESULT',
                  type: 'string',
                },
              ],
              results: [
                {
                  description: 'Test output',
                  name: 'TEST_OUTPUT',
                  type: 'string',
                },
              ],
              steps: [
                {
                  image: 'quay.io/redhat-appstudio/hacbs-test:stable',
                  name: '',
                  resources: {},
                  script:
                    'TEST_OUTPUT=$(jq -rc --arg date $(date +%s) --arg RESULT SKIPPED --null-input \\\n  \'{result: $RESULT, timestamp: $date, failures: 0, successes: 0}\')\necho "${TEST_OUTPUT}" | tee /tekton/results/TEST_OUTPUT\n',
                },
              ],
            },
          },
        },
        'my-app-hr725-4f7g5-task-success': {
          pipelineTaskName: 'task-success',
          status: {
            completionTime: '2023-03-07T10:11:45Z',
            conditions: [
              {
                lastTransitionTime: '2023-03-07T10:11:45Z',
                message: 'All Steps have completed executing',
                reason: 'Succeeded',
                status: 'True',
                type: 'Succeeded',
              },
            ],
            podName: 'my-app-hr725-4f7g5-task-success-pod',
            startTime: '2023-03-07T10:11:37Z',
            steps: [
              {
                container: 'step-unnamed-0',
                imageID:
                  'quay.io/redhat-appstudio/hacbs-test@sha256:581f9e27c748f9900e32a152293b6dffbaa3e390775f3c36c3860c6ed6c87b73',
                name: 'unnamed-0',
                terminated: {
                  containerID:
                    'cri-o://91c4e896dab7eaa5c7ce6cdef16a5b50988c5731585d643e38b70c0c561e47d7',
                  exitCode: 0,
                  finishedAt: '2023-03-07T10:11:44Z',
                  message:
                    '[{"key":"TEST_OUTPUT","value":"{\\"result\\":\\"SUCCESS\\",\\"timestamp\\":\\"1678183904\\",\\"failures\\":0,\\"successes\\":0}\\n","type":1}]',
                  reason: 'Completed',
                  startedAt: '2023-03-07T10:11:44Z',
                },
              },
            ],
            taskResults: [
              {
                name: 'TEST_OUTPUT',
                type: 'string',
                value: '{"result":"SUCCESS","timestamp":"1678183904","failures":0,"successes":0}\n',
              },
            ],
            taskSpec: {
              params: [
                {
                  default: 'SUCCESS',
                  description: 'Test result to be generated',
                  name: 'RESULT',
                  type: 'string',
                },
              ],
              results: [
                {
                  description: 'Test output',
                  name: 'TEST_OUTPUT',
                  type: 'string',
                },
              ],
              steps: [
                {
                  image: 'quay.io/redhat-appstudio/hacbs-test:stable',
                  name: '',
                  resources: {},
                  script:
                    'TEST_OUTPUT=$(jq -rc --arg date $(date +%s) --arg RESULT SUCCESS --null-input \\\n  \'{result: $RESULT, timestamp: $date, failures: 0, successes: 0}\')\necho "${TEST_OUTPUT}" | tee /tekton/results/TEST_OUTPUT\n',
                },
              ],
            },
          },
        },
        'my-app-hr725-4f7g5-task-success-2': {
          pipelineTaskName: 'task-success-2',
          status: {
            completionTime: '2023-03-07T10:11:44Z',
            conditions: [
              {
                lastTransitionTime: '2023-03-07T10:11:44Z',
                message: 'All Steps have completed executing',
                reason: 'Succeeded',
                status: 'True',
                type: 'Succeeded',
              },
            ],
            podName: 'my-app-hr725-4f7g5-task-success-2-pod',
            startTime: '2023-03-07T10:11:37Z',
            steps: [
              {
                container: 'step-unnamed-0',
                imageID:
                  'quay.io/redhat-appstudio/hacbs-test@sha256:581f9e27c748f9900e32a152293b6dffbaa3e390775f3c36c3860c6ed6c87b73',
                name: 'unnamed-0',
                terminated: {
                  containerID:
                    'cri-o://84acfa8c0c27401cdc7f74dc874e03ac307636382ad518fde319cb7716e72a14',
                  exitCode: 0,
                  finishedAt: '2023-03-07T10:11:43Z',
                  message:
                    '[{"key":"TEST_OUTPUT","value":"{\\"result\\":\\"SUCCESS\\",\\"timestamp\\":\\"1678183903\\",\\"failures\\":0,\\"successes\\":0}\\n","type":1}]',
                  reason: 'Completed',
                  startedAt: '2023-03-07T10:11:43Z',
                },
              },
            ],
            taskResults: [
              {
                name: 'TEST_OUTPUT',
                type: 'string',
                value: '{"result":"SUCCESS","timestamp":"1678183903","failures":0,"successes":0}\n',
              },
            ],
            taskSpec: {
              params: [
                {
                  default: 'SUCCESS',
                  description: 'Test result to be generated',
                  name: 'RESULT',
                  type: 'string',
                },
              ],
              results: [
                {
                  description: 'Test output',
                  name: 'TEST_OUTPUT',
                  type: 'string',
                },
              ],
              steps: [
                {
                  image: 'quay.io/redhat-appstudio/hacbs-test:stable',
                  name: '',
                  resources: {},
                  script:
                    'TEST_OUTPUT=$(jq -rc --arg date $(date +%s) --arg RESULT SUCCESS --null-input \\\n  \'{result: $RESULT, timestamp: $date, failures: 0, successes: 0}\')\necho "${TEST_OUTPUT}" | tee /tekton/results/TEST_OUTPUT\n',
                },
              ],
            },
          },
        },
      },
    },
  },
  {
    apiVersion: 'tekton.dev/v1beta1',
    kind: 'PipelineRun',
    metadata: {
      generateName: 'my-app-j7mxd-',
      annotations: {
        'results.tekton.dev/record':
          'test-ns/results/0ee50f5d-79ec-431a-b580-ac39a34ec8db/records/0ee50f5d-79ec-431a-b580-ac39a34ec8db',
        'pac.test.appstudio.openshift.io/on-event': '[pull_request]',
        'pac.test.appstudio.openshift.io/log-url':
          'https://console-openshift-console.apps.stone-prd-m01.84db.p1.openshiftapps.com/k8s/ns/test-ns/tekton.dev~v1beta1~PipelineRun/node-express-hello-hwnl-on-pull-request-4fspp',
        'pac.test.appstudio.openshift.io/max-keep-runs': '3',
        'pac.test.appstudio.openshift.io/on-target-branch': '[main,master]',
        'chains.tekton.dev/signed': 'true',
        'pac.test.appstudio.openshift.io/repo-url':
          'https://github.com/karthikjeeyar/node-express-hello',
        'pac.test.appstudio.openshift.io/installation-id': '34969693',
        'pac.test.appstudio.openshift.io/sha-url':
          'https://github.com/karthikjeeyar/node-express-hello/commit/ce8657402a4e0983776cf1188772a67e1822e70f',
        'results.tekton.dev/result': 'test-ns/results/0ee50f5d-79ec-431a-b580-ac39a34ec8db',
        'pac.test.appstudio.openshift.io/sha-title': 'Appstudio update node-express-hello-b7m7',
        'pac.test.appstudio.openshift.io/git-auth-secret': 'pac-gitauth-envx',
      },
      resourceVersion: '37696326',
      name: 'my-app-j7mxd-sw6t7',
      uid: '0ee50f5d-79ec-431a-b580-ac39a34ec8db',
      creationTimestamp: '2023-03-10T13:49:32Z',
      namespace: 'test-ns',
      ownerReferences: [
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          blockOwnerDeletion: true,
          controller: true,
          kind: 'Snapshot',
          name: 'my-app-j7mxd',
          uid: 'b007d7dc-03a2-409b-916c-b642fa5e279d',
        },
      ],
      finalizers: ['chains.tekton.dev/pipelinerun'],
      labels: {
        'appstudio.openshift.io/snapshot': 'my-app-j7mxd',
        'appstudio.openshift.io/component': 'node-express-hello-hwnl',
        'pac.test.appstudio.openshift.io/pull-request': '7',
        'pac.test.appstudio.openshift.io/url-repository': 'node-express-hello',
        'pac.test.appstudio.openshift.io/repository': 'node-express-hello-hwnl',
        'pac.test.appstudio.openshift.io/git-provider': 'github',
        'pac.test.appstudio.openshift.io/event-type': 'pull_request',
        'pac.test.appstudio.openshift.io/original-prname':
          'node-express-hello-hwnl-on-pull-request',
        'test.appstudio.openshift.io/scenario': 'test-again',
        'pac.test.appstudio.openshift.io/sha': 'ce8657402a4e0983776cf1188772a67e1822e70f',
        'tekton.dev/pipeline': 'integration-pipeline-pass',
        'pac.test.appstudio.openshift.io/sender': 'stonesoup-pac__bot',
        'appstudio.openshift.io/application': 'my-app',
        'pac.test.appstudio.openshift.io/state': 'started',
        'pipelines.appstudio.openshift.io/type': 'test',
        'pac.test.appstudio.openshift.io/branch': 'main',
        'pac.test.appstudio.openshift.io/check-run-id': '11910391985',
      },
    },
    spec: {
      params: [
        {
          name: 'SNAPSHOT',
          value:
            '{"application":"my-app","components":[{"name":"node-express-hello-hwnl","containerImage":"quay.io/redhat-appstudio/user-workload@sha256:6bf7e99564b8f6e42e66bcc98876e115f6caf374133114fd133c8556b5d88b41"}],"artifacts":{}}',
        },
      ],
      pipelineRef: {
        bundle: 'quay.io/redhat-appstudio/example-tekton-bundle:integration-pipeline-pass',
        name: 'integration-pipeline-pass',
      },
      serviceAccountName: 'appstudio-pipeline',
    },
    status: {
      childReferences: [
        {
          apiVersion: 'tekton.dev/v1beta1',
          kind: 'TaskRun',
          name: 'my-app-j7mxd-sw6t7-task-success',
          pipelineTaskName: 'task-success',
        },
        {
          apiVersion: 'tekton.dev/v1beta1',
          kind: 'TaskRun',
          name: 'my-app-j7mxd-sw6t7-task-success-2',
          pipelineTaskName: 'task-success-2',
        },
        {
          apiVersion: 'tekton.dev/v1beta1',
          kind: 'TaskRun',
          name: 'my-app-j7mxd-sw6t7-task-skipped',
          pipelineTaskName: 'task-skipped',
        },
      ],
      completionTime: '2023-03-10T13:49:45Z',
      conditions: [
        {
          lastTransitionTime: '2023-03-10T13:49:45Z',
          message: 'Tasks Completed: 3 (Failed: 0, Cancelled 0), Skipped: 0',
          reason: 'Succeeded',
          status: 'True',
          type: 'Succeeded',
        },
      ],
      pipelineSpec: {
        tasks: [
          {
            name: 'task-success',
            params: [
              {
                name: 'RESULT',
                value: 'SUCCESS',
              },
            ],
            taskRef: {
              bundle: 'quay.io/redhat-appstudio/example-tekton-bundle:test-output',
              kind: 'Task',
              name: 'test-output',
            },
          },
          {
            name: 'task-success-2',
            params: [
              {
                name: 'RESULT',
                value: 'SUCCESS',
              },
            ],
            taskRef: {
              bundle: 'quay.io/redhat-appstudio/example-tekton-bundle:test-output',
              kind: 'Task',
              name: 'test-output',
            },
          },
          {
            name: 'task-skipped',
            params: [
              {
                name: 'RESULT',
                value: 'SKIPPED',
              },
            ],
            taskRef: {
              bundle: 'quay.io/redhat-appstudio/example-tekton-bundle:test-output',
              kind: 'Task',
              name: 'test-output',
            },
          },
        ],
      },
      startTime: '2023-03-10T13:49:32Z',
      taskRuns: {
        'my-app-j7mxd-sw6t7-task-skipped': {
          pipelineTaskName: 'task-skipped',
          status: {
            completionTime: '2023-03-10T13:49:44Z',
            conditions: [
              {
                lastTransitionTime: '2023-03-10T13:49:44Z',
                message: 'All Steps have completed executing',
                reason: 'Succeeded',
                status: 'True',
                type: 'Succeeded',
              },
            ],
            podName: 'my-app-j7mxd-sw6t7-task-skipped-pod',
            startTime: '2023-03-10T13:49:34Z',
            steps: [
              {
                container: 'step-unnamed-0',
                imageID:
                  'quay.io/redhat-appstudio/hacbs-test@sha256:581f9e27c748f9900e32a152293b6dffbaa3e390775f3c36c3860c6ed6c87b73',
                name: 'unnamed-0',
                terminated: {
                  containerID:
                    'cri-o://f0cbdcb5808bff5b39282615935fa6a7b3cd60ab3f2cbd08a76a2a0e75899b4e',
                  exitCode: 0,
                  finishedAt: '2023-03-10T13:49:42Z',
                  message:
                    '[{"key":"TEST_OUTPUT","value":"{\\"result\\":\\"SKIPPED\\",\\"timestamp\\":\\"1678456182\\",\\"failures\\":0,\\"successes\\":0}\\n","type":1}]',
                  reason: 'Completed',
                  startedAt: '2023-03-10T13:49:42Z',
                },
              },
            ],
            taskResults: [
              {
                name: 'TEST_OUTPUT',
                type: 'string',
                value: '{"result":"SKIPPED","timestamp":"1678456182","failures":0,"successes":0}\n',
              },
            ],
            taskSpec: {
              params: [
                {
                  default: 'SUCCESS',
                  description: 'Test result to be generated',
                  name: 'RESULT',
                  type: 'string',
                },
              ],
              results: [
                {
                  description: 'Test output',
                  name: 'TEST_OUTPUT',
                  type: 'string',
                },
              ],
              steps: [
                {
                  image: 'quay.io/redhat-appstudio/hacbs-test:stable',
                  name: '',
                  resources: {},
                  script:
                    'TEST_OUTPUT=$(jq -rc --arg date $(date +%s) --arg RESULT SKIPPED --null-input \\\n  \'{result: $RESULT, timestamp: $date, failures: 0, successes: 0}\')\necho "${TEST_OUTPUT}" | tee /tekton/results/TEST_OUTPUT\n',
                },
              ],
            },
          },
        },
        'my-app-j7mxd-sw6t7-task-success': {
          pipelineTaskName: 'task-success',
          status: {
            completionTime: '2023-03-10T13:49:45Z',
            conditions: [
              {
                lastTransitionTime: '2023-03-10T13:49:45Z',
                message: 'All Steps have completed executing',
                reason: 'Succeeded',
                status: 'True',
                type: 'Succeeded',
              },
            ],
            podName: 'my-app-j7mxd-sw6t7-task-success-pod',
            startTime: '2023-03-10T13:49:34Z',
            steps: [
              {
                container: 'step-unnamed-0',
                imageID:
                  'quay.io/redhat-appstudio/hacbs-test@sha256:581f9e27c748f9900e32a152293b6dffbaa3e390775f3c36c3860c6ed6c87b73',
                name: 'unnamed-0',
                terminated: {
                  containerID:
                    'cri-o://2a4f593e97ee8c091bafdb9df6b502ce326c856623d44601a57144c5e5d37bca',
                  exitCode: 0,
                  finishedAt: '2023-03-10T13:49:44Z',
                  message:
                    '[{"key":"TEST_OUTPUT","value":"{\\"result\\":\\"SUCCESS\\",\\"timestamp\\":\\"1678456184\\",\\"failures\\":0,\\"successes\\":0}\\n","type":1}]',
                  reason: 'Completed',
                  startedAt: '2023-03-10T13:49:44Z',
                },
              },
            ],
            taskResults: [
              {
                name: 'TEST_OUTPUT',
                type: 'string',
                value: '{"result":"SUCCESS","timestamp":"1678456184","failures":0,"successes":0}\n',
              },
            ],
            taskSpec: {
              params: [
                {
                  default: 'SUCCESS',
                  description: 'Test result to be generated',
                  name: 'RESULT',
                  type: 'string',
                },
              ],
              results: [
                {
                  description: 'Test output',
                  name: 'TEST_OUTPUT',
                  type: 'string',
                },
              ],
              steps: [
                {
                  image: 'quay.io/redhat-appstudio/hacbs-test:stable',
                  name: '',
                  resources: {},
                  script:
                    'TEST_OUTPUT=$(jq -rc --arg date $(date +%s) --arg RESULT SUCCESS --null-input \\\n  \'{result: $RESULT, timestamp: $date, failures: 0, successes: 0}\')\necho "${TEST_OUTPUT}" | tee /tekton/results/TEST_OUTPUT\n',
                },
              ],
            },
          },
        },
        'my-app-j7mxd-sw6t7-task-success-2': {
          pipelineTaskName: 'task-success-2',
          status: {
            completionTime: '2023-03-10T13:49:45Z',
            conditions: [
              {
                lastTransitionTime: '2023-03-10T13:49:45Z',
                message: 'All Steps have completed executing',
                reason: 'Succeeded',
                status: 'True',
                type: 'Succeeded',
              },
            ],
            podName: 'my-app-j7mxd-sw6t7-task-success-2-pod',
            startTime: '2023-03-10T13:49:34Z',
            steps: [
              {
                container: 'step-unnamed-0',
                imageID:
                  'quay.io/redhat-appstudio/hacbs-test@sha256:581f9e27c748f9900e32a152293b6dffbaa3e390775f3c36c3860c6ed6c87b73',
                name: 'unnamed-0',
                terminated: {
                  containerID:
                    'cri-o://e8687462bdf7f422a1a3d9b8714d8eccc936d5248026d22a494234875f4b2cfa',
                  exitCode: 0,
                  finishedAt: '2023-03-10T13:49:44Z',
                  message:
                    '[{"key":"TEST_OUTPUT","value":"{\\"result\\":\\"SUCCESS\\",\\"timestamp\\":\\"1678456184\\",\\"failures\\":0,\\"successes\\":0}\\n","type":1}]',
                  reason: 'Completed',
                  startedAt: '2023-03-10T13:49:44Z',
                },
              },
            ],
            taskResults: [
              {
                name: 'TEST_OUTPUT',
                type: 'string',
                value: '{"result":"SUCCESS","timestamp":"1678456184","failures":0,"successes":0}\n',
              },
            ],
            taskSpec: {
              params: [
                {
                  default: 'SUCCESS',
                  description: 'Test result to be generated',
                  name: 'RESULT',
                  type: 'string',
                },
              ],
              results: [
                {
                  description: 'Test output',
                  name: 'TEST_OUTPUT',
                  type: 'string',
                },
              ],
              steps: [
                {
                  image: 'quay.io/redhat-appstudio/hacbs-test:stable',
                  name: '',
                  resources: {},
                  script:
                    'TEST_OUTPUT=$(jq -rc --arg date $(date +%s) --arg RESULT SUCCESS --null-input \\\n  \'{result: $RESULT, timestamp: $date, failures: 0, successes: 0}\')\necho "${TEST_OUTPUT}" | tee /tekton/results/TEST_OUTPUT\n',
                },
              ],
            },
          },
        },
      },
    },
  },
];
