import { ComponentKind } from '../../../../../../../../types';
import { PipelineRunKind } from '../../../../../../../types';
import {
  EnvironmentKind,
  IntegrationTestScenarioKind,
  ReleaseKind,
  ReleasePlanKind,
} from '../../../../../../../types/coreBuildService';

export const sampleBuildPipelines: PipelineRunKind[] = [
  {
    apiVersion: 'tekton.dev/v1beta1',
    kind: 'PipelineRun',
    metadata: {
      name: '1-nodejs-2bwzn',
      uid: '94c9a362-f5a5-4e67-b642-c61c6d1134dc',
      namespace: 'karthik-jk',
      labels: {
        'appstudio.openshift.io/component': '1-nodejs',
        'pipelines.openshift.io/runtime': 'generic',
        'pipelines.openshift.io/strategy': 'docker',
        'tekton.dev/pipeline': 'docker-build',
        'pipelines.openshift.io/used-by': 'build-cloud',
        'pipelinesascode.tekton.dev/sha': '010101010110',
        'build.appstudio.openshift.io/build': 'true',
        'build.appstudio.openshift.io/application': 'frontend-app',
        'build.appstudio.openshift.io/type': 'build',
        'pipelines.appstudio.openshift.io/type': 'build',
        'build.appstudio.openshift.io/version': '0.1',
      },
      annotations: {
        'pipelinesascode.tekton.dev/on-target-branch': '[main,master]',
        'pipelinesascode.tekton.dev/repo-url': 'https://github.com/karthikjeeyar/test-nodeapp',
        'pipelinesascode.tekton.dev/sha-title': 'Appstudio update test-nodeapp',
        'pipelinesascode.tekton.dev/git-auth-secret': 'pac-gitauth-tfts',
        'appstudio.redhat.com/updateComponentOnSuccess': 'false',
        'build.appstudio.openshift.io/repo': 'https://github.com/karthikjeeyar/test-nodeapp',
        'build.appstudio.redhat.com/target_branch': 'main',
        'pipelinesascode.tekton.dev/max-keep-runs': '3',
        'build.appstudio.redhat.com/pull_request_number': '9',
        'pipelinesascode.tekton.dev/pull-request': '9',
        'pipelinesascode.tekton.dev/sha-url':
          'https://github.com/karthikjeeyar/test-nodeapp/commit/d187a69d325469f38fd354a02a2705d95cc6abbe',
        'pipelinesascode.tekton.dev/on-event': '[pull_request]',
        'pipelinesascode.tekton.dev/installation-id': '29976162',
        'build.appstudio.redhat.com/commit_sha': 'd187a69d325469f38fd354a02a2705d95cc6abbe',
        'build.appstudio.openshift.io/image':
          'quay.io/karthik_jk/test-nodeapp:on-pr-d187a69d325469f38fd354a02a2705d95cc6abbe',
      },
    },
    spec: {
      params: [
        {
          name: 'git-url',
          value: 'https://github.com/karthikjeeyar/demo-app',
        },
        {
          name: 'output-image',
          value: '',
        },
        {
          name: 'dockerfile',
          value: 'Dockerfile',
        },
        {
          name: 'path-context',
          value: '.',
        },
      ],
      pipelineRef: {
        bundle:
          'quay.io/redhat-appstudio/build-templates-bundle:19cf17aa63a1c65eee897af8430dbb9c1682d77a',
        name: 'docker-build',
      },
      serviceAccountName: 'pipeline',
      timeout: '1h0m0s',
      workspaces: [
        {
          name: 'workspace',
          persistentVolumeClaim: {
            claimName: 'appstudio',
          },
          subPath: '1-nodejs/initialbuild-2022-Feb-13_12-39-17',
        },
        {
          name: 'registry-auth',
          secret: {
            secretName: 'redhat-appstudio-registry-pull-secret',
          },
        },
      ],
    },
    status: {
      pipelineSpec: {
        tasks: [],
      },
      conditions: [
        {
          message: 'failed to create task run pod "1-nodejs-2bwzn-show-summary',
          status: 'False',
          type: 'Succeeded',
        },
      ],
      taskRuns: {
        '1-nodejs-2bwzn-show-summary': {
          pipelineTaskName: 'show-summary',
          status: {
            completionTime: '2022-08-23T19:08:18Z',
            conditions: [
              {
                lastTransitionTime: '2022-08-23T19:08:18Z',
                message:
                  'failed to create task run pod "1-nodejs-2bwzn-show-summary": Pod "1-nodejs-2bwzn-show-summary-pod" is invalid: spec.activeDeadlineSeconds: Invalid value: 0: must be between 1 and 2147483647, inclusive. Maybe missing or invalid Task mfrances/summary',
                reason: 'CouldntGetTask',
                status: 'False',
                type: 'Succeeded',
              },
            ],
            podName: '',
            startTime: '2022-08-23T19:08:18Z',
            taskSpec: {
              description: 'App Studio Summary Pipeline Task.',
              params: [
                {
                  description: 'pipeline-run to annotate',
                  name: 'pipeline-run-name',
                  type: 'string',
                },
                {
                  description: 'Git URL',
                  name: 'git-url',
                  type: 'string',
                },
                {
                  description: 'Image URL',
                  name: 'image-url',
                  type: 'string',
                },
              ],
              steps: [
                {
                  image:
                    'registry.redhat.io/openshift4/ose-cli@sha256:e6b307c51374607294d1756b871d3c702251c396efdd44d4ef8db68e239339d3',
                  name: 'appstudio-summary',
                  resources: {},
                  script: [
                    '#!/usr/bin/env bash\necho\necho "App Studio Build Summary:"\necho\necho "Build repository: $(params.git-url)"\necho "Generated Image is in : $(params.image-url)"\necho\noc annotate pipelinerun $(params.pipeline-run-name) build.appstudio.openshift.io/repo=$(params.git-url)\noc annotate pipelinerun $(params.pipeline-run-name) build.appstudio.openshift.io/image=$(params.image-url)\n\necho "Output is in the following annotations:"\n\necho "Build Repo is in \'build.appstudio.openshift.io/repo\' "\necho \'oc get pr $(params.pipeline-run-name) -o jsonpath="{.metadata.annotations.build\\.appstudio\\.openshift\\.io/repo}"\'\n\necho "Build Image is in \'build.appstudio.openshift.io/image\' "\necho \'oc get pr $(params.pipeline-run-name) -o jsonpath="{.metadata.annotations.build\\.appstudio\\.openshift\\.io/image}"\'\n\necho End Summary\n',
                  ],
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
      name: '1-nodejs-2bwzn',
      uid: '94c9a362-f5a5-4e67-b642-c61c6d1134dc',
      namespace: 'karthik-jk',
      labels: {
        'build.appstudio.openshift.io/component': '1-nodejs',
        'pipelines.openshift.io/runtime': 'generic',
        'pipelines.openshift.io/strategy': 'docker',
        'tekton.dev/pipeline': 'docker-build',
        'pipelines.openshift.io/used-by': 'build-cloud',
        'build.appstudio.openshift.io/build': 'true',
        'build.appstudio.openshift.io/application': 'frontend-app',
        'build.appstudio.openshift.io/type': 'build',
        'pipelines.appstudio.openshift.io/type': 'build',
        'build.appstudio.openshift.io/version': '0.1',
        'pipelinesascode.tekton.dev/sha': '010101010110',
      },
      annotations: {
        'build.appstudio.openshift.io/component': '1-nodejs',
        'pipelines.openshift.io/runtime': 'generic',
      },
    },
    spec: {
      params: [
        {
          name: 'git-url',
          value: 'https://github.com/karthikjeeyar/demo-app',
        },
        {
          name: 'output-image',
          value: '',
        },
        {
          name: 'dockerfile',
          value: 'Dockerfile',
        },
        {
          name: 'path-context',
          value: '.',
        },
      ],
      pipelineRef: {
        bundle:
          'quay.io/redhat-appstudio/build-templates-bundle:19cf17aa63a1c65eee897af8430dbb9c1682d77a',
        name: 'docker-build',
      },
      serviceAccountName: 'pipeline',
      timeout: '1h0m0s',
      workspaces: [
        {
          name: 'workspace',
          persistentVolumeClaim: {
            claimName: 'appstudio',
          },
          subPath: '1-nodejs/initialbuild-2022-Feb-13_12-39-17',
        },
        {
          name: 'registry-auth',
          secret: {
            secretName: 'redhat-appstudio-registry-pull-secret',
          },
        },
      ],
    },
  },
];

export const sampleTestPipelines: PipelineRunKind[] = [
  {
    apiVersion: 'tekton.dev/v1beta1',
    kind: 'PipelineRun',
    metadata: {
      annotations: {
        'pipelinesascode.tekton.dev/git-auth-secret': 'pac-gitauth-wfqw',
        'pipelinesascode.tekton.dev/installation-id': '29976162',
        'pipelinesascode.tekton.dev/max-keep-runs': '3',
        'pipelinesascode.tekton.dev/on-event': '[pull_request]',
        'pipelinesascode.tekton.dev/on-target-branch': '[main,master]',
        'pipelinesascode.tekton.dev/pull-request': '4',
        'pipelinesascode.tekton.dev/repo-url': 'https://github.com/karthikjeeyar/nodeapp',
        'pipelinesascode.tekton.dev/sha-title': 'Appstudio update nodeapp',
        'pipelinesascode.tekton.dev/sha-url':
          'https://github.com/karthikjeeyar/nodeapp/commit/863b1c27b22cdf9bf906c47de9d1ded3762f4dcf',
        'results.tekton.dev/record':
          'karthik-jk/results/4debc5e2-4a44-4bcd-bc71-e29d002b832a/records/4debc5e2-4a44-4bcd-bc71-e29d002b832a',
        'results.tekton.dev/result': 'karthik-jk/results/4debc5e2-4a44-4bcd-bc71-e29d002b832a',
      },
      creationTimestamp: '2022-11-19T11:41:05Z',
      finalizers: ['pipelinesascode.tekton.dev', 'chains.tekton.dev/pipelinerun'],
      generateName: 'test-application-5v6l9-',
      generation: 1,
      labels: {
        'pipelines.appstudio.openshift.io/type': 'test',
        'pipelinesascode.tekton.dev/branch': 'main',
        'pipelinesascode.tekton.dev/event-type': 'pull_request',
        'pipelinesascode.tekton.dev/git-provider': 'github',
        'pipelinesascode.tekton.dev/original-prname': '1-nodejs-on-pull-request',
        'pipelinesascode.tekton.dev/repository': '1-nodejs',
        'pipelinesascode.tekton.dev/sender': 'karthikjeeyar',
        'pipelinesascode.tekton.dev/sha': '863b1c27b22cdf9bf906c47de9d1ded3762f4dcf',
        'pipelinesascode.tekton.dev/state': 'started',
        'pipelinesascode.tekton.dev/url-org': 'karthikjeeyar',
        'pipelinesascode.tekton.dev/url-repository': '1-nodejs',
        'tekton.dev/pipeline': 'component-pipeline-pass',
        'test.appstudio.openshift.io/application': 'test-application',
        'test.appstudio.openshift.io/component': '1-nodejs',
        'test.appstudio.openshift.io/scenario': 'component-integration-test',
        'test.appstudio.openshift.io/snapshot': 'test-snapshot-5v6l9',
      },
      name: 'test-application-5v6l9-4cpnx',
      namespace: 'karthik-jk',
      ownerReferences: [
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          blockOwnerDeletion: true,
          controller: true,
          kind: 'Snapshot',
          name: 'test-application-5v6l9',
          uid: '75fb18ee-13c1-451e-8008-208c1d23e72a',
        },
      ],
      resourceVersion: '418933',
      uid: '4debc5e2-4a44-4bcd-bc71-e29d002b832a',
    },
    spec: {
      params: [
        {
          name: 'SNAPSHOT',
          value:
            '{"application":"test-application","components":[{"name":"1-nodejs","containerImage":"quay.io/karthik_jk/nodeapp@sha256:5815b5943ba9d7d711fc089b8021516376ed746dd7dd03150b4a1faee221f7da"}],"artifacts":{}}',
        },
      ],
      pipelineRef: {
        bundle: 'quay.io/kpavic/test-bundle:component-pipeline-pass',
        name: 'component-pipeline-pass',
      },
      serviceAccountName: 'pipeline',
      timeout: '1h0m0s',
    },
    status: {
      completionTime: '2022-11-19T11:41:15Z',
      conditions: [
        {
          lastTransitionTime: '2022-11-19T11:41:15Z',
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
              bundle: 'quay.io/kpavic/test-bundle:test-output',
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
              bundle: 'quay.io/kpavic/test-bundle:test-output',
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
              bundle: 'quay.io/kpavic/test-bundle:test-output',
              kind: 'Task',
              name: 'test-output',
            },
          },
        ],
      },
      startTime: '2022-11-19T11:41:05Z',
      taskRuns: {
        'test-application-5v6l9-4cpnx-task-skipped': {
          pipelineTaskName: 'task-skipped',
          status: {
            completionTime: '2022-11-19T11:41:15Z',
            conditions: [
              {
                lastTransitionTime: '2022-11-19T11:41:15Z',
                message: 'All Steps have completed executing',
                reason: 'Succeeded',
                status: 'True',
                type: 'Succeeded',
              },
            ],
            podName: 'test-application-5v6l9-4cpnx-task-skipped-pod',
            startTime: '2022-11-19T11:41:06Z',
            steps: [
              {
                container: 'step-unnamed-0',
                imageID:
                  'quay.io/redhat-appstudio/hacbs-test@sha256:581f9e27c748f9900e32a152293b6dffbaa3e390775f3c36c3860c6ed6c87b73',
                name: 'unnamed-0',
                terminated: {
                  containerID:
                    'cri-o://5e65589a2a2321a4cc9195ac3a49eec40d91a18c247c209aaac5774232096c24',
                  exitCode: 0,
                  finishedAt: '2022-11-19T11:41:14Z',
                  message:
                    '[{"key":"HACBS_TEST_OUTPUT","value":"{\\"result\\":\\"SKIPPED\\",\\"timestamp\\":\\"1668858074\\",\\"failures\\":[],\\"successes\\":0}\\n","type":1}]',
                  reason: 'Completed',
                  startedAt: '2022-11-19T11:41:14Z',
                },
              },
            ],
            taskResults: [
              {
                name: 'HACBS_TEST_OUTPUT',
                value:
                  '{"result":"SKIPPED","timestamp":"1668858074","failures":[],"successes":0}\n',
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
                  name: 'HACBS_TEST_OUTPUT',
                },
              ],
              steps: [
                {
                  image: 'quay.io/redhat-appstudio/hacbs-test:stable',
                  name: '',
                  resources: {},
                },
              ],
            },
          },
        },
        'test-application-5v6l9-4cpnx-task-success': {
          pipelineTaskName: 'task-success',
          status: {
            completionTime: '2022-11-19T11:41:13Z',
            conditions: [
              {
                lastTransitionTime: '2022-11-19T11:41:13Z',
                message: 'All Steps have completed executing',
                reason: 'Succeeded',
                status: 'True',
                type: 'Succeeded',
              },
            ],
            podName: 'test-application-5v6l9-4cpnx-task-success-pod',
            startTime: '2022-11-19T11:41:05Z',
            steps: [
              {
                container: 'step-unnamed-0',
                imageID:
                  'quay.io/redhat-appstudio/hacbs-test@sha256:581f9e27c748f9900e32a152293b6dffbaa3e390775f3c36c3860c6ed6c87b73',
                name: 'unnamed-0',
                terminated: {
                  containerID:
                    'cri-o://4b8241c833a2800f04e2c64a249683960804d7fdd0ebd9b6bc97193efb38ee96',
                  exitCode: 0,
                  finishedAt: '2022-11-19T11:41:12Z',
                  message:
                    '[{"key":"HACBS_TEST_OUTPUT","value":"{\\"result\\":\\"SUCCESS\\",\\"timestamp\\":\\"1668858072\\",\\"failures\\":[],\\"successes\\":0}\\n","type":1}]',
                  reason: 'Completed',
                  startedAt: '2022-11-19T11:41:12Z',
                },
              },
            ],
            taskResults: [
              {
                name: 'HACBS_TEST_OUTPUT',
                value:
                  '{"result":"SUCCESS","timestamp":"1668858072","failures":[],"successes":0}\n',
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
                  name: 'HACBS_TEST_OUTPUT',
                },
              ],
              steps: [
                {
                  image: 'quay.io/redhat-appstudio/hacbs-test:stable',
                  name: '',
                  resources: {},
                },
              ],
            },
          },
        },
        'test-application-5v6l9-4cpnx-task-success-2': {
          pipelineTaskName: 'task-success-2',
          status: {
            completionTime: '2022-11-19T11:41:13Z',
            conditions: [
              {
                lastTransitionTime: '2022-11-19T11:41:13Z',
                message: 'All Steps have completed executing',
                reason: 'Succeeded',
                status: 'True',
                type: 'Succeeded',
              },
            ],
            podName: 'test-application-5v6l9-4cpnx-task-success-2-pod',
            startTime: '2022-11-19T11:41:05Z',
            steps: [
              {
                container: 'step-unnamed-0',
                imageID:
                  'quay.io/redhat-appstudio/hacbs-test@sha256:581f9e27c748f9900e32a152293b6dffbaa3e390775f3c36c3860c6ed6c87b73',
                name: 'unnamed-0',
                terminated: {
                  containerID:
                    'cri-o://5e3197c9eb61a6e1d5f0fc92e193872768fcc6b0d1f27ffe18d566cdfc9458fb',
                  exitCode: 0,
                  finishedAt: '2022-11-19T11:41:12Z',
                  message:
                    '[{"key":"HACBS_TEST_OUTPUT","value":"{\\"result\\":\\"SUCCESS\\",\\"timestamp\\":\\"1668858072\\",\\"failures\\":[],\\"successes\\":0}\\n","type":1}]',
                  reason: 'Completed',
                  startedAt: '2022-11-19T11:41:12Z',
                },
              },
            ],
            taskResults: [
              {
                name: 'HACBS_TEST_OUTPUT',
                value:
                  '{"result":"SUCCESS","timestamp":"1668858072","failures":[],"successes":0}\n',
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
                  name: 'HACBS_TEST_OUTPUT',
                },
              ],
              steps: [
                {
                  image: 'quay.io/redhat-appstudio/hacbs-test:stable',
                  name: '',
                  resources: {},
                },
              ],
            },
          },
        },
      },
    },
  },
];

export const sampleSnapshotsEnvironmentBindings = [
  {
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    kind: 'SnapshotEnvironmentBinding',
    metadata: {
      labels: {
        'test.appstudio.openshift.io/component': '1-nodejs',
        'test.appstudio.openshift.io/type': 'component',
      },
      name: 'snapshot-environment-binding',
      namespace: 'test-ns',
      resourceVersion: '418386',
      uid: '75fb18ee-13c1-451e-8008-208c1d23e72a',
    },
    spec: {
      application: 'test-application;',
      components: [
        {
          name: '1-nodejs',
        },
      ],
      environment: 'test-environment',
      snapshot: 'test-snapshot-5v6l9',
    },
  },
];

export const sampleComponents: ComponentKind[] = [
  {
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    kind: 'Component',
    metadata: {
      annotations: {
        'com.redhat.appstudio/component-initial-build-happend': 'true',
        'com.redhat.appstudio/component-initial-build-processed': 'true',
      },
      name: '1-nodejs',
      uid: '585309d5-6156-427b-8fd3-ea55cb1b2606',
    },
    spec: {
      application: 'frontend-app',
      componentName: '1-nodejs',
      containerImage: 'quay.io/redhat-appstudio/user-workload:karthik-jk-1-nodejs',
      replicas: 1,
      resources: {
        requests: {
          cpu: '1',
          memory: '1Gi',
        },
      },
      source: {
        git: {
          devfileUrl: 'https://registry.devfile.io/devfiles/nodejs-basic',
          url: 'https://github.com/karthikjeeyar/demo-app',
        },
      },
      targetPort: 3000,
    },
    status: {
      conditions: [
        {
          lastTransitionTime: '2022-05-13T12:39:17Z',
          message: 'Component has been successfully created',
          reason: 'OK',
          status: 'True',
          type: 'Created',
        },
        {
          lastTransitionTime: '2022-06-06T14:22:46Z',
          message: 'Component has been successfully updated',
          reason: 'OK',
          status: 'True',
          type: 'Updated',
        },
      ],
      containerImage: 'quay.io/redhat-appstudio/user-workload:karthik-jk-1-nodejs',
      devfile:
        "commands:\n- attributes:\n    api.devfile.io/imported-from: 'id: nodejs, registryURL: https://registry.devfile.io'\n  exec:\n    commandLine: npm install\n    component: runtime\n    group:\n      isDefault: true\n      kind: build\n    hotReloadCapable: false\n    workingDir: ${PROJECT_SOURCE}\n  id: install\n- attributes:\n    api.devfile.io/imported-from: 'id: nodejs, registryURL: https://registry.devfile.io'\n  exec:\n    commandLine: npm start\n    component: runtime\n    group:\n      isDefault: true\n      kind: run\n    hotReloadCapable: false\n    workingDir: ${PROJECT_SOURCE}\n  id: run\n- attributes:\n    api.devfile.io/imported-from: 'id: nodejs, registryURL: https://registry.devfile.io'\n  exec:\n    commandLine: npm run debug\n    component: runtime\n    group:\n      isDefault: true\n      kind: debug\n    hotReloadCapable: false\n    workingDir: ${PROJECT_SOURCE}\n  id: debug\n- attributes:\n    api.devfile.io/imported-from: 'id: nodejs, registryURL: https://registry.devfile.io'\n  exec:\n    commandLine: npm test\n    component: runtime\n    group:\n      isDefault: true\n      kind: test\n    hotReloadCapable: false\n    workingDir: ${PROJECT_SOURCE}\n  id: test\n- apply:\n    component: outerloop-build\n  id: build-image\n- apply:\n    component: outerloop-deploy\n  id: deployk8s\n- composite:\n    commands:\n    - build-image\n    - deployk8s\n    group:\n      isDefault: true\n      kind: deploy\n    parallel: false\n  id: deploy\ncomponents:\n- attributes:\n    api.devfile.io/imported-from: 'id: nodejs, registryURL: https://registry.devfile.io'\n    appstudio.has/replicas: 1\n  container:\n    cpuRequest: \"1\"\n    dedicatedPod: true\n    endpoints:\n    - name: http-3000\n      secure: false\n      targetPort: 3000\n    image: registry.access.redhat.com/ubi8/nodejs-14:latest\n    memoryLimit: 1024Mi\n    memoryRequest: 1Gi\n    mountSources: true\n  name: runtime\n- image:\n    dockerfile:\n      buildContext: .\n      rootRequired: false\n      uri: Dockerfile\n    imageName: nodejs-image:latest\n  name: outerloop-build\n- attributes:\n    deployment/container-port: 3000\n    deployment/cpuRequest: \"1\"\n    deployment/memoryRequest: 1Gi\n    deployment/replicas: 1\n    deployment/storageRequest: \"0\"\n  kubernetes:\n    uri: outerloop-deploy.yaml\n  name: outerloop-deploy\nmetadata:\n  attributes:\n    alpha.dockerimage-port: 3001\n  description: Stack with Node.js 14\n  displayName: Node.js Runtime\n  language: nodejs\n  name: nodejs\n  projectType: nodejs\n  provider: Red Hat\n  supportUrl: https://github.com/devfile-samples/devfile-support#support-information\n  tags:\n  - NodeJS\n  - Express\n  - ubi8\n  version: 1.0.1\nschemaVersion: 2.2.0\nstarterProjects:\n- attributes:\n    api.devfile.io/imported-from: 'id: nodejs, registryURL: https://registry.devfile.io'\n  git:\n    remotes:\n      origin: https://github.com/odo-devfiles/nodejs-ex.git\n  name: nodejs-starter\n",
      gitops: {
        repositoryURL:
          'https://github.com/redhat-appstudio-appdata/frontend-app-karthik-jk-be-involvement',
      },
    },
  },
];

export const sampleEnvironments: EnvironmentKind[] = [
  {
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    kind: 'Environment',
    metadata: {
      name: 'test-environment',
      uid: '210d9440-2ebf-49c7-a6df-1fa5d21cb111',
    },
    spec: {
      configuration: {
        env: [
          {
            name: 'env',
            value: 'test',
          },
        ],
      },
      deploymentStrategy: 'Manual',
      displayName: 'Test Environment',
      tags: ['test'],
      type: 'poc',
    },
  },
  {
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    kind: 'Environment',
    metadata: {
      name: 'staging-environment',
      uid: '210d9440-2ebf-49c7-a6df-1fa5d21cb112',
    },
    spec: {
      configuration: {
        env: [
          {
            name: 'env',
            value: 'stage',
          },
        ],
      },
      parentEnvironment: 'test-environment',
      deploymentStrategy: 'Manual',
      displayName: 'Staging Environment',
      tags: ['stage'],
      type: 'poc',
    },
  },
  {
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    kind: 'Environment',
    metadata: {
      name: 'production-environment',
      uid: '210d9440-2ebf-49c7-a6df-1fa5d21cb113',
    },
    spec: {
      configuration: {
        env: [
          {
            name: 'env',
            value: 'prod',
          },
        ],
      },
      parentEnvironment: 'staging-environment',
      deploymentStrategy: 'Manual',
      displayName: 'Staging Environment',
      tags: ['prod'],
      type: 'poc',
    },
  },
];

export const sampleEnvironmentsWithInvalidParentEnvironment: EnvironmentKind[] = [
  ...sampleEnvironments,
  {
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    kind: 'Environment',
    metadata: {
      name: 'testing-environment',
      uid: '210d9440-2ebf-49c7-a6df-1fa5d21cb111',
    },
    spec: {
      configuration: {
        env: [
          {
            name: 'env',
            value: 'prod',
          },
        ],
      },
      parentEnvironment: 'invalid-environment',
      deploymentStrategy: 'Manual',
      displayName: 'Staging Environment',
      tags: ['prod'],
      type: 'poc',
    },
  },
];

export const sampleIntegrationTestScenarios: IntegrationTestScenarioKind[] = [
  {
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    kind: 'IntegrationTestScenario',
    metadata: {
      name: 'app-integration-test',
      uid: 'df7988a5-0ff4-4f65-b794-8874af3d3094',
    },
    spec: {
      application: 'frontend-app',
      bundle: 'quay.io/kpavic/test-bundle:pipeline',
      contexts: [
        {
          description: 'Runs only during application testing',
          name: 'application',
        },
      ],
      environment: {
        name: 'test-environment',
        params: [],
        type: 'workspace',
      },
      params: [
        {
          name: 'test-param',
          value: ['test'],
        },
      ],
      pipeline: 'demo-pipeline',
    },
  },
  {
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    kind: 'IntegrationTestScenario',
    metadata: {
      name: 'component-integration-test',
      uid: 'df7988a5-0ff4-4f65-b794-8874af3d3094',
    },
    spec: {
      application: 'frontend-app',
      bundle: 'quay.io/kpavic/test-bundle:pipeline',
      contexts: [
        {
          description: 'Runs only during application testing',
          name: 'component',
        },
      ],
      environment: {
        name: 'test-environment',
        params: [],
        type: 'workspace',
      },
      params: [
        {
          name: 'test-param',
          value: ['test'],
        },
      ],
      pipeline: 'demo-pipeline',
    },
  },
];

export const sampleReleases: ReleaseKind[] = [
  {
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    kind: 'Release',
    metadata: {
      creationTimestamp: '2022-11-19T11:52:29Z',
      finalizers: ['appstudio.redhat.com/release-finalizer'],
      generation: 1,
      name: 'test-application-ttxrr-testing-release',
      namespace: 'karthik-jk',
      resourceVersion: '432640',
      uid: '18bad4ae-432d-4e88-a5ed-202f2aeb8b9d',
    },
    spec: {
      releasePlan: 'sre-production',
      snapshot: 'test-application-5v6l9',
    },
    status: {},
  },
];
export const sampleReleasePlans: ReleasePlanKind[] = [
  {
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    kind: 'ReleasePlan',
    metadata: {
      uid: 'df7988a5-0ff4-4f65-b794-8874af3d3095',
      name: 'm5-release-link-managed',
      namespace: 'managed',
    },
    spec: {
      displayName: "Managed Workspace's ReleasePlan",
      application: 'm5-app',
      target: {
        namespace: 'demo',
      },
      releaseStrategy: 'm5-strategy',
    },
  },
];
