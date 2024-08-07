export const mockPipelineRun = {
  apiVersion: 'tekton.dev/v1',
  kind: 'PipelineRun',
  metadata: {
    generateName: 'human-resources-clkq-on-pull-request-',
    annotations: {
      'pipelinesascode.tekton.dev/on-target-branch': '[main,master]',
      'pipelinesascode.tekton.dev/repo-url': 'https://github.com/test-repo/human-resources',
      'pipelinesascode.tekton.dev/sha-title': 'Update tekton references',
      'results.tekton.dev/record':
        'test-tenant/results/014c3e9f-90e9-4cd4-83eb-f0fdd8fe6714/records/014c3e9f-90e9-4cd4-83eb-f0fdd8fe6714',
      'pipelinesascode.tekton.dev/git-auth-secret': 'pac-gitauth-zzez',
      'build.appstudio.openshift.io/repo':
        'https://github.com/test-repo/human-resources?rev=36e49113fc391cc1a4723afb0269a88c9e54608d',
      'chains.tekton.dev/signed': 'true',
      'results.tekton.dev/result': 'test-tenant/results/014c3e9f-90e9-4cd4-83eb-f0fdd8fe6714',
      'pipelinesascode.tekton.dev/log-url':
        'https://console-openshift-console.apps.stone-prd-m01.84db.p1.openshiftapps.com/k8s/ns/test-tenant/tekton.dev~v1beta1~PipelineRun/human-resources-clkq-on-pull-request-xn5nd',
      'build.appstudio.redhat.com/target_branch': 'main',
      'pipelinesascode.tekton.dev/max-keep-runs': '3',
      'build.appstudio.redhat.com/pull_request_number': '2',
      'pipelinesascode.tekton.dev/sha-url':
        'https://github.com/test-repo/human-resources/commit/36e49113fc391cc1a4723afb0269a88c9e54608d',
      'pipelinesascode.tekton.dev/on-event': '[pull_request]',
      'pipelinesascode.tekton.dev/installation-id': '34687113',
      'build.appstudio.redhat.com/commit_sha': '36e49113fc391cc1a4723afb0269a88c9e54608d',
      'build.appstudio.openshift.io/image':
        'quay.io/redhat-appstudio/user-workload:on-pr-36e49113fc391cc1a4723afb0269a88c9e54608d',
    },
    resourceVersion: '57573957',
    name: 'human-resources-clkq-on-pull-request-xn5nd',
    uid: '014c3e9f-90e9-4cd4-83eb-f0fdd8fe6714',
    creationTimestamp: '2023-03-16T00:49:14Z',
    generation: 1,
    namespace: 'test-tenant',
    finalizers: ['chains.tekton.dev/pipelinerun', 'pipelinesascode.tekton.dev'],
    labels: {
      'pipelinesascode.tekton.dev/state': 'completed',
      'appstudio.openshift.io/component': 'human-resources-clkq',
      'pipelinesascode.tekton.dev/sender': 'rh-trusted-application-pipeline__bot',
      'app.kubernetes.io/version': 'v0.15.0',
      'tekton.dev/pipeline': 'human-resources-clkq-on-pull-request-xn5nd',
      'app.kubernetes.io/managed-by': 'pipelinesascode.tekton.dev',
      'pipelinesascode.tekton.dev/check-run-id': '12037335647',
      'pipelinesascode.tekton.dev/branch': 'main',
      'appstudio.openshift.io/application': 'my-test-output',
      'pipelinesascode.tekton.dev/url-org': 'test-repo',
      'pipelinesascode.tekton.dev/original-prname': 'human-resources-clkq-on-pull-request',
      'pipelinesascode.tekton.dev/pull-request': '2',
      'pipelines.appstudio.openshift.io/type': 'build',
      'pipelinesascode.tekton.dev/url-repository': 'human-resources',
      'pipelinesascode.tekton.dev/repository': 'human-resources-clkq',
      'pipelinesascode.tekton.dev/sha': '36e49113fc391cc1a4723afb0269a88c9e54608d',
      'pipelinesascode.tekton.dev/git-provider': 'github',
      'pipelinesascode.tekton.dev/event-type': 'pull_request',
    },
  },
  spec: {
    params: [
      {
        name: 'dockerfile',
        value:
          'https://raw.githubusercontent.com/devfile-samples/devfile-sample-java-springboot-basic/main/docker/Dockerfile',
      },
      {
        name: 'git-url',
        value: 'https://github.com/test-repo/human-resources',
      },
      {
        name: 'output-image',
        value:
          'quay.io/redhat-appstudio/user-workload:on-pr-36e49113fc391cc1a4723afb0269a88c9e54608d',
      },
      {
        name: 'path-context',
        value: '.',
      },
      {
        name: 'revision',
        value: '36e49113fc391cc1a4723afb0269a88c9e54608d',
      },
    ],
    pipelineSpec: {
      finally: [
        {
          name: 'show-summary',
          params: [
            {
              name: 'pipelinerun-name',
              value: '$(context.pipelineRun.name)',
            },
            {
              name: 'git-url',
              value:
                '$(tasks.clone-repository.results.url)?rev=$(tasks.clone-repository.results.commit)',
            },
            {
              name: 'image-url',
              value: '$(params.output-image)',
            },
          ],
          taskRef: {
            bundle:
              'quay.io/redhat-appstudio-tekton-catalog/task-summary:0.1@sha256:03361504506b038934d2a2ed397970f183f9a23506b810bccc964f4c486bfe79',
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
        {
          default: 'false',
          description: 'Skip checks against built image',
          name: 'skip-checks',
          type: 'string',
        },
        {
          default: 'false',
          description: 'Execute the build with network isolation',
          name: 'hermetic',
          type: 'string',
        },
        {
          default: '',
          description: 'Build dependencies to be prefetched by Cachi2',
          name: 'prefetch-input',
          type: 'string',
        },
        {
          default: 'false',
          description: 'Java build',
          name: 'java',
          type: 'string',
        },
        {
          default: '',
          description: 'Snyk Token Secret Name',
          name: 'snyk-secret',
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
        {
          description: '',
          name: 'JAVA_COMMUNITY_DEPENDENCIES',
          value: '$(tasks.build-container.results.JAVA_COMMUNITY_DEPENDENCIES)',
        },
      ],
      tasks: [
        {
          name: 'init',
          params: [
            {
              name: 'image-url',
              value: '$(params.output-image)',
            },
            {
              name: 'rebuild',
              value: '$(params.rebuild)',
            },
            {
              name: 'skip-checks',
              value: '$(params.skip-checks)',
            },
            {
              name: 'pipelinerun-name',
              value: '$(context.pipelineRun.name)',
            },
            {
              name: 'pipelinerun-uid',
              value: '$(context.pipelineRun.uid)',
            },
          ],
          taskRef: {
            bundle:
              'quay.io/redhat-appstudio-tekton-catalog/task-init:0.1@sha256:5ce77110e2a49407a69a7922042dc0859f7e8f5f75dc0cd0bcc2d17860469bdb',
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
          runAfter: ['init'],
          taskRef: {
            bundle:
              'quay.io/redhat-appstudio-tekton-catalog/task-git-clone:0.1@sha256:f4e37778cba00296606ddfbc1c58181330899cafcaa1ee41c75a7cf8bed312f0',
            kind: 'Task',
            name: 'git-clone',
          },
          when: [
            {
              input: '$(tasks.init.results.build)',
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
          name: 'prefetch-dependencies',
          params: [
            {
              name: 'input',
              value: '$(params.prefetch-input)',
            },
          ],
          runAfter: ['clone-repository'],
          taskRef: {
            bundle:
              'quay.io/redhat-appstudio-tekton-catalog/task-prefetch-dependencies:0.1@sha256:cba79cf2e22ca29ffd207d99215722b07771d80d437fe7a1bce73b43181579bb',
            kind: 'Task',
            name: 'prefetch-dependencies',
          },
          when: [
            {
              input: '$(params.hermetic)',
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
              name: 'DOCKER_AUTH',
              value: '$(tasks.init.results.container-registry-secret)',
            },
            {
              name: 'HERMETIC',
              value: '$(params.hermetic)',
            },
            {
              name: 'PREFETCH_INPUT',
              value: '$(params.prefetch-input)',
            },
          ],
          runAfter: ['prefetch-dependencies'],
          taskRef: {
            bundle:
              'quay.io/redhat-appstudio-tekton-catalog/task-buildah:0.1@sha256:c3712257615d206ef40013bf1c5c681670fc8f7fd6aac9fa4c86f7afeff627ef',
            kind: 'Task',
            name: 'buildah',
          },
          when: [
            {
              input: '$(tasks.init.results.build)',
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
        {
          name: 'sanity-inspect-image',
          params: [
            {
              name: 'IMAGE_URL',
              value: '$(tasks.build-container.results.IMAGE_URL)',
            },
            {
              name: 'IMAGE_DIGEST',
              value: '$(tasks.build-container.results.IMAGE_DIGEST)',
            },
            {
              name: 'DOCKER_AUTH',
              value: '$(tasks.init.results.container-registry-secret)',
            },
          ],
          runAfter: ['build-container'],
          taskRef: {
            bundle:
              'quay.io/redhat-appstudio-tekton-catalog/task-sanity-inspect-image:0.1@sha256:fd4efd9d12eea3a8d47532c4226e685618845d0ba95abb98e008020243d96301',
            kind: 'Task',
            name: 'sanity-inspect-image',
          },
          when: [
            {
              input: '$(params.skip-checks)',
              operator: 'in',
              values: ['false'],
            },
          ],
          workspaces: [
            {
              name: 'source',
              workspace: 'workspace',
            },
          ],
        },
        {
          name: 'sanity-label-check',
          runAfter: ['sanity-inspect-image'],
          taskRef: {
            bundle:
              'quay.io/redhat-appstudio-tekton-catalog/task-sanity-label-check:0.1@sha256:534770bf7a7c10277ab5f9c1e7b766abbffb343cc864dd9545aecc5278257dc3',
            kind: 'Task',
            name: 'sanity-label-check',
          },
          when: [
            {
              input: '$(params.skip-checks)',
              operator: 'in',
              values: ['false'],
            },
          ],
          workspaces: [
            {
              name: 'workspace',
              workspace: 'workspace',
            },
          ],
        },
        {
          name: 'sanity-optional-label-check',
          params: [
            {
              name: 'POLICY_NAMESPACE',
              value: 'optional_checks',
            },
          ],
          runAfter: ['sanity-inspect-image'],
          taskRef: {
            bundle:
              'quay.io/redhat-appstudio-tekton-catalog/task-sanity-label-check:0.1@sha256:534770bf7a7c10277ab5f9c1e7b766abbffb343cc864dd9545aecc5278257dc3',
            kind: 'Task',
            name: 'sanity-label-check',
          },
          when: [
            {
              input: '$(params.skip-checks)',
              operator: 'in',
              values: ['false'],
            },
          ],
          workspaces: [
            {
              name: 'workspace',
              workspace: 'workspace',
            },
          ],
        },
        {
          name: 'deprecated-base-image-check',
          params: [
            {
              name: 'BASE_IMAGES_DIGESTS',
              value: '$(tasks.build-container.results.BASE_IMAGES_DIGESTS)',
            },
          ],
          taskRef: {
            bundle:
              'quay.io/redhat-appstudio-tekton-catalog/task-deprecated-image-check:0.1@sha256:28d724dd6f6c365b2a839d9e52baac91559fd78c160774769c1ec724301f78d4',
            kind: 'Task',
            name: 'deprecated-image-check',
          },
          when: [
            {
              input: '$(params.skip-checks)',
              operator: 'in',
              values: ['false'],
            },
          ],
          workspaces: [
            {
              name: 'sanity-ws',
              workspace: 'workspace',
            },
          ],
        },
        {
          name: 'clair-scan',
          params: [
            {
              name: 'image-digest',
              value: '$(tasks.build-container.results.IMAGE_DIGEST)',
            },
            {
              name: 'image-url',
              value: '$(tasks.build-container.results.IMAGE_URL)',
            },
            {
              name: 'docker-auth',
              value: '$(tasks.init.results.container-registry-secret)',
            },
          ],
          runAfter: ['build-container'],
          taskRef: {
            bundle:
              'quay.io/redhat-appstudio-tekton-catalog/task-clair-scan:0.1@sha256:fba8170329ab00b864ee7d16e0358df4c4386880e10894fd7bbbb1457112477b',
            kind: 'Task',
            name: 'clair-scan',
          },
          when: [
            {
              input: '$(params.skip-checks)',
              operator: 'in',
              values: ['false'],
            },
          ],
        },
        {
          name: 'sast-snyk-check',
          params: [
            {
              name: 'SNYK_SECRET',
              value: '$(params.snyk-secret)',
            },
          ],
          runAfter: ['clone-repository'],
          taskRef: {
            bundle:
              'quay.io/redhat-appstudio-tekton-catalog/task-sast-snyk-check:0.1@sha256:566ce8367b92261d637ecac245a66e3d7177d8d375948ba0fc74dbc7a55d674d',
            kind: 'Task',
            name: 'sast-snyk-check',
          },
          when: [
            {
              input: '$(params.skip-checks)',
              operator: 'in',
              values: ['false'],
            },
            {
              input: '$(params.snyk-secret)',
              operator: 'notin',
              values: [''],
            },
          ],
          workspaces: [
            {
              name: 'workspace',
              workspace: 'workspace',
            },
          ],
        },
        {
          name: 'clamav-scan',
          params: [
            {
              name: 'image-digest',
              value: '$(tasks.build-container.results.IMAGE_DIGEST)',
            },
            {
              name: 'image-url',
              value: '$(tasks.build-container.results.IMAGE_URL)',
            },
            {
              name: 'docker-auth',
              value: '$(tasks.init.results.container-registry-secret)',
            },
          ],
          runAfter: ['build-container'],
          taskRef: {
            bundle:
              'quay.io/redhat-appstudio-tekton-catalog/task-clamav-scan:0.1@sha256:28b425322aa84f988c6c4f8d503787b3fb301668b2ad6728846b8f8c45ba012b',
            kind: 'Task',
            name: 'clamav-scan',
          },
          when: [
            {
              input: '$(params.skip-checks)',
              operator: 'in',
              values: ['false'],
            },
          ],
        },
        {
          name: 'sbom-json-check',
          params: [
            {
              name: 'IMAGE_URL',
              value: '$(tasks.build-container.results.IMAGE_URL)',
            },
            {
              name: 'IMAGE_DIGEST',
              value: '$(tasks.build-container.results.IMAGE_DIGEST)',
            },
          ],
          runAfter: ['build-container'],
          taskRef: {
            bundle:
              'quay.io/redhat-appstudio-tekton-catalog/task-sbom-json-check:0.1@sha256:ce6a0932da9b41080108284d1366fc2de8374fca5137500138e16ad9e04610c6',
            kind: 'Task',
            name: 'sbom-json-check',
          },
          when: [
            {
              input: '$(params.skip-checks)',
              operator: 'in',
              values: ['false'],
            },
          ],
        },
      ],
      workspaces: [
        {
          name: 'workspace',
        },
        {
          name: 'git-auth',
          optional: true,
        },
      ],
    },
    serviceAccountName: 'appstudio-pipeline',
    timeout: '1h0m0s',
    workspaces: [
      {
        name: 'workspace',
        volumeClaimTemplate: {
          metadata: {
            creationTimestamp: null,
          },
          spec: {
            accessModes: ['ReadWriteOnce'],
            resources: {
              requests: {
                storage: '1Gi',
              },
            },
          },
          status: {},
        },
      },
      {
        name: 'git-auth',
        secret: {
          secretName: 'pac-gitauth-zzez',
        },
      },
    ],
  },
  status: {
    childReferences: [
      {
        apiVersion: 'tekton.dev/v1',
        kind: 'TaskRun',
        name: 'human-resources-clkq-on-pull-request-xn5nd-init',
        pipelineTaskName: 'init',
      },
      {
        apiVersion: 'tekton.dev/v1',
        kind: 'TaskRun',
        name: 'human-resources-clkq-on-pull-request-xn5nd-clone-repository',
        pipelineTaskName: 'clone-repository',
        whenExpressions: [
          {
            input: '$(tasks.init.results.build)',
            operator: 'in',
            values: ['true'],
          },
        ],
      },
      {
        apiVersion: 'tekton.dev/v1',
        kind: 'TaskRun',
        name: 'human-resources-clkq-on-pull-request-xn5nd-build-container',
        pipelineTaskName: 'build-container',
        whenExpressions: [
          {
            input: '$(tasks.init.results.build)',
            operator: 'in',
            values: ['true'],
          },
        ],
      },
      {
        apiVersion: 'tekton.dev/v1',
        kind: 'TaskRun',
        name: 'human-resources-clkq-on-pull-request-xn5nd-sanity-inspect-image',
        pipelineTaskName: 'sanity-inspect-image',
        whenExpressions: [
          {
            input: 'false',
            operator: 'in',
            values: ['false'],
          },
        ],
      },
      {
        apiVersion: 'tekton.dev/v1',
        kind: 'TaskRun',
        name: 'human-resources-clkq-on-pull-request-xn5nd-sanity-label-check',
        pipelineTaskName: 'sanity-label-check',
        whenExpressions: [
          {
            input: 'false',
            operator: 'in',
            values: ['false'],
          },
        ],
      },
      {
        apiVersion: 'tekton.dev/v1',
        kind: 'TaskRun',
        name: 'hum1e2c0e3126f75d552fc611f4aeae38ab-sanity-optional-label-check',
        pipelineTaskName: 'sanity-optional-label-check',
        whenExpressions: [
          {
            input: 'false',
            operator: 'in',
            values: ['false'],
          },
        ],
      },
      {
        apiVersion: 'tekton.dev/v1',
        kind: 'TaskRun',
        name: 'hum1e2c0e3126f75d552fc611f4aeae38ab-deprecated-base-image-check',
        pipelineTaskName: 'deprecated-base-image-check',
        whenExpressions: [
          {
            input: 'false',
            operator: 'in',
            values: ['false'],
          },
        ],
      },
      {
        apiVersion: 'tekton.dev/v1',
        kind: 'TaskRun',
        name: 'human-resources-clkq-on-pull-request-xn5nd-clair-scan',
        pipelineTaskName: 'clair-scan',
        whenExpressions: [
          {
            input: 'false',
            operator: 'in',
            values: ['false'],
          },
        ],
      },
      {
        apiVersion: 'tekton.dev/v1',
        kind: 'TaskRun',
        name: 'human-resources-clkq-on-pull-request-xn5nd-clamav-scan',
        pipelineTaskName: 'clamav-scan',
        whenExpressions: [
          {
            input: 'false',
            operator: 'in',
            values: ['false'],
          },
        ],
      },
      {
        apiVersion: 'tekton.dev/v1',
        kind: 'TaskRun',
        name: 'human-resources-clkq-on-pull-request-xn5nd-sbom-json-check',
        pipelineTaskName: 'sbom-json-check',
        whenExpressions: [
          {
            input: 'false',
            operator: 'in',
            values: ['false'],
          },
        ],
      },
      {
        apiVersion: 'tekton.dev/v1',
        kind: 'TaskRun',
        name: 'human-resources-clkq-on-pull-request-xn5nd-show-summary',
        pipelineTaskName: 'show-summary',
      },
    ],
    completionTime: '2023-03-16T01:03:48Z',
    conditions: [
      {
        lastTransitionTime: '2023-03-16T01:03:48Z',
        message: 'Tasks Completed: 11 (Failed: 0, Cancelled 0), Skipped: 2',
        reason: 'Completed',
        status: 'True',
        type: 'Succeeded',
      },
    ],
    pipelineResults: [
      {
        name: 'IMAGE_URL',
        value:
          'quay.io/redhat-appstudio/user-workload:on-pr-36e49113fc391cc1a4723afb0269a88c9e54608d',
      },
      {
        name: 'IMAGE_DIGEST',
        value: 'sha256:02d4920c04cad24ef1a8058bc31f08a76182e80cc8288712ea764ce45e3406b1',
      },
      {
        name: 'CHAINS-GIT_URL',
        value: 'https://github.com/test-repo/human-resources',
      },
      {
        name: 'CHAINS-GIT_COMMIT',
        value: '36e49113fc391cc1a4723afb0269a88c9e54608d',
      },
      {
        name: 'JAVA_COMMUNITY_DEPENDENCIES',
        value: '',
      },
    ],
    pipelineSpec: {
      finally: [
        {
          name: 'show-summary',
          params: [
            {
              name: 'pipelinerun-name',
              value: 'human-resources-clkq-on-pull-request-xn5nd',
            },
            {
              name: 'git-url',
              value:
                '$(tasks.clone-repository.results.url)?rev=$(tasks.clone-repository.results.commit)',
            },
            {
              name: 'image-url',
              value:
                'quay.io/redhat-appstudio/user-workload:on-pr-36e49113fc391cc1a4723afb0269a88c9e54608d',
            },
          ],
          taskRef: {
            bundle:
              'quay.io/redhat-appstudio-tekton-catalog/task-summary:0.1@sha256:03361504506b038934d2a2ed397970f183f9a23506b810bccc964f4c486bfe79',
            kind: 'Task',
            name: 'summary',
          },
          status: {
            completionTime: '2023-03-16T01:03:47Z',
            conditions: [
              {
                lastTransitionTime: '2023-03-16T01:03:47Z',
                message: 'All Steps have completed executing',
                reason: 'Succeeded',
                status: 'True',
                type: 'Succeeded',
              },
            ],
            podName: 'human-resources-clkq-on-pull-request-xn5nd-show-summary-pod',
            startTime: '2023-03-16T01:03:38Z',
            steps: [
              {
                container: 'step-appstudio-summary',
                imageID:
                  'quay.io/openshift-release-dev/ocp-v4.0-art-dev@sha256:9f0cdc00b1b1a3c17411e50653253b9f6bb5329ea4fb82ad983790a6dbf2d9ad',
                name: 'appstudio-summary',
                terminated: {
                  containerID:
                    'cri-o://1af1c7a9144a9c5e819050feab3414022599eed180b25604bed0cd046e269591',
                  exitCode: 0,
                  finishedAt: '2023-03-16T01:03:46Z',
                  reason: 'Completed',
                  startedAt: '2023-03-16T01:03:46Z',
                },
              },
            ],
            taskSpec: {
              description: 'Summary Pipeline Task.',
              params: [
                {
                  description: 'pipeline-run to annotate',
                  name: 'pipelinerun-name',
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
                  env: [
                    {
                      name: 'GIT_URL',
                      value:
                        'https://github.com/test-repo/human-resources?rev=36e49113fc391cc1a4723afb0269a88c9e54608d',
                    },
                    {
                      name: 'IMAGE_URL',
                      value:
                        'quay.io/redhat-appstudio/user-workload:on-pr-36e49113fc391cc1a4723afb0269a88c9e54608d',
                    },
                    {
                      name: 'PIPELINERUN_NAME',
                      value: 'human-resources-clkq-on-pull-request-xn5nd',
                    },
                  ],
                  image:
                    'registry.redhat.io/openshift4/ose-cli:v4.12@sha256:9f0cdc00b1b1a3c17411e50653253b9f6bb5329ea4fb82ad983790a6dbf2d9ad',
                  name: 'appstudio-summary',
                  resources: {},
                  script:
                    '#!/usr/bin/env bash\necho\necho "Build Summary:"\necho\necho "Build repository: $GIT_URL"\necho "Generated Image is in : $IMAGE_URL"\necho\noc annotate --overwrite pipelinerun $PIPELINERUN_NAME build.appstudio.openshift.io/repo=$GIT_URL\noc annotate --overwrite pipelinerun $PIPELINERUN_NAME build.appstudio.openshift.io/image=$IMAGE_URL\necho End Summary\n\noc delete --ignore-not-found=true secret $PIPELINERUN_NAME\n',
                },
              ],
            },
            reason: 'Succeeded',
            duration: '9s',
          },
          steps: [
            {
              duration: 'less than a second',
              name: 'appstudio-summary',
              status: 'Succeeded',
            },
          ],
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
        {
          default: 'false',
          description: 'Skip checks against built image',
          name: 'skip-checks',
          type: 'string',
        },
        {
          default: 'false',
          description: 'Execute the build with network isolation',
          name: 'hermetic',
          type: 'string',
        },
        {
          default: '',
          description: 'Build dependencies to be prefetched by Cachi2',
          name: 'prefetch-input',
          type: 'string',
        },
        {
          default: 'false',
          description: 'Java build',
          name: 'java',
          type: 'string',
        },
        {
          default: '',
          description: 'Snyk Token Secret Name',
          name: 'snyk-secret',
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
        {
          description: '',
          name: 'JAVA_COMMUNITY_DEPENDENCIES',
          value: '$(tasks.build-container.results.JAVA_COMMUNITY_DEPENDENCIES)',
        },
      ],
      tasks: [
        {
          name: 'init',
          params: [
            {
              name: 'image-url',
              value:
                'quay.io/redhat-appstudio/user-workload:on-pr-36e49113fc391cc1a4723afb0269a88c9e54608d',
            },
            {
              name: 'rebuild',
              value: 'false',
            },
            {
              name: 'skip-checks',
              value: 'false',
            },
            {
              name: 'pipelinerun-name',
              value: 'human-resources-clkq-on-pull-request-xn5nd',
            },
            {
              name: 'pipelinerun-uid',
              value: '014c3e9f-90e9-4cd4-83eb-f0fdd8fe6714',
            },
          ],
          taskRef: {
            bundle:
              'quay.io/redhat-appstudio-tekton-catalog/task-init:0.1@sha256:5ce77110e2a49407a69a7922042dc0859f7e8f5f75dc0cd0bcc2d17860469bdb',
            kind: 'Task',
            name: 'init',
          },
          status: {
            completionTime: '2023-03-16T00:50:57Z',
            conditions: [
              {
                lastTransitionTime: '2023-03-16T00:50:57Z',
                message: 'All Steps have completed executing',
                reason: 'Succeeded',
                status: 'True',
                type: 'Succeeded',
              },
            ],
            podName: 'human-resources-clkq-on-pull-request-xn5nd-init-pod',
            startTime: '2023-03-16T00:50:33Z',
            steps: [
              {
                container: 'step-init',
                imageID:
                  'registry.redhat.io/openshift4/ose-tools-rhel8@sha256:253d042ecfad7b64593112a4aa3f528d39cb5fe738852e44f009db87964cf051',
                name: 'init',
                terminated: {
                  containerID:
                    'cri-o://8dad7d0c8810dd2adf93e4e69215c88a366c03e23fdc5ff0ac2bcb556379c510',
                  exitCode: 0,
                  finishedAt: '2023-03-16T00:50:56Z',
                  message:
                    '[{"key":"build","value":"true","type":1},{"key":"container-registry-secret","value":"human-resources-clkq-on-pull-request-xn5nd","type":1}]',
                  reason: 'Completed',
                  startedAt: '2023-03-16T00:50:55Z',
                },
              },
            ],
            results: [
              {
                name: 'build',
                type: 'string',
                value: 'true',
              },
              {
                name: 'container-registry-secret',
                type: 'string',
                value: 'human-resources-clkq-on-pull-request-xn5nd',
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
                  description: 'skip checks against built image',
                  name: 'skip-checks',
                  type: 'string',
                },
                {
                  name: 'pipelinerun-name',
                  type: 'string',
                },
                {
                  name: 'pipelinerun-uid',
                  type: 'string',
                },
                {
                  default: 'redhat-appstudio-user-workload',
                  name: 'shared-secret',
                  type: 'string',
                },
              ],
              results: [
                {
                  name: 'build',
                  type: 'string',
                },
                {
                  description: 'Name of secret with credentials',
                  name: 'container-registry-secret',
                  type: 'string',
                },
              ],
              steps: [
                {
                  env: [
                    {
                      name: 'PIPELINERUN_NAME',
                      value: 'human-resources-clkq-on-pull-request-xn5nd',
                    },
                    {
                      name: 'PIPELINERUN_UID',
                      value: '014c3e9f-90e9-4cd4-83eb-f0fdd8fe6714',
                    },
                    {
                      name: 'IMAGE_URL',
                      value:
                        'quay.io/redhat-appstudio/user-workload:on-pr-36e49113fc391cc1a4723afb0269a88c9e54608d',
                    },
                    {
                      name: 'REBUILD',
                      value: 'false',
                    },
                    {
                      name: 'SKIP_CHECKS',
                      value: 'false',
                    },
                  ],
                  image:
                    'registry.redhat.io/openshift4/ose-tools-rhel8:v4.12@sha256:253d042ecfad7b64593112a4aa3f528d39cb5fe738852e44f009db87964cf051',
                  name: 'init',
                  resources: {},
                  script:
                    '#!/bin/bash\necho "Build Initialize: $IMAGE_URL"\necho\necho "Create pipelinerun repository secret"\nSHARED=/secret/default-push-secret/.dockerconfigjson\nexport DOCKER_CONFIG=/tmp/docker/\nmkdir -p $DOCKER_CONFIG\nif [ -f $SHARED ]; then\n  jq -M -s \'.[0] * .[1]\' $SHARED /root/.docker/config.json > $DOCKER_CONFIG/config.json\nelse\n  cp /root/.docker/config.json $DOCKER_CONFIG/config.json\nfi\noc create secret generic --from-file=$DOCKER_CONFIG/config.json $SHARED_PARAM $PIPELINERUN_NAME\noc patch secret $PIPELINERUN_NAME -p "{\\"metadata\\": {\\"ownerReferences\\": [{\\"apiVersion\\": \\"tekton.dev/v1beta1\\", \\"blockOwnerDeletion\\": false, \\"controller\\": true, \\"kind\\": \\"PipelineRun\\", \\"name\\": \\"$PIPELINERUN_NAME\\", \\"uid\\": \\"$PIPELINERUN_UID\\" }]}}"\necho -n $PIPELINERUN_NAME > /tekton/results/container-registry-secret\n\necho "Determine if Image Already Exists"\n# Build the image when image does not exists or rebuild is set to true\nif ! oc image info $IMAGE_URL &>/dev/null || [ "$REBUILD" == "true" ] || [ "$SKIP_CHECKS" == "false" ]; then\n  echo -n "true" > /tekton/results/build\nelse\n  echo -n "false" > /tekton/results/build\nfi\n',
                  volumeMounts: [
                    {
                      mountPath: '/secret/default-push-secret',
                      name: 'default-push-secret',
                    },
                  ],
                },
              ],
              volumes: [
                {
                  csi: {
                    driver: 'csi.sharedresource.openshift.io',
                    readOnly: true,
                    volumeAttributes: {
                      sharedSecret: 'redhat-appstudio-user-workload',
                    },
                  },
                  name: 'default-push-secret',
                },
              ],
            },
            reason: 'Succeeded',
            duration: '24s',
          },
          steps: [
            {
              duration: '1 second',
              name: 'init',
              status: 'Succeeded',
            },
          ],
        },
        {
          name: 'clone-repository',
          params: [
            {
              name: 'url',
              value: 'https://github.com/test-repo/human-resources',
            },
            {
              name: 'revision',
              value: '36e49113fc391cc1a4723afb0269a88c9e54608d',
            },
          ],
          runAfter: ['init'],
          taskRef: {
            bundle:
              'quay.io/redhat-appstudio-tekton-catalog/task-git-clone:0.1@sha256:f4e37778cba00296606ddfbc1c58181330899cafcaa1ee41c75a7cf8bed312f0',
            kind: 'Task',
            name: 'git-clone',
          },
          when: [
            {
              input: '$(tasks.init.results.build)',
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
          status: {
            completionTime: '2023-03-16T00:52:09Z',
            conditions: [
              {
                lastTransitionTime: '2023-03-16T00:52:09Z',
                message: 'All Steps have completed executing',
                reason: 'Succeeded',
                status: 'True',
                type: 'Succeeded',
              },
            ],
            podName: 'human-resources-clkq-on-pull-request-xn5nd-clone-repository-pod',
            startTime: '2023-03-16T00:51:38Z',
            steps: [
              {
                container: 'step-clone',
                imageID:
                  'registry.redhat.io/openshift-pipelines/pipelines-git-init-rhel8@sha256:2fa0b06d52b04f377c696412e19307a9eff27383f81d87aae0b4f71672a1cd0b',
                name: 'clone',
                terminated: {
                  containerID:
                    'cri-o://a0ef629c17b8b42bff2c8f80c74738cdc4ea324ebe682e7e861caadd43e0ddea',
                  exitCode: 0,
                  finishedAt: '2023-03-16T00:52:07Z',
                  message:
                    '[{"key":"commit","value":"36e49113fc391cc1a4723afb0269a88c9e54608d","type":1},{"key":"url","value":"https://github.com/test-repo/human-resources","type":1}]',
                  reason: 'Completed',
                  startedAt: '2023-03-16T00:52:07Z',
                },
              },
            ],
            results: [
              {
                name: 'commit',
                type: 'string',
                value: '36e49113fc391cc1a4723afb0269a88c9e54608d',
              },
              {
                name: 'url',
                type: 'string',
                value: 'https://github.com/test-repo/human-resources',
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
                    'registry.redhat.io/openshift-pipelines/pipelines-git-init-rhel8:v1.8.2-8@sha256:a538c423e7a11aae6ae582a411fdb090936458075f99af4ce5add038bb6983e8',
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
                  type: 'string',
                },
                {
                  description: 'The precise URL that was fetched by this Task.',
                  name: 'url',
                  type: 'string',
                },
              ],
              steps: [
                {
                  env: [
                    {
                      name: 'HOME',
                      value: '/tekton/home',
                    },
                    {
                      name: 'PARAM_URL',
                      value: 'https://github.com/test-repo/human-resources',
                    },
                    {
                      name: 'PARAM_REVISION',
                      value: '36e49113fc391cc1a4723afb0269a88c9e54608d',
                    },
                    {
                      name: 'PARAM_REFSPEC',
                    },
                    {
                      name: 'PARAM_SUBMODULES',
                      value: 'true',
                    },
                    {
                      name: 'PARAM_DEPTH',
                      value: '1',
                    },
                    {
                      name: 'PARAM_SSL_VERIFY',
                      value: 'true',
                    },
                    {
                      name: 'PARAM_SUBDIRECTORY',
                    },
                    {
                      name: 'PARAM_DELETE_EXISTING',
                      value: 'true',
                    },
                    {
                      name: 'PARAM_HTTP_PROXY',
                    },
                    {
                      name: 'PARAM_HTTPS_PROXY',
                    },
                    {
                      name: 'PARAM_NO_PROXY',
                    },
                    {
                      name: 'PARAM_VERBOSE',
                      value: 'true',
                    },
                    {
                      name: 'PARAM_SPARSE_CHECKOUT_DIRECTORIES',
                    },
                    {
                      name: 'PARAM_USER_HOME',
                      value: '/tekton/home',
                    },
                    {
                      name: 'WORKSPACE_OUTPUT_PATH',
                      value: '/workspace/output',
                    },
                    {
                      name: 'WORKSPACE_SSH_DIRECTORY_BOUND',
                      value: 'false',
                    },
                    {
                      name: 'WORKSPACE_SSH_DIRECTORY_PATH',
                    },
                    {
                      name: 'WORKSPACE_BASIC_AUTH_DIRECTORY_BOUND',
                      value: 'true',
                    },
                    {
                      name: 'WORKSPACE_BASIC_AUTH_DIRECTORY_PATH',
                      value: '/workspace/basic-auth',
                    },
                  ],
                  image:
                    'registry.redhat.io/openshift-pipelines/pipelines-git-init-rhel8:v1.8.2-8@sha256:a538c423e7a11aae6ae582a411fdb090936458075f99af4ce5add038bb6983e8',
                  name: 'clone',
                  resources: {},
                  script:
                    '#!/usr/bin/env sh\nset -eu\n\nif [ "${PARAM_VERBOSE}" = "true" ] ; then\n  set -x\nfi\n\nif [ "${WORKSPACE_BASIC_AUTH_DIRECTORY_BOUND}" = "true" ] ; then\n  cp "${WORKSPACE_BASIC_AUTH_DIRECTORY_PATH}/.git-credentials" "${PARAM_USER_HOME}/.git-credentials"\n  cp "${WORKSPACE_BASIC_AUTH_DIRECTORY_PATH}/.gitconfig" "${PARAM_USER_HOME}/.gitconfig"\n  chmod 400 "${PARAM_USER_HOME}/.git-credentials"\n  chmod 400 "${PARAM_USER_HOME}/.gitconfig"\nfi\n\nif [ "${WORKSPACE_SSH_DIRECTORY_BOUND}" = "true" ] ; then\n  cp -R "${WORKSPACE_SSH_DIRECTORY_PATH}" "${PARAM_USER_HOME}"/.ssh\n  chmod 700 "${PARAM_USER_HOME}"/.ssh\n  chmod -R 400 "${PARAM_USER_HOME}"/.ssh/*\nfi\n\nCHECKOUT_DIR="${WORKSPACE_OUTPUT_PATH}/${PARAM_SUBDIRECTORY}"\n\ncleandir() {\n  # Delete any existing contents of the repo directory if it exists.\n  #\n  # We don\'t just "rm -rf ${CHECKOUT_DIR}" because ${CHECKOUT_DIR} might be "/"\n  # or the root of a mounted volume.\n  if [ -d "${CHECKOUT_DIR}" ] ; then\n    # Delete non-hidden files and directories\n    rm -rf "${CHECKOUT_DIR:?}"/*\n    # Delete files and directories starting with . but excluding ..\n    rm -rf "${CHECKOUT_DIR}"/.[!.]*\n    # Delete files and directories starting with .. plus any other character\n    rm -rf "${CHECKOUT_DIR}"/..?*\n  fi\n}\n\nif [ "${PARAM_DELETE_EXISTING}" = "true" ] ; then\n  cleandir\nfi\n\ntest -z "${PARAM_HTTP_PROXY}" || export HTTP_PROXY="${PARAM_HTTP_PROXY}"\ntest -z "${PARAM_HTTPS_PROXY}" || export HTTPS_PROXY="${PARAM_HTTPS_PROXY}"\ntest -z "${PARAM_NO_PROXY}" || export NO_PROXY="${PARAM_NO_PROXY}"\n\n/ko-app/git-init \\\n  -url="${PARAM_URL}" \\\n  -revision="${PARAM_REVISION}" \\\n  -refspec="${PARAM_REFSPEC}" \\\n  -path="${CHECKOUT_DIR}" \\\n  -sslVerify="${PARAM_SSL_VERIFY}" \\\n  -submodules="${PARAM_SUBMODULES}" \\\n  -depth="${PARAM_DEPTH}" \\\n  -sparseCheckoutDirectories="${PARAM_SPARSE_CHECKOUT_DIRECTORIES}"\ncd "${CHECKOUT_DIR}"\nRESULT_SHA="$(git rev-parse HEAD)"\nEXIT_CODE="$?"\nif [ "${EXIT_CODE}" != 0 ] ; then\n  exit "${EXIT_CODE}"\nfi\nprintf "%s" "${RESULT_SHA}" > "/tekton/results/commit"\nprintf "%s" "${PARAM_URL}" > "/tekton/results/url"\n',
                  securityContext: {
                    runAsUser: 0,
                  },
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
            reason: 'Succeeded',
            duration: '31s',
          },
          steps: [
            {
              duration: 'less than a second',
              name: 'clone',
              status: 'Succeeded',
            },
          ],
        },
        {
          name: 'prefetch-dependencies',
          params: [
            {
              name: 'input',
              value: '',
            },
          ],
          runAfter: ['clone-repository'],
          taskRef: {
            bundle:
              'quay.io/redhat-appstudio-tekton-catalog/task-prefetch-dependencies:0.1@sha256:cba79cf2e22ca29ffd207d99215722b07771d80d437fe7a1bce73b43181579bb',
            kind: 'Task',
            name: 'prefetch-dependencies',
          },
          when: [
            {
              input: 'false',
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
          status: {
            reason: 'Skipped',
          },
          steps: [],
        },
        {
          name: 'build-container',
          params: [
            {
              name: 'IMAGE',
              value:
                'quay.io/redhat-appstudio/user-workload:on-pr-36e49113fc391cc1a4723afb0269a88c9e54608d',
            },
            {
              name: 'DOCKERFILE',
              value:
                'https://raw.githubusercontent.com/devfile-samples/devfile-sample-java-springboot-basic/main/docker/Dockerfile',
            },
            {
              name: 'CONTEXT',
              value: '.',
            },
            {
              name: 'DOCKER_AUTH',
              value: '$(tasks.init.results.container-registry-secret)',
            },
            {
              name: 'HERMETIC',
              value: 'false',
            },
            {
              name: 'PREFETCH_INPUT',
              value: '',
            },
          ],
          runAfter: ['prefetch-dependencies'],
          taskRef: {
            bundle:
              'quay.io/redhat-appstudio-tekton-catalog/task-buildah:0.1@sha256:c3712257615d206ef40013bf1c5c681670fc8f7fd6aac9fa4c86f7afeff627ef',
            kind: 'Task',
            name: 'buildah',
          },
          when: [
            {
              input: '$(tasks.init.results.build)',
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
          status: {
            completionTime: '2023-03-16T00:59:53Z',
            conditions: [
              {
                lastTransitionTime: '2023-03-16T00:59:53Z',
                message: 'All Steps have completed executing',
                reason: 'Succeeded',
                status: 'True',
                type: 'Succeeded',
              },
            ],
            podName: 'human-resources-clkq-on-pull-request-xn5nd-build-container-pod',
            startTime: '2023-03-16T00:52:27Z',
            steps: [
              {
                container: 'step-build',
                imageID:
                  'quay.io/redhat-appstudio/buildah@sha256:381e9bfedd59701477621da93892106873a6951b196105d3d2d85c3f6d7b569b',
                name: 'build',
                terminated: {
                  containerID:
                    'cri-o://9ba9075922168b1e6fb272b0dde4a6736f00bc99f88eb37a2919f609a4314d53',
                  exitCode: 0,
                  finishedAt: '2023-03-16T00:57:47Z',
                  reason: 'Completed',
                  startedAt: '2023-03-16T00:53:34Z',
                },
              },
              {
                container: 'step-sbom-get',
                imageID:
                  'quay.io/redhat-appstudio/syft@sha256:09afc449976230f66848c19bb5ccf344eb0eeb4ed50747e33b53aff49462c319',
                name: 'sbom-get',
                terminated: {
                  containerID:
                    'cri-o://a7b8002976d3bd82419526856d1087ae276f2034d448ea9a99a93fdbb10eb0e7',
                  exitCode: 0,
                  finishedAt: '2023-03-16T00:59:09Z',
                  reason: 'Completed',
                  startedAt: '2023-03-16T00:57:47Z',
                },
              },
              {
                container: 'step-analyse-dependencies-java-sbom',
                imageID:
                  'quay.io/redhat-appstudio/hacbs-jvm-build-request-processor@sha256:b198cf4b33dab59ce8ac25afd4e1001390db29ca2dec83dc8a1e21b0359ce743',
                name: 'analyse-dependencies-java-sbom',
                terminated: {
                  containerID:
                    'cri-o://c2131223bedd14167ff6b3a4bc364727f7ab7d106f78e4964d81127c960526ed',
                  exitCode: 0,
                  finishedAt: '2023-03-16T00:59:09Z',
                  message: '[{"key":"JAVA_COMMUNITY_DEPENDENCIES","value":"","type":1}]',
                  reason: 'Completed',
                  startedAt: '2023-03-16T00:59:09Z',
                },
              },
              {
                container: 'step-merge-sboms',
                imageID:
                  'registry.access.redhat.com/ubi9/python-39@sha256:89463fe3e086620617a4f6281640469ba7a7abd2f1b5be13e6cf0f46a6565516',
                name: 'merge-sboms',
                terminated: {
                  containerID:
                    'cri-o://1a7a67c49f3d7790ed95fa8ba269668fa9271d73deada9ec65f07b7aab93bc5e',
                  exitCode: 0,
                  finishedAt: '2023-03-16T00:59:09Z',
                  message: '[{"key":"JAVA_COMMUNITY_DEPENDENCIES","value":"","type":1}]',
                  reason: 'Completed',
                  startedAt: '2023-03-16T00:59:09Z',
                },
              },
              {
                container: 'step-inject-sbom-and-push',
                imageID:
                  'registry.access.redhat.com/ubi9/buildah@sha256:c8b1d312815452964885680fc5bc8d99b3bfe9b6961228c71a09c72ca8e915eb',
                name: 'inject-sbom-and-push',
                terminated: {
                  containerID:
                    'cri-o://63387520d62a24c45c9315d7b065eff747d41d69961bd5ee7cca51b03a4298ec',
                  exitCode: 0,
                  finishedAt: '2023-03-16T00:59:50Z',
                  message:
                    '[{"key":"BASE_IMAGES_DIGESTS","value":"docker.io/library/openjdk:11-jdk@sha256:99bac5bf83633e3c7399aed725c8415e7b569b54e03e4599e580fc9cdb7c21ab\\nquay.io/devfile/maven:3.8.1-openjdk-17-slim@sha256:a65cb519660f51b06f487a6f5de8c264e1e2bcdb32033f3f45b0899f7740ca0f\\n","type":1},{"key":"IMAGE_DIGEST","value":"sha256:02d4920c04cad24ef1a8058bc31f08a76182e80cc8288712ea764ce45e3406b1","type":1},{"key":"IMAGE_URL","value":"quay.io/redhat-appstudio/user-workload:on-pr-36e49113fc391cc1a4723afb0269a88c9e54608d","type":1},{"key":"JAVA_COMMUNITY_DEPENDENCIES","value":"","type":1}]',
                  reason: 'Completed',
                  startedAt: '2023-03-16T00:59:10Z',
                },
              },
              {
                container: 'step-upload-sbom',
                imageID:
                  'quay.io/redhat-appstudio/cosign@sha256:18b3716a6225727877475e1ab4f2493915e72cffd2ce431e9901d2ed2e4b2c0b',
                name: 'upload-sbom',
                terminated: {
                  containerID:
                    'cri-o://4c260401d25c8ecc0269ba01ee9c901807deef2c3203554345302fadc09556bc',
                  exitCode: 0,
                  finishedAt: '2023-03-16T00:59:53Z',
                  message:
                    '[{"key":"BASE_IMAGES_DIGESTS","value":"docker.io/library/openjdk:11-jdk@sha256:99bac5bf83633e3c7399aed725c8415e7b569b54e03e4599e580fc9cdb7c21ab\\nquay.io/devfile/maven:3.8.1-openjdk-17-slim@sha256:a65cb519660f51b06f487a6f5de8c264e1e2bcdb32033f3f45b0899f7740ca0f\\n","type":1},{"key":"IMAGE_DIGEST","value":"sha256:02d4920c04cad24ef1a8058bc31f08a76182e80cc8288712ea764ce45e3406b1","type":1},{"key":"IMAGE_URL","value":"quay.io/redhat-appstudio/user-workload:on-pr-36e49113fc391cc1a4723afb0269a88c9e54608d","type":1},{"key":"JAVA_COMMUNITY_DEPENDENCIES","value":"","type":1}]',
                  reason: 'Completed',
                  startedAt: '2023-03-16T00:59:50Z',
                },
              },
            ],
            results: [
              {
                name: 'JAVA_COMMUNITY_DEPENDENCIES',
                type: 'string',
                value: '',
              },
              {
                name: 'BASE_IMAGES_DIGESTS',
                type: 'string',
                value:
                  'docker.io/library/openjdk:11-jdk@sha256:99bac5bf83633e3c7399aed725c8415e7b569b54e03e4599e580fc9cdb7c21ab\nquay.io/devfile/maven:3.8.1-openjdk-17-slim@sha256:a65cb519660f51b06f487a6f5de8c264e1e2bcdb32033f3f45b0899f7740ca0f\n',
              },
              {
                name: 'IMAGE_DIGEST',
                type: 'string',
                value: 'sha256:02d4920c04cad24ef1a8058bc31f08a76182e80cc8288712ea764ce45e3406b1',
              },
              {
                name: 'IMAGE_URL',
                type: 'string',
                value:
                  'quay.io/redhat-appstudio/user-workload:on-pr-36e49113fc391cc1a4723afb0269a88c9e54608d',
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
                    'registry.access.redhat.com/ubi9/buildah:9.0.0-19@sha256:c8b1d312815452964885680fc5bc8d99b3bfe9b6961228c71a09c72ca8e915eb',
                  description: 'The location of the buildah builder image.',
                  name: 'BUILDER_IMAGE',
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
                  description: 'secret with config.json for container auth',
                  name: 'DOCKER_AUTH',
                  type: 'string',
                },
                {
                  default: 'false',
                  description: 'Determines if build will be executed without network access.',
                  name: 'HERMETIC',
                  type: 'string',
                },
                {
                  default: '',
                  description:
                    'In case it is not empty, the prefetched content should be made available to the build.',
                  name: 'PREFETCH_INPUT',
                  type: 'string',
                },
              ],
              results: [
                {
                  description: 'Digest of the image just built',
                  name: 'IMAGE_DIGEST',
                  type: 'string',
                },
                {
                  description: 'Image repository where the built image was pushed',
                  name: 'IMAGE_URL',
                  type: 'string',
                },
                {
                  description: 'Digests of the base images used for build',
                  name: 'BASE_IMAGES_DIGESTS',
                  type: 'string',
                },
                {
                  description: 'The counting of Java components by publisher in JSON format',
                  name: 'SBOM_JAVA_COMPONENTS_COUNT',
                  type: 'string',
                },
                {
                  description:
                    'The Java dependencies that came from community sources such as Maven central.',
                  name: 'JAVA_COMMUNITY_DEPENDENCIES',
                  type: 'string',
                },
              ],
              stepTemplate: {
                env: [
                  {
                    name: 'BUILDAH_FORMAT',
                    value: 'oci',
                  },
                  {
                    name: 'STORAGE_DRIVER',
                    value: 'vfs',
                  },
                  {
                    name: 'HERMETIC',
                    value: 'false',
                  },
                  {
                    name: 'PREFETCH_INPUT',
                  },
                  {
                    name: 'DOCKER_CONFIG',
                    value: '/secrets/registry-auth',
                  },
                  {
                    name: 'CONTEXT',
                    value: '.',
                  },
                  {
                    name: 'DOCKERFILE',
                    value:
                      'https://raw.githubusercontent.com/devfile-samples/devfile-sample-java-springboot-basic/main/docker/Dockerfile',
                  },
                  {
                    name: 'IMAGE',
                    value:
                      'quay.io/redhat-appstudio/user-workload:on-pr-36e49113fc391cc1a4723afb0269a88c9e54608d',
                  },
                  {
                    name: 'TLSVERIFY',
                    value: 'true',
                  },
                ],
                name: '',
                computeResources: {},
              },
              steps: [
                {
                  image: 'quay.io/redhat-appstudio/buildah:v1.28',
                  name: 'build',
                  resources: {
                    limits: {
                      cpu: '2',
                      memory: '4Gi',
                    },
                    requests: {
                      cpu: '10m',
                      memory: '512Mi',
                    },
                  },
                  script:
                    'if [ -e "$CONTEXT/$DOCKERFILE" ]; then\n  dockerfile_path="$CONTEXT/$DOCKERFILE"\nelif [ -e "$DOCKERFILE" ]; then\n  dockerfile_path="$DOCKERFILE"\nelif echo "$DOCKERFILE" | grep -q "^https\\?://"; then\n  echo "Fetch Dockerfile from $DOCKERFILE"\n  dockerfile_path=$(mktemp --suffix=-Dockerfile)\n  http_code=$(curl -s -L -w "%{http_code}" --output "$dockerfile_path" "$DOCKERFILE")\n  if [ $http_code != 200 ]; then\n    echo "No Dockerfile is fetched. Server responds $http_code"\n    exit 1\n  fi\nelse\n  echo "Cannot find Dockerfile $DOCKERFILE"\n  exit 1\nfi\nif [ -n "$JVM_BUILD_WORKSPACE_ARTIFACT_CACHE_PORT_80_TCP_ADDR" ] && grep -q \'^\\s*RUN \\(./\\)\\?mvn\' "$dockerfile_path"; then\n  sed -i -e "s|^\\s*RUN \\(\\(./\\)\\?mvn\\(.*\\)\\)|RUN echo \\"<settings><mirrors><mirror><id>mirror.default</id><url>http://$JVM_BUILD_WORKSPACE_ARTIFACT_CACHE_PORT_80_TCP_ADDR/v1/cache/default/0/</url><mirrorOf>*</mirrorOf></mirror></mirrors></settings>\\" > /tmp/settings.yaml; \\1 -s /tmp/settings.yaml|g" "$dockerfile_path"\n  touch /var/lib/containers/java\nfi\n\n\nsed -i \'s/^\\s*short-name-mode\\s*=\\s*.*/short-name-mode = "disabled"/\' /etc/containers/registries.conf\n\n# Setting new namespace to run buildah - 2^32-2\necho \'root:1:4294967294\' | tee -a /etc/subuid >> /etc/subgid\n\nif [ "${HERMETIC}" == "true" ]; then\n  BUILDAH_ARGS="--pull=never"\n  UNSHARE_ARGS="--net"\n  for image in $(grep -i \'^\\s*FROM\' "$dockerfile_path" | sed \'s/--platform=\\S*//\' | awk \'{print $2}\'); do\n    unshare -Ufp --keep-caps -r --map-users 1,1,65536 --map-groups 1,1,65536 -- buildah pull $image\n  done\n  echo "Build will be executed with network isolation"\nfi\n\nif [ -n "${PREFETCH_INPUT}" ]; then\n  mv cachi2 /tmp/\n  chmod -R go+rwX /tmp/cachi2\n  VOLUME_MOUNTS="--volume /tmp/cachi2:/cachi2"\n  sed -i \'s|^\\s*run |RUN . /cachi2/cachi2.env \\&\\& \\\\\\n    |i\' "$dockerfile_path"\n  echo "Prefetched content will be made available"\nfi\n\nunshare -Uf $UNSHARE_ARGS --keep-caps -r --map-users 1,1,65536 --map-groups 1,1,65536 -- buildah bud \\\n  $VOLUME_MOUNTS \\\n  $BUILDAH_ARGS \\\n  --tls-verify=$TLSVERIFY --no-cache \\\n  --ulimit nofile=4096:4096 \\\n  -f "$dockerfile_path" -t $IMAGE $CONTEXT\n\ncontainer=$(buildah from --pull-never $IMAGE)\nbuildah mount $container | tee /workspace/container_path\necho $container > /workspace/container_name\n',
                  securityContext: {
                    capabilities: {
                      add: ['SETFCAP'],
                    },
                  },
                  volumeMounts: [
                    {
                      mountPath: '/var/lib/containers',
                      name: 'varlibcontainers',
                    },
                    {
                      mountPath: '/secrets/registry-auth',
                      name: 'registry-auth',
                    },
                  ],
                  workingDir: '/workspace/source',
                },
                {
                  image: 'quay.io/redhat-appstudio/syft:v0.47.0',
                  name: 'sbom-get',
                  resources: {},
                  script:
                    'syft dir:/workspace/source --file=/workspace/source/sbom-source.json --output=cyclonedx-json\nfind $(cat /workspace/container_path) -xtype l -delete\nsyft dir:$(cat /workspace/container_path) --file=/workspace/source/sbom-image.json --output=cyclonedx-json\n',
                  volumeMounts: [
                    {
                      mountPath: '/var/lib/containers',
                      name: 'varlibcontainers',
                    },
                  ],
                },
                {
                  image:
                    'quay.io/redhat-appstudio/hacbs-jvm-build-request-processor:1d417e6f1f3e68c6c537333b5759796eddae0afc',
                  name: 'analyse-dependencies-java-sbom',
                  resources: {},
                  script:
                    "if [ -f /var/lib/containers/java ]; then\n  /opt/jboss/container/java/run/run-java.sh analyse-dependencies path $(cat /workspace/container_path) -s /workspace/source/sbom-image.json --task-run-name human-resources-clkq-on-pull-request-xn5nd-build-container --publishers /tekton/results/SBOM_JAVA_COMPONENTS_COUNT\n  sed -i 's/^/ /' /tekton/results/SBOM_JAVA_COMPONENTS_COUNT # Workaround for SRVKP-2875\nelse\n  touch /tekton/results/JAVA_COMMUNITY_DEPENDENCIES\nfi\n",
                  securityContext: {
                    runAsUser: 0,
                  },
                  volumeMounts: [
                    {
                      mountPath: '/var/lib/containers',
                      name: 'varlibcontainers',
                    },
                  ],
                },
                {
                  image: 'registry.access.redhat.com/ubi9/python-39:1-108',
                  name: 'merge-sboms',
                  resources: {},
                  script:
                    '#!/bin/python3\nimport json\nimport os\n\n# load SBOMs\nwith open("./sbom-image.json") as f:\n  image_sbom = json.load(f)\n\nwith open("./sbom-source.json") as f:\n  source_sbom = json.load(f)\n\n# fetch unique components from available SBOMs\ndef get_identifier(component):\n  return component["name"] + \'@\' + component.get("version", "")\n\nexisting_components = [get_identifier(component) for component in image_sbom["components"]]\n\nfor component in source_sbom["components"]:\n  if get_identifier(component) not in existing_components:\n    image_sbom["components"].append(component)\n    existing_components.append(get_identifier(component))\n\nimage_sbom["components"].sort(key=lambda c: get_identifier(c))\n\n# write the CycloneDX unified SBOM\nwith open("./sbom-cyclonedx.json", "w") as f:\n  json.dump(image_sbom, f, indent=4)\n\n# create and write the PURL unified SBOM\npurls = [{"purl": component["purl"]} for component in image_sbom["components"] if "purl" in component]\npurl_content = {"image_contents": {"dependencies": purls}}\n\nwith open("sbom-purl.json", "w") as output_file:\n  json.dump(purl_content, output_file, indent=4)\n',
                  securityContext: {
                    runAsUser: 0,
                  },
                  workingDir: '/workspace/source',
                },
                {
                  image:
                    'registry.access.redhat.com/ubi9/buildah:9.0.0-19@sha256:c8b1d312815452964885680fc5bc8d99b3bfe9b6961228c71a09c72ca8e915eb',
                  name: 'inject-sbom-and-push',
                  resources: {},
                  script:
                    '# Expose base image digests\nbuildah images --format \'{{ .Name }}:{{ .Tag }}@{{ .Digest }}\' | grep -v $IMAGE > /tekton/results/BASE_IMAGES_DIGESTS\n\nbase_image_name=$(buildah inspect --format \'{{ index .ImageAnnotations "org.opencontainers.image.base.name"}}\' $IMAGE)\nbase_image_digest=$(buildah inspect --format \'{{ index .ImageAnnotations "org.opencontainers.image.base.digest"}}\' $IMAGE)\ncontainer=$(buildah from --pull-never $IMAGE)\nbuildah copy $container sbom-cyclonedx.json sbom-purl.json /root/buildinfo/content_manifests/\nbuildah config -a org.opencontainers.image.base.name=${base_image_name} -a org.opencontainers.image.base.digest=${base_image_digest} $container\nbuildah commit $container $IMAGE\nbuildah push \\\n  --tls-verify=$TLSVERIFY \\\n  --digestfile /workspace/source/image-digest $IMAGE \\\n  docker://$IMAGE\ncat "/workspace/source"/image-digest | tee /tekton/results/IMAGE_DIGEST\necho -n "$IMAGE" | tee /tekton/results/IMAGE_URL\n',
                  securityContext: {
                    capabilities: {
                      add: ['SETFCAP'],
                    },
                    runAsUser: 0,
                  },
                  volumeMounts: [
                    {
                      mountPath: '/var/lib/containers',
                      name: 'varlibcontainers',
                    },
                    {
                      mountPath: '/secrets/registry-auth',
                      name: 'registry-auth',
                    },
                  ],
                  workingDir: '/workspace/source',
                },
                {
                  args: [
                    'attach',
                    'sbom',
                    '--sbom',
                    'sbom-cyclonedx.json',
                    '--type',
                    'cyclonedx',
                    'quay.io/redhat-appstudio/user-workload:on-pr-36e49113fc391cc1a4723afb0269a88c9e54608d',
                  ],
                  image: 'quay.io/redhat-appstudio/cosign:v1.13.1',
                  name: 'upload-sbom',
                  resources: {},
                  volumeMounts: [
                    {
                      mountPath: '/secrets/registry-auth',
                      name: 'registry-auth',
                    },
                  ],
                  workingDir: '/workspace/source',
                },
              ],
              volumes: [
                {
                  emptyDir: {},
                  name: 'varlibcontainers',
                },
                {
                  name: 'registry-auth',
                  secret: {
                    optional: true,
                    secretName: 'human-resources-clkq-on-pull-request-xn5nd',
                  },
                },
              ],
              workspaces: [
                {
                  name: 'source',
                },
              ],
            },
            reason: 'Succeeded',
            duration: '7m 26s',
          },
          steps: [
            {
              duration: '4 minutes 13 seconds',
              name: 'build',
              status: 'Succeeded',
            },
            {
              duration: '1 minute 22 seconds',
              name: 'sbom-get',
              status: 'Succeeded',
            },
            {
              duration: 'less than a second',
              name: 'analyse-dependencies-java-sbom',
              status: 'Succeeded',
            },
            {
              duration: 'less than a second',
              name: 'merge-sboms',
              status: 'Succeeded',
            },
            {
              duration: '40 seconds',
              name: 'inject-sbom-and-push',
              status: 'Succeeded',
            },
            {
              duration: '3 seconds',
              name: 'upload-sbom',
              status: 'Succeeded',
            },
          ],
        },
        {
          name: 'sanity-inspect-image',
          params: [
            {
              name: 'IMAGE_URL',
              value: '$(tasks.build-container.results.IMAGE_URL)',
            },
            {
              name: 'IMAGE_DIGEST',
              value: '$(tasks.build-container.results.IMAGE_DIGEST)',
            },
            {
              name: 'DOCKER_AUTH',
              value: '$(tasks.init.results.container-registry-secret)',
            },
          ],
          runAfter: ['build-container'],
          taskRef: {
            bundle:
              'quay.io/redhat-appstudio-tekton-catalog/task-sanity-inspect-image:0.1@sha256:fd4efd9d12eea3a8d47532c4226e685618845d0ba95abb98e008020243d96301',
            kind: 'Task',
            name: 'sanity-inspect-image',
          },
          when: [
            {
              input: 'false',
              operator: 'in',
              values: ['false'],
            },
          ],
          workspaces: [
            {
              name: 'source',
              workspace: 'workspace',
            },
          ],
          status: {
            completionTime: '2023-03-16T01:01:05Z',
            conditions: [
              {
                lastTransitionTime: '2023-03-16T01:01:05Z',
                message: 'All Steps have completed executing',
                reason: 'Succeeded',
                status: 'True',
                type: 'Succeeded',
              },
            ],
            podName: 'human-resources-clkq-on-puld10ceb6b41a43f87c789f6c0c52d53d1-pod',
            startTime: '2023-03-16T01:00:09Z',
            steps: [
              {
                container: 'step-inspect-image',
                imageID:
                  'quay.io/redhat-appstudio/hacbs-test@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
                name: 'inspect-image',
                terminated: {
                  containerID:
                    'cri-o://2ea94f5301f580327020918eb824be3b09030c169f60578abd32ebc326a7cdbe',
                  exitCode: 0,
                  finishedAt: '2023-03-16T01:01:04Z',
                  message:
                    '[{"key":"BASE_IMAGE","value":"docker.io/library/openjdk@sha256:e81b7f317654b0f26d3993e014b04bcb29250339b11b9de41e130feecd4cd43c","type":1},{"key":"BASE_IMAGE_REPOSITORY","value":"library/openjdk","type":1},{"key":"TEST_OUTPUT","value":"{\\"result\\":\\"SUCCESS\\",\\"timestamp\\":\\"1678928464\\",\\"note\\":\\"For more details please visit the logs in workspace of Tekton tasks.\\",\\"namespace\\":\\"default\\",\\"successes\\":1,\\"failures\\":0,\\"warnings\\":0}\\n","type":1}]',
                  reason: 'Completed',
                  startedAt: '2023-03-16T01:01:02Z',
                },
              },
            ],
            results: [
              {
                name: 'BASE_IMAGE',
                type: 'string',
                value:
                  'docker.io/library/openjdk@sha256:e81b7f317654b0f26d3993e014b04bcb29250339b11b9de41e130feecd4cd43c',
              },
              {
                name: 'BASE_IMAGE_REPOSITORY',
                type: 'string',
                value: 'library/openjdk',
              },
              {
                name: 'TEST_OUTPUT',
                type: 'string',
                value:
                  '{"result":"SUCCESS","timestamp":"1678928464","note":"For more details please visit the logs in workspace of Tekton tasks.","namespace":"default","successes":1,"failures":0,"warnings":0}\n',
              },
            ],
            taskSpec: {
              description: 'Get manifest data for the source image and its base image to workspace',
              params: [
                {
                  description: 'the fully qualified image name',
                  name: 'IMAGE_URL',
                  type: 'string',
                },
                {
                  description: 'image digest',
                  name: 'IMAGE_DIGEST',
                  type: 'string',
                },
                {
                  description: 'secret with config.json for container auth',
                  name: 'DOCKER_AUTH',
                  type: 'string',
                },
              ],
              results: [
                {
                  description: 'Base image the source image is built from',
                  name: 'BASE_IMAGE',
                  type: 'string',
                },
                {
                  description: 'Base image repository URL',
                  name: 'BASE_IMAGE_REPOSITORY',
                  type: 'string',
                },
                {
                  description: 'Test output',
                  name: 'TEST_OUTPUT',
                  type: 'string',
                },
              ],
              steps: [
                {
                  env: [
                    {
                      name: 'DOCKER_CONFIG',
                      value: '/secrets/registry-auth',
                    },
                    {
                      name: 'IMAGE_URL',
                      value:
                        'quay.io/redhat-appstudio/user-workload:on-pr-36e49113fc391cc1a4723afb0269a88c9e54608d',
                    },
                    {
                      name: 'IMAGE_DIGEST',
                      value:
                        'sha256:02d4920c04cad24ef1a8058bc31f08a76182e80cc8288712ea764ce45e3406b1',
                    },
                  ],
                  image:
                    'quay.io/redhat-appstudio/hacbs-test:v1.0.11@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
                  name: 'inspect-image',
                  resources: {},
                  script:
                    '#!/usr/bin/env bash\nsource /utils.sh\nIMAGE_INSPECT=image_inspect.json\nBASE_IMAGE_INSPECT=base_image_inspect.json\nRAW_IMAGE_INSPECT=raw_image_inspect.json\n\nIMAGE_URL="${IMAGE_URL}@${IMAGE_DIGEST}"\n# Given a tag and a the digest in the IMAGE_URL we opt to use the digest alone\n# this is because containers/image currently doesn\'t support image references\n# that contain both. See https://github.com/containers/image/issues/1736\nif [[ "${IMAGE_URL}" == *":"*"@"* ]]; then\n  IMAGE_URL="${IMAGE_URL/:*@/@}"\nfi\necho "Inspecting manifest for source image ${IMAGE_URL}"\nskopeo inspect --no-tags docker://"${IMAGE_URL}" > $IMAGE_INSPECT 2> stderr.txt || true\nskopeo inspect --no-tags --raw docker://"${IMAGE_URL}" > $RAW_IMAGE_INSPECT 2>> stderr.txt || true\n\nif [ ! -z $(cat stderr.txt) ]; then\n  echo "skopeo inspect fails, the sanity-inspect-image test meets the following error:"\n  cat stderr.txt\n  TEST_OUTPUT="$(make_result_json -r ERROR -t \'skopeo inspect meets errors\')"\n  echo "${TEST_OUTPUT}" | tee /tekton/results/TEST_OUTPUT\n  exit 0\nfi\necho "Getting base image manifest for source image ${IMAGE_URL}"\nBASE_IMAGE_NAME="$(jq -r ".annotations.\\"org.opencontainers.image.base.name\\"" $RAW_IMAGE_INSPECT)"\nBASE_IMAGE_DIGEST="$(jq -r ".annotations.\\"org.opencontainers.image.base.digest\\"" $RAW_IMAGE_INSPECT)"\nif [ $BASE_IMAGE_NAME == \'null\' ]; then\n  echo "Cannot get base image info from \'annotations\'"\n  echo "Trying to get base image info from \'Labels\'"\n  BASE_IMAGE_NAME="$(jq -r ".Labels.\\"org.opencontainers.image.base.name\\"" $IMAGE_INSPECT)"\n  BASE_IMAGE_DIGEST="$(jq -r ".annotations.\\"org.opencontainers.image.base.digest\\"" $IMAGE_INSPECT)"\n  if [ "$BASE_IMAGE_NAME" == \'null\' ]; then\n    echo "Cannot get base image info from \'Labels\', please check the source image ${IMAGE_URL}"\n    exit 0\n  fi\nfi\nif [ -z "$BASE_IMAGE_NAME" ]; then\n  echo "Source image ${IMAGE_URL} is built from scratch, so there is no base image"\n  exit 0\nfi\nBASE_IMAGE="${BASE_IMAGE_NAME%:*}@$BASE_IMAGE_DIGEST"\necho "The base image is $BASE_IMAGE, get its manifest now"\nskopeo inspect --no-tags docker://$BASE_IMAGE  > $BASE_IMAGE_INSPECT || true\necho -n "$BASE_IMAGE" | tee /tekton/results/BASE_IMAGE\n\nBASE_IMAGE_REPOSITORY="$(jq -r \'.Name | sub("[^/]+/"; "") | sub("[:@].*"; "")\' "$BASE_IMAGE_INSPECT")"\necho -n "$BASE_IMAGE_REPOSITORY" | tee /tekton/results/BASE_IMAGE_REPOSITORY\n\nTEST_OUTPUT="$(make_result_json -r SUCCESS -s 1)"\necho "${TEST_OUTPUT}" | tee /tekton/results/TEST_OUTPUT\n',
                  securityContext: {
                    capabilities: {
                      add: ['SETFCAP'],
                    },
                    runAsUser: 0,
                  },
                  volumeMounts: [
                    {
                      mountPath: '/secrets/registry-auth',
                      name: 'registry-auth',
                    },
                  ],
                  workingDir: '/workspace/source/hacbs/sanity-inspect-image',
                },
              ],
              volumes: [
                {
                  name: 'registry-auth',
                  secret: {
                    optional: true,
                    secretName: 'human-resources-clkq-on-pull-request-xn5nd',
                  },
                },
              ],
              workspaces: [
                {
                  name: 'source',
                },
              ],
            },
            reason: 'Succeeded',
            duration: '56s',
            testFailCount: 0,
            testWarnCount: 0,
          },
          steps: [
            {
              duration: '2 seconds',
              name: 'inspect-image',
              status: 'Succeeded',
            },
          ],
        },
        {
          name: 'sanity-label-check',
          runAfter: ['sanity-inspect-image'],
          taskRef: {
            bundle:
              'quay.io/redhat-appstudio-tekton-catalog/task-sanity-label-check:0.1@sha256:534770bf7a7c10277ab5f9c1e7b766abbffb343cc864dd9545aecc5278257dc3',
            kind: 'Task',
            name: 'sanity-label-check',
          },
          when: [
            {
              input: 'false',
              operator: 'in',
              values: ['false'],
            },
          ],
          workspaces: [
            {
              name: 'workspace',
              workspace: 'workspace',
            },
          ],
          status: {
            completionTime: '2023-03-16T01:01:48Z',
            conditions: [
              {
                lastTransitionTime: '2023-03-16T01:01:48Z',
                message: 'All Steps have completed executing',
                reason: 'Succeeded',
                status: 'True',
                type: 'Succeeded',
              },
            ],
            podName: 'human-resources-clkq-on-pul79484532268420afcba1b4b3cc52c9cb-pod',
            startTime: '2023-03-16T01:01:12Z',
            steps: [
              {
                container: 'step-basic-sanity-checks-required-labels',
                imageID:
                  'quay.io/redhat-appstudio/hacbs-test@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
                name: 'basic-sanity-checks-required-labels',
                terminated: {
                  containerID:
                    'cri-o://ef2f450dcd00d67eba9f560155b91b3790a1c1d3925026c5fc4c12d60ae808cd',
                  exitCode: 0,
                  finishedAt: '2023-03-16T01:01:47Z',
                  message:
                    '[{"key":"TEST_OUTPUT","value":"{\\"result\\":\\"FAILURE\\",\\"timestamp\\":\\"1678928507\\",\\"note\\":\\"For more details please visit the logs in workspace of Tekton tasks.\\",\\"namespace\\":\\"required_checks\\",\\"successes\\":8,\\"failures\\":13,\\"warnings\\":0}\\n","type":1}]',
                  reason: 'Completed',
                  startedAt: '2023-03-16T01:01:46Z',
                },
              },
            ],
            results: [
              {
                name: 'TEST_OUTPUT',
                type: 'string',
                value:
                  '{"result":"FAILURE","timestamp":"1678928507","note":"For more details please visit the logs in workspace of Tekton tasks.","namespace":"required_checks","successes":8,"failures":13,"warnings":0}\n',
              },
            ],
            taskSpec: {
              params: [
                {
                  default: '/project/image/',
                  description: 'Path to the directory containing conftest policies',
                  name: 'POLICY_DIR',
                  type: 'string',
                },
                {
                  default: 'required_checks',
                  description: 'Namespace for the conftest policy',
                  name: 'POLICY_NAMESPACE',
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
                  env: [
                    {
                      name: 'POLICY_NAMESPACE',
                      value: 'required_checks',
                    },
                    {
                      name: 'POLICY_DIR',
                      value: '/project/image/',
                    },
                  ],
                  image:
                    'quay.io/redhat-appstudio/hacbs-test:v1.0.11@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
                  name: 'basic-sanity-checks-required-labels',
                  resources: {},
                  script:
                    '#!/usr/bin/env bash\n\n. /utils.sh\nif [ ! -s ../sanity-inspect-image/image_inspect.json ]; then\n  echo "File ../sanity-inspect-image/image_inspect.json is not generated correctly, please check TEST_OUTPUT of task sanity-inspect-image"\n  TEST_OUTPUT="$(make_result_json -r ERROR -t \'File ../sanity-inspect-image/image_inspect.json is not generated correctly, please check TEST_OUTPUT of task sanity-inspect-image!\')"\n  echo "${TEST_OUTPUT}" | tee /tekton/results/TEST_OUTPUT\n  exit 0\nfi\n\nCONFTEST_OPTIONS=""\nif [ -s "../sanity-inspect-image/base_image_inspect.json" ]; then\n  CONFTEST_OPTIONS="-d=../sanity-inspect-image/base_image_inspect.json"\nfi\n\necho "Running conftest using $POLICY_DIR policy, $POLICY_NAMESPACE namespace"\n/usr/bin/conftest test --no-fail ../sanity-inspect-image/image_inspect.json "${CONFTEST_OPTIONS}" \\\n--policy $POLICY_DIR --namespace $POLICY_NAMESPACE \\\n--output=json 2> stderr.txt | tee sanity_label_check_output.json\n\nif [ ! -z $(cat stderr.txt) ]; then\n  echo "The sanity-label-check test meets the following error:"\n  cat stderr.txt\nfi\nHACBS_ERROR_OUTPUT=$(make_result_json -r "ERROR")\n\nTEST_OUTPUT=\nparse_hacbs_test_output sanity-label-check conftest sanity_label_check_output.json || true\n\necho "${TEST_OUTPUT:-${HACBS_ERROR_OUTPUT}}" | tee /tekton/results/TEST_OUTPUT\n',
                  securityContext: {
                    capabilities: {
                      add: ['SETFCAP'],
                    },
                  },
                  workingDir: '/workspace/workspace/hacbs/sanity-label-check-required_checks',
                },
              ],
              workspaces: [
                {
                  name: 'workspace',
                },
              ],
            },
            reason: 'Test Failures',
            duration: '36s',
            testFailCount: 13,
            testWarnCount: 0,
          },
          steps: [
            {
              duration: '1 second',
              name: 'basic-sanity-checks-required-labels',
              status: 'Succeeded',
            },
          ],
        },
        {
          name: 'sanity-optional-label-check',
          params: [
            {
              name: 'POLICY_NAMESPACE',
              value: 'optional_checks',
            },
          ],
          runAfter: ['sanity-inspect-image'],
          taskRef: {
            bundle:
              'quay.io/redhat-appstudio-tekton-catalog/task-sanity-label-check:0.1@sha256:534770bf7a7c10277ab5f9c1e7b766abbffb343cc864dd9545aecc5278257dc3',
            kind: 'Task',
            name: 'sanity-label-check',
          },
          when: [
            {
              input: 'false',
              operator: 'in',
              values: ['false'],
            },
          ],
          workspaces: [
            {
              name: 'workspace',
              workspace: 'workspace',
            },
          ],
          status: {
            completionTime: '2023-03-16T01:01:49Z',
            conditions: [
              {
                lastTransitionTime: '2023-03-16T01:01:49Z',
                message: 'All Steps have completed executing',
                reason: 'Succeeded',
                status: 'True',
                type: 'Succeeded',
              },
            ],
            podName: 'hum1e2c0e3126f75d552fc611f4c8c772f2af66f8c1e581d3afedf329de-pod',
            startTime: '2023-03-16T01:01:12Z',
            steps: [
              {
                container: 'step-basic-sanity-checks-required-labels',
                imageID:
                  'quay.io/redhat-appstudio/hacbs-test@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
                name: 'basic-sanity-checks-required-labels',
                terminated: {
                  containerID:
                    'cri-o://d1eddf6acc6de2730745f163eb02ab73281caa42c010203127347718ec2bcf47',
                  exitCode: 0,
                  finishedAt: '2023-03-16T01:01:48Z',
                  message:
                    '[{"key":"TEST_OUTPUT","value":"{\\"result\\":\\"FAILURE\\",\\"timestamp\\":\\"1678928508\\",\\"note\\":\\"For more details please visit the logs in workspace of Tekton tasks.\\",\\"namespace\\":\\"optional_checks\\",\\"successes\\":5,\\"failures\\":2,\\"warnings\\":0}\\n","type":1}]',
                  reason: 'Completed',
                  startedAt: '2023-03-16T01:01:47Z',
                },
              },
            ],
            results: [
              {
                name: 'TEST_OUTPUT',
                type: 'string',
                value:
                  '{"result":"FAILURE","timestamp":"1678928508","note":"For more details please visit the logs in workspace of Tekton tasks.","namespace":"optional_checks","successes":5,"failures":2,"warnings":0}\n',
              },
            ],
            taskSpec: {
              params: [
                {
                  default: '/project/image/',
                  description: 'Path to the directory containing conftest policies',
                  name: 'POLICY_DIR',
                  type: 'string',
                },
                {
                  default: 'required_checks',
                  description: 'Namespace for the conftest policy',
                  name: 'POLICY_NAMESPACE',
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
                  env: [
                    {
                      name: 'POLICY_NAMESPACE',
                      value: 'optional_checks',
                    },
                    {
                      name: 'POLICY_DIR',
                      value: '/project/image/',
                    },
                  ],
                  image:
                    'quay.io/redhat-appstudio/hacbs-test:v1.0.11@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
                  name: 'basic-sanity-checks-required-labels',
                  resources: {},
                  script:
                    '#!/usr/bin/env bash\n\n. /utils.sh\nif [ ! -s ../sanity-inspect-image/image_inspect.json ]; then\n  echo "File ../sanity-inspect-image/image_inspect.json is not generated correctly, please check TEST_OUTPUT of task sanity-inspect-image"\n  TEST_OUTPUT="$(make_result_json -r ERROR -t \'File ../sanity-inspect-image/image_inspect.json is not generated correctly, please check TEST_OUTPUT of task sanity-inspect-image!\')"\n  echo "${TEST_OUTPUT}" | tee /tekton/results/TEST_OUTPUT\n  exit 0\nfi\n\nCONFTEST_OPTIONS=""\nif [ -s "../sanity-inspect-image/base_image_inspect.json" ]; then\n  CONFTEST_OPTIONS="-d=../sanity-inspect-image/base_image_inspect.json"\nfi\n\necho "Running conftest using $POLICY_DIR policy, $POLICY_NAMESPACE namespace"\n/usr/bin/conftest test --no-fail ../sanity-inspect-image/image_inspect.json "${CONFTEST_OPTIONS}" \\\n--policy $POLICY_DIR --namespace $POLICY_NAMESPACE \\\n--output=json 2> stderr.txt | tee sanity_label_check_output.json\n\nif [ ! -z $(cat stderr.txt) ]; then\n  echo "The sanity-label-check test meets the following error:"\n  cat stderr.txt\nfi\nHACBS_ERROR_OUTPUT=$(make_result_json -r "ERROR")\n\nTEST_OUTPUT=\nparse_hacbs_test_output sanity-label-check conftest sanity_label_check_output.json || true\n\necho "${TEST_OUTPUT:-${HACBS_ERROR_OUTPUT}}" | tee /tekton/results/TEST_OUTPUT\n',
                  securityContext: {
                    capabilities: {
                      add: ['SETFCAP'],
                    },
                  },
                  workingDir: '/workspace/workspace/hacbs/sanity-label-check-optional_checks',
                },
              ],
              workspaces: [
                {
                  name: 'workspace',
                },
              ],
            },
            reason: 'Test Failures',
            duration: '37s',
            testFailCount: 2,
            testWarnCount: 0,
          },
          steps: [
            {
              duration: '1 second',
              name: 'basic-sanity-checks-required-labels',
              status: 'Succeeded',
            },
          ],
        },
        {
          name: 'deprecated-base-image-check',
          params: [
            {
              name: 'BASE_IMAGES_DIGESTS',
              value: '$(tasks.build-container.results.BASE_IMAGES_DIGESTS)',
            },
          ],
          taskRef: {
            bundle:
              'quay.io/redhat-appstudio-tekton-catalog/task-deprecated-image-check:0.1@sha256:28d724dd6f6c365b2a839d9e52baac91559fd78c160774769c1ec724301f78d4',
            kind: 'Task',
            name: 'deprecated-image-check',
          },
          when: [
            {
              input: 'false',
              operator: 'in',
              values: ['false'],
            },
          ],
          workspaces: [
            {
              name: 'sanity-ws',
              workspace: 'workspace',
            },
          ],
          status: {
            completionTime: '2023-03-16T01:00:58Z',
            conditions: [
              {
                lastTransitionTime: '2023-03-16T01:00:58Z',
                message: 'All Steps have completed executing',
                reason: 'Succeeded',
                status: 'True',
                type: 'Succeeded',
              },
            ],
            podName: 'hum1e2c0e3126f75d552fc611f4f0ccc1dc7f27d9497ffe55c45a54436c-pod',
            startTime: '2023-03-16T01:00:10Z',
            steps: [
              {
                container: 'step-query-pyxis',
                imageID:
                  'registry.access.redhat.com/ubi8/ubi-minimal@sha256:ab03679e683010d485ef0399e056b09a38d7843ba4a36ee7dec337dd0037f7a7',
                name: 'query-pyxis',
                terminated: {
                  containerID:
                    'cri-o://75f0f975e629f41f9b9a9f3ab4cf466c53a7e7b360e5580658b645c0e3c1682f',
                  exitCode: 0,
                  finishedAt: '2023-03-16T01:00:56Z',
                  message:
                    '[{"key":"PYXIS_HTTP_CODE","value":"404 docker.io library/openjdk\\n404 quay.io devfile/maven\\n","type":1}]',
                  reason: 'Completed',
                  startedAt: '2023-03-16T01:00:55Z',
                },
              },
              {
                container: 'step-run-conftest',
                imageID:
                  'quay.io/redhat-appstudio/hacbs-test@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
                name: 'run-conftest',
                terminated: {
                  containerID:
                    'cri-o://9a25c1206064cde2c38a6499d35cb764cfb82bffddaef706246117905a0b7156',
                  exitCode: 0,
                  finishedAt: '2023-03-16T01:00:56Z',
                  message:
                    '[{"key":"TEST_OUTPUT","value":"{\\"result\\":\\"ERROR\\",\\"timestamp\\":\\"1678928456\\",\\"note\\":\\"For more details please visit the logs in workspace of Tekton tasks.\\",\\"namespace\\":\\"required_checks\\",\\"successes\\":0,\\"failures\\":0,\\"warnings\\":0}\\n","type":1},{"key":"PYXIS_HTTP_CODE","value":"404 docker.io library/openjdk\\n404 quay.io devfile/maven\\n","type":1}]',
                  reason: 'Completed',
                  startedAt: '2023-03-16T01:00:56Z',
                },
              },
            ],
            results: [
              {
                name: 'PYXIS_HTTP_CODE',
                type: 'string',
                value: '404 docker.io library/openjdk\n404 quay.io devfile/maven\n',
              },
              {
                name: 'TEST_OUTPUT',
                type: 'string',
                value:
                  '{"result":"ERROR","timestamp":"1678928456","note":"For more details please visit the logs in workspace of Tekton tasks.","namespace":"required_checks","successes":0,"failures":0,"warnings":0}\n',
              },
            ],
            taskSpec: {
              params: [
                {
                  default: '/project/repository/',
                  description: 'Path to the directory containing conftest policies',
                  name: 'POLICY_DIR',
                  type: 'string',
                },
                {
                  default: 'required_checks',
                  description: 'Namespace for the conftest policy',
                  name: 'POLICY_NAMESPACE',
                  type: 'string',
                },
                {
                  description: 'Digests of the base images used for build',
                  name: 'BASE_IMAGES_DIGESTS',
                  type: 'string',
                },
              ],
              results: [
                {
                  description: 'HTTP code returned by Pyxis API endpoint',
                  name: 'PYXIS_HTTP_CODE',
                  type: 'string',
                },
                {
                  description: 'Test output',
                  name: 'TEST_OUTPUT',
                  type: 'string',
                },
              ],
              steps: [
                {
                  env: [
                    {
                      name: 'BASE_IMAGES_DIGESTS',
                      value:
                        'docker.io/library/openjdk:11-jdk@sha256:99bac5bf83633e3c7399aed725c8415e7b569b54e03e4599e580fc9cdb7c21ab\nquay.io/devfile/maven:3.8.1-openjdk-17-slim@sha256:a65cb519660f51b06f487a6f5de8c264e1e2bcdb32033f3f45b0899f7740ca0f\n',
                    },
                  ],
                  image:
                    'registry.access.redhat.com/ubi8/ubi-minimal:8.7-1085@sha256:dc06ba83c6f47fc0a2bca516a9b99f1cf8ef37331fd460f4ca55579a815ee6cb',
                  name: 'query-pyxis',
                  resources: {},
                  script:
                    '#!/usr/bin/env bash\nreadarray -t IMAGE_ARRAY < <(echo -n "$BASE_IMAGES_DIGESTS" | sed \'s/\\\\n/\\\'$\'\\n\'\'/g\')\nfor BASE_IMAGE in ${IMAGE_ARRAY[@]};\ndo\n  IFS=:\'/\' read -r IMAGE_REGISTRY IMAGE_WITH_TAG <<< $BASE_IMAGE; echo "[$IMAGE_REGISTRY] [$IMAGE_WITH_TAG]"\n  IMAGE_REPOSITORY=`echo $IMAGE_WITH_TAG | cut -d ":" -f1`\n  IMAGE_REGISTRY=${IMAGE_REGISTRY//registry.redhat.io/registry.access.redhat.com}\n  export IMAGE_REPO_PATH=/workspace/sanity-ws/${IMAGE_REPOSITORY}\n  mkdir -p ${IMAGE_REPO_PATH}\n  echo "Querying Pyxis for $BASE_IMAGE..."\n  http_code=$(curl -s -k -o ${IMAGE_REPO_PATH}/repository_data.json -w \'%{http_code}\' "https://catalog.redhat.com/api/containers/v1/repositories/registry/${IMAGE_REGISTRY}/repository/${IMAGE_REPOSITORY}")\n  echo "Response code: $http_code"\n  echo $http_code $IMAGE_REGISTRY $IMAGE_REPOSITORY>> /tekton/results/PYXIS_HTTP_CODE\ndone\n',
                },
                {
                  env: [
                    {
                      name: 'POLICY_DIR',
                      value: '/project/repository/',
                    },
                    {
                      name: 'POLICY_NAMESPACE',
                      value: 'required_checks',
                    },
                  ],
                  image:
                    'quay.io/redhat-appstudio/hacbs-test:v1.0.11@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
                  name: 'run-conftest',
                  resources: {},
                  script:
                    '#!/usr/bin/env sh\nsource /utils.sh\n\nsuccess_counter=0\nfailure_counter=0\nerror_counter=0\nif [ ! -f /tekton/results/PYXIS_HTTP_CODE ]; then\n  error_counter=$((error_counter++))\nfi\nwhile IFS= read -r line\ndo\n  IFS=:\' \' read -r http_code IMAGE_REGISTRY IMAGE_REPOSITORY <<< $line; echo "[$http_code] [$IMAGE_REGISTRY] [$IMAGE_REPOSITORY]"\n  export IMAGE_REPO_PATH=/workspace/sanity-ws/${IMAGE_REPOSITORY}\n  if [ "$http_code" == "200" ];\n  then\n    echo "Running conftest using $POLICY_DIR policy, $POLICY_NAMESPACE namespace"\n    /usr/bin/conftest test --no-fail ${IMAGE_REPO_PATH}/repository_data.json \\\n    --policy $POLICY_DIR --namespace $POLICY_NAMESPACE \\\n    --output=json 2> ${IMAGE_REPO_PATH}/stderr.txt | tee ${IMAGE_REPO_PATH}/deprecated_image_check_output.json\n\n    failure_counter=$((failure_counter+$(jq -r \'.[].failures|length\' ${IMAGE_REPO_PATH}/deprecated_image_check_output.json)))\n    success_counter=$((success_counter+$(jq -r \'.[].successes\' ${IMAGE_REPO_PATH}/deprecated_image_check_output.json)))\n\n  elif [ "$http_code" == "404" ];\n  then\n    echo "Registry/image ${IMAGE_REGISTRY}/${IMAGE_REPOSITORY} not found in Pyxis" >> /workspace/sanity-ws/stderr.txt\n    cat /workspace/sanity-ws/stderr.txt\n  else\n    echo "Unexpected error (HTTP code $http_code) occured for registry/image ${IMAGE_REGISTRY}/${IMAGE_REPOSITORY}" >> /workspace/sanity-ws/stderr.txt\n    cat /workspace/sanity-ws/stderr.txt\n    error_counter=$((error_counter++))\n    exit 0\n  fi\ndone < /tekton/results/PYXIS_HTTP_CODE\n\nHACBS_ERROR_OUTPUT=$(make_result_json -r ERROR -n "$POLICY_NAMESPACE")\nif [[ "$error_counter" == 0 && "$success_counter" > 0 ]];\nthen\n  if [[ "${failure_counter}" -gt 0 ]]; then RES="FAILURE"; else RES="SUCCESS"; fi\n  TEST_OUTPUT=$(make_result_json \\\n    -r "${RES}" -n "$POLICY_NAMESPACE" \\\n    -s "${success_counter}" -f "${failure_counter}")\nfi\necho "${TEST_OUTPUT:-${HACBS_ERROR_OUTPUT}}" | tee /tekton/results/TEST_OUTPUT\n',
                },
              ],
              workspaces: [
                {
                  name: 'sanity-ws',
                },
              ],
            },
            reason: 'Test Failures',
            duration: '48s',
            testFailCount: 0,
            testWarnCount: 0,
          },
          steps: [
            {
              duration: '1 second',
              name: 'query-pyxis',
              status: 'Succeeded',
            },
            {
              duration: 'less than a second',
              name: 'run-conftest',
              status: 'Succeeded',
            },
          ],
        },
        {
          name: 'clair-scan',
          params: [
            {
              name: 'image-digest',
              value: '$(tasks.build-container.results.IMAGE_DIGEST)',
            },
            {
              name: 'image-url',
              value: '$(tasks.build-container.results.IMAGE_URL)',
            },
            {
              name: 'docker-auth',
              value: '$(tasks.init.results.container-registry-secret)',
            },
          ],
          runAfter: ['build-container'],
          taskRef: {
            bundle:
              'quay.io/redhat-appstudio-tekton-catalog/task-clair-scan:0.1@sha256:fba8170329ab00b864ee7d16e0358df4c4386880e10894fd7bbbb1457112477b',
            kind: 'Task',
            name: 'clair-scan',
          },
          when: [
            {
              input: 'false',
              operator: 'in',
              values: ['false'],
            },
          ],
          status: {
            completionTime: '2023-03-16T01:01:13Z',
            conditions: [
              {
                lastTransitionTime: '2023-03-16T01:01:13Z',
                message: 'All Steps have completed executing',
                reason: 'Succeeded',
                status: 'True',
                type: 'Succeeded',
              },
            ],
            podName: 'human-resources-clkq-on-pull-request-xn5nd-clair-scan-pod',
            startTime: '2023-03-16T01:00:11Z',
            steps: [
              {
                container: 'step-get-vulnerabilities',
                imageID:
                  'quay.io/redhat-appstudio/clair-in-ci@sha256:dfdcbdd61bb36a23b1675b8490e248323104fb04af1f30ebfba04efc382fe167',
                name: 'get-vulnerabilities',
                terminated: {
                  containerID:
                    'cri-o://d70018a30bccee9c8dd997de3c1d51708a19da4f3bfc8709fe7366e029f3a35c',
                  exitCode: 0,
                  finishedAt: '2023-03-16T01:01:10Z',
                  reason: 'Completed',
                  startedAt: '2023-03-16T01:00:31Z',
                },
              },
              {
                container: 'step-conftest-vulnerabilities',
                imageID:
                  'quay.io/redhat-appstudio/hacbs-test@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
                name: 'conftest-vulnerabilities',
                terminated: {
                  containerID:
                    'cri-o://4663a332f0e18ef47c572d2d59a7296f92414c50d1d0faa5856f91388fe5d110',
                  exitCode: 0,
                  finishedAt: '2023-03-16T01:01:11Z',
                  reason: 'Completed',
                  startedAt: '2023-03-16T01:01:11Z',
                },
              },
              {
                container: 'step-test-format-result',
                imageID:
                  'quay.io/redhat-appstudio/hacbs-test@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
                name: 'test-format-result',
                terminated: {
                  containerID:
                    'cri-o://21cec6cf1d2fd36c879d6088ffe3c813be9254dfb71b7a7de69e3d7897ee25e7',
                  exitCode: 0,
                  finishedAt: '2023-03-16T01:01:11Z',
                  message:
                    '[{"key":"SCAN_OUTPUT","value":"{\\"vulnerabilities\\":{\\"critical\\":1,\\"high\\":1,\\"medium\\":1,\\"low\\":1}}\\n","type":1},{"key":"TEST_OUTPUT","value":"{\\"result\\":\\"SUCCESS\\",\\"timestamp\\":\\"1678928471\\",\\"note\\":\\"Please refer to result SCAN_OUTPUT for the vulnerabilities scanned by clair\\",\\"namespace\\":\\"default\\",\\"successes\\":0,\\"failures\\":0,\\"warnings\\":0}\\n","type":1}]',
                  reason: 'Completed',
                  startedAt: '2023-03-16T01:01:11Z',
                },
              },
            ],
            results: [
              {
                name: 'SCAN_OUTPUT',
                type: 'string',
                value: '{"vulnerabilities":{"critical":1,"high":1,"medium":1,"low":1}}\n',
              },
              {
                name: 'TEST_OUTPUT',
                type: 'string',
                value:
                  '{"result":"SUCCESS","timestamp":"1678928471","note":"Please refer to result SCAN_OUTPUT for the vulnerabilities scanned by clair","namespace":"default","successes":0,"failures":0,"warnings":0}\n',
              },
            ],
            taskSpec: {
              params: [
                {
                  description: 'Image digest to scan',
                  name: 'image-digest',
                  type: 'string',
                },
                {
                  description: 'Url to image',
                  name: 'image-url',
                  type: 'string',
                },
                {
                  default: '',
                  description: 'folder with config.json for container auth',
                  name: 'docker-auth',
                  type: 'string',
                },
              ],
              results: [
                {
                  description: 'test output',
                  name: 'TEST_OUTPUT',
                  type: 'string',
                },
                {
                  description: 'clair scan result',
                  name: 'SCAN_OUTPUT',
                  type: 'string',
                },
              ],
              steps: [
                {
                  env: [
                    {
                      name: 'DOCKER_CONFIG',
                      value: 'human-resources-clkq-on-pull-request-xn5nd',
                    },
                    {
                      name: 'IMAGE_URL',
                      value:
                        'quay.io/redhat-appstudio/user-workload:on-pr-36e49113fc391cc1a4723afb0269a88c9e54608d',
                    },
                    {
                      name: 'IMAGE_DIGEST',
                      value:
                        'sha256:02d4920c04cad24ef1a8058bc31f08a76182e80cc8288712ea764ce45e3406b1',
                    },
                  ],
                  image: 'quay.io/redhat-appstudio/clair-in-ci:latest',
                  imagePullPolicy: 'Always',
                  name: 'get-vulnerabilities',
                  resources: {},
                  script:
                    '#!/usr/bin/env bash\n\nimagewithouttag=$(echo $IMAGE_URL | sed "s/\\(.*\\):.*/\\1/" | tr -d \'\\n\')\n# strip new-line escape symbol from parameter and save it to variable\nimageanddigest=$(echo $imagewithouttag@$IMAGE_DIGEST)\n\nclair-action report --image-ref=$imageanddigest --db-path=/tmp/matcher.db --format=quay > /tekton/home/clair-result.json || true\n',
                },
                {
                  image:
                    'quay.io/redhat-appstudio/hacbs-test:v1.0.11@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
                  name: 'conftest-vulnerabilities',
                  resources: {},
                  script:
                    'if [ ! -s /tekton/home/clair-result.json ]; then\n  echo "Previous step [get-vulnerabilities] failed, /tekton/home/clair-result.json is empty."\nelse\n  /usr/bin/conftest test --no-fail /tekton/home/clair-result.json \\\n  --policy /project/clair/vulnerabilities-check.rego --namespace required_checks \\\n  --output=json | tee /tekton/home/clair-vulnerabilities.json || true\nfi\n',
                  securityContext: {
                    capabilities: {
                      add: ['SETFCAP'],
                    },
                  },
                },
                {
                  image:
                    'quay.io/redhat-appstudio/hacbs-test:v1.0.11@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
                  name: 'test-format-result',
                  resources: {},
                  script:
                    '#!/usr/bin/env bash\n. /utils.sh\n\nif [[ ! -f /tekton/home/clair-vulnerabilities.json ]] || [[ "$(jq \'.[] | has("failures")\' /tekton/home/clair-vulnerabilities.json)" == "false" ]]; then\n  TEST_OUTPUT=$(make_result_json -r "ERROR" -t "/tekton/home/clair-vulnerabilities.json is not generated correctly, please check again")\n  echo "/tekton/home/clair-vulnerabilities.json is not generated correctly, please check again"\n  echo "${TEST_OUTPUT}" | tee /tekton/results/TEST_OUTPUT\n  exit 0\nfi\n\njq -rce \\\n  \'{vulnerabilities:{\n      critical: (.[] | .failures | map(select(.metadata.details.name=="clair_critical_vulnerabilities")) | length),\n      high: (.[] | .failures | map(select(.metadata.details.name=="clair_high_vulnerabilities")) | length),\n      medium: (.[] | .failures | map(select(.metadata.details.name=="clair_medium_vulnerabilities")) | length),\n      low: (.[] | .failures | map(select(.metadata.details.name=="clair_low_vulnerabilities")) | length)\n    }}\' /tekton/home/clair-vulnerabilities.json | tee /tekton/results/SCAN_OUTPUT\n\nTEST_OUTPUT=$(make_result_json -r "SUCCESS" -t "Please refer to result SCAN_OUTPUT for the vulnerabilities scanned by clair")\necho "${TEST_OUTPUT}" | tee /tekton/results/TEST_OUTPUT\n',
                },
              ],
            },
            reason: 'Succeeded',
            duration: '1m 2s',
            testFailCount: 0,
            testWarnCount: 0,
          },
          steps: [
            {
              duration: '39 seconds',
              name: 'get-vulnerabilities',
              status: 'Succeeded',
            },
            {
              duration: 'less than a second',
              name: 'conftest-vulnerabilities',
              status: 'Succeeded',
            },
            {
              duration: 'less than a second',
              name: 'test-format-result',
              status: 'Succeeded',
            },
          ],
        },
        {
          name: 'sast-snyk-check',
          params: [
            {
              name: 'SNYK_SECRET',
              value: '',
            },
          ],
          runAfter: ['clone-repository'],
          taskRef: {
            bundle:
              'quay.io/redhat-appstudio-tekton-catalog/task-sast-snyk-check:0.1@sha256:566ce8367b92261d637ecac245a66e3d7177d8d375948ba0fc74dbc7a55d674d',
            kind: 'Task',
            name: 'sast-snyk-check',
          },
          when: [
            {
              input: 'false',
              operator: 'in',
              values: ['false'],
            },
            {
              input: '',
              operator: 'notin',
              values: [''],
            },
          ],
          workspaces: [
            {
              name: 'workspace',
              workspace: 'workspace',
            },
          ],
          status: {
            reason: 'Skipped',
          },
          steps: [],
        },
        {
          name: 'clamav-scan',
          params: [
            {
              name: 'image-digest',
              value: '$(tasks.build-container.results.IMAGE_DIGEST)',
            },
            {
              name: 'image-url',
              value: '$(tasks.build-container.results.IMAGE_URL)',
            },
            {
              name: 'docker-auth',
              value: '$(tasks.init.results.container-registry-secret)',
            },
          ],
          runAfter: ['build-container'],
          taskRef: {
            bundle:
              'quay.io/redhat-appstudio-tekton-catalog/task-clamav-scan:0.1@sha256:28b425322aa84f988c6c4f8d503787b3fb301668b2ad6728846b8f8c45ba012b',
            kind: 'Task',
            name: 'clamav-scan',
          },
          when: [
            {
              input: 'false',
              operator: 'in',
              values: ['false'],
            },
          ],
          status: {
            completionTime: '2023-03-16T01:03:37Z',
            conditions: [
              {
                lastTransitionTime: '2023-03-16T01:03:37Z',
                message: 'All Steps have completed executing',
                reason: 'Succeeded',
                status: 'True',
                type: 'Succeeded',
              },
            ],
            podName: 'human-resources-clkq-on-pull-request-xn5nd-clamav-scan-pod',
            sidecars: [
              {
                container: 'sidecar-database',
                imageID:
                  'quay.io/redhat-appstudio/clamav-db@sha256:bc7ef1caf8641569961cb2f6f8dd65ca7c4665455484587d85b9e24b96d295e9',
                name: 'database',
                terminated: {
                  containerID:
                    'cri-o://8119fd062faba69ca2264e2b8bdac5edbe562bb3bf38bb8a496f4bfb5cfe6cc5',
                  exitCode: 0,
                  finishedAt: '2023-03-16T01:00:30Z',
                  reason: 'Completed',
                  startedAt: '2023-03-16T01:00:30Z',
                },
              },
            ],
            startTime: '2023-03-16T01:00:11Z',
            steps: [
              {
                container: 'step-extract-and-scan-image',
                imageID:
                  'quay.io/redhat-appstudio/hacbs-test@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
                name: 'extract-and-scan-image',
                terminated: {
                  containerID:
                    'cri-o://91d946998b032c81f1786551dbf46cf6276d20fbaa64d18dbca90b7a993f71e1',
                  exitCode: 0,
                  finishedAt: '2023-03-16T01:03:35Z',
                  reason: 'Completed',
                  startedAt: '2023-03-16T01:00:32Z',
                },
              },
              {
                container: 'step-modify-clam-output-to-json',
                imageID:
                  'quay.io/redhat-appstudio/hacbs-test@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
                name: 'modify-clam-output-to-json',
                terminated: {
                  containerID:
                    'cri-o://2ec6126681c18c25837069615d72cbf688aae202524418762819ab952f7b9878',
                  exitCode: 0,
                  finishedAt: '2023-03-16T01:03:36Z',
                  reason: 'Completed',
                  startedAt: '2023-03-16T01:03:36Z',
                },
              },
              {
                container: 'step-store-hacbs-test-output-result',
                imageID:
                  'quay.io/redhat-appstudio/hacbs-test@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
                name: 'store-hacbs-test-output-result',
                terminated: {
                  containerID:
                    'cri-o://35d66ce947c3931dbece1c79f2d1f177c28d62bd911a300be61555069d60de39',
                  exitCode: 0,
                  finishedAt: '2023-03-16T01:03:36Z',
                  message:
                    '[{"key":"TEST_OUTPUT","value":"{\\"result\\":\\"SUCCESS\\",\\"timestamp\\":\\"1678928616\\",\\"note\\":\\"For more details please visit the logs in workspace of Tekton tasks.\\",\\"namespace\\":\\"default\\",\\"successes\\":1,\\"failures\\":0,\\"warnings\\":0}\\n","type":1}]',
                  reason: 'Completed',
                  startedAt: '2023-03-16T01:03:36Z',
                },
              },
            ],
            results: [
              {
                name: 'TEST_OUTPUT',
                type: 'string',
                value:
                  '{"result":"SUCCESS","timestamp":"1678928616","note":"For more details please visit the logs in workspace of Tekton tasks.","namespace":"default","successes":1,"failures":0,"warnings":0}\n',
              },
            ],
            taskSpec: {
              params: [
                {
                  description: 'Image digest to scan',
                  name: 'image-digest',
                  type: 'string',
                },
                {
                  description: 'Url to image',
                  name: 'image-url',
                  type: 'string',
                },
                {
                  description: 'secret with config.json for container auth',
                  name: 'docker-auth',
                  type: 'string',
                },
              ],
              results: [
                {
                  description: 'test output',
                  name: 'TEST_OUTPUT',
                  type: 'string',
                },
              ],
              sidecars: [
                {
                  image: 'quay.io/redhat-appstudio/clamav-db:latest',
                  imagePullPolicy: 'Always',
                  name: 'database',
                  computeResources: {},
                  script: '#!/usr/bin/env bash\ncp -r /var/lib/clamav/* /tmp/clamdb\n',
                  volumeMounts: [
                    {
                      mountPath: '/tmp/clamdb',
                      name: 'dbfolder',
                    },
                  ],
                },
              ],
              steps: [
                {
                  env: [
                    {
                      name: 'HOME',
                      value: '/work',
                    },
                    {
                      name: 'DOCKER_CONFIG',
                      value: '/secrets/registry-auth',
                    },
                    {
                      name: 'IMAGE_URL',
                      value:
                        'quay.io/redhat-appstudio/user-workload:on-pr-36e49113fc391cc1a4723afb0269a88c9e54608d',
                    },
                    {
                      name: 'IMAGE_DIGEST',
                      value:
                        'sha256:02d4920c04cad24ef1a8058bc31f08a76182e80cc8288712ea764ce45e3406b1',
                    },
                  ],
                  image:
                    'quay.io/redhat-appstudio/hacbs-test:v1.0.11@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
                  name: 'extract-and-scan-image',
                  resources: {
                    limits: {
                      cpu: '2',
                      memory: '4Gi',
                    },
                    requests: {
                      cpu: '10m',
                      memory: '512Mi',
                    },
                  },
                  script:
                    'imagewithouttag=$(echo $IMAGE_URL | sed "s/\\(.*\\):.*/\\1/" | tr -d \'\\n\')\n\n# strip new-line escape symbol from parameter and save it to variable\nimageanddigest=$(echo $imagewithouttag@$IMAGE_DIGEST)\n\n# check if image is attestation one, skip the clamav scan in such case\nif [[ $imageanddigest == *.att ]]\nthen\n    echo "$imageanddigest is an attestation image, skipping clamav scan"\n    exit 0\nfi\nmkdir content\ncd content\necho Extracting image\nif ! oc image extract $imageanddigest; then\n  echo "Unable to extract image! Skipping clamscan!"\n  exit 0\nfi\necho Extraction done\nclamscan -ri --max-scansize=250M | tee /tekton/home/clamscan-result.log\necho "Executed-on: Scan was executed on version - $(clamscan --version)" | tee -a /tekton/home/clamscan-result.log\n',
                  securityContext: {
                    runAsUser: 1000,
                  },
                  volumeMounts: [
                    {
                      mountPath: '/var/lib/clamav',
                      name: 'dbfolder',
                    },
                    {
                      mountPath: '/work',
                      name: 'work',
                    },
                    {
                      mountPath: '/secrets/registry-auth',
                      name: 'registry-auth',
                    },
                  ],
                  workingDir: '/work',
                },
                {
                  image:
                    'quay.io/redhat-appstudio/hacbs-test:v1.0.11@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
                  name: 'modify-clam-output-to-json',
                  resources: {},
                  script:
                    '#!/usr/bin/env python3.9\nimport json\nimport dateutil.parser as parser\nimport os\n\nclamscan_result = "/tekton/home/clamscan-result.log"\nif not os.path.exists(clamscan_result) or os.stat(clamscan_result).st_size == 0:\n    print("clamscan-result.log file is empty, meaning previous step didn\'t extracted the compiled code, skipping parsing.")\n    exit(0)\n\nwith open(clamscan_result, "r") as file:\n    clam_result_str = file.read()\n\ndef clam_result_str_to_json(clam_result_str):\n\n    clam_result_list = clam_result_str.split("\\n")\n    clam_result_list.remove(\'\')\n\n    results_marker = \\\n        clam_result_list.index("----------- SCAN SUMMARY -----------")\n\n    hit_list = clam_result_list[:results_marker]\n    summary_list = clam_result_list[(results_marker + 1):]\n\n    r_dict = { "hits": hit_list }\n    for item in summary_list:\n        # in case of blank lines\n        if not item:\n            continue\n        split_index = [c == \':\' for c in item].index(True)\n        key = item[:split_index].lower()\n        key = key.replace(" ", "_")\n        value = item[(split_index + 1):].strip(" ")\n        if (key == "start_date" or key == "end_date"):\n          isodate = parser.parse(value)\n          value = isodate.isoformat()\n        r_dict[key] = value\n    print(json.dumps(r_dict))\n    with open(\'/tekton/home/clamscan-result.json\', \'w\') as f:\n      print(json.dumps(r_dict), file=f)\n\ndef main():\n    clam_result_str_to_json(clam_result_str)\n\nif __name__ == "__main__":\n    main()\n',
                },
                {
                  image:
                    'quay.io/redhat-appstudio/hacbs-test:v1.0.11@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
                  name: 'store-hacbs-test-output-result',
                  resources: {},
                  script:
                    '#!/usr/bin/env bash\nsource /utils.sh\n\nHACBS_ERROR_OUTPUT=$(make_result_json -r "ERROR")\nif [ -f /tekton/home/clamscan-result.json ];\nthen\n  cat /tekton/home/clamscan-result.json\n  INFECTED_FILES=$(jq -r \'.infected_files\' /tekton/home/clamscan-result.json || true )\n  if [ -z "${INFECTED_FILES}" ]; then\n    echo "Failed to get number of infected files"\n  else\n    if [[ "${INFECTED_FILES}" -gt 0 ]]; then RES="FAILURE"; else RES="SUCCESS"; fi\n    TEST_OUTPUT=$(make_result_json -r "${RES}" -s 1 -f "${INFECTED_FILES}")\n  fi\nfi\necho "${TEST_OUTPUT:-${HACBS_ERROR_OUTPUT}}" | tee /tekton/results/TEST_OUTPUT\n',
                },
              ],
              volumes: [
                {
                  name: 'dbfolder',
                },
                {
                  name: 'work',
                },
                {
                  name: 'registry-auth',
                  secret: {
                    optional: true,
                    secretName: 'human-resources-clkq-on-pull-request-xn5nd',
                  },
                },
              ],
            },
            reason: 'Succeeded',
            duration: '3m 26s',
            testFailCount: 0,
            testWarnCount: 0,
          },
          steps: [
            {
              duration: '3 minutes 3 seconds',
              name: 'extract-and-scan-image',
              status: 'Succeeded',
            },
            {
              duration: 'less than a second',
              name: 'modify-clam-output-to-json',
              status: 'Succeeded',
            },
            {
              duration: 'less than a second',
              name: 'store-hacbs-test-output-result',
              status: 'Succeeded',
            },
          ],
        },
        {
          name: 'sbom-json-check',
          params: [
            {
              name: 'IMAGE_URL',
              value: '$(tasks.build-container.results.IMAGE_URL)',
            },
            {
              name: 'IMAGE_DIGEST',
              value: '$(tasks.build-container.results.IMAGE_DIGEST)',
            },
          ],
          runAfter: ['build-container'],
          taskRef: {
            bundle:
              'quay.io/redhat-appstudio-tekton-catalog/task-sbom-json-check:0.1@sha256:ce6a0932da9b41080108284d1366fc2de8374fca5137500138e16ad9e04610c6',
            kind: 'Task',
            name: 'sbom-json-check',
          },
          when: [
            {
              input: 'false',
              operator: 'in',
              values: ['false'],
            },
          ],
          status: {
            completionTime: '2023-03-16T01:00:39Z',
            conditions: [
              {
                lastTransitionTime: '2023-03-16T01:00:39Z',
                message: 'All Steps have completed executing',
                reason: 'Succeeded',
                status: 'True',
                type: 'Succeeded',
              },
            ],
            podName: 'human-resources-clkq-on-pull-request-xn5nd-sbom-json-check-pod',
            startTime: '2023-03-16T01:00:12Z',
            steps: [
              {
                container: 'step-sbom-json-check',
                imageID:
                  'quay.io/redhat-appstudio/hacbs-test@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
                name: 'sbom-json-check',
                terminated: {
                  containerID:
                    'cri-o://fbb5c85e29431424ada9035e8fde3dde65f1e30bab6a0022282d219d364717c0',
                  exitCode: 0,
                  finishedAt: '2023-03-16T01:00:38Z',
                  message:
                    '[{"key":"TEST_OUTPUT","value":"{\\"result\\":\\"SUCCESS\\",\\"timestamp\\":\\"1678928438\\",\\"note\\":\\"For more details please visit the logs in workspace of Tekton tasks.\\",\\"namespace\\":\\"default\\",\\"successes\\":1,\\"failures\\":0,\\"warnings\\":0}\\n","type":1}]',
                  reason: 'Completed',
                  startedAt: '2023-03-16T01:00:26Z',
                },
              },
            ],
            results: [
              {
                name: 'TEST_OUTPUT',
                type: 'string',
                value:
                  '{"result":"SUCCESS","timestamp":"1678928438","note":"For more details please visit the logs in workspace of Tekton tasks.","namespace":"default","successes":1,"failures":0,"warnings":0}\n',
              },
            ],
            taskSpec: {
              description:
                'Check the syntax of the sbom-cyclonedx.json file which should be found in the /root/buildinfo/content_manifests/ directory',
              params: [
                {
                  description: 'the fully qualified image name to be verified',
                  name: 'IMAGE_URL',
                  type: 'string',
                },
                {
                  description: 'image digest',
                  name: 'IMAGE_DIGEST',
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
                  env: [
                    {
                      name: 'IMAGE_URL',
                      value:
                        'quay.io/redhat-appstudio/user-workload:on-pr-36e49113fc391cc1a4723afb0269a88c9e54608d',
                    },
                    {
                      name: 'IMAGE_DIGEST',
                      value:
                        'sha256:02d4920c04cad24ef1a8058bc31f08a76182e80cc8288712ea764ce45e3406b1',
                    },
                  ],
                  image:
                    'quay.io/redhat-appstudio/hacbs-test:v1.0.11@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
                  name: 'sbom-json-check',
                  resources: {},
                  script:
                    '#!/usr/bin/env bash\nsource /utils.sh\n\nmkdir /manifests/ && cd /manifests/\n\nimage_with_digest="${IMAGE_URL}@${IMAGE_DIGEST}"\n\nif ! oc image extract "${image_with_digest}" --path \'/root/buildinfo/content_manifests/*:/manifests/\'; then\n  echo "Failed to extract manifests from image ${image_with_digest}"\nfi\n\ntouch fail_result.txt\nif [ -f "sbom-cyclonedx.json" ]\nthen\n  result=$(echo -n $(cyclonedx-linux-x64 validate --input-file sbom-cyclonedx.json))\n  if [[ ! $result =~ "BOM validated successfully" ]]\n  then\n    echo "sbom-cyclonedx.json: $result" > fail_result.txt\n  fi\nelse\n  echo "cannot access \'sbom-cyclonedx.json\': No such file or directory" > fail_result.txt\nfi\n\nFAIL_RESULTS="$(cat fail_result.txt)"\nif [[ -z $FAIL_RESULTS ]]\nthen\n  TEST_OUTPUT=$(make_result_json -r "SUCCESS" -s 1)\nelse\n  echo "Fail to verify sbom-cyclonedx.json for image $IMAGE_URL with reason: $FAIL_RESULTS"\n  HACBS_ERROR_OUTPUT=$(make_result_json -r "FAILURE" -f 1)\nfi\n\necho "${TEST_OUTPUT:-${HACBS_ERROR_OUTPUT}}" | tee /tekton/results/TEST_OUTPUT\n',
                  securityContext: {
                    capabilities: {
                      add: ['SETFCAP'],
                    },
                    runAsUser: 0,
                  },
                  volumeMounts: [
                    {
                      mountPath: '/shared',
                      name: 'shared',
                    },
                  ],
                },
              ],
              volumes: [
                {
                  emptyDir: {},
                  name: 'shared',
                },
              ],
            },
            reason: 'Succeeded',
            duration: '27s',
            testFailCount: 0,
            testWarnCount: 0,
          },
          steps: [
            {
              duration: '12 seconds',
              name: 'sbom-json-check',
              status: 'Succeeded',
            },
          ],
        },
      ],
      workspaces: [
        {
          name: 'workspace',
        },
        {
          name: 'git-auth',
          optional: true,
        },
      ],
    },
    skippedTasks: [
      {
        name: 'prefetch-dependencies',
        reason: 'When Expressions evaluated to false',
        whenExpressions: [
          {
            input: 'false',
            operator: 'in',
            values: ['true'],
          },
        ],
      },
      {
        name: 'sast-snyk-check',
        reason: 'When Expressions evaluated to false',
        whenExpressions: [
          {
            input: 'false',
            operator: 'in',
            values: ['false'],
          },
          {
            input: '',
            operator: 'notin',
            values: [''],
          },
        ],
      },
    ],
    startTime: '2023-03-16T00:50:29Z',
    taskRuns: {
      'human-resources-clkq-on-pull-request-xn5nd-clone-repository': {
        pipelineTaskName: 'clone-repository',
        status: {
          completionTime: '2023-03-16T00:52:09Z',
          conditions: [
            {
              lastTransitionTime: '2023-03-16T00:52:09Z',
              message: 'All Steps have completed executing',
              reason: 'Succeeded',
              status: 'True',
              type: 'Succeeded',
            },
          ],
          podName: 'human-resources-clkq-on-pull-request-xn5nd-clone-repository-pod',
          startTime: '2023-03-16T00:51:38Z',
          steps: [
            {
              container: 'step-clone',
              imageID:
                'registry.redhat.io/openshift-pipelines/pipelines-git-init-rhel8@sha256:2fa0b06d52b04f377c696412e19307a9eff27383f81d87aae0b4f71672a1cd0b',
              name: 'clone',
              terminated: {
                containerID:
                  'cri-o://a0ef629c17b8b42bff2c8f80c74738cdc4ea324ebe682e7e861caadd43e0ddea',
                exitCode: 0,
                finishedAt: '2023-03-16T00:52:07Z',
                message:
                  '[{"key":"commit","value":"36e49113fc391cc1a4723afb0269a88c9e54608d","type":1},{"key":"url","value":"https://github.com/test-repo/human-resources","type":1}]',
                reason: 'Completed',
                startedAt: '2023-03-16T00:52:07Z',
              },
            },
          ],
          results: [
            {
              name: 'commit',
              type: 'string',
              value: '36e49113fc391cc1a4723afb0269a88c9e54608d',
            },
            {
              name: 'url',
              type: 'string',
              value: 'https://github.com/test-repo/human-resources',
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
                  'registry.redhat.io/openshift-pipelines/pipelines-git-init-rhel8:v1.8.2-8@sha256:a538c423e7a11aae6ae582a411fdb090936458075f99af4ce5add038bb6983e8',
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
                type: 'string',
              },
              {
                description: 'The precise URL that was fetched by this Task.',
                name: 'url',
                type: 'string',
              },
            ],
            steps: [
              {
                env: [
                  {
                    name: 'HOME',
                    value: '/tekton/home',
                  },
                  {
                    name: 'PARAM_URL',
                    value: 'https://github.com/test-repo/human-resources',
                  },
                  {
                    name: 'PARAM_REVISION',
                    value: '36e49113fc391cc1a4723afb0269a88c9e54608d',
                  },
                  {
                    name: 'PARAM_REFSPEC',
                  },
                  {
                    name: 'PARAM_SUBMODULES',
                    value: 'true',
                  },
                  {
                    name: 'PARAM_DEPTH',
                    value: '1',
                  },
                  {
                    name: 'PARAM_SSL_VERIFY',
                    value: 'true',
                  },
                  {
                    name: 'PARAM_SUBDIRECTORY',
                  },
                  {
                    name: 'PARAM_DELETE_EXISTING',
                    value: 'true',
                  },
                  {
                    name: 'PARAM_HTTP_PROXY',
                  },
                  {
                    name: 'PARAM_HTTPS_PROXY',
                  },
                  {
                    name: 'PARAM_NO_PROXY',
                  },
                  {
                    name: 'PARAM_VERBOSE',
                    value: 'true',
                  },
                  {
                    name: 'PARAM_SPARSE_CHECKOUT_DIRECTORIES',
                  },
                  {
                    name: 'PARAM_USER_HOME',
                    value: '/tekton/home',
                  },
                  {
                    name: 'WORKSPACE_OUTPUT_PATH',
                    value: '/workspace/output',
                  },
                  {
                    name: 'WORKSPACE_SSH_DIRECTORY_BOUND',
                    value: 'false',
                  },
                  {
                    name: 'WORKSPACE_SSH_DIRECTORY_PATH',
                  },
                  {
                    name: 'WORKSPACE_BASIC_AUTH_DIRECTORY_BOUND',
                    value: 'true',
                  },
                  {
                    name: 'WORKSPACE_BASIC_AUTH_DIRECTORY_PATH',
                    value: '/workspace/basic-auth',
                  },
                ],
                image:
                  'registry.redhat.io/openshift-pipelines/pipelines-git-init-rhel8:v1.8.2-8@sha256:a538c423e7a11aae6ae582a411fdb090936458075f99af4ce5add038bb6983e8',
                name: 'clone',
                resources: {},
                script:
                  '#!/usr/bin/env sh\nset -eu\n\nif [ "${PARAM_VERBOSE}" = "true" ] ; then\n  set -x\nfi\n\nif [ "${WORKSPACE_BASIC_AUTH_DIRECTORY_BOUND}" = "true" ] ; then\n  cp "${WORKSPACE_BASIC_AUTH_DIRECTORY_PATH}/.git-credentials" "${PARAM_USER_HOME}/.git-credentials"\n  cp "${WORKSPACE_BASIC_AUTH_DIRECTORY_PATH}/.gitconfig" "${PARAM_USER_HOME}/.gitconfig"\n  chmod 400 "${PARAM_USER_HOME}/.git-credentials"\n  chmod 400 "${PARAM_USER_HOME}/.gitconfig"\nfi\n\nif [ "${WORKSPACE_SSH_DIRECTORY_BOUND}" = "true" ] ; then\n  cp -R "${WORKSPACE_SSH_DIRECTORY_PATH}" "${PARAM_USER_HOME}"/.ssh\n  chmod 700 "${PARAM_USER_HOME}"/.ssh\n  chmod -R 400 "${PARAM_USER_HOME}"/.ssh/*\nfi\n\nCHECKOUT_DIR="${WORKSPACE_OUTPUT_PATH}/${PARAM_SUBDIRECTORY}"\n\ncleandir() {\n  # Delete any existing contents of the repo directory if it exists.\n  #\n  # We don\'t just "rm -rf ${CHECKOUT_DIR}" because ${CHECKOUT_DIR} might be "/"\n  # or the root of a mounted volume.\n  if [ -d "${CHECKOUT_DIR}" ] ; then\n    # Delete non-hidden files and directories\n    rm -rf "${CHECKOUT_DIR:?}"/*\n    # Delete files and directories starting with . but excluding ..\n    rm -rf "${CHECKOUT_DIR}"/.[!.]*\n    # Delete files and directories starting with .. plus any other character\n    rm -rf "${CHECKOUT_DIR}"/..?*\n  fi\n}\n\nif [ "${PARAM_DELETE_EXISTING}" = "true" ] ; then\n  cleandir\nfi\n\ntest -z "${PARAM_HTTP_PROXY}" || export HTTP_PROXY="${PARAM_HTTP_PROXY}"\ntest -z "${PARAM_HTTPS_PROXY}" || export HTTPS_PROXY="${PARAM_HTTPS_PROXY}"\ntest -z "${PARAM_NO_PROXY}" || export NO_PROXY="${PARAM_NO_PROXY}"\n\n/ko-app/git-init \\\n  -url="${PARAM_URL}" \\\n  -revision="${PARAM_REVISION}" \\\n  -refspec="${PARAM_REFSPEC}" \\\n  -path="${CHECKOUT_DIR}" \\\n  -sslVerify="${PARAM_SSL_VERIFY}" \\\n  -submodules="${PARAM_SUBMODULES}" \\\n  -depth="${PARAM_DEPTH}" \\\n  -sparseCheckoutDirectories="${PARAM_SPARSE_CHECKOUT_DIRECTORIES}"\ncd "${CHECKOUT_DIR}"\nRESULT_SHA="$(git rev-parse HEAD)"\nEXIT_CODE="$?"\nif [ "${EXIT_CODE}" != 0 ] ; then\n  exit "${EXIT_CODE}"\nfi\nprintf "%s" "${RESULT_SHA}" > "/tekton/results/commit"\nprintf "%s" "${PARAM_URL}" > "/tekton/results/url"\n',
                securityContext: {
                  runAsUser: 0,
                },
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
            input: 'true',
            operator: 'in',
            values: ['true'],
          },
        ],
      },
      'hum1e2c0e3126f75d552fc611f4aeae38ab-deprecated-base-image-check': {
        pipelineTaskName: 'deprecated-base-image-check',
        status: {
          completionTime: '2023-03-16T01:00:58Z',
          conditions: [
            {
              lastTransitionTime: '2023-03-16T01:00:58Z',
              message: 'All Steps have completed executing',
              reason: 'Succeeded',
              status: 'True',
              type: 'Succeeded',
            },
          ],
          podName: 'hum1e2c0e3126f75d552fc611f4f0ccc1dc7f27d9497ffe55c45a54436c-pod',
          startTime: '2023-03-16T01:00:10Z',
          steps: [
            {
              container: 'step-query-pyxis',
              imageID:
                'registry.access.redhat.com/ubi8/ubi-minimal@sha256:ab03679e683010d485ef0399e056b09a38d7843ba4a36ee7dec337dd0037f7a7',
              name: 'query-pyxis',
              terminated: {
                containerID:
                  'cri-o://75f0f975e629f41f9b9a9f3ab4cf466c53a7e7b360e5580658b645c0e3c1682f',
                exitCode: 0,
                finishedAt: '2023-03-16T01:00:56Z',
                message:
                  '[{"key":"PYXIS_HTTP_CODE","value":"404 docker.io library/openjdk\\n404 quay.io devfile/maven\\n","type":1}]',
                reason: 'Completed',
                startedAt: '2023-03-16T01:00:55Z',
              },
            },
            {
              container: 'step-run-conftest',
              imageID:
                'quay.io/redhat-appstudio/hacbs-test@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
              name: 'run-conftest',
              terminated: {
                containerID:
                  'cri-o://9a25c1206064cde2c38a6499d35cb764cfb82bffddaef706246117905a0b7156',
                exitCode: 0,
                finishedAt: '2023-03-16T01:00:56Z',
                message:
                  '[{"key":"TEST_OUTPUT","value":"{\\"result\\":\\"ERROR\\",\\"timestamp\\":\\"1678928456\\",\\"note\\":\\"For more details please visit the logs in workspace of Tekton tasks.\\",\\"namespace\\":\\"required_checks\\",\\"successes\\":0,\\"failures\\":0,\\"warnings\\":0}\\n","type":1},{"key":"PYXIS_HTTP_CODE","value":"404 docker.io library/openjdk\\n404 quay.io devfile/maven\\n","type":1}]',
                reason: 'Completed',
                startedAt: '2023-03-16T01:00:56Z',
              },
            },
          ],
          results: [
            {
              name: 'PYXIS_HTTP_CODE',
              type: 'string',
              value: '404 docker.io library/openjdk\n404 quay.io devfile/maven\n',
            },
            {
              name: 'TEST_OUTPUT',
              type: 'string',
              value:
                '{"result":"ERROR","timestamp":"1678928456","note":"For more details please visit the logs in workspace of Tekton tasks.","namespace":"required_checks","successes":0,"failures":0,"warnings":0}\n',
            },
          ],
          taskSpec: {
            params: [
              {
                default: '/project/repository/',
                description: 'Path to the directory containing conftest policies',
                name: 'POLICY_DIR',
                type: 'string',
              },
              {
                default: 'required_checks',
                description: 'Namespace for the conftest policy',
                name: 'POLICY_NAMESPACE',
                type: 'string',
              },
              {
                description: 'Digests of the base images used for build',
                name: 'BASE_IMAGES_DIGESTS',
                type: 'string',
              },
            ],
            results: [
              {
                description: 'HTTP code returned by Pyxis API endpoint',
                name: 'PYXIS_HTTP_CODE',
                type: 'string',
              },
              {
                description: 'Test output',
                name: 'TEST_OUTPUT',
                type: 'string',
              },
            ],
            steps: [
              {
                env: [
                  {
                    name: 'BASE_IMAGES_DIGESTS',
                    value:
                      'docker.io/library/openjdk:11-jdk@sha256:99bac5bf83633e3c7399aed725c8415e7b569b54e03e4599e580fc9cdb7c21ab\nquay.io/devfile/maven:3.8.1-openjdk-17-slim@sha256:a65cb519660f51b06f487a6f5de8c264e1e2bcdb32033f3f45b0899f7740ca0f\n',
                  },
                ],
                image:
                  'registry.access.redhat.com/ubi8/ubi-minimal:8.7-1085@sha256:dc06ba83c6f47fc0a2bca516a9b99f1cf8ef37331fd460f4ca55579a815ee6cb',
                name: 'query-pyxis',
                resources: {},
                script:
                  '#!/usr/bin/env bash\nreadarray -t IMAGE_ARRAY < <(echo -n "$BASE_IMAGES_DIGESTS" | sed \'s/\\\\n/\\\'$\'\\n\'\'/g\')\nfor BASE_IMAGE in ${IMAGE_ARRAY[@]};\ndo\n  IFS=:\'/\' read -r IMAGE_REGISTRY IMAGE_WITH_TAG <<< $BASE_IMAGE; echo "[$IMAGE_REGISTRY] [$IMAGE_WITH_TAG]"\n  IMAGE_REPOSITORY=`echo $IMAGE_WITH_TAG | cut -d ":" -f1`\n  IMAGE_REGISTRY=${IMAGE_REGISTRY//registry.redhat.io/registry.access.redhat.com}\n  export IMAGE_REPO_PATH=/workspace/sanity-ws/${IMAGE_REPOSITORY}\n  mkdir -p ${IMAGE_REPO_PATH}\n  echo "Querying Pyxis for $BASE_IMAGE..."\n  http_code=$(curl -s -k -o ${IMAGE_REPO_PATH}/repository_data.json -w \'%{http_code}\' "https://catalog.redhat.com/api/containers/v1/repositories/registry/${IMAGE_REGISTRY}/repository/${IMAGE_REPOSITORY}")\n  echo "Response code: $http_code"\n  echo $http_code $IMAGE_REGISTRY $IMAGE_REPOSITORY>> /tekton/results/PYXIS_HTTP_CODE\ndone\n',
              },
              {
                env: [
                  {
                    name: 'POLICY_DIR',
                    value: '/project/repository/',
                  },
                  {
                    name: 'POLICY_NAMESPACE',
                    value: 'required_checks',
                  },
                ],
                image:
                  'quay.io/redhat-appstudio/hacbs-test:v1.0.11@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
                name: 'run-conftest',
                resources: {},
                script:
                  '#!/usr/bin/env sh\nsource /utils.sh\n\nsuccess_counter=0\nfailure_counter=0\nerror_counter=0\nif [ ! -f /tekton/results/PYXIS_HTTP_CODE ]; then\n  error_counter=$((error_counter++))\nfi\nwhile IFS= read -r line\ndo\n  IFS=:\' \' read -r http_code IMAGE_REGISTRY IMAGE_REPOSITORY <<< $line; echo "[$http_code] [$IMAGE_REGISTRY] [$IMAGE_REPOSITORY]"\n  export IMAGE_REPO_PATH=/workspace/sanity-ws/${IMAGE_REPOSITORY}\n  if [ "$http_code" == "200" ];\n  then\n    echo "Running conftest using $POLICY_DIR policy, $POLICY_NAMESPACE namespace"\n    /usr/bin/conftest test --no-fail ${IMAGE_REPO_PATH}/repository_data.json \\\n    --policy $POLICY_DIR --namespace $POLICY_NAMESPACE \\\n    --output=json 2> ${IMAGE_REPO_PATH}/stderr.txt | tee ${IMAGE_REPO_PATH}/deprecated_image_check_output.json\n\n    failure_counter=$((failure_counter+$(jq -r \'.[].failures|length\' ${IMAGE_REPO_PATH}/deprecated_image_check_output.json)))\n    success_counter=$((success_counter+$(jq -r \'.[].successes\' ${IMAGE_REPO_PATH}/deprecated_image_check_output.json)))\n\n  elif [ "$http_code" == "404" ];\n  then\n    echo "Registry/image ${IMAGE_REGISTRY}/${IMAGE_REPOSITORY} not found in Pyxis" >> /workspace/sanity-ws/stderr.txt\n    cat /workspace/sanity-ws/stderr.txt\n  else\n    echo "Unexpected error (HTTP code $http_code) occured for registry/image ${IMAGE_REGISTRY}/${IMAGE_REPOSITORY}" >> /workspace/sanity-ws/stderr.txt\n    cat /workspace/sanity-ws/stderr.txt\n    error_counter=$((error_counter++))\n    exit 0\n  fi\ndone < /tekton/results/PYXIS_HTTP_CODE\n\nHACBS_ERROR_OUTPUT=$(make_result_json -r ERROR -n "$POLICY_NAMESPACE")\nif [[ "$error_counter" == 0 && "$success_counter" > 0 ]];\nthen\n  if [[ "${failure_counter}" -gt 0 ]]; then RES="FAILURE"; else RES="SUCCESS"; fi\n  TEST_OUTPUT=$(make_result_json \\\n    -r "${RES}" -n "$POLICY_NAMESPACE" \\\n    -s "${success_counter}" -f "${failure_counter}")\nfi\necho "${TEST_OUTPUT:-${HACBS_ERROR_OUTPUT}}" | tee /tekton/results/TEST_OUTPUT\n',
              },
            ],
            workspaces: [
              {
                name: 'sanity-ws',
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
      'human-resources-clkq-on-pull-request-xn5nd-sanity-inspect-image': {
        pipelineTaskName: 'sanity-inspect-image',
        status: {
          completionTime: '2023-03-16T01:01:05Z',
          conditions: [
            {
              lastTransitionTime: '2023-03-16T01:01:05Z',
              message: 'All Steps have completed executing',
              reason: 'Succeeded',
              status: 'True',
              type: 'Succeeded',
            },
          ],
          podName: 'human-resources-clkq-on-puld10ceb6b41a43f87c789f6c0c52d53d1-pod',
          startTime: '2023-03-16T01:00:09Z',
          steps: [
            {
              container: 'step-inspect-image',
              imageID:
                'quay.io/redhat-appstudio/hacbs-test@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
              name: 'inspect-image',
              terminated: {
                containerID:
                  'cri-o://2ea94f5301f580327020918eb824be3b09030c169f60578abd32ebc326a7cdbe',
                exitCode: 0,
                finishedAt: '2023-03-16T01:01:04Z',
                message:
                  '[{"key":"BASE_IMAGE","value":"docker.io/library/openjdk@sha256:e81b7f317654b0f26d3993e014b04bcb29250339b11b9de41e130feecd4cd43c","type":1},{"key":"BASE_IMAGE_REPOSITORY","value":"library/openjdk","type":1},{"key":"TEST_OUTPUT","value":"{\\"result\\":\\"SUCCESS\\",\\"timestamp\\":\\"1678928464\\",\\"note\\":\\"For more details please visit the logs in workspace of Tekton tasks.\\",\\"namespace\\":\\"default\\",\\"successes\\":1,\\"failures\\":0,\\"warnings\\":0}\\n","type":1}]',
                reason: 'Completed',
                startedAt: '2023-03-16T01:01:02Z',
              },
            },
          ],
          results: [
            {
              name: 'BASE_IMAGE',
              type: 'string',
              value:
                'docker.io/library/openjdk@sha256:e81b7f317654b0f26d3993e014b04bcb29250339b11b9de41e130feecd4cd43c',
            },
            {
              name: 'BASE_IMAGE_REPOSITORY',
              type: 'string',
              value: 'library/openjdk',
            },
            {
              name: 'TEST_OUTPUT',
              type: 'string',
              value:
                '{"result":"SUCCESS","timestamp":"1678928464","note":"For more details please visit the logs in workspace of Tekton tasks.","namespace":"default","successes":1,"failures":0,"warnings":0}\n',
            },
          ],
          taskSpec: {
            description: 'Get manifest data for the source image and its base image to workspace',
            params: [
              {
                description: 'the fully qualified image name',
                name: 'IMAGE_URL',
                type: 'string',
              },
              {
                description: 'image digest',
                name: 'IMAGE_DIGEST',
                type: 'string',
              },
              {
                description: 'secret with config.json for container auth',
                name: 'DOCKER_AUTH',
                type: 'string',
              },
            ],
            results: [
              {
                description: 'Base image the source image is built from',
                name: 'BASE_IMAGE',
                type: 'string',
              },
              {
                description: 'Base image repository URL',
                name: 'BASE_IMAGE_REPOSITORY',
                type: 'string',
              },
              {
                description: 'Test output',
                name: 'TEST_OUTPUT',
                type: 'string',
              },
            ],
            steps: [
              {
                env: [
                  {
                    name: 'DOCKER_CONFIG',
                    value: '/secrets/registry-auth',
                  },
                  {
                    name: 'IMAGE_URL',
                    value:
                      'quay.io/redhat-appstudio/user-workload:on-pr-36e49113fc391cc1a4723afb0269a88c9e54608d',
                  },
                  {
                    name: 'IMAGE_DIGEST',
                    value:
                      'sha256:02d4920c04cad24ef1a8058bc31f08a76182e80cc8288712ea764ce45e3406b1',
                  },
                ],
                image:
                  'quay.io/redhat-appstudio/hacbs-test:v1.0.11@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
                name: 'inspect-image',
                resources: {},
                script:
                  '#!/usr/bin/env bash\nsource /utils.sh\nIMAGE_INSPECT=image_inspect.json\nBASE_IMAGE_INSPECT=base_image_inspect.json\nRAW_IMAGE_INSPECT=raw_image_inspect.json\n\nIMAGE_URL="${IMAGE_URL}@${IMAGE_DIGEST}"\n# Given a tag and a the digest in the IMAGE_URL we opt to use the digest alone\n# this is because containers/image currently doesn\'t support image references\n# that contain both. See https://github.com/containers/image/issues/1736\nif [[ "${IMAGE_URL}" == *":"*"@"* ]]; then\n  IMAGE_URL="${IMAGE_URL/:*@/@}"\nfi\necho "Inspecting manifest for source image ${IMAGE_URL}"\nskopeo inspect --no-tags docker://"${IMAGE_URL}" > $IMAGE_INSPECT 2> stderr.txt || true\nskopeo inspect --no-tags --raw docker://"${IMAGE_URL}" > $RAW_IMAGE_INSPECT 2>> stderr.txt || true\n\nif [ ! -z $(cat stderr.txt) ]; then\n  echo "skopeo inspect fails, the sanity-inspect-image test meets the following error:"\n  cat stderr.txt\n  TEST_OUTPUT="$(make_result_json -r ERROR -t \'skopeo inspect meets errors\')"\n  echo "${TEST_OUTPUT}" | tee /tekton/results/TEST_OUTPUT\n  exit 0\nfi\necho "Getting base image manifest for source image ${IMAGE_URL}"\nBASE_IMAGE_NAME="$(jq -r ".annotations.\\"org.opencontainers.image.base.name\\"" $RAW_IMAGE_INSPECT)"\nBASE_IMAGE_DIGEST="$(jq -r ".annotations.\\"org.opencontainers.image.base.digest\\"" $RAW_IMAGE_INSPECT)"\nif [ $BASE_IMAGE_NAME == \'null\' ]; then\n  echo "Cannot get base image info from \'annotations\'"\n  echo "Trying to get base image info from \'Labels\'"\n  BASE_IMAGE_NAME="$(jq -r ".Labels.\\"org.opencontainers.image.base.name\\"" $IMAGE_INSPECT)"\n  BASE_IMAGE_DIGEST="$(jq -r ".annotations.\\"org.opencontainers.image.base.digest\\"" $IMAGE_INSPECT)"\n  if [ "$BASE_IMAGE_NAME" == \'null\' ]; then\n    echo "Cannot get base image info from \'Labels\', please check the source image ${IMAGE_URL}"\n    exit 0\n  fi\nfi\nif [ -z "$BASE_IMAGE_NAME" ]; then\n  echo "Source image ${IMAGE_URL} is built from scratch, so there is no base image"\n  exit 0\nfi\nBASE_IMAGE="${BASE_IMAGE_NAME%:*}@$BASE_IMAGE_DIGEST"\necho "The base image is $BASE_IMAGE, get its manifest now"\nskopeo inspect --no-tags docker://$BASE_IMAGE  > $BASE_IMAGE_INSPECT || true\necho -n "$BASE_IMAGE" | tee /tekton/results/BASE_IMAGE\n\nBASE_IMAGE_REPOSITORY="$(jq -r \'.Name | sub("[^/]+/"; "") | sub("[:@].*"; "")\' "$BASE_IMAGE_INSPECT")"\necho -n "$BASE_IMAGE_REPOSITORY" | tee /tekton/results/BASE_IMAGE_REPOSITORY\n\nTEST_OUTPUT="$(make_result_json -r SUCCESS -s 1)"\necho "${TEST_OUTPUT}" | tee /tekton/results/TEST_OUTPUT\n',
                securityContext: {
                  capabilities: {
                    add: ['SETFCAP'],
                  },
                  runAsUser: 0,
                },
                volumeMounts: [
                  {
                    mountPath: '/secrets/registry-auth',
                    name: 'registry-auth',
                  },
                ],
                workingDir: '/workspace/source/hacbs/sanity-inspect-image',
              },
            ],
            volumes: [
              {
                name: 'registry-auth',
                secret: {
                  optional: true,
                  secretName: 'human-resources-clkq-on-pull-request-xn5nd',
                },
              },
            ],
            workspaces: [
              {
                name: 'source',
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
      'human-resources-clkq-on-pull-request-xn5nd-clair-scan': {
        pipelineTaskName: 'clair-scan',
        status: {
          completionTime: '2023-03-16T01:01:13Z',
          conditions: [
            {
              lastTransitionTime: '2023-03-16T01:01:13Z',
              message: 'All Steps have completed executing',
              reason: 'Succeeded',
              status: 'True',
              type: 'Succeeded',
            },
          ],
          podName: 'human-resources-clkq-on-pull-request-xn5nd-clair-scan-pod',
          startTime: '2023-03-16T01:00:11Z',
          steps: [
            {
              container: 'step-get-vulnerabilities',
              imageID:
                'quay.io/redhat-appstudio/clair-in-ci@sha256:dfdcbdd61bb36a23b1675b8490e248323104fb04af1f30ebfba04efc382fe167',
              name: 'get-vulnerabilities',
              terminated: {
                containerID:
                  'cri-o://d70018a30bccee9c8dd997de3c1d51708a19da4f3bfc8709fe7366e029f3a35c',
                exitCode: 0,
                finishedAt: '2023-03-16T01:01:10Z',
                reason: 'Completed',
                startedAt: '2023-03-16T01:00:31Z',
              },
            },
            {
              container: 'step-conftest-vulnerabilities',
              imageID:
                'quay.io/redhat-appstudio/hacbs-test@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
              name: 'conftest-vulnerabilities',
              terminated: {
                containerID:
                  'cri-o://4663a332f0e18ef47c572d2d59a7296f92414c50d1d0faa5856f91388fe5d110',
                exitCode: 0,
                finishedAt: '2023-03-16T01:01:11Z',
                reason: 'Completed',
                startedAt: '2023-03-16T01:01:11Z',
              },
            },
            {
              container: 'step-test-format-result',
              imageID:
                'quay.io/redhat-appstudio/hacbs-test@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
              name: 'test-format-result',
              terminated: {
                containerID:
                  'cri-o://21cec6cf1d2fd36c879d6088ffe3c813be9254dfb71b7a7de69e3d7897ee25e7',
                exitCode: 0,
                finishedAt: '2023-03-16T01:01:11Z',
                message:
                  '[{"key":"SCAN_OUTPUT","value":"{\\"vulnerabilities\\":{\\"critical\\":1,\\"high\\":1,\\"medium\\":1,\\"low\\":1}}\\n","type":1},{"key":"TEST_OUTPUT","value":"{\\"result\\":\\"SUCCESS\\",\\"timestamp\\":\\"1678928471\\",\\"note\\":\\"Please refer to result SCAN_OUTPUT for the vulnerabilities scanned by clair\\",\\"namespace\\":\\"default\\",\\"successes\\":0,\\"failures\\":0,\\"warnings\\":0}\\n","type":1}]',
                reason: 'Completed',
                startedAt: '2023-03-16T01:01:11Z',
              },
            },
          ],
          results: [
            {
              name: 'SCAN_OUTPUT',
              type: 'string',
              value: '{"vulnerabilities":{"critical":1,"high":1,"medium":1,"low":1}}\n',
            },
            {
              name: 'TEST_OUTPUT',
              type: 'string',
              value:
                '{"result":"SUCCESS","timestamp":"1678928471","note":"Please refer to result SCAN_OUTPUT for the vulnerabilities scanned by clair","namespace":"default","successes":0,"failures":0,"warnings":0}\n',
            },
          ],
          taskSpec: {
            params: [
              {
                description: 'Image digest to scan',
                name: 'image-digest',
                type: 'string',
              },
              {
                description: 'Url to image',
                name: 'image-url',
                type: 'string',
              },
              {
                default: '',
                description: 'folder with config.json for container auth',
                name: 'docker-auth',
                type: 'string',
              },
            ],
            results: [
              {
                description: 'test output',
                name: 'TEST_OUTPUT',
                type: 'string',
              },
              {
                description: 'clair scan result',
                name: 'SCAN_OUTPUT',
                type: 'string',
              },
            ],
            steps: [
              {
                env: [
                  {
                    name: 'DOCKER_CONFIG',
                    value: 'human-resources-clkq-on-pull-request-xn5nd',
                  },
                  {
                    name: 'IMAGE_URL',
                    value:
                      'quay.io/redhat-appstudio/user-workload:on-pr-36e49113fc391cc1a4723afb0269a88c9e54608d',
                  },
                  {
                    name: 'IMAGE_DIGEST',
                    value:
                      'sha256:02d4920c04cad24ef1a8058bc31f08a76182e80cc8288712ea764ce45e3406b1',
                  },
                ],
                image: 'quay.io/redhat-appstudio/clair-in-ci:latest',
                imagePullPolicy: 'Always',
                name: 'get-vulnerabilities',
                resources: {},
                script:
                  '#!/usr/bin/env bash\n\nimagewithouttag=$(echo $IMAGE_URL | sed "s/\\(.*\\):.*/\\1/" | tr -d \'\\n\')\n# strip new-line escape symbol from parameter and save it to variable\nimageanddigest=$(echo $imagewithouttag@$IMAGE_DIGEST)\n\nclair-action report --image-ref=$imageanddigest --db-path=/tmp/matcher.db --format=quay > /tekton/home/clair-result.json || true\n',
              },
              {
                image:
                  'quay.io/redhat-appstudio/hacbs-test:v1.0.11@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
                name: 'conftest-vulnerabilities',
                resources: {},
                script:
                  'if [ ! -s /tekton/home/clair-result.json ]; then\n  echo "Previous step [get-vulnerabilities] failed, /tekton/home/clair-result.json is empty."\nelse\n  /usr/bin/conftest test --no-fail /tekton/home/clair-result.json \\\n  --policy /project/clair/vulnerabilities-check.rego --namespace required_checks \\\n  --output=json | tee /tekton/home/clair-vulnerabilities.json || true\nfi\n',
                securityContext: {
                  capabilities: {
                    add: ['SETFCAP'],
                  },
                },
              },
              {
                image:
                  'quay.io/redhat-appstudio/hacbs-test:v1.0.11@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
                name: 'test-format-result',
                resources: {},
                script:
                  '#!/usr/bin/env bash\n. /utils.sh\n\nif [[ ! -f /tekton/home/clair-vulnerabilities.json ]] || [[ "$(jq \'.[] | has("failures")\' /tekton/home/clair-vulnerabilities.json)" == "false" ]]; then\n  TEST_OUTPUT=$(make_result_json -r "ERROR" -t "/tekton/home/clair-vulnerabilities.json is not generated correctly, please check again")\n  echo "/tekton/home/clair-vulnerabilities.json is not generated correctly, please check again"\n  echo "${TEST_OUTPUT}" | tee /tekton/results/TEST_OUTPUT\n  exit 0\nfi\n\njq -rce \\\n  \'{vulnerabilities:{\n      critical: (.[] | .failures | map(select(.metadata.details.name=="clair_critical_vulnerabilities")) | length),\n      high: (.[] | .failures | map(select(.metadata.details.name=="clair_high_vulnerabilities")) | length),\n      medium: (.[] | .failures | map(select(.metadata.details.name=="clair_medium_vulnerabilities")) | length),\n      low: (.[] | .failures | map(select(.metadata.details.name=="clair_low_vulnerabilities")) | length)\n    }}\' /tekton/home/clair-vulnerabilities.json | tee /tekton/results/SCAN_OUTPUT\n\nTEST_OUTPUT=$(make_result_json -r "SUCCESS" -t "Please refer to result SCAN_OUTPUT for the vulnerabilities scanned by clair")\necho "${TEST_OUTPUT}" | tee /tekton/results/TEST_OUTPUT\n',
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
      'hum1e2c0e3126f75d552fc611f4aeae38ab-sanity-optional-label-check': {
        pipelineTaskName: 'sanity-optional-label-check',
        status: {
          completionTime: '2023-03-16T01:01:49Z',
          conditions: [
            {
              lastTransitionTime: '2023-03-16T01:01:49Z',
              message: 'All Steps have completed executing',
              reason: 'Succeeded',
              status: 'True',
              type: 'Succeeded',
            },
          ],
          podName: 'hum1e2c0e3126f75d552fc611f4c8c772f2af66f8c1e581d3afedf329de-pod',
          startTime: '2023-03-16T01:01:12Z',
          steps: [
            {
              container: 'step-basic-sanity-checks-required-labels',
              imageID:
                'quay.io/redhat-appstudio/hacbs-test@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
              name: 'basic-sanity-checks-required-labels',
              terminated: {
                containerID:
                  'cri-o://d1eddf6acc6de2730745f163eb02ab73281caa42c010203127347718ec2bcf47',
                exitCode: 0,
                finishedAt: '2023-03-16T01:01:48Z',
                message:
                  '[{"key":"TEST_OUTPUT","value":"{\\"result\\":\\"FAILURE\\",\\"timestamp\\":\\"1678928508\\",\\"note\\":\\"For more details please visit the logs in workspace of Tekton tasks.\\",\\"namespace\\":\\"optional_checks\\",\\"successes\\":5,\\"failures\\":2,\\"warnings\\":0}\\n","type":1}]',
                reason: 'Completed',
                startedAt: '2023-03-16T01:01:47Z',
              },
            },
          ],
          results: [
            {
              name: 'TEST_OUTPUT',
              type: 'string',
              value:
                '{"result":"FAILURE","timestamp":"1678928508","note":"For more details please visit the logs in workspace of Tekton tasks.","namespace":"optional_checks","successes":5,"failures":2,"warnings":0}\n',
            },
          ],
          taskSpec: {
            params: [
              {
                default: '/project/image/',
                description: 'Path to the directory containing conftest policies',
                name: 'POLICY_DIR',
                type: 'string',
              },
              {
                default: 'required_checks',
                description: 'Namespace for the conftest policy',
                name: 'POLICY_NAMESPACE',
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
                env: [
                  {
                    name: 'POLICY_NAMESPACE',
                    value: 'optional_checks',
                  },
                  {
                    name: 'POLICY_DIR',
                    value: '/project/image/',
                  },
                ],
                image:
                  'quay.io/redhat-appstudio/hacbs-test:v1.0.11@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
                name: 'basic-sanity-checks-required-labels',
                resources: {},
                script:
                  '#!/usr/bin/env bash\n\n. /utils.sh\nif [ ! -s ../sanity-inspect-image/image_inspect.json ]; then\n  echo "File ../sanity-inspect-image/image_inspect.json is not generated correctly, please check TEST_OUTPUT of task sanity-inspect-image"\n  TEST_OUTPUT="$(make_result_json -r ERROR -t \'File ../sanity-inspect-image/image_inspect.json is not generated correctly, please check TEST_OUTPUT of task sanity-inspect-image!\')"\n  echo "${TEST_OUTPUT}" | tee /tekton/results/TEST_OUTPUT\n  exit 0\nfi\n\nCONFTEST_OPTIONS=""\nif [ -s "../sanity-inspect-image/base_image_inspect.json" ]; then\n  CONFTEST_OPTIONS="-d=../sanity-inspect-image/base_image_inspect.json"\nfi\n\necho "Running conftest using $POLICY_DIR policy, $POLICY_NAMESPACE namespace"\n/usr/bin/conftest test --no-fail ../sanity-inspect-image/image_inspect.json "${CONFTEST_OPTIONS}" \\\n--policy $POLICY_DIR --namespace $POLICY_NAMESPACE \\\n--output=json 2> stderr.txt | tee sanity_label_check_output.json\n\nif [ ! -z $(cat stderr.txt) ]; then\n  echo "The sanity-label-check test meets the following error:"\n  cat stderr.txt\nfi\nHACBS_ERROR_OUTPUT=$(make_result_json -r "ERROR")\n\nTEST_OUTPUT=\nparse_hacbs_test_output sanity-label-check conftest sanity_label_check_output.json || true\n\necho "${TEST_OUTPUT:-${HACBS_ERROR_OUTPUT}}" | tee /tekton/results/TEST_OUTPUT\n',
                securityContext: {
                  capabilities: {
                    add: ['SETFCAP'],
                  },
                },
                workingDir: '/workspace/workspace/hacbs/sanity-label-check-optional_checks',
              },
            ],
            workspaces: [
              {
                name: 'workspace',
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
      'human-resources-clkq-on-pull-request-xn5nd-sanity-label-check': {
        pipelineTaskName: 'sanity-label-check',
        status: {
          completionTime: '2023-03-16T01:01:48Z',
          conditions: [
            {
              lastTransitionTime: '2023-03-16T01:01:48Z',
              message: 'All Steps have completed executing',
              reason: 'Succeeded',
              status: 'True',
              type: 'Succeeded',
            },
          ],
          podName: 'human-resources-clkq-on-pul79484532268420afcba1b4b3cc52c9cb-pod',
          startTime: '2023-03-16T01:01:12Z',
          steps: [
            {
              container: 'step-basic-sanity-checks-required-labels',
              imageID:
                'quay.io/redhat-appstudio/hacbs-test@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
              name: 'basic-sanity-checks-required-labels',
              terminated: {
                containerID:
                  'cri-o://ef2f450dcd00d67eba9f560155b91b3790a1c1d3925026c5fc4c12d60ae808cd',
                exitCode: 0,
                finishedAt: '2023-03-16T01:01:47Z',
                message:
                  '[{"key":"TEST_OUTPUT","value":"{\\"result\\":\\"FAILURE\\",\\"timestamp\\":\\"1678928507\\",\\"note\\":\\"For more details please visit the logs in workspace of Tekton tasks.\\",\\"namespace\\":\\"required_checks\\",\\"successes\\":8,\\"failures\\":13,\\"warnings\\":0}\\n","type":1}]',
                reason: 'Completed',
                startedAt: '2023-03-16T01:01:46Z',
              },
            },
          ],
          results: [
            {
              name: 'TEST_OUTPUT',
              type: 'string',
              value:
                '{"result":"FAILURE","timestamp":"1678928507","note":"For more details please visit the logs in workspace of Tekton tasks.","namespace":"required_checks","successes":8,"failures":13,"warnings":0}\n',
            },
          ],
          taskSpec: {
            params: [
              {
                default: '/project/image/',
                description: 'Path to the directory containing conftest policies',
                name: 'POLICY_DIR',
                type: 'string',
              },
              {
                default: 'required_checks',
                description: 'Namespace for the conftest policy',
                name: 'POLICY_NAMESPACE',
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
                env: [
                  {
                    name: 'POLICY_NAMESPACE',
                    value: 'required_checks',
                  },
                  {
                    name: 'POLICY_DIR',
                    value: '/project/image/',
                  },
                ],
                image:
                  'quay.io/redhat-appstudio/hacbs-test:v1.0.11@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
                name: 'basic-sanity-checks-required-labels',
                resources: {},
                script:
                  '#!/usr/bin/env bash\n\n. /utils.sh\nif [ ! -s ../sanity-inspect-image/image_inspect.json ]; then\n  echo "File ../sanity-inspect-image/image_inspect.json is not generated correctly, please check TEST_OUTPUT of task sanity-inspect-image"\n  TEST_OUTPUT="$(make_result_json -r ERROR -t \'File ../sanity-inspect-image/image_inspect.json is not generated correctly, please check TEST_OUTPUT of task sanity-inspect-image!\')"\n  echo "${TEST_OUTPUT}" | tee /tekton/results/TEST_OUTPUT\n  exit 0\nfi\n\nCONFTEST_OPTIONS=""\nif [ -s "../sanity-inspect-image/base_image_inspect.json" ]; then\n  CONFTEST_OPTIONS="-d=../sanity-inspect-image/base_image_inspect.json"\nfi\n\necho "Running conftest using $POLICY_DIR policy, $POLICY_NAMESPACE namespace"\n/usr/bin/conftest test --no-fail ../sanity-inspect-image/image_inspect.json "${CONFTEST_OPTIONS}" \\\n--policy $POLICY_DIR --namespace $POLICY_NAMESPACE \\\n--output=json 2> stderr.txt | tee sanity_label_check_output.json\n\nif [ ! -z $(cat stderr.txt) ]; then\n  echo "The sanity-label-check test meets the following error:"\n  cat stderr.txt\nfi\nHACBS_ERROR_OUTPUT=$(make_result_json -r "ERROR")\n\nTEST_OUTPUT=\nparse_hacbs_test_output sanity-label-check conftest sanity_label_check_output.json || true\n\necho "${TEST_OUTPUT:-${HACBS_ERROR_OUTPUT}}" | tee /tekton/results/TEST_OUTPUT\n',
                securityContext: {
                  capabilities: {
                    add: ['SETFCAP'],
                  },
                },
                workingDir: '/workspace/workspace/hacbs/sanity-label-check-required_checks',
              },
            ],
            workspaces: [
              {
                name: 'workspace',
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
      'human-resources-clkq-on-pull-request-xn5nd-init': {
        pipelineTaskName: 'init',
        status: {
          completionTime: '2023-03-16T00:50:57Z',
          conditions: [
            {
              lastTransitionTime: '2023-03-16T00:50:57Z',
              message: 'All Steps have completed executing',
              reason: 'Succeeded',
              status: 'True',
              type: 'Succeeded',
            },
          ],
          podName: 'human-resources-clkq-on-pull-request-xn5nd-init-pod',
          startTime: '2023-03-16T00:50:33Z',
          steps: [
            {
              container: 'step-init',
              imageID:
                'registry.redhat.io/openshift4/ose-tools-rhel8@sha256:253d042ecfad7b64593112a4aa3f528d39cb5fe738852e44f009db87964cf051',
              name: 'init',
              terminated: {
                containerID:
                  'cri-o://8dad7d0c8810dd2adf93e4e69215c88a366c03e23fdc5ff0ac2bcb556379c510',
                exitCode: 0,
                finishedAt: '2023-03-16T00:50:56Z',
                message:
                  '[{"key":"build","value":"true","type":1},{"key":"container-registry-secret","value":"human-resources-clkq-on-pull-request-xn5nd","type":1}]',
                reason: 'Completed',
                startedAt: '2023-03-16T00:50:55Z',
              },
            },
          ],
          results: [
            {
              name: 'build',
              type: 'string',
              value: 'true',
            },
            {
              name: 'container-registry-secret',
              type: 'string',
              value: 'human-resources-clkq-on-pull-request-xn5nd',
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
              {
                default: 'false',
                description: 'Rebuild the image if exists',
                name: 'rebuild',
                type: 'string',
              },
              {
                default: 'false',
                description: 'skip checks against built image',
                name: 'skip-checks',
                type: 'string',
              },
              {
                name: 'pipelinerun-name',
                type: 'string',
              },
              {
                name: 'pipelinerun-uid',
                type: 'string',
              },
              {
                default: 'redhat-appstudio-user-workload',
                name: 'shared-secret',
                type: 'string',
              },
            ],
            results: [
              {
                name: 'build',
                type: 'string',
              },
              {
                description: 'Name of secret with credentials',
                name: 'container-registry-secret',
                type: 'string',
              },
            ],
            steps: [
              {
                env: [
                  {
                    name: 'PIPELINERUN_NAME',
                    value: 'human-resources-clkq-on-pull-request-xn5nd',
                  },
                  {
                    name: 'PIPELINERUN_UID',
                    value: '014c3e9f-90e9-4cd4-83eb-f0fdd8fe6714',
                  },
                  {
                    name: 'IMAGE_URL',
                    value:
                      'quay.io/redhat-appstudio/user-workload:on-pr-36e49113fc391cc1a4723afb0269a88c9e54608d',
                  },
                  {
                    name: 'REBUILD',
                    value: 'false',
                  },
                  {
                    name: 'SKIP_CHECKS',
                    value: 'false',
                  },
                ],
                image:
                  'registry.redhat.io/openshift4/ose-tools-rhel8:v4.12@sha256:253d042ecfad7b64593112a4aa3f528d39cb5fe738852e44f009db87964cf051',
                name: 'init',
                resources: {},
                script:
                  '#!/bin/bash\necho "Build Initialize: $IMAGE_URL"\necho\necho "Create pipelinerun repository secret"\nSHARED=/secret/default-push-secret/.dockerconfigjson\nexport DOCKER_CONFIG=/tmp/docker/\nmkdir -p $DOCKER_CONFIG\nif [ -f $SHARED ]; then\n  jq -M -s \'.[0] * .[1]\' $SHARED /root/.docker/config.json > $DOCKER_CONFIG/config.json\nelse\n  cp /root/.docker/config.json $DOCKER_CONFIG/config.json\nfi\noc create secret generic --from-file=$DOCKER_CONFIG/config.json $SHARED_PARAM $PIPELINERUN_NAME\noc patch secret $PIPELINERUN_NAME -p "{\\"metadata\\": {\\"ownerReferences\\": [{\\"apiVersion\\": \\"tekton.dev/v1beta1\\", \\"blockOwnerDeletion\\": false, \\"controller\\": true, \\"kind\\": \\"PipelineRun\\", \\"name\\": \\"$PIPELINERUN_NAME\\", \\"uid\\": \\"$PIPELINERUN_UID\\" }]}}"\necho -n $PIPELINERUN_NAME > /tekton/results/container-registry-secret\n\necho "Determine if Image Already Exists"\n# Build the image when image does not exists or rebuild is set to true\nif ! oc image info $IMAGE_URL &>/dev/null || [ "$REBUILD" == "true" ] || [ "$SKIP_CHECKS" == "false" ]; then\n  echo -n "true" > /tekton/results/build\nelse\n  echo -n "false" > /tekton/results/build\nfi\n',
                volumeMounts: [
                  {
                    mountPath: '/secret/default-push-secret',
                    name: 'default-push-secret',
                  },
                ],
              },
            ],
            volumes: [
              {
                csi: {
                  driver: 'csi.sharedresource.openshift.io',
                  readOnly: true,
                  volumeAttributes: {
                    sharedSecret: 'redhat-appstudio-user-workload',
                  },
                },
                name: 'default-push-secret',
              },
            ],
          },
        },
      },
      'human-resources-clkq-on-pull-request-xn5nd-clamav-scan': {
        pipelineTaskName: 'clamav-scan',
        status: {
          completionTime: '2023-03-16T01:03:37Z',
          conditions: [
            {
              lastTransitionTime: '2023-03-16T01:03:37Z',
              message: 'All Steps have completed executing',
              reason: 'Succeeded',
              status: 'True',
              type: 'Succeeded',
            },
          ],
          podName: 'human-resources-clkq-on-pull-request-xn5nd-clamav-scan-pod',
          sidecars: [
            {
              container: 'sidecar-database',
              imageID:
                'quay.io/redhat-appstudio/clamav-db@sha256:bc7ef1caf8641569961cb2f6f8dd65ca7c4665455484587d85b9e24b96d295e9',
              name: 'database',
              terminated: {
                containerID:
                  'cri-o://8119fd062faba69ca2264e2b8bdac5edbe562bb3bf38bb8a496f4bfb5cfe6cc5',
                exitCode: 0,
                finishedAt: '2023-03-16T01:00:30Z',
                reason: 'Completed',
                startedAt: '2023-03-16T01:00:30Z',
              },
            },
          ],
          startTime: '2023-03-16T01:00:11Z',
          steps: [
            {
              container: 'step-extract-and-scan-image',
              imageID:
                'quay.io/redhat-appstudio/hacbs-test@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
              name: 'extract-and-scan-image',
              terminated: {
                containerID:
                  'cri-o://91d946998b032c81f1786551dbf46cf6276d20fbaa64d18dbca90b7a993f71e1',
                exitCode: 0,
                finishedAt: '2023-03-16T01:03:35Z',
                reason: 'Completed',
                startedAt: '2023-03-16T01:00:32Z',
              },
            },
            {
              container: 'step-modify-clam-output-to-json',
              imageID:
                'quay.io/redhat-appstudio/hacbs-test@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
              name: 'modify-clam-output-to-json',
              terminated: {
                containerID:
                  'cri-o://2ec6126681c18c25837069615d72cbf688aae202524418762819ab952f7b9878',
                exitCode: 0,
                finishedAt: '2023-03-16T01:03:36Z',
                reason: 'Completed',
                startedAt: '2023-03-16T01:03:36Z',
              },
            },
            {
              container: 'step-store-hacbs-test-output-result',
              imageID:
                'quay.io/redhat-appstudio/hacbs-test@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
              name: 'store-hacbs-test-output-result',
              terminated: {
                containerID:
                  'cri-o://35d66ce947c3931dbece1c79f2d1f177c28d62bd911a300be61555069d60de39',
                exitCode: 0,
                finishedAt: '2023-03-16T01:03:36Z',
                message:
                  '[{"key":"TEST_OUTPUT","value":"{\\"result\\":\\"SUCCESS\\",\\"timestamp\\":\\"1678928616\\",\\"note\\":\\"For more details please visit the logs in workspace of Tekton tasks.\\",\\"namespace\\":\\"default\\",\\"successes\\":1,\\"failures\\":0,\\"warnings\\":0}\\n","type":1}]',
                reason: 'Completed',
                startedAt: '2023-03-16T01:03:36Z',
              },
            },
          ],
          results: [
            {
              name: 'TEST_OUTPUT',
              type: 'string',
              value:
                '{"result":"SUCCESS","timestamp":"1678928616","note":"For more details please visit the logs in workspace of Tekton tasks.","namespace":"default","successes":1,"failures":0,"warnings":0}\n',
            },
          ],
          taskSpec: {
            params: [
              {
                description: 'Image digest to scan',
                name: 'image-digest',
                type: 'string',
              },
              {
                description: 'Url to image',
                name: 'image-url',
                type: 'string',
              },
              {
                description: 'secret with config.json for container auth',
                name: 'docker-auth',
                type: 'string',
              },
            ],
            results: [
              {
                description: 'test output',
                name: 'TEST_OUTPUT',
                type: 'string',
              },
            ],
            sidecars: [
              {
                image: 'quay.io/redhat-appstudio/clamav-db:latest',
                imagePullPolicy: 'Always',
                name: 'database',
                computeResources: {},
                script: '#!/usr/bin/env bash\ncp -r /var/lib/clamav/* /tmp/clamdb\n',
                volumeMounts: [
                  {
                    mountPath: '/tmp/clamdb',
                    name: 'dbfolder',
                  },
                ],
              },
            ],
            steps: [
              {
                env: [
                  {
                    name: 'HOME',
                    value: '/work',
                  },
                  {
                    name: 'DOCKER_CONFIG',
                    value: '/secrets/registry-auth',
                  },
                  {
                    name: 'IMAGE_URL',
                    value:
                      'quay.io/redhat-appstudio/user-workload:on-pr-36e49113fc391cc1a4723afb0269a88c9e54608d',
                  },
                  {
                    name: 'IMAGE_DIGEST',
                    value:
                      'sha256:02d4920c04cad24ef1a8058bc31f08a76182e80cc8288712ea764ce45e3406b1',
                  },
                ],
                image:
                  'quay.io/redhat-appstudio/hacbs-test:v1.0.11@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
                name: 'extract-and-scan-image',
                resources: {
                  limits: {
                    cpu: '2',
                    memory: '4Gi',
                  },
                  requests: {
                    cpu: '10m',
                    memory: '512Mi',
                  },
                },
                script:
                  'imagewithouttag=$(echo $IMAGE_URL | sed "s/\\(.*\\):.*/\\1/" | tr -d \'\\n\')\n\n# strip new-line escape symbol from parameter and save it to variable\nimageanddigest=$(echo $imagewithouttag@$IMAGE_DIGEST)\n\n# check if image is attestation one, skip the clamav scan in such case\nif [[ $imageanddigest == *.att ]]\nthen\n    echo "$imageanddigest is an attestation image, skipping clamav scan"\n    exit 0\nfi\nmkdir content\ncd content\necho Extracting image\nif ! oc image extract $imageanddigest; then\n  echo "Unable to extract image! Skipping clamscan!"\n  exit 0\nfi\necho Extraction done\nclamscan -ri --max-scansize=250M | tee /tekton/home/clamscan-result.log\necho "Executed-on: Scan was executed on version - $(clamscan --version)" | tee -a /tekton/home/clamscan-result.log\n',
                securityContext: {
                  runAsUser: 1000,
                },
                volumeMounts: [
                  {
                    mountPath: '/var/lib/clamav',
                    name: 'dbfolder',
                  },
                  {
                    mountPath: '/work',
                    name: 'work',
                  },
                  {
                    mountPath: '/secrets/registry-auth',
                    name: 'registry-auth',
                  },
                ],
                workingDir: '/work',
              },
              {
                image:
                  'quay.io/redhat-appstudio/hacbs-test:v1.0.11@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
                name: 'modify-clam-output-to-json',
                resources: {},
                script:
                  '#!/usr/bin/env python3.9\nimport json\nimport dateutil.parser as parser\nimport os\n\nclamscan_result = "/tekton/home/clamscan-result.log"\nif not os.path.exists(clamscan_result) or os.stat(clamscan_result).st_size == 0:\n    print("clamscan-result.log file is empty, meaning previous step didn\'t extracted the compiled code, skipping parsing.")\n    exit(0)\n\nwith open(clamscan_result, "r") as file:\n    clam_result_str = file.read()\n\ndef clam_result_str_to_json(clam_result_str):\n\n    clam_result_list = clam_result_str.split("\\n")\n    clam_result_list.remove(\'\')\n\n    results_marker = \\\n        clam_result_list.index("----------- SCAN SUMMARY -----------")\n\n    hit_list = clam_result_list[:results_marker]\n    summary_list = clam_result_list[(results_marker + 1):]\n\n    r_dict = { "hits": hit_list }\n    for item in summary_list:\n        # in case of blank lines\n        if not item:\n            continue\n        split_index = [c == \':\' for c in item].index(True)\n        key = item[:split_index].lower()\n        key = key.replace(" ", "_")\n        value = item[(split_index + 1):].strip(" ")\n        if (key == "start_date" or key == "end_date"):\n          isodate = parser.parse(value)\n          value = isodate.isoformat()\n        r_dict[key] = value\n    print(json.dumps(r_dict))\n    with open(\'/tekton/home/clamscan-result.json\', \'w\') as f:\n      print(json.dumps(r_dict), file=f)\n\ndef main():\n    clam_result_str_to_json(clam_result_str)\n\nif __name__ == "__main__":\n    main()\n',
              },
              {
                image:
                  'quay.io/redhat-appstudio/hacbs-test:v1.0.11@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
                name: 'store-hacbs-test-output-result',
                resources: {},
                script:
                  '#!/usr/bin/env bash\nsource /utils.sh\n\nHACBS_ERROR_OUTPUT=$(make_result_json -r "ERROR")\nif [ -f /tekton/home/clamscan-result.json ];\nthen\n  cat /tekton/home/clamscan-result.json\n  INFECTED_FILES=$(jq -r \'.infected_files\' /tekton/home/clamscan-result.json || true )\n  if [ -z "${INFECTED_FILES}" ]; then\n    echo "Failed to get number of infected files"\n  else\n    if [[ "${INFECTED_FILES}" -gt 0 ]]; then RES="FAILURE"; else RES="SUCCESS"; fi\n    TEST_OUTPUT=$(make_result_json -r "${RES}" -s 1 -f "${INFECTED_FILES}")\n  fi\nfi\necho "${TEST_OUTPUT:-${HACBS_ERROR_OUTPUT}}" | tee /tekton/results/TEST_OUTPUT\n',
              },
            ],
            volumes: [
              {
                name: 'dbfolder',
              },
              {
                name: 'work',
              },
              {
                name: 'registry-auth',
                secret: {
                  optional: true,
                  secretName: 'human-resources-clkq-on-pull-request-xn5nd',
                },
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
      'human-resources-clkq-on-pull-request-xn5nd-show-summary': {
        pipelineTaskName: 'show-summary',
        status: {
          completionTime: '2023-03-16T01:03:47Z',
          conditions: [
            {
              lastTransitionTime: '2023-03-16T01:03:47Z',
              message: 'All Steps have completed executing',
              reason: 'Succeeded',
              status: 'True',
              type: 'Succeeded',
            },
          ],
          podName: 'human-resources-clkq-on-pull-request-xn5nd-show-summary-pod',
          startTime: '2023-03-16T01:03:38Z',
          steps: [
            {
              container: 'step-appstudio-summary',
              imageID:
                'quay.io/openshift-release-dev/ocp-v4.0-art-dev@sha256:9f0cdc00b1b1a3c17411e50653253b9f6bb5329ea4fb82ad983790a6dbf2d9ad',
              name: 'appstudio-summary',
              terminated: {
                containerID:
                  'cri-o://1af1c7a9144a9c5e819050feab3414022599eed180b25604bed0cd046e269591',
                exitCode: 0,
                finishedAt: '2023-03-16T01:03:46Z',
                reason: 'Completed',
                startedAt: '2023-03-16T01:03:46Z',
              },
            },
          ],
          taskSpec: {
            description: 'Summary Pipeline Task.',
            params: [
              {
                description: 'pipeline-run to annotate',
                name: 'pipelinerun-name',
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
                env: [
                  {
                    name: 'GIT_URL',
                    value:
                      'https://github.com/test-repo/human-resources?rev=36e49113fc391cc1a4723afb0269a88c9e54608d',
                  },
                  {
                    name: 'IMAGE_URL',
                    value:
                      'quay.io/redhat-appstudio/user-workload:on-pr-36e49113fc391cc1a4723afb0269a88c9e54608d',
                  },
                  {
                    name: 'PIPELINERUN_NAME',
                    value: 'human-resources-clkq-on-pull-request-xn5nd',
                  },
                ],
                image:
                  'registry.redhat.io/openshift4/ose-cli:v4.12@sha256:9f0cdc00b1b1a3c17411e50653253b9f6bb5329ea4fb82ad983790a6dbf2d9ad',
                name: 'appstudio-summary',
                resources: {},
                script:
                  '#!/usr/bin/env bash\necho\necho "Build Summary:"\necho\necho "Build repository: $GIT_URL"\necho "Generated Image is in : $IMAGE_URL"\necho\noc annotate --overwrite pipelinerun $PIPELINERUN_NAME build.appstudio.openshift.io/repo=$GIT_URL\noc annotate --overwrite pipelinerun $PIPELINERUN_NAME build.appstudio.openshift.io/image=$IMAGE_URL\necho End Summary\n\noc delete --ignore-not-found=true secret $PIPELINERUN_NAME\n',
              },
            ],
          },
        },
      },
      'human-resources-clkq-on-pull-request-xn5nd-build-container': {
        pipelineTaskName: 'build-container',
        status: {
          completionTime: '2023-03-16T00:59:53Z',
          conditions: [
            {
              lastTransitionTime: '2023-03-16T00:59:53Z',
              message: 'All Steps have completed executing',
              reason: 'Succeeded',
              status: 'True',
              type: 'Succeeded',
            },
          ],
          podName: 'human-resources-clkq-on-pull-request-xn5nd-build-container-pod',
          startTime: '2023-03-16T00:52:27Z',
          steps: [
            {
              container: 'step-build',
              imageID:
                'quay.io/redhat-appstudio/buildah@sha256:381e9bfedd59701477621da93892106873a6951b196105d3d2d85c3f6d7b569b',
              name: 'build',
              terminated: {
                containerID:
                  'cri-o://9ba9075922168b1e6fb272b0dde4a6736f00bc99f88eb37a2919f609a4314d53',
                exitCode: 0,
                finishedAt: '2023-03-16T00:57:47Z',
                reason: 'Completed',
                startedAt: '2023-03-16T00:53:34Z',
              },
            },
            {
              container: 'step-sbom-get',
              imageID:
                'quay.io/redhat-appstudio/syft@sha256:09afc449976230f66848c19bb5ccf344eb0eeb4ed50747e33b53aff49462c319',
              name: 'sbom-get',
              terminated: {
                containerID:
                  'cri-o://a7b8002976d3bd82419526856d1087ae276f2034d448ea9a99a93fdbb10eb0e7',
                exitCode: 0,
                finishedAt: '2023-03-16T00:59:09Z',
                reason: 'Completed',
                startedAt: '2023-03-16T00:57:47Z',
              },
            },
            {
              container: 'step-analyse-dependencies-java-sbom',
              imageID:
                'quay.io/redhat-appstudio/hacbs-jvm-build-request-processor@sha256:b198cf4b33dab59ce8ac25afd4e1001390db29ca2dec83dc8a1e21b0359ce743',
              name: 'analyse-dependencies-java-sbom',
              terminated: {
                containerID:
                  'cri-o://c2131223bedd14167ff6b3a4bc364727f7ab7d106f78e4964d81127c960526ed',
                exitCode: 0,
                finishedAt: '2023-03-16T00:59:09Z',
                message: '[{"key":"JAVA_COMMUNITY_DEPENDENCIES","value":"","type":1}]',
                reason: 'Completed',
                startedAt: '2023-03-16T00:59:09Z',
              },
            },
            {
              container: 'step-merge-sboms',
              imageID:
                'registry.access.redhat.com/ubi9/python-39@sha256:89463fe3e086620617a4f6281640469ba7a7abd2f1b5be13e6cf0f46a6565516',
              name: 'merge-sboms',
              terminated: {
                containerID:
                  'cri-o://1a7a67c49f3d7790ed95fa8ba269668fa9271d73deada9ec65f07b7aab93bc5e',
                exitCode: 0,
                finishedAt: '2023-03-16T00:59:09Z',
                message: '[{"key":"JAVA_COMMUNITY_DEPENDENCIES","value":"","type":1}]',
                reason: 'Completed',
                startedAt: '2023-03-16T00:59:09Z',
              },
            },
            {
              container: 'step-inject-sbom-and-push',
              imageID:
                'registry.access.redhat.com/ubi9/buildah@sha256:c8b1d312815452964885680fc5bc8d99b3bfe9b6961228c71a09c72ca8e915eb',
              name: 'inject-sbom-and-push',
              terminated: {
                containerID:
                  'cri-o://63387520d62a24c45c9315d7b065eff747d41d69961bd5ee7cca51b03a4298ec',
                exitCode: 0,
                finishedAt: '2023-03-16T00:59:50Z',
                message:
                  '[{"key":"BASE_IMAGES_DIGESTS","value":"docker.io/library/openjdk:11-jdk@sha256:99bac5bf83633e3c7399aed725c8415e7b569b54e03e4599e580fc9cdb7c21ab\\nquay.io/devfile/maven:3.8.1-openjdk-17-slim@sha256:a65cb519660f51b06f487a6f5de8c264e1e2bcdb32033f3f45b0899f7740ca0f\\n","type":1},{"key":"IMAGE_DIGEST","value":"sha256:02d4920c04cad24ef1a8058bc31f08a76182e80cc8288712ea764ce45e3406b1","type":1},{"key":"IMAGE_URL","value":"quay.io/redhat-appstudio/user-workload:on-pr-36e49113fc391cc1a4723afb0269a88c9e54608d","type":1},{"key":"JAVA_COMMUNITY_DEPENDENCIES","value":"","type":1}]',
                reason: 'Completed',
                startedAt: '2023-03-16T00:59:10Z',
              },
            },
            {
              container: 'step-upload-sbom',
              imageID:
                'quay.io/redhat-appstudio/cosign@sha256:18b3716a6225727877475e1ab4f2493915e72cffd2ce431e9901d2ed2e4b2c0b',
              name: 'upload-sbom',
              terminated: {
                containerID:
                  'cri-o://4c260401d25c8ecc0269ba01ee9c901807deef2c3203554345302fadc09556bc',
                exitCode: 0,
                finishedAt: '2023-03-16T00:59:53Z',
                message:
                  '[{"key":"BASE_IMAGES_DIGESTS","value":"docker.io/library/openjdk:11-jdk@sha256:99bac5bf83633e3c7399aed725c8415e7b569b54e03e4599e580fc9cdb7c21ab\\nquay.io/devfile/maven:3.8.1-openjdk-17-slim@sha256:a65cb519660f51b06f487a6f5de8c264e1e2bcdb32033f3f45b0899f7740ca0f\\n","type":1},{"key":"IMAGE_DIGEST","value":"sha256:02d4920c04cad24ef1a8058bc31f08a76182e80cc8288712ea764ce45e3406b1","type":1},{"key":"IMAGE_URL","value":"quay.io/redhat-appstudio/user-workload:on-pr-36e49113fc391cc1a4723afb0269a88c9e54608d","type":1},{"key":"JAVA_COMMUNITY_DEPENDENCIES","value":"","type":1}]',
                reason: 'Completed',
                startedAt: '2023-03-16T00:59:50Z',
              },
            },
          ],
          results: [
            {
              name: 'JAVA_COMMUNITY_DEPENDENCIES',
              type: 'string',
              value: '',
            },
            {
              name: 'BASE_IMAGES_DIGESTS',
              type: 'string',
              value:
                'docker.io/library/openjdk:11-jdk@sha256:99bac5bf83633e3c7399aed725c8415e7b569b54e03e4599e580fc9cdb7c21ab\nquay.io/devfile/maven:3.8.1-openjdk-17-slim@sha256:a65cb519660f51b06f487a6f5de8c264e1e2bcdb32033f3f45b0899f7740ca0f\n',
            },
            {
              name: 'IMAGE_DIGEST',
              type: 'string',
              value: 'sha256:02d4920c04cad24ef1a8058bc31f08a76182e80cc8288712ea764ce45e3406b1',
            },
            {
              name: 'IMAGE_URL',
              type: 'string',
              value:
                'quay.io/redhat-appstudio/user-workload:on-pr-36e49113fc391cc1a4723afb0269a88c9e54608d',
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
                  'registry.access.redhat.com/ubi9/buildah:9.0.0-19@sha256:c8b1d312815452964885680fc5bc8d99b3bfe9b6961228c71a09c72ca8e915eb',
                description: 'The location of the buildah builder image.',
                name: 'BUILDER_IMAGE',
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
                description: 'secret with config.json for container auth',
                name: 'DOCKER_AUTH',
                type: 'string',
              },
              {
                default: 'false',
                description: 'Determines if build will be executed without network access.',
                name: 'HERMETIC',
                type: 'string',
              },
              {
                default: '',
                description:
                  'In case it is not empty, the prefetched content should be made available to the build.',
                name: 'PREFETCH_INPUT',
                type: 'string',
              },
            ],
            results: [
              {
                description: 'Digest of the image just built',
                name: 'IMAGE_DIGEST',
                type: 'string',
              },
              {
                description: 'Image repository where the built image was pushed',
                name: 'IMAGE_URL',
                type: 'string',
              },
              {
                description: 'Digests of the base images used for build',
                name: 'BASE_IMAGES_DIGESTS',
                type: 'string',
              },
              {
                description: 'The counting of Java components by publisher in JSON format',
                name: 'SBOM_JAVA_COMPONENTS_COUNT',
                type: 'string',
              },
              {
                description:
                  'The Java dependencies that came from community sources such as Maven central.',
                name: 'JAVA_COMMUNITY_DEPENDENCIES',
                type: 'string',
              },
            ],
            stepTemplate: {
              env: [
                {
                  name: 'BUILDAH_FORMAT',
                  value: 'oci',
                },
                {
                  name: 'STORAGE_DRIVER',
                  value: 'vfs',
                },
                {
                  name: 'HERMETIC',
                  value: 'false',
                },
                {
                  name: 'PREFETCH_INPUT',
                },
                {
                  name: 'DOCKER_CONFIG',
                  value: '/secrets/registry-auth',
                },
                {
                  name: 'CONTEXT',
                  value: '.',
                },
                {
                  name: 'DOCKERFILE',
                  value:
                    'https://raw.githubusercontent.com/devfile-samples/devfile-sample-java-springboot-basic/main/docker/Dockerfile',
                },
                {
                  name: 'IMAGE',
                  value:
                    'quay.io/redhat-appstudio/user-workload:on-pr-36e49113fc391cc1a4723afb0269a88c9e54608d',
                },
                {
                  name: 'TLSVERIFY',
                  value: 'true',
                },
              ],
              name: '',
              computeResources: {},
            },
            steps: [
              {
                image: 'quay.io/redhat-appstudio/buildah:v1.28',
                name: 'build',
                resources: {
                  limits: {
                    cpu: '2',
                    memory: '4Gi',
                  },
                  requests: {
                    cpu: '10m',
                    memory: '512Mi',
                  },
                },
                script:
                  'if [ -e "$CONTEXT/$DOCKERFILE" ]; then\n  dockerfile_path="$CONTEXT/$DOCKERFILE"\nelif [ -e "$DOCKERFILE" ]; then\n  dockerfile_path="$DOCKERFILE"\nelif echo "$DOCKERFILE" | grep -q "^https\\?://"; then\n  echo "Fetch Dockerfile from $DOCKERFILE"\n  dockerfile_path=$(mktemp --suffix=-Dockerfile)\n  http_code=$(curl -s -L -w "%{http_code}" --output "$dockerfile_path" "$DOCKERFILE")\n  if [ $http_code != 200 ]; then\n    echo "No Dockerfile is fetched. Server responds $http_code"\n    exit 1\n  fi\nelse\n  echo "Cannot find Dockerfile $DOCKERFILE"\n  exit 1\nfi\nif [ -n "$JVM_BUILD_WORKSPACE_ARTIFACT_CACHE_PORT_80_TCP_ADDR" ] && grep -q \'^\\s*RUN \\(./\\)\\?mvn\' "$dockerfile_path"; then\n  sed -i -e "s|^\\s*RUN \\(\\(./\\)\\?mvn\\(.*\\)\\)|RUN echo \\"<settings><mirrors><mirror><id>mirror.default</id><url>http://$JVM_BUILD_WORKSPACE_ARTIFACT_CACHE_PORT_80_TCP_ADDR/v1/cache/default/0/</url><mirrorOf>*</mirrorOf></mirror></mirrors></settings>\\" > /tmp/settings.yaml; \\1 -s /tmp/settings.yaml|g" "$dockerfile_path"\n  touch /var/lib/containers/java\nfi\n\n\nsed -i \'s/^\\s*short-name-mode\\s*=\\s*.*/short-name-mode = "disabled"/\' /etc/containers/registries.conf\n\n# Setting new namespace to run buildah - 2^32-2\necho \'root:1:4294967294\' | tee -a /etc/subuid >> /etc/subgid\n\nif [ "${HERMETIC}" == "true" ]; then\n  BUILDAH_ARGS="--pull=never"\n  UNSHARE_ARGS="--net"\n  for image in $(grep -i \'^\\s*FROM\' "$dockerfile_path" | sed \'s/--platform=\\S*//\' | awk \'{print $2}\'); do\n    unshare -Ufp --keep-caps -r --map-users 1,1,65536 --map-groups 1,1,65536 -- buildah pull $image\n  done\n  echo "Build will be executed with network isolation"\nfi\n\nif [ -n "${PREFETCH_INPUT}" ]; then\n  mv cachi2 /tmp/\n  chmod -R go+rwX /tmp/cachi2\n  VOLUME_MOUNTS="--volume /tmp/cachi2:/cachi2"\n  sed -i \'s|^\\s*run |RUN . /cachi2/cachi2.env \\&\\& \\\\\\n    |i\' "$dockerfile_path"\n  echo "Prefetched content will be made available"\nfi\n\nunshare -Uf $UNSHARE_ARGS --keep-caps -r --map-users 1,1,65536 --map-groups 1,1,65536 -- buildah bud \\\n  $VOLUME_MOUNTS \\\n  $BUILDAH_ARGS \\\n  --tls-verify=$TLSVERIFY --no-cache \\\n  --ulimit nofile=4096:4096 \\\n  -f "$dockerfile_path" -t $IMAGE $CONTEXT\n\ncontainer=$(buildah from --pull-never $IMAGE)\nbuildah mount $container | tee /workspace/container_path\necho $container > /workspace/container_name\n',
                securityContext: {
                  capabilities: {
                    add: ['SETFCAP'],
                  },
                },
                volumeMounts: [
                  {
                    mountPath: '/var/lib/containers',
                    name: 'varlibcontainers',
                  },
                  {
                    mountPath: '/secrets/registry-auth',
                    name: 'registry-auth',
                  },
                ],
                workingDir: '/workspace/source',
              },
              {
                image: 'quay.io/redhat-appstudio/syft:v0.47.0',
                name: 'sbom-get',
                resources: {},
                script:
                  'syft dir:/workspace/source --file=/workspace/source/sbom-source.json --output=cyclonedx-json\nfind $(cat /workspace/container_path) -xtype l -delete\nsyft dir:$(cat /workspace/container_path) --file=/workspace/source/sbom-image.json --output=cyclonedx-json\n',
                volumeMounts: [
                  {
                    mountPath: '/var/lib/containers',
                    name: 'varlibcontainers',
                  },
                ],
              },
              {
                image:
                  'quay.io/redhat-appstudio/hacbs-jvm-build-request-processor:1d417e6f1f3e68c6c537333b5759796eddae0afc',
                name: 'analyse-dependencies-java-sbom',
                resources: {},
                script:
                  "if [ -f /var/lib/containers/java ]; then\n  /opt/jboss/container/java/run/run-java.sh analyse-dependencies path $(cat /workspace/container_path) -s /workspace/source/sbom-image.json --task-run-name human-resources-clkq-on-pull-request-xn5nd-build-container --publishers /tekton/results/SBOM_JAVA_COMPONENTS_COUNT\n  sed -i 's/^/ /' /tekton/results/SBOM_JAVA_COMPONENTS_COUNT # Workaround for SRVKP-2875\nelse\n  touch /tekton/results/JAVA_COMMUNITY_DEPENDENCIES\nfi\n",
                securityContext: {
                  runAsUser: 0,
                },
                volumeMounts: [
                  {
                    mountPath: '/var/lib/containers',
                    name: 'varlibcontainers',
                  },
                ],
              },
              {
                image: 'registry.access.redhat.com/ubi9/python-39:1-108',
                name: 'merge-sboms',
                resources: {},
                script:
                  '#!/bin/python3\nimport json\nimport os\n\n# load SBOMs\nwith open("./sbom-image.json") as f:\n  image_sbom = json.load(f)\n\nwith open("./sbom-source.json") as f:\n  source_sbom = json.load(f)\n\n# fetch unique components from available SBOMs\ndef get_identifier(component):\n  return component["name"] + \'@\' + component.get("version", "")\n\nexisting_components = [get_identifier(component) for component in image_sbom["components"]]\n\nfor component in source_sbom["components"]:\n  if get_identifier(component) not in existing_components:\n    image_sbom["components"].append(component)\n    existing_components.append(get_identifier(component))\n\nimage_sbom["components"].sort(key=lambda c: get_identifier(c))\n\n# write the CycloneDX unified SBOM\nwith open("./sbom-cyclonedx.json", "w") as f:\n  json.dump(image_sbom, f, indent=4)\n\n# create and write the PURL unified SBOM\npurls = [{"purl": component["purl"]} for component in image_sbom["components"] if "purl" in component]\npurl_content = {"image_contents": {"dependencies": purls}}\n\nwith open("sbom-purl.json", "w") as output_file:\n  json.dump(purl_content, output_file, indent=4)\n',
                securityContext: {
                  runAsUser: 0,
                },
                workingDir: '/workspace/source',
              },
              {
                image:
                  'registry.access.redhat.com/ubi9/buildah:9.0.0-19@sha256:c8b1d312815452964885680fc5bc8d99b3bfe9b6961228c71a09c72ca8e915eb',
                name: 'inject-sbom-and-push',
                resources: {},
                script:
                  '# Expose base image digests\nbuildah images --format \'{{ .Name }}:{{ .Tag }}@{{ .Digest }}\' | grep -v $IMAGE > /tekton/results/BASE_IMAGES_DIGESTS\n\nbase_image_name=$(buildah inspect --format \'{{ index .ImageAnnotations "org.opencontainers.image.base.name"}}\' $IMAGE)\nbase_image_digest=$(buildah inspect --format \'{{ index .ImageAnnotations "org.opencontainers.image.base.digest"}}\' $IMAGE)\ncontainer=$(buildah from --pull-never $IMAGE)\nbuildah copy $container sbom-cyclonedx.json sbom-purl.json /root/buildinfo/content_manifests/\nbuildah config -a org.opencontainers.image.base.name=${base_image_name} -a org.opencontainers.image.base.digest=${base_image_digest} $container\nbuildah commit $container $IMAGE\nbuildah push \\\n  --tls-verify=$TLSVERIFY \\\n  --digestfile /workspace/source/image-digest $IMAGE \\\n  docker://$IMAGE\ncat "/workspace/source"/image-digest | tee /tekton/results/IMAGE_DIGEST\necho -n "$IMAGE" | tee /tekton/results/IMAGE_URL\n',
                securityContext: {
                  capabilities: {
                    add: ['SETFCAP'],
                  },
                  runAsUser: 0,
                },
                volumeMounts: [
                  {
                    mountPath: '/var/lib/containers',
                    name: 'varlibcontainers',
                  },
                  {
                    mountPath: '/secrets/registry-auth',
                    name: 'registry-auth',
                  },
                ],
                workingDir: '/workspace/source',
              },
              {
                args: [
                  'attach',
                  'sbom',
                  '--sbom',
                  'sbom-cyclonedx.json',
                  '--type',
                  'cyclonedx',
                  'quay.io/redhat-appstudio/user-workload:on-pr-36e49113fc391cc1a4723afb0269a88c9e54608d',
                ],
                image: 'quay.io/redhat-appstudio/cosign:v1.13.1',
                name: 'upload-sbom',
                resources: {},
                volumeMounts: [
                  {
                    mountPath: '/secrets/registry-auth',
                    name: 'registry-auth',
                  },
                ],
                workingDir: '/workspace/source',
              },
            ],
            volumes: [
              {
                emptyDir: {},
                name: 'varlibcontainers',
              },
              {
                name: 'registry-auth',
                secret: {
                  optional: true,
                  secretName: 'human-resources-clkq-on-pull-request-xn5nd',
                },
              },
            ],
            workspaces: [
              {
                name: 'source',
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
      'human-resources-clkq-on-pull-request-xn5nd-sbom-json-check': {
        pipelineTaskName: 'sbom-json-check',
        status: {
          completionTime: '2023-03-16T01:00:39Z',
          conditions: [
            {
              lastTransitionTime: '2023-03-16T01:00:39Z',
              message: 'All Steps have completed executing',
              reason: 'Succeeded',
              status: 'True',
              type: 'Succeeded',
            },
          ],
          podName: 'human-resources-clkq-on-pull-request-xn5nd-sbom-json-check-pod',
          startTime: '2023-03-16T01:00:12Z',
          steps: [
            {
              container: 'step-sbom-json-check',
              imageID:
                'quay.io/redhat-appstudio/hacbs-test@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
              name: 'sbom-json-check',
              terminated: {
                containerID:
                  'cri-o://fbb5c85e29431424ada9035e8fde3dde65f1e30bab6a0022282d219d364717c0',
                exitCode: 0,
                finishedAt: '2023-03-16T01:00:38Z',
                message:
                  '[{"key":"TEST_OUTPUT","value":"{\\"result\\":\\"SUCCESS\\",\\"timestamp\\":\\"1678928438\\",\\"note\\":\\"For more details please visit the logs in workspace of Tekton tasks.\\",\\"namespace\\":\\"default\\",\\"successes\\":1,\\"failures\\":0,\\"warnings\\":0}\\n","type":1}]',
                reason: 'Completed',
                startedAt: '2023-03-16T01:00:26Z',
              },
            },
          ],
          results: [
            {
              name: 'TEST_OUTPUT',
              type: 'string',
              value:
                '{"result":"SUCCESS","timestamp":"1678928438","note":"For more details please visit the logs in workspace of Tekton tasks.","namespace":"default","successes":1,"failures":0,"warnings":0}\n',
            },
          ],
          taskSpec: {
            description:
              'Check the syntax of the sbom-cyclonedx.json file which should be found in the /root/buildinfo/content_manifests/ directory',
            params: [
              {
                description: 'the fully qualified image name to be verified',
                name: 'IMAGE_URL',
                type: 'string',
              },
              {
                description: 'image digest',
                name: 'IMAGE_DIGEST',
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
                env: [
                  {
                    name: 'IMAGE_URL',
                    value:
                      'quay.io/redhat-appstudio/user-workload:on-pr-36e49113fc391cc1a4723afb0269a88c9e54608d',
                  },
                  {
                    name: 'IMAGE_DIGEST',
                    value:
                      'sha256:02d4920c04cad24ef1a8058bc31f08a76182e80cc8288712ea764ce45e3406b1',
                  },
                ],
                image:
                  'quay.io/redhat-appstudio/hacbs-test:v1.0.11@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
                name: 'sbom-json-check',
                resources: {},
                script:
                  '#!/usr/bin/env bash\nsource /utils.sh\n\nmkdir /manifests/ && cd /manifests/\n\nimage_with_digest="${IMAGE_URL}@${IMAGE_DIGEST}"\n\nif ! oc image extract "${image_with_digest}" --path \'/root/buildinfo/content_manifests/*:/manifests/\'; then\n  echo "Failed to extract manifests from image ${image_with_digest}"\nfi\n\ntouch fail_result.txt\nif [ -f "sbom-cyclonedx.json" ]\nthen\n  result=$(echo -n $(cyclonedx-linux-x64 validate --input-file sbom-cyclonedx.json))\n  if [[ ! $result =~ "BOM validated successfully" ]]\n  then\n    echo "sbom-cyclonedx.json: $result" > fail_result.txt\n  fi\nelse\n  echo "cannot access \'sbom-cyclonedx.json\': No such file or directory" > fail_result.txt\nfi\n\nFAIL_RESULTS="$(cat fail_result.txt)"\nif [[ -z $FAIL_RESULTS ]]\nthen\n  TEST_OUTPUT=$(make_result_json -r "SUCCESS" -s 1)\nelse\n  echo "Fail to verify sbom-cyclonedx.json for image $IMAGE_URL with reason: $FAIL_RESULTS"\n  HACBS_ERROR_OUTPUT=$(make_result_json -r "FAILURE" -f 1)\nfi\n\necho "${TEST_OUTPUT:-${HACBS_ERROR_OUTPUT}}" | tee /tekton/results/TEST_OUTPUT\n',
                securityContext: {
                  capabilities: {
                    add: ['SETFCAP'],
                  },
                  runAsUser: 0,
                },
                volumeMounts: [
                  {
                    mountPath: '/shared',
                    name: 'shared',
                  },
                ],
              },
            ],
            volumes: [
              {
                emptyDir: {},
                name: 'shared',
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
    },
  },
};

export const mockTaskRuns = [
  {
    apiVersion: 'tekton.dev/v1',
    kind: 'TaskRun',
    metadata: {
      annotations: {
        'pipelinesascode.tekton.dev/on-target-branch': '[main,master]',
        'pipeline.tekton.dev/release': '9ec444e',
        'pipelinesascode.tekton.dev/repo-url': 'https://github.com/test-repo/human-resources',
        'pipelinesascode.tekton.dev/sha-title': 'Update tekton references',
        'tekton.dev/tags': 'git',
        'results.tekton.dev/record':
          'test-tenant/results/014c3e9f-90e9-4cd4-83eb-f0fdd8fe6714/records/fea24fa9-9e37-4511-a3a4-fc167b6cfc4e',
        'pipelinesascode.tekton.dev/git-auth-secret': 'pac-gitauth-zzez',
        'tekton.dev/categories': 'Git',
        'results.tekton.dev/log':
          'test-tenant/results/014c3e9f-90e9-4cd4-83eb-f0fdd8fe6714/logs/5ece6497-7eff-3e9c-a782-4efc9a8f1aeb',
        'chains.tekton.dev/signed': 'true',
        'tekton.dev/platforms': 'linux/amd64,linux/s390x,linux/ppc64le,linux/arm64',
        'tekton.dev/pipelines.minVersion': '0.21.0',
        'results.tekton.dev/result': 'test-tenant/results/014c3e9f-90e9-4cd4-83eb-f0fdd8fe6714',
        'pipelinesascode.tekton.dev/log-url':
          'https://console-openshift-console.apps.stone-prd-m01.84db.p1.openshiftapps.com/k8s/ns/test-tenant/tekton.dev~v1beta1~PipelineRun/human-resources-clkq-on-pull-request-xn5nd',
        'build.appstudio.redhat.com/target_branch': 'main',
        'pipelinesascode.tekton.dev/max-keep-runs': '3',
        'build.appstudio.redhat.com/pull_request_number': '2',
        'pipelinesascode.tekton.dev/sha-url':
          'https://github.com/test-repo/human-resources/commit/36e49113fc391cc1a4723afb0269a88c9e54608d',
        'pipelinesascode.tekton.dev/on-event': '[pull_request]',
        'pipelinesascode.tekton.dev/installation-id': '34687113',
        'tekton.dev/displayName': 'git clone',
        'build.appstudio.redhat.com/commit_sha': '36e49113fc391cc1a4723afb0269a88c9e54608d',
      },
      resourceVersion: '62181900',
      name: 'human-resources-clkq-on-pull-request-xn5nd-clone-repository',
      uid: 'fea24fa9-9e37-4511-a3a4-fc167b6cfc4e',
      creationTimestamp: '2023-03-16T00:51:37Z',
      generation: 1,
      namespace: 'test-tenant',
      ownerReferences: [
        {
          apiVersion: 'tekton.dev/v1',
          blockOwnerDeletion: true,
          controller: true,
          kind: 'PipelineRun',
          name: 'human-resources-clkq-on-pull-request-xn5nd',
          uid: '014c3e9f-90e9-4cd4-83eb-f0fdd8fe6714',
        },
      ],
      finalizers: ['chains.tekton.dev'],
      labels: {
        'pipelinesascode.tekton.dev/state': 'started',
        'tekton.dev/memberOf': 'tasks',
        'appstudio.openshift.io/component': 'human-resources-clkq',
        'pipelinesascode.tekton.dev/sender': 'rh-trusted-application-pipeline__bot',
        'app.kubernetes.io/version': 'v0.15.0',
        'tekton.dev/pipeline': 'human-resources-clkq-on-pull-request-xn5nd',
        'app.kubernetes.io/managed-by': 'pipelinesascode.tekton.dev',
        'pipelinesascode.tekton.dev/check-run-id': '12037335647',
        'pipelinesascode.tekton.dev/branch': 'main',
        'appstudio.openshift.io/application': 'my-test-output',
        'tekton.dev/task': 'git-clone',
        'pipelinesascode.tekton.dev/url-org': 'test-repo',
        'tekton.dev/pipelineTask': 'clone-repository',
        'pipelinesascode.tekton.dev/original-prname': 'human-resources-clkq-on-pull-request',
        'pipelinesascode.tekton.dev/pull-request': '2',
        'pipelines.appstudio.openshift.io/type': 'build',
        'pipelinesascode.tekton.dev/url-repository': 'human-resources',
        'tekton.dev/pipelineRun': 'human-resources-clkq-on-pull-request-xn5nd',
        'pipelinesascode.tekton.dev/repository': 'human-resources-clkq',
        'pipelinesascode.tekton.dev/sha': '36e49113fc391cc1a4723afb0269a88c9e54608d',
        'pipelinesascode.tekton.dev/git-provider': 'github',
        'pipelinesascode.tekton.dev/event-type': 'pull_request',
      },
    },
    spec: {
      params: [
        {
          name: 'url',
          value: 'https://github.com/test-repo/human-resources',
        },
        {
          name: 'revision',
          value: '36e49113fc391cc1a4723afb0269a88c9e54608d',
        },
      ],
      resources: {},
      serviceAccountName: 'appstudio-pipeline',
      taskRef: {
        bundle:
          'quay.io/redhat-appstudio-tekton-catalog/task-git-clone:0.1@sha256:f4e37778cba00296606ddfbc1c58181330899cafcaa1ee41c75a7cf8bed312f0',
        kind: 'Task',
        name: 'git-clone',
      },
      timeout: '1h0m0s',
      workspaces: [
        {
          name: 'output',
          persistentVolumeClaim: {
            claimName: 'pvc-ce2179a49a',
          },
        },
        {
          name: 'basic-auth',
          secret: {
            secretName: 'pac-gitauth-zzez',
          },
        },
      ],
    },
    status: {
      completionTime: '2023-03-16T00:52:09Z',
      conditions: [
        {
          lastTransitionTime: '2023-03-16T00:52:09Z',
          message: 'All Steps have completed executing',
          reason: 'Succeeded',
          status: 'True',
          type: 'Succeeded',
        },
      ],
      podName: 'human-resources-clkq-on-pull-request-xn5nd-clone-repository-pod',
      startTime: '2023-03-16T00:51:38Z',
      steps: [
        {
          container: 'step-clone',
          imageID:
            'registry.redhat.io/openshift-pipelines/pipelines-git-init-rhel8@sha256:2fa0b06d52b04f377c696412e19307a9eff27383f81d87aae0b4f71672a1cd0b',
          name: 'clone',
          terminated: {
            containerID: 'cri-o://a0ef629c17b8b42bff2c8f80c74738cdc4ea324ebe682e7e861caadd43e0ddea',
            exitCode: 0,
            finishedAt: '2023-03-16T00:52:07Z',
            message:
              '[{"key":"commit","value":"36e49113fc391cc1a4723afb0269a88c9e54608d","type":1},{"key":"url","value":"https://github.com/test-repo/human-resources","type":1}]',
            reason: 'Completed',
            startedAt: '2023-03-16T00:52:07Z',
          },
        },
      ],
      results: [
        {
          name: 'commit',
          type: 'string',
          value: '36e49113fc391cc1a4723afb0269a88c9e54608d',
        },
        {
          name: 'url',
          type: 'string',
          value: 'https://github.com/test-repo/human-resources',
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
              'registry.redhat.io/openshift-pipelines/pipelines-git-init-rhel8:v1.8.2-8@sha256:a538c423e7a11aae6ae582a411fdb090936458075f99af4ce5add038bb6983e8',
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
            type: 'string',
          },
          {
            description: 'The precise URL that was fetched by this Task.',
            name: 'url',
            type: 'string',
          },
        ],
        steps: [
          {
            env: [
              {
                name: 'HOME',
                value: '/tekton/home',
              },
              {
                name: 'PARAM_URL',
                value: 'https://github.com/test-repo/human-resources',
              },
              {
                name: 'PARAM_REVISION',
                value: '36e49113fc391cc1a4723afb0269a88c9e54608d',
              },
              {
                name: 'PARAM_REFSPEC',
              },
              {
                name: 'PARAM_SUBMODULES',
                value: 'true',
              },
              {
                name: 'PARAM_DEPTH',
                value: '1',
              },
              {
                name: 'PARAM_SSL_VERIFY',
                value: 'true',
              },
              {
                name: 'PARAM_SUBDIRECTORY',
              },
              {
                name: 'PARAM_DELETE_EXISTING',
                value: 'true',
              },
              {
                name: 'PARAM_HTTP_PROXY',
              },
              {
                name: 'PARAM_HTTPS_PROXY',
              },
              {
                name: 'PARAM_NO_PROXY',
              },
              {
                name: 'PARAM_VERBOSE',
                value: 'true',
              },
              {
                name: 'PARAM_SPARSE_CHECKOUT_DIRECTORIES',
              },
              {
                name: 'PARAM_USER_HOME',
                value: '/tekton/home',
              },
              {
                name: 'WORKSPACE_OUTPUT_PATH',
                value: '/workspace/output',
              },
              {
                name: 'WORKSPACE_SSH_DIRECTORY_BOUND',
                value: 'false',
              },
              {
                name: 'WORKSPACE_SSH_DIRECTORY_PATH',
              },
              {
                name: 'WORKSPACE_BASIC_AUTH_DIRECTORY_BOUND',
                value: 'true',
              },
              {
                name: 'WORKSPACE_BASIC_AUTH_DIRECTORY_PATH',
                value: '/workspace/basic-auth',
              },
            ],
            image:
              'registry.redhat.io/openshift-pipelines/pipelines-git-init-rhel8:v1.8.2-8@sha256:a538c423e7a11aae6ae582a411fdb090936458075f99af4ce5add038bb6983e8',
            name: 'clone',
            resources: {},
            script:
              '#!/usr/bin/env sh\nset -eu\n\nif [ "${PARAM_VERBOSE}" = "true" ] ; then\n  set -x\nfi\n\nif [ "${WORKSPACE_BASIC_AUTH_DIRECTORY_BOUND}" = "true" ] ; then\n  cp "${WORKSPACE_BASIC_AUTH_DIRECTORY_PATH}/.git-credentials" "${PARAM_USER_HOME}/.git-credentials"\n  cp "${WORKSPACE_BASIC_AUTH_DIRECTORY_PATH}/.gitconfig" "${PARAM_USER_HOME}/.gitconfig"\n  chmod 400 "${PARAM_USER_HOME}/.git-credentials"\n  chmod 400 "${PARAM_USER_HOME}/.gitconfig"\nfi\n\nif [ "${WORKSPACE_SSH_DIRECTORY_BOUND}" = "true" ] ; then\n  cp -R "${WORKSPACE_SSH_DIRECTORY_PATH}" "${PARAM_USER_HOME}"/.ssh\n  chmod 700 "${PARAM_USER_HOME}"/.ssh\n  chmod -R 400 "${PARAM_USER_HOME}"/.ssh/*\nfi\n\nCHECKOUT_DIR="${WORKSPACE_OUTPUT_PATH}/${PARAM_SUBDIRECTORY}"\n\ncleandir() {\n  # Delete any existing contents of the repo directory if it exists.\n  #\n  # We don\'t just "rm -rf ${CHECKOUT_DIR}" because ${CHECKOUT_DIR} might be "/"\n  # or the root of a mounted volume.\n  if [ -d "${CHECKOUT_DIR}" ] ; then\n    # Delete non-hidden files and directories\n    rm -rf "${CHECKOUT_DIR:?}"/*\n    # Delete files and directories starting with . but excluding ..\n    rm -rf "${CHECKOUT_DIR}"/.[!.]*\n    # Delete files and directories starting with .. plus any other character\n    rm -rf "${CHECKOUT_DIR}"/..?*\n  fi\n}\n\nif [ "${PARAM_DELETE_EXISTING}" = "true" ] ; then\n  cleandir\nfi\n\ntest -z "${PARAM_HTTP_PROXY}" || export HTTP_PROXY="${PARAM_HTTP_PROXY}"\ntest -z "${PARAM_HTTPS_PROXY}" || export HTTPS_PROXY="${PARAM_HTTPS_PROXY}"\ntest -z "${PARAM_NO_PROXY}" || export NO_PROXY="${PARAM_NO_PROXY}"\n\n/ko-app/git-init \\\n  -url="${PARAM_URL}" \\\n  -revision="${PARAM_REVISION}" \\\n  -refspec="${PARAM_REFSPEC}" \\\n  -path="${CHECKOUT_DIR}" \\\n  -sslVerify="${PARAM_SSL_VERIFY}" \\\n  -submodules="${PARAM_SUBMODULES}" \\\n  -depth="${PARAM_DEPTH}" \\\n  -sparseCheckoutDirectories="${PARAM_SPARSE_CHECKOUT_DIRECTORIES}"\ncd "${CHECKOUT_DIR}"\nRESULT_SHA="$(git rev-parse HEAD)"\nEXIT_CODE="$?"\nif [ "${EXIT_CODE}" != 0 ] ; then\n  exit "${EXIT_CODE}"\nfi\nprintf "%s" "${RESULT_SHA}" > "/tekton/results/commit"\nprintf "%s" "${PARAM_URL}" > "/tekton/results/url"\n',
            securityContext: {
              runAsUser: 0,
            },
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
  },
  {
    apiVersion: 'tekton.dev/v1',
    kind: 'TaskRun',
    metadata: {
      annotations: {
        'pipelinesascode.tekton.dev/on-target-branch': '[main,master]',
        'pipeline.tekton.dev/release': '9ec444e',
        'pipelinesascode.tekton.dev/repo-url': 'https://github.com/test-repo/human-resources',
        'pipelinesascode.tekton.dev/sha-title': 'Update tekton references',
        'tekton.dev/tags': 'appstudio, hacbs',
        'results.tekton.dev/record':
          'test-tenant/results/014c3e9f-90e9-4cd4-83eb-f0fdd8fe6714/records/d70e9422-b7bf-4e6f-bd9e-61b8e8a9f8c5',
        'pipelinesascode.tekton.dev/git-auth-secret': 'pac-gitauth-zzez',
        'results.tekton.dev/log':
          'test-tenant/results/014c3e9f-90e9-4cd4-83eb-f0fdd8fe6714/logs/f96aef78-c3ea-3621-b9d6-bc0494443707',
        'chains.tekton.dev/signed': 'true',
        'tekton.dev/pipelines.minVersion': '0.12.1',
        'results.tekton.dev/result': 'test-tenant/results/014c3e9f-90e9-4cd4-83eb-f0fdd8fe6714',
        'pipelinesascode.tekton.dev/log-url':
          'https://console-openshift-console.apps.stone-prd-m01.84db.p1.openshiftapps.com/k8s/ns/test-tenant/tekton.dev~v1beta1~PipelineRun/human-resources-clkq-on-pull-request-xn5nd',
        'build.appstudio.redhat.com/target_branch': 'main',
        'pipelinesascode.tekton.dev/max-keep-runs': '3',
        'build.appstudio.redhat.com/pull_request_number': '2',
        'pipelinesascode.tekton.dev/sha-url':
          'https://github.com/test-repo/human-resources/commit/36e49113fc391cc1a4723afb0269a88c9e54608d',
        'pipelinesascode.tekton.dev/on-event': '[pull_request]',
        'pipelinesascode.tekton.dev/installation-id': '34687113',
        'build.appstudio.redhat.com/commit_sha': '36e49113fc391cc1a4723afb0269a88c9e54608d',
      },
      resourceVersion: '62432428',
      name: 'hum1e2c0e3126f75d552fc611f4aeae38ab-deprecated-base-image-check',
      uid: 'd70e9422-b7bf-4e6f-bd9e-61b8e8a9f8c5',
      creationTimestamp: '2023-03-16T01:00:08Z',
      generation: 1,
      namespace: 'test-tenant',
      ownerReferences: [
        {
          apiVersion: 'tekton.dev/v1',
          blockOwnerDeletion: true,
          controller: true,
          kind: 'PipelineRun',
          name: 'human-resources-clkq-on-pull-request-xn5nd',
          uid: '014c3e9f-90e9-4cd4-83eb-f0fdd8fe6714',
        },
      ],
      finalizers: ['chains.tekton.dev'],
      labels: {
        'pipelinesascode.tekton.dev/state': 'started',
        'tekton.dev/memberOf': 'tasks',
        'appstudio.openshift.io/component': 'human-resources-clkq',
        'pipelinesascode.tekton.dev/sender': 'rh-trusted-application-pipeline__bot',
        'app.kubernetes.io/version': 'v0.15.0',
        'tekton.dev/pipeline': 'human-resources-clkq-on-pull-request-xn5nd',
        'app.kubernetes.io/managed-by': 'pipelinesascode.tekton.dev',
        'pipelinesascode.tekton.dev/check-run-id': '12037335647',
        'pipelinesascode.tekton.dev/branch': 'main',
        'appstudio.openshift.io/application': 'my-test-output',
        'tekton.dev/task': 'deprecated-image-check',
        'pipelinesascode.tekton.dev/url-org': 'test-repo',
        'tekton.dev/pipelineTask': 'deprecated-base-image-check',
        'pipelinesascode.tekton.dev/original-prname': 'human-resources-clkq-on-pull-request',
        'pipelinesascode.tekton.dev/pull-request': '2',
        'pipelines.appstudio.openshift.io/type': 'build',
        'pipelinesascode.tekton.dev/url-repository': 'human-resources',
        'tekton.dev/pipelineRun': 'human-resources-clkq-on-pull-request-xn5nd',
        'pipelinesascode.tekton.dev/repository': 'human-resources-clkq',
        'pipelinesascode.tekton.dev/sha': '36e49113fc391cc1a4723afb0269a88c9e54608d',
        'pipelinesascode.tekton.dev/git-provider': 'github',
        'pipelinesascode.tekton.dev/event-type': 'pull_request',
      },
    },
    spec: {
      params: [
        {
          name: 'BASE_IMAGES_DIGESTS',
          value:
            'docker.io/library/openjdk:11-jdk@sha256:99bac5bf83633e3c7399aed725c8415e7b569b54e03e4599e580fc9cdb7c21ab\nquay.io/devfile/maven:3.8.1-openjdk-17-slim@sha256:a65cb519660f51b06f487a6f5de8c264e1e2bcdb32033f3f45b0899f7740ca0f\n',
        },
      ],
      resources: {},
      serviceAccountName: 'appstudio-pipeline',
      taskRef: {
        bundle:
          'quay.io/redhat-appstudio-tekton-catalog/task-deprecated-image-check:0.1@sha256:28d724dd6f6c365b2a839d9e52baac91559fd78c160774769c1ec724301f78d4',
        kind: 'Task',
        name: 'deprecated-image-check',
      },
      timeout: '1h0m0s',
      workspaces: [
        {
          name: 'sanity-ws',
          persistentVolumeClaim: {
            claimName: 'pvc-ce2179a49a',
          },
        },
      ],
    },
    status: {
      completionTime: '2023-03-16T01:00:58Z',
      conditions: [
        {
          lastTransitionTime: '2023-03-16T01:00:58Z',
          message: 'All Steps have completed executing',
          reason: 'Succeeded',
          status: 'True',
          type: 'Succeeded',
        },
      ],
      podName: 'hum1e2c0e3126f75d552fc611f4f0ccc1dc7f27d9497ffe55c45a54436c-pod',
      startTime: '2023-03-16T01:00:10Z',
      steps: [
        {
          container: 'step-query-pyxis',
          imageID:
            'registry.access.redhat.com/ubi8/ubi-minimal@sha256:ab03679e683010d485ef0399e056b09a38d7843ba4a36ee7dec337dd0037f7a7',
          name: 'query-pyxis',
          terminated: {
            containerID: 'cri-o://75f0f975e629f41f9b9a9f3ab4cf466c53a7e7b360e5580658b645c0e3c1682f',
            exitCode: 0,
            finishedAt: '2023-03-16T01:00:56Z',
            message:
              '[{"key":"PYXIS_HTTP_CODE","value":"404 docker.io library/openjdk\\n404 quay.io devfile/maven\\n","type":1}]',
            reason: 'Completed',
            startedAt: '2023-03-16T01:00:55Z',
          },
        },
        {
          container: 'step-run-conftest',
          imageID:
            'quay.io/redhat-appstudio/hacbs-test@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
          name: 'run-conftest',
          terminated: {
            containerID: 'cri-o://9a25c1206064cde2c38a6499d35cb764cfb82bffddaef706246117905a0b7156',
            exitCode: 0,
            finishedAt: '2023-03-16T01:00:56Z',
            message:
              '[{"key":"TEST_OUTPUT","value":"{\\"result\\":\\"ERROR\\",\\"timestamp\\":\\"1678928456\\",\\"note\\":\\"For more details please visit the logs in workspace of Tekton tasks.\\",\\"namespace\\":\\"required_checks\\",\\"successes\\":0,\\"failures\\":0,\\"warnings\\":0}\\n","type":1},{"key":"PYXIS_HTTP_CODE","value":"404 docker.io library/openjdk\\n404 quay.io devfile/maven\\n","type":1}]',
            reason: 'Completed',
            startedAt: '2023-03-16T01:00:56Z',
          },
        },
      ],
      results: [
        {
          name: 'PYXIS_HTTP_CODE',
          type: 'string',
          value: '404 docker.io library/openjdk\n404 quay.io devfile/maven\n',
        },
        {
          name: 'TEST_OUTPUT',
          type: 'string',
          value:
            '{"result":"ERROR","timestamp":"1678928456","note":"For more details please visit the logs in workspace of Tekton tasks.","namespace":"required_checks","successes":0,"failures":0,"warnings":0}\n',
        },
      ],
      taskSpec: {
        params: [
          {
            default: '/project/repository/',
            description: 'Path to the directory containing conftest policies',
            name: 'POLICY_DIR',
            type: 'string',
          },
          {
            default: 'required_checks',
            description: 'Namespace for the conftest policy',
            name: 'POLICY_NAMESPACE',
            type: 'string',
          },
          {
            description: 'Digests of the base images used for build',
            name: 'BASE_IMAGES_DIGESTS',
            type: 'string',
          },
        ],
        results: [
          {
            description: 'HTTP code returned by Pyxis API endpoint',
            name: 'PYXIS_HTTP_CODE',
            type: 'string',
          },
          {
            description: 'Test output',
            name: 'TEST_OUTPUT',
            type: 'string',
          },
        ],
        steps: [
          {
            env: [
              {
                name: 'BASE_IMAGES_DIGESTS',
                value:
                  'docker.io/library/openjdk:11-jdk@sha256:99bac5bf83633e3c7399aed725c8415e7b569b54e03e4599e580fc9cdb7c21ab\nquay.io/devfile/maven:3.8.1-openjdk-17-slim@sha256:a65cb519660f51b06f487a6f5de8c264e1e2bcdb32033f3f45b0899f7740ca0f\n',
              },
            ],
            image:
              'registry.access.redhat.com/ubi8/ubi-minimal:8.7-1085@sha256:dc06ba83c6f47fc0a2bca516a9b99f1cf8ef37331fd460f4ca55579a815ee6cb',
            name: 'query-pyxis',
            resources: {},
            script:
              '#!/usr/bin/env bash\nreadarray -t IMAGE_ARRAY < <(echo -n "$BASE_IMAGES_DIGESTS" | sed \'s/\\\\n/\\\'$\'\\n\'\'/g\')\nfor BASE_IMAGE in ${IMAGE_ARRAY[@]};\ndo\n  IFS=:\'/\' read -r IMAGE_REGISTRY IMAGE_WITH_TAG <<< $BASE_IMAGE; echo "[$IMAGE_REGISTRY] [$IMAGE_WITH_TAG]"\n  IMAGE_REPOSITORY=`echo $IMAGE_WITH_TAG | cut -d ":" -f1`\n  IMAGE_REGISTRY=${IMAGE_REGISTRY//registry.redhat.io/registry.access.redhat.com}\n  export IMAGE_REPO_PATH=/workspace/sanity-ws/${IMAGE_REPOSITORY}\n  mkdir -p ${IMAGE_REPO_PATH}\n  echo "Querying Pyxis for $BASE_IMAGE..."\n  http_code=$(curl -s -k -o ${IMAGE_REPO_PATH}/repository_data.json -w \'%{http_code}\' "https://catalog.redhat.com/api/containers/v1/repositories/registry/${IMAGE_REGISTRY}/repository/${IMAGE_REPOSITORY}")\n  echo "Response code: $http_code"\n  echo $http_code $IMAGE_REGISTRY $IMAGE_REPOSITORY>> /tekton/results/PYXIS_HTTP_CODE\ndone\n',
          },
          {
            env: [
              {
                name: 'POLICY_DIR',
                value: '/project/repository/',
              },
              {
                name: 'POLICY_NAMESPACE',
                value: 'required_checks',
              },
            ],
            image:
              'quay.io/redhat-appstudio/hacbs-test:v1.0.11@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
            name: 'run-conftest',
            resources: {},
            script:
              '#!/usr/bin/env sh\nsource /utils.sh\n\nsuccess_counter=0\nfailure_counter=0\nerror_counter=0\nif [ ! -f /tekton/results/PYXIS_HTTP_CODE ]; then\n  error_counter=$((error_counter++))\nfi\nwhile IFS= read -r line\ndo\n  IFS=:\' \' read -r http_code IMAGE_REGISTRY IMAGE_REPOSITORY <<< $line; echo "[$http_code] [$IMAGE_REGISTRY] [$IMAGE_REPOSITORY]"\n  export IMAGE_REPO_PATH=/workspace/sanity-ws/${IMAGE_REPOSITORY}\n  if [ "$http_code" == "200" ];\n  then\n    echo "Running conftest using $POLICY_DIR policy, $POLICY_NAMESPACE namespace"\n    /usr/bin/conftest test --no-fail ${IMAGE_REPO_PATH}/repository_data.json \\\n    --policy $POLICY_DIR --namespace $POLICY_NAMESPACE \\\n    --output=json 2> ${IMAGE_REPO_PATH}/stderr.txt | tee ${IMAGE_REPO_PATH}/deprecated_image_check_output.json\n\n    failure_counter=$((failure_counter+$(jq -r \'.[].failures|length\' ${IMAGE_REPO_PATH}/deprecated_image_check_output.json)))\n    success_counter=$((success_counter+$(jq -r \'.[].successes\' ${IMAGE_REPO_PATH}/deprecated_image_check_output.json)))\n\n  elif [ "$http_code" == "404" ];\n  then\n    echo "Registry/image ${IMAGE_REGISTRY}/${IMAGE_REPOSITORY} not found in Pyxis" >> /workspace/sanity-ws/stderr.txt\n    cat /workspace/sanity-ws/stderr.txt\n  else\n    echo "Unexpected error (HTTP code $http_code) occured for registry/image ${IMAGE_REGISTRY}/${IMAGE_REPOSITORY}" >> /workspace/sanity-ws/stderr.txt\n    cat /workspace/sanity-ws/stderr.txt\n    error_counter=$((error_counter++))\n    exit 0\n  fi\ndone < /tekton/results/PYXIS_HTTP_CODE\n\nHACBS_ERROR_OUTPUT=$(make_result_json -r ERROR -n "$POLICY_NAMESPACE")\nif [[ "$error_counter" == 0 && "$success_counter" > 0 ]];\nthen\n  if [[ "${failure_counter}" -gt 0 ]]; then RES="FAILURE"; else RES="SUCCESS"; fi\n  TEST_OUTPUT=$(make_result_json \\\n    -r "${RES}" -n "$POLICY_NAMESPACE" \\\n    -s "${success_counter}" -f "${failure_counter}")\nfi\necho "${TEST_OUTPUT:-${HACBS_ERROR_OUTPUT}}" | tee /tekton/results/TEST_OUTPUT\n',
          },
        ],
        workspaces: [
          {
            name: 'sanity-ws',
          },
        ],
      },
    },
  },
  {
    apiVersion: 'tekton.dev/v1',
    kind: 'TaskRun',
    metadata: {
      annotations: {
        'pipelinesascode.tekton.dev/on-target-branch': '[main,master]',
        'pipeline.tekton.dev/release': '9ec444e',
        'pipelinesascode.tekton.dev/repo-url': 'https://github.com/test-repo/human-resources',
        'pipelinesascode.tekton.dev/sha-title': 'Update tekton references',
        'tekton.dev/tags': 'appstudio, hacbs',
        'results.tekton.dev/record':
          'test-tenant/results/014c3e9f-90e9-4cd4-83eb-f0fdd8fe6714/records/974bdf23-243f-48e1-ac9c-4311f88dcb52',
        'pipelinesascode.tekton.dev/git-auth-secret': 'pac-gitauth-zzez',
        'results.tekton.dev/log':
          'test-tenant/results/014c3e9f-90e9-4cd4-83eb-f0fdd8fe6714/logs/65098f1e-7be5-36a0-9fbb-f067df9ca792',
        'chains.tekton.dev/signed': 'true',
        'tekton.dev/pipelines.minVersion': '0.12.1',
        'results.tekton.dev/result': 'test-tenant/results/014c3e9f-90e9-4cd4-83eb-f0fdd8fe6714',
        'pipelinesascode.tekton.dev/log-url':
          'https://console-openshift-console.apps.stone-prd-m01.84db.p1.openshiftapps.com/k8s/ns/test-tenant/tekton.dev~v1beta1~PipelineRun/human-resources-clkq-on-pull-request-xn5nd',
        'build.appstudio.redhat.com/target_branch': 'main',
        'pipelinesascode.tekton.dev/max-keep-runs': '3',
        'build.appstudio.redhat.com/pull_request_number': '2',
        'pipelinesascode.tekton.dev/sha-url':
          'https://github.com/test-repo/human-resources/commit/36e49113fc391cc1a4723afb0269a88c9e54608d',
        'pipelinesascode.tekton.dev/on-event': '[pull_request]',
        'pipelinesascode.tekton.dev/installation-id': '34687113',
        'build.appstudio.redhat.com/commit_sha': '36e49113fc391cc1a4723afb0269a88c9e54608d',
      },
      resourceVersion: '62164787',
      name: 'human-resources-clkq-on-pull-request-xn5nd-sanity-inspect-image',
      uid: '974bdf23-243f-48e1-ac9c-4311f88dcb52',
      creationTimestamp: '2023-03-16T01:00:08Z',
      generation: 1,
      namespace: 'test-tenant',
      ownerReferences: [
        {
          apiVersion: 'tekton.dev/v1',
          blockOwnerDeletion: true,
          controller: true,
          kind: 'PipelineRun',
          name: 'human-resources-clkq-on-pull-request-xn5nd',
          uid: '014c3e9f-90e9-4cd4-83eb-f0fdd8fe6714',
        },
      ],
      finalizers: ['chains.tekton.dev'],
      labels: {
        'pipelinesascode.tekton.dev/state': 'started',
        'tekton.dev/memberOf': 'tasks',
        'appstudio.openshift.io/component': 'human-resources-clkq',
        'pipelinesascode.tekton.dev/sender': 'rh-trusted-application-pipeline__bot',
        'app.kubernetes.io/version': 'v0.15.0',
        'tekton.dev/pipeline': 'human-resources-clkq-on-pull-request-xn5nd',
        'app.kubernetes.io/managed-by': 'pipelinesascode.tekton.dev',
        'pipelinesascode.tekton.dev/check-run-id': '12037335647',
        'pipelinesascode.tekton.dev/branch': 'main',
        'appstudio.openshift.io/application': 'my-test-output',
        'tekton.dev/task': 'sanity-inspect-image',
        'pipelinesascode.tekton.dev/url-org': 'test-repo',
        'tekton.dev/pipelineTask': 'sanity-inspect-image',
        'pipelinesascode.tekton.dev/original-prname': 'human-resources-clkq-on-pull-request',
        'pipelinesascode.tekton.dev/pull-request': '2',
        'pipelines.appstudio.openshift.io/type': 'build',
        'pipelinesascode.tekton.dev/url-repository': 'human-resources',
        'tekton.dev/pipelineRun': 'human-resources-clkq-on-pull-request-xn5nd',
        'pipelinesascode.tekton.dev/repository': 'human-resources-clkq',
        'pipelinesascode.tekton.dev/sha': '36e49113fc391cc1a4723afb0269a88c9e54608d',
        'pipelinesascode.tekton.dev/git-provider': 'github',
        'pipelinesascode.tekton.dev/event-type': 'pull_request',
      },
    },
    spec: {
      params: [
        {
          name: 'IMAGE_URL',
          value:
            'quay.io/redhat-appstudio/user-workload:on-pr-36e49113fc391cc1a4723afb0269a88c9e54608d',
        },
        {
          name: 'IMAGE_DIGEST',
          value: 'sha256:02d4920c04cad24ef1a8058bc31f08a76182e80cc8288712ea764ce45e3406b1',
        },
        {
          name: 'DOCKER_AUTH',
          value: 'human-resources-clkq-on-pull-request-xn5nd',
        },
      ],
      resources: {},
      serviceAccountName: 'appstudio-pipeline',
      taskRef: {
        bundle:
          'quay.io/redhat-appstudio-tekton-catalog/task-sanity-inspect-image:0.1@sha256:fd4efd9d12eea3a8d47532c4226e685618845d0ba95abb98e008020243d96301',
        kind: 'Task',
        name: 'sanity-inspect-image',
      },
      timeout: '1h0m0s',
      workspaces: [
        {
          name: 'source',
          persistentVolumeClaim: {
            claimName: 'pvc-ce2179a49a',
          },
        },
      ],
    },
    status: {
      completionTime: '2023-03-16T01:01:05Z',
      conditions: [
        {
          lastTransitionTime: '2023-03-16T01:01:05Z',
          message: 'All Steps have completed executing',
          reason: 'Succeeded',
          status: 'True',
          type: 'Succeeded',
        },
      ],
      podName: 'human-resources-clkq-on-puld10ceb6b41a43f87c789f6c0c52d53d1-pod',
      startTime: '2023-03-16T01:00:09Z',
      steps: [
        {
          container: 'step-inspect-image',
          imageID:
            'quay.io/redhat-appstudio/hacbs-test@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
          name: 'inspect-image',
          terminated: {
            containerID: 'cri-o://2ea94f5301f580327020918eb824be3b09030c169f60578abd32ebc326a7cdbe',
            exitCode: 0,
            finishedAt: '2023-03-16T01:01:04Z',
            message:
              '[{"key":"BASE_IMAGE","value":"docker.io/library/openjdk@sha256:e81b7f317654b0f26d3993e014b04bcb29250339b11b9de41e130feecd4cd43c","type":1},{"key":"BASE_IMAGE_REPOSITORY","value":"library/openjdk","type":1},{"key":"TEST_OUTPUT","value":"{\\"result\\":\\"SUCCESS\\",\\"timestamp\\":\\"1678928464\\",\\"note\\":\\"For more details please visit the logs in workspace of Tekton tasks.\\",\\"namespace\\":\\"default\\",\\"successes\\":1,\\"failures\\":0,\\"warnings\\":0}\\n","type":1}]',
            reason: 'Completed',
            startedAt: '2023-03-16T01:01:02Z',
          },
        },
      ],
      results: [
        {
          name: 'BASE_IMAGE',
          type: 'string',
          value:
            'docker.io/library/openjdk@sha256:e81b7f317654b0f26d3993e014b04bcb29250339b11b9de41e130feecd4cd43c',
        },
        {
          name: 'BASE_IMAGE_REPOSITORY',
          type: 'string',
          value: 'library/openjdk',
        },
        {
          name: 'TEST_OUTPUT',
          type: 'string',
          value:
            '{"result":"SUCCESS","timestamp":"1678928464","note":"For more details please visit the logs in workspace of Tekton tasks.","namespace":"default","successes":1,"failures":0,"warnings":0}\n',
        },
      ],
      taskSpec: {
        description: 'Get manifest data for the source image and its base image to workspace',
        params: [
          {
            description: 'the fully qualified image name',
            name: 'IMAGE_URL',
            type: 'string',
          },
          {
            description: 'image digest',
            name: 'IMAGE_DIGEST',
            type: 'string',
          },
          {
            description: 'secret with config.json for container auth',
            name: 'DOCKER_AUTH',
            type: 'string',
          },
        ],
        results: [
          {
            description: 'Base image the source image is built from',
            name: 'BASE_IMAGE',
            type: 'string',
          },
          {
            description: 'Base image repository URL',
            name: 'BASE_IMAGE_REPOSITORY',
            type: 'string',
          },
          {
            description: 'Test output',
            name: 'TEST_OUTPUT',
            type: 'string',
          },
        ],
        steps: [
          {
            env: [
              {
                name: 'DOCKER_CONFIG',
                value: '/secrets/registry-auth',
              },
              {
                name: 'IMAGE_URL',
                value:
                  'quay.io/redhat-appstudio/user-workload:on-pr-36e49113fc391cc1a4723afb0269a88c9e54608d',
              },
              {
                name: 'IMAGE_DIGEST',
                value: 'sha256:02d4920c04cad24ef1a8058bc31f08a76182e80cc8288712ea764ce45e3406b1',
              },
            ],
            image:
              'quay.io/redhat-appstudio/hacbs-test:v1.0.11@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
            name: 'inspect-image',
            resources: {},
            script:
              '#!/usr/bin/env bash\nsource /utils.sh\nIMAGE_INSPECT=image_inspect.json\nBASE_IMAGE_INSPECT=base_image_inspect.json\nRAW_IMAGE_INSPECT=raw_image_inspect.json\n\nIMAGE_URL="${IMAGE_URL}@${IMAGE_DIGEST}"\n# Given a tag and a the digest in the IMAGE_URL we opt to use the digest alone\n# this is because containers/image currently doesn\'t support image references\n# that contain both. See https://github.com/containers/image/issues/1736\nif [[ "${IMAGE_URL}" == *":"*"@"* ]]; then\n  IMAGE_URL="${IMAGE_URL/:*@/@}"\nfi\necho "Inspecting manifest for source image ${IMAGE_URL}"\nskopeo inspect --no-tags docker://"${IMAGE_URL}" > $IMAGE_INSPECT 2> stderr.txt || true\nskopeo inspect --no-tags --raw docker://"${IMAGE_URL}" > $RAW_IMAGE_INSPECT 2>> stderr.txt || true\n\nif [ ! -z $(cat stderr.txt) ]; then\n  echo "skopeo inspect fails, the sanity-inspect-image test meets the following error:"\n  cat stderr.txt\n  TEST_OUTPUT="$(make_result_json -r ERROR -t \'skopeo inspect meets errors\')"\n  echo "${TEST_OUTPUT}" | tee /tekton/results/TEST_OUTPUT\n  exit 0\nfi\necho "Getting base image manifest for source image ${IMAGE_URL}"\nBASE_IMAGE_NAME="$(jq -r ".annotations.\\"org.opencontainers.image.base.name\\"" $RAW_IMAGE_INSPECT)"\nBASE_IMAGE_DIGEST="$(jq -r ".annotations.\\"org.opencontainers.image.base.digest\\"" $RAW_IMAGE_INSPECT)"\nif [ $BASE_IMAGE_NAME == \'null\' ]; then\n  echo "Cannot get base image info from \'annotations\'"\n  echo "Trying to get base image info from \'Labels\'"\n  BASE_IMAGE_NAME="$(jq -r ".Labels.\\"org.opencontainers.image.base.name\\"" $IMAGE_INSPECT)"\n  BASE_IMAGE_DIGEST="$(jq -r ".annotations.\\"org.opencontainers.image.base.digest\\"" $IMAGE_INSPECT)"\n  if [ "$BASE_IMAGE_NAME" == \'null\' ]; then\n    echo "Cannot get base image info from \'Labels\', please check the source image ${IMAGE_URL}"\n    exit 0\n  fi\nfi\nif [ -z "$BASE_IMAGE_NAME" ]; then\n  echo "Source image ${IMAGE_URL} is built from scratch, so there is no base image"\n  exit 0\nfi\nBASE_IMAGE="${BASE_IMAGE_NAME%:*}@$BASE_IMAGE_DIGEST"\necho "The base image is $BASE_IMAGE, get its manifest now"\nskopeo inspect --no-tags docker://$BASE_IMAGE  > $BASE_IMAGE_INSPECT || true\necho -n "$BASE_IMAGE" | tee /tekton/results/BASE_IMAGE\n\nBASE_IMAGE_REPOSITORY="$(jq -r \'.Name | sub("[^/]+/"; "") | sub("[:@].*"; "")\' "$BASE_IMAGE_INSPECT")"\necho -n "$BASE_IMAGE_REPOSITORY" | tee /tekton/results/BASE_IMAGE_REPOSITORY\n\nTEST_OUTPUT="$(make_result_json -r SUCCESS -s 1)"\necho "${TEST_OUTPUT}" | tee /tekton/results/TEST_OUTPUT\n',
            securityContext: {
              capabilities: {
                add: ['SETFCAP'],
              },
              runAsUser: 0,
            },
            volumeMounts: [
              {
                mountPath: '/secrets/registry-auth',
                name: 'registry-auth',
              },
            ],
            workingDir: '/workspace/source/hacbs/sanity-inspect-image',
          },
        ],
        volumes: [
          {
            name: 'registry-auth',
            secret: {
              optional: true,
              secretName: 'human-resources-clkq-on-pull-request-xn5nd',
            },
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
  {
    apiVersion: 'tekton.dev/v1',
    kind: 'TaskRun',
    metadata: {
      annotations: {
        'pipelinesascode.tekton.dev/on-target-branch': '[main,master]',
        'pipeline.tekton.dev/release': '9ec444e',
        'pipelinesascode.tekton.dev/repo-url': 'https://github.com/test-repo/human-resources',
        'pipelinesascode.tekton.dev/sha-title': 'Update tekton references',
        'tekton.dev/tags': 'appstudio, hacbs',
        'results.tekton.dev/record':
          'test-tenant/results/014c3e9f-90e9-4cd4-83eb-f0fdd8fe6714/records/67689da5-75c7-4328-acae-15c335aca77a',
        'pipelinesascode.tekton.dev/git-auth-secret': 'pac-gitauth-zzez',
        'results.tekton.dev/log':
          'test-tenant/results/014c3e9f-90e9-4cd4-83eb-f0fdd8fe6714/logs/5a1ac285-b63a-3fda-b39a-29428482e95d',
        'chains.tekton.dev/signed': 'true',
        'tekton.dev/pipelines.minVersion': '0.12.1',
        'results.tekton.dev/result': 'test-tenant/results/014c3e9f-90e9-4cd4-83eb-f0fdd8fe6714',
        'pipelinesascode.tekton.dev/log-url':
          'https://console-openshift-console.apps.stone-prd-m01.84db.p1.openshiftapps.com/k8s/ns/test-tenant/tekton.dev~v1beta1~PipelineRun/human-resources-clkq-on-pull-request-xn5nd',
        'build.appstudio.redhat.com/target_branch': 'main',
        'pipelinesascode.tekton.dev/max-keep-runs': '3',
        'build.appstudio.redhat.com/pull_request_number': '2',
        'pipelinesascode.tekton.dev/sha-url':
          'https://github.com/test-repo/human-resources/commit/36e49113fc391cc1a4723afb0269a88c9e54608d',
        'pipelinesascode.tekton.dev/on-event': '[pull_request]',
        'pipelinesascode.tekton.dev/installation-id': '34687113',
        'build.appstudio.redhat.com/commit_sha': '36e49113fc391cc1a4723afb0269a88c9e54608d',
      },
      resourceVersion: '62192628',
      name: 'human-resources-clkq-on-pull-request-xn5nd-clair-scan',
      uid: '67689da5-75c7-4328-acae-15c335aca77a',
      creationTimestamp: '2023-03-16T01:00:08Z',
      generation: 1,
      namespace: 'test-tenant',
      ownerReferences: [
        {
          apiVersion: 'tekton.dev/v1',
          blockOwnerDeletion: true,
          controller: true,
          kind: 'PipelineRun',
          name: 'human-resources-clkq-on-pull-request-xn5nd',
          uid: '014c3e9f-90e9-4cd4-83eb-f0fdd8fe6714',
        },
      ],
      finalizers: ['chains.tekton.dev'],
      labels: {
        'pipelinesascode.tekton.dev/state': 'started',
        'tekton.dev/memberOf': 'tasks',
        'appstudio.openshift.io/component': 'human-resources-clkq',
        'pipelinesascode.tekton.dev/sender': 'rh-trusted-application-pipeline__bot',
        'app.kubernetes.io/version': 'v0.15.0',
        'tekton.dev/pipeline': 'human-resources-clkq-on-pull-request-xn5nd',
        'app.kubernetes.io/managed-by': 'pipelinesascode.tekton.dev',
        'pipelinesascode.tekton.dev/check-run-id': '12037335647',
        'pipelinesascode.tekton.dev/branch': 'main',
        'appstudio.openshift.io/application': 'my-test-output',
        'tekton.dev/task': 'clair-scan',
        'pipelinesascode.tekton.dev/url-org': 'test-repo',
        'tekton.dev/pipelineTask': 'clair-scan',
        'pipelinesascode.tekton.dev/original-prname': 'human-resources-clkq-on-pull-request',
        'pipelinesascode.tekton.dev/pull-request': '2',
        'pipelines.appstudio.openshift.io/type': 'build',
        'pipelinesascode.tekton.dev/url-repository': 'human-resources',
        'tekton.dev/pipelineRun': 'human-resources-clkq-on-pull-request-xn5nd',
        'pipelinesascode.tekton.dev/repository': 'human-resources-clkq',
        'pipelinesascode.tekton.dev/sha': '36e49113fc391cc1a4723afb0269a88c9e54608d',
        'pipelinesascode.tekton.dev/git-provider': 'github',
        'pipelinesascode.tekton.dev/event-type': 'pull_request',
      },
    },
    spec: {
      params: [
        {
          name: 'image-digest',
          value: 'sha256:02d4920c04cad24ef1a8058bc31f08a76182e80cc8288712ea764ce45e3406b1',
        },
        {
          name: 'image-url',
          value:
            'quay.io/redhat-appstudio/user-workload:on-pr-36e49113fc391cc1a4723afb0269a88c9e54608d',
        },
        {
          name: 'docker-auth',
          value: 'human-resources-clkq-on-pull-request-xn5nd',
        },
      ],
      resources: {},
      serviceAccountName: 'appstudio-pipeline',
      taskRef: {
        bundle:
          'quay.io/redhat-appstudio-tekton-catalog/task-clair-scan:0.1@sha256:fba8170329ab00b864ee7d16e0358df4c4386880e10894fd7bbbb1457112477b',
        kind: 'Task',
        name: 'clair-scan',
      },
      timeout: '1h0m0s',
    },
    status: {
      completionTime: '2023-03-16T01:01:13Z',
      conditions: [
        {
          lastTransitionTime: '2023-03-16T01:01:13Z',
          message: 'All Steps have completed executing',
          reason: 'Succeeded',
          status: 'True',
          type: 'Succeeded',
        },
      ],
      podName: 'human-resources-clkq-on-pull-request-xn5nd-clair-scan-pod',
      startTime: '2023-03-16T01:00:11Z',
      steps: [
        {
          container: 'step-get-vulnerabilities',
          imageID:
            'quay.io/redhat-appstudio/clair-in-ci@sha256:dfdcbdd61bb36a23b1675b8490e248323104fb04af1f30ebfba04efc382fe167',
          name: 'get-vulnerabilities',
          terminated: {
            containerID: 'cri-o://d70018a30bccee9c8dd997de3c1d51708a19da4f3bfc8709fe7366e029f3a35c',
            exitCode: 0,
            finishedAt: '2023-03-16T01:01:10Z',
            reason: 'Completed',
            startedAt: '2023-03-16T01:00:31Z',
          },
        },
        {
          container: 'step-conftest-vulnerabilities',
          imageID:
            'quay.io/redhat-appstudio/hacbs-test@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
          name: 'conftest-vulnerabilities',
          terminated: {
            containerID: 'cri-o://4663a332f0e18ef47c572d2d59a7296f92414c50d1d0faa5856f91388fe5d110',
            exitCode: 0,
            finishedAt: '2023-03-16T01:01:11Z',
            reason: 'Completed',
            startedAt: '2023-03-16T01:01:11Z',
          },
        },
        {
          container: 'step-test-format-result',
          imageID:
            'quay.io/redhat-appstudio/hacbs-test@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
          name: 'test-format-result',
          terminated: {
            containerID: 'cri-o://21cec6cf1d2fd36c879d6088ffe3c813be9254dfb71b7a7de69e3d7897ee25e7',
            exitCode: 0,
            finishedAt: '2023-03-16T01:01:11Z',
            message:
              '[{"key":"SCAN_OUTPUT","value":"{\\"vulnerabilities\\":{\\"critical\\":1,\\"high\\":1,\\"medium\\":1,\\"low\\":1}}\\n","type":1},{"key":"TEST_OUTPUT","value":"{\\"result\\":\\"SUCCESS\\",\\"timestamp\\":\\"1678928471\\",\\"note\\":\\"Please refer to result SCAN_OUTPUT for the vulnerabilities scanned by clair\\",\\"namespace\\":\\"default\\",\\"successes\\":0,\\"failures\\":0,\\"warnings\\":0}\\n","type":1}]',
            reason: 'Completed',
            startedAt: '2023-03-16T01:01:11Z',
          },
        },
      ],
      results: [
        {
          name: 'SCAN_OUTPUT',
          type: 'string',
          value: '{"vulnerabilities":{"critical":1,"high":1,"medium":1,"low":1}}\n',
        },
        {
          name: 'TEST_OUTPUT',
          type: 'string',
          value:
            '{"result":"SUCCESS","timestamp":"1678928471","note":"Please refer to result SCAN_OUTPUT for the vulnerabilities scanned by clair","namespace":"default","successes":0,"failures":0,"warnings":0}\n',
        },
      ],
      taskSpec: {
        params: [
          {
            description: 'Image digest to scan',
            name: 'image-digest',
            type: 'string',
          },
          {
            description: 'Url to image',
            name: 'image-url',
            type: 'string',
          },
          {
            default: '',
            description: 'folder with config.json for container auth',
            name: 'docker-auth',
            type: 'string',
          },
        ],
        results: [
          {
            description: 'test output',
            name: 'TEST_OUTPUT',
            type: 'string',
          },
          {
            description: 'clair scan result',
            name: 'SCAN_OUTPUT',
            type: 'string',
          },
        ],
        steps: [
          {
            env: [
              {
                name: 'DOCKER_CONFIG',
                value: 'human-resources-clkq-on-pull-request-xn5nd',
              },
              {
                name: 'IMAGE_URL',
                value:
                  'quay.io/redhat-appstudio/user-workload:on-pr-36e49113fc391cc1a4723afb0269a88c9e54608d',
              },
              {
                name: 'IMAGE_DIGEST',
                value: 'sha256:02d4920c04cad24ef1a8058bc31f08a76182e80cc8288712ea764ce45e3406b1',
              },
            ],
            image: 'quay.io/redhat-appstudio/clair-in-ci:latest',
            imagePullPolicy: 'Always',
            name: 'get-vulnerabilities',
            resources: {},
            script:
              '#!/usr/bin/env bash\n\nimagewithouttag=$(echo $IMAGE_URL | sed "s/\\(.*\\):.*/\\1/" | tr -d \'\\n\')\n# strip new-line escape symbol from parameter and save it to variable\nimageanddigest=$(echo $imagewithouttag@$IMAGE_DIGEST)\n\nclair-action report --image-ref=$imageanddigest --db-path=/tmp/matcher.db --format=quay > /tekton/home/clair-result.json || true\n',
          },
          {
            image:
              'quay.io/redhat-appstudio/hacbs-test:v1.0.11@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
            name: 'conftest-vulnerabilities',
            resources: {},
            script:
              'if [ ! -s /tekton/home/clair-result.json ]; then\n  echo "Previous step [get-vulnerabilities] failed, /tekton/home/clair-result.json is empty."\nelse\n  /usr/bin/conftest test --no-fail /tekton/home/clair-result.json \\\n  --policy /project/clair/vulnerabilities-check.rego --namespace required_checks \\\n  --output=json | tee /tekton/home/clair-vulnerabilities.json || true\nfi\n',
            securityContext: {
              capabilities: {
                add: ['SETFCAP'],
              },
            },
          },
          {
            image:
              'quay.io/redhat-appstudio/hacbs-test:v1.0.11@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
            name: 'test-format-result',
            resources: {},
            script:
              '#!/usr/bin/env bash\n. /utils.sh\n\nif [[ ! -f /tekton/home/clair-vulnerabilities.json ]] || [[ "$(jq \'.[] | has("failures")\' /tekton/home/clair-vulnerabilities.json)" == "false" ]]; then\n  TEST_OUTPUT=$(make_result_json -r "ERROR" -t "/tekton/home/clair-vulnerabilities.json is not generated correctly, please check again")\n  echo "/tekton/home/clair-vulnerabilities.json is not generated correctly, please check again"\n  echo "${TEST_OUTPUT}" | tee /tekton/results/TEST_OUTPUT\n  exit 0\nfi\n\njq -rce \\\n  \'{vulnerabilities:{\n      critical: (.[] | .failures | map(select(.metadata.details.name=="clair_critical_vulnerabilities")) | length),\n      high: (.[] | .failures | map(select(.metadata.details.name=="clair_high_vulnerabilities")) | length),\n      medium: (.[] | .failures | map(select(.metadata.details.name=="clair_medium_vulnerabilities")) | length),\n      low: (.[] | .failures | map(select(.metadata.details.name=="clair_low_vulnerabilities")) | length)\n    }}\' /tekton/home/clair-vulnerabilities.json | tee /tekton/results/SCAN_OUTPUT\n\nTEST_OUTPUT=$(make_result_json -r "SUCCESS" -t "Please refer to result SCAN_OUTPUT for the vulnerabilities scanned by clair")\necho "${TEST_OUTPUT}" | tee /tekton/results/TEST_OUTPUT\n',
          },
        ],
      },
    },
  },
  {
    apiVersion: 'tekton.dev/v1',
    kind: 'TaskRun',
    metadata: {
      annotations: {
        'pipelinesascode.tekton.dev/on-target-branch': '[main,master]',
        'pipeline.tekton.dev/release': '9ec444e',
        'pipelinesascode.tekton.dev/repo-url': 'https://github.com/test-repo/human-resources',
        'pipelinesascode.tekton.dev/sha-title': 'Update tekton references',
        'tekton.dev/tags': 'appstudio, hacbs',
        'results.tekton.dev/record':
          'test-tenant/results/014c3e9f-90e9-4cd4-83eb-f0fdd8fe6714/records/75d26a7a-b3ea-46c0-9ea7-9c31fb5d38c0',
        'pipelinesascode.tekton.dev/git-auth-secret': 'pac-gitauth-zzez',
        'results.tekton.dev/log':
          'test-tenant/results/014c3e9f-90e9-4cd4-83eb-f0fdd8fe6714/logs/6102adfa-d467-3931-8de3-46e8bc8f5637',
        'chains.tekton.dev/signed': 'true',
        'tekton.dev/pipelines.minVersion': '0.12.1',
        'results.tekton.dev/result': 'test-tenant/results/014c3e9f-90e9-4cd4-83eb-f0fdd8fe6714',
        'pipelinesascode.tekton.dev/log-url':
          'https://console-openshift-console.apps.stone-prd-m01.84db.p1.openshiftapps.com/k8s/ns/test-tenant/tekton.dev~v1beta1~PipelineRun/human-resources-clkq-on-pull-request-xn5nd',
        'build.appstudio.redhat.com/target_branch': 'main',
        'pipelinesascode.tekton.dev/max-keep-runs': '3',
        'build.appstudio.redhat.com/pull_request_number': '2',
        'pipelinesascode.tekton.dev/sha-url':
          'https://github.com/test-repo/human-resources/commit/36e49113fc391cc1a4723afb0269a88c9e54608d',
        'pipelinesascode.tekton.dev/on-event': '[pull_request]',
        'pipelinesascode.tekton.dev/installation-id': '34687113',
        'build.appstudio.redhat.com/commit_sha': '36e49113fc391cc1a4723afb0269a88c9e54608d',
      },
      resourceVersion: '62217733',
      name: 'hum1e2c0e3126f75d552fc611f4aeae38ab-sanity-optional-label-check',
      uid: '75d26a7a-b3ea-46c0-9ea7-9c31fb5d38c0',
      creationTimestamp: '2023-03-16T01:01:12Z',
      generation: 1,
      namespace: 'test-tenant',
      ownerReferences: [
        {
          apiVersion: 'tekton.dev/v1',
          blockOwnerDeletion: true,
          controller: true,
          kind: 'PipelineRun',
          name: 'human-resources-clkq-on-pull-request-xn5nd',
          uid: '014c3e9f-90e9-4cd4-83eb-f0fdd8fe6714',
        },
      ],
      finalizers: ['chains.tekton.dev'],
      labels: {
        'pipelinesascode.tekton.dev/state': 'started',
        'tekton.dev/memberOf': 'tasks',
        'appstudio.openshift.io/component': 'human-resources-clkq',
        'pipelinesascode.tekton.dev/sender': 'rh-trusted-application-pipeline__bot',
        'app.kubernetes.io/version': 'v0.15.0',
        'tekton.dev/pipeline': 'human-resources-clkq-on-pull-request-xn5nd',
        'app.kubernetes.io/managed-by': 'pipelinesascode.tekton.dev',
        'pipelinesascode.tekton.dev/check-run-id': '12037335647',
        'pipelinesascode.tekton.dev/branch': 'main',
        'appstudio.openshift.io/application': 'my-test-output',
        'tekton.dev/task': 'sanity-label-check',
        'pipelinesascode.tekton.dev/url-org': 'test-repo',
        'tekton.dev/pipelineTask': 'sanity-optional-label-check',
        'pipelinesascode.tekton.dev/original-prname': 'human-resources-clkq-on-pull-request',
        'pipelinesascode.tekton.dev/pull-request': '2',
        'pipelines.appstudio.openshift.io/type': 'build',
        'pipelinesascode.tekton.dev/url-repository': 'human-resources',
        'tekton.dev/pipelineRun': 'human-resources-clkq-on-pull-request-xn5nd',
        'pipelinesascode.tekton.dev/repository': 'human-resources-clkq',
        'pipelinesascode.tekton.dev/sha': '36e49113fc391cc1a4723afb0269a88c9e54608d',
        'pipelinesascode.tekton.dev/git-provider': 'github',
        'pipelinesascode.tekton.dev/event-type': 'pull_request',
      },
    },
    spec: {
      params: [
        {
          name: 'POLICY_NAMESPACE',
          value: 'optional_checks',
        },
      ],
      resources: {},
      serviceAccountName: 'appstudio-pipeline',
      taskRef: {
        bundle:
          'quay.io/redhat-appstudio-tekton-catalog/task-sanity-label-check:0.1@sha256:534770bf7a7c10277ab5f9c1e7b766abbffb343cc864dd9545aecc5278257dc3',
        kind: 'Task',
        name: 'sanity-label-check',
      },
      timeout: '1h0m0s',
      workspaces: [
        {
          name: 'workspace',
          persistentVolumeClaim: {
            claimName: 'pvc-ce2179a49a',
          },
        },
      ],
    },
    status: {
      completionTime: '2023-03-16T01:01:49Z',
      conditions: [
        {
          lastTransitionTime: '2023-03-16T01:01:49Z',
          message: 'All Steps have completed executing',
          reason: 'Succeeded',
          status: 'True',
          type: 'Succeeded',
        },
      ],
      podName: 'hum1e2c0e3126f75d552fc611f4c8c772f2af66f8c1e581d3afedf329de-pod',
      startTime: '2023-03-16T01:01:12Z',
      steps: [
        {
          container: 'step-basic-sanity-checks-required-labels',
          imageID:
            'quay.io/redhat-appstudio/hacbs-test@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
          name: 'basic-sanity-checks-required-labels',
          terminated: {
            containerID: 'cri-o://d1eddf6acc6de2730745f163eb02ab73281caa42c010203127347718ec2bcf47',
            exitCode: 0,
            finishedAt: '2023-03-16T01:01:48Z',
            message:
              '[{"key":"TEST_OUTPUT","value":"{\\"result\\":\\"FAILURE\\",\\"timestamp\\":\\"1678928508\\",\\"note\\":\\"For more details please visit the logs in workspace of Tekton tasks.\\",\\"namespace\\":\\"optional_checks\\",\\"successes\\":5,\\"failures\\":2,\\"warnings\\":0}\\n","type":1}]',
            reason: 'Completed',
            startedAt: '2023-03-16T01:01:47Z',
          },
        },
      ],
      results: [
        {
          name: 'TEST_OUTPUT',
          type: 'string',
          value:
            '{"result":"FAILURE","timestamp":"1678928508","note":"For more details please visit the logs in workspace of Tekton tasks.","namespace":"optional_checks","successes":5,"failures":2,"warnings":0}\n',
        },
      ],
      taskSpec: {
        params: [
          {
            default: '/project/image/',
            description: 'Path to the directory containing conftest policies',
            name: 'POLICY_DIR',
            type: 'string',
          },
          {
            default: 'required_checks',
            description: 'Namespace for the conftest policy',
            name: 'POLICY_NAMESPACE',
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
            env: [
              {
                name: 'POLICY_NAMESPACE',
                value: 'optional_checks',
              },
              {
                name: 'POLICY_DIR',
                value: '/project/image/',
              },
            ],
            image:
              'quay.io/redhat-appstudio/hacbs-test:v1.0.11@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
            name: 'basic-sanity-checks-required-labels',
            resources: {},
            script:
              '#!/usr/bin/env bash\n\n. /utils.sh\nif [ ! -s ../sanity-inspect-image/image_inspect.json ]; then\n  echo "File ../sanity-inspect-image/image_inspect.json is not generated correctly, please check TEST_OUTPUT of task sanity-inspect-image"\n  TEST_OUTPUT="$(make_result_json -r ERROR -t \'File ../sanity-inspect-image/image_inspect.json is not generated correctly, please check TEST_OUTPUT of task sanity-inspect-image!\')"\n  echo "${TEST_OUTPUT}" | tee /tekton/results/TEST_OUTPUT\n  exit 0\nfi\n\nCONFTEST_OPTIONS=""\nif [ -s "../sanity-inspect-image/base_image_inspect.json" ]; then\n  CONFTEST_OPTIONS="-d=../sanity-inspect-image/base_image_inspect.json"\nfi\n\necho "Running conftest using $POLICY_DIR policy, $POLICY_NAMESPACE namespace"\n/usr/bin/conftest test --no-fail ../sanity-inspect-image/image_inspect.json "${CONFTEST_OPTIONS}" \\\n--policy $POLICY_DIR --namespace $POLICY_NAMESPACE \\\n--output=json 2> stderr.txt | tee sanity_label_check_output.json\n\nif [ ! -z $(cat stderr.txt) ]; then\n  echo "The sanity-label-check test meets the following error:"\n  cat stderr.txt\nfi\nHACBS_ERROR_OUTPUT=$(make_result_json -r "ERROR")\n\nTEST_OUTPUT=\nparse_hacbs_test_output sanity-label-check conftest sanity_label_check_output.json || true\n\necho "${TEST_OUTPUT:-${HACBS_ERROR_OUTPUT}}" | tee /tekton/results/TEST_OUTPUT\n',
            securityContext: {
              capabilities: {
                add: ['SETFCAP'],
              },
            },
            workingDir: '/workspace/workspace/hacbs/sanity-label-check-optional_checks',
          },
        ],
        workspaces: [
          {
            name: 'workspace',
          },
        ],
      },
    },
  },
  {
    apiVersion: 'tekton.dev/v1',
    kind: 'TaskRun',
    metadata: {
      annotations: {
        'pipelinesascode.tekton.dev/on-target-branch': '[main,master]',
        'pipeline.tekton.dev/release': '9ec444e',
        'pipelinesascode.tekton.dev/repo-url': 'https://github.com/test-repo/human-resources',
        'pipelinesascode.tekton.dev/sha-title': 'Update tekton references',
        'tekton.dev/tags': 'appstudio, hacbs',
        'results.tekton.dev/record':
          'test-tenant/results/014c3e9f-90e9-4cd4-83eb-f0fdd8fe6714/records/1a5999b7-6fbc-462e-ae71-c2348fd9dc54',
        'pipelinesascode.tekton.dev/git-auth-secret': 'pac-gitauth-zzez',
        'results.tekton.dev/log':
          'test-tenant/results/014c3e9f-90e9-4cd4-83eb-f0fdd8fe6714/logs/d301b19d-4777-3063-9487-b868dd0154b6',
        'chains.tekton.dev/signed': 'true',
        'tekton.dev/pipelines.minVersion': '0.12.1',
        'results.tekton.dev/result': 'test-tenant/results/014c3e9f-90e9-4cd4-83eb-f0fdd8fe6714',
        'pipelinesascode.tekton.dev/log-url':
          'https://console-openshift-console.apps.stone-prd-m01.84db.p1.openshiftapps.com/k8s/ns/test-tenant/tekton.dev~v1beta1~PipelineRun/human-resources-clkq-on-pull-request-xn5nd',
        'build.appstudio.redhat.com/target_branch': 'main',
        'pipelinesascode.tekton.dev/max-keep-runs': '3',
        'build.appstudio.redhat.com/pull_request_number': '2',
        'pipelinesascode.tekton.dev/sha-url':
          'https://github.com/test-repo/human-resources/commit/36e49113fc391cc1a4723afb0269a88c9e54608d',
        'pipelinesascode.tekton.dev/on-event': '[pull_request]',
        'pipelinesascode.tekton.dev/installation-id': '34687113',
        'build.appstudio.redhat.com/commit_sha': '36e49113fc391cc1a4723afb0269a88c9e54608d',
      },
      resourceVersion: '62322682',
      name: 'human-resources-clkq-on-pull-request-xn5nd-sanity-label-check',
      uid: '1a5999b7-6fbc-462e-ae71-c2348fd9dc54',
      creationTimestamp: '2023-03-16T01:01:12Z',
      generation: 1,
      namespace: 'test-tenant',
      ownerReferences: [
        {
          apiVersion: 'tekton.dev/v1',
          blockOwnerDeletion: true,
          controller: true,
          kind: 'PipelineRun',
          name: 'human-resources-clkq-on-pull-request-xn5nd',
          uid: '014c3e9f-90e9-4cd4-83eb-f0fdd8fe6714',
        },
      ],
      finalizers: ['chains.tekton.dev'],
      labels: {
        'pipelinesascode.tekton.dev/state': 'started',
        'tekton.dev/memberOf': 'tasks',
        'appstudio.openshift.io/component': 'human-resources-clkq',
        'pipelinesascode.tekton.dev/sender': 'rh-trusted-application-pipeline__bot',
        'app.kubernetes.io/version': 'v0.15.0',
        'tekton.dev/pipeline': 'human-resources-clkq-on-pull-request-xn5nd',
        'app.kubernetes.io/managed-by': 'pipelinesascode.tekton.dev',
        'pipelinesascode.tekton.dev/check-run-id': '12037335647',
        'pipelinesascode.tekton.dev/branch': 'main',
        'appstudio.openshift.io/application': 'my-test-output',
        'tekton.dev/task': 'sanity-label-check',
        'pipelinesascode.tekton.dev/url-org': 'test-repo',
        'tekton.dev/pipelineTask': 'sanity-label-check',
        'pipelinesascode.tekton.dev/original-prname': 'human-resources-clkq-on-pull-request',
        'pipelinesascode.tekton.dev/pull-request': '2',
        'pipelines.appstudio.openshift.io/type': 'build',
        'pipelinesascode.tekton.dev/url-repository': 'human-resources',
        'tekton.dev/pipelineRun': 'human-resources-clkq-on-pull-request-xn5nd',
        'pipelinesascode.tekton.dev/repository': 'human-resources-clkq',
        'pipelinesascode.tekton.dev/sha': '36e49113fc391cc1a4723afb0269a88c9e54608d',
        'pipelinesascode.tekton.dev/git-provider': 'github',
        'pipelinesascode.tekton.dev/event-type': 'pull_request',
      },
    },
    spec: {
      resources: {},
      serviceAccountName: 'appstudio-pipeline',
      taskRef: {
        bundle:
          'quay.io/redhat-appstudio-tekton-catalog/task-sanity-label-check:0.1@sha256:534770bf7a7c10277ab5f9c1e7b766abbffb343cc864dd9545aecc5278257dc3',
        kind: 'Task',
        name: 'sanity-label-check',
      },
      timeout: '1h0m0s',
      workspaces: [
        {
          name: 'workspace',
          persistentVolumeClaim: {
            claimName: 'pvc-ce2179a49a',
          },
        },
      ],
    },
    status: {
      completionTime: '2023-03-16T01:01:48Z',
      conditions: [
        {
          lastTransitionTime: '2023-03-16T01:01:48Z',
          message: 'All Steps have completed executing',
          reason: 'Succeeded',
          status: 'True',
          type: 'Succeeded',
        },
      ],
      podName: 'human-resources-clkq-on-pul79484532268420afcba1b4b3cc52c9cb-pod',
      startTime: '2023-03-16T01:01:12Z',
      steps: [
        {
          container: 'step-basic-sanity-checks-required-labels',
          imageID:
            'quay.io/redhat-appstudio/hacbs-test@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
          name: 'basic-sanity-checks-required-labels',
          terminated: {
            containerID: 'cri-o://ef2f450dcd00d67eba9f560155b91b3790a1c1d3925026c5fc4c12d60ae808cd',
            exitCode: 0,
            finishedAt: '2023-03-16T01:01:47Z',
            message:
              '[{"key":"TEST_OUTPUT","value":"{\\"result\\":\\"FAILURE\\",\\"timestamp\\":\\"1678928507\\",\\"note\\":\\"For more details please visit the logs in workspace of Tekton tasks.\\",\\"namespace\\":\\"required_checks\\",\\"successes\\":8,\\"failures\\":13,\\"warnings\\":0}\\n","type":1}]',
            reason: 'Completed',
            startedAt: '2023-03-16T01:01:46Z',
          },
        },
      ],
      results: [
        {
          name: 'TEST_OUTPUT',
          type: 'string',
          value:
            '{"result":"FAILURE","timestamp":"1678928507","note":"For more details please visit the logs in workspace of Tekton tasks.","namespace":"required_checks","successes":8,"failures":13,"warnings":0}\n',
        },
      ],
      taskSpec: {
        params: [
          {
            default: '/project/image/',
            description: 'Path to the directory containing conftest policies',
            name: 'POLICY_DIR',
            type: 'string',
          },
          {
            default: 'required_checks',
            description: 'Namespace for the conftest policy',
            name: 'POLICY_NAMESPACE',
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
            env: [
              {
                name: 'POLICY_NAMESPACE',
                value: 'required_checks',
              },
              {
                name: 'POLICY_DIR',
                value: '/project/image/',
              },
            ],
            image:
              'quay.io/redhat-appstudio/hacbs-test:v1.0.11@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
            name: 'basic-sanity-checks-required-labels',
            resources: {},
            script:
              '#!/usr/bin/env bash\n\n. /utils.sh\nif [ ! -s ../sanity-inspect-image/image_inspect.json ]; then\n  echo "File ../sanity-inspect-image/image_inspect.json is not generated correctly, please check TEST_OUTPUT of task sanity-inspect-image"\n  TEST_OUTPUT="$(make_result_json -r ERROR -t \'File ../sanity-inspect-image/image_inspect.json is not generated correctly, please check TEST_OUTPUT of task sanity-inspect-image!\')"\n  echo "${TEST_OUTPUT}" | tee /tekton/results/TEST_OUTPUT\n  exit 0\nfi\n\nCONFTEST_OPTIONS=""\nif [ -s "../sanity-inspect-image/base_image_inspect.json" ]; then\n  CONFTEST_OPTIONS="-d=../sanity-inspect-image/base_image_inspect.json"\nfi\n\necho "Running conftest using $POLICY_DIR policy, $POLICY_NAMESPACE namespace"\n/usr/bin/conftest test --no-fail ../sanity-inspect-image/image_inspect.json "${CONFTEST_OPTIONS}" \\\n--policy $POLICY_DIR --namespace $POLICY_NAMESPACE \\\n--output=json 2> stderr.txt | tee sanity_label_check_output.json\n\nif [ ! -z $(cat stderr.txt) ]; then\n  echo "The sanity-label-check test meets the following error:"\n  cat stderr.txt\nfi\nHACBS_ERROR_OUTPUT=$(make_result_json -r "ERROR")\n\nTEST_OUTPUT=\nparse_hacbs_test_output sanity-label-check conftest sanity_label_check_output.json || true\n\necho "${TEST_OUTPUT:-${HACBS_ERROR_OUTPUT}}" | tee /tekton/results/TEST_OUTPUT\n',
            securityContext: {
              capabilities: {
                add: ['SETFCAP'],
              },
            },
            workingDir: '/workspace/workspace/hacbs/sanity-label-check-required_checks',
          },
        ],
        workspaces: [
          {
            name: 'workspace',
          },
        ],
      },
    },
  },
  {
    apiVersion: 'tekton.dev/v1',
    kind: 'TaskRun',
    metadata: {
      annotations: {
        'pipelinesascode.tekton.dev/on-target-branch': '[main,master]',
        'pipeline.tekton.dev/release': '9ec444e',
        'pipelinesascode.tekton.dev/repo-url': 'https://github.com/test-repo/human-resources',
        'pipelinesascode.tekton.dev/sha-title': 'Update tekton references',
        'tekton.dev/tags': 'appstudio, hacbs',
        'results.tekton.dev/record':
          'test-tenant/results/014c3e9f-90e9-4cd4-83eb-f0fdd8fe6714/records/18080900-3c03-4e70-ad4c-4da835a9d7c0',
        'pipelinesascode.tekton.dev/git-auth-secret': 'pac-gitauth-zzez',
        'results.tekton.dev/log':
          'test-tenant/results/014c3e9f-90e9-4cd4-83eb-f0fdd8fe6714/logs/70b6f116-6011-33ae-9e81-8b042791f216',
        'chains.tekton.dev/signed': 'true',
        'tekton.dev/pipelines.minVersion': '0.12.1',
        'results.tekton.dev/result': 'test-tenant/results/014c3e9f-90e9-4cd4-83eb-f0fdd8fe6714',
        'pipelinesascode.tekton.dev/log-url':
          'https://console-openshift-console.apps.stone-prd-m01.84db.p1.openshiftapps.com/k8s/ns/test-tenant/tekton.dev~v1beta1~PipelineRun/human-resources-clkq-on-pull-request-xn5nd',
        'build.appstudio.redhat.com/target_branch': 'main',
        'pipelinesascode.tekton.dev/max-keep-runs': '3',
        'build.appstudio.redhat.com/pull_request_number': '2',
        'pipelinesascode.tekton.dev/sha-url':
          'https://github.com/test-repo/human-resources/commit/36e49113fc391cc1a4723afb0269a88c9e54608d',
        'pipelinesascode.tekton.dev/on-event': '[pull_request]',
        'pipelinesascode.tekton.dev/installation-id': '34687113',
        'build.appstudio.redhat.com/commit_sha': '36e49113fc391cc1a4723afb0269a88c9e54608d',
      },
      resourceVersion: '62372475',
      name: 'human-resources-clkq-on-pull-request-xn5nd-init',
      uid: '18080900-3c03-4e70-ad4c-4da835a9d7c0',
      creationTimestamp: '2023-03-16T00:50:33Z',
      generation: 1,
      namespace: 'test-tenant',
      ownerReferences: [
        {
          apiVersion: 'tekton.dev/v1',
          blockOwnerDeletion: true,
          controller: true,
          kind: 'PipelineRun',
          name: 'human-resources-clkq-on-pull-request-xn5nd',
          uid: '014c3e9f-90e9-4cd4-83eb-f0fdd8fe6714',
        },
      ],
      finalizers: ['chains.tekton.dev'],
      labels: {
        'pipelinesascode.tekton.dev/state': 'started',
        'tekton.dev/memberOf': 'tasks',
        'appstudio.openshift.io/component': 'human-resources-clkq',
        'pipelinesascode.tekton.dev/sender': 'rh-trusted-application-pipeline__bot',
        'app.kubernetes.io/version': 'v0.15.0',
        'tekton.dev/pipeline': 'human-resources-clkq-on-pull-request-xn5nd',
        'app.kubernetes.io/managed-by': 'pipelinesascode.tekton.dev',
        'pipelinesascode.tekton.dev/check-run-id': '12037335647',
        'pipelinesascode.tekton.dev/branch': 'main',
        'appstudio.openshift.io/application': 'my-test-output',
        'tekton.dev/task': 'init',
        'pipelinesascode.tekton.dev/url-org': 'test-repo',
        'tekton.dev/pipelineTask': 'init',
        'pipelinesascode.tekton.dev/original-prname': 'human-resources-clkq-on-pull-request',
        'pipelinesascode.tekton.dev/pull-request': '2',
        'pipelines.appstudio.openshift.io/type': 'build',
        'pipelinesascode.tekton.dev/url-repository': 'human-resources',
        'tekton.dev/pipelineRun': 'human-resources-clkq-on-pull-request-xn5nd',
        'pipelinesascode.tekton.dev/repository': 'human-resources-clkq',
        'pipelinesascode.tekton.dev/sha': '36e49113fc391cc1a4723afb0269a88c9e54608d',
        'pipelinesascode.tekton.dev/git-provider': 'github',
        'pipelinesascode.tekton.dev/event-type': 'pull_request',
      },
    },
    spec: {
      params: [
        {
          name: 'image-url',
          value:
            'quay.io/redhat-appstudio/user-workload:on-pr-36e49113fc391cc1a4723afb0269a88c9e54608d',
        },
        {
          name: 'rebuild',
          value: 'false',
        },
        {
          name: 'skip-checks',
          value: 'false',
        },
        {
          name: 'pipelinerun-name',
          value: 'human-resources-clkq-on-pull-request-xn5nd',
        },
        {
          name: 'pipelinerun-uid',
          value: '014c3e9f-90e9-4cd4-83eb-f0fdd8fe6714',
        },
      ],
      resources: {},
      serviceAccountName: 'appstudio-pipeline',
      taskRef: {
        bundle:
          'quay.io/redhat-appstudio-tekton-catalog/task-init:0.1@sha256:5ce77110e2a49407a69a7922042dc0859f7e8f5f75dc0cd0bcc2d17860469bdb',
        kind: 'Task',
        name: 'init',
      },
      timeout: '1h0m0s',
    },
    status: {
      completionTime: '2023-03-16T00:50:57Z',
      conditions: [
        {
          lastTransitionTime: '2023-03-16T00:50:57Z',
          message: 'All Steps have completed executing',
          reason: 'Succeeded',
          status: 'True',
          type: 'Succeeded',
        },
      ],
      podName: 'human-resources-clkq-on-pull-request-xn5nd-init-pod',
      startTime: '2023-03-16T00:50:33Z',
      steps: [
        {
          container: 'step-init',
          imageID:
            'registry.redhat.io/openshift4/ose-tools-rhel8@sha256:253d042ecfad7b64593112a4aa3f528d39cb5fe738852e44f009db87964cf051',
          name: 'init',
          terminated: {
            containerID: 'cri-o://8dad7d0c8810dd2adf93e4e69215c88a366c03e23fdc5ff0ac2bcb556379c510',
            exitCode: 0,
            finishedAt: '2023-03-16T00:50:56Z',
            message:
              '[{"key":"build","value":"true","type":1},{"key":"container-registry-secret","value":"human-resources-clkq-on-pull-request-xn5nd","type":1}]',
            reason: 'Completed',
            startedAt: '2023-03-16T00:50:55Z',
          },
        },
      ],
      results: [
        {
          name: 'build',
          type: 'string',
          value: 'true',
        },
        {
          name: 'container-registry-secret',
          type: 'string',
          value: 'human-resources-clkq-on-pull-request-xn5nd',
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
          {
            default: 'false',
            description: 'Rebuild the image if exists',
            name: 'rebuild',
            type: 'string',
          },
          {
            default: 'false',
            description: 'skip checks against built image',
            name: 'skip-checks',
            type: 'string',
          },
          {
            name: 'pipelinerun-name',
            type: 'string',
          },
          {
            name: 'pipelinerun-uid',
            type: 'string',
          },
          {
            default: 'redhat-appstudio-user-workload',
            name: 'shared-secret',
            type: 'string',
          },
        ],
        results: [
          {
            name: 'build',
            type: 'string',
          },
          {
            description: 'Name of secret with credentials',
            name: 'container-registry-secret',
            type: 'string',
          },
        ],
        steps: [
          {
            env: [
              {
                name: 'PIPELINERUN_NAME',
                value: 'human-resources-clkq-on-pull-request-xn5nd',
              },
              {
                name: 'PIPELINERUN_UID',
                value: '014c3e9f-90e9-4cd4-83eb-f0fdd8fe6714',
              },
              {
                name: 'IMAGE_URL',
                value:
                  'quay.io/redhat-appstudio/user-workload:on-pr-36e49113fc391cc1a4723afb0269a88c9e54608d',
              },
              {
                name: 'REBUILD',
                value: 'false',
              },
              {
                name: 'SKIP_CHECKS',
                value: 'false',
              },
            ],
            image:
              'registry.redhat.io/openshift4/ose-tools-rhel8:v4.12@sha256:253d042ecfad7b64593112a4aa3f528d39cb5fe738852e44f009db87964cf051',
            name: 'init',
            resources: {},
            script:
              '#!/bin/bash\necho "Build Initialize: $IMAGE_URL"\necho\necho "Create pipelinerun repository secret"\nSHARED=/secret/default-push-secret/.dockerconfigjson\nexport DOCKER_CONFIG=/tmp/docker/\nmkdir -p $DOCKER_CONFIG\nif [ -f $SHARED ]; then\n  jq -M -s \'.[0] * .[1]\' $SHARED /root/.docker/config.json > $DOCKER_CONFIG/config.json\nelse\n  cp /root/.docker/config.json $DOCKER_CONFIG/config.json\nfi\noc create secret generic --from-file=$DOCKER_CONFIG/config.json $SHARED_PARAM $PIPELINERUN_NAME\noc patch secret $PIPELINERUN_NAME -p "{\\"metadata\\": {\\"ownerReferences\\": [{\\"apiVersion\\": \\"tekton.dev/v1beta1\\", \\"blockOwnerDeletion\\": false, \\"controller\\": true, \\"kind\\": \\"PipelineRun\\", \\"name\\": \\"$PIPELINERUN_NAME\\", \\"uid\\": \\"$PIPELINERUN_UID\\" }]}}"\necho -n $PIPELINERUN_NAME > /tekton/results/container-registry-secret\n\necho "Determine if Image Already Exists"\n# Build the image when image does not exists or rebuild is set to true\nif ! oc image info $IMAGE_URL &>/dev/null || [ "$REBUILD" == "true" ] || [ "$SKIP_CHECKS" == "false" ]; then\n  echo -n "true" > /tekton/results/build\nelse\n  echo -n "false" > /tekton/results/build\nfi\n',
            volumeMounts: [
              {
                mountPath: '/secret/default-push-secret',
                name: 'default-push-secret',
              },
            ],
          },
        ],
        volumes: [
          {
            csi: {
              driver: 'csi.sharedresource.openshift.io',
              readOnly: true,
              volumeAttributes: {
                sharedSecret: 'redhat-appstudio-user-workload',
              },
            },
            name: 'default-push-secret',
          },
        ],
      },
    },
  },
  {
    apiVersion: 'tekton.dev/v1',
    kind: 'TaskRun',
    metadata: {
      annotations: {
        'pipelinesascode.tekton.dev/on-target-branch': '[main,master]',
        'pipeline.tekton.dev/release': '9ec444e',
        'pipelinesascode.tekton.dev/repo-url': 'https://github.com/test-repo/human-resources',
        'pipelinesascode.tekton.dev/sha-title': 'Update tekton references',
        'tekton.dev/tags': 'virus, appstudio, hacbs',
        'results.tekton.dev/record':
          'test-tenant/results/014c3e9f-90e9-4cd4-83eb-f0fdd8fe6714/records/67ad4972-160b-417e-9caf-a8a6c370f69b',
        'pipelinesascode.tekton.dev/git-auth-secret': 'pac-gitauth-zzez',
        'results.tekton.dev/log':
          'test-tenant/results/014c3e9f-90e9-4cd4-83eb-f0fdd8fe6714/logs/98f18722-e196-38eb-9d33-967ca2ae50bc',
        'chains.tekton.dev/signed': 'true',
        'tekton.dev/pipelines.minVersion': '0.12.1',
        'results.tekton.dev/result': 'test-tenant/results/014c3e9f-90e9-4cd4-83eb-f0fdd8fe6714',
        'pipelinesascode.tekton.dev/log-url':
          'https://console-openshift-console.apps.stone-prd-m01.84db.p1.openshiftapps.com/k8s/ns/test-tenant/tekton.dev~v1beta1~PipelineRun/human-resources-clkq-on-pull-request-xn5nd',
        'build.appstudio.redhat.com/target_branch': 'main',
        'pipelinesascode.tekton.dev/max-keep-runs': '3',
        'build.appstudio.redhat.com/pull_request_number': '2',
        'pipelinesascode.tekton.dev/sha-url':
          'https://github.com/test-repo/human-resources/commit/36e49113fc391cc1a4723afb0269a88c9e54608d',
        'pipelinesascode.tekton.dev/on-event': '[pull_request]',
        'pipelinesascode.tekton.dev/installation-id': '34687113',
        'build.appstudio.redhat.com/commit_sha': '36e49113fc391cc1a4723afb0269a88c9e54608d',
      },
      resourceVersion: '62428739',
      name: 'human-resources-clkq-on-pull-request-xn5nd-clamav-scan',
      uid: '67ad4972-160b-417e-9caf-a8a6c370f69b',
      creationTimestamp: '2023-03-16T01:00:08Z',
      generation: 1,
      namespace: 'test-tenant',
      ownerReferences: [
        {
          apiVersion: 'tekton.dev/v1',
          blockOwnerDeletion: true,
          controller: true,
          kind: 'PipelineRun',
          name: 'human-resources-clkq-on-pull-request-xn5nd',
          uid: '014c3e9f-90e9-4cd4-83eb-f0fdd8fe6714',
        },
      ],
      finalizers: ['chains.tekton.dev'],
      labels: {
        'pipelinesascode.tekton.dev/state': 'started',
        'tekton.dev/memberOf': 'tasks',
        'appstudio.openshift.io/component': 'human-resources-clkq',
        'pipelinesascode.tekton.dev/sender': 'rh-trusted-application-pipeline__bot',
        'app.kubernetes.io/version': 'v0.15.0',
        'tekton.dev/pipeline': 'human-resources-clkq-on-pull-request-xn5nd',
        'app.kubernetes.io/managed-by': 'pipelinesascode.tekton.dev',
        'pipelinesascode.tekton.dev/check-run-id': '12037335647',
        'pipelinesascode.tekton.dev/branch': 'main',
        'appstudio.openshift.io/application': 'my-test-output',
        'tekton.dev/task': 'clamav-scan',
        'pipelinesascode.tekton.dev/url-org': 'test-repo',
        'tekton.dev/pipelineTask': 'clamav-scan',
        'pipelinesascode.tekton.dev/original-prname': 'human-resources-clkq-on-pull-request',
        'pipelinesascode.tekton.dev/pull-request': '2',
        'pipelines.appstudio.openshift.io/type': 'build',
        'pipelinesascode.tekton.dev/url-repository': 'human-resources',
        'tekton.dev/pipelineRun': 'human-resources-clkq-on-pull-request-xn5nd',
        'pipelinesascode.tekton.dev/repository': 'human-resources-clkq',
        'pipelinesascode.tekton.dev/sha': '36e49113fc391cc1a4723afb0269a88c9e54608d',
        'pipelinesascode.tekton.dev/git-provider': 'github',
        'pipelinesascode.tekton.dev/event-type': 'pull_request',
      },
    },
    spec: {
      params: [
        {
          name: 'image-digest',
          value: 'sha256:02d4920c04cad24ef1a8058bc31f08a76182e80cc8288712ea764ce45e3406b1',
        },
        {
          name: 'image-url',
          value:
            'quay.io/redhat-appstudio/user-workload:on-pr-36e49113fc391cc1a4723afb0269a88c9e54608d',
        },
        {
          name: 'docker-auth',
          value: 'human-resources-clkq-on-pull-request-xn5nd',
        },
      ],
      resources: {},
      serviceAccountName: 'appstudio-pipeline',
      taskRef: {
        bundle:
          'quay.io/redhat-appstudio-tekton-catalog/task-clamav-scan:0.1@sha256:28b425322aa84f988c6c4f8d503787b3fb301668b2ad6728846b8f8c45ba012b',
        kind: 'Task',
        name: 'clamav-scan',
      },
      timeout: '1h0m0s',
    },
    status: {
      completionTime: '2023-03-16T01:03:37Z',
      conditions: [
        {
          lastTransitionTime: '2023-03-16T01:03:37Z',
          message: 'All Steps have completed executing',
          reason: 'Succeeded',
          status: 'True',
          type: 'Succeeded',
        },
      ],
      podName: 'human-resources-clkq-on-pull-request-xn5nd-clamav-scan-pod',
      sidecars: [
        {
          container: 'sidecar-database',
          imageID:
            'quay.io/redhat-appstudio/clamav-db@sha256:bc7ef1caf8641569961cb2f6f8dd65ca7c4665455484587d85b9e24b96d295e9',
          name: 'database',
          terminated: {
            containerID: 'cri-o://8119fd062faba69ca2264e2b8bdac5edbe562bb3bf38bb8a496f4bfb5cfe6cc5',
            exitCode: 0,
            finishedAt: '2023-03-16T01:00:30Z',
            reason: 'Completed',
            startedAt: '2023-03-16T01:00:30Z',
          },
        },
      ],
      startTime: '2023-03-16T01:00:11Z',
      steps: [
        {
          container: 'step-extract-and-scan-image',
          imageID:
            'quay.io/redhat-appstudio/hacbs-test@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
          name: 'extract-and-scan-image',
          terminated: {
            containerID: 'cri-o://91d946998b032c81f1786551dbf46cf6276d20fbaa64d18dbca90b7a993f71e1',
            exitCode: 0,
            finishedAt: '2023-03-16T01:03:35Z',
            reason: 'Completed',
            startedAt: '2023-03-16T01:00:32Z',
          },
        },
        {
          container: 'step-modify-clam-output-to-json',
          imageID:
            'quay.io/redhat-appstudio/hacbs-test@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
          name: 'modify-clam-output-to-json',
          terminated: {
            containerID: 'cri-o://2ec6126681c18c25837069615d72cbf688aae202524418762819ab952f7b9878',
            exitCode: 0,
            finishedAt: '2023-03-16T01:03:36Z',
            reason: 'Completed',
            startedAt: '2023-03-16T01:03:36Z',
          },
        },
        {
          container: 'step-store-hacbs-test-output-result',
          imageID:
            'quay.io/redhat-appstudio/hacbs-test@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
          name: 'store-hacbs-test-output-result',
          terminated: {
            containerID: 'cri-o://35d66ce947c3931dbece1c79f2d1f177c28d62bd911a300be61555069d60de39',
            exitCode: 0,
            finishedAt: '2023-03-16T01:03:36Z',
            message:
              '[{"key":"TEST_OUTPUT","value":"{\\"result\\":\\"SUCCESS\\",\\"timestamp\\":\\"1678928616\\",\\"note\\":\\"For more details please visit the logs in workspace of Tekton tasks.\\",\\"namespace\\":\\"default\\",\\"successes\\":1,\\"failures\\":0,\\"warnings\\":0}\\n","type":1}]',
            reason: 'Completed',
            startedAt: '2023-03-16T01:03:36Z',
          },
        },
      ],
      results: [
        {
          name: 'TEST_OUTPUT',
          type: 'string',
          value:
            '{"result":"SUCCESS","timestamp":"1678928616","note":"For more details please visit the logs in workspace of Tekton tasks.","namespace":"default","successes":1,"failures":0,"warnings":0}\n',
        },
      ],
      taskSpec: {
        params: [
          {
            description: 'Image digest to scan',
            name: 'image-digest',
            type: 'string',
          },
          {
            description: 'Url to image',
            name: 'image-url',
            type: 'string',
          },
          {
            description: 'secret with config.json for container auth',
            name: 'docker-auth',
            type: 'string',
          },
        ],
        results: [
          {
            description: 'test output',
            name: 'TEST_OUTPUT',
            type: 'string',
          },
        ],
        sidecars: [
          {
            image: 'quay.io/redhat-appstudio/clamav-db:latest',
            imagePullPolicy: 'Always',
            name: 'database',
            computeResources: {},
            script: '#!/usr/bin/env bash\ncp -r /var/lib/clamav/* /tmp/clamdb\n',
            volumeMounts: [
              {
                mountPath: '/tmp/clamdb',
                name: 'dbfolder',
              },
            ],
          },
        ],
        steps: [
          {
            env: [
              {
                name: 'HOME',
                value: '/work',
              },
              {
                name: 'DOCKER_CONFIG',
                value: '/secrets/registry-auth',
              },
              {
                name: 'IMAGE_URL',
                value:
                  'quay.io/redhat-appstudio/user-workload:on-pr-36e49113fc391cc1a4723afb0269a88c9e54608d',
              },
              {
                name: 'IMAGE_DIGEST',
                value: 'sha256:02d4920c04cad24ef1a8058bc31f08a76182e80cc8288712ea764ce45e3406b1',
              },
            ],
            image:
              'quay.io/redhat-appstudio/hacbs-test:v1.0.11@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
            name: 'extract-and-scan-image',
            resources: {
              limits: {
                cpu: '2',
                memory: '4Gi',
              },
              requests: {
                cpu: '10m',
                memory: '512Mi',
              },
            },
            script:
              'imagewithouttag=$(echo $IMAGE_URL | sed "s/\\(.*\\):.*/\\1/" | tr -d \'\\n\')\n\n# strip new-line escape symbol from parameter and save it to variable\nimageanddigest=$(echo $imagewithouttag@$IMAGE_DIGEST)\n\n# check if image is attestation one, skip the clamav scan in such case\nif [[ $imageanddigest == *.att ]]\nthen\n    echo "$imageanddigest is an attestation image, skipping clamav scan"\n    exit 0\nfi\nmkdir content\ncd content\necho Extracting image\nif ! oc image extract $imageanddigest; then\n  echo "Unable to extract image! Skipping clamscan!"\n  exit 0\nfi\necho Extraction done\nclamscan -ri --max-scansize=250M | tee /tekton/home/clamscan-result.log\necho "Executed-on: Scan was executed on version - $(clamscan --version)" | tee -a /tekton/home/clamscan-result.log\n',
            securityContext: {
              runAsUser: 1000,
            },
            volumeMounts: [
              {
                mountPath: '/var/lib/clamav',
                name: 'dbfolder',
              },
              {
                mountPath: '/work',
                name: 'work',
              },
              {
                mountPath: '/secrets/registry-auth',
                name: 'registry-auth',
              },
            ],
            workingDir: '/work',
          },
          {
            image:
              'quay.io/redhat-appstudio/hacbs-test:v1.0.11@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
            name: 'modify-clam-output-to-json',
            resources: {},
            script:
              '#!/usr/bin/env python3.9\nimport json\nimport dateutil.parser as parser\nimport os\n\nclamscan_result = "/tekton/home/clamscan-result.log"\nif not os.path.exists(clamscan_result) or os.stat(clamscan_result).st_size == 0:\n    print("clamscan-result.log file is empty, meaning previous step didn\'t extracted the compiled code, skipping parsing.")\n    exit(0)\n\nwith open(clamscan_result, "r") as file:\n    clam_result_str = file.read()\n\ndef clam_result_str_to_json(clam_result_str):\n\n    clam_result_list = clam_result_str.split("\\n")\n    clam_result_list.remove(\'\')\n\n    results_marker = \\\n        clam_result_list.index("----------- SCAN SUMMARY -----------")\n\n    hit_list = clam_result_list[:results_marker]\n    summary_list = clam_result_list[(results_marker + 1):]\n\n    r_dict = { "hits": hit_list }\n    for item in summary_list:\n        # in case of blank lines\n        if not item:\n            continue\n        split_index = [c == \':\' for c in item].index(True)\n        key = item[:split_index].lower()\n        key = key.replace(" ", "_")\n        value = item[(split_index + 1):].strip(" ")\n        if (key == "start_date" or key == "end_date"):\n          isodate = parser.parse(value)\n          value = isodate.isoformat()\n        r_dict[key] = value\n    print(json.dumps(r_dict))\n    with open(\'/tekton/home/clamscan-result.json\', \'w\') as f:\n      print(json.dumps(r_dict), file=f)\n\ndef main():\n    clam_result_str_to_json(clam_result_str)\n\nif __name__ == "__main__":\n    main()\n',
          },
          {
            image:
              'quay.io/redhat-appstudio/hacbs-test:v1.0.11@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
            name: 'store-hacbs-test-output-result',
            resources: {},
            script:
              '#!/usr/bin/env bash\nsource /utils.sh\n\nHACBS_ERROR_OUTPUT=$(make_result_json -r "ERROR")\nif [ -f /tekton/home/clamscan-result.json ];\nthen\n  cat /tekton/home/clamscan-result.json\n  INFECTED_FILES=$(jq -r \'.infected_files\' /tekton/home/clamscan-result.json || true )\n  if [ -z "${INFECTED_FILES}" ]; then\n    echo "Failed to get number of infected files"\n  else\n    if [[ "${INFECTED_FILES}" -gt 0 ]]; then RES="FAILURE"; else RES="SUCCESS"; fi\n    TEST_OUTPUT=$(make_result_json -r "${RES}" -s 1 -f "${INFECTED_FILES}")\n  fi\nfi\necho "${TEST_OUTPUT:-${HACBS_ERROR_OUTPUT}}" | tee /tekton/results/TEST_OUTPUT\n',
          },
        ],
        volumes: [
          {
            name: 'dbfolder',
          },
          {
            name: 'work',
          },
          {
            name: 'registry-auth',
            secret: {
              optional: true,
              secretName: 'human-resources-clkq-on-pull-request-xn5nd',
            },
          },
        ],
      },
    },
  },
  {
    apiVersion: 'tekton.dev/v1',
    kind: 'TaskRun',
    metadata: {
      annotations: {
        'pipelinesascode.tekton.dev/on-target-branch': '[main,master]',
        'pipeline.tekton.dev/release': '9ec444e',
        'pipelinesascode.tekton.dev/repo-url': 'https://github.com/test-repo/human-resources',
        'pipelinesascode.tekton.dev/sha-title': 'Update tekton references',
        'tekton.dev/tags': 'appstudio, hacbs',
        'results.tekton.dev/record':
          'test-tenant/results/014c3e9f-90e9-4cd4-83eb-f0fdd8fe6714/records/b8f9d404-712a-4bdd-9b4d-10b82e452811',
        'pipelinesascode.tekton.dev/git-auth-secret': 'pac-gitauth-zzez',
        'results.tekton.dev/log':
          'test-tenant/results/014c3e9f-90e9-4cd4-83eb-f0fdd8fe6714/logs/56a48b8f-0640-302e-9fa3-cfc0d5e5f3b3',
        'chains.tekton.dev/signed': 'true',
        'tekton.dev/pipelines.minVersion': '0.12.1',
        'results.tekton.dev/result': 'test-tenant/results/014c3e9f-90e9-4cd4-83eb-f0fdd8fe6714',
        'pipelinesascode.tekton.dev/log-url':
          'https://console-openshift-console.apps.stone-prd-m01.84db.p1.openshiftapps.com/k8s/ns/test-tenant/tekton.dev~v1beta1~PipelineRun/human-resources-clkq-on-pull-request-xn5nd',
        'build.appstudio.redhat.com/target_branch': 'main',
        'pipelinesascode.tekton.dev/max-keep-runs': '3',
        'build.appstudio.redhat.com/pull_request_number': '2',
        'pipelinesascode.tekton.dev/sha-url':
          'https://github.com/test-repo/human-resources/commit/36e49113fc391cc1a4723afb0269a88c9e54608d',
        'pipelinesascode.tekton.dev/on-event': '[pull_request]',
        'pipelinesascode.tekton.dev/installation-id': '34687113',
        'build.appstudio.redhat.com/commit_sha': '36e49113fc391cc1a4723afb0269a88c9e54608d',
      },
      resourceVersion: '62426454',
      name: 'human-resources-clkq-on-pull-request-xn5nd-show-summary',
      uid: 'b8f9d404-712a-4bdd-9b4d-10b82e452811',
      creationTimestamp: '2023-03-16T01:03:38Z',
      generation: 1,
      namespace: 'test-tenant',
      ownerReferences: [
        {
          apiVersion: 'tekton.dev/v1',
          blockOwnerDeletion: true,
          controller: true,
          kind: 'PipelineRun',
          name: 'human-resources-clkq-on-pull-request-xn5nd',
          uid: '014c3e9f-90e9-4cd4-83eb-f0fdd8fe6714',
        },
      ],
      finalizers: ['chains.tekton.dev'],
      labels: {
        'pipelinesascode.tekton.dev/state': 'started',
        'tekton.dev/memberOf': 'finally',
        'appstudio.openshift.io/component': 'human-resources-clkq',
        'pipelinesascode.tekton.dev/sender': 'rh-trusted-application-pipeline__bot',
        'app.kubernetes.io/version': 'v0.15.0',
        'tekton.dev/pipeline': 'human-resources-clkq-on-pull-request-xn5nd',
        'app.kubernetes.io/managed-by': 'pipelinesascode.tekton.dev',
        'pipelinesascode.tekton.dev/check-run-id': '12037335647',
        'pipelinesascode.tekton.dev/branch': 'main',
        'appstudio.openshift.io/application': 'my-test-output',
        'tekton.dev/task': 'summary',
        'pipelinesascode.tekton.dev/url-org': 'test-repo',
        'tekton.dev/pipelineTask': 'show-summary',
        'pipelinesascode.tekton.dev/original-prname': 'human-resources-clkq-on-pull-request',
        'pipelinesascode.tekton.dev/pull-request': '2',
        'pipelines.appstudio.openshift.io/type': 'build',
        'pipelinesascode.tekton.dev/url-repository': 'human-resources',
        'tekton.dev/pipelineRun': 'human-resources-clkq-on-pull-request-xn5nd',
        'pipelinesascode.tekton.dev/repository': 'human-resources-clkq',
        'pipelinesascode.tekton.dev/sha': '36e49113fc391cc1a4723afb0269a88c9e54608d',
        'pipelinesascode.tekton.dev/git-provider': 'github',
        'pipelinesascode.tekton.dev/event-type': 'pull_request',
      },
    },
    spec: {
      params: [
        {
          name: 'pipelinerun-name',
          value: 'human-resources-clkq-on-pull-request-xn5nd',
        },
        {
          name: 'git-url',
          value:
            'https://github.com/test-repo/human-resources?rev=36e49113fc391cc1a4723afb0269a88c9e54608d',
        },
        {
          name: 'image-url',
          value:
            'quay.io/redhat-appstudio/user-workload:on-pr-36e49113fc391cc1a4723afb0269a88c9e54608d',
        },
      ],
      resources: {},
      serviceAccountName: 'appstudio-pipeline',
      taskRef: {
        bundle:
          'quay.io/redhat-appstudio-tekton-catalog/task-summary:0.1@sha256:03361504506b038934d2a2ed397970f183f9a23506b810bccc964f4c486bfe79',
        kind: 'Task',
        name: 'summary',
      },
      timeout: '1h0m0s',
    },
    status: {
      completionTime: '2023-03-16T01:03:47Z',
      conditions: [
        {
          lastTransitionTime: '2023-03-16T01:03:47Z',
          message: 'All Steps have completed executing',
          reason: 'Succeeded',
          status: 'True',
          type: 'Succeeded',
        },
      ],
      podName: 'human-resources-clkq-on-pull-request-xn5nd-show-summary-pod',
      startTime: '2023-03-16T01:03:38Z',
      steps: [
        {
          container: 'step-appstudio-summary',
          imageID:
            'quay.io/openshift-release-dev/ocp-v4.0-art-dev@sha256:9f0cdc00b1b1a3c17411e50653253b9f6bb5329ea4fb82ad983790a6dbf2d9ad',
          name: 'appstudio-summary',
          terminated: {
            containerID: 'cri-o://1af1c7a9144a9c5e819050feab3414022599eed180b25604bed0cd046e269591',
            exitCode: 0,
            finishedAt: '2023-03-16T01:03:46Z',
            reason: 'Completed',
            startedAt: '2023-03-16T01:03:46Z',
          },
        },
      ],
      taskSpec: {
        description: 'Summary Pipeline Task.',
        params: [
          {
            description: 'pipeline-run to annotate',
            name: 'pipelinerun-name',
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
            env: [
              {
                name: 'GIT_URL',
                value:
                  'https://github.com/test-repo/human-resources?rev=36e49113fc391cc1a4723afb0269a88c9e54608d',
              },
              {
                name: 'IMAGE_URL',
                value:
                  'quay.io/redhat-appstudio/user-workload:on-pr-36e49113fc391cc1a4723afb0269a88c9e54608d',
              },
              {
                name: 'PIPELINERUN_NAME',
                value: 'human-resources-clkq-on-pull-request-xn5nd',
              },
            ],
            image:
              'registry.redhat.io/openshift4/ose-cli:v4.12@sha256:9f0cdc00b1b1a3c17411e50653253b9f6bb5329ea4fb82ad983790a6dbf2d9ad',
            name: 'appstudio-summary',
            resources: {},
            script:
              '#!/usr/bin/env bash\necho\necho "Build Summary:"\necho\necho "Build repository: $GIT_URL"\necho "Generated Image is in : $IMAGE_URL"\necho\noc annotate --overwrite pipelinerun $PIPELINERUN_NAME build.appstudio.openshift.io/repo=$GIT_URL\noc annotate --overwrite pipelinerun $PIPELINERUN_NAME build.appstudio.openshift.io/image=$IMAGE_URL\necho End Summary\n\noc delete --ignore-not-found=true secret $PIPELINERUN_NAME\n',
          },
        ],
      },
    },
  },
  {
    apiVersion: 'tekton.dev/v1',
    kind: 'TaskRun',
    metadata: {
      annotations: {
        'pipelinesascode.tekton.dev/on-target-branch': '[main,master]',
        'pipeline.tekton.dev/release': '9ec444e',
        'pipelinesascode.tekton.dev/repo-url': 'https://github.com/test-repo/human-resources',
        'pipelinesascode.tekton.dev/sha-title': 'Update tekton references',
        'tekton.dev/tags': 'image-build, appstudio, hacbs',
        'results.tekton.dev/record':
          'test-tenant/results/014c3e9f-90e9-4cd4-83eb-f0fdd8fe6714/records/292483d8-45ad-4d8f-8216-a7f00cc5b06b',
        'pipelinesascode.tekton.dev/git-auth-secret': 'pac-gitauth-zzez',
        'results.tekton.dev/log':
          'test-tenant/results/014c3e9f-90e9-4cd4-83eb-f0fdd8fe6714/logs/4d7d3e68-8fd2-311c-99ff-15960da3c0b0',
        'chains.tekton.dev/signed': 'true',
        'tekton.dev/pipelines.minVersion': '0.12.1',
        'results.tekton.dev/result': 'test-tenant/results/014c3e9f-90e9-4cd4-83eb-f0fdd8fe6714',
        'pipelinesascode.tekton.dev/log-url':
          'https://console-openshift-console.apps.stone-prd-m01.84db.p1.openshiftapps.com/k8s/ns/test-tenant/tekton.dev~v1beta1~PipelineRun/human-resources-clkq-on-pull-request-xn5nd',
        'build.appstudio.redhat.com/target_branch': 'main',
        'pipelinesascode.tekton.dev/max-keep-runs': '3',
        'build.appstudio.redhat.com/pull_request_number': '2',
        'pipelinesascode.tekton.dev/sha-url':
          'https://github.com/test-repo/human-resources/commit/36e49113fc391cc1a4723afb0269a88c9e54608d',
        'pipelinesascode.tekton.dev/on-event': '[pull_request]',
        'pipelinesascode.tekton.dev/installation-id': '34687113',
        'build.appstudio.redhat.com/commit_sha': '36e49113fc391cc1a4723afb0269a88c9e54608d',
      },
      resourceVersion: '62379310',
      name: 'human-resources-clkq-on-pull-request-xn5nd-build-container',
      uid: '292483d8-45ad-4d8f-8216-a7f00cc5b06b',
      creationTimestamp: '2023-03-16T00:52:27Z',
      generation: 1,
      namespace: 'test-tenant',
      ownerReferences: [
        {
          apiVersion: 'tekton.dev/v1',
          blockOwnerDeletion: true,
          controller: true,
          kind: 'PipelineRun',
          name: 'human-resources-clkq-on-pull-request-xn5nd',
          uid: '014c3e9f-90e9-4cd4-83eb-f0fdd8fe6714',
        },
      ],
      finalizers: ['chains.tekton.dev'],
      labels: {
        'pipelinesascode.tekton.dev/state': 'started',
        'tekton.dev/memberOf': 'tasks',
        'appstudio.openshift.io/component': 'human-resources-clkq',
        'pipelinesascode.tekton.dev/sender': 'rh-trusted-application-pipeline__bot',
        'app.kubernetes.io/version': 'v0.15.0',
        'tekton.dev/pipeline': 'human-resources-clkq-on-pull-request-xn5nd',
        'app.kubernetes.io/managed-by': 'pipelinesascode.tekton.dev',
        'pipelinesascode.tekton.dev/check-run-id': '12037335647',
        'pipelinesascode.tekton.dev/branch': 'main',
        'appstudio.openshift.io/application': 'my-test-output',
        'tekton.dev/task': 'buildah',
        'pipelinesascode.tekton.dev/url-org': 'test-repo',
        'tekton.dev/pipelineTask': 'build-container',
        'pipelinesascode.tekton.dev/original-prname': 'human-resources-clkq-on-pull-request',
        'pipelinesascode.tekton.dev/pull-request': '2',
        'pipelines.appstudio.openshift.io/type': 'build',
        'pipelinesascode.tekton.dev/url-repository': 'human-resources',
        'tekton.dev/pipelineRun': 'human-resources-clkq-on-pull-request-xn5nd',
        'pipelinesascode.tekton.dev/repository': 'human-resources-clkq',
        'pipelinesascode.tekton.dev/sha': '36e49113fc391cc1a4723afb0269a88c9e54608d',
        'pipelinesascode.tekton.dev/git-provider': 'github',
        'pipelinesascode.tekton.dev/event-type': 'pull_request',
      },
    },
    spec: {
      params: [
        {
          name: 'IMAGE',
          value:
            'quay.io/redhat-appstudio/user-workload:on-pr-36e49113fc391cc1a4723afb0269a88c9e54608d',
        },
        {
          name: 'DOCKERFILE',
          value:
            'https://raw.githubusercontent.com/devfile-samples/devfile-sample-java-springboot-basic/main/docker/Dockerfile',
        },
        {
          name: 'CONTEXT',
          value: '.',
        },
        {
          name: 'DOCKER_AUTH',
          value: 'human-resources-clkq-on-pull-request-xn5nd',
        },
        {
          name: 'HERMETIC',
          value: 'false',
        },
        {
          name: 'PREFETCH_INPUT',
          value: '',
        },
      ],
      resources: {},
      serviceAccountName: 'appstudio-pipeline',
      taskRef: {
        bundle:
          'quay.io/redhat-appstudio-tekton-catalog/task-buildah:0.1@sha256:c3712257615d206ef40013bf1c5c681670fc8f7fd6aac9fa4c86f7afeff627ef',
        kind: 'Task',
        name: 'buildah',
      },
      timeout: '1h0m0s',
      workspaces: [
        {
          name: 'source',
          persistentVolumeClaim: {
            claimName: 'pvc-ce2179a49a',
          },
        },
      ],
    },
    status: {
      completionTime: '2023-03-16T00:59:53Z',
      conditions: [
        {
          lastTransitionTime: '2023-03-16T00:59:53Z',
          message: 'All Steps have completed executing',
          reason: 'Succeeded',
          status: 'True',
          type: 'Succeeded',
        },
      ],
      podName: 'human-resources-clkq-on-pull-request-xn5nd-build-container-pod',
      startTime: '2023-03-16T00:52:27Z',
      steps: [
        {
          container: 'step-build',
          imageID:
            'quay.io/redhat-appstudio/buildah@sha256:381e9bfedd59701477621da93892106873a6951b196105d3d2d85c3f6d7b569b',
          name: 'build',
          terminated: {
            containerID: 'cri-o://9ba9075922168b1e6fb272b0dde4a6736f00bc99f88eb37a2919f609a4314d53',
            exitCode: 0,
            finishedAt: '2023-03-16T00:57:47Z',
            reason: 'Completed',
            startedAt: '2023-03-16T00:53:34Z',
          },
        },
        {
          container: 'step-sbom-get',
          imageID:
            'quay.io/redhat-appstudio/syft@sha256:09afc449976230f66848c19bb5ccf344eb0eeb4ed50747e33b53aff49462c319',
          name: 'sbom-get',
          terminated: {
            containerID: 'cri-o://a7b8002976d3bd82419526856d1087ae276f2034d448ea9a99a93fdbb10eb0e7',
            exitCode: 0,
            finishedAt: '2023-03-16T00:59:09Z',
            reason: 'Completed',
            startedAt: '2023-03-16T00:57:47Z',
          },
        },
        {
          container: 'step-analyse-dependencies-java-sbom',
          imageID:
            'quay.io/redhat-appstudio/hacbs-jvm-build-request-processor@sha256:b198cf4b33dab59ce8ac25afd4e1001390db29ca2dec83dc8a1e21b0359ce743',
          name: 'analyse-dependencies-java-sbom',
          terminated: {
            containerID: 'cri-o://c2131223bedd14167ff6b3a4bc364727f7ab7d106f78e4964d81127c960526ed',
            exitCode: 0,
            finishedAt: '2023-03-16T00:59:09Z',
            message: '[{"key":"JAVA_COMMUNITY_DEPENDENCIES","value":"","type":1}]',
            reason: 'Completed',
            startedAt: '2023-03-16T00:59:09Z',
          },
        },
        {
          container: 'step-merge-sboms',
          imageID:
            'registry.access.redhat.com/ubi9/python-39@sha256:89463fe3e086620617a4f6281640469ba7a7abd2f1b5be13e6cf0f46a6565516',
          name: 'merge-sboms',
          terminated: {
            containerID: 'cri-o://1a7a67c49f3d7790ed95fa8ba269668fa9271d73deada9ec65f07b7aab93bc5e',
            exitCode: 0,
            finishedAt: '2023-03-16T00:59:09Z',
            message: '[{"key":"JAVA_COMMUNITY_DEPENDENCIES","value":"","type":1}]',
            reason: 'Completed',
            startedAt: '2023-03-16T00:59:09Z',
          },
        },
        {
          container: 'step-inject-sbom-and-push',
          imageID:
            'registry.access.redhat.com/ubi9/buildah@sha256:c8b1d312815452964885680fc5bc8d99b3bfe9b6961228c71a09c72ca8e915eb',
          name: 'inject-sbom-and-push',
          terminated: {
            containerID: 'cri-o://63387520d62a24c45c9315d7b065eff747d41d69961bd5ee7cca51b03a4298ec',
            exitCode: 0,
            finishedAt: '2023-03-16T00:59:50Z',
            message:
              '[{"key":"BASE_IMAGES_DIGESTS","value":"docker.io/library/openjdk:11-jdk@sha256:99bac5bf83633e3c7399aed725c8415e7b569b54e03e4599e580fc9cdb7c21ab\\nquay.io/devfile/maven:3.8.1-openjdk-17-slim@sha256:a65cb519660f51b06f487a6f5de8c264e1e2bcdb32033f3f45b0899f7740ca0f\\n","type":1},{"key":"IMAGE_DIGEST","value":"sha256:02d4920c04cad24ef1a8058bc31f08a76182e80cc8288712ea764ce45e3406b1","type":1},{"key":"IMAGE_URL","value":"quay.io/redhat-appstudio/user-workload:on-pr-36e49113fc391cc1a4723afb0269a88c9e54608d","type":1},{"key":"JAVA_COMMUNITY_DEPENDENCIES","value":"","type":1}]',
            reason: 'Completed',
            startedAt: '2023-03-16T00:59:10Z',
          },
        },
        {
          container: 'step-upload-sbom',
          imageID:
            'quay.io/redhat-appstudio/cosign@sha256:18b3716a6225727877475e1ab4f2493915e72cffd2ce431e9901d2ed2e4b2c0b',
          name: 'upload-sbom',
          terminated: {
            containerID: 'cri-o://4c260401d25c8ecc0269ba01ee9c901807deef2c3203554345302fadc09556bc',
            exitCode: 0,
            finishedAt: '2023-03-16T00:59:53Z',
            message:
              '[{"key":"BASE_IMAGES_DIGESTS","value":"docker.io/library/openjdk:11-jdk@sha256:99bac5bf83633e3c7399aed725c8415e7b569b54e03e4599e580fc9cdb7c21ab\\nquay.io/devfile/maven:3.8.1-openjdk-17-slim@sha256:a65cb519660f51b06f487a6f5de8c264e1e2bcdb32033f3f45b0899f7740ca0f\\n","type":1},{"key":"IMAGE_DIGEST","value":"sha256:02d4920c04cad24ef1a8058bc31f08a76182e80cc8288712ea764ce45e3406b1","type":1},{"key":"IMAGE_URL","value":"quay.io/redhat-appstudio/user-workload:on-pr-36e49113fc391cc1a4723afb0269a88c9e54608d","type":1},{"key":"JAVA_COMMUNITY_DEPENDENCIES","value":"","type":1}]',
            reason: 'Completed',
            startedAt: '2023-03-16T00:59:50Z',
          },
        },
      ],
      results: [
        {
          name: 'JAVA_COMMUNITY_DEPENDENCIES',
          type: 'string',
          value: '',
        },
        {
          name: 'BASE_IMAGES_DIGESTS',
          type: 'string',
          value:
            'docker.io/library/openjdk:11-jdk@sha256:99bac5bf83633e3c7399aed725c8415e7b569b54e03e4599e580fc9cdb7c21ab\nquay.io/devfile/maven:3.8.1-openjdk-17-slim@sha256:a65cb519660f51b06f487a6f5de8c264e1e2bcdb32033f3f45b0899f7740ca0f\n',
        },
        {
          name: 'IMAGE_DIGEST',
          type: 'string',
          value: 'sha256:02d4920c04cad24ef1a8058bc31f08a76182e80cc8288712ea764ce45e3406b1',
        },
        {
          name: 'IMAGE_URL',
          type: 'string',
          value:
            'quay.io/redhat-appstudio/user-workload:on-pr-36e49113fc391cc1a4723afb0269a88c9e54608d',
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
              'registry.access.redhat.com/ubi9/buildah:9.0.0-19@sha256:c8b1d312815452964885680fc5bc8d99b3bfe9b6961228c71a09c72ca8e915eb',
            description: 'The location of the buildah builder image.',
            name: 'BUILDER_IMAGE',
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
            description: 'secret with config.json for container auth',
            name: 'DOCKER_AUTH',
            type: 'string',
          },
          {
            default: 'false',
            description: 'Determines if build will be executed without network access.',
            name: 'HERMETIC',
            type: 'string',
          },
          {
            default: '',
            description:
              'In case it is not empty, the prefetched content should be made available to the build.',
            name: 'PREFETCH_INPUT',
            type: 'string',
          },
        ],
        results: [
          {
            description: 'Digest of the image just built',
            name: 'IMAGE_DIGEST',
            type: 'string',
          },
          {
            description: 'Image repository where the built image was pushed',
            name: 'IMAGE_URL',
            type: 'string',
          },
          {
            description: 'Digests of the base images used for build',
            name: 'BASE_IMAGES_DIGESTS',
            type: 'string',
          },
          {
            description: 'The counting of Java components by publisher in JSON format',
            name: 'SBOM_JAVA_COMPONENTS_COUNT',
            type: 'string',
          },
          {
            description:
              'The Java dependencies that came from community sources such as Maven central.',
            name: 'JAVA_COMMUNITY_DEPENDENCIES',
            type: 'string',
          },
        ],
        stepTemplate: {
          env: [
            {
              name: 'BUILDAH_FORMAT',
              value: 'oci',
            },
            {
              name: 'STORAGE_DRIVER',
              value: 'vfs',
            },
            {
              name: 'HERMETIC',
              value: 'false',
            },
            {
              name: 'PREFETCH_INPUT',
            },
            {
              name: 'DOCKER_CONFIG',
              value: '/secrets/registry-auth',
            },
            {
              name: 'CONTEXT',
              value: '.',
            },
            {
              name: 'DOCKERFILE',
              value:
                'https://raw.githubusercontent.com/devfile-samples/devfile-sample-java-springboot-basic/main/docker/Dockerfile',
            },
            {
              name: 'IMAGE',
              value:
                'quay.io/redhat-appstudio/user-workload:on-pr-36e49113fc391cc1a4723afb0269a88c9e54608d',
            },
            {
              name: 'TLSVERIFY',
              value: 'true',
            },
          ],
          name: '',
          computeResources: {},
        },
        steps: [
          {
            image: 'quay.io/redhat-appstudio/buildah:v1.28',
            name: 'build',
            resources: {
              limits: {
                cpu: '2',
                memory: '4Gi',
              },
              requests: {
                cpu: '10m',
                memory: '512Mi',
              },
            },
            script:
              'if [ -e "$CONTEXT/$DOCKERFILE" ]; then\n  dockerfile_path="$CONTEXT/$DOCKERFILE"\nelif [ -e "$DOCKERFILE" ]; then\n  dockerfile_path="$DOCKERFILE"\nelif echo "$DOCKERFILE" | grep -q "^https\\?://"; then\n  echo "Fetch Dockerfile from $DOCKERFILE"\n  dockerfile_path=$(mktemp --suffix=-Dockerfile)\n  http_code=$(curl -s -L -w "%{http_code}" --output "$dockerfile_path" "$DOCKERFILE")\n  if [ $http_code != 200 ]; then\n    echo "No Dockerfile is fetched. Server responds $http_code"\n    exit 1\n  fi\nelse\n  echo "Cannot find Dockerfile $DOCKERFILE"\n  exit 1\nfi\nif [ -n "$JVM_BUILD_WORKSPACE_ARTIFACT_CACHE_PORT_80_TCP_ADDR" ] && grep -q \'^\\s*RUN \\(./\\)\\?mvn\' "$dockerfile_path"; then\n  sed -i -e "s|^\\s*RUN \\(\\(./\\)\\?mvn\\(.*\\)\\)|RUN echo \\"<settings><mirrors><mirror><id>mirror.default</id><url>http://$JVM_BUILD_WORKSPACE_ARTIFACT_CACHE_PORT_80_TCP_ADDR/v1/cache/default/0/</url><mirrorOf>*</mirrorOf></mirror></mirrors></settings>\\" > /tmp/settings.yaml; \\1 -s /tmp/settings.yaml|g" "$dockerfile_path"\n  touch /var/lib/containers/java\nfi\n\n\nsed -i \'s/^\\s*short-name-mode\\s*=\\s*.*/short-name-mode = "disabled"/\' /etc/containers/registries.conf\n\n# Setting new namespace to run buildah - 2^32-2\necho \'root:1:4294967294\' | tee -a /etc/subuid >> /etc/subgid\n\nif [ "${HERMETIC}" == "true" ]; then\n  BUILDAH_ARGS="--pull=never"\n  UNSHARE_ARGS="--net"\n  for image in $(grep -i \'^\\s*FROM\' "$dockerfile_path" | sed \'s/--platform=\\S*//\' | awk \'{print $2}\'); do\n    unshare -Ufp --keep-caps -r --map-users 1,1,65536 --map-groups 1,1,65536 -- buildah pull $image\n  done\n  echo "Build will be executed with network isolation"\nfi\n\nif [ -n "${PREFETCH_INPUT}" ]; then\n  mv cachi2 /tmp/\n  chmod -R go+rwX /tmp/cachi2\n  VOLUME_MOUNTS="--volume /tmp/cachi2:/cachi2"\n  sed -i \'s|^\\s*run |RUN . /cachi2/cachi2.env \\&\\& \\\\\\n    |i\' "$dockerfile_path"\n  echo "Prefetched content will be made available"\nfi\n\nunshare -Uf $UNSHARE_ARGS --keep-caps -r --map-users 1,1,65536 --map-groups 1,1,65536 -- buildah bud \\\n  $VOLUME_MOUNTS \\\n  $BUILDAH_ARGS \\\n  --tls-verify=$TLSVERIFY --no-cache \\\n  --ulimit nofile=4096:4096 \\\n  -f "$dockerfile_path" -t $IMAGE $CONTEXT\n\ncontainer=$(buildah from --pull-never $IMAGE)\nbuildah mount $container | tee /workspace/container_path\necho $container > /workspace/container_name\n',
            securityContext: {
              capabilities: {
                add: ['SETFCAP'],
              },
            },
            volumeMounts: [
              {
                mountPath: '/var/lib/containers',
                name: 'varlibcontainers',
              },
              {
                mountPath: '/secrets/registry-auth',
                name: 'registry-auth',
              },
            ],
            workingDir: '/workspace/source',
          },
          {
            image: 'quay.io/redhat-appstudio/syft:v0.47.0',
            name: 'sbom-get',
            resources: {},
            script:
              'syft dir:/workspace/source --file=/workspace/source/sbom-source.json --output=cyclonedx-json\nfind $(cat /workspace/container_path) -xtype l -delete\nsyft dir:$(cat /workspace/container_path) --file=/workspace/source/sbom-image.json --output=cyclonedx-json\n',
            volumeMounts: [
              {
                mountPath: '/var/lib/containers',
                name: 'varlibcontainers',
              },
            ],
          },
          {
            image:
              'quay.io/redhat-appstudio/hacbs-jvm-build-request-processor:1d417e6f1f3e68c6c537333b5759796eddae0afc',
            name: 'analyse-dependencies-java-sbom',
            resources: {},
            script:
              "if [ -f /var/lib/containers/java ]; then\n  /opt/jboss/container/java/run/run-java.sh analyse-dependencies path $(cat /workspace/container_path) -s /workspace/source/sbom-image.json --task-run-name human-resources-clkq-on-pull-request-xn5nd-build-container --publishers /tekton/results/SBOM_JAVA_COMPONENTS_COUNT\n  sed -i 's/^/ /' /tekton/results/SBOM_JAVA_COMPONENTS_COUNT # Workaround for SRVKP-2875\nelse\n  touch /tekton/results/JAVA_COMMUNITY_DEPENDENCIES\nfi\n",
            securityContext: {
              runAsUser: 0,
            },
            volumeMounts: [
              {
                mountPath: '/var/lib/containers',
                name: 'varlibcontainers',
              },
            ],
          },
          {
            image: 'registry.access.redhat.com/ubi9/python-39:1-108',
            name: 'merge-sboms',
            resources: {},
            script:
              '#!/bin/python3\nimport json\nimport os\n\n# load SBOMs\nwith open("./sbom-image.json") as f:\n  image_sbom = json.load(f)\n\nwith open("./sbom-source.json") as f:\n  source_sbom = json.load(f)\n\n# fetch unique components from available SBOMs\ndef get_identifier(component):\n  return component["name"] + \'@\' + component.get("version", "")\n\nexisting_components = [get_identifier(component) for component in image_sbom["components"]]\n\nfor component in source_sbom["components"]:\n  if get_identifier(component) not in existing_components:\n    image_sbom["components"].append(component)\n    existing_components.append(get_identifier(component))\n\nimage_sbom["components"].sort(key=lambda c: get_identifier(c))\n\n# write the CycloneDX unified SBOM\nwith open("./sbom-cyclonedx.json", "w") as f:\n  json.dump(image_sbom, f, indent=4)\n\n# create and write the PURL unified SBOM\npurls = [{"purl": component["purl"]} for component in image_sbom["components"] if "purl" in component]\npurl_content = {"image_contents": {"dependencies": purls}}\n\nwith open("sbom-purl.json", "w") as output_file:\n  json.dump(purl_content, output_file, indent=4)\n',
            securityContext: {
              runAsUser: 0,
            },
            workingDir: '/workspace/source',
          },
          {
            image:
              'registry.access.redhat.com/ubi9/buildah:9.0.0-19@sha256:c8b1d312815452964885680fc5bc8d99b3bfe9b6961228c71a09c72ca8e915eb',
            name: 'inject-sbom-and-push',
            resources: {},
            script:
              '# Expose base image digests\nbuildah images --format \'{{ .Name }}:{{ .Tag }}@{{ .Digest }}\' | grep -v $IMAGE > /tekton/results/BASE_IMAGES_DIGESTS\n\nbase_image_name=$(buildah inspect --format \'{{ index .ImageAnnotations "org.opencontainers.image.base.name"}}\' $IMAGE)\nbase_image_digest=$(buildah inspect --format \'{{ index .ImageAnnotations "org.opencontainers.image.base.digest"}}\' $IMAGE)\ncontainer=$(buildah from --pull-never $IMAGE)\nbuildah copy $container sbom-cyclonedx.json sbom-purl.json /root/buildinfo/content_manifests/\nbuildah config -a org.opencontainers.image.base.name=${base_image_name} -a org.opencontainers.image.base.digest=${base_image_digest} $container\nbuildah commit $container $IMAGE\nbuildah push \\\n  --tls-verify=$TLSVERIFY \\\n  --digestfile /workspace/source/image-digest $IMAGE \\\n  docker://$IMAGE\ncat "/workspace/source"/image-digest | tee /tekton/results/IMAGE_DIGEST\necho -n "$IMAGE" | tee /tekton/results/IMAGE_URL\n',
            securityContext: {
              capabilities: {
                add: ['SETFCAP'],
              },
              runAsUser: 0,
            },
            volumeMounts: [
              {
                mountPath: '/var/lib/containers',
                name: 'varlibcontainers',
              },
              {
                mountPath: '/secrets/registry-auth',
                name: 'registry-auth',
              },
            ],
            workingDir: '/workspace/source',
          },
          {
            args: [
              'attach',
              'sbom',
              '--sbom',
              'sbom-cyclonedx.json',
              '--type',
              'cyclonedx',
              'quay.io/redhat-appstudio/user-workload:on-pr-36e49113fc391cc1a4723afb0269a88c9e54608d',
            ],
            image: 'quay.io/redhat-appstudio/cosign:v1.13.1',
            name: 'upload-sbom',
            resources: {},
            volumeMounts: [
              {
                mountPath: '/secrets/registry-auth',
                name: 'registry-auth',
              },
            ],
            workingDir: '/workspace/source',
          },
        ],
        volumes: [
          {
            emptyDir: {},
            name: 'varlibcontainers',
          },
          {
            name: 'registry-auth',
            secret: {
              optional: true,
              secretName: 'human-resources-clkq-on-pull-request-xn5nd',
            },
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
  {
    apiVersion: 'tekton.dev/v1',
    kind: 'TaskRun',
    metadata: {
      annotations: {
        'pipelinesascode.tekton.dev/on-target-branch': '[main,master]',
        'pipeline.tekton.dev/release': '9ec444e',
        'pipelinesascode.tekton.dev/repo-url': 'https://github.com/test-repo/human-resources',
        'pipelinesascode.tekton.dev/sha-title': 'Update tekton references',
        'results.tekton.dev/record':
          'test-tenant/results/014c3e9f-90e9-4cd4-83eb-f0fdd8fe6714/records/43f7e689-4e36-48dc-93c0-bc879361191d',
        'pipelinesascode.tekton.dev/git-auth-secret': 'pac-gitauth-zzez',
        'results.tekton.dev/log':
          'test-tenant/results/014c3e9f-90e9-4cd4-83eb-f0fdd8fe6714/logs/d2b41aa1-3fc9-350d-af8d-f6f29be33712',
        'chains.tekton.dev/signed': 'true',
        'results.tekton.dev/result': 'test-tenant/results/014c3e9f-90e9-4cd4-83eb-f0fdd8fe6714',
        'pipelinesascode.tekton.dev/log-url':
          'https://console-openshift-console.apps.stone-prd-m01.84db.p1.openshiftapps.com/k8s/ns/test-tenant/tekton.dev~v1beta1~PipelineRun/human-resources-clkq-on-pull-request-xn5nd',
        'build.appstudio.redhat.com/target_branch': 'main',
        'pipelinesascode.tekton.dev/max-keep-runs': '3',
        'build.appstudio.redhat.com/pull_request_number': '2',
        'pipelinesascode.tekton.dev/sha-url':
          'https://github.com/test-repo/human-resources/commit/36e49113fc391cc1a4723afb0269a88c9e54608d',
        'pipelinesascode.tekton.dev/on-event': '[pull_request]',
        'pipelinesascode.tekton.dev/installation-id': '34687113',
        'build.appstudio.redhat.com/commit_sha': '36e49113fc391cc1a4723afb0269a88c9e54608d',
      },
      resourceVersion: '62350133',
      name: 'human-resources-clkq-on-pull-request-xn5nd-sbom-json-check',
      uid: '43f7e689-4e36-48dc-93c0-bc879361191d',
      creationTimestamp: '2023-03-16T01:00:08Z',
      generation: 1,
      namespace: 'test-tenant',
      ownerReferences: [
        {
          apiVersion: 'tekton.dev/v1',
          blockOwnerDeletion: true,
          controller: true,
          kind: 'PipelineRun',
          name: 'human-resources-clkq-on-pull-request-xn5nd',
          uid: '014c3e9f-90e9-4cd4-83eb-f0fdd8fe6714',
        },
      ],
      finalizers: ['chains.tekton.dev'],
      labels: {
        'pipelinesascode.tekton.dev/state': 'started',
        'tekton.dev/memberOf': 'tasks',
        'appstudio.openshift.io/component': 'human-resources-clkq',
        'pipelinesascode.tekton.dev/sender': 'rh-trusted-application-pipeline__bot',
        'app.kubernetes.io/version': 'v0.15.0',
        'tekton.dev/pipeline': 'human-resources-clkq-on-pull-request-xn5nd',
        'app.kubernetes.io/managed-by': 'pipelinesascode.tekton.dev',
        'pipelinesascode.tekton.dev/check-run-id': '12037335647',
        'pipelinesascode.tekton.dev/branch': 'main',
        'appstudio.openshift.io/application': 'my-test-output',
        'tekton.dev/task': 'sbom-json-check',
        'pipelinesascode.tekton.dev/url-org': 'test-repo',
        'tekton.dev/pipelineTask': 'sbom-json-check',
        'pipelinesascode.tekton.dev/original-prname': 'human-resources-clkq-on-pull-request',
        'pipelinesascode.tekton.dev/pull-request': '2',
        'pipelines.appstudio.openshift.io/type': 'build',
        'pipelinesascode.tekton.dev/url-repository': 'human-resources',
        'tekton.dev/pipelineRun': 'human-resources-clkq-on-pull-request-xn5nd',
        'pipelinesascode.tekton.dev/repository': 'human-resources-clkq',
        'pipelinesascode.tekton.dev/sha': '36e49113fc391cc1a4723afb0269a88c9e54608d',
        'pipelinesascode.tekton.dev/git-provider': 'github',
        'pipelinesascode.tekton.dev/event-type': 'pull_request',
      },
    },
    spec: {
      params: [
        {
          name: 'IMAGE_URL',
          value:
            'quay.io/redhat-appstudio/user-workload:on-pr-36e49113fc391cc1a4723afb0269a88c9e54608d',
        },
        {
          name: 'IMAGE_DIGEST',
          value: 'sha256:02d4920c04cad24ef1a8058bc31f08a76182e80cc8288712ea764ce45e3406b1',
        },
      ],
      resources: {},
      serviceAccountName: 'appstudio-pipeline',
      taskRef: {
        bundle:
          'quay.io/redhat-appstudio-tekton-catalog/task-sbom-json-check:0.1@sha256:ce6a0932da9b41080108284d1366fc2de8374fca5137500138e16ad9e04610c6',
        kind: 'Task',
        name: 'sbom-json-check',
      },
      timeout: '1h0m0s',
    },
    status: {
      completionTime: '2023-03-16T01:00:39Z',
      conditions: [
        {
          lastTransitionTime: '2023-03-16T01:00:39Z',
          message: 'All Steps have completed executing',
          reason: 'Succeeded',
          status: 'True',
          type: 'Succeeded',
        },
      ],
      podName: 'human-resources-clkq-on-pull-request-xn5nd-sbom-json-check-pod',
      startTime: '2023-03-16T01:00:12Z',
      steps: [
        {
          container: 'step-sbom-json-check',
          imageID:
            'quay.io/redhat-appstudio/hacbs-test@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
          name: 'sbom-json-check',
          terminated: {
            containerID: 'cri-o://fbb5c85e29431424ada9035e8fde3dde65f1e30bab6a0022282d219d364717c0',
            exitCode: 0,
            finishedAt: '2023-03-16T01:00:38Z',
            message:
              '[{"key":"TEST_OUTPUT","value":"{\\"result\\":\\"SUCCESS\\",\\"timestamp\\":\\"1678928438\\",\\"note\\":\\"For more details please visit the logs in workspace of Tekton tasks.\\",\\"namespace\\":\\"default\\",\\"successes\\":1,\\"failures\\":0,\\"warnings\\":0}\\n","type":1}]',
            reason: 'Completed',
            startedAt: '2023-03-16T01:00:26Z',
          },
        },
      ],
      results: [
        {
          name: 'TEST_OUTPUT',
          type: 'string',
          value:
            '{"result":"SUCCESS","timestamp":"1678928438","note":"For more details please visit the logs in workspace of Tekton tasks.","namespace":"default","successes":1,"failures":0,"warnings":0}\n',
        },
      ],
      taskSpec: {
        description:
          'Check the syntax of the sbom-cyclonedx.json file which should be found in the /root/buildinfo/content_manifests/ directory',
        params: [
          {
            description: 'the fully qualified image name to be verified',
            name: 'IMAGE_URL',
            type: 'string',
          },
          {
            description: 'image digest',
            name: 'IMAGE_DIGEST',
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
            env: [
              {
                name: 'IMAGE_URL',
                value:
                  'quay.io/redhat-appstudio/user-workload:on-pr-36e49113fc391cc1a4723afb0269a88c9e54608d',
              },
              {
                name: 'IMAGE_DIGEST',
                value: 'sha256:02d4920c04cad24ef1a8058bc31f08a76182e80cc8288712ea764ce45e3406b1',
              },
            ],
            image:
              'quay.io/redhat-appstudio/hacbs-test:v1.0.11@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
            name: 'sbom-json-check',
            resources: {},
            script:
              '#!/usr/bin/env bash\nsource /utils.sh\n\nmkdir /manifests/ && cd /manifests/\n\nimage_with_digest="${IMAGE_URL}@${IMAGE_DIGEST}"\n\nif ! oc image extract "${image_with_digest}" --path \'/root/buildinfo/content_manifests/*:/manifests/\'; then\n  echo "Failed to extract manifests from image ${image_with_digest}"\nfi\n\ntouch fail_result.txt\nif [ -f "sbom-cyclonedx.json" ]\nthen\n  result=$(echo -n $(cyclonedx-linux-x64 validate --input-file sbom-cyclonedx.json))\n  if [[ ! $result =~ "BOM validated successfully" ]]\n  then\n    echo "sbom-cyclonedx.json: $result" > fail_result.txt\n  fi\nelse\n  echo "cannot access \'sbom-cyclonedx.json\': No such file or directory" > fail_result.txt\nfi\n\nFAIL_RESULTS="$(cat fail_result.txt)"\nif [[ -z $FAIL_RESULTS ]]\nthen\n  TEST_OUTPUT=$(make_result_json -r "SUCCESS" -s 1)\nelse\n  echo "Fail to verify sbom-cyclonedx.json for image $IMAGE_URL with reason: $FAIL_RESULTS"\n  HACBS_ERROR_OUTPUT=$(make_result_json -r "FAILURE" -f 1)\nfi\n\necho "${TEST_OUTPUT:-${HACBS_ERROR_OUTPUT}}" | tee /tekton/results/TEST_OUTPUT\n',
            securityContext: {
              capabilities: {
                add: ['SETFCAP'],
              },
              runAsUser: 0,
            },
            volumeMounts: [
              {
                mountPath: '/shared',
                name: 'shared',
              },
            ],
          },
        ],
        volumes: [
          {
            emptyDir: {},
            name: 'shared',
          },
        ],
      },
    },
  },
];
