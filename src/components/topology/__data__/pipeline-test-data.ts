import { PipelineKind, PipelineRunKind } from '../../../types';

export const testPipeline: PipelineKind = {
  apiVersion: 'tekton.dev/v1beta1',
  kind: 'Pipeline',
  metadata: {
    creationTimestamp: '2022-06-21T04:33:49Z',
    generation: 6,
    name: 'sum-and-multiply-pipeline',
    namespace: 'karthik',
    resourceVersion: '183483',
    uid: 'e8ad59b3-7228-40cc-9ef8-eda28ba67b2f',
  },
  spec: {
    params: [
      {
        default: '1',
        name: 'a',
        type: 'string',
      },
      {
        default: '1',
        name: 'b',
        type: 'string',
      },
    ],
    tasks: [
      {
        name: 'task1',
        params: [
          {
            name: 'a',
            value: '$(params.a)',
          },
          {
            name: 'b',
            value: '$(params.b)',
          },
        ],
        taskRef: {
          kind: 'Task',
          name: 'sum',
        },
      },
      {
        name: 'task2',
        params: [
          {
            name: 'a',
            value: '$(params.a)',
          },
          {
            name: 'b',
            value: '$(params.a)',
          },
        ],
        taskRef: {
          kind: 'Task',
          name: 'multiply',
        },
      },
      {
        name: 'task3',
        params: [
          {
            name: 'a',
            value: '1',
          },
          {
            name: 'b',
            value: '1',
          },
        ],
        taskRef: {
          kind: 'Task',
          name: 'sum',
        },
        runAfter: ['task1', 'task2'],
      },
      {
        name: 'task4',
        params: [
          {
            name: 'a',
            value: '1',
          },
          {
            name: 'b',
            value: '1',
          },
        ],
        runAfter: ['task3'],
        taskRef: {
          kind: 'Task',
          name: 'sum',
        },
      },
      {
        name: 'task5',
        when: [
          {
            input: 'test',
            operator: 'IN',
            values: ['$(tasks.task1.results.sum)$(tasks.task2.results.product)'],
          },
        ],
        params: [
          {
            name: 'a',
            value: '1',
          },
          {
            name: 'b',
            value: '1',
          },
        ],
        taskRef: {
          kind: 'Task',
          name: 'sum',
        },
      },
      {
        name: 'task6',
        params: [
          {
            name: 'a',
            value: '1',
          },
          {
            name: 'b',
            value: '1',
          },
        ],
        runAfter: ['task5'],
        taskRef: {
          kind: 'Task',
          name: 'sum',
        },
      },
    ],
    resources: [],
    workspaces: [],
    finally: [],
  },
};

export const testPipelineRun: PipelineRunKind = {
  apiVersion: 'tekton.dev/v1beta1',
  kind: 'PipelineRun',
  metadata: {
    annotations: {
      'pipeline.openshift.io/started-by': 'kube:admin',
    },
    resourceVersion: '192148',
    name: 'sum-and-multiply-pipeline-ybpufp',
    uid: '7a32b583-56e2-43b2-ad54-ce7487972839',
    creationTimestamp: '2022-06-29T13:02:03Z',
    generation: 1,
    namespace: 'dev',
    labels: {
      'tekton.dev/pipeline': 'sum-and-multiply-pipeline',
    },
  },
  spec: {
    params: [
      {
        name: 'a',
        value: '1',
      },
      {
        name: 'b',
        value: '1',
      },
    ],
    pipelineRef: {
      name: 'sum-and-multiply-pipeline',
    },
    serviceAccountName: 'pipeline',
    timeout: '1h0m0s',
  },
  status: {
    conditions: [
      {
        lastTransitionTime: '2022-06-29T13:02:34Z',
        message: 'Tasks Completed: 2 (Failed: 0, Cancelled 0), Incomplete: 2, Skipped: 2',
        reason: 'Running',
        status: 'Unknown',
        type: 'Succeeded',
      },
    ],
    pipelineSpec: {
      params: [
        {
          default: '1',
          name: 'a',
          type: 'string',
        },
        {
          default: '1',
          name: 'b',
          type: 'string',
        },
      ],
      tasks: [
        {
          name: 'task1',
          params: [
            {
              name: 'a',
              value: '$(params.a)',
            },
            {
              name: 'b',
              value: '$(params.b)',
            },
          ],
          taskRef: {
            kind: 'Task',
            name: 'sum',
          },
          status: {
            completionTime: '2022-06-29T13:02:20Z',
            conditions: [
              {
                lastTransitionTime: '2022-06-29T13:02:20Z',
                message: 'All Steps have completed executing',
                reason: 'Succeeded',
                status: 'True',
                type: 'Succeeded',
              },
            ],
            podName: 'sum-and-multiply-pipeline-ybpufp-task1-pod',
            startTime: '2022-06-29T13:02:03Z',
            steps: [
              {
                container: 'step-sum',
                imageID:
                  'docker.io/library/bash@sha256:8f89b1dbb035d830be70ce827a76a3d1a06ab838332ce9b1ba30a415bb53d856',
                name: 'sum',
                terminated: {
                  containerID:
                    'cri-o://311b9bb0897a97fbc8f7653a90355f9a821d492a7a112bf9a4eb57ed858d3346',
                  exitCode: 0,
                  finishedAt: '2022-06-29T13:02:20Z',
                  message: '[{"key":"sum","value":"2","type":1}]',
                  reason: 'Completed',
                  startedAt: '2022-06-29T13:02:20Z',
                },
              },
            ],
            taskResults: [
              {
                name: 'sum',
                value: '2',
              },
            ],
            taskSpec: {
              params: [
                {
                  default: '1',
                  description: 'The first integer',
                  name: 'a',
                  type: 'string',
                },
                {
                  default: '1',
                  description: 'The second integer',
                  name: 'b',
                  type: 'string',
                },
              ],
              results: [
                {
                  description: 'The sum of the two provided integers',
                  name: 'sum',
                },
              ],
              steps: [
                {
                  image: 'bash:latest',
                  name: 'sum',
                  resources: {},
                  script:
                    '#!/usr/bin/env bash\necho -n $(( "$(params.a)" + "$(params.b)" )) | tee $(results.sum.path)\n',
                },
              ],
            },
            duration: '17s',
            reason: 'Succeeded',
          },
        },
        {
          name: 'task2',
          params: [
            {
              name: 'a',
              value: '$(params.a)',
            },
            {
              name: 'b',
              value: '$(params.a)',
            },
          ],
          taskRef: {
            kind: 'Task',
            name: 'multiply',
          },
          status: {
            completionTime: '2022-06-29T13:02:34Z',
            conditions: [
              {
                lastTransitionTime: '2022-06-29T13:02:34Z',
                message: 'All Steps have completed executing',
                reason: 'Succeeded',
                status: 'True',
                type: 'Succeeded',
              },
            ],
            podName: 'sum-and-multiply-pipeline-ybpufp-task2-pod',
            startTime: '2022-06-29T13:02:03Z',
            steps: [
              {
                container: 'step-product',
                imageID:
                  'docker.io/library/bash@sha256:8f89b1dbb035d830be70ce827a76a3d1a06ab838332ce9b1ba30a415bb53d856',
                name: 'product',
                terminated: {
                  containerID:
                    'cri-o://eeeac678d235948941e9a931ee440bc17192fdd5bfcbb14729446fbd8d482d4f',
                  exitCode: 0,
                  finishedAt: '2022-06-29T13:02:33Z',
                  message: '[{"key":"product","value":"1","type":1}]',
                  reason: 'Completed',
                  startedAt: '2022-06-29T13:02:33Z',
                },
              },
            ],
            taskResults: [
              {
                name: 'product',
                value: '1',
              },
            ],
            taskSpec: {
              params: [
                {
                  default: '1',
                  description: 'The first integer',
                  name: 'a',
                  type: 'string',
                },
                {
                  default: '1',
                  description: 'The second integer',
                  name: 'b',
                  type: 'string',
                },
              ],
              results: [
                {
                  description: 'The product of the two provided integers',
                  name: 'product',
                },
              ],
              steps: [
                {
                  image: 'bash:latest',
                  name: 'product',
                  resources: {},
                  script:
                    '#!/usr/bin/env bash\necho -n $(( "$(params.a)" * "$(params.b)" )) | tee $(results.product.path)\n',
                },
              ],
            },
            duration: '31s',
            reason: 'Succeeded',
          },
        },
        {
          name: 'task3',
          params: [
            {
              name: 'a',
              value: '1',
            },
            {
              name: 'b',
              value: '1',
            },
          ],
          runAfter: ['task1', 'task2'],
          taskRef: {
            kind: 'Task',
            name: 'sum',
          },
          status: {
            conditions: [
              {
                lastTransitionTime: '2022-06-29T13:02:34Z',
                message:
                  'pod status "Initialized":"False"; message: "containers with incomplete status: [prepare place-scripts]"',
                reason: 'Pending',
                status: 'Unknown',
                type: 'Succeeded',
              },
            ],
            podName: 'sum-and-multiply-pipeline-ybpufp-task3-pod',
            startTime: '2022-06-29T13:02:34Z',
            steps: [
              {
                container: 'step-sum',
                name: 'sum',
                waiting: {
                  reason: 'PodInitializing',
                },
              },
            ],
            taskSpec: {
              params: [
                {
                  default: '1',
                  description: 'The first integer',
                  name: 'a',
                  type: 'string',
                },
                {
                  default: '1',
                  description: 'The second integer',
                  name: 'b',
                  type: 'string',
                },
              ],
              results: [
                {
                  description: 'The sum of the two provided integers',
                  name: 'sum',
                },
              ],
              steps: [
                {
                  image: 'bash:latest',
                  name: 'sum',
                  resources: {},
                  script:
                    '#!/usr/bin/env bash\necho -n $(( "$(params.a)" + "$(params.b)" )) | tee $(results.sum.path)\n',
                },
              ],
            },
            reason: 'Running',
          },
        },
        {
          name: 'task4',
          params: [
            {
              name: 'a',
              value: '1',
            },
            {
              name: 'b',
              value: '1',
            },
          ],
          runAfter: ['task3'],
          taskRef: {
            kind: 'Task',
            name: 'sum',
          },
          status: {
            reason: 'Idle',
          },
        },
        {
          name: 'task5',
          params: [
            {
              name: 'a',
              value: '1',
            },
            {
              name: 'b',
              value: '1',
            },
          ],
          taskRef: {
            kind: 'Task',
            name: 'sum',
          },
          when: [
            {
              input: 'test',
              operator: 'in',
              values: ['$(tasks.task1.results.sum)$(tasks.task2.results.product)'],
            },
          ],
          status: {
            reason: 'Skipped',
          },
        },
        {
          name: 'task6',
          params: [
            {
              name: 'a',
              value: '1',
            },
            {
              name: 'b',
              value: '1',
            },
          ],
          runAfter: ['task5'],
          taskRef: {
            kind: 'Task',
            name: 'sum',
          },
          status: {
            reason: 'Skipped',
          },
        },
      ],
    },
    skippedTasks: [
      {
        name: 'task5',
        whenExpressions: [
          {
            input: 'test',
            operator: 'in',
            values: ['21'],
          },
        ],
      },
      {
        name: 'task6',
      },
    ],
    startTime: '2022-06-29T13:02:03Z',
    taskRuns: {
      'sum-and-multiply-pipeline-ybpufp-task1': {
        pipelineTaskName: 'task1',
        status: {
          completionTime: '2022-06-29T13:02:20Z',
          conditions: [
            {
              lastTransitionTime: '2022-06-29T13:02:20Z',
              message: 'All Steps have completed executing',
              reason: 'Succeeded',
              status: 'True',
              type: 'Succeeded',
            },
          ],
          podName: 'sum-and-multiply-pipeline-ybpufp-task1-pod',
          startTime: '2022-06-29T13:02:03Z',
          steps: [
            {
              container: 'step-sum',
              imageID:
                'docker.io/library/bash@sha256:8f89b1dbb035d830be70ce827a76a3d1a06ab838332ce9b1ba30a415bb53d856',
              name: 'sum',
              terminated: {
                containerID:
                  'cri-o://311b9bb0897a97fbc8f7653a90355f9a821d492a7a112bf9a4eb57ed858d3346',
                exitCode: 0,
                finishedAt: '2022-06-29T13:02:20Z',
                message: '[{"key":"sum","value":"2","type":1}]',
                reason: 'Completed',
                startedAt: '2022-06-29T13:02:20Z',
              },
            },
          ],
          taskResults: [
            {
              name: 'HACBS_TEST_OUTPUT',
              value:
                '{"result":"FAILURE","timestamp":"1675992922","note":"For more details please visit the logs in workspace of Tekton tasks.","namespace":"required_checks","successes":2,"failures":2,"warnings":0}',
            },
          ],
          taskSpec: {
            params: [
              {
                default: '1',
                description: 'The first integer',
                name: 'a',
                type: 'string',
              },
              {
                default: '1',
                description: 'The second integer',
                name: 'b',
                type: 'string',
              },
            ],
            results: [
              {
                description: 'The sum of the two provided integers',
                name: 'sum',
              },
            ],
            steps: [
              {
                image: 'bash:latest',
                name: 'sum',
                resources: {},
              },
            ],
          },
        },
      },
      'sum-and-multiply-pipeline-ybpufp-task2': {
        pipelineTaskName: 'task2',
        status: {
          completionTime: '2022-06-29T13:02:34Z',
          conditions: [
            {
              lastTransitionTime: '2022-06-29T13:02:34Z',
              message: 'All Steps have completed executing',
              reason: 'Succeeded',
              status: 'True',
              type: 'Succeeded',
            },
          ],
          podName: 'sum-and-multiply-pipeline-ybpufp-task2-pod',
          startTime: '2022-06-29T13:02:03Z',
          steps: [
            {
              container: 'step-product',
              imageID:
                'docker.io/library/bash@sha256:8f89b1dbb035d830be70ce827a76a3d1a06ab838332ce9b1ba30a415bb53d856',
              name: 'product',
              terminated: {
                containerID:
                  'cri-o://eeeac678d235948941e9a931ee440bc17192fdd5bfcbb14729446fbd8d482d4f',
                exitCode: 0,
                finishedAt: '2022-06-29T13:02:33Z',
                message: '[{"key":"product","value":"1","type":1}]',
                reason: 'Completed',
                startedAt: '2022-06-29T13:02:33Z',
              },
            },
          ],
          taskResults: [
            {
              name: 'HACBS_TEST_OUTPUT',
              value:
                '{"result":"WARNING","timestamp":"1675992922","note":"For more details please visit the logs in workspace of Tekton tasks.","namespace":"required_checks","successes":2,"failures":0,"warnings":1}',
            },
          ],
          taskSpec: {
            params: [
              {
                default: '1',
                description: 'The first integer',
                name: 'a',
                type: 'string',
              },
              {
                default: '1',
                description: 'The second integer',
                name: 'b',
                type: 'string',
              },
            ],
            results: [
              {
                description: 'The product of the two provided integers',
                name: 'product',
              },
            ],
            steps: [
              {
                image: 'bash:latest',
                name: 'product',
                resources: {},
              },
            ],
          },
        },
      },
      'sum-and-multiply-pipeline-ybpufp-task3': {
        pipelineTaskName: 'task3',
        status: {
          conditions: [
            {
              lastTransitionTime: '2022-06-29T13:02:34Z',
              message:
                'pod status "Initialized":"False"; message: "containers with incomplete status: [prepare place-scripts]"',
              reason: 'Pending',
              status: 'Unknown',
              type: 'Succeeded',
            },
          ],
          podName: 'sum-and-multiply-pipeline-ybpufp-task3-pod',
          startTime: '2022-06-29T13:02:34Z',
          steps: [
            {
              container: 'step-sum',
              name: 'sum',
              waiting: {
                reason: 'PodInitializing',
              },
            },
          ],
          taskResults: [
            {
              name: 'HACBS_TEST_OUTPUT',
              value:
                '{"result":"SUCCESS","timestamp":"1675992922","note":"For more details please visit the logs in workspace of Tekton tasks.","namespace":"required_checks","successes":2,"failures":0,"warnings":0}',
            },
          ],
          taskSpec: {
            params: [
              {
                default: '1',
                description: 'The first integer',
                name: 'a',
                type: 'string',
              },
              {
                default: '1',
                description: 'The second integer',
                name: 'b',
                type: 'string',
              },
            ],
            results: [
              {
                description: 'The sum of the two provided integers',
                name: 'sum',
              },
            ],
            steps: [
              {
                image: 'bash:latest',
                name: 'sum',
                resources: {},
              },
            ],
          },
        },
      },
      'sum-and-multiply-pipeline-8mhx4-show-sbom': {
        pipelineTaskName: 'show-sbom',
        status: {
          completionTime: '2023-04-19T15:59:43Z',
          conditions: [
            {
              lastTransitionTime: '2023-04-19T15:59:43Z',
              message: 'All Steps have completed executing',
              reason: 'Succeeded',
              status: 'True',
              type: 'Succeeded',
            },
          ],
          podName: 'devfile-sample-code-with-quarkus-rk47-8mhx4-show-sbom-pod',
          startTime: '2023-04-19T15:59:36Z',
          steps: [
            {
              container: 'step-show-sbom',
              imageID:
                'quay.io/redhat-appstudio/cosign@sha256:18b3716a6225727877475e1ab4f2493915e72cffd2ce431e9901d2ed2e4b2c0b',
              name: 'show-sbom',
              terminated: {
                containerID:
                  'cri-o://a9acbd8efec47ecf32181806df7179a1030ceb3842c21ca4ddfcfba0f46ef0c6',
                exitCode: 0,
                finishedAt: '2023-04-19T15:59:42Z',
                reason: 'Completed',
                startedAt: '2023-04-19T15:59:41Z',
              },
            },
          ],
          taskSpec: {
            description:
              'Shows the Software Bill of Materials (SBOM) generated for the built image in CyloneDX JSON format.',
            params: [
              {
                description: 'Fully qualified image name to show SBOM for.',
                name: 'IMAGE_URL',
                type: 'string',
              },
            ],
            steps: [
              {
                args: [
                  '-c',
                  'cosign download sbom quay.io/redhat-user-workloads/mdsaud-tenant/my-app-2/devfile-sample-code-with-quarkus-rk47:build-ba219-1681919770 2>/dev/null',
                ],
                command: ['sh'],
                image: 'quay.io/redhat-appstudio/cosign:v1.13.1',
                name: 'show-sbom',
                resources: {},
              },
            ],
          },
        },
      },
    },
  },
};
