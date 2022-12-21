import { PipelineRunKind, PipelineSpec } from '../shared/components/pipeline-run-logs/types';

const samplePipelineSpec: PipelineSpec = {
  params: [
    {
      name: 'prefix',
      type: 'string',
    },
  ],
  tasks: [
    {
      name: 'first',
      taskSpec: {
        metadata: {},
        results: [
          {
            name: 'first',
            type: 'string',
          },
        ],
        steps: [
          {
            image: 'alpine',
            name: 'generate-first',
            resources: {},
            script: 'echo -n "suffix" > $(results.first.path)\n',
          },
        ],
      },
    },
    {
      name: 'second',
      runAfter: ['first'],
      taskSpec: {
        metadata: {},
        results: [
          {
            name: 'two',
            type: 'string',
          },
        ],
        steps: [
          {
            image: 'alpine',
            name: 'generate-second',
            resources: {},
            script: 'sleep 30\necho -n "suffix" > $(results.two.path)\n',
          },
        ],
      },
    },
    {
      name: 'generate-suffix',
      runAfter: ['second'],
      taskSpec: {
        metadata: {},
        results: [
          {
            name: 'suffix',
            type: 'string',
          },
        ],
        steps: [
          {
            image: 'alpine',
            name: 'generate-suffix',
            resources: {},
            script: 'echo -n "suffix" > $(results.suffix.path)\n',
          },
        ],
      },
    },
    {
      name: 'do-something',
      params: [
        {
          name: 'arg',
          value: '$(params.prefix):$(tasks.generate-suffix.results.suffix)',
        },
      ],
      taskSpec: {
        metadata: {},
        params: [
          {
            name: 'arg',
            type: 'string',
          },
        ],
        steps: [
          {
            image: 'alpine',
            name: 'do-something',
            resources: {},
            script: 'echo "$(params.arg)" | grep "prefix:suffix"\n',
          },
        ],
      },
    },
    {
      name: 'finally-do-something',
      params: [
        {
          name: 'arg',
          value: '$(params.prefix):$(tasks.first.results.first):$(tasks.second.results.two)',
        },
      ],
      taskSpec: {
        metadata: {},
        params: [
          {
            name: 'arg',
            type: 'string',
          },
        ],
        steps: [
          {
            image: 'alpine',
            name: 'do-something',
            resources: {},
            script: 'echo "$(params.arg)" | grep "prefix:suffix"\n',
          },
        ],
      },
    },
  ],
};

const sampleLabels = {
  'app.kubernetes.io/managed-by': 'pipelinesascode.tekton.dev',
  'app.kubernetes.io/version': '0.10.2',
  'appstudio.openshift.io/application': 'test-application',
  'appstudio.openshift.io/component': 'devfile-sample-node',
  'pipelines.appstudio.openshift.io/type': 'build',
  'pipelines.openshift.io/runtime': 'generic',
  'pipelines.openshift.io/strategy': 'docker',
  'pipelines.openshift.io/used-by': 'build-cloud',
  'pipelinesascode.tekton.dev/branch': 'main',
  'pipelinesascode.tekton.dev/check-run-id': '7965982293',
  'pipelinesascode.tekton.dev/event-type': 'pull_request',
  'pipelinesascode.tekton.dev/git-provider': 'github',
  'pipelinesascode.tekton.dev/original-prname': 'devfile-sample-node-on-pull-request',
  'pipelinesascode.tekton.dev/repository': 'devfile-sample-node',
  'pipelinesascode.tekton.dev/sender': 'testuser',
  'pipelinesascode.tekton.dev/sha': 'c782c8f81145fc13f516420a960247f5ffa2f7e0',
  'pipelinesascode.tekton.dev/state': 'completed',
  'pipelinesascode.tekton.dev/url-org': 'testuser',
  'pipelinesascode.tekton.dev/url-repository': 'devfile-sample-node',
  'tekton.dev/pipeline': 'test-caseqfvdj',
};

const samplePipelineRun: PipelineRunKind = {
  apiVersion: 'tekton.dev/v1beta1',
  kind: 'PipelineRun',
  metadata: {
    creationTimestamp: '2022-11-28T12:08:22Z',
    generateName: 'test-case',
    labels: sampleLabels,
    name: 'test-caseqfvdj',
    namespace: 'test-ns',
    uid: '21f9d031-528a-449b-90eb-106e22fcfa39',
  },
  spec: {
    params: [
      {
        name: 'prefix',
        value: 'prefix',
      },
    ],
    pipelineSpec: samplePipelineSpec,
    serviceAccountName: 'pipeline',
    timeout: '1h0m0s',
  },
};

export enum DataState {
  RUNNING = 'Running',
  SUCCEEDED = 'Succeeded',
  FAILED = 'Failed',
  SKIPPED = 'Skipped',
  PIPELINE_RUN_PENDING = 'PipelineRunPending',
  PIPELINE_RUN_STOPPED = 'StoppedRunFinally',
  PIPELINE_RUN_CANCELLED = 'CancelledRunFinally',
  TASK_RUN_CANCELLED = 'TaskRunCancelled',
  PIPELINE_RUN_CANCELLING = 'PipelineRunCancelling',
  PIPELINE_RUN_STOPPING = 'PipelineRunStopping',
  TASK_RUN_STOPPING = 'TaskRunStopping',

  /*Custom data state to test various scnearios*/
  STATUS_WITHOUT_CONDITIONS = 'StatusWithoutCondition',
  STATUS_WITH_EMPTY_CONDITIONS = 'StatusWithEmptyCondition',
  STATUS_WITHOUT_CONDITION_TYPE = 'StatusWithoutConditionType',
  STATUS_WITH_UNKNOWN_REASON = 'StatusWithUnknownReason',
}

type TestPipelineRuns = { [key in DataState]?: PipelineRunKind };

export const testPipelineRuns: TestPipelineRuns = {
  [DataState.RUNNING]: {
    ...samplePipelineRun,
    status: {
      conditions: [
        {
          lastTransitionTime: '2022-11-28T12:08:22Z',
          message: 'Tasks Completed: 0 (Failed: 0, Cancelled 0), Incomplete: 5, Skipped: 0',
          reason: 'Running',
          status: 'Unknown',
          type: 'Succeeded',
        },
      ],
      pipelineSpec: samplePipelineSpec,
      startTime: '2022-11-28T12:08:22Z',
      taskRuns: {
        'test-caseqfvdj-first': {
          pipelineTaskName: 'first',
          status: {
            conditions: [
              {
                lastTransitionTime: '2022-11-28T12:08:26Z',
                message:
                  'pod status "Initialized":"False"; message: "containers with incomplete status: [place-scripts]"',
                reason: 'Pending',
                status: 'Unknown',
                type: 'Succeeded',
              },
            ],
            podName: 'test-caseqfvdj-first-pod',
            startTime: '2022-11-28T12:08:22Z',
            steps: [
              {
                container: 'step-generate-first',
                name: 'generate-first',
                waiting: {
                  reason: 'PodInitializing',
                },
              },
            ],
            taskSpec: {
              results: [
                {
                  name: 'first',
                  type: 'string',
                },
              ],
              steps: [
                {
                  image: 'alpine',
                  name: 'generate-first',
                  resources: {},
                  script: 'echo -n "suffix" > /tekton/results/first\n',
                },
              ],
            },
          },
        },
      },
    },
  },
  [DataState.SUCCEEDED]: {
    ...samplePipelineRun,
    status: {
      completionTime: '2022-11-28T12:09:26Z',
      conditions: [
        {
          lastTransitionTime: '2022-11-28T12:09:26Z',
          message: 'Tasks Completed: 5 (Failed: 0, Cancelled 0), Skipped: 0',
          reason: 'Succeeded',
          status: 'True',
          type: 'Succeeded',
        },
      ],
      pipelineSpec: samplePipelineSpec,
      startTime: '2022-11-28T12:08:22Z',
      taskRuns: {
        'test-caseqfvdj-do-something': {
          pipelineTaskName: 'do-something',
          status: {
            completionTime: '2022-11-28T12:09:26Z',
            conditions: [
              {
                lastTransitionTime: '2022-11-28T12:09:26Z',
                message: 'All Steps have completed executing',
                reason: 'Succeeded',
                status: 'True',
                type: 'Succeeded',
              },
            ],
            podName: 'test-caseqfvdj-do-something-pod',
            startTime: '2022-11-28T12:09:18Z',
            steps: [
              {
                container: 'step-do-something',
                imageID:
                  'docker.io/library/alpine@sha256:8914eb54f968791faf6a8638949e480fef81e697984fba772b3976835194c6d4',
                name: 'do-something',
                terminated: {
                  containerID:
                    'cri-o://51ed1ddfa563e5149d0281ebc9c761967bf6bbb85c5454e0b34ae04066d8091c',
                  exitCode: 0,
                  finishedAt: '2022-11-28T12:09:26Z',
                  reason: 'Completed',
                  startedAt: '2022-11-28T12:09:26Z',
                },
              },
            ],
            taskSpec: {
              params: [
                {
                  name: 'arg',
                  type: 'string',
                },
              ],
              steps: [
                {
                  image: 'alpine',
                  name: 'do-something',
                  resources: {},
                  script: 'echo "prefix:suffix" | grep "prefix:suffix"\n',
                },
              ],
            },
          },
        },
        'test-caseqfvdj-finally-do-something': {
          pipelineTaskName: 'finally-do-something',
          status: {
            completionTime: '2022-11-28T12:09:16Z',
            conditions: [
              {
                lastTransitionTime: '2022-11-28T12:09:16Z',
                message: 'All Steps have completed executing',
                reason: 'Succeeded',
                status: 'True',
                type: 'Succeeded',
              },
            ],
            podName: 'test-caseqfvdj-finally-do-something-pod',
            startTime: '2022-11-28T12:09:09Z',
            steps: [
              {
                container: 'step-do-something',
                imageID:
                  'docker.io/library/alpine@sha256:8914eb54f968791faf6a8638949e480fef81e697984fba772b3976835194c6d4',
                name: 'do-something',
                terminated: {
                  containerID:
                    'cri-o://b453fd60a8b45b1ad06abd4a6a502f8e03fa1ccc09fed94d6fcab83d1ed3dc52',
                  exitCode: 0,
                  finishedAt: '2022-11-28T12:09:16Z',
                  reason: 'Completed',
                  startedAt: '2022-11-28T12:09:16Z',
                },
              },
            ],
            taskSpec: {
              params: [
                {
                  name: 'arg',
                  type: 'string',
                },
              ],
              steps: [
                {
                  image: 'alpine',
                  name: 'do-something',
                  resources: {},
                  script: 'echo "prefix:suffix:suffix" | grep "prefix:suffix"\n',
                },
              ],
            },
          },
        },
        'test-caseqfvdj-first': {
          pipelineTaskName: 'first',
          status: {
            completionTime: '2022-11-28T12:08:30Z',
            conditions: [
              {
                lastTransitionTime: '2022-11-28T12:08:30Z',
                message: 'All Steps have completed executing',
                reason: 'Succeeded',
                status: 'True',
                type: 'Succeeded',
              },
            ],
            podName: 'test-caseqfvdj-first-pod',
            startTime: '2022-11-28T12:08:22Z',
            steps: [
              {
                container: 'step-generate-first',
                imageID:
                  'docker.io/library/alpine@sha256:8914eb54f968791faf6a8638949e480fef81e697984fba772b3976835194c6d4',
                name: 'generate-first',
                terminated: {
                  containerID:
                    'cri-o://61d46933315e5056df24ff0126fbf014ca8c62587609608e8818c0210515cc06',
                  exitCode: 0,
                  finishedAt: '2022-11-28T12:08:30Z',
                  message: '[{"key":"first","value":"suffix","type":1}]',
                  reason: 'Completed',
                  startedAt: '2022-11-28T12:08:30Z',
                },
              },
            ],
            taskResults: [
              {
                name: 'first',
                type: 'string',
                value: 'suffix',
              },
            ],
            taskSpec: {
              results: [
                {
                  name: 'first',
                  type: 'string',
                },
              ],
              steps: [
                {
                  image: 'alpine',
                  name: 'generate-first',
                  resources: {},
                  script: 'echo -n "suffix" > /tekton/results/first\n',
                },
              ],
            },
          },
        },
        'test-caseqfvdj-generate-suffix': {
          pipelineTaskName: 'generate-suffix',
          status: {
            completionTime: '2022-11-28T12:09:18Z',
            conditions: [
              {
                lastTransitionTime: '2022-11-28T12:09:18Z',
                message: 'All Steps have completed executing',
                reason: 'Succeeded',
                status: 'True',
                type: 'Succeeded',
              },
            ],
            podName: 'test-caseqfvdj-generate-suffix-pod',
            startTime: '2022-11-28T12:09:09Z',
            steps: [
              {
                container: 'step-generate-suffix',
                imageID:
                  'docker.io/library/alpine@sha256:8914eb54f968791faf6a8638949e480fef81e697984fba772b3976835194c6d4',
                name: 'generate-suffix',
                terminated: {
                  containerID:
                    'cri-o://7910ab735cf33a15cbe785895f3bdedab43b36b52aeb088ba1c5bc2100bfdca2',
                  exitCode: 0,
                  finishedAt: '2022-11-28T12:09:18Z',
                  message: '[{"key":"suffix","value":"suffix","type":1}]',
                  reason: 'Completed',
                  startedAt: '2022-11-28T12:09:18Z',
                },
              },
            ],
            taskResults: [
              {
                name: 'suffix',
                type: 'string',
                value: 'suffix',
              },
            ],
            taskSpec: {
              results: [
                {
                  name: 'suffix',
                  type: 'string',
                },
              ],
              steps: [
                {
                  image: 'alpine',
                  name: 'generate-suffix',
                  resources: {},
                  script: 'echo -n "suffix" > /tekton/results/suffix\n',
                },
              ],
            },
          },
        },
        'test-caseqfvdj-second': {
          pipelineTaskName: 'second',
          status: {
            completionTime: '2022-11-28T12:09:09Z',
            conditions: [
              {
                lastTransitionTime: '2022-11-28T12:09:09Z',
                message: 'All Steps have completed executing',
                reason: 'Succeeded',
                status: 'True',
                type: 'Succeeded',
              },
            ],
            podName: 'test-caseqfvdj-second-pod',
            startTime: '2022-11-28T12:08:31Z',
            steps: [
              {
                container: 'step-generate-second',
                imageID:
                  'docker.io/library/alpine@sha256:8914eb54f968791faf6a8638949e480fef81e697984fba772b3976835194c6d4',
                name: 'generate-second',
                terminated: {
                  containerID:
                    'cri-o://ec8a37210d1de1f6e6e4195f20fc71cdd064aa11250c5c561a492e314209c6b9',
                  exitCode: 0,
                  finishedAt: '2022-11-28T12:09:08Z',
                  message: '[{"key":"two","value":"suffix","type":1}]',
                  reason: 'Completed',
                  startedAt: '2022-11-28T12:08:38Z',
                },
              },
            ],
            taskResults: [
              {
                name: 'two',
                type: 'string',
                value: 'suffix',
              },
            ],
            taskSpec: {
              results: [
                {
                  name: 'two',
                  type: 'string',
                },
              ],
              steps: [
                {
                  image: 'alpine',
                  name: 'generate-second',
                  resources: {},
                  script: 'sleep 30\necho -n "suffix" > /tekton/results/two\n',
                },
              ],
            },
          },
        },
      },
    },
  },
  [DataState.SKIPPED]: {
    apiVersion: 'tekton.dev/v1beta1',
    kind: 'PipelineRun',
    metadata: {
      name: 'when-expression-pipeline-cx05c9',
      namespace: 'tekton-pipelines',
      labels: {
        'tekton.dev/pipeline': 'when-expression-pipeline',
      },
    },
    spec: {
      params: [
        {
          name: 'path',
          value: 'README.txt',
        },
      ],
      pipelineRef: {
        name: 'when-expression-pipeline',
      },
      resources: [
        {
          name: 'source-repo',
          resourceRef: {
            name: 'pipeline-git',
          },
        },
      ],
      serviceAccountName: 'pipeline',
      timeout: '1h0m0s',
    },
    status: {
      completionTime: '2021-01-13T14:34:19Z',
      conditions: [
        {
          lastTransitionTime: '2021-01-13T14:34:19Z',
          message: 'Tasks Completed: 1 (Failed: 0, Cancelled 0), Skipped: 1',
          reason: 'ConditionCheckFailed',
          status: 'True',
          type: 'Succeeded',
        },
      ],
      pipelineSpec: {
        params: [
          {
            default: 'README.md',
            name: 'path',
            type: 'string',
          },
        ],
        resources: [
          {
            name: 'source-repo',
            type: 'git',
          },
        ],
        tasks: [
          {
            name: 'first-create-file',
            resources: {
              outputs: [
                {
                  name: 'workspace',
                  resource: 'source-repo',
                },
              ],
            },
            taskRef: {
              kind: 'Task',
              name: 'create-readme-file',
            },
          },
          {
            name: 'then-check',
            taskRef: {
              kind: 'Task',
              name: 'echo-hello',
            },
            when: [
              {
                input: '$(params.path)',
                operator: 'in',
                values: ['README.md'],
              },
            ],
          },
        ],
      },
      skippedTasks: [
        {
          name: 'then-check',
        },
      ],
      startTime: '2021-01-13T14:33:59Z',
      taskRuns: {
        'when-expression-pipeline-cx05c9-first-create-file-4sqr2': {
          pipelineTaskName: 'first-create-file',
          status: {
            completionTime: '2021-01-13T14:34:19Z',
            conditions: [
              {
                lastTransitionTime: '2021-01-13T14:34:19Z',
                message: 'All Steps have completed executing',
                reason: 'Succeeded',
                status: 'True',
                type: 'Succeeded',
              },
            ],
            podName: 'when-expression-pipeline-cx05c9-first-create-file-4sqr2-p-2p5j8',
            startTime: '2021-01-13T14:33:59Z',
          },
        },
      },
    },
  },
  [DataState.PIPELINE_RUN_PENDING]: {
    ...samplePipelineRun,
    spec: {
      ...samplePipelineRun,
      status: 'PipelineRunPending',
    },
    status: {
      pipelineSpec: samplePipelineSpec,
      completionTime: '2019-10-29T11:57:53Z',
      conditions: [
        {
          lastTransitionTime: '2019-09-12T20:38:01Z',
          message: 'All Tasks have completed executing',
          reason: 'ExceededResourceQuota',
          status: 'True',
          type: 'Succeeded',
        },
      ],
    },
  },

  [DataState.PIPELINE_RUN_CANCELLED]: {
    ...samplePipelineRun,
    spec: {
      ...samplePipelineRun,
      status: 'CancelledRunFinally',
    },
    status: {
      completionTime: '2022-11-28T07:10:43Z',
      conditions: [
        {
          lastTransitionTime: '2022-11-28T07:10:43Z',
          message: 'PipelineRun "test-casevcgrn" was cancelled',
          reason: 'Cancelled',
          status: 'False',
          type: 'Succeeded',
        },
      ],
      pipelineSpec: samplePipelineSpec,
      skippedTasks: [
        {
          name: 'second',
          reason: 'PipelineRun was stopping',
        },
        {
          name: 'generate-suffix',
          reason: 'PipelineRun was stopping',
        },
        {
          name: 'do-something',
          reason: 'PipelineRun was stopping',
        },
        {
          name: 'finally-do-something',
          reason: 'PipelineRun was stopping',
        },
      ],
      startTime: '2022-11-28T07:10:37Z',
      taskRuns: {
        'test-casevcgrn-first': {
          pipelineTaskName: 'first',
          status: {
            completionTime: '2022-11-28T07:10:43Z',
            conditions: [
              {
                lastTransitionTime: '2022-11-28T07:10:43Z',
                message: 'TaskRun "test-casevcgrn-first" was cancelled',
                reason: 'TaskRunCancelled',
                status: 'False',
                type: 'Succeeded',
              },
            ],
            podName: 'test-casevcgrn-first-pod',
            startTime: '2022-11-28T07:10:37Z',
            steps: [
              {
                container: 'step-generate-first',
                imageID:
                  'docker.io/library/alpine@sha256:8914eb54f968791faf6a8638949e480fef81e697984fba772b3976835194c6d4',
                name: 'generate-first',
                terminated: {
                  exitCode: 1,
                  finishedAt: '2022-11-28T07:10:43Z',
                  reason: 'TaskRunCancelled',
                  startedAt: '2022-11-28T07:10:42Z',
                },
              },
            ],
            taskSpec: {
              results: [
                {
                  name: 'first',
                  type: 'string',
                },
              ],
              steps: [
                {
                  image: 'alpine',
                  name: 'generate-first',
                  resources: {},
                  script: 'echo -n "suffix" > /tekton/results/first\n',
                },
              ],
            },
          },
        },
      },
    },
  },
  [DataState.PIPELINE_RUN_STOPPED]: {
    ...samplePipelineRun,
    spec: {
      ...samplePipelineRun.spec,
      status: 'StoppedRunFinally',
    },
    status: {
      completionTime: '2022-11-28T07:10:43Z',
      conditions: [
        {
          lastTransitionTime: '2022-11-28T07:10:43Z',
          message: 'PipelineRun "test-casevcgrn" was cancelled',
          reason: 'Cancelled',
          status: 'False',
          type: 'Succeeded',
        },
      ],
      pipelineSpec: samplePipelineSpec,
      skippedTasks: [
        {
          name: 'second',
          reason: 'PipelineRun was stopping',
        },
        {
          name: 'generate-suffix',
          reason: 'PipelineRun was stopping',
        },
        {
          name: 'do-something',
          reason: 'PipelineRun was stopping',
        },
        {
          name: 'finally-do-something',
          reason: 'PipelineRun was stopping',
        },
      ],
      startTime: '2022-11-28T07:10:37Z',
      taskRuns: {
        'test-casevcgrn-first': {
          pipelineTaskName: 'first',
          status: {
            completionTime: '2022-11-28T07:10:43Z',
            conditions: [
              {
                lastTransitionTime: '2022-11-28T07:10:43Z',
                message: 'TaskRun "test-casevcgrn-first" was cancelled',
                reason: 'TaskRunCancelled',
                status: 'False',
                type: 'Succeeded',
              },
            ],
            podName: 'test-casevcgrn-first-pod',
            startTime: '2022-11-28T07:10:37Z',
            steps: [
              {
                container: 'step-generate-first',
                imageID:
                  'docker.io/library/alpine@sha256:8914eb54f968791faf6a8638949e480fef81e697984fba772b3976835194c6d4',
                name: 'generate-first',
                terminated: {
                  exitCode: 1,
                  finishedAt: '2022-11-28T07:10:43Z',
                  reason: 'TaskRunCancelled',
                  startedAt: '2022-11-28T07:10:42Z',
                },
              },
            ],
            taskSpec: {
              results: [
                {
                  name: 'first',
                  type: 'string',
                },
              ],
              steps: [
                {
                  image: 'alpine',
                  name: 'generate-first',
                  resources: {},
                  script: 'echo -n "suffix" > /tekton/results/first\n',
                },
              ],
            },
          },
        },
      },
    },
  },
  [DataState.FAILED]: {
    ...samplePipelineRun,
    status: {
      pipelineSpec: samplePipelineSpec,
      conditions: [
        { status: 'True', type: 'Failure' },
        { status: 'False', type: 'Succeeded' },
      ],
    },
  },
  [DataState.PIPELINE_RUN_CANCELLING]: {
    ...samplePipelineRun,
    spec: {
      ...samplePipelineRun,
      status: 'CancelledRunFinally',
    },
    status: {
      conditions: [{ status: 'True', type: 'Succeeded' }],
      pipelineSpec: samplePipelineSpec,
    },
  },
  [DataState.STATUS_WITHOUT_CONDITIONS]: {
    ...samplePipelineRun,
    status: {
      pipelineSpec: samplePipelineSpec,
    },
  },
  [DataState.STATUS_WITHOUT_CONDITIONS]: {
    ...samplePipelineRun,
    status: {
      conditions: [],
      pipelineSpec: samplePipelineSpec,
    },
  },
  [DataState.TASK_RUN_CANCELLED]: {
    ...samplePipelineRun,
    status: {
      conditions: [
        {
          lastTransitionTime: '2022-11-28T07:10:43Z',
          message: 'TaskRun "test-casevcgrn" was cancelled',
          reason: 'TaskRunCancelled',
          status: 'False',
          type: 'Succeeded',
        },
      ],
      pipelineSpec: samplePipelineSpec,
    },
  },
  [DataState.PIPELINE_RUN_STOPPING]: {
    ...samplePipelineRun,
    status: {
      pipelineSpec: samplePipelineSpec,
      conditions: [{ type: 'Succeeded', status: 'Unknown', reason: 'PipelineRunStopping' }],
    },
  },
  [DataState.TASK_RUN_STOPPING]: {
    ...samplePipelineRun,
    status: {
      pipelineSpec: samplePipelineSpec,
      conditions: [{ type: 'Succeeded', status: 'Unknown', reason: 'TaskRunStopping' }],
    },
  },
  [DataState.STATUS_WITHOUT_CONDITION_TYPE]: {
    ...samplePipelineRun,
    status: {
      pipelineSpec: samplePipelineSpec,
      conditions: [{ type: undefined, status: 'Unknown', reason: 'Unknown' }],
    },
  },
  [DataState.STATUS_WITH_UNKNOWN_REASON]: {
    ...samplePipelineRun,
    status: {
      pipelineSpec: samplePipelineSpec,
      conditions: [{ type: 'Succeeded', status: 'False', reason: 'Unknown' }],
    },
  },
};
