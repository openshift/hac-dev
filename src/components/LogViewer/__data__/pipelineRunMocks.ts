export const pipelineRunMock = {
  apiVersion: 'tekton.dev/v1beta1',
  kind: 'PipelineRun',
  metadata: {
    annotations: {
      'build.appstudio.openshift.io/repo':
        'https://github.com/nodeshift-starters/devfile-sample.git',
      'results.tekton.dev/record':
        'sbudhwar-1/results/a2a875cb-a065-4b1e-b7c3-0a7ca710f2a6/records/a2a875cb-a065-4b1e-b7c3-0a7ca710f2a6',
      'results.tekton.dev/result': 'sbudhwar-1/results/a2a875cb-a065-4b1e-b7c3-0a7ca710f2a6',
    },
    creationTimestamp: '2022-03-16T04:45:09Z',
    generateName: 'basic-node-js-',
    generation: 1,
    labels: {
      'appstudio.openshift.io/application': 'purple-mermaid-app',
      'build.appstudio.openshift.io/build': 'true',
      'appstudio.openshift.io/component': 'basic-node-js',
      'build.appstudio.openshift.io/type': 'build',
      'build.appstudio.openshift.io/version': '0.1',
      'pipelines.appstudio.openshift.io/type': 'build',
      'pipelines.openshift.io/runtime': 'generic',
      'pipelines.openshift.io/strategy': 'docker',
      'pipelines.openshift.io/used-by': 'build-cloud',
      'tekton.dev/pipeline': 'docker-build',
    },
    managedFields: [
      {
        apiVersion: 'tekton.dev/v1beta1',
        fieldsType: 'FieldsV1',
        fieldsV1: {
          'f:metadata': {
            'f:generateName': {},
            'f:labels': {
              '.': {},
              'f:appstudio.openshift.io/application': {},
              'f:build.appstudio.openshift.io/build': {},
              'f:appstudio.openshift.io/component': {},
              'f:build.appstudio.openshift.io/type': {},
              'f:build.appstudio.openshift.io/version': {},
              'f:pipelines.appstudio.openshift.io/type': {},
            },
            'f:ownerReferences': {
              '.': {},
              'k:{"uid":"bdec6527-db16-43da-9300-3a20d180e020"}': {},
            },
          },
          'f:spec': {
            '.': {},
            'f:params': {},
            'f:pipelineRef': {
              '.': {},
              'f:bundle': {},
              'f:name': {},
            },
            'f:workspaces': {},
          },
        },
        manager: 'manager',
        operation: 'Update',
        time: '2022-03-16T04:45:09Z',
      },
      {
        apiVersion: 'tekton.dev/v1beta1',
        fieldsType: 'FieldsV1',
        fieldsV1: {
          'f:metadata': {
            'f:annotations': {
              '.': {},
              'f:results.tekton.dev/record': {},
              'f:results.tekton.dev/result': {},
            },
          },
        },
        manager: 'watcher',
        operation: 'Update',
        time: '2022-03-16T04:45:11Z',
      },
      {
        apiVersion: 'tekton.dev/v1beta1',
        fieldsType: 'FieldsV1',
        fieldsV1: {
          'f:metadata': {
            'f:annotations': {
              'f:build.appstudio.openshift.io/repo': {},
            },
          },
        },
        manager: 'kubectl-annotate',
        operation: 'Update',
        time: '2022-03-16T04:47:18Z',
      },
      {
        apiVersion: 'tekton.dev/v1beta1',
        fieldsType: 'FieldsV1',
        fieldsV1: {
          'f:metadata': {
            'f:labels': {
              'f:pipelines.openshift.io/runtime': {},
              'f:pipelines.openshift.io/strategy': {},
              'f:pipelines.openshift.io/used-by': {},
              'f:tekton.dev/pipeline': {},
            },
          },
        },
        manager: 'openshift-pipelines-controller',
        operation: 'Update',
        time: '2022-03-16T04:47:18Z',
      },
      {
        apiVersion: 'tekton.dev/v1beta1',
        fieldsType: 'FieldsV1',
        fieldsV1: {
          'f:status': {
            '.': {},
            'f:completionTime': {},
            'f:conditions': {},
            'f:pipelineSpec': {
              '.': {},
              'f:params': {},
              'f:tasks': {},
              'f:workspaces': {},
            },
            'f:skippedTasks': {},
            'f:startTime': {},
            'f:taskRuns': {
              '.': {},
              'f:basic-node-js-7c8nd-appstudio-configure-build-dfd7n': {
                '.': {},
                'f:pipelineTaskName': {},
                'f:status': {
                  '.': {},
                  'f:completionTime': {},
                  'f:conditions': {},
                  'f:podName': {},
                  'f:startTime': {},
                  'f:steps': {},
                  'f:taskResults': {},
                  'f:taskSpec': {
                    '.': {},
                    'f:description': {},
                    'f:results': {},
                    'f:steps': {},
                    'f:workspaces': {},
                  },
                },
              },
              'f:basic-node-js-7c8nd-appstudio-init-p7zwm': {
                '.': {},
                'f:pipelineTaskName': {},
                'f:status': {
                  '.': {},
                  'f:completionTime': {},
                  'f:conditions': {},
                  'f:podName': {},
                  'f:startTime': {},
                  'f:steps': {},
                  'f:taskResults': {},
                  'f:taskSpec': {
                    '.': {},
                    'f:description': {},
                    'f:params': {},
                    'f:results': {},
                    'f:steps': {},
                    'f:workspaces': {},
                  },
                },
              },
              'f:basic-node-js-7c8nd-build-container-56c9m': {
                '.': {},
                'f:pipelineTaskName': {},
                'f:status': {
                  '.': {},
                  'f:completionTime': {},
                  'f:conditions': {},
                  'f:podName': {},
                  'f:startTime': {},
                  'f:steps': {},
                  'f:taskResults': {},
                  'f:taskSpec': {
                    '.': {},
                    'f:description': {},
                    'f:params': {},
                    'f:results': {},
                    'f:steps': {},
                    'f:volumes': {},
                    'f:workspaces': {},
                  },
                },
              },
              'f:basic-node-js-7c8nd-clone-repository-hsgsp': {
                '.': {},
                'f:pipelineTaskName': {},
                'f:status': {
                  '.': {},
                  'f:completionTime': {},
                  'f:conditions': {},
                  'f:podName': {},
                  'f:startTime': {},
                  'f:steps': {},
                  'f:taskResults': {},
                  'f:taskSpec': {
                    '.': {},
                    'f:description': {},
                    'f:params': {},
                    'f:results': {},
                    'f:steps': {},
                    'f:workspaces': {},
                  },
                },
                'f:whenExpressions': {},
              },
              'f:basic-node-js-7c8nd-show-summary-xncs9': {
                '.': {},
                'f:pipelineTaskName': {},
                'f:status': {
                  '.': {},
                  'f:completionTime': {},
                  'f:conditions': {},
                  'f:podName': {},
                  'f:startTime': {},
                  'f:steps': {},
                  'f:taskSpec': {
                    '.': {},
                    'f:description': {},
                    'f:params': {},
                    'f:steps': {},
                    'f:workspaces': {},
                  },
                },
              },
            },
          },
        },
        manager: 'openshift-pipelines-controller',
        operation: 'Update',
        subresource: 'status',
        time: '2022-03-16T04:47:18Z',
      },
    ],
    name: 'basic-node-js-7c8nd',
    namespace: 'sbudhwar-1',
    ownerReferences: [
      {
        apiVersion: 'appstudio.redhat.com/v1alpha1',
        kind: 'Component',
        name: 'basic-node-js',
        uid: 'bdec6527-db16-43da-9300-3a20d180e020',
      },
    ],
    resourceVersion: '284047704',
    uid: 'a2a875cb-a065-4b1e-b7c3-0a7ca710f2a6',
  },
  spec: {
    params: [
      {
        name: 'git-url',
        value: 'https://github.com/nodeshift-starters/devfile-sample.git',
      },
      {
        name: 'output-image',
        value: 'quay.io/redhat-appstudio/user-workload:sbudhwar-1-basic-node-js',
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
        'quay.io/redhat-appstudio/build-templates-bundle:8201a567956ba6d2095d615ea2c0f6ab35f9ba5f',
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
        subPath: 'basic-node-js/initialbuild-2022-Feb-16_04-45-09',
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
    completionTime: '2022-03-16T04:47:18Z',
    conditions: [
      {
        lastTransitionTime: '2022-03-16T04:47:18Z',
        message: 'Tasks Completed: 5 (Failed: 0, Cancelled 0), Skipped: 1',
        reason: 'Completed',
        status: 'True',
        type: 'Succeeded',
      },
    ],
    pipelineSpec: {
      params: [
        {
          description: 'Source Repository URL',
          name: 'git-url',
          type: 'string',
        },
        {
          default: 'main',
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
      ],
      tasks: [
        {
          name: 'appstudio-init',
          params: [
            {
              name: 'image-url',
              value: '$(params.output-image)',
            },
          ],
          taskRef: {
            bundle:
              'quay.io/redhat-appstudio/appstudio-tasks:8201a567956ba6d2095d615ea2c0f6ab35f9ba5f-1',
            kind: 'Task',
            name: 'init',
          },
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
              'quay.io/redhat-appstudio/appstudio-tasks:8201a567956ba6d2095d615ea2c0f6ab35f9ba5f-1',
            kind: 'Task',
            name: 'git-clone',
          },
          when: [
            {
              input: '$(tasks.appstudio-init.results.exists)',
              operator: 'in',
              values: ['false'],
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
              'quay.io/redhat-appstudio/appstudio-tasks:8201a567956ba6d2095d615ea2c0f6ab35f9ba5f-1',
            kind: 'Task',
            name: 'configure-build',
          },
          when: [
            {
              input: '$(tasks.appstudio-init.results.exists)',
              operator: 'in',
              values: ['false'],
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
              name: 'BUILDER_IMAGE',
              value:
                'registry.access.redhat.com/ubi8/buildah@sha256:31f84b19a0774be7cfad751be38fc97f5e86cefd26e0abaec8047ddc650b00bf',
            },
            {
              name: 'STORAGE_DRIVER',
              value: 'vfs',
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
              name: 'TLSVERIFY',
              value: 'true',
            },
            {
              name: 'FORMAT',
              value: 'oci',
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
              'quay.io/redhat-appstudio/appstudio-tasks:8201a567956ba6d2095d615ea2c0f6ab35f9ba5f-1',
            kind: 'Task',
            name: 'buildah',
          },
          workspaces: [
            {
              name: 'source',
              workspace: 'workspace',
            },
          ],
        },
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
          runAfter: ['build-container'],
          taskRef: {
            bundle:
              'quay.io/redhat-appstudio/appstudio-tasks:8201a567956ba6d2095d615ea2c0f6ab35f9ba5f-1',
            kind: 'Task',
            name: 'summary',
          },
        },
        {
          name: 'skip-rebuild-summary',
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
          runAfter: ['appstudio-init'],
          taskRef: {
            bundle:
              'quay.io/redhat-appstudio/appstudio-tasks:8201a567956ba6d2095d615ea2c0f6ab35f9ba5f-1',
            kind: 'Task',
            name: 'summary',
          },
          when: [
            {
              input: '$(tasks.appstudio-init.results.exists)',
              operator: 'in',
              values: ['true'],
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
        name: 'skip-rebuild-summary',
        whenExpressions: [
          {
            input: 'false',
            operator: 'in',
            values: ['true'],
          },
        ],
      },
    ],
    startTime: '2022-03-16T04:45:11Z',
    taskRuns: {
      'basic-node-js-7c8nd-appstudio-configure-build-dfd7n': {
        pipelineTaskName: 'appstudio-configure-build',
        status: {
          completionTime: '2022-03-16T04:45:41Z',
          conditions: [
            {
              lastTransitionTime: '2022-03-16T04:45:41Z',
              message: 'All Steps have completed executing',
              reason: 'Succeeded',
              status: 'True',
              type: 'Succeeded',
            },
          ],
          podName: 'basic-node-js-7c8nd-appstudio-configure-build-dfd7n-pod-k9tmt',
          startTime: '2022-03-16T04:45:33Z',
          steps: [
            {
              container: 'step-appstudio-configure-build',
              imageID:
                'quay.io/redhat-appstudio/appstudio-utils@sha256:bb587dcee6157107a518786c83adc22c336352bd37ce421fc7ba508bce9b0666',
              name: 'appstudio-configure-build',
              terminated: {
                containerID:
                  'cri-o://7778ccd6f540ce0c886ffacf0383e70c21d43262dddbc5a44be5d2070c39747c',
                exitCode: 0,
                finishedAt: '2022-03-16T04:45:40Z',
                message:
                  '[{"key":"buildah-auth-param","value":"--authfile /workspace/source/.dockerconfigjson","type":1},{"key":"registry-auth","value":"/workspace/source/.dockerconfigjson","type":1}]',
                reason: 'Completed',
                startedAt: '2022-03-16T04:45:40Z',
              },
            },
          ],
          taskResults: [
            {
              name: 'buildah-auth-param',
              value: '--authfile /workspace/source/.dockerconfigjson',
            },
            {
              name: 'registry-auth',
              value: '/workspace/source/.dockerconfigjson',
            },
          ],
          taskSpec: {
            description: 'App Studio Configure Build Secrets in Source. ',
            results: [
              {
                description: 'docker config location',
                name: 'registry-auth',
              },
              {
                description: 'pass this to the build optional params to conifigure secrets',
                name: 'buildah-auth-param',
              },
            ],
            steps: [
              {
                image:
                  'quay.io/redhat-appstudio/appstudio-utils:8201a567956ba6d2095d615ea2c0f6ab35f9ba5f',
                name: 'appstudio-configure-build',
                resources: {},
                script:
                  '#!/usr/bin/env bash    \necho "App Studio Configure Build" \n\nAUTH=/workspace/registry-auth/.dockerconfigjson\nDEST=/workspace/source/.dockerconfigjson\necho "Looking for Registry Auth Config: $AUTH"\nif [ -f "$AUTH" ]; then\n  echo "$AUTH found" \n  echo\n\n  cp $AUTH $DEST\n\n  echo -n $DEST > /tekton/results/registry-auth  \n  echo -n "--authfile $DEST"  >  /tekton/results/buildah-auth-param\n  echo \nelse  \n  echo "No $AUTH found." \n  echo -n " " > /tekton/results/registry-auth  \n  echo -n " " > /tekton/results/buildah-auth-param\n  echo \nfi\n',
              },
            ],
            workspaces: [
              {
                name: 'source',
                optional: true,
              },
              {
                name: 'registry-auth',
                optional: true,
              },
            ],
          },
        },
      },
      'basic-node-js-7c8nd-appstudio-init-p7zwm': {
        pipelineTaskName: 'appstudio-init',
        status: {
          completionTime: '2022-03-16T04:45:24Z',
          conditions: [
            {
              lastTransitionTime: '2022-03-16T04:45:24Z',
              message: 'All Steps have completed executing',
              reason: 'Succeeded',
              status: 'True',
              type: 'Succeeded',
            },
          ],
          podName: 'basic-node-js-7c8nd-appstudio-init-p7zwm-pod-rc64r',
          startTime: '2022-03-16T04:45:11Z',
          steps: [
            {
              container: 'step-appstudio-init',
              imageID:
                'quay.io/redhat-appstudio/appstudio-utils@sha256:bb587dcee6157107a518786c83adc22c336352bd37ce421fc7ba508bce9b0666',
              name: 'appstudio-init',
              terminated: {
                containerID:
                  'cri-o://a3fa492291fce03b317117b6e0ccdf2b4d1e767fad44555ace1009f7526108c5',
                exitCode: 0,
                finishedAt: '2022-03-16T04:45:23Z',
                message: '[{"key":"exists","value":"false","type":1}]',
                reason: 'Completed',
                startedAt: '2022-03-16T04:45:23Z',
              },
            },
          ],
          taskResults: [
            {
              name: 'exists',
              value: 'false',
            },
          ],
          taskSpec: {
            description: 'App Studio Initialize Pipeline Task, include flags for rebuild and auth.',
            params: [
              {
                description: 'Image URL for testing',
                name: 'image-url',
                type: 'string',
              },
            ],
            results: [
              {
                description: 'true if rebuild needs',
                name: 'rebuild-if-exists',
              },
              {
                description: 'true if exists false otherwise',
                name: 'exists',
              },
              {
                description: 'docker config location',
                name: 'registry-auth',
              },
            ],
            steps: [
              {
                image:
                  'quay.io/redhat-appstudio/appstudio-utils:8201a567956ba6d2095d615ea2c0f6ab35f9ba5f',
                name: 'appstudio-init',
                resources: {},
                script:
                  '#!/bin/bash    \necho "App Studio Build Initialize: $(params.image-url)" \necho \necho "Determine if Image Already Exists"\nbash /appstudio-utils/util-scripts/image-exists.sh $(params.image-url) /tekton/results\n\necho "Rebuild if Image Already Exists set to false."\n# TODO allow external configuration to force rebuilds\necho -n "false"   /tekton/results/rebuild-if-exists\necho\n',
              },
            ],
            workspaces: [
              {
                name: 'source',
                optional: true,
              },
              {
                name: 'registry-auth',
                optional: true,
              },
            ],
          },
        },
      },
      'basic-node-js-7c8nd-build-container-56c9m': {
        pipelineTaskName: 'build-container',
        status: {
          completionTime: '2022-03-16T04:47:10Z',
          conditions: [
            {
              lastTransitionTime: '2022-03-16T04:47:10Z',
              message: 'All Steps have completed executing',
              reason: 'Succeeded',
              status: 'True',
              type: 'Succeeded',
            },
          ],
          podName: 'basic-node-js-7c8nd-build-container-56c9m-pod-92hdr',
          startTime: '2022-03-16T04:45:42Z',
          steps: [
            {
              container: 'step-build',
              imageID:
                'registry.access.redhat.com/ubi8/buildah@sha256:31f84b19a0774be7cfad751be38fc97f5e86cefd26e0abaec8047ddc650b00bf',
              name: 'build',
              terminated: {
                containerID:
                  'cri-o://03b5a273c724560c34942e91806ab9e9f3297557dd5457074d3f9c46100e6307',
                exitCode: 0,
                finishedAt: '2022-03-16T04:46:56Z',
                reason: 'Completed',
                startedAt: '2022-03-16T04:45:49Z',
              },
            },
            {
              container: 'step-push',
              imageID:
                'registry.access.redhat.com/ubi8/buildah@sha256:31f84b19a0774be7cfad751be38fc97f5e86cefd26e0abaec8047ddc650b00bf',
              name: 'push',
              terminated: {
                containerID:
                  'cri-o://06187047cad853ef11aa3c5737f107fb22c026c4d4974a1c086d83380a87d7db',
                exitCode: 0,
                finishedAt: '2022-03-16T04:47:08Z',
                reason: 'Completed',
                startedAt: '2022-03-16T04:46:56Z',
              },
            },
            {
              container: 'step-digest-to-results',
              imageID:
                'registry.access.redhat.com/ubi8/buildah@sha256:31f84b19a0774be7cfad751be38fc97f5e86cefd26e0abaec8047ddc650b00bf',
              name: 'digest-to-results',
              terminated: {
                containerID:
                  'cri-o://aa5e629a0b3c5861cedd52cc764b3864376f5fb8154a6bfa70dc2623ce4542cc',
                exitCode: 0,
                finishedAt: '2022-03-16T04:47:09Z',
                message:
                  '[{"key":"IMAGE_DIGEST","value":"sha256:f6a352623fcf55f890f5df04852b81acdc3af51aaad79fc4a1ca7d4788d4e117","type":1},{"key":"IMAGE_URL","value":"quay.io/redhat-appstudio/user-workload:sbudhwar-1-basic-node-js\\n","type":1}]',
                reason: 'Completed',
                startedAt: '2022-03-16T04:47:09Z',
              },
            },
          ],
          taskResults: [
            {
              name: 'IMAGE_DIGEST',
              value: 'sha256:f6a352623fcf55f890f5df04852b81acdc3af51aaad79fc4a1ca7d4788d4e117',
            },
            {
              name: 'IMAGE_URL',
              value: 'quay.io/redhat-appstudio/user-workload:sbudhwar-1-basic-node-js\n',
            },
          ],
          taskSpec: {
            description:
              "Buildah task builds source into a container image and then pushes it to a container registry.\nBuildah Task builds source into a container image using Project Atomic's Buildah build tool.It uses Buildah's support for building from Dockerfiles, using its buildah bud command.This command executes the directives in the Dockerfile to assemble a container image, then pushes that image to a container registry.",
            params: [
              {
                description: 'Reference of the image buildah will produce.',
                name: 'IMAGE',
                type: 'string',
              },
              {
                default:
                  'registry.access.redhat.com/ubi8/buildah@sha256:31f84b19a0774be7cfad751be38fc97f5e86cefd26e0abaec8047ddc650b00bf',
                description: 'The location of the buildah builder image.',
                name: 'BUILDER_IMAGE',
                type: 'string',
              },
              {
                default: 'vfs',
                description: 'Set buildah storage driver',
                name: 'STORAGE_DRIVER',
                type: 'string',
              },
              {
                default: './Dockerfile',
                description: 'Path to the Dockerfile to build.',
                name: 'DOCKERFILE',
                type: 'string',
              },
              {
                default: '.',
                description: 'Path to the directory to use as context.',
                name: 'CONTEXT',
                type: 'string',
              },
              {
                default: 'true',
                description:
                  'Verify the TLS on the registry endpoint (for push/pull to a non-TLS registry)',
                name: 'TLSVERIFY',
                type: 'string',
              },
              {
                default: 'oci',
                description: 'The format of the built container, oci or docker',
                name: 'FORMAT',
                type: 'string',
              },
              {
                default: '',
                description: 'Extra parameters passed for the build command when building images.',
                name: 'BUILD_EXTRA_ARGS',
                type: 'string',
              },
              {
                default: '',
                description: 'Extra parameters passed for the push command when pushing images.',
                name: 'PUSH_EXTRA_ARGS',
                type: 'string',
              },
            ],
            results: [
              {
                description: 'Digest of the image just built',
                name: 'IMAGE_DIGEST',
              },
              {
                description: 'Image repository where the built image was pushed',
                name: 'IMAGE_URL',
              },
            ],
            steps: [
              {
                image: '$(params.BUILDER_IMAGE)',
                name: 'build',
                resources: {},
                script:
                  'buildah --storage-driver=$(params.STORAGE_DRIVER) bud \\\n  $(params.BUILD_EXTRA_ARGS) --format=$(params.FORMAT) \\\n  --tls-verify=$(params.TLSVERIFY) --no-cache \\\n  -f $(params.DOCKERFILE) -t $(params.IMAGE) $(params.CONTEXT)\n',
                volumeMounts: [
                  {
                    mountPath: '/var/lib/containers',
                    name: 'varlibcontainers',
                  },
                ],
                workingDir: '$(workspaces.source.path)',
              },
              {
                image: '$(params.BUILDER_IMAGE)',
                name: 'push',
                resources: {},
                script:
                  'buildah --storage-driver=$(params.STORAGE_DRIVER) push \\\n  $(params.PUSH_EXTRA_ARGS) --tls-verify=$(params.TLSVERIFY) \\\n  --digestfile $(workspaces.source.path)/image-digest $(params.IMAGE) \\\n  docker://$(params.IMAGE)\n',
                volumeMounts: [
                  {
                    mountPath: '/var/lib/containers',
                    name: 'varlibcontainers',
                  },
                ],
                workingDir: '$(workspaces.source.path)',
              },
              {
                image: '$(params.BUILDER_IMAGE)',
                name: 'digest-to-results',
                resources: {},
                script:
                  'cat "$(workspaces.source.path)"/image-digest | tee $(results.IMAGE_DIGEST.path)\necho "$(params.IMAGE)" | tee $(results.IMAGE_URL.path)\n',
              },
            ],
            volumes: [
              {
                emptyDir: {},
                name: 'varlibcontainers',
              },
            ],
            workspaces: [
              {
                name: 'source',
              },
            ],
          },
        },
      },
      'basic-node-js-7c8nd-clone-repository-hsgsp': {
        pipelineTaskName: 'clone-repository',
        status: {
          completionTime: '2022-03-16T04:45:32Z',
          conditions: [
            {
              lastTransitionTime: '2022-03-16T04:45:32Z',
              message: 'All Steps have completed executing',
              reason: 'Succeeded',
              status: 'True',
              type: 'Succeeded',
            },
          ],
          podName: 'basic-node-js-7c8nd-clone-repository-hsgsp-pod-jsz8r',
          startTime: '2022-03-16T04:45:25Z',
          steps: [
            {
              container: 'step-clone',
              imageID:
                'registry.redhat.io/openshift-pipelines/pipelines-git-init-rhel8@sha256:af7dd5b3b1598a980f17d5f5d3d8a4b11ab4f5184677f7f17ad302baa36bd3c1',
              name: 'clone',
              terminated: {
                containerID:
                  'cri-o://aa4b3254fc9e190011f66a38c1174978eb05592e5099ba0f00538fa19a226a4e',
                exitCode: 0,
                finishedAt: '2022-03-16T04:45:31Z',
                message:
                  '[{"key":"commit","value":"9c550e6697512069226f45962e203f19881f0617","type":1},{"key":"url","value":"https://github.com/nodeshift-starters/devfile-sample.git","type":1}]',
                reason: 'Completed',
                startedAt: '2022-03-16T04:45:31Z',
              },
            },
          ],
          taskResults: [
            {
              name: 'commit',
              value: '9c550e6697512069226f45962e203f19881f0617',
            },
            {
              name: 'url',
              value: 'https://github.com/nodeshift-starters/devfile-sample.git',
            },
          ],
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
                env: [
                  {
                    name: 'HOME',
                    value: '$(params.userHome)',
                  },
                  {
                    name: 'PARAM_URL',
                    value: '$(params.url)',
                  },
                  {
                    name: 'PARAM_REVISION',
                    value: '$(params.revision)',
                  },
                  {
                    name: 'PARAM_REFSPEC',
                    value: '$(params.refspec)',
                  },
                  {
                    name: 'PARAM_SUBMODULES',
                    value: '$(params.submodules)',
                  },
                  {
                    name: 'PARAM_DEPTH',
                    value: '$(params.depth)',
                  },
                  {
                    name: 'PARAM_SSL_VERIFY',
                    value: '$(params.sslVerify)',
                  },
                  {
                    name: 'PARAM_SUBDIRECTORY',
                    value: '$(params.subdirectory)',
                  },
                  {
                    name: 'PARAM_DELETE_EXISTING',
                    value: '$(params.deleteExisting)',
                  },
                  {
                    name: 'PARAM_HTTP_PROXY',
                    value: '$(params.httpProxy)',
                  },
                  {
                    name: 'PARAM_HTTPS_PROXY',
                    value: '$(params.httpsProxy)',
                  },
                  {
                    name: 'PARAM_NO_PROXY',
                    value: '$(params.noProxy)',
                  },
                  {
                    name: 'PARAM_VERBOSE',
                    value: '$(params.verbose)',
                  },
                  {
                    name: 'PARAM_SPARSE_CHECKOUT_DIRECTORIES',
                    value: '$(params.sparseCheckoutDirectories)',
                  },
                  {
                    name: 'PARAM_USER_HOME',
                    value: '$(params.userHome)',
                  },
                  {
                    name: 'WORKSPACE_OUTPUT_PATH',
                    value: '$(workspaces.output.path)',
                  },
                  {
                    name: 'WORKSPACE_SSH_DIRECTORY_BOUND',
                    value: '$(workspaces.ssh-directory.bound)',
                  },
                  {
                    name: 'WORKSPACE_SSH_DIRECTORY_PATH',
                    value: '$(workspaces.ssh-directory.path)',
                  },
                  {
                    name: 'WORKSPACE_BASIC_AUTH_DIRECTORY_BOUND',
                    value: '$(workspaces.basic-auth.bound)',
                  },
                  {
                    name: 'WORKSPACE_BASIC_AUTH_DIRECTORY_PATH',
                    value: '$(workspaces.basic-auth.path)',
                  },
                ],
                image: '$(params.gitInitImage)',
                name: 'clone',
                resources: {},
                script:
                  '#!/usr/bin/env sh\nset -eu\n\nif [ "${PARAM_VERBOSE}" = "true" ] ; then\n  set -x\nfi\n\nif [ "${WORKSPACE_BASIC_AUTH_DIRECTORY_BOUND}" = "true" ] ; then\n  cp "${WORKSPACE_BASIC_AUTH_DIRECTORY_PATH}/.git-credentials" "${PARAM_USER_HOME}/.git-credentials"\n  cp "${WORKSPACE_BASIC_AUTH_DIRECTORY_PATH}/.gitconfig" "${PARAM_USER_HOME}/.gitconfig"\n  chmod 400 "${PARAM_USER_HOME}/.git-credentials"\n  chmod 400 "${PARAM_USER_HOME}/.gitconfig"\nfi\n\nif [ "${WORKSPACE_SSH_DIRECTORY_BOUND}" = "true" ] ; then\n  cp -R "${WORKSPACE_SSH_DIRECTORY_PATH}" "${PARAM_USER_HOME}"/.ssh\n  chmod 700 "${PARAM_USER_HOME}"/.ssh\n  chmod -R 400 "${PARAM_USER_HOME}"/.ssh/*\nfi\n\nCHECKOUT_DIR="${WORKSPACE_OUTPUT_PATH}/${PARAM_SUBDIRECTORY}"\n\ncleandir() {\n  # Delete any existing contents of the repo directory if it exists.\n  #\n  # We don\'t just "rm -rf ${CHECKOUT_DIR}" because ${CHECKOUT_DIR} might be "/"\n  # or the root of a mounted volume.\n  if [ -d "${CHECKOUT_DIR}" ] ; then\n    # Delete non-hidden files and directories\n    rm -rf "${CHECKOUT_DIR:?}"/*\n    # Delete files and directories starting with . but excluding ..\n    rm -rf "${CHECKOUT_DIR}"/.[!.]*\n    # Delete files and directories starting with .. plus any other character\n    rm -rf "${CHECKOUT_DIR}"/..?*\n  fi\n}\n\nif [ "${PARAM_DELETE_EXISTING}" = "true" ] ; then\n  cleandir\nfi\n\ntest -z "${PARAM_HTTP_PROXY}" || export HTTP_PROXY="${PARAM_HTTP_PROXY}"\ntest -z "${PARAM_HTTPS_PROXY}" || export HTTPS_PROXY="${PARAM_HTTPS_PROXY}"\ntest -z "${PARAM_NO_PROXY}" || export NO_PROXY="${PARAM_NO_PROXY}"\n\n/ko-app/git-init \\\n  -url="${PARAM_URL}" \\\n  -revision="${PARAM_REVISION}" \\\n  -refspec="${PARAM_REFSPEC}" \\\n  -path="${CHECKOUT_DIR}" \\\n  -sslVerify="${PARAM_SSL_VERIFY}" \\\n  -submodules="${PARAM_SUBMODULES}" \\\n  -depth="${PARAM_DEPTH}" \\\n  -sparseCheckoutDirectories="${PARAM_SPARSE_CHECKOUT_DIRECTORIES}"\ncd "${CHECKOUT_DIR}"\nRESULT_SHA="$(git rev-parse HEAD)"\nEXIT_CODE="$?"\nif [ "${EXIT_CODE}" != 0 ] ; then\n  exit "${EXIT_CODE}"\nfi\nprintf "%s" "${RESULT_SHA}" > "$(results.commit.path)"\nprintf "%s" "${PARAM_URL}" > "$(results.url.path)"\n',
              },
            ],
            workspaces: [
              {
                description: 'The git repo will be cloned onto the volume backing this Workspace.',
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
            input: 'false',
            operator: 'in',
            values: ['false'],
          },
        ],
      },
      'basic-node-js-7c8nd-show-summary-xncs9': {
        pipelineTaskName: 'show-summary',
        status: {
          completionTime: '2022-03-16T04:47:18Z',
          conditions: [
            {
              lastTransitionTime: '2022-03-16T04:47:18Z',
              message: 'All Steps have completed executing',
              reason: 'Succeeded',
              status: 'True',
              type: 'Succeeded',
            },
          ],
          podName: 'basic-node-js-7c8nd-show-summary-xncs9-pod-6swnq',
          startTime: '2022-03-16T04:47:10Z',
          steps: [
            {
              container: 'step-appstudio-summary',
              imageID:
                'quay.io/redhat-appstudio/appstudio-utils@sha256:bb587dcee6157107a518786c83adc22c336352bd37ce421fc7ba508bce9b0666',
              name: 'appstudio-summary',
              terminated: {
                containerID:
                  'cri-o://9d549905391fa05dede49e58b128f383cd2582f0de1e6ff24ae6dc4cdc8391b7',
                exitCode: 0,
                finishedAt: '2022-03-16T04:47:18Z',
                reason: 'Completed',
                startedAt: '2022-03-16T04:47:17Z',
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
              {
                default: '',
                description: 'Deployment Yaml from dev-file',
                name: 'deploy-yaml',
                type: 'string',
              },
            ],
            steps: [
              {
                image:
                  'quay.io/redhat-appstudio/appstudio-utils:8201a567956ba6d2095d615ea2c0f6ab35f9ba5f',
                name: 'appstudio-summary',
                resources: {},
                script:
                  '#!/usr/bin/env bash    \necho  \necho "App Studio Build Summary:"\necho\necho "Build repository: $(params.git-url)" \necho "Generated Image is in : $(params.image-url)"  \necho  \noc annotate pipelinerun $(params.pipeline-run-name) build.appstudio.openshift.io/repo=$(params.git-url)\noc annotate pipelinerun $(params.pipeline-run-name) build.appstudio.openshift.io/image=$(params.image-url)\nif [ -z "$(params.deploy-yaml)" ]\nthen\n  echo "No Deployment Yaml Found in this Build"    \nelse  \n  echo "Deployment Yaml Found in this Build"    \n  oc annotate pipelinerun $(params.pipeline-run-name) build.appstudio.openshift.io/deploy="$(params.deploy-yaml)"\nfi\n\necho "Output is in the following annotations:"\n\necho "Build Repo is in \'build.appstudio.openshift.io/repo\' "\necho \'oc get pr $(params.pipeline-run-name) -o jsonpath="{.metadata.annotations.build\\.appstudio\\.openshift\\.io/repo}"\' \n\necho "Build Image is in \'build.appstudio.openshift.io/image\' "\necho \'oc get pr $(params.pipeline-run-name) -o jsonpath="{.metadata.annotations.build\\.appstudio\\.openshift\\.io/image}"\' \n\necho End Summary\n',
              },
            ],
            workspaces: [
              {
                name: 'source',
                optional: true,
              },
            ],
          },
        },
      },
    },
  },
};
