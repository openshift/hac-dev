export const mockPipelineRuns = [
  {
    apiVersion: 'tekton.dev/v1beta1',
    kind: 'PipelineRun',
    metadata: {
      annotations: {
        'build.appstudio.openshift.io/repo':
          'https://github.com/devfile-samples/devfile-sample-python-basic.git',
        'chains.tekton.dev/signed': 'true',
        'chains.tekton.dev/transparency':
          'https://rekor.sigstore.dev/api/v1/log/entries?logIndex=2868338',
        'results.tekton.dev/record':
          'sbudhwar-1/results/79d820e9-fec8-42f7-b791-071d704e20b5/records/79d820e9-fec8-42f7-b791-071d704e20b5',
        'results.tekton.dev/result': 'sbudhwar-1/results/79d820e9-fec8-42f7-b791-071d704e20b5',
      },
      creationTimestamp: '2022-07-07T13:31:58Z',
      finalizers: ['chains.tekton.dev/pipelinerun'],
      generateName: 'python-sample-',
      generation: 1,
      labels: {
        'appstudio.openshift.io/application': 'purple-mermaid-app',
        'build.appstudio.openshift.io/build': 'true',
        'appstudio.openshift.io/component': 'python-sample',
        'build.appstudio.openshift.io/type': 'build',
        'build.appstudio.openshift.io/version': '0.1',
        'pipelines.appstudio.openshift.io/type': 'build',
        'pipelines.openshift.io/runtime': 'generic',
        'pipelines.openshift.io/strategy': 'docker',
        'pipelines.openshift.io/used-by': 'build-cloud',
        'tekton.dev/pipeline': 'docker-build',
      },
      name: 'python-sample-942fq',
      namespace: 'sbudhwar-1',
      ownerReferences: [
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          kind: 'Component',
          name: 'python-sample',
          uid: 'e7401c3d-2de5-4021-9d00-c75d54403f09',
        },
      ],
      resourceVersion: '738161155',
      uid: '79d820e9-fec8-42f7-b791-071d704e20b5',
    },
    spec: {
      params: [
        {
          name: 'git-url',
          value: 'https://github.com/devfile-samples/devfile-sample-python-basic.git',
        },
        {
          name: 'output-image',
          value: 'quay.io/redhat-appstudio/user-workload:sbudhwar-1-python-sample',
        },
        {
          name: 'dockerfile',
          value: 'docker/Dockerfile',
        },
        {
          name: 'path-context',
          value: '.',
        },
      ],
      pipelineRef: {
        bundle:
          'quay.io/redhat-appstudio/build-templates-bundle:ad4c34b71d468a991450b0091cd96765471ed82d',
        name: 'docker-build',
      },
      serviceAccountName: 'appstudio-pipeline',
      timeout: '1h0m0s',
      workspaces: [
        {
          name: 'workspace',
          persistentVolumeClaim: {
            claimName: 'appstudio',
          },
          subPath: 'python-sample/initialbuild-2022-Jul-07_13-31-58',
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
      completionTime: '2022-07-07T13:32:20Z',
      conditions: [
        {
          lastTransitionTime: '2022-07-07T13:32:20Z',
          message: 'Tasks Completed: 2 (Failed: 0, Cancelled 0), Skipped: 3',
          reason: 'Completed',
          status: 'True',
          type: 'Succeeded',
        },
      ],
      pipelineSpec: {
        finally: [
          {
            name: 'show-summary',
            params: [
              {
                name: 'pipeline-run-name',
                value: '$(context.pipelineRun.name)',
              },
              {
                name: 'git-url',
                value: '$(params.git-url)',
              },
              {
                name: 'image-url',
                value: '$(params.output-image)',
              },
            ],
            taskRef: {
              bundle:
                'quay.io/redhat-appstudio/appstudio-tasks:ad4c34b71d468a991450b0091cd96765471ed82d-2',
              kind: 'Task',
              name: 'summary',
            },
          },
        ],
        params: [
          {
            description: 'Source Repository URL',
            name: 'git-url',
            type: 'string',
          },
          {
            default: '',
            description: 'Revision of the Source Repository',
            name: 'revision',
            type: 'string',
          },
          {
            description: 'Fully Qualified Output Image',
            name: 'output-image',
            type: 'string',
          },
          {
            default: '.',
            description: 'The path to your source code',
            name: 'path-context',
            type: 'string',
          },
          {
            default: 'Dockerfile',
            description: 'Path to the Dockerfile',
            name: 'dockerfile',
            type: 'string',
          },
          {
            default: 'false',
            description: 'Force rebuild image',
            name: 'rebuild',
            type: 'string',
          },
        ],
        results: [
          {
            description: '',
            name: 'IMAGE_URL',
            value: '$(tasks.build-container.results.IMAGE_URL)',
          },
          {
            description: '',
            name: 'IMAGE_DIGEST',
            value: '$(tasks.build-container.results.IMAGE_DIGEST)',
          },
          {
            description: '',
            name: 'CHAINS-GIT_URL',
            value: '$(tasks.clone-repository.results.url)',
          },
          {
            description: '',
            name: 'CHAINS-GIT_COMMIT',
            value: '$(tasks.clone-repository.results.commit)',
          },
        ],
        tasks: [
          {
            name: 'appstudio-init',
            params: [
              {
                name: 'image-url',
                value: '$(params.output-image)',
              },
              {
                name: 'rebuild',
                value: '$(params.rebuild)',
              },
            ],
            taskRef: {
              bundle:
                'quay.io/redhat-appstudio/appstudio-tasks:ad4c34b71d468a991450b0091cd96765471ed82d-2',
              kind: 'Task',
              name: 'init',
            },
          },
          {
            name: 'clone-repository',
            params: [
              {
                name: 'url',
                value: '$(params.git-url)',
              },
              {
                name: 'revision',
                value: '$(params.revision)',
              },
            ],
            runAfter: ['appstudio-init'],
            taskRef: {
              bundle:
                'quay.io/redhat-appstudio/appstudio-tasks:ad4c34b71d468a991450b0091cd96765471ed82d-1',
              kind: 'Task',
              name: 'git-clone',
            },
            when: [
              {
                input: '$(tasks.appstudio-init.results.build)',
                operator: 'in',
                values: ['true'],
              },
            ],
            workspaces: [
              {
                name: 'output',
                workspace: 'workspace',
              },
              {
                name: 'basic-auth',
                workspace: 'git-auth',
              },
            ],
          },
          {
            name: 'appstudio-configure-build',
            runAfter: ['clone-repository'],
            taskRef: {
              bundle:
                'quay.io/redhat-appstudio/appstudio-tasks:ad4c34b71d468a991450b0091cd96765471ed82d-1',
              kind: 'Task',
              name: 'configure-build',
            },
            when: [
              {
                input: '$(tasks.appstudio-init.results.build)',
                operator: 'in',
                values: ['true'],
              },
            ],
            workspaces: [
              {
                name: 'source',
                workspace: 'workspace',
              },
              {
                name: 'registry-auth',
                workspace: 'registry-auth',
              },
            ],
          },
          {
            name: 'build-container',
            params: [
              {
                name: 'IMAGE',
                value: '$(params.output-image)',
              },
              {
                name: 'DOCKERFILE',
                value: '$(params.dockerfile)',
              },
              {
                name: 'CONTEXT',
                value: '$(params.path-context)',
              },
              {
                name: 'BUILD_EXTRA_ARGS',
                value: '$(tasks.appstudio-configure-build.results.buildah-auth-param)',
              },
              {
                name: 'PUSH_EXTRA_ARGS',
                value: '$(tasks.appstudio-configure-build.results.buildah-auth-param)',
              },
            ],
            runAfter: ['appstudio-configure-build'],
            taskRef: {
              bundle:
                'quay.io/redhat-appstudio/appstudio-tasks:ad4c34b71d468a991450b0091cd96765471ed82d-1',
              kind: 'Task',
              name: 'buildah',
            },
            when: [
              {
                input: '$(tasks.appstudio-init.results.build)',
                operator: 'in',
                values: ['true'],
              },
            ],
            workspaces: [
              {
                name: 'source',
                workspace: 'workspace',
              },
            ],
          },
        ],
        workspaces: [
          {
            name: 'workspace',
          },
          {
            name: 'registry-auth',
            optional: true,
          },
          {
            name: 'git-auth',
            optional: true,
          },
        ],
      },
      skippedTasks: [
        {
          name: 'clone-repository',
          whenExpressions: [
            {
              input: 'false',
              operator: 'in',
              values: ['true'],
            },
          ],
        },
        {
          name: 'appstudio-configure-build',
          whenExpressions: [
            {
              input: '$(tasks.appstudio-init.results.build)',
              operator: 'in',
              values: ['true'],
            },
          ],
        },
        {
          name: 'build-container',
          whenExpressions: [
            {
              input: '$(tasks.appstudio-init.results.build)',
              operator: 'in',
              values: ['true'],
            },
          ],
        },
      ],
      startTime: '2022-07-07T13:31:58Z',
      taskRuns: {
        'python-sample-942fq-appstudio-init': {
          pipelineTaskName: 'appstudio-init',
          status: {
            completionTime: '2022-07-07T13:32:09Z',
            conditions: [
              {
                lastTransitionTime: '2022-07-07T13:32:09Z',
                message: 'All Steps have completed executing',
                reason: 'Succeeded',
                status: 'True',
                type: 'Succeeded',
              },
            ],
            podName: 'python-sample-942fq-appstudio-init-pod',
            startTime: '2022-07-07T13:31:59Z',
            steps: [
              {
                container: 'step-appstudio-init',
                imageID:
                  'registry.access.redhat.com/ubi8/skopeo@sha256:cc58da50c3842f5f2a4ba8781b60f6052919a5555a000cb4eb18a0bd0241b2b3',
                name: 'appstudio-init',
                terminated: {
                  containerID:
                    'cri-o://4dd177b323c674ca7c3a46de334b6e6da390c6ac9c6b641fbaeca2fc5135da9d',
                  exitCode: 0,
                  finishedAt: '2022-07-07T13:32:09Z',
                  message: '[{"key":"build","value":"false","type":1}]',
                  reason: 'Completed',
                  startedAt: '2022-07-07T13:32:08Z',
                },
              },
            ],
            taskResults: [
              {
                name: 'build',
                value: 'false',
              },
            ],
            taskSpec: {
              description:
                'App Studio Initialize Pipeline Task, include flags for rebuild and auth.',
              params: [
                {
                  description: 'Image URL for testing',
                  name: 'image-url',
                  type: 'string',
                },
                {
                  default: 'false',
                  description: 'Rebuild the image if exists',
                  name: 'rebuild',
                  type: 'string',
                },
              ],
              results: [
                {
                  description: '',
                  name: 'build',
                },
              ],
              steps: [
                {
                  image:
                    'registry.access.redhat.com/ubi8/skopeo@sha256:cc58da50c3842f5f2a4ba8781b60f6052919a5555a000cb4eb18a0bd0241b2b3',
                  name: 'appstudio-init',
                  resources: {},
                  script:
                    '#!/bin/bash\necho "App Studio Build Initialize: $(params.image-url)"\necho\necho "Determine if Image Already Exists"\n# Build the image when image does not exists or rebuild is set to true\nif ! skopeo inspect --no-tags docker://$(params.image-url) &>/dev/null || [ "$(params.rebuild)" == "true" ]; then\n  echo -n "true" > $(results.build.path)\nelse\n  echo -n "false" > $(results.build.path)\nfi\n',
                },
              ],
            },
          },
        },
        'python-sample-942fq-show-summary': {
          pipelineTaskName: 'show-summary',
          status: {
            completionTime: '2022-07-07T13:32:19Z',
            conditions: [
              {
                lastTransitionTime: '2022-07-07T13:32:19Z',
                message: 'All Steps have completed executing',
                reason: 'Succeeded',
                status: 'True',
                type: 'Succeeded',
              },
            ],
            podName: 'python-sample-942fq-show-summary-pod',
            startTime: '2022-07-07T13:32:10Z',
            steps: [
              {
                container: 'step-appstudio-summary',
                imageID:
                  'registry.redhat.io/openshift4/ose-cli@sha256:9a1ca7a36cfdd6c69398b35a7311db662ca7c652e6e8bd440a6331c12f89703a',
                name: 'appstudio-summary',
                terminated: {
                  containerID:
                    'cri-o://41ed052e222d00e536d484678c3e5c1a6eecb0d7719d88abbbbcb00af7b73d6e',
                  exitCode: 0,
                  finishedAt: '2022-07-07T13:32:18Z',
                  reason: 'Completed',
                  startedAt: '2022-07-07T13:32:17Z',
                },
              },
            ],
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
                  script:
                    '#!/usr/bin/env bash\necho\necho "App Studio Build Summary:"\necho\necho "Build repository: $(params.git-url)"\necho "Generated Image is in : $(params.image-url)"\necho\noc annotate pipelinerun $(params.pipeline-run-name) build.appstudio.openshift.io/repo=$(params.git-url)\noc annotate pipelinerun $(params.pipeline-run-name) build.appstudio.openshift.io/image=$(params.image-url)\n\necho "Output is in the following annotations:"\n\necho "Build Repo is in \'build.appstudio.openshift.io/repo\' "\necho \'oc get pr $(params.pipeline-run-name) -o jsonpath="{.metadata.annotations.build\\.appstudio\\.openshift\\.io/repo}"\'\n\necho "Build Image is in \'build.appstudio.openshift.io/image\' "\necho \'oc get pr $(params.pipeline-run-name) -o jsonpath="{.metadata.annotations.build\\.appstudio\\.openshift\\.io/image}"\'\n\necho End Summary\n',
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
      annotations: {
        'chains.tekton.dev/signed': 'true',
        'chains.tekton.dev/transparency':
          'https://rekor.sigstore.dev/api/v1/log/entries?logIndex=2844661',
        'results.tekton.dev/record':
          'sbudhwar-1/results/857a5cab-3353-4766-a636-caa800472497/records/857a5cab-3353-4766-a636-caa800472497',
        'results.tekton.dev/result': 'sbudhwar-1/results/857a5cab-3353-4766-a636-caa800472497',
      },
      creationTimestamp: '2022-07-05T14:15:26Z',
      finalizers: ['chains.tekton.dev/pipelinerun'],
      generateName: 'go-sample-',
      generation: 1,
      labels: {
        'appstudio.openshift.io/application': 'purple-mermaid-app',
        'build.appstudio.openshift.io/build': 'true',
        'appstudio.openshift.io/component': 'go-sample',
        'build.appstudio.openshift.io/type': 'test',
        'build.appstudio.openshift.io/version': '0.1',
        'pipelines.appstudio.openshift.io/type': 'test',
        'pipelines.openshift.io/runtime': 'generic',
        'pipelines.openshift.io/strategy': 'docker',
        'pipelines.openshift.io/used-by': 'build-cloud',
        'tekton.dev/pipeline': 'docker-build',
      },
      name: 'go-sample-s2f4f',
      namespace: 'sbudhwar-1',
      ownerReferences: [
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          kind: 'Component',
          name: 'go-sample',
          uid: '7299cae2-eb95-47dc-8f63-dc700d564c1f',
        },
      ],
      resourceVersion: '727502478',
      uid: '857a5cab-3353-4766-a636-caa800472497',
    },
    spec: {
      params: [
        {
          name: 'git-url',
          value: 'https://github.com/devfile-samples/devfile-sample-go-basic.git',
        },
        {
          name: 'output-image',
          value: 'quay.io/redhat-appstudio/user-workload:sbudhwar-1-go-sample',
        },
        {
          name: 'dockerfile',
          value: 'docker/Dockerfile',
        },
        {
          name: 'path-context',
          value: '.',
        },
      ],
      pipelineRef: {
        bundle:
          'quay.io/redhat-appstudio/build-templates-bundle:ad4c34b71d468a991450b0091cd96765471ed82d',
        name: 'docker-build',
      },
      serviceAccountName: 'appstudio-pipeline',
      timeout: '1h0m0s',
      workspaces: [
        {
          name: 'workspace',
          persistentVolumeClaim: {
            claimName: 'appstudio',
          },
          subPath: 'go-sample/initialbuild-2022-Jul-05_14-15-26',
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
      completionTime: '2022-07-05T15:15:29Z',
      conditions: [
        {
          lastTransitionTime: '2022-07-05T15:15:29Z',
          message: 'PipelineRun "go-sample-s2f4f" failed to finish within "1h0m0s"',
          reason: 'PipelineRunTimeout',
          status: 'False',
          type: 'Succeeded',
        },
      ],
      pipelineSpec: {
        finally: [
          {
            name: 'show-summary',
            params: [
              {
                name: 'pipeline-run-name',
                value: '$(context.pipelineRun.name)',
              },
              {
                name: 'git-url',
                value: '$(params.git-url)',
              },
              {
                name: 'image-url',
                value: '$(params.output-image)',
              },
            ],
            taskRef: {
              bundle:
                'quay.io/redhat-appstudio/appstudio-tasks:ad4c34b71d468a991450b0091cd96765471ed82d-2',
              kind: 'Task',
              name: 'summary',
            },
          },
        ],
        params: [
          {
            description: 'Source Repository URL',
            name: 'git-url',
            type: 'string',
          },
          {
            default: '',
            description: 'Revision of the Source Repository',
            name: 'revision',
            type: 'string',
          },
          {
            description: 'Fully Qualified Output Image',
            name: 'output-image',
            type: 'string',
          },
          {
            default: '.',
            description: 'The path to your source code',
            name: 'path-context',
            type: 'string',
          },
          {
            default: 'Dockerfile',
            description: 'Path to the Dockerfile',
            name: 'dockerfile',
            type: 'string',
          },
          {
            default: 'false',
            description: 'Force rebuild image',
            name: 'rebuild',
            type: 'string',
          },
        ],
        results: [
          {
            description: '',
            name: 'IMAGE_URL',
            value: '$(tasks.build-container.results.IMAGE_URL)',
          },
          {
            description: '',
            name: 'IMAGE_DIGEST',
            value: '$(tasks.build-container.results.IMAGE_DIGEST)',
          },
          {
            description: '',
            name: 'CHAINS-GIT_URL',
            value: '$(tasks.clone-repository.results.url)',
          },
          {
            description: '',
            name: 'CHAINS-GIT_COMMIT',
            value: '$(tasks.clone-repository.results.commit)',
          },
        ],
        tasks: [
          {
            name: 'appstudio-init',
            params: [
              {
                name: 'image-url',
                value: '$(params.output-image)',
              },
              {
                name: 'rebuild',
                value: '$(params.rebuild)',
              },
            ],
            taskRef: {
              bundle:
                'quay.io/redhat-appstudio/appstudio-tasks:ad4c34b71d468a991450b0091cd96765471ed82d-2',
              kind: 'Task',
              name: 'init',
            },
          },
          {
            name: 'clone-repository',
            params: [
              {
                name: 'url',
                value: '$(params.git-url)',
              },
              {
                name: 'revision',
                value: '$(params.revision)',
              },
            ],
            runAfter: ['appstudio-init'],
            taskRef: {
              bundle:
                'quay.io/redhat-appstudio/appstudio-tasks:ad4c34b71d468a991450b0091cd96765471ed82d-1',
              kind: 'Task',
              name: 'git-clone',
            },
            when: [
              {
                input: '$(tasks.appstudio-init.results.build)',
                operator: 'in',
                values: ['true'],
              },
            ],
            workspaces: [
              {
                name: 'output',
                workspace: 'workspace',
              },
              {
                name: 'basic-auth',
                workspace: 'git-auth',
              },
            ],
          },
          {
            name: 'appstudio-configure-build',
            runAfter: ['clone-repository'],
            taskRef: {
              bundle:
                'quay.io/redhat-appstudio/appstudio-tasks:ad4c34b71d468a991450b0091cd96765471ed82d-1',
              kind: 'Task',
              name: 'configure-build',
            },
            when: [
              {
                input: '$(tasks.appstudio-init.results.build)',
                operator: 'in',
                values: ['true'],
              },
            ],
            workspaces: [
              {
                name: 'source',
                workspace: 'workspace',
              },
              {
                name: 'registry-auth',
                workspace: 'registry-auth',
              },
            ],
          },
          {
            name: 'build-container',
            params: [
              {
                name: 'IMAGE',
                value: '$(params.output-image)',
              },
              {
                name: 'DOCKERFILE',
                value: '$(params.dockerfile)',
              },
              {
                name: 'CONTEXT',
                value: '$(params.path-context)',
              },
              {
                name: 'BUILD_EXTRA_ARGS',
                value: '$(tasks.appstudio-configure-build.results.buildah-auth-param)',
              },
              {
                name: 'PUSH_EXTRA_ARGS',
                value: '$(tasks.appstudio-configure-build.results.buildah-auth-param)',
              },
            ],
            runAfter: ['appstudio-configure-build'],
            taskRef: {
              bundle:
                'quay.io/redhat-appstudio/appstudio-tasks:ad4c34b71d468a991450b0091cd96765471ed82d-1',
              kind: 'Task',
              name: 'buildah',
            },
            when: [
              {
                input: '$(tasks.appstudio-init.results.build)',
                operator: 'in',
                values: ['true'],
              },
            ],
            workspaces: [
              {
                name: 'source',
                workspace: 'workspace',
              },
            ],
          },
        ],
        workspaces: [
          {
            name: 'workspace',
          },
          {
            name: 'registry-auth',
            optional: true,
          },
          {
            name: 'git-auth',
            optional: true,
          },
        ],
      },
      skippedTasks: [
        {
          name: 'appstudio-configure-build',
          whenExpressions: [
            {
              input: '$(tasks.appstudio-init.results.build)',
              operator: 'in',
              values: ['true'],
            },
          ],
        },
        {
          name: 'build-container',
          whenExpressions: [
            {
              input: '$(tasks.appstudio-init.results.build)',
              operator: 'in',
              values: ['true'],
            },
          ],
        },
      ],
      startTime: '2022-07-05T14:15:28Z',
      taskRuns: {
        'go-sample-s2f4f-appstudio-init': {
          pipelineTaskName: 'appstudio-init',
          status: {
            completionTime: '2022-07-05T14:15:35Z',
            conditions: [
              {
                lastTransitionTime: '2022-07-05T14:15:35Z',
                message: 'All Steps have completed executing',
                reason: 'Succeeded',
                status: 'True',
                type: 'Succeeded',
              },
            ],
            podName: 'go-sample-s2f4f-appstudio-init-pod',
            startTime: '2022-07-05T14:15:28Z',
            steps: [
              {
                container: 'step-appstudio-init',
                imageID:
                  'registry.access.redhat.com/ubi8/skopeo@sha256:cc58da50c3842f5f2a4ba8781b60f6052919a5555a000cb4eb18a0bd0241b2b3',
                name: 'appstudio-init',
                terminated: {
                  containerID:
                    'cri-o://56fda01190187da64f2353a55e297eb84c2555868f848e3f092613c805826147',
                  exitCode: 0,
                  finishedAt: '2022-07-05T14:15:35Z',
                  message: '[{"key":"build","value":"true","type":1}]',
                  reason: 'Completed',
                  startedAt: '2022-07-05T14:15:35Z',
                },
              },
            ],
            taskResults: [
              {
                name: 'build',
                value: 'true',
              },
            ],
            taskSpec: {
              description:
                'App Studio Initialize Pipeline Task, include flags for rebuild and auth.',
              params: [
                {
                  description: 'Image URL for testing',
                  name: 'image-url',
                  type: 'string',
                },
                {
                  default: 'false',
                  description: 'Rebuild the image if exists',
                  name: 'rebuild',
                  type: 'string',
                },
              ],
              results: [
                {
                  description: '',
                  name: 'build',
                },
              ],
              steps: [
                {
                  image:
                    'registry.access.redhat.com/ubi8/skopeo@sha256:cc58da50c3842f5f2a4ba8781b60f6052919a5555a000cb4eb18a0bd0241b2b3',
                  name: 'appstudio-init',
                  resources: {},
                  script:
                    '#!/bin/bash\necho "App Studio Build Initialize: $(params.image-url)"\necho\necho "Determine if Image Already Exists"\n# Build the image when image does not exists or rebuild is set to true\nif ! skopeo inspect --no-tags docker://$(params.image-url) &>/dev/null || [ "$(params.rebuild)" == "true" ]; then\n  echo -n "true" > $(results.build.path)\nelse\n  echo -n "false" > $(results.build.path)\nfi\n',
                },
              ],
            },
          },
        },
        'go-sample-s2f4f-clone-repository': {
          pipelineTaskName: 'clone-repository',
          status: {
            completionTime: '2022-07-05T15:15:27Z',
            conditions: [
              {
                lastTransitionTime: '2022-07-05T15:15:27Z',
                message:
                  'TaskRun "go-sample-s2f4f-clone-repository" failed to finish within "59m51.135269812s"',
                reason: 'TaskRunTimeout',
                status: 'False',
                type: 'Succeeded',
              },
            ],
            podName: 'go-sample-s2f4f-clone-repository-pod',
            startTime: '2022-07-05T14:15:36Z',
            taskSpec: {
              description:
                "These Tasks are Git tasks to work with repositories used by other tasks in your Pipeline.\nThe git-clone Task will clone a repo from the provided url into the output Workspace. By default the repo will be cloned into the root of your Workspace. You can clone into a subdirectory by setting this Task's subdirectory param. This Task also supports sparse checkouts. To perform a sparse checkout, pass a list of comma separated directory patterns to this Task's sparseCheckoutDirectories param.",
              params: [
                {
                  description: 'Repository URL to clone from.',
                  name: 'url',
                  type: 'string',
                },
                {
                  default: '',
                  description: 'Revision to checkout. (branch, tag, sha, ref, etc...)',
                  name: 'revision',
                  type: 'string',
                },
                {
                  default: '',
                  description: 'Refspec to fetch before checking out revision.',
                  name: 'refspec',
                  type: 'string',
                },
                {
                  default: 'true',
                  description: 'Initialize and fetch git submodules.',
                  name: 'submodules',
                  type: 'string',
                },
                {
                  default: '1',
                  description: 'Perform a shallow clone, fetching only the most recent N commits.',
                  name: 'depth',
                  type: 'string',
                },
                {
                  default: 'true',
                  description:
                    'Set the `http.sslVerify` global git config. Setting this to `false` is not advised unless you are sure that you trust your git remote.',
                  name: 'sslVerify',
                  type: 'string',
                },
                {
                  default: '',
                  description: 'Subdirectory inside the `output` Workspace to clone the repo into.',
                  name: 'subdirectory',
                  type: 'string',
                },
                {
                  default: '',
                  description:
                    'Define the directory patterns to match or exclude when performing a sparse checkout.',
                  name: 'sparseCheckoutDirectories',
                  type: 'string',
                },
                {
                  default: 'true',
                  description:
                    'Clean out the contents of the destination directory if it already exists before cloning.',
                  name: 'deleteExisting',
                  type: 'string',
                },
                {
                  default: '',
                  description: 'HTTP proxy server for non-SSL requests.',
                  name: 'httpProxy',
                  type: 'string',
                },
                {
                  default: '',
                  description: 'HTTPS proxy server for SSL requests.',
                  name: 'httpsProxy',
                  type: 'string',
                },
                {
                  default: '',
                  description: 'Opt out of proxying HTTP/HTTPS requests.',
                  name: 'noProxy',
                  type: 'string',
                },
                {
                  default: 'true',
                  description: "Log the commands that are executed during `git-clone`'s operation.",
                  name: 'verbose',
                  type: 'string',
                },
                {
                  default:
                    'registry.redhat.io/openshift-pipelines/pipelines-git-init-rhel8@sha256:af7dd5b3b1598a980f17d5f5d3d8a4b11ab4f5184677f7f17ad302baa36bd3c1',
                  description: 'The image providing the git-init binary that this Task runs.',
                  name: 'gitInitImage',
                  type: 'string',
                },
                {
                  default: '/tekton/home',
                  description:
                    "Absolute path to the user's home directory. Set this explicitly if you are running the image as a non-root user or have overridden\nthe gitInitImage param with an image containing custom user configuration.\n",
                  name: 'userHome',
                  type: 'string',
                },
              ],
              results: [
                {
                  description: 'The precise commit SHA that was fetched by this Task.',
                  name: 'commit',
                },
                {
                  description: 'The precise URL that was fetched by this Task.',
                  name: 'url',
                },
              ],
              steps: [
                {
                  image: '$(params.gitInitImage)',
                  name: 'clone',
                  resources: {},
                  script:
                    '#!/usr/bin/env sh\nset -eu\n\nif [ "${PARAM_VERBOSE}" = "true" ] ; then\n  set -x\nfi\n\nif [ "${WORKSPACE_BASIC_AUTH_DIRECTORY_BOUND}" = "true" ] ; then\n  cp "${WORKSPACE_BASIC_AUTH_DIRECTORY_PATH}/.git-credentials" "${PARAM_USER_HOME}/.git-credentials"\n  cp "${WORKSPACE_BASIC_AUTH_DIRECTORY_PATH}/.gitconfig" "${PARAM_USER_HOME}/.gitconfig"\n  chmod 400 "${PARAM_USER_HOME}/.git-credentials"\n  chmod 400 "${PARAM_USER_HOME}/.gitconfig"\nfi\n\nif [ "${WORKSPACE_SSH_DIRECTORY_BOUND}" = "true" ] ; then\n  cp -R "${WORKSPACE_SSH_DIRECTORY_PATH}" "${PARAM_USER_HOME}"/.ssh\n  chmod 700 "${PARAM_USER_HOME}"/.ssh\n  chmod -R 400 "${PARAM_USER_HOME}"/.ssh/*\nfi\n\nCHECKOUT_DIR="${WORKSPACE_OUTPUT_PATH}/${PARAM_SUBDIRECTORY}"\n\ncleandir() {\n  # Delete any existing contents of the repo directory if it exists.\n  #\n  # We don\'t just "rm -rf ${CHECKOUT_DIR}" because ${CHECKOUT_DIR} might be "/"\n  # or the root of a mounted volume.\n  if [ -d "${CHECKOUT_DIR}" ] ; then\n    # Delete non-hidden files and directories\n    rm -rf "${CHECKOUT_DIR:?}"/*\n    # Delete files and directories starting with . but excluding ..\n    rm -rf "${CHECKOUT_DIR}"/.[!.]*\n    # Delete files and directories starting with .. plus any other character\n    rm -rf "${CHECKOUT_DIR}"/..?*\n  fi\n}\n\nif [ "${PARAM_DELETE_EXISTING}" = "true" ] ; then\n  cleandir\nfi\n\ntest -z "${PARAM_HTTP_PROXY}" || export HTTP_PROXY="${PARAM_HTTP_PROXY}"\ntest -z "${PARAM_HTTPS_PROXY}" || export HTTPS_PROXY="${PARAM_HTTPS_PROXY}"\ntest -z "${PARAM_NO_PROXY}" || export NO_PROXY="${PARAM_NO_PROXY}"\n\n/ko-app/git-init \\\n  -url="${PARAM_URL}" \\\n  -revision="${PARAM_REVISION}" \\\n  -refspec="${PARAM_REFSPEC}" \\\n  -path="${CHECKOUT_DIR}" \\\n  -sslVerify="${PARAM_SSL_VERIFY}" \\\n  -submodules="${PARAM_SUBMODULES}" \\\n  -depth="${PARAM_DEPTH}" \\\n  -sparseCheckoutDirectories="${PARAM_SPARSE_CHECKOUT_DIRECTORIES}"\ncd "${CHECKOUT_DIR}"\nRESULT_SHA="$(git rev-parse HEAD)"\nEXIT_CODE="$?"\nif [ "${EXIT_CODE}" != 0 ] ; then\n  exit "${EXIT_CODE}"\nfi\nprintf "%s" "${RESULT_SHA}" > "$(results.commit.path)"\nprintf "%s" "${PARAM_URL}" > "$(results.url.path)"\n',
                },
              ],
              workspaces: [
                {
                  description:
                    'The git repo will be cloned onto the volume backing this Workspace.',
                  name: 'output',
                },
                {
                  description:
                    "A .ssh directory with private key, known_hosts, config, etc. Copied to\nthe user's home before git commands are executed. Used to authenticate\nwith the git remote when performing the clone. Binding a Secret to this\nWorkspace is strongly recommended over other volume types.\n",
                  name: 'ssh-directory',
                  optional: true,
                },
                {
                  description:
                    "A Workspace containing a .gitconfig and .git-credentials file. These\nwill be copied to the user's home before any git commands are run. Any\nother files in this Workspace are ignored. It is strongly recommended\nto use ssh-directory over basic-auth whenever possible and to bind a\nSecret to this Workspace over other volume types.\n",
                  name: 'basic-auth',
                  optional: true,
                },
              ],
            },
          },
          whenExpressions: [
            {
              input: 'true',
              operator: 'in',
              values: ['true'],
            },
          ],
        },
        'go-sample-s2f4f-show-summary': {
          pipelineTaskName: 'show-summary',
          status: {
            completionTime: '2022-07-05T15:15:28Z',
            conditions: [
              {
                lastTransitionTime: '2022-07-05T15:15:28Z',
                message:
                  'failed to create task run pod "go-sample-s2f4f-show-summary": Pod "go-sample-s2f4f-show-summary-pod" is invalid: spec.activeDeadlineSeconds: Invalid value: 0: must be between 1 and 2147483647, inclusive. Maybe missing or invalid Task sbudhwar-1/summary',
                reason: 'CouldntGetTask',
                status: 'False',
                type: 'Succeeded',
              },
            ],
            podName: '',
            startTime: '2022-07-05T15:15:27Z',
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
                  script:
                    '#!/usr/bin/env bash\necho\necho "App Studio Build Summary:"\necho\necho "Build repository: $(params.git-url)"\necho "Generated Image is in : $(params.image-url)"\necho\noc annotate pipelinerun $(params.pipeline-run-name) build.appstudio.openshift.io/repo=$(params.git-url)\noc annotate pipelinerun $(params.pipeline-run-name) build.appstudio.openshift.io/image=$(params.image-url)\n\necho "Output is in the following annotations:"\n\necho "Build Repo is in \'build.appstudio.openshift.io/repo\' "\necho \'oc get pr $(params.pipeline-run-name) -o jsonpath="{.metadata.annotations.build\\.appstudio\\.openshift\\.io/repo}"\'\n\necho "Build Image is in \'build.appstudio.openshift.io/image\' "\necho \'oc get pr $(params.pipeline-run-name) -o jsonpath="{.metadata.annotations.build\\.appstudio\\.openshift\\.io/image}"\'\n\necho End Summary\n',
                },
              ],
            },
          },
        },
      },
    },
  },
];
