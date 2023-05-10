export const mockBuildPipelinesData = [
  {
    apiVersion: 'tekton.dev/v1beta1',
    kind: 'PipelineRun',
    metadata: {
      generateName: 'test-go-on-push-',
      annotations: {
        'pipelinesascode.tekton.dev/on-target-branch': '[main]',
        'pipelinesascode.tekton.dev/repo-url':
          'https://github.com/test-user-1/devfile-sample-go-basic',
        'pipelinesascode.tekton.dev/sha-title':
          'Merge pull request #1 from test-user-1/appstudio-test-go',
        'results.tekton.dev/record':
          'test-ns/results/3be3404b-06a1-4cb2-866b-c58de8870bf3/records/3be3404b-06a1-4cb2-866b-c58de8870bf3',
        'pipelinesascode.tekton.dev/git-auth-secret': 'pac-gitauth-mmjm',
        'chains.tekton.dev/transparency':
          'http://rekor-server.enterprise-contract-service.svc:3000/api/v1/log/entries?logIndex=86719',
        'chains.tekton.dev/signed': 'true',
        'results.tekton.dev/result': 'test-ns/results/3be3404b-06a1-4cb2-866b-c58de8870bf3',
        'build.appstudio.redhat.com/target_branch': 'main',
        'pipelinesascode.tekton.dev/max-keep-runs': '3',
        'pipelinesascode.tekton.dev/sha-url':
          'https://github.com/test-user-1/devfile-sample-go-basic/commit/25c700a1329eba94361c9c93bcd6e0a21c58026c',
        'pipelinesascode.tekton.dev/on-event': '[push]',
        'pipelinesascode.tekton.dev/installation-id': '28591076',
        'build.appstudio.redhat.com/commit_sha': '25c700a1329eba94361c9c93bcd6e0a21c58026c',
      },
      resourceVersion: '1108663616',
      name: 'test-go-on-push-dnpw8',
      uid: '3be3404b-06a1-4cb2-866b-c58de8870bf3',
      creationTimestamp: '2022-08-25T17:36:33Z',
      generation: 1,
      managedFields: [
        {
          apiVersion: 'tekton.dev/v1beta1',
          fieldsType: 'FieldsV1',
          fieldsV1: {
            'f:metadata': {
              'f:annotations': {
                'f:pipelinesascode.tekton.dev/on-event': {},
                'f:build.appstudio.redhat.com/target_branch': {},
                'f:pipelinesascode.tekton.dev/max-keep-runs': {},
                'f:build.appstudio.redhat.com/commit_sha': {},
                'f:pipelinesascode.tekton.dev/on-target-branch': {},
                '.': {},
                'f:pipelinesascode.tekton.dev/repo-url': {},
                'f:pipelinesascode.tekton.dev/sha-url': {},
                'f:pipelinesascode.tekton.dev/installation-id': {},
                'f:pipelinesascode.tekton.dev/sha-title': {},
                'f:pipelinesascode.tekton.dev/git-auth-secret': {},
              },
              'f:generateName': {},
              'f:labels': {
                'f:pipelinesascode.tekton.dev/url-repository': {},
                'f:pipelines.appstudio.openshift.io/type': {},
                'f:pipelinesascode.tekton.dev/repository': {},
                'f:app.kubernetes.io/managed-by': {},
                'f:appstudio.openshift.io/application': {},
                'f:pipelinesascode.tekton.dev/url-org': {},
                'f:pipelinesascode.tekton.dev/git-provider': {},
                'f:pipelinesascode.tekton.dev/event-type': {},
                'f:pipelinesascode.tekton.dev/original-prname': {},
                '.': {},
                'f:pipelinesascode.tekton.dev/sha': {},
                'f:pipelinesascode.tekton.dev/sender': {},
                'f:pipelinesascode.tekton.dev/state': {},
                'f:appstudio.openshift.io/component': {},
                'f:app.kubernetes.io/version': {},
                'f:pipelinesascode.tekton.dev/branch': {},
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
          manager: 'pipelines-as-code-controller',
          operation: 'Update',
          time: '2022-08-25T17:36:33Z',
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
          time: '2022-08-25T17:36:34Z',
        },
        {
          apiVersion: 'tekton.dev/v1beta1',
          fieldsType: 'FieldsV1',
          fieldsV1: {
            'f:metadata': {
              'f:annotations': {
                'f:results.tekton.dev/record': {},
                'f:results.tekton.dev/result': {},
              },
            },
          },
          manager: 'watcher',
          operation: 'Update',
          time: '2022-08-25T17:36:34Z',
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
                'f:finally': {},
                'f:params': {},
                'f:results': {},
                'f:tasks': {},
                'f:workspaces': {},
              },
              'f:startTime': {},
              'f:taskRuns': {
                '.': {},
                'f:test-go-on-push-dnpw8-appstudio-init': {
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
                    },
                  },
                },
                'f:test-go-on-push-dnpw8-clone-repository': {
                  '.': {},
                  'f:pipelineTaskName': {},
                  'f:status': {
                    '.': {},
                    'f:completionTime': {},
                    'f:conditions': {},
                    'f:podName': {},
                    'f:startTime': {},
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
              },
            },
          },
          manager: 'openshift-pipelines-controller',
          operation: 'Update',
          subresource: 'status',
          time: '2022-08-25T18:36:34Z',
        },
        {
          apiVersion: 'tekton.dev/v1beta1',
          fieldsType: 'FieldsV1',
          fieldsV1: {
            'f:metadata': {
              'f:annotations': {
                'f:chains.tekton.dev/signed': {},
                'f:chains.tekton.dev/transparency': {},
              },
              'f:finalizers': {
                '.': {},
                'v:"chains.tekton.dev/pipelinerun"': {},
                'v:"pipelinesascode.tekton.dev"': {},
              },
            },
          },
          manager: 'Go-http-client',
          operation: 'Update',
          time: '2022-09-20T11:11:30Z',
        },
      ],
      namespace: 'test-ns',
      finalizers: ['chains.tekton.dev/pipelinerun', 'pipelinesascode.tekton.dev'],
      labels: {
        'pipelinesascode.tekton.dev/state': 'started',
        'appstudio.openshift.io/component': 'test-go',
        'pipelines.openshift.io/runtime': 'generic',
        'pipelinesascode.tekton.dev/sender': 'test-user-1',
        'pipelines.openshift.io/strategy': 'docker',
        'app.kubernetes.io/version': '0.10.2',
        'tekton.dev/pipeline': 'docker-build',
        'pipelines.openshift.io/used-by': 'build-cloud',
        'app.kubernetes.io/managed-by': 'pipelinesascode.tekton.dev',
        'pipelinesascode.tekton.dev/branch': 'refs-heads-main',
        'appstudio.openshift.io/application': 'test-dev-samples',
        'pipelinesascode.tekton.dev/url-org': 'test-user-1',
        'pipelinesascode.tekton.dev/original-prname': 'test-go-on-push',
        'pipelines.appstudio.openshift.io/type': 'build',
        'pipelinesascode.tekton.dev/url-repository': 'devfile-sample-go-basic',
        'pipelinesascode.tekton.dev/repository': 'test-go',
        'pipelinesascode.tekton.dev/sha': '25c700a1329eba94361c9c93bcd6e0a21c58026c',
        'pipelinesascode.tekton.dev/git-provider': 'github',
        'pipelinesascode.tekton.dev/event-type': 'push',
      },
    },
    spec: {
      params: [
        {
          name: 'git-url',
          value: 'https://github.com/test-user-1/devfile-sample-go-basic',
        },
        {
          name: 'revision',
          value: '25c700a1329eba94361c9c93bcd6e0a21c58026c',
        },
        {
          name: 'output-image',
          value: 'quay.io/redhat-appstudio/user-workload:25c700a1329eba94361c9c93bcd6e0a21c58026c',
        },
        {
          name: 'path-context',
          value: '.',
        },
        {
          name: 'dockerfile',
          value: 'Dockerfile',
        },
      ],
      pipelineRef: {
        bundle:
          'quay.io/redhat-appstudio/build-templates-bundle:510fa6e99f1fa1f816c96354bbaf1ad155c6d9c3',
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
          subPath: 'test-go-on-push-25c700a1329eba94361c9c93bcd6e0a21c58026c',
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
      completionTime: '2022-08-25T18:36:34Z',
      conditions: [
        {
          lastTransitionTime: '2022-08-25T18:36:34Z',
          message: 'PipelineRun "test-go-on-push-dnpw8" failed to finish within "1h0m0s"',
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
                'quay.io/redhat-appstudio/appstudio-tasks:510fa6e99f1fa1f816c96354bbaf1ad155c6d9c3-2',
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
                'quay.io/redhat-appstudio/appstudio-tasks:510fa6e99f1fa1f816c96354bbaf1ad155c6d9c3-1',
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
                'quay.io/redhat-appstudio/appstudio-tasks:510fa6e99f1fa1f816c96354bbaf1ad155c6d9c3-1',
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
                'quay.io/redhat-appstudio/appstudio-tasks:510fa6e99f1fa1f816c96354bbaf1ad155c6d9c3-1',
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
                'quay.io/redhat-appstudio/appstudio-tasks:510fa6e99f1fa1f816c96354bbaf1ad155c6d9c3-1',
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
      startTime: '2022-08-25T17:36:34Z',
      taskRuns: {
        'test-go-on-push-dnpw8-appstudio-init': {
          pipelineTaskName: 'appstudio-init',
          status: {
            completionTime: '2022-08-25T17:36:47Z',
            conditions: [
              {
                lastTransitionTime: '2022-08-25T17:36:47Z',
                message: 'All Steps have completed executing',
                reason: 'Succeeded',
                status: 'True',
                type: 'Succeeded',
              },
            ],
            podName: 'test-go-on-push-dnpw8-appstudio-init-pod',
            startTime: '2022-08-25T17:36:34Z',
            steps: [
              {
                container: 'step-appstudio-init',
                imageID:
                  'registry.access.redhat.com/ubi8/skopeo@sha256:cc58da50c3842f5f2a4ba8781b60f6052919a5555a000cb4eb18a0bd0241b2b3',
                name: 'appstudio-init',
                terminated: {
                  containerID:
                    'cri-o://3003dd4e2398fa5d1d48558b003a2abdca639c22d7f72dd666bea44e5671deb0',
                  exitCode: 0,
                  finishedAt: '2022-08-25T17:36:45Z',
                  message: '[{"key":"build","value":"true","type":1}]',
                  reason: 'Completed',
                  startedAt: '2022-08-25T17:36:45Z',
                },
              },
              {
                container: 'step-hacbs-init',
                imageID:
                  'registry.redhat.io/openshift4/ose-cli@sha256:c08c8f9d2fa3b4b6bd848fd87b58b7d95076eec98d324195f7102c97fdf1074a',
                name: 'hacbs-init',
                terminated: {
                  containerID:
                    'cri-o://c15fcf0d6c29cfcfaf9d245a63f610fba11c6aa749bb2884bbc05620690e148f',
                  exitCode: 0,
                  finishedAt: '2022-08-25T17:36:46Z',
                  message: '[{"key":"build","value":"true","type":1}]',
                  reason: 'Completed',
                  startedAt: '2022-08-25T17:36:45Z',
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
                {
                  default: 'false',
                  description: 'Set jvm build service config',
                  name: 'jvm-build-service-init',
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
                {
                  image: 'registry.redhat.io/openshift4/ose-cli:v4.10',
                  name: 'hacbs-init',
                  resources: {},
                  script:
                    'if [ "$(params.jvm-build-service-init)" == "true" ] && ! oc get configmap jvm-build-config &>/dev/null; then\n  oc create configmap jvm-build-config --from-literal enable-rebuilds="false"\nfi\n# Create empty secret which is now hardcoded in PaC Pipelinerun template\nif ! oc get secret redhat-appstudio-registry-pull-secret &>/dev/null; then\n  oc create secret generic redhat-appstudio-registry-pull-secret\nfi\n',
                },
              ],
            },
          },
        },
        'test-go-on-push-dnpw8-clone-repository': {
          pipelineTaskName: 'clone-repository',
          status: {
            completionTime: '2022-08-25T18:36:33Z',
            conditions: [
              {
                lastTransitionTime: '2022-08-25T18:36:33Z',
                message:
                  'TaskRun "test-go-on-push-dnpw8-clone-repository" failed to finish within "59m45.216843579s"',
                reason: 'TaskRunTimeout',
                status: 'False',
                type: 'Succeeded',
              },
            ],
            podName: 'test-go-on-push-dnpw8-clone-repository-pod',
            startTime: '2022-08-25T17:36:48Z',
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
        },
      },
    },
  },
  {
    apiVersion: 'tekton.dev/v1beta1',
    kind: 'PipelineRun',
    metadata: {
      generateName: 'test-go-on-push-',
      annotations: {
        'pipelinesascode.tekton.dev/on-target-branch': '[main]',
        'pipelinesascode.tekton.dev/repo-url':
          'https://github.com/test-user-1/devfile-sample-go-basic',
        'pipelinesascode.tekton.dev/sha-title': 'Merge pull request #3 from test-user-1/test-pr',
        'results.tekton.dev/record':
          'test-ns/results/09d7ae02-7df2-475d-a6db-27a2decff122/records/09d7ae02-7df2-475d-a6db-27a2decff122',
        'pipelinesascode.tekton.dev/git-auth-secret': 'pac-gitauth-ozlw',
        'results.tekton.dev/result': 'test-ns/results/09d7ae02-7df2-475d-a6db-27a2decff122',
        'build.appstudio.redhat.com/target_branch': 'main',
        'pipelinesascode.tekton.dev/max-keep-runs': '3',
        'pipelinesascode.tekton.dev/sha-url':
          'https://github.com/test-user-1/devfile-sample-go-basic/commit/13b857ce22ddb80c29deb06db268d733f9c609bc',
        'pipelinesascode.tekton.dev/on-event': '[push]',
        'pipelinesascode.tekton.dev/installation-id': '28591076',
        'build.appstudio.redhat.com/commit_sha': '13b857ce22ddb80c29deb06db268d733f9c609bc',
      },
      resourceVersion: '1108663898',
      name: 'test-go-on-push-grjtn',
      uid: '09d7ae02-7df2-475d-a6db-27a2decff122',
      creationTimestamp: '2022-09-13T13:22:12Z',
      generation: 1,
      managedFields: [
        {
          apiVersion: 'tekton.dev/v1beta1',
          fieldsType: 'FieldsV1',
          fieldsV1: {
            'f:metadata': {
              'f:annotations': {
                'f:pipelinesascode.tekton.dev/on-event': {},
                'f:build.appstudio.redhat.com/target_branch': {},
                'f:pipelinesascode.tekton.dev/max-keep-runs': {},
                'f:build.appstudio.redhat.com/commit_sha': {},
                'f:pipelinesascode.tekton.dev/on-target-branch': {},
                '.': {},
                'f:pipelinesascode.tekton.dev/repo-url': {},
                'f:pipelinesascode.tekton.dev/sha-url': {},
                'f:pipelinesascode.tekton.dev/installation-id': {},
                'f:pipelinesascode.tekton.dev/sha-title': {},
                'f:pipelinesascode.tekton.dev/git-auth-secret': {},
              },
              'f:generateName': {},
              'f:labels': {
                'f:pipelinesascode.tekton.dev/url-repository': {},
                'f:pipelines.appstudio.openshift.io/type': {},
                'f:pipelinesascode.tekton.dev/repository': {},
                'f:app.kubernetes.io/managed-by': {},
                'f:appstudio.openshift.io/application': {},
                'f:pipelinesascode.tekton.dev/url-org': {},
                'f:pipelinesascode.tekton.dev/git-provider': {},
                'f:pipelinesascode.tekton.dev/event-type': {},
                'f:pipelinesascode.tekton.dev/original-prname': {},
                '.': {},
                'f:pipelinesascode.tekton.dev/sha': {},
                'f:pipelinesascode.tekton.dev/sender': {},
                'f:pipelinesascode.tekton.dev/state': {},
                'f:appstudio.openshift.io/component': {},
                'f:app.kubernetes.io/version': {},
                'f:pipelinesascode.tekton.dev/branch': {},
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
          manager: 'pipelines-as-code-controller',
          operation: 'Update',
          time: '2022-09-13T13:22:12Z',
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
          time: '2022-09-13T13:22:13Z',
        },
        {
          apiVersion: 'tekton.dev/v1beta1',
          fieldsType: 'FieldsV1',
          fieldsV1: {
            'f:metadata': {
              'f:annotations': {
                'f:results.tekton.dev/record': {},
                'f:results.tekton.dev/result': {},
              },
            },
          },
          manager: 'watcher',
          operation: 'Update',
          time: '2022-09-13T13:22:13Z',
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
                'f:finally': {},
                'f:params': {},
                'f:results': {},
                'f:tasks': {},
                'f:workspaces': {},
              },
              'f:skippedTasks': {},
              'f:startTime': {},
              'f:taskRuns': {
                '.': {},
                'f:test-go-on-push-grjtn-appstudio-init': {
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
                    },
                  },
                },
                'f:test-go-on-push-grjtn-clone-repository': {
                  '.': {},
                  'f:pipelineTaskName': {},
                  'f:status': {
                    '.': {},
                    'f:completionTime': {},
                    'f:conditions': {},
                    'f:podName': {},
                    'f:startTime': {},
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
                'f:test-go-on-push-grjtn-show-summary': {
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
                    },
                  },
                },
              },
            },
          },
          manager: 'openshift-pipelines-controller',
          operation: 'Update',
          subresource: 'status',
          time: '2022-09-13T14:22:14Z',
        },
        {
          apiVersion: 'tekton.dev/v1beta1',
          fieldsType: 'FieldsV1',
          fieldsV1: {
            'f:metadata': {
              'f:finalizers': {
                '.': {},
                'v:"chains.tekton.dev/pipelinerun"': {},
                'v:"pipelinesascode.tekton.dev"': {},
              },
            },
          },
          manager: 'Go-http-client',
          operation: 'Update',
          time: '2022-09-20T11:11:35Z',
        },
      ],
      namespace: 'test-ns',
      finalizers: ['chains.tekton.dev/pipelinerun', 'pipelinesascode.tekton.dev'],
      labels: {
        'pipelinesascode.tekton.dev/state': 'started',
        'appstudio.openshift.io/component': 'test-go',
        'pipelines.openshift.io/runtime': 'generic',
        'pipelinesascode.tekton.dev/sender': 'test-user-1',
        'pipelines.openshift.io/strategy': 'docker',
        'app.kubernetes.io/version': '0.10.2',
        'tekton.dev/pipeline': 'docker-build',
        'pipelines.openshift.io/used-by': 'build-cloud',
        'app.kubernetes.io/managed-by': 'pipelinesascode.tekton.dev',
        'pipelinesascode.tekton.dev/branch': 'refs-heads-main',
        'appstudio.openshift.io/application': 'test-dev-samples',
        'pipelinesascode.tekton.dev/url-org': 'test-user-1',
        'pipelinesascode.tekton.dev/original-prname': 'test-go-on-push',
        'pipelines.appstudio.openshift.io/type': 'build',
        'pipelinesascode.tekton.dev/url-repository': 'devfile-sample-go-basic',
        'pipelinesascode.tekton.dev/repository': 'test-go',
        'pipelinesascode.tekton.dev/sha': '13b857ce22ddb80c29deb06db268d733f9c609bc',
        'pipelinesascode.tekton.dev/git-provider': 'github',
        'pipelinesascode.tekton.dev/event-type': 'push',
      },
    },
    spec: {
      params: [
        {
          name: 'git-url',
          value: 'https://github.com/test-user-1/devfile-sample-go-basic',
        },
        {
          name: 'revision',
          value: '13b857ce22ddb80c29deb06db268d733f9c609bc',
        },
        {
          name: 'output-image',
          value: 'quay.io/redhat-appstudio/user-workload:13b857ce22ddb80c29deb06db268d733f9c609bc',
        },
        {
          name: 'path-context',
          value: '.',
        },
        {
          name: 'dockerfile',
          value: 'Dockerfile',
        },
      ],
      pipelineRef: {
        bundle:
          'quay.io/redhat-appstudio/build-templates-bundle:510fa6e99f1fa1f816c96354bbaf1ad155c6d9c3',
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
          subPath: 'test-go-on-push-13b857ce22ddb80c29deb06db268d733f9c609bc',
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
      completionTime: '2022-09-13T14:22:13Z',
      conditions: [
        {
          lastTransitionTime: '2022-09-13T14:22:13Z',
          message: 'PipelineRun "test-go-on-push-grjtn" failed to finish within "1h0m0s"',
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
                'quay.io/redhat-appstudio/appstudio-tasks:510fa6e99f1fa1f816c96354bbaf1ad155c6d9c3-2',
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
                'quay.io/redhat-appstudio/appstudio-tasks:510fa6e99f1fa1f816c96354bbaf1ad155c6d9c3-1',
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
                'quay.io/redhat-appstudio/appstudio-tasks:510fa6e99f1fa1f816c96354bbaf1ad155c6d9c3-1',
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
                'quay.io/redhat-appstudio/appstudio-tasks:510fa6e99f1fa1f816c96354bbaf1ad155c6d9c3-1',
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
                'quay.io/redhat-appstudio/appstudio-tasks:510fa6e99f1fa1f816c96354bbaf1ad155c6d9c3-1',
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
      startTime: '2022-09-13T13:22:13Z',
      taskRuns: {
        'test-go-on-push-grjtn-appstudio-init': {
          pipelineTaskName: 'appstudio-init',
          status: {
            completionTime: '2022-09-13T13:22:29Z',
            conditions: [
              {
                lastTransitionTime: '2022-09-13T13:22:29Z',
                message: 'All Steps have completed executing',
                reason: 'Succeeded',
                status: 'True',
                type: 'Succeeded',
              },
            ],
            podName: 'test-go-on-push-grjtn-appstudio-init-pod',
            startTime: '2022-09-13T13:22:13Z',
            steps: [
              {
                container: 'step-appstudio-init',
                imageID:
                  'registry.access.redhat.com/ubi8/skopeo@sha256:cc58da50c3842f5f2a4ba8781b60f6052919a5555a000cb4eb18a0bd0241b2b3',
                name: 'appstudio-init',
                terminated: {
                  containerID:
                    'cri-o://f434099fd314bda78366893007c487b09f35d2e6217886253fce5c5fa83405cb',
                  exitCode: 0,
                  finishedAt: '2022-09-13T13:22:27Z',
                  message: '[{"key":"build","value":"true","type":1}]',
                  reason: 'Completed',
                  startedAt: '2022-09-13T13:22:26Z',
                },
              },
              {
                container: 'step-hacbs-init',
                imageID:
                  'registry.redhat.io/openshift4/ose-cli@sha256:9aa3e73ab19113150864bcceaa18eaaf3961a37d713a3e97c55c6ab0eee6f2c1',
                name: 'hacbs-init',
                terminated: {
                  containerID:
                    'cri-o://71637e852c9bd54883d53b1424cba56882f7a1e88a21568cbdf6d346c7824d1d',
                  exitCode: 0,
                  finishedAt: '2022-09-13T13:22:28Z',
                  message: '[{"key":"build","value":"true","type":1}]',
                  reason: 'Completed',
                  startedAt: '2022-09-13T13:22:27Z',
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
                {
                  default: 'false',
                  description: 'Set jvm build service config',
                  name: 'jvm-build-service-init',
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
                {
                  image: 'registry.redhat.io/openshift4/ose-cli:v4.10',
                  name: 'hacbs-init',
                  resources: {},
                  script:
                    'if [ "$(params.jvm-build-service-init)" == "true" ] && ! oc get configmap jvm-build-config &>/dev/null; then\n  oc create configmap jvm-build-config --from-literal enable-rebuilds="false"\nfi\n# Create empty secret which is now hardcoded in PaC Pipelinerun template\nif ! oc get secret redhat-appstudio-registry-pull-secret &>/dev/null; then\n  oc create secret generic redhat-appstudio-registry-pull-secret\nfi\n',
                },
              ],
            },
          },
        },
        'test-go-on-push-grjtn-clone-repository': {
          pipelineTaskName: 'clone-repository',
          status: {
            completionTime: '2022-09-13T14:22:12Z',
            conditions: [
              {
                lastTransitionTime: '2022-09-13T14:22:12Z',
                message:
                  'TaskRun "test-go-on-push-grjtn-clone-repository" failed to finish within "59m41.401438347s"',
                reason: 'TaskRunTimeout',
                status: 'False',
                type: 'Succeeded',
              },
            ],
            podName: 'test-go-on-push-grjtn-clone-repository-pod',
            startTime: '2022-09-13T13:22:31Z',
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
        },
        'test-go-on-push-grjtn-show-summary': {
          pipelineTaskName: 'show-summary',
          status: {
            completionTime: '2022-09-13T14:22:14Z',
            conditions: [
              {
                lastTransitionTime: '2022-09-13T14:22:14Z',
                message:
                  'TaskRun "test-go-on-push-grjtn-show-summary" failed to finish within "1s"',
                reason: 'TaskRunTimeout',
                status: 'False',
                type: 'Succeeded',
              },
            ],
            podName: 'test-go-on-push-grjtn-show-summary-pod',
            startTime: '2022-09-13T14:22:13Z',
            steps: [
              {
                container: 'step-appstudio-summary',
                name: 'appstudio-summary',
                terminated: {
                  exitCode: 1,
                  finishedAt: '2022-09-13T14:22:14Z',
                  reason: 'TaskRunTimeout',
                  startedAt: null,
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
];
