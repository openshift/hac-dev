import { ComponentKind } from '../../../../../types';
import { Snapshot } from '../../../../../types/coreBuildService';

export const MockCommit = {
  metadata: {
    uid: '8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
    name: '8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
  },
  components: ['human-resources-clkq'],
  user: 'jeff-phillips-18',
  sha: '8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
  shaURL:
    'https://github.com/jeff-phillips-18/human-resources/commit/8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
  repoName: 'human-resources',
  repoURL: 'https://github.com/jeff-phillips-18/human-resources',
  repoOrg: 'jeff-phillips-18',
  gitProvider: 'github',
  branch: 'main',
  creationTime: '2023-03-27T13:44:03Z',
  pipelineRuns: [
    {
      apiVersion: 'tekton.dev/v1beta1',
      kind: 'PipelineRun',
      metadata: {
        generateName: 'human-resources-clkq-on-pull-request-',
        annotations: {
          'pipelinesascode.tekton.dev/on-target-branch': '[main,master]',
          'pipelinesascode.tekton.dev/repo-url':
            'https://github.com/jeff-phillips-18/human-resources',
          'pipelinesascode.tekton.dev/sha-title': 'Update README.md',
          'results.tekton.dev/record':
            'jephilli-tenant/results/47ee10fa-2567-4a8e-bb0e-184b5123bd87/records/47ee10fa-2567-4a8e-bb0e-184b5123bd87',
          'pipelinesascode.tekton.dev/git-auth-secret': 'pac-gitauth-vfnr',
          'build.appstudio.openshift.io/repo':
            'https://github.com/jeff-phillips-18/human-resources?rev=8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
          'chains.tekton.dev/signed': 'true',
          'results.tekton.dev/result':
            'jephilli-tenant/results/47ee10fa-2567-4a8e-bb0e-184b5123bd87',
          'pipelinesascode.tekton.dev/log-url':
            'https://console-openshift-console.apps.stone-prd-m01.84db.p1.openshiftapps.com/k8s/ns/jephilli-tenant/tekton.dev~v1beta1~PipelineRun/human-resources-clkq-on-pull-request-fgkpt',
          'build.appstudio.redhat.com/target_branch': 'main',
          'pipelinesascode.tekton.dev/max-keep-runs': '3',
          'build.appstudio.redhat.com/pull_request_number': '6',
          'pipelinesascode.tekton.dev/sha-url':
            'https://github.com/jeff-phillips-18/human-resources/commit/8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
          'pipelinesascode.tekton.dev/on-event': '[pull_request]',
          'pipelinesascode.tekton.dev/installation-id': '34687113',
          'build.appstudio.redhat.com/commit_sha': '8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
          'build.appstudio.openshift.io/image':
            'quay.io/redhat-appstudio/user-workload:on-pr-8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
        },
        resourceVersion: '92260234',
        name: 'human-resources-clkq-on-pull-request-fgkpt',
        uid: '47ee10fa-2567-4a8e-bb0e-184b5123bd87',
        creationTimestamp: '2023-03-27T13:44:03Z',
        generation: 1,
        namespace: 'jephilli-tenant',
        finalizers: ['pipelinesascode.tekton.dev', 'chains.tekton.dev/pipelinerun'],
        labels: {
          'pipelinesascode.tekton.dev/state': 'completed',
          'appstudio.openshift.io/component': 'human-resources-clkq',
          'pipelinesascode.tekton.dev/sender': 'jeff-phillips-18',
          'app.kubernetes.io/version': 'v0.16.0',
          'tekton.dev/pipeline': 'human-resources-clkq-on-pull-request-fgkpt',
          'app.kubernetes.io/managed-by': 'pipelinesascode.tekton.dev',
          'pipelinesascode.tekton.dev/check-run-id': '12302899421',
          'pipelinesascode.tekton.dev/branch': 'main',
          'appstudio.openshift.io/application': 'my-test-output',
          'pipelinesascode.tekton.dev/url-org': 'jeff-phillips-18',
          'pipelinesascode.tekton.dev/original-prname': 'human-resources-clkq-on-pull-request',
          'pipelinesascode.tekton.dev/pull-request': '6',
          'pipelines.appstudio.openshift.io/type': 'build',
          'pipelinesascode.tekton.dev/url-repository': 'human-resources',
          'pipelinesascode.tekton.dev/repository': 'human-resources-clkq',
          'pipelinesascode.tekton.dev/sha': '8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
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
            value: 'https://github.com/jeff-phillips-18/human-resources',
          },
          {
            name: 'output-image',
            value:
              'quay.io/redhat-appstudio/user-workload:on-pr-8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
          },
          {
            name: 'path-context',
            value: '.',
          },
          {
            name: 'revision',
            value: '8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
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
                  'quay.io/redhat-appstudio-tekton-catalog/task-summary:0.1@sha256:c0f66b28c338426774e34a8d4a00349fbab798b19df5841a95727148d5ef3c65',
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
                  'quay.io/redhat-appstudio-tekton-catalog/task-prefetch-dependencies:0.1@sha256:bebbf6521a5a203410d6b0da5da366a5aa9bdd63522d7bf3f641e81b8cc2ba2d',
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
              secretName: 'pac-gitauth-vfnr',
            },
          },
        ],
      },
      status: {
        childReferences: [
          {
            apiVersion: 'tekton.dev/v1beta1',
            kind: 'TaskRun',
            name: 'human-resources-clkq-on-pull-request-fgkpt-init',
            pipelineTaskName: 'init',
          },
          {
            apiVersion: 'tekton.dev/v1beta1',
            kind: 'TaskRun',
            name: 'human-resources-clkq-on-pull-request-fgkpt-clone-repository',
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
            apiVersion: 'tekton.dev/v1beta1',
            kind: 'TaskRun',
            name: 'human-resources-clkq-on-pull-request-fgkpt-build-container',
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
            apiVersion: 'tekton.dev/v1beta1',
            kind: 'TaskRun',
            name: 'human-resources-clkq-on-pull-request-fgkpt-sanity-inspect-image',
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
            apiVersion: 'tekton.dev/v1beta1',
            kind: 'TaskRun',
            name: 'human-resources-clkq-on-pull-request-fgkpt-sanity-label-check',
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
            apiVersion: 'tekton.dev/v1beta1',
            kind: 'TaskRun',
            name: 'hume37e6ae40551aef337a9d3f259bba4d3-sanity-optional-label-check',
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
            apiVersion: 'tekton.dev/v1beta1',
            kind: 'TaskRun',
            name: 'hume37e6ae40551aef337a9d3f259bba4d3-deprecated-base-image-check',
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
            apiVersion: 'tekton.dev/v1beta1',
            kind: 'TaskRun',
            name: 'human-resources-clkq-on-pull-request-fgkpt-clair-scan',
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
            apiVersion: 'tekton.dev/v1beta1',
            kind: 'TaskRun',
            name: 'human-resources-clkq-on-pull-request-fgkpt-clamav-scan',
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
            apiVersion: 'tekton.dev/v1beta1',
            kind: 'TaskRun',
            name: 'human-resources-clkq-on-pull-request-fgkpt-sbom-json-check',
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
            apiVersion: 'tekton.dev/v1beta1',
            kind: 'TaskRun',
            name: 'human-resources-clkq-on-pull-request-fgkpt-show-summary',
            pipelineTaskName: 'show-summary',
          },
        ],
        completionTime: '2023-03-27T13:47:16Z',
        finallyStartTime: '2023-03-27T13:47:08Z',
        taskRuns: {
          'human-resources-clkq-on-pull-request-fgkpt-show-summary': {
            pipelineTaskName: 'show-summary',
            status: {
              completionTime: '2023-03-27T13:47:16Z',
              conditions: [
                {
                  lastTransitionTime: '2023-03-27T13:47:16Z',
                  message: 'All Steps have completed executing',
                  reason: 'Succeeded',
                  status: 'True',
                  type: 'Succeeded',
                },
              ],
              podName: 'human-resources-clkq-on-pull-request-fgkpt-show-summary-pod',
              startTime: '2023-03-27T13:47:08Z',
              steps: [
                {
                  container: 'step-appstudio-summary',
                  imageID:
                    'quay.io/openshift-release-dev/ocp-v4.0-art-dev@sha256:9f0cdc00b1b1a3c17411e50653253b9f6bb5329ea4fb82ad983790a6dbf2d9ad',
                  name: 'appstudio-summary',
                  terminated: {
                    containerID:
                      'cri-o://03ee4c2ff1f1598e575ddde86aec7d6edb3fb8df09cd51541e23a1d976cd306f',
                    exitCode: 0,
                    finishedAt: '2023-03-27T13:47:15Z',
                    reason: 'Completed',
                    startedAt: '2023-03-27T13:47:14Z',
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
                  {
                    default: 'Succeeded',
                    description: 'State of build task in pipelineRun',
                    name: 'build-task-status',
                    type: 'string',
                  },
                ],
                steps: [
                  {
                    env: [
                      {
                        name: 'GIT_URL',
                        value:
                          'https://github.com/jeff-phillips-18/human-resources?rev=8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
                      },
                      {
                        name: 'IMAGE_URL',
                        value:
                          'quay.io/redhat-appstudio/user-workload:on-pr-8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
                      },
                      {
                        name: 'PIPELINERUN_NAME',
                        value: 'human-resources-clkq-on-pull-request-fgkpt',
                      },
                      {
                        name: 'BUILD_TASK_STATUS',
                        value: 'Succeeded',
                      },
                    ],
                    image:
                      'registry.redhat.io/openshift4/ose-cli:v4.12@sha256:9f0cdc00b1b1a3c17411e50653253b9f6bb5329ea4fb82ad983790a6dbf2d9ad',
                    name: 'appstudio-summary',
                    resources: {},
                    script:
                      '#!/usr/bin/env bash\necho\necho "Build Summary:"\necho\necho "Build repository: $GIT_URL"\nif [ "$BUILD_TASK_STATUS" == "Succeeded" ]; then\n  echo "Generated Image is in : $IMAGE_URL"\nfi\necho\noc annotate --overwrite pipelinerun $PIPELINERUN_NAME build.appstudio.openshift.io/repo=$GIT_URL\nif [ "$BUILD_TASK_STATUS" == "Succeeded" ]; then\n  oc annotate --overwrite pipelinerun $PIPELINERUN_NAME build.appstudio.openshift.io/image=$IMAGE_URL\nfi\necho End Summary\n\noc delete --ignore-not-found=true secret $PIPELINERUN_NAME\n',
                  },
                ],
              },
            },
          },
          'human-resources-clkq-on-pull-request-fgkpt-clone-repository': {
            pipelineTaskName: 'clone-repository',
            status: {
              completionTime: '2023-03-27T13:44:27Z',
              conditions: [
                {
                  lastTransitionTime: '2023-03-27T13:44:27Z',
                  message: 'All Steps have completed executing',
                  reason: 'Succeeded',
                  status: 'True',
                  type: 'Succeeded',
                },
              ],
              podName: 'human-resources-clkq-on-pull-request-fgkpt-clone-repository-pod',
              startTime: '2023-03-27T13:44:14Z',
              steps: [
                {
                  container: 'step-clone',
                  imageID:
                    'registry.redhat.io/openshift-pipelines/pipelines-git-init-rhel8@sha256:2fa0b06d52b04f377c696412e19307a9eff27383f81d87aae0b4f71672a1cd0b',
                  name: 'clone',
                  terminated: {
                    containerID:
                      'cri-o://bdbf78d72a560b3adc9c47c08e4eb1c6b29284e51c2db53050e5093d44786da8',
                    exitCode: 0,
                    finishedAt: '2023-03-27T13:44:26Z',
                    message:
                      '[{"key":"commit","value":"8a1fd02d3fec043b009608ac67350cd4a2e02cd9","type":1},{"key":"url","value":"https://github.com/jeff-phillips-18/human-resources","type":1}]',
                    reason: 'Completed',
                    startedAt: '2023-03-27T13:44:26Z',
                  },
                },
              ],
              taskResults: [
                {
                  name: 'commit',
                  type: 'string',
                  value: '8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
                },
                {
                  name: 'url',
                  type: 'string',
                  value: 'https://github.com/jeff-phillips-18/human-resources',
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
                    description:
                      'Perform a shallow clone, fetching only the most recent N commits.',
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
                    description:
                      'Subdirectory inside the `output` Workspace to clone the repo into.',
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
                    description:
                      "Log the commands that are executed during `git-clone`'s operation.",
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
                        value: 'https://github.com/jeff-phillips-18/human-resources',
                      },
                      {
                        name: 'PARAM_REVISION',
                        value: '8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
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
            },
            whenExpressions: [
              {
                input: 'true',
                operator: 'in',
                values: ['true'],
              },
            ],
          },
          'hume37e6ae40551aef337a9d3f259bba4d3-deprecated-base-image-check': {
            pipelineTaskName: 'deprecated-base-image-check',
            status: {
              completionTime: '2023-03-27T13:45:59Z',
              conditions: [
                {
                  lastTransitionTime: '2023-03-27T13:45:59Z',
                  message: 'All Steps have completed executing',
                  reason: 'Succeeded',
                  status: 'True',
                  type: 'Succeeded',
                },
              ],
              podName: 'hume37e6ae40551aef337a9d3f2adba2db678860c03f89a7e8c304c4712-pod',
              startTime: '2023-03-27T13:45:52Z',
              steps: [
                {
                  container: 'step-query-pyxis',
                  imageID:
                    'registry.access.redhat.com/ubi8/ubi-minimal@sha256:ab03679e683010d485ef0399e056b09a38d7843ba4a36ee7dec337dd0037f7a7',
                  name: 'query-pyxis',
                  terminated: {
                    containerID:
                      'cri-o://8072471c73914d5217fec447c5b1a57581b2d6a8048881ebfe8a26d0613fbd3f',
                    exitCode: 0,
                    finishedAt: '2023-03-27T13:45:58Z',
                    message:
                      '[{"key":"PYXIS_HTTP_CODE","value":"200 registry.access.redhat.com ubi8/openjdk-17-runtime\\n200 registry.access.redhat.com ubi8/openjdk-17\\n","type":1}]',
                    reason: 'Completed',
                    startedAt: '2023-03-27T13:45:57Z',
                  },
                },
                {
                  container: 'step-run-conftest',
                  imageID:
                    'quay.io/redhat-appstudio/hacbs-test@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
                  name: 'run-conftest',
                  terminated: {
                    containerID:
                      'cri-o://b3b1c69613dc3f6eba8f49bcf6b36576ddc1f7e5b7d7e83716cd92e84a6e46a8',
                    exitCode: 0,
                    finishedAt: '2023-03-27T13:45:58Z',
                    message:
                      '[{"key":"TEST_OUTPUT","value":"{\\"result\\":\\"SUCCESS\\",\\"timestamp\\":\\"1679924758\\",\\"note\\":\\"For more details please visit the logs in workspace of Tekton tasks.\\",\\"namespace\\":\\"required_checks\\",\\"successes\\":2,\\"failures\\":0,\\"warnings\\":0}\\n","type":1},{"key":"PYXIS_HTTP_CODE","value":"200 registry.access.redhat.com ubi8/openjdk-17-runtime\\n200 registry.access.redhat.com ubi8/openjdk-17\\n","type":1}]',
                    reason: 'Completed',
                    startedAt: '2023-03-27T13:45:58Z',
                  },
                },
              ],
              taskResults: [
                {
                  name: 'PYXIS_HTTP_CODE',
                  type: 'string',
                  value:
                    '200 registry.access.redhat.com ubi8/openjdk-17-runtime\n200 registry.access.redhat.com ubi8/openjdk-17\n',
                },
                {
                  name: 'TEST_OUTPUT',
                  type: 'string',
                  value:
                    '{"result":"SUCCESS","timestamp":"1679924758","note":"For more details please visit the logs in workspace of Tekton tasks.","namespace":"required_checks","successes":2,"failures":0,"warnings":0}\n',
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
                          'registry.access.redhat.com/ubi8/openjdk-17-runtime:1.15@sha256:539d0efa60fa38e52357085b8870707808223031cbb2dfc49510668e1fb9539a\nregistry.access.redhat.com/ubi8/openjdk-17:1.14@sha256:79585ca02551ecff9d368905d7ce387232b9fd328256e7a715ae3c4ec7b086d3\n',
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
          'human-resources-clkq-on-pull-request-fgkpt-sanity-inspect-image': {
            pipelineTaskName: 'sanity-inspect-image',
            status: {
              completionTime: '2023-03-27T13:46:00Z',
              conditions: [
                {
                  lastTransitionTime: '2023-03-27T13:46:00Z',
                  message: 'All Steps have completed executing',
                  reason: 'Succeeded',
                  status: 'True',
                  type: 'Succeeded',
                },
              ],
              podName: 'human-resources-clkq-on-pul1a803f80ef3d6da4ed86770cebbac97b-pod',
              startTime: '2023-03-27T13:45:52Z',
              steps: [
                {
                  container: 'step-inspect-image',
                  imageID:
                    'quay.io/redhat-appstudio/hacbs-test@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
                  name: 'inspect-image',
                  terminated: {
                    containerID:
                      'cri-o://9b1c7c26b626477b6cc1ef69c7ef6930c97b364cf6218ab354b330b9699b45ea',
                    exitCode: 0,
                    finishedAt: '2023-03-27T13:45:59Z',
                    message:
                      '[{"key":"BASE_IMAGE","value":"registry.access.redhat.com/ubi8/openjdk-17-runtime@sha256:f72a9039039f7c911d360cead99a6a1c0bf40aec28bfc09f261c1ea716a82ada","type":1},{"key":"BASE_IMAGE_REPOSITORY","value":"ubi8/openjdk-17-runtime","type":1},{"key":"TEST_OUTPUT","value":"{\\"result\\":\\"SUCCESS\\",\\"timestamp\\":\\"1679924759\\",\\"note\\":\\"For more details please visit the logs in workspace of Tekton tasks.\\",\\"namespace\\":\\"default\\",\\"successes\\":1,\\"failures\\":0,\\"warnings\\":0}\\n","type":1}]',
                    reason: 'Completed',
                    startedAt: '2023-03-27T13:45:58Z',
                  },
                },
              ],
              taskResults: [
                {
                  name: 'BASE_IMAGE',
                  type: 'string',
                  value:
                    'registry.access.redhat.com/ubi8/openjdk-17-runtime@sha256:f72a9039039f7c911d360cead99a6a1c0bf40aec28bfc09f261c1ea716a82ada',
                },
                {
                  name: 'BASE_IMAGE_REPOSITORY',
                  type: 'string',
                  value: 'ubi8/openjdk-17-runtime',
                },
                {
                  name: 'TEST_OUTPUT',
                  type: 'string',
                  value:
                    '{"result":"SUCCESS","timestamp":"1679924759","note":"For more details please visit the logs in workspace of Tekton tasks.","namespace":"default","successes":1,"failures":0,"warnings":0}\n',
                },
              ],
              taskSpec: {
                description:
                  'Get manifest data for the source image and its base image to workspace',
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
                          'quay.io/redhat-appstudio/user-workload:on-pr-8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
                      },
                      {
                        name: 'IMAGE_DIGEST',
                        value:
                          'sha256:a273f9c8e642b4bdd27e329e38d552595fb63c42072d4ee2631f6a5dfede8e28',
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
                      secretName: 'human-resources-clkq-on-pull-request-fgkpt',
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
          'human-resources-clkq-on-pull-request-fgkpt-clamav-scan': {
            pipelineTaskName: 'clamav-scan',
            status: {
              completionTime: '2023-03-27T13:47:08Z',
              conditions: [
                {
                  lastTransitionTime: '2023-03-27T13:47:08Z',
                  message: 'All Steps have completed executing',
                  reason: 'Succeeded',
                  status: 'True',
                  type: 'Succeeded',
                },
              ],
              podName: 'human-resources-clkq-on-pull-request-fgkpt-clamav-scan-pod',
              sidecars: [
                {
                  container: 'sidecar-database',
                  imageID:
                    'quay.io/redhat-appstudio/clamav-db@sha256:0607a515934817f21034a883481b5248ab64aac1c58281620974a13c69d44fa7',
                  name: 'database',
                  terminated: {
                    containerID:
                      'cri-o://83228cd319b7b87dc1ba1c61c9951a08525a0198ea920c78172cd649cf432296',
                    exitCode: 0,
                    finishedAt: '2023-03-27T13:45:56Z',
                    reason: 'Completed',
                    startedAt: '2023-03-27T13:45:56Z',
                  },
                },
              ],
              startTime: '2023-03-27T13:45:52Z',
              steps: [
                {
                  container: 'step-extract-and-scan-image',
                  imageID:
                    'quay.io/redhat-appstudio/hacbs-test@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
                  name: 'extract-and-scan-image',
                  terminated: {
                    containerID:
                      'cri-o://6741b1cb0bad964a84196660bab37e07e3c3dee969f8e61eb60918626f713aaa',
                    exitCode: 0,
                    finishedAt: '2023-03-27T13:47:06Z',
                    reason: 'Completed',
                    startedAt: '2023-03-27T13:45:58Z',
                  },
                },
                {
                  container: 'step-modify-clam-output-to-json',
                  imageID:
                    'quay.io/redhat-appstudio/hacbs-test@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
                  name: 'modify-clam-output-to-json',
                  terminated: {
                    containerID:
                      'cri-o://da95a0a0b3f4ba92717ddf07d751bc7456c97299566dff2ed5f801118148fc8b',
                    exitCode: 0,
                    finishedAt: '2023-03-27T13:47:06Z',
                    reason: 'Completed',
                    startedAt: '2023-03-27T13:47:06Z',
                  },
                },
                {
                  container: 'step-store-hacbs-test-output-result',
                  imageID:
                    'quay.io/redhat-appstudio/hacbs-test@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
                  name: 'store-hacbs-test-output-result',
                  terminated: {
                    containerID:
                      'cri-o://64d37d2d2b87d4f967a874280494ab1ac6f14785350d725052750aebdbdfd63c',
                    exitCode: 0,
                    finishedAt: '2023-03-27T13:47:07Z',
                    message:
                      '[{"key":"TEST_OUTPUT","value":"{\\"result\\":\\"SUCCESS\\",\\"timestamp\\":\\"1679924827\\",\\"note\\":\\"For more details please visit the logs in workspace of Tekton tasks.\\",\\"namespace\\":\\"default\\",\\"successes\\":1,\\"failures\\":0,\\"warnings\\":0}\\n","type":1}]',
                    reason: 'Completed',
                    startedAt: '2023-03-27T13:47:07Z',
                  },
                },
              ],
              taskResults: [
                {
                  name: 'TEST_OUTPUT',
                  type: 'string',
                  value:
                    '{"result":"SUCCESS","timestamp":"1679924827","note":"For more details please visit the logs in workspace of Tekton tasks.","namespace":"default","successes":1,"failures":0,"warnings":0}\n',
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
                    resources: {},
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
                          'quay.io/redhat-appstudio/user-workload:on-pr-8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
                      },
                      {
                        name: 'IMAGE_DIGEST',
                        value:
                          'sha256:a273f9c8e642b4bdd27e329e38d552595fb63c42072d4ee2631f6a5dfede8e28',
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
                      secretName: 'human-resources-clkq-on-pull-request-fgkpt',
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
          'human-resources-clkq-on-pull-request-fgkpt-build-container': {
            pipelineTaskName: 'build-container',
            status: {
              completionTime: '2023-03-27T13:45:50Z',
              conditions: [
                {
                  lastTransitionTime: '2023-03-27T13:45:50Z',
                  message: 'All Steps have completed executing',
                  reason: 'Succeeded',
                  status: 'True',
                  type: 'Succeeded',
                },
              ],
              podName: 'human-resources-clkq-on-pull-request-fgkpt-build-container-pod',
              startTime: '2023-03-27T13:44:29Z',
              steps: [
                {
                  container: 'step-build',
                  imageID:
                    'quay.io/redhat-appstudio/buildah@sha256:381e9bfedd59701477621da93892106873a6951b196105d3d2d85c3f6d7b569b',
                  name: 'build',
                  terminated: {
                    containerID:
                      'cri-o://a0363b5822a660260f00b10f7584a2f699f9a0722d5808ea5682e0ab7828daca',
                    exitCode: 0,
                    finishedAt: '2023-03-27T13:45:25Z',
                    reason: 'Completed',
                    startedAt: '2023-03-27T13:44:38Z',
                  },
                },
                {
                  container: 'step-sbom-get',
                  imageID:
                    'quay.io/redhat-appstudio/syft@sha256:09afc449976230f66848c19bb5ccf344eb0eeb4ed50747e33b53aff49462c319',
                  name: 'sbom-get',
                  terminated: {
                    containerID:
                      'cri-o://1085956af4f581486806b545c39c6d1d7106e2116690fadb7f21922f2fd1ff28',
                    exitCode: 0,
                    finishedAt: '2023-03-27T13:45:34Z',
                    reason: 'Completed',
                    startedAt: '2023-03-27T13:45:25Z',
                  },
                },
                {
                  container: 'step-analyse-dependencies-java-sbom',
                  imageID:
                    'quay.io/redhat-appstudio/hacbs-jvm-build-request-processor@sha256:b198cf4b33dab59ce8ac25afd4e1001390db29ca2dec83dc8a1e21b0359ce743',
                  name: 'analyse-dependencies-java-sbom',
                  terminated: {
                    containerID:
                      'cri-o://cd9c186018b7996677b83d3b7092da5e775c0983ee79e79866e37399ac641167',
                    exitCode: 0,
                    finishedAt: '2023-03-27T13:45:35Z',
                    message: '[{"key":"JAVA_COMMUNITY_DEPENDENCIES","value":"","type":1}]',
                    reason: 'Completed',
                    startedAt: '2023-03-27T13:45:35Z',
                  },
                },
                {
                  container: 'step-merge-sboms',
                  imageID:
                    'registry.access.redhat.com/ubi9/python-39@sha256:89463fe3e086620617a4f6281640469ba7a7abd2f1b5be13e6cf0f46a6565516',
                  name: 'merge-sboms',
                  terminated: {
                    containerID:
                      'cri-o://338a213c314d83fc8f23a06470bb04706485c6072dff664d0080bdd21afd04f2',
                    exitCode: 0,
                    finishedAt: '2023-03-27T13:45:35Z',
                    message: '[{"key":"JAVA_COMMUNITY_DEPENDENCIES","value":"","type":1}]',
                    reason: 'Completed',
                    startedAt: '2023-03-27T13:45:35Z',
                  },
                },
                {
                  container: 'step-inject-sbom-and-push',
                  imageID:
                    'registry.access.redhat.com/ubi9/buildah@sha256:c8b1d312815452964885680fc5bc8d99b3bfe9b6961228c71a09c72ca8e915eb',
                  name: 'inject-sbom-and-push',
                  terminated: {
                    containerID:
                      'cri-o://6fa96f96b382b844d1a419754c0ec698fb0e4d80de5f1e931fd96f60cab82558',
                    exitCode: 0,
                    finishedAt: '2023-03-27T13:45:47Z',
                    message:
                      '[{"key":"BASE_IMAGES_DIGESTS","value":"registry.access.redhat.com/ubi8/openjdk-17-runtime:1.15@sha256:539d0efa60fa38e52357085b8870707808223031cbb2dfc49510668e1fb9539a\\nregistry.access.redhat.com/ubi8/openjdk-17:1.14@sha256:79585ca02551ecff9d368905d7ce387232b9fd328256e7a715ae3c4ec7b086d3\\n","type":1},{"key":"IMAGE_DIGEST","value":"sha256:a273f9c8e642b4bdd27e329e38d552595fb63c42072d4ee2631f6a5dfede8e28","type":1},{"key":"IMAGE_URL","value":"quay.io/redhat-appstudio/user-workload:on-pr-8a1fd02d3fec043b009608ac67350cd4a2e02cd9","type":1},{"key":"JAVA_COMMUNITY_DEPENDENCIES","value":"","type":1}]',
                    reason: 'Completed',
                    startedAt: '2023-03-27T13:45:35Z',
                  },
                },
                {
                  container: 'step-upload-sbom',
                  imageID:
                    'quay.io/redhat-appstudio/cosign@sha256:18b3716a6225727877475e1ab4f2493915e72cffd2ce431e9901d2ed2e4b2c0b',
                  name: 'upload-sbom',
                  terminated: {
                    containerID:
                      'cri-o://446f6a3bbf2b6ca300965c4006fa749431adfb3c1b15ff4d6f08c1f0a86901a9',
                    exitCode: 0,
                    finishedAt: '2023-03-27T13:45:49Z',
                    message:
                      '[{"key":"BASE_IMAGES_DIGESTS","value":"registry.access.redhat.com/ubi8/openjdk-17-runtime:1.15@sha256:539d0efa60fa38e52357085b8870707808223031cbb2dfc49510668e1fb9539a\\nregistry.access.redhat.com/ubi8/openjdk-17:1.14@sha256:79585ca02551ecff9d368905d7ce387232b9fd328256e7a715ae3c4ec7b086d3\\n","type":1},{"key":"IMAGE_DIGEST","value":"sha256:a273f9c8e642b4bdd27e329e38d552595fb63c42072d4ee2631f6a5dfede8e28","type":1},{"key":"IMAGE_URL","value":"quay.io/redhat-appstudio/user-workload:on-pr-8a1fd02d3fec043b009608ac67350cd4a2e02cd9","type":1},{"key":"JAVA_COMMUNITY_DEPENDENCIES","value":"","type":1}]',
                    reason: 'Completed',
                    startedAt: '2023-03-27T13:45:47Z',
                  },
                },
              ],
              taskResults: [
                {
                  name: 'JAVA_COMMUNITY_DEPENDENCIES',
                  type: 'string',
                  value: '',
                },
                {
                  name: 'BASE_IMAGES_DIGESTS',
                  type: 'string',
                  value:
                    'registry.access.redhat.com/ubi8/openjdk-17-runtime:1.15@sha256:539d0efa60fa38e52357085b8870707808223031cbb2dfc49510668e1fb9539a\nregistry.access.redhat.com/ubi8/openjdk-17:1.14@sha256:79585ca02551ecff9d368905d7ce387232b9fd328256e7a715ae3c4ec7b086d3\n',
                },
                {
                  name: 'IMAGE_DIGEST',
                  type: 'string',
                  value: 'sha256:a273f9c8e642b4bdd27e329e38d552595fb63c42072d4ee2631f6a5dfede8e28',
                },
                {
                  name: 'IMAGE_URL',
                  type: 'string',
                  value:
                    'quay.io/redhat-appstudio/user-workload:on-pr-8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
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
                        'quay.io/redhat-appstudio/user-workload:on-pr-8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
                    },
                    {
                      name: 'TLSVERIFY',
                      value: 'true',
                    },
                  ],
                  name: '',
                  resources: {},
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
                      "if [ -f /var/lib/containers/java ]; then\n  /opt/jboss/container/java/run/run-java.sh analyse-dependencies path $(cat /workspace/container_path) -s /workspace/source/sbom-image.json --task-run-name human-resources-clkq-on-pull-request-fgkpt-build-container --publishers /tekton/results/SBOM_JAVA_COMPONENTS_COUNT\n  sed -i 's/^/ /' /tekton/results/SBOM_JAVA_COMPONENTS_COUNT # Workaround for SRVKP-2875\nelse\n  touch /tekton/results/JAVA_COMMUNITY_DEPENDENCIES\nfi\n",
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
                      'quay.io/redhat-appstudio/user-workload:on-pr-8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
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
                      secretName: 'human-resources-clkq-on-pull-request-fgkpt',
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
          'human-resources-clkq-on-pull-request-fgkpt-sbom-json-check': {
            pipelineTaskName: 'sbom-json-check',
            status: {
              completionTime: '2023-03-27T13:46:04Z',
              conditions: [
                {
                  lastTransitionTime: '2023-03-27T13:46:04Z',
                  message: 'All Steps have completed executing',
                  reason: 'Succeeded',
                  status: 'True',
                  type: 'Succeeded',
                },
              ],
              podName: 'human-resources-clkq-on-pull-request-fgkpt-sbom-json-check-pod',
              startTime: '2023-03-27T13:45:52Z',
              steps: [
                {
                  container: 'step-sbom-json-check',
                  imageID:
                    'quay.io/redhat-appstudio/hacbs-test@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
                  name: 'sbom-json-check',
                  terminated: {
                    containerID:
                      'cri-o://27fa83f480225cbe39137166f56d0a9d61dddd58abe1f6d5a14a26c23b3c9531',
                    exitCode: 0,
                    finishedAt: '2023-03-27T13:46:04Z',
                    message:
                      '[{"key":"TEST_OUTPUT","value":"{\\"result\\":\\"SUCCESS\\",\\"timestamp\\":\\"1679924763\\",\\"note\\":\\"For more details please visit the logs in workspace of Tekton tasks.\\",\\"namespace\\":\\"default\\",\\"successes\\":1,\\"failures\\":0,\\"warnings\\":0}\\n","type":1}]',
                    reason: 'Completed',
                    startedAt: '2023-03-27T13:45:58Z',
                  },
                },
              ],
              taskResults: [
                {
                  name: 'TEST_OUTPUT',
                  type: 'string',
                  value:
                    '{"result":"SUCCESS","timestamp":"1679924763","note":"For more details please visit the logs in workspace of Tekton tasks.","namespace":"default","successes":1,"failures":0,"warnings":0}\n',
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
                          'quay.io/redhat-appstudio/user-workload:on-pr-8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
                      },
                      {
                        name: 'IMAGE_DIGEST',
                        value:
                          'sha256:a273f9c8e642b4bdd27e329e38d552595fb63c42072d4ee2631f6a5dfede8e28',
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
          'human-resources-clkq-on-pull-request-fgkpt-clair-scan': {
            pipelineTaskName: 'clair-scan',
            status: {
              completionTime: '2023-03-27T13:46:15Z',
              conditions: [
                {
                  lastTransitionTime: '2023-03-27T13:46:15Z',
                  message: 'All Steps have completed executing',
                  reason: 'Succeeded',
                  status: 'True',
                  type: 'Succeeded',
                },
              ],
              podName: 'human-resources-clkq-on-pull-request-fgkpt-clair-scan-pod',
              startTime: '2023-03-27T13:45:52Z',
              steps: [
                {
                  container: 'step-get-vulnerabilities',
                  imageID:
                    'quay.io/redhat-appstudio/clair-in-ci@sha256:8d259d799e6218e6a20e70f1120665eef3ddddf5753f1a1dc39d1a51568b6067',
                  name: 'get-vulnerabilities',
                  terminated: {
                    containerID:
                      'cri-o://512a9ea00da8db86a14a43fbfa54589fa75ac3465a5737b64ed27a3e86685f69',
                    exitCode: 0,
                    finishedAt: '2023-03-27T13:46:13Z',
                    reason: 'Completed',
                    startedAt: '2023-03-27T13:46:05Z',
                  },
                },
                {
                  container: 'step-conftest-vulnerabilities',
                  imageID:
                    'quay.io/redhat-appstudio/hacbs-test@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
                  name: 'conftest-vulnerabilities',
                  terminated: {
                    containerID:
                      'cri-o://d69577cfc082621aaca7cc5e8247ce9ec3d520901cd6d082dbab2b44a8a3661b',
                    exitCode: 0,
                    finishedAt: '2023-03-27T13:46:13Z',
                    reason: 'Completed',
                    startedAt: '2023-03-27T13:46:13Z',
                  },
                },
                {
                  container: 'step-test-format-result',
                  imageID:
                    'quay.io/redhat-appstudio/hacbs-test@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
                  name: 'test-format-result',
                  terminated: {
                    containerID:
                      'cri-o://1eb1f9faf38dd387b7aad0cfba96cc678e3a00122c4fd9cd6951b0f7cd444224',
                    exitCode: 0,
                    finishedAt: '2023-03-27T13:46:14Z',
                    message:
                      '[{"key":"CLAIR_SCAN_RESULT","value":"{\\"vulnerabilities\\":{\\"critical\\":0,\\"high\\":0,\\"medium\\":1,\\"low\\":0}}\\n","type":1},{"key":"TEST_OUTPUT","value":"{\\"result\\":\\"SUCCESS\\",\\"timestamp\\":\\"1679924774\\",\\"note\\":\\"Please refer to result CLAIR_SCAN_RESULT for the vulnerabilities scanned by clair\\",\\"namespace\\":\\"default\\",\\"successes\\":0,\\"failures\\":0,\\"warnings\\":0}\\n","type":1}]',
                    reason: 'Completed',
                    startedAt: '2023-03-27T13:46:14Z',
                  },
                },
              ],
              taskResults: [
                {
                  name: 'CLAIR_SCAN_RESULT',
                  type: 'string',
                  value: '{"vulnerabilities":{"critical":0,"high":0,"medium":1,"low":0}}\n',
                },
                {
                  name: 'TEST_OUTPUT',
                  type: 'string',
                  value:
                    '{"result":"SUCCESS","timestamp":"1679924774","note":"Please refer to result CLAIR_SCAN_RESULT for the vulnerabilities scanned by clair","namespace":"default","successes":0,"failures":0,"warnings":0}\n',
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
                    name: 'CLAIR_SCAN_RESULT',
                    type: 'string',
                  },
                ],
                steps: [
                  {
                    env: [
                      {
                        name: 'DOCKER_CONFIG',
                        value: 'human-resources-clkq-on-pull-request-fgkpt',
                      },
                      {
                        name: 'IMAGE_URL',
                        value:
                          'quay.io/redhat-appstudio/user-workload:on-pr-8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
                      },
                      {
                        name: 'IMAGE_DIGEST',
                        value:
                          'sha256:a273f9c8e642b4bdd27e329e38d552595fb63c42072d4ee2631f6a5dfede8e28',
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
                      '#!/usr/bin/env bash\n. /utils.sh\n\nif [[ ! -f /tekton/home/clair-vulnerabilities.json ]] || [[ "$(jq \'.[] | has("failures")\' /tekton/home/clair-vulnerabilities.json)" == "false" ]]; then\n  TEST_OUTPUT=$(make_result_json -r "ERROR" -t "/tekton/home/clair-vulnerabilities.json is not generated correctly, please check again")\n  echo "/tekton/home/clair-vulnerabilities.json is not generated correctly, please check again"\n  echo "${TEST_OUTPUT}" | tee /tekton/results/TEST_OUTPUT\n  exit 0\nfi\n\njq -rce \\\n  \'{vulnerabilities:{\n      critical: (.[] | .failures | map(select(.metadata.details.name=="clair_critical_vulnerabilities")) | length),\n      high: (.[] | .failures | map(select(.metadata.details.name=="clair_high_vulnerabilities")) | length),\n      medium: (.[] | .failures | map(select(.metadata.details.name=="clair_medium_vulnerabilities")) | length),\n      low: (.[] | .failures | map(select(.metadata.details.name=="clair_low_vulnerabilities")) | length)\n    }}\' /tekton/home/clair-vulnerabilities.json | tee /tekton/results/CLAIR_SCAN_RESULT\n\nTEST_OUTPUT=$(make_result_json -r "SUCCESS" -t "Please refer to result CLAIR_SCAN_RESULT for the vulnerabilities scanned by clair")\necho "${TEST_OUTPUT}" | tee /tekton/results/TEST_OUTPUT\n',
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
          'hume37e6ae40551aef337a9d3f259bba4d3-sanity-optional-label-check': {
            pipelineTaskName: 'sanity-optional-label-check',
            status: {
              completionTime: '2023-03-27T13:46:09Z',
              conditions: [
                {
                  lastTransitionTime: '2023-03-27T13:46:09Z',
                  message: 'All Steps have completed executing',
                  reason: 'Succeeded',
                  status: 'True',
                  type: 'Succeeded',
                },
              ],
              podName: 'hume37e6ae40551aef337a9d3f27d1dab94ad6fad2ff95fc32832e73c8b-pod',
              startTime: '2023-03-27T13:46:01Z',
              steps: [
                {
                  container: 'step-basic-sanity-checks-required-labels',
                  imageID:
                    'quay.io/redhat-appstudio/hacbs-test@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
                  name: 'basic-sanity-checks-required-labels',
                  terminated: {
                    containerID:
                      'cri-o://76c83d424aa87a785f5841dfc0e0f97d5faf989aa0e70dcbf8d0f61469fdc2fd',
                    exitCode: 0,
                    finishedAt: '2023-03-27T13:46:08Z',
                    message:
                      '[{"key":"TEST_OUTPUT","value":"{\\"result\\":\\"FAILURE\\",\\"timestamp\\":\\"1679924768\\",\\"note\\":\\"For more details please visit the logs in workspace of Tekton tasks.\\",\\"namespace\\":\\"optional_checks\\",\\"successes\\":2,\\"failures\\":5,\\"warnings\\":0}\\n","type":1}]',
                    reason: 'Completed',
                    startedAt: '2023-03-27T13:46:08Z',
                  },
                },
              ],
              taskResults: [
                {
                  name: 'TEST_OUTPUT',
                  type: 'string',
                  value:
                    '{"result":"FAILURE","timestamp":"1679924768","note":"For more details please visit the logs in workspace of Tekton tasks.","namespace":"optional_checks","successes":2,"failures":5,"warnings":0}\n',
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
          'human-resources-clkq-on-pull-request-fgkpt-sanity-label-check': {
            pipelineTaskName: 'sanity-label-check',
            status: {
              completionTime: '2023-03-27T13:46:09Z',
              conditions: [
                {
                  lastTransitionTime: '2023-03-27T13:46:09Z',
                  message: 'All Steps have completed executing',
                  reason: 'Succeeded',
                  status: 'True',
                  type: 'Succeeded',
                },
              ],
              podName: 'human-resources-clkq-on-pul8f1df668ffe194aa5d9a7ab9d55e4840-pod',
              startTime: '2023-03-27T13:46:01Z',
              steps: [
                {
                  container: 'step-basic-sanity-checks-required-labels',
                  imageID:
                    'quay.io/redhat-appstudio/hacbs-test@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
                  name: 'basic-sanity-checks-required-labels',
                  terminated: {
                    containerID:
                      'cri-o://1ee60ec0bd62de320730645f0bb0946eedf87853adb2095dd2538938a573c4c3',
                    exitCode: 0,
                    finishedAt: '2023-03-27T13:46:08Z',
                    message:
                      '[{"key":"TEST_OUTPUT","value":"{\\"result\\":\\"SUCCESS\\",\\"timestamp\\":\\"1679924768\\",\\"note\\":\\"For more details please visit the logs in workspace of Tekton tasks.\\",\\"namespace\\":\\"required_checks\\",\\"successes\\":21,\\"failures\\":0,\\"warnings\\":0}\\n","type":1}]',
                    reason: 'Completed',
                    startedAt: '2023-03-27T13:46:08Z',
                  },
                },
              ],
              taskResults: [
                {
                  name: 'TEST_OUTPUT',
                  type: 'string',
                  value:
                    '{"result":"SUCCESS","timestamp":"1679924768","note":"For more details please visit the logs in workspace of Tekton tasks.","namespace":"required_checks","successes":21,"failures":0,"warnings":0}\n',
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
          'human-resources-clkq-on-pull-request-fgkpt-init': {
            pipelineTaskName: 'init',
            status: {
              completionTime: '2023-03-27T13:44:10Z',
              conditions: [
                {
                  lastTransitionTime: '2023-03-27T13:44:10Z',
                  message: 'All Steps have completed executing',
                  reason: 'Succeeded',
                  status: 'True',
                  type: 'Succeeded',
                },
              ],
              podName: 'human-resources-clkq-on-pull-request-fgkpt-init-pod',
              startTime: '2023-03-27T13:44:06Z',
              steps: [
                {
                  container: 'step-init',
                  imageID:
                    'registry.redhat.io/openshift4/ose-tools-rhel8@sha256:253d042ecfad7b64593112a4aa3f528d39cb5fe738852e44f009db87964cf051',
                  name: 'init',
                  terminated: {
                    containerID:
                      'cri-o://af5c62683b138baa7d59c5f2c5fa5b3f18a0f06ccc9f61f1916fb5fb9385d901',
                    exitCode: 0,
                    finishedAt: '2023-03-27T13:44:10Z',
                    message:
                      '[{"key":"build","value":"true","type":1},{"key":"container-registry-secret","value":"human-resources-clkq-on-pull-request-fgkpt","type":1}]',
                    reason: 'Completed',
                    startedAt: '2023-03-27T13:44:10Z',
                  },
                },
              ],
              taskResults: [
                {
                  name: 'build',
                  type: 'string',
                  value: 'true',
                },
                {
                  name: 'container-registry-secret',
                  type: 'string',
                  value: 'human-resources-clkq-on-pull-request-fgkpt',
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
                        value: 'human-resources-clkq-on-pull-request-fgkpt',
                      },
                      {
                        name: 'PIPELINERUN_UID',
                        value: '47ee10fa-2567-4a8e-bb0e-184b5123bd87',
                      },
                      {
                        name: 'IMAGE_URL',
                        value:
                          'quay.io/redhat-appstudio/user-workload:on-pr-8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
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
        },
        startTime: '2023-03-27T13:44:03Z',
        pipelineResults: [
          {
            name: 'IMAGE_URL',
            value:
              'quay.io/redhat-appstudio/user-workload:on-pr-8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
          },
          {
            name: 'IMAGE_DIGEST',
            value: 'sha256:a273f9c8e642b4bdd27e329e38d552595fb63c42072d4ee2631f6a5dfede8e28',
          },
          {
            name: 'CHAINS-GIT_URL',
            value: 'https://github.com/jeff-phillips-18/human-resources',
          },
          {
            name: 'CHAINS-GIT_COMMIT',
            value: '8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
          },
          {
            name: 'JAVA_COMMUNITY_DEPENDENCIES',
            value: '',
          },
        ],
        conditions: [
          {
            lastTransitionTime: '2023-03-27T13:47:16Z',
            message: 'Tasks Completed: 11 (Failed: 0, Cancelled 0), Skipped: 2',
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
                  name: 'pipelinerun-name',
                  value: 'human-resources-clkq-on-pull-request-fgkpt',
                },
                {
                  name: 'git-url',
                  value:
                    '$(tasks.clone-repository.results.url)?rev=$(tasks.clone-repository.results.commit)',
                },
                {
                  name: 'image-url',
                  value:
                    'quay.io/redhat-appstudio/user-workload:on-pr-8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
                },
              ],
              taskRef: {
                bundle:
                  'quay.io/redhat-appstudio-tekton-catalog/task-summary:0.1@sha256:c0f66b28c338426774e34a8d4a00349fbab798b19df5841a95727148d5ef3c65',
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
                  value:
                    'quay.io/redhat-appstudio/user-workload:on-pr-8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
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
                  value: 'human-resources-clkq-on-pull-request-fgkpt',
                },
                {
                  name: 'pipelinerun-uid',
                  value: '47ee10fa-2567-4a8e-bb0e-184b5123bd87',
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
                  value: 'https://github.com/jeff-phillips-18/human-resources',
                },
                {
                  name: 'revision',
                  value: '8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
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
                  value: '',
                },
              ],
              runAfter: ['clone-repository'],
              taskRef: {
                bundle:
                  'quay.io/redhat-appstudio-tekton-catalog/task-prefetch-dependencies:0.1@sha256:bebbf6521a5a203410d6b0da5da366a5aa9bdd63522d7bf3f641e81b8cc2ba2d',
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
            },
            {
              name: 'build-container',
              params: [
                {
                  name: 'IMAGE',
                  value:
                    'quay.io/redhat-appstudio/user-workload:on-pr-8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
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
      },
    },
  ],
  application: 'my-test-output',
  shaTitle: 'Update README.md',
  isPullRequest: true,
  pullRequestNumber: '6',
};

export const MockComponents: ComponentKind[] = [
  {
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    kind: 'Component',
    metadata: {
      annotations: {
        applicationFailCounter: '0',
        'skip-initial-checks': 'true',
      },
      resourceVersion: '92029137',
      name: 'sample-component',
      uid: '30ef6d84-09ed-49f1-8a1c-bc6292a8104d',
      creationTimestamp: '2023-03-21T12:29:35Z',
      generation: 2,
      namespace: 'jephilli-tenant',
      ownerReferences: [
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          kind: 'Application',
          name: 'my-test-output',
          uid: '2901ca04-f268-4c04-9ef7-5a46f96a5ab7',
        },
      ],
      finalizers: [
        'component.appstudio.redhat.com/finalizer',
        'pac.component.appstudio.openshift.io/finalizer',
      ],
    },
    spec: {
      application: 'my-test-output',
      componentName: 'stock-app-webshop-jhnj',
      containerImage: 'quay.io/redhat-appstudio/user-workload:p0QHj-stock-app-webshop-jhnj',
      replicas: 1,
      resources: {
        requests: {
          cpu: '10m',
          memory: '180Mi',
        },
      },
      source: {
        git: {
          context: 'stock-app',
          devfileUrl:
            'https://raw.githubusercontent.com/devfile-samples/devfile-sample-java-springboot-basic/main/devfile.yaml',
          dockerfileUrl:
            'https://raw.githubusercontent.com/devfile-samples/devfile-sample-java-springboot-basic/main/docker/Dockerfile',
          url: 'https://github.com/jeff-phillips-18/webshop',
        },
      },
      targetPort: 8081,
    },
    status: {
      conditions: [
        {
          lastTransitionTime: '2023-03-21T12:29:36Z',
          message: 'GitOps resource generated successfully',
          reason: 'OK',
          status: 'True',
          type: 'GitOpsResourcesGenerated',
        },
        {
          lastTransitionTime: '2023-03-21T12:29:36Z',
          message: 'Component has been successfully created',
          reason: 'OK',
          status: 'True',
          type: 'Created',
        },
      ],
      containerImage: 'quay.io/redhat-appstudio/user-workload:p0QHj-stock-app-webshop-jhnj',
      devfile:
        "commands:\n- attributes:\n    api.devfile.io/imported-from: 'id: java-springboot, registryURL: https://registry.devfile.io'\n  exec:\n    commandLine: mvn clean -Dmaven.repo.local=/home/user/.m2/repository package -Dmaven.test.skip=true\n    component: tools\n    group:\n      isDefault: true\n      kind: build\n    hotReloadCapable: false\n    workingDir: ${PROJECT_SOURCE}\n  id: build\n- attributes:\n    api.devfile.io/imported-from: 'id: java-springboot, registryURL: https://registry.devfile.io'\n  exec:\n    commandLine: mvn -Dmaven.repo.local=/home/user/.m2/repository spring-boot:run\n    component: tools\n    group:\n      isDefault: true\n      kind: run\n    hotReloadCapable: false\n    workingDir: ${PROJECT_SOURCE}\n  id: run\n- attributes:\n    api.devfile.io/imported-from: 'id: java-springboot, registryURL: https://registry.devfile.io'\n  exec:\n    commandLine: java -Xdebug -Xrunjdwp:server=y,transport=dt_socket,address=${DEBUG_PORT},suspend=n\n      -jar target/*.jar\n    component: tools\n    group:\n      isDefault: true\n      kind: debug\n    hotReloadCapable: false\n    workingDir: ${PROJECT_SOURCE}\n  id: debug\n- apply:\n    component: image-build\n  id: build-image\n- apply:\n    component: kubernetes-deploy\n  id: deployk8s\n- composite:\n    commands:\n    - build-image\n    - deployk8s\n    group:\n      isDefault: true\n      kind: deploy\n    parallel: false\n  id: deploy\ncomponents:\n- attributes:\n    api.devfile.io/imported-from: 'id: java-springboot, registryURL: https://registry.devfile.io'\n  container:\n    command:\n    - tail\n    - -f\n    - /dev/null\n    dedicatedPod: false\n    endpoints:\n    - name: http-springboot\n      secure: false\n      targetPort: 8080\n    - exposure: none\n      name: debug\n      secure: false\n      targetPort: 5858\n    env:\n    - name: DEBUG_PORT\n      value: \"5858\"\n    image: registry.access.redhat.com/ubi8/openjdk-11:latest\n    memoryLimit: 768Mi\n    mountSources: true\n    volumeMounts:\n    - name: m2\n      path: /home/user/.m2\n  name: tools\n- attributes:\n    api.devfile.io/imported-from: 'id: java-springboot, registryURL: https://registry.devfile.io'\n  name: m2\n  volume:\n    ephemeral: false\n    size: 3Gi\n- image:\n    autoBuild: false\n    dockerfile:\n      buildContext: .\n      rootRequired: false\n      uri: https://raw.githubusercontent.com/devfile-samples/devfile-sample-java-springboot-basic/main/docker/Dockerfile\n    imageName: java-springboot-image:latest\n  name: image-build\n- attributes:\n    api.devfile.io/k8sLikeComponent-originalURI: deploy.yaml\n    deployment/container-port: 8081\n    deployment/cpuLimit: 100m\n    deployment/cpuRequest: 10m\n    deployment/memoryLimit: 300Mi\n    deployment/memoryRequest: 180Mi\n    deployment/replicas: 1\n    deployment/storageRequest: \"0\"\n  kubernetes:\n    deployByDefault: false\n    endpoints:\n    - name: http-8081\n      path: /\n      secure: false\n      targetPort: 8081\n    inlined: |-\n      kind: Deployment\n      apiVersion: apps/v1\n      metadata:\n        name: my-java-springboot\n      spec:\n        replicas: 1\n        selector:\n          matchLabels:\n            app: java-springboot-app\n        template:\n          metadata:\n            labels:\n              app: java-springboot-app\n          spec:\n            containers:\n              - name: my-java-springboot\n                image: java-springboot-image:latest\n                ports:\n                  - name: http\n                    containerPort: 8081\n                    protocol: TCP\n                resources:\n                  limits:\n                    memory: \"1024Mi\"\n                    cpu: \"500m\"\n      ---\n      kind: Service\n      apiVersion: v1\n      metadata:\n        name: my-java-springboot-svc\n      spec:\n        ports:\n          - name: http-8081\n            port: 8081\n            protocol: TCP\n            targetPort: 8081\n        selector:\n          app: java-springboot-app\n  name: kubernetes-deploy\nmetadata:\n  attributes:\n    alpha.dockerimage-port: 8081\n  description: Spring Boot® using Maven\n  displayName: Spring Boot®\n  icon: https://raw.githubusercontent.com/devfile-samples/devfile-stack-icons/main/spring.svg\n  language: Java\n  name: java-springboot\n  projectType: springboot\n  provider: Red Hat\n  supportUrl: https://github.com/devfile-samples/devfile-support#support-information\n  tags:\n  - Java\n  - Spring\n  version: 1.2.1\nschemaVersion: 2.2.0\nstarterProjects:\n- attributes:\n    api.devfile.io/imported-from: 'id: java-springboot, registryURL: https://registry.devfile.io'\n  git:\n    remotes:\n      origin: https://github.com/odo-devfiles/springboot-ex.git\n  name: springbootproject\n",
      gitops: {
        commitID: '9faf8a0739fca87875236c94aaa634c7642f09d0',
        context: './',
        repositoryURL:
          'https://github.com/redhat-appstudio-appdata/my-test-output-p0QHj-reveal-hold',
      },
    },
  },
  {
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    kind: 'Component',
    metadata: {
      annotations: {
        applicationFailCounter: '0',
      },
      resourceVersion: '59051195',
      name: 'go-3',
      uid: '30ded9a7-4a6a-41c3-b456-51dc689c33db',
      creationTimestamp: '2023-03-16T10:55:15Z',
      generation: 2,
      namespace: 'jephilli-tenant',
      ownerReferences: [
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          kind: 'Application',
          name: 'my-test-output',
          uid: '2901ca04-f268-4c04-9ef7-5a46f96a5ab7',
        },
      ],
      finalizers: [
        'component.appstudio.redhat.com/finalizer',
        'pac.component.appstudio.openshift.io/finalizer',
      ],
    },
    spec: {
      application: 'my-test-output',
      componentName: 'devfile-sample-go-basic-2cnf',
      containerImage: 'quay.io/redhat-appstudio/user-workload:p0QHj-devfile-sample-go-basic-2cnf',
      replicas: 1,
      resources: {
        requests: {
          cpu: '10m',
          memory: '10Mi',
        },
      },
      source: {
        git: {
          context: './',
          devfileUrl:
            'https://raw.githubusercontent.com/jeff-phillips-18/devfile-sample-go-basic/main/devfile.yaml',
          url: 'https://github.com/jeff-phillips-18/devfile-sample-go-basic',
        },
      },
      targetPort: 8081,
    },
    status: {
      conditions: [
        {
          lastTransitionTime: '2023-03-16T10:55:16Z',
          message: 'GitOps resource generated successfully',
          reason: 'OK',
          status: 'True',
          type: 'GitOpsResourcesGenerated',
        },
        {
          lastTransitionTime: '2023-03-16T10:55:16Z',
          message: 'Component has been successfully created',
          reason: 'OK',
          status: 'True',
          type: 'Created',
        },
      ],
      containerImage: 'quay.io/redhat-appstudio/user-workload:p0QHj-devfile-sample-go-basic-2cnf',
      devfile:
        "commands:\n- attributes:\n    api.devfile.io/imported-from: 'id: go, registryURL: https://registry.devfile.io'\n  exec:\n    commandLine: go build main.go\n    component: runtime\n    env:\n    - name: GOPATH\n      value: ${PROJECT_SOURCE}/.go\n    - name: GOCACHE\n      value: ${PROJECT_SOURCE}/.cache\n    group:\n      isDefault: true\n      kind: build\n    hotReloadCapable: false\n    workingDir: ${PROJECT_SOURCE}\n  id: build\n- attributes:\n    api.devfile.io/imported-from: 'id: go, registryURL: https://registry.devfile.io'\n  exec:\n    commandLine: ./main\n    component: runtime\n    group:\n      isDefault: true\n      kind: run\n    hotReloadCapable: false\n    workingDir: ${PROJECT_SOURCE}\n  id: run\n- apply:\n    component: image-build\n  id: build-image\n- apply:\n    component: kubernetes-deploy\n  id: deployk8s\n- composite:\n    commands:\n    - build-image\n    - deployk8s\n    group:\n      isDefault: true\n      kind: deploy\n    parallel: false\n  id: deploy\ncomponents:\n- attributes:\n    api.devfile.io/imported-from: 'id: go, registryURL: https://registry.devfile.io'\n  container:\n    args:\n    - tail\n    - -f\n    - /dev/null\n    dedicatedPod: false\n    endpoints:\n    - name: http-go\n      secure: false\n      targetPort: 8080\n    image: registry.access.redhat.com/ubi9/go-toolset:latest\n    memoryLimit: 1024Mi\n    mountSources: true\n  name: runtime\n- image:\n    autoBuild: false\n    dockerfile:\n      buildContext: .\n      rootRequired: false\n      uri: docker/Dockerfile\n    imageName: go-image:latest\n  name: image-build\n- attributes:\n    api.devfile.io/k8sLikeComponent-originalURI: deploy.yaml\n    deployment/container-port: 8081\n    deployment/cpuLimit: 100m\n    deployment/cpuRequest: 10m\n    deployment/memoryLimit: 100Mi\n    deployment/memoryRequest: 10Mi\n    deployment/replicas: 1\n    deployment/storageRequest: \"0\"\n  kubernetes:\n    deployByDefault: false\n    endpoints:\n    - name: http-8081\n      path: /\n      secure: false\n      targetPort: 8081\n    inlined: |-\n      kind: Deployment\n      apiVersion: apps/v1\n      metadata:\n        name: my-go\n      spec:\n        replicas: 1\n        selector:\n          matchLabels:\n            app: go-app\n        template:\n          metadata:\n            labels:\n              app: go-app\n          spec:\n            containers:\n              - name: my-go\n                image: go-image:latest\n                ports:\n                  - name: http\n                    containerPort: 8081\n                    protocol: TCP\n                resources:\n                  limits:\n                    memory: \"1024Mi\"\n                    cpu: \"500m\"\n      ---\n      kind: Service\n      apiVersion: v1\n      metadata:\n        name: my-go-svc\n      spec:\n      ports:\n        - name: http-8081\n          port: 8081\n          protocol: TCP\n          targetPort: 8081\n      selector:\n        app: go-app\n  name: kubernetes-deploy\nmetadata:\n  attributes:\n    alpha.dockerimage-port: 8081\n  description: Go is an open source programming language that makes it easy to build\n    simple, reliable, and efficient software. Sometimes.\n  displayName: Go Runtime\n  icon: https://raw.githubusercontent.com/devfile-samples/devfile-stack-icons/main/golang.svg\n  language: Go\n  name: go\n  projectType: Go\n  provider: Red Hat\n  supportUrl: https://github.com/devfile-samples/devfile-support#support-information\n  tags:\n  - Go\n  version: 1.1.0\nschemaVersion: 2.2.0\nstarterProjects:\n- attributes:\n    api.devfile.io/imported-from: 'id: go, registryURL: https://registry.devfile.io'\n  description: A Go project with a simple HTTP server\n  git:\n    checkoutFrom:\n      revision: main\n    remotes:\n      origin: https://github.com/devfile-samples/devfile-stack-go.git\n  name: go-starter\n",
      gitops: {
        commitID: '62c433e217218ff6ab0971785c4ec5495f97516b',
        context: './',
        repositoryURL:
          'https://github.com/redhat-appstudio-appdata/my-test-output-p0QHj-reveal-hold',
      },
    },
  },
  {
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    kind: 'Component',
    metadata: {
      annotations: {
        applicationFailCounter: '0',
        'skip-initial-checks': 'true',
      },
      resourceVersion: '92231610',
      name: 'governance-policy-propagator-aua5',
      uid: '25e7161e-59ca-471e-a0ef-b257327ee1d7',
      creationTimestamp: '2023-03-15T15:21:08Z',
      generation: 2,
      namespace: 'jephilli-tenant',
      ownerReferences: [
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          kind: 'Application',
          name: 'my-test-output',
          uid: '2901ca04-f268-4c04-9ef7-5a46f96a5ab7',
        },
      ],
      finalizers: [
        'component.appstudio.redhat.com/finalizer',
        'pac.component.appstudio.openshift.io/finalizer',
      ],
    },
    spec: {
      application: 'my-test-output',
      componentName: 'governance-policy-propagator-aua5',
      containerImage:
        'quay.io/redhat-appstudio/user-workload:p0QHj-governance-policy-propagator-aua5',
      replicas: 1,
      resources: {
        requests: {
          cpu: '10m',
          memory: '50Mi',
        },
      },
      source: {
        git: {
          context: './ddd/',
          dockerfileUrl: './Dockerfile/ddd',
          url: 'https://github.com/dfodorRH/governance-policy-propagator',
        },
      },
      targetPort: 8080,
    },
    status: {
      conditions: [
        {
          lastTransitionTime: '2023-03-15T15:21:09Z',
          message: 'GitOps resource generated successfully',
          reason: 'OK',
          status: 'True',
          type: 'GitOpsResourcesGenerated',
        },
        {
          lastTransitionTime: '2023-03-15T15:21:09Z',
          message: 'Component has been successfully created',
          reason: 'OK',
          status: 'True',
          type: 'Created',
        },
      ],
      containerImage:
        'quay.io/redhat-appstudio/user-workload:p0QHj-governance-policy-propagator-aua5',
      devfile:
        'commands:\n- apply:\n    component: dockerfile-build\n  id: build-image\ncomponents:\n- image:\n    autoBuild: false\n    dockerfile:\n      buildContext: ./ddd/\n      rootRequired: false\n      uri: ./Dockerfile/ddd\n    imageName: ""\n  name: dockerfile-build\n- attributes:\n    deployment/container-port: 8080\n    deployment/cpuRequest: 10m\n    deployment/memoryRequest: 50Mi\n    deployment/replicas: 1\n    deployment/storageRequest: "0"\n  kubernetes:\n    deployByDefault: false\n    inlined: |\n      apiVersion: apps/v1\n      kind: Deployment\n      metadata:\n        creationTimestamp: null\n        labels:\n          app.kubernetes.io/created-by: application-service\n          app.kubernetes.io/instance: governance-policy-propagator-aua5\n          app.kubernetes.io/managed-by: kustomize\n          app.kubernetes.io/name: governance-policy-propagator-aua5\n          app.kubernetes.io/part-of: my-test-output\n        name: governance-policy-propagator-aua5\n        namespace: jephilli-tenant\n      spec:\n        selector:\n          matchLabels:\n            app.kubernetes.io/instance: governance-policy-propagator-aua5\n        strategy: {}\n        template:\n          metadata:\n            creationTimestamp: null\n            labels:\n              app.kubernetes.io/instance: governance-policy-propagator-aua5\n          spec:\n            containers:\n            - image: image\n              imagePullPolicy: Always\n              name: container-image\n              resources: {}\n      status: {}\n  name: kubernetes-deploy\nmetadata:\n  description: Basic Devfile for a Dockerfile Component\n  name: dockerfile-component\nschemaVersion: 2.2.0\n',
      gitops: {
        commitID: '862a7b22ed89835bcd0f57b116ad65009d0ed437',
        context: './',
        repositoryURL:
          'https://github.com/redhat-appstudio-appdata/my-test-output-p0QHj-reveal-hold',
      },
    },
  },
  {
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    kind: 'Component',
    metadata: {
      annotations: {
        applicationFailCounter: '0',
        'skip-initial-checks': 'true',
      },
      resourceVersion: '76302998',
      name: 'stock-app-webshop-l2gd',
      uid: '7ce628ba-5420-4486-8e74-22d331d9edda',
      creationTimestamp: '2023-03-21T12:27:38Z',
      generation: 2,
      namespace: 'jephilli-tenant',
      ownerReferences: [
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          kind: 'Application',
          name: 'my-test-output',
          uid: '2901ca04-f268-4c04-9ef7-5a46f96a5ab7',
        },
      ],
      finalizers: ['component.appstudio.redhat.com/finalizer'],
    },
    spec: {
      application: 'my-test-output',
      componentName: 'stock-app-webshop-l2gd',
      containerImage: 'quay.io/redhat-appstudio/user-workload:p0QHj-stock-app-webshop-l2gd',
      replicas: 1,
      resources: {
        requests: {
          cpu: '10m',
          memory: '180Mi',
        },
      },
      source: {
        git: {
          context: 'stock-app',
          devfileUrl:
            'https://raw.githubusercontent.com/devfile-samples/devfile-sample-java-springboot-basic/main/devfile.yaml',
          dockerfileUrl:
            'https://raw.githubusercontent.com/devfile-samples/devfile-sample-java-springboot-basic/main/docker/Dockerfile',
          url: 'https://github.com/JoranBergfeld/webshop',
        },
      },
      targetPort: 8081,
    },
    status: {
      conditions: [
        {
          lastTransitionTime: '2023-03-21T12:27:42Z',
          message: 'GitOps resource generated successfully',
          reason: 'OK',
          status: 'True',
          type: 'GitOpsResourcesGenerated',
        },
        {
          lastTransitionTime: '2023-03-21T12:27:42Z',
          message: 'Component has been successfully created',
          reason: 'OK',
          status: 'True',
          type: 'Created',
        },
      ],
      containerImage: 'quay.io/redhat-appstudio/user-workload:p0QHj-stock-app-webshop-l2gd',
      devfile:
        "commands:\n- attributes:\n    api.devfile.io/imported-from: 'id: java-springboot, registryURL: https://registry.devfile.io'\n  exec:\n    commandLine: mvn clean -Dmaven.repo.local=/home/user/.m2/repository package -Dmaven.test.skip=true\n    component: tools\n    group:\n      isDefault: true\n      kind: build\n    hotReloadCapable: false\n    workingDir: ${PROJECT_SOURCE}\n  id: build\n- attributes:\n    api.devfile.io/imported-from: 'id: java-springboot, registryURL: https://registry.devfile.io'\n  exec:\n    commandLine: mvn -Dmaven.repo.local=/home/user/.m2/repository spring-boot:run\n    component: tools\n    group:\n      isDefault: true\n      kind: run\n    hotReloadCapable: false\n    workingDir: ${PROJECT_SOURCE}\n  id: run\n- attributes:\n    api.devfile.io/imported-from: 'id: java-springboot, registryURL: https://registry.devfile.io'\n  exec:\n    commandLine: java -Xdebug -Xrunjdwp:server=y,transport=dt_socket,address=${DEBUG_PORT},suspend=n\n      -jar target/*.jar\n    component: tools\n    group:\n      isDefault: true\n      kind: debug\n    hotReloadCapable: false\n    workingDir: ${PROJECT_SOURCE}\n  id: debug\n- apply:\n    component: image-build\n  id: build-image\n- apply:\n    component: kubernetes-deploy\n  id: deployk8s\n- composite:\n    commands:\n    - build-image\n    - deployk8s\n    group:\n      isDefault: true\n      kind: deploy\n    parallel: false\n  id: deploy\ncomponents:\n- attributes:\n    api.devfile.io/imported-from: 'id: java-springboot, registryURL: https://registry.devfile.io'\n  container:\n    command:\n    - tail\n    - -f\n    - /dev/null\n    dedicatedPod: false\n    endpoints:\n    - name: http-springboot\n      secure: false\n      targetPort: 8080\n    - exposure: none\n      name: debug\n      secure: false\n      targetPort: 5858\n    env:\n    - name: DEBUG_PORT\n      value: \"5858\"\n    image: registry.access.redhat.com/ubi8/openjdk-11:latest\n    memoryLimit: 768Mi\n    mountSources: true\n    volumeMounts:\n    - name: m2\n      path: /home/user/.m2\n  name: tools\n- attributes:\n    api.devfile.io/imported-from: 'id: java-springboot, registryURL: https://registry.devfile.io'\n  name: m2\n  volume:\n    ephemeral: false\n    size: 3Gi\n- image:\n    autoBuild: false\n    dockerfile:\n      buildContext: .\n      rootRequired: false\n      uri: https://raw.githubusercontent.com/devfile-samples/devfile-sample-java-springboot-basic/main/docker/Dockerfile\n    imageName: java-springboot-image:latest\n  name: image-build\n- attributes:\n    api.devfile.io/k8sLikeComponent-originalURI: deploy.yaml\n    deployment/container-port: 8081\n    deployment/cpuLimit: 100m\n    deployment/cpuRequest: 10m\n    deployment/memoryLimit: 300Mi\n    deployment/memoryRequest: 180Mi\n    deployment/replicas: 1\n    deployment/storageRequest: \"0\"\n  kubernetes:\n    deployByDefault: false\n    endpoints:\n    - name: http-8081\n      path: /\n      secure: false\n      targetPort: 8081\n    inlined: |-\n      kind: Deployment\n      apiVersion: apps/v1\n      metadata:\n        name: my-java-springboot\n      spec:\n        replicas: 1\n        selector:\n          matchLabels:\n            app: java-springboot-app\n        template:\n          metadata:\n            labels:\n              app: java-springboot-app\n          spec:\n            containers:\n              - name: my-java-springboot\n                image: java-springboot-image:latest\n                ports:\n                  - name: http\n                    containerPort: 8081\n                    protocol: TCP\n                resources:\n                  limits:\n                    memory: \"1024Mi\"\n                    cpu: \"500m\"\n      ---\n      kind: Service\n      apiVersion: v1\n      metadata:\n        name: my-java-springboot-svc\n      spec:\n        ports:\n          - name: http-8081\n            port: 8081\n            protocol: TCP\n            targetPort: 8081\n        selector:\n          app: java-springboot-app\n  name: kubernetes-deploy\nmetadata:\n  attributes:\n    alpha.dockerimage-port: 8081\n  description: Spring Boot® using Maven\n  displayName: Spring Boot®\n  icon: https://raw.githubusercontent.com/devfile-samples/devfile-stack-icons/main/spring.svg\n  language: Java\n  name: java-springboot\n  projectType: springboot\n  provider: Red Hat\n  supportUrl: https://github.com/devfile-samples/devfile-support#support-information\n  tags:\n  - Java\n  - Spring\n  version: 1.2.1\nschemaVersion: 2.2.0\nstarterProjects:\n- attributes:\n    api.devfile.io/imported-from: 'id: java-springboot, registryURL: https://registry.devfile.io'\n  git:\n    remotes:\n      origin: https://github.com/odo-devfiles/springboot-ex.git\n  name: springbootproject\n",
      gitops: {
        commitID: 'c22d31e54379cddd3a73fb2725a273ca36d39167',
        context: './',
        repositoryURL:
          'https://github.com/redhat-appstudio-appdata/my-test-output-p0QHj-reveal-hold',
      },
    },
  },
  {
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    kind: 'Component',
    metadata: {
      annotations: {
        applicationFailCounter: '0',
        'skip-initial-checks': 'true',
      },
      resourceVersion: '52321872',
      name: 'devfile-sample-go-basic-vwkv',
      uid: 'd51fcf52-6927-45ee-9118-34163d746d82',
      creationTimestamp: '2023-03-14T14:45:37Z',
      generation: 3,
      namespace: 'jephilli-tenant',
      ownerReferences: [
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          kind: 'Application',
          name: 'my-test-output',
          uid: '2901ca04-f268-4c04-9ef7-5a46f96a5ab7',
        },
      ],
      finalizers: ['component.appstudio.redhat.com/finalizer'],
    },
    spec: {
      application: 'my-test-output',
      componentName: 'devfile-sample-go-basic-vwkv',
      containerImage:
        'quay.io/redhat-appstudio/user-workload@sha256:704ab805d1f5d6588c97d22c298fc95f41d444d608fc26a8dc4a7b6e177a704a',
      replicas: 1,
      resources: {
        requests: {
          cpu: '10m',
          memory: '1Mi',
        },
      },
      source: {
        git: {
          context: './',
          devfileUrl:
            'https://raw.githubusercontent.com/jeff-phillips-18/devfile-sample-go-basic/main/devfile.yaml',
          url: 'https://github.com/jeff-phillips-18/devfile-sample-go-basic',
        },
      },
      targetPort: 8081,
    },
    status: {
      conditions: [
        {
          lastTransitionTime: '2023-03-14T14:51:42Z',
          message: 'GitOps resource generated successfully',
          reason: 'OK',
          status: 'True',
          type: 'GitOpsResourcesGenerated',
        },
        {
          lastTransitionTime: '2023-03-14T14:45:39Z',
          message: 'Component has been successfully created',
          reason: 'OK',
          status: 'True',
          type: 'Created',
        },
        {
          lastTransitionTime: '2023-03-14T14:51:42Z',
          message: 'Component has been successfully updated',
          reason: 'OK',
          status: 'True',
          type: 'Updated',
        },
      ],
      containerImage:
        'quay.io/redhat-appstudio/user-workload@sha256:704ab805d1f5d6588c97d22c298fc95f41d444d608fc26a8dc4a7b6e177a704a',
      devfile:
        "commands:\n- attributes:\n    api.devfile.io/imported-from: 'id: go, registryURL: https://registry.devfile.io'\n  exec:\n    commandLine: go build main.go\n    component: runtime\n    env:\n    - name: GOPATH\n      value: ${PROJECT_SOURCE}/.go\n    - name: GOCACHE\n      value: ${PROJECT_SOURCE}/.cache\n    group:\n      isDefault: true\n      kind: build\n    hotReloadCapable: false\n    workingDir: ${PROJECT_SOURCE}\n  id: build\n- attributes:\n    api.devfile.io/imported-from: 'id: go, registryURL: https://registry.devfile.io'\n  exec:\n    commandLine: ./main\n    component: runtime\n    group:\n      isDefault: true\n      kind: run\n    hotReloadCapable: false\n    workingDir: ${PROJECT_SOURCE}\n  id: run\n- apply:\n    component: image-build\n  id: build-image\n- apply:\n    component: kubernetes-deploy\n  id: deployk8s\n- composite:\n    commands:\n    - build-image\n    - deployk8s\n    group:\n      isDefault: true\n      kind: deploy\n    parallel: false\n  id: deploy\ncomponents:\n- attributes:\n    api.devfile.io/imported-from: 'id: go, registryURL: https://registry.devfile.io'\n  container:\n    args:\n    - tail\n    - -f\n    - /dev/null\n    dedicatedPod: false\n    endpoints:\n    - name: http-go\n      secure: false\n      targetPort: 8080\n    image: registry.access.redhat.com/ubi9/go-toolset:latest\n    memoryLimit: 1024Mi\n    mountSources: true\n  name: runtime\n- image:\n    autoBuild: false\n    dockerfile:\n      buildContext: .\n      rootRequired: false\n      uri: docker/Dockerfile\n    imageName: go-image:latest\n  name: image-build\n- attributes:\n    api.devfile.io/k8sLikeComponent-originalURI: deploy.yaml\n    deployment/container-port: 8081\n    deployment/cpuLimit: 100m\n    deployment/cpuRequest: 10m\n    deployment/memoryLimit: 100Mi\n    deployment/memoryRequest: 1Mi\n    deployment/replicas: 1\n    deployment/storageRequest: \"0\"\n  kubernetes:\n    deployByDefault: false\n    endpoints:\n    - name: http-8081\n      path: /\n      secure: false\n      targetPort: 8081\n    inlined: |-\n      kind: Deployment\n      apiVersion: apps/v1\n      metadata:\n        name: my-go\n      spec:\n        replicas: 1\n        selector:\n          matchLabels:\n            app: go-app\n        template:\n          metadata:\n            labels:\n              app: go-app\n          spec:\n            containers:\n              - name: my-go\n                image: go-image:latest\n                ports:\n                  - name: http\n                    containerPort: 8081\n                    protocol: TCP\n                resources:\n                  limits:\n                    memory: \"1024Mi\"\n                    cpu: \"500m\"\n      ---\n      kind: Service\n      apiVersion: v1\n      metadata:\n        name: my-go-svc\n      spec:\n      ports:\n        - name: http-8081\n          port: 8081\n          protocol: TCP\n          targetPort: 8081\n      selector:\n        app: go-app\n  name: kubernetes-deploy\nmetadata:\n  attributes:\n    alpha.dockerimage-port: 8081\n  description: Go is an open source programming language that makes it easy to build\n    simple, reliable, and efficient software. Sometimes.\n  displayName: Go Runtime\n  icon: https://raw.githubusercontent.com/devfile-samples/devfile-stack-icons/main/golang.svg\n  language: Go\n  name: go\n  projectType: Go\n  provider: Red Hat\n  supportUrl: https://github.com/devfile-samples/devfile-support#support-information\n  tags:\n  - Go\n  version: 1.1.0\nschemaVersion: 2.2.0\nstarterProjects:\n- attributes:\n    api.devfile.io/imported-from: 'id: go, registryURL: https://registry.devfile.io'\n  description: A Go project with a simple HTTP server\n  git:\n    checkoutFrom:\n      revision: main\n    remotes:\n      origin: https://github.com/devfile-samples/devfile-stack-go.git\n  name: go-starter\n",
      gitops: {
        commitID: '4e0a61a37a4a7a0c7ea1b32ce7a1399a481d312b',
        context: './',
        repositoryURL:
          'https://github.com/redhat-appstudio-appdata/my-test-output-p0QHj-reveal-hold',
      },
    },
  },
  {
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    kind: 'Component',
    metadata: {
      annotations: {
        applicationFailCounter: '0',
        'skip-initial-checks': 'true',
      },
      resourceVersion: '76302912',
      name: 'payment-app-webshop-ca6l',
      uid: '3ab7a215-85e2-4ffd-bef3-ff430ed225be',
      creationTimestamp: '2023-03-21T12:27:38Z',
      generation: 2,
      namespace: 'jephilli-tenant',
      ownerReferences: [
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          kind: 'Application',
          name: 'my-test-output',
          uid: '2901ca04-f268-4c04-9ef7-5a46f96a5ab7',
        },
      ],
      finalizers: ['component.appstudio.redhat.com/finalizer'],
    },
    spec: {
      application: 'my-test-output',
      componentName: 'payment-app-webshop-ca6l',
      containerImage: 'quay.io/redhat-appstudio/user-workload:p0QHj-payment-app-webshop-ca6l',
      replicas: 1,
      resources: {
        requests: {
          cpu: '10m',
          memory: '180Mi',
        },
      },
      source: {
        git: {
          context: 'payment-app',
          devfileUrl:
            'https://raw.githubusercontent.com/devfile-samples/devfile-sample-java-springboot-basic/main/devfile.yaml',
          dockerfileUrl:
            'https://raw.githubusercontent.com/devfile-samples/devfile-sample-java-springboot-basic/main/docker/Dockerfile',
          url: 'https://github.com/JoranBergfeld/webshop',
        },
      },
      targetPort: 8081,
    },
    status: {
      conditions: [
        {
          lastTransitionTime: '2023-03-21T12:27:39Z',
          message: 'GitOps resource generated successfully',
          reason: 'OK',
          status: 'True',
          type: 'GitOpsResourcesGenerated',
        },
        {
          lastTransitionTime: '2023-03-21T12:27:39Z',
          message: 'Component has been successfully created',
          reason: 'OK',
          status: 'True',
          type: 'Created',
        },
      ],
      containerImage: 'quay.io/redhat-appstudio/user-workload:p0QHj-payment-app-webshop-ca6l',
      devfile:
        "commands:\n- attributes:\n    api.devfile.io/imported-from: 'id: java-springboot, registryURL: https://registry.devfile.io'\n  exec:\n    commandLine: mvn clean -Dmaven.repo.local=/home/user/.m2/repository package -Dmaven.test.skip=true\n    component: tools\n    group:\n      isDefault: true\n      kind: build\n    hotReloadCapable: false\n    workingDir: ${PROJECT_SOURCE}\n  id: build\n- attributes:\n    api.devfile.io/imported-from: 'id: java-springboot, registryURL: https://registry.devfile.io'\n  exec:\n    commandLine: mvn -Dmaven.repo.local=/home/user/.m2/repository spring-boot:run\n    component: tools\n    group:\n      isDefault: true\n      kind: run\n    hotReloadCapable: false\n    workingDir: ${PROJECT_SOURCE}\n  id: run\n- attributes:\n    api.devfile.io/imported-from: 'id: java-springboot, registryURL: https://registry.devfile.io'\n  exec:\n    commandLine: java -Xdebug -Xrunjdwp:server=y,transport=dt_socket,address=${DEBUG_PORT},suspend=n\n      -jar target/*.jar\n    component: tools\n    group:\n      isDefault: true\n      kind: debug\n    hotReloadCapable: false\n    workingDir: ${PROJECT_SOURCE}\n  id: debug\n- apply:\n    component: image-build\n  id: build-image\n- apply:\n    component: kubernetes-deploy\n  id: deployk8s\n- composite:\n    commands:\n    - build-image\n    - deployk8s\n    group:\n      isDefault: true\n      kind: deploy\n    parallel: false\n  id: deploy\ncomponents:\n- attributes:\n    api.devfile.io/imported-from: 'id: java-springboot, registryURL: https://registry.devfile.io'\n  container:\n    command:\n    - tail\n    - -f\n    - /dev/null\n    dedicatedPod: false\n    endpoints:\n    - name: http-springboot\n      secure: false\n      targetPort: 8080\n    - exposure: none\n      name: debug\n      secure: false\n      targetPort: 5858\n    env:\n    - name: DEBUG_PORT\n      value: \"5858\"\n    image: registry.access.redhat.com/ubi8/openjdk-11:latest\n    memoryLimit: 768Mi\n    mountSources: true\n    volumeMounts:\n    - name: m2\n      path: /home/user/.m2\n  name: tools\n- attributes:\n    api.devfile.io/imported-from: 'id: java-springboot, registryURL: https://registry.devfile.io'\n  name: m2\n  volume:\n    ephemeral: false\n    size: 3Gi\n- image:\n    autoBuild: false\n    dockerfile:\n      buildContext: .\n      rootRequired: false\n      uri: https://raw.githubusercontent.com/devfile-samples/devfile-sample-java-springboot-basic/main/docker/Dockerfile\n    imageName: java-springboot-image:latest\n  name: image-build\n- attributes:\n    api.devfile.io/k8sLikeComponent-originalURI: deploy.yaml\n    deployment/container-port: 8081\n    deployment/cpuLimit: 100m\n    deployment/cpuRequest: 10m\n    deployment/memoryLimit: 300Mi\n    deployment/memoryRequest: 180Mi\n    deployment/replicas: 1\n    deployment/storageRequest: \"0\"\n  kubernetes:\n    deployByDefault: false\n    endpoints:\n    - name: http-8081\n      path: /\n      secure: false\n      targetPort: 8081\n    inlined: |-\n      kind: Deployment\n      apiVersion: apps/v1\n      metadata:\n        name: my-java-springboot\n      spec:\n        replicas: 1\n        selector:\n          matchLabels:\n            app: java-springboot-app\n        template:\n          metadata:\n            labels:\n              app: java-springboot-app\n          spec:\n            containers:\n              - name: my-java-springboot\n                image: java-springboot-image:latest\n                ports:\n                  - name: http\n                    containerPort: 8081\n                    protocol: TCP\n                resources:\n                  limits:\n                    memory: \"1024Mi\"\n                    cpu: \"500m\"\n      ---\n      kind: Service\n      apiVersion: v1\n      metadata:\n        name: my-java-springboot-svc\n      spec:\n        ports:\n          - name: http-8081\n            port: 8081\n            protocol: TCP\n            targetPort: 8081\n        selector:\n          app: java-springboot-app\n  name: kubernetes-deploy\nmetadata:\n  attributes:\n    alpha.dockerimage-port: 8081\n  description: Spring Boot® using Maven\n  displayName: Spring Boot®\n  icon: https://raw.githubusercontent.com/devfile-samples/devfile-stack-icons/main/spring.svg\n  language: Java\n  name: java-springboot\n  projectType: springboot\n  provider: Red Hat\n  supportUrl: https://github.com/devfile-samples/devfile-support#support-information\n  tags:\n  - Java\n  - Spring\n  version: 1.2.1\nschemaVersion: 2.2.0\nstarterProjects:\n- attributes:\n    api.devfile.io/imported-from: 'id: java-springboot, registryURL: https://registry.devfile.io'\n  git:\n    remotes:\n      origin: https://github.com/odo-devfiles/springboot-ex.git\n  name: springbootproject\n",
      gitops: {
        commitID: '0a5a15e4e3ed1a943271880715eaca95dfac4d9c',
        context: './',
        repositoryURL:
          'https://github.com/redhat-appstudio-appdata/my-test-output-p0QHj-reveal-hold',
      },
    },
  },
  {
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    kind: 'Component',
    metadata: {
      annotations: {
        applicationFailCounter: '0',
        'skip-initial-checks': 'true',
      },
      resourceVersion: '48396522',
      name: 'pacman-f5si',
      uid: '7d222d7e-3330-43eb-94a0-a79711e97a91',
      creationTimestamp: '2023-03-10T14:22:03Z',
      generation: 3,
      namespace: 'jephilli-tenant',
      ownerReferences: [
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          kind: 'Application',
          name: 'my-test-output',
          uid: '2901ca04-f268-4c04-9ef7-5a46f96a5ab7',
        },
      ],
      finalizers: [
        'component.appstudio.redhat.com/finalizer',
        'pac.component.appstudio.openshift.io/finalizer',
      ],
    },
    spec: {
      application: 'my-test-output',
      componentName: 'pacman-f5si',
      containerImage:
        'quay.io/redhat-appstudio/user-workload@sha256:079cf227ab4e744ef777b9c4125039b2cadd7362a80b3b76f0bf3f0cdedbccb9',
      replicas: 1,
      resources: {
        requests: {
          cpu: '10m',
          memory: '50Mi',
        },
      },
      source: {
        git: {
          context: './',
          dockerfileUrl: './Dockerfile',
          url: 'https://github.com/jeff-phillips-18/pacman',
        },
      },
      targetPort: 8080,
    },
    status: {
      conditions: [
        {
          lastTransitionTime: '2023-03-10T14:22:05Z',
          message: 'GitOps resource generated successfully',
          reason: 'OK',
          status: 'True',
          type: 'GitOpsResourcesGenerated',
        },
        {
          lastTransitionTime: '2023-03-10T14:22:05Z',
          message: 'Component has been successfully created',
          reason: 'OK',
          status: 'True',
          type: 'Created',
        },
        {
          lastTransitionTime: '2023-03-10T14:26:20Z',
          message: 'Component has been successfully updated',
          reason: 'OK',
          status: 'True',
          type: 'Updated',
        },
      ],
      containerImage:
        'quay.io/redhat-appstudio/user-workload@sha256:079cf227ab4e744ef777b9c4125039b2cadd7362a80b3b76f0bf3f0cdedbccb9',
      devfile:
        'commands:\n- apply:\n    component: dockerfile-build\n  id: build-image\ncomponents:\n- image:\n    autoBuild: false\n    dockerfile:\n      buildContext: ./\n      rootRequired: false\n      uri: ./Dockerfile\n    imageName: ""\n  name: dockerfile-build\n- attributes:\n    deployment/container-port: 8080\n    deployment/cpuRequest: 10m\n    deployment/memoryRequest: 50Mi\n    deployment/replicas: 1\n    deployment/storageRequest: "0"\n  kubernetes:\n    deployByDefault: false\n    inlined: |\n      apiVersion: apps/v1\n      kind: Deployment\n      metadata:\n        creationTimestamp: null\n        labels:\n          app.kubernetes.io/created-by: application-service\n          app.kubernetes.io/instance: pacman-f5si\n          app.kubernetes.io/managed-by: kustomize\n          app.kubernetes.io/name: pacman-f5si\n          app.kubernetes.io/part-of: my-test-output\n        name: pacman-f5si\n        namespace: jephilli-tenant\n      spec:\n        selector:\n          matchLabels:\n            app.kubernetes.io/instance: pacman-f5si\n        strategy: {}\n        template:\n          metadata:\n            creationTimestamp: null\n            labels:\n              app.kubernetes.io/instance: pacman-f5si\n          spec:\n            containers:\n            - image: image\n              imagePullPolicy: Always\n              name: container-image\n              resources: {}\n      status: {}\n  name: kubernetes-deploy\nmetadata:\n  description: Basic Devfile for a Dockerfile Component\n  name: dockerfile-component\nschemaVersion: 2.2.0\n',
      gitops: {
        commitID: '4aa2c0fc6e6521f64d234256c9a97439b09c5c40',
        context: './',
        repositoryURL:
          'https://github.com/redhat-appstudio-appdata/my-test-output-p0QHj-reveal-hold',
      },
    },
  },
  {
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    kind: 'Component',
    metadata: {
      annotations: {
        applicationFailCounter: '0',
        'skip-initial-checks': 'true',
      },
      resourceVersion: '76306740',
      name: 'order-app-webshop-4cxk',
      uid: 'dbfb1137-45d5-4be6-b03d-9942af53a998',
      creationTimestamp: '2023-03-21T12:29:35Z',
      generation: 2,
      namespace: 'jephilli-tenant',
      ownerReferences: [
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          kind: 'Application',
          name: 'my-test-output',
          uid: '2901ca04-f268-4c04-9ef7-5a46f96a5ab7',
        },
      ],
      finalizers: ['component.appstudio.redhat.com/finalizer'],
    },
    spec: {
      application: 'my-test-output',
      componentName: 'order-app-webshop-4cxk',
      containerImage: 'quay.io/redhat-appstudio/user-workload:p0QHj-order-app-webshop-4cxk',
      replicas: 1,
      resources: {
        requests: {
          cpu: '10m',
          memory: '180Mi',
        },
      },
      source: {
        git: {
          context: 'order-app',
          devfileUrl:
            'https://raw.githubusercontent.com/devfile-samples/devfile-sample-java-springboot-basic/main/devfile.yaml',
          dockerfileUrl:
            'https://raw.githubusercontent.com/devfile-samples/devfile-sample-java-springboot-basic/main/docker/Dockerfile',
          url: 'https://github.com/jeff-phillips-18/webshop',
        },
      },
      targetPort: 8081,
    },
    status: {
      conditions: [
        {
          lastTransitionTime: '2023-03-21T12:29:39Z',
          message: 'GitOps resource generated successfully',
          reason: 'OK',
          status: 'True',
          type: 'GitOpsResourcesGenerated',
        },
        {
          lastTransitionTime: '2023-03-21T12:29:39Z',
          message: 'Component has been successfully created',
          reason: 'OK',
          status: 'True',
          type: 'Created',
        },
      ],
      containerImage: 'quay.io/redhat-appstudio/user-workload:p0QHj-order-app-webshop-4cxk',
      devfile:
        "commands:\n- attributes:\n    api.devfile.io/imported-from: 'id: java-springboot, registryURL: https://registry.devfile.io'\n  exec:\n    commandLine: mvn clean -Dmaven.repo.local=/home/user/.m2/repository package -Dmaven.test.skip=true\n    component: tools\n    group:\n      isDefault: true\n      kind: build\n    hotReloadCapable: false\n    workingDir: ${PROJECT_SOURCE}\n  id: build\n- attributes:\n    api.devfile.io/imported-from: 'id: java-springboot, registryURL: https://registry.devfile.io'\n  exec:\n    commandLine: mvn -Dmaven.repo.local=/home/user/.m2/repository spring-boot:run\n    component: tools\n    group:\n      isDefault: true\n      kind: run\n    hotReloadCapable: false\n    workingDir: ${PROJECT_SOURCE}\n  id: run\n- attributes:\n    api.devfile.io/imported-from: 'id: java-springboot, registryURL: https://registry.devfile.io'\n  exec:\n    commandLine: java -Xdebug -Xrunjdwp:server=y,transport=dt_socket,address=${DEBUG_PORT},suspend=n\n      -jar target/*.jar\n    component: tools\n    group:\n      isDefault: true\n      kind: debug\n    hotReloadCapable: false\n    workingDir: ${PROJECT_SOURCE}\n  id: debug\n- apply:\n    component: image-build\n  id: build-image\n- apply:\n    component: kubernetes-deploy\n  id: deployk8s\n- composite:\n    commands:\n    - build-image\n    - deployk8s\n    group:\n      isDefault: true\n      kind: deploy\n    parallel: false\n  id: deploy\ncomponents:\n- attributes:\n    api.devfile.io/imported-from: 'id: java-springboot, registryURL: https://registry.devfile.io'\n  container:\n    command:\n    - tail\n    - -f\n    - /dev/null\n    dedicatedPod: false\n    endpoints:\n    - name: http-springboot\n      secure: false\n      targetPort: 8080\n    - exposure: none\n      name: debug\n      secure: false\n      targetPort: 5858\n    env:\n    - name: DEBUG_PORT\n      value: \"5858\"\n    image: registry.access.redhat.com/ubi8/openjdk-11:latest\n    memoryLimit: 768Mi\n    mountSources: true\n    volumeMounts:\n    - name: m2\n      path: /home/user/.m2\n  name: tools\n- attributes:\n    api.devfile.io/imported-from: 'id: java-springboot, registryURL: https://registry.devfile.io'\n  name: m2\n  volume:\n    ephemeral: false\n    size: 3Gi\n- image:\n    autoBuild: false\n    dockerfile:\n      buildContext: .\n      rootRequired: false\n      uri: https://raw.githubusercontent.com/devfile-samples/devfile-sample-java-springboot-basic/main/docker/Dockerfile\n    imageName: java-springboot-image:latest\n  name: image-build\n- attributes:\n    api.devfile.io/k8sLikeComponent-originalURI: deploy.yaml\n    deployment/container-port: 8081\n    deployment/cpuLimit: 100m\n    deployment/cpuRequest: 10m\n    deployment/memoryLimit: 300Mi\n    deployment/memoryRequest: 180Mi\n    deployment/replicas: 1\n    deployment/storageRequest: \"0\"\n  kubernetes:\n    deployByDefault: false\n    endpoints:\n    - name: http-8081\n      path: /\n      secure: false\n      targetPort: 8081\n    inlined: |-\n      kind: Deployment\n      apiVersion: apps/v1\n      metadata:\n        name: my-java-springboot\n      spec:\n        replicas: 1\n        selector:\n          matchLabels:\n            app: java-springboot-app\n        template:\n          metadata:\n            labels:\n              app: java-springboot-app\n          spec:\n            containers:\n              - name: my-java-springboot\n                image: java-springboot-image:latest\n                ports:\n                  - name: http\n                    containerPort: 8081\n                    protocol: TCP\n                resources:\n                  limits:\n                    memory: \"1024Mi\"\n                    cpu: \"500m\"\n      ---\n      kind: Service\n      apiVersion: v1\n      metadata:\n        name: my-java-springboot-svc\n      spec:\n        ports:\n          - name: http-8081\n            port: 8081\n            protocol: TCP\n            targetPort: 8081\n        selector:\n          app: java-springboot-app\n  name: kubernetes-deploy\nmetadata:\n  attributes:\n    alpha.dockerimage-port: 8081\n  description: Spring Boot® using Maven\n  displayName: Spring Boot®\n  icon: https://raw.githubusercontent.com/devfile-samples/devfile-stack-icons/main/spring.svg\n  language: Java\n  name: java-springboot\n  projectType: springboot\n  provider: Red Hat\n  supportUrl: https://github.com/devfile-samples/devfile-support#support-information\n  tags:\n  - Java\n  - Spring\n  version: 1.2.1\nschemaVersion: 2.2.0\nstarterProjects:\n- attributes:\n    api.devfile.io/imported-from: 'id: java-springboot, registryURL: https://registry.devfile.io'\n  git:\n    remotes:\n      origin: https://github.com/odo-devfiles/springboot-ex.git\n  name: springbootproject\n",
      gitops: {
        commitID: '1f14a70fbafd60121e6a2a21a48abc97f51146d8',
        context: './',
        repositoryURL:
          'https://github.com/redhat-appstudio-appdata/my-test-output-p0QHj-reveal-hold',
      },
    },
  },
  {
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    kind: 'Component',
    metadata: {
      annotations: {
        applicationFailCounter: '0',
        'skip-initial-checks': 'true',
      },
      resourceVersion: '56100925',
      name: 'governance-policy-propagator-pswg',
      uid: '4dcf0fc7-e9d4-4852-b567-63aeb1f66bd8',
      creationTimestamp: '2023-03-15T15:30:13Z',
      generation: 2,
      namespace: 'jephilli-tenant',
      ownerReferences: [
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          kind: 'Application',
          name: 'my-test-output',
          uid: '2901ca04-f268-4c04-9ef7-5a46f96a5ab7',
        },
      ],
      finalizers: ['component.appstudio.redhat.com/finalizer'],
    },
    spec: {
      application: 'my-test-output',
      componentName: 'governance-policy-propagator-pswg',
      containerImage:
        'quay.io/redhat-appstudio/user-workload:p0QHj-governance-policy-propagator-pswg',
      replicas: 1,
      resources: {
        requests: {
          cpu: '10m',
          memory: '50Mi',
        },
      },
      source: {
        git: {
          context: './blah/blah/blah',
          dockerfileUrl: './Dockerfile',
          url: 'https://github.com/dfodorRH/governance-policy-propagator',
        },
      },
      targetPort: 8080,
    },
    status: {
      conditions: [
        {
          lastTransitionTime: '2023-03-15T15:30:14Z',
          message: 'GitOps resource generated successfully',
          reason: 'OK',
          status: 'True',
          type: 'GitOpsResourcesGenerated',
        },
        {
          lastTransitionTime: '2023-03-15T15:30:14Z',
          message: 'Component has been successfully created',
          reason: 'OK',
          status: 'True',
          type: 'Created',
        },
      ],
      containerImage:
        'quay.io/redhat-appstudio/user-workload:p0QHj-governance-policy-propagator-pswg',
      devfile:
        'commands:\n- apply:\n    component: dockerfile-build\n  id: build-image\ncomponents:\n- image:\n    autoBuild: false\n    dockerfile:\n      buildContext: ./blah/blah/blah\n      rootRequired: false\n      uri: ./Dockerfile\n    imageName: ""\n  name: dockerfile-build\n- attributes:\n    deployment/container-port: 8080\n    deployment/cpuRequest: 10m\n    deployment/memoryRequest: 50Mi\n    deployment/replicas: 1\n    deployment/storageRequest: "0"\n  kubernetes:\n    deployByDefault: false\n    inlined: |\n      apiVersion: apps/v1\n      kind: Deployment\n      metadata:\n        creationTimestamp: null\n        labels:\n          app.kubernetes.io/created-by: application-service\n          app.kubernetes.io/instance: governance-policy-propagator-pswg\n          app.kubernetes.io/managed-by: kustomize\n          app.kubernetes.io/name: governance-policy-propagator-pswg\n          app.kubernetes.io/part-of: my-test-output\n        name: governance-policy-propagator-pswg\n        namespace: jephilli-tenant\n      spec:\n        selector:\n          matchLabels:\n            app.kubernetes.io/instance: governance-policy-propagator-pswg\n        strategy: {}\n        template:\n          metadata:\n            creationTimestamp: null\n            labels:\n              app.kubernetes.io/instance: governance-policy-propagator-pswg\n          spec:\n            containers:\n            - image: image\n              imagePullPolicy: Always\n              name: container-image\n              resources: {}\n      status: {}\n  name: kubernetes-deploy\nmetadata:\n  description: Basic Devfile for a Dockerfile Component\n  name: dockerfile-component\nschemaVersion: 2.2.0\n',
      gitops: {
        commitID: 'fd7a4f2ed866ab52e6c50570619fd7f9d557b9e9',
        context: './',
        repositoryURL:
          'https://github.com/redhat-appstudio-appdata/my-test-output-p0QHj-reveal-hold',
      },
    },
  },
  {
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    kind: 'Component',
    metadata: {
      annotations: {
        applicationFailCounter: '0',
        'skip-initial-checks': 'true',
      },
      resourceVersion: '88025949',
      name: 'human-resources-clkq',
      uid: '13f1139e-009a-472e-9b6e-61c6faf55928',
      creationTimestamp: '2023-03-09T19:05:03Z',
      generation: 19,
      namespace: 'jephilli-tenant',
      ownerReferences: [
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          kind: 'Application',
          name: 'my-test-output',
          uid: '2901ca04-f268-4c04-9ef7-5a46f96a5ab7',
        },
      ],
      finalizers: [
        'component.appstudio.redhat.com/finalizer',
        'pac.component.appstudio.openshift.io/finalizer',
      ],
    },
    spec: {
      application: 'my-test-output',
      componentName: 'human-resources-clkq',
      containerImage:
        'quay.io/redhat-appstudio/user-workload@sha256:303e3fd5928414b8dc7d7a51d366f68ed847488e2a76e1546d5064c903b78481',
      replicas: 1,
      resources: {
        requests: {
          cpu: '10m',
          memory: '180Mi',
        },
      },
      source: {
        git: {
          context: './',
          devfileUrl:
            'https://raw.githubusercontent.com/devfile-samples/devfile-sample-java-springboot-basic/main/devfile.yaml',
          dockerfileUrl:
            'https://raw.githubusercontent.com/devfile-samples/devfile-sample-java-springboot-basic/main/docker/Dockerfile',
          url: 'https://github.com/jeff-phillips-18/human-resources.git',
        },
      },
      targetPort: 8081,
    },
    status: {
      conditions: [
        {
          lastTransitionTime: '2023-03-13T19:42:35Z',
          message: 'GitOps resource generated successfully',
          reason: 'OK',
          status: 'True',
          type: 'GitOpsResourcesGenerated',
        },
        {
          lastTransitionTime: '2023-03-09T19:05:08Z',
          message: 'Component has been successfully created',
          reason: 'OK',
          status: 'True',
          type: 'Created',
        },
        {
          lastTransitionTime: '2023-03-13T19:42:35Z',
          message: 'Component has been successfully updated',
          reason: 'OK',
          status: 'True',
          type: 'Updated',
        },
      ],
      containerImage:
        'quay.io/redhat-appstudio/user-workload@sha256:303e3fd5928414b8dc7d7a51d366f68ed847488e2a76e1546d5064c903b78481',
      devfile:
        "commands:\n- attributes:\n    api.devfile.io/imported-from: 'id: java-springboot, registryURL: https://registry.devfile.io'\n  exec:\n    commandLine: mvn clean -Dmaven.repo.local=/home/user/.m2/repository package -Dmaven.test.skip=true\n    component: tools\n    group:\n      isDefault: true\n      kind: build\n    hotReloadCapable: false\n    workingDir: ${PROJECT_SOURCE}\n  id: build\n- attributes:\n    api.devfile.io/imported-from: 'id: java-springboot, registryURL: https://registry.devfile.io'\n  exec:\n    commandLine: mvn -Dmaven.repo.local=/home/user/.m2/repository spring-boot:run\n    component: tools\n    group:\n      isDefault: true\n      kind: run\n    hotReloadCapable: false\n    workingDir: ${PROJECT_SOURCE}\n  id: run\n- attributes:\n    api.devfile.io/imported-from: 'id: java-springboot, registryURL: https://registry.devfile.io'\n  exec:\n    commandLine: java -Xdebug -Xrunjdwp:server=y,transport=dt_socket,address=${DEBUG_PORT},suspend=n\n      -jar target/*.jar\n    component: tools\n    group:\n      isDefault: true\n      kind: debug\n    hotReloadCapable: false\n    workingDir: ${PROJECT_SOURCE}\n  id: debug\n- apply:\n    component: image-build\n  id: build-image\n- apply:\n    component: kubernetes-deploy\n  id: deployk8s\n- composite:\n    commands:\n    - build-image\n    - deployk8s\n    group:\n      isDefault: true\n      kind: deploy\n    parallel: false\n  id: deploy\ncomponents:\n- attributes:\n    api.devfile.io/imported-from: 'id: java-springboot, registryURL: https://registry.devfile.io'\n  container:\n    command:\n    - tail\n    - -f\n    - /dev/null\n    dedicatedPod: false\n    endpoints:\n    - name: http-springboot\n      secure: false\n      targetPort: 8080\n    - exposure: none\n      name: debug\n      secure: false\n      targetPort: 5858\n    env:\n    - name: DEBUG_PORT\n      value: \"5858\"\n    image: registry.access.redhat.com/ubi8/openjdk-11:latest\n    memoryLimit: 768Mi\n    mountSources: true\n    volumeMounts:\n    - name: m2\n      path: /home/user/.m2\n  name: tools\n- attributes:\n    api.devfile.io/imported-from: 'id: java-springboot, registryURL: https://registry.devfile.io'\n  name: m2\n  volume:\n    ephemeral: false\n    size: 3Gi\n- image:\n    autoBuild: false\n    dockerfile:\n      buildContext: .\n      rootRequired: false\n      uri: https://raw.githubusercontent.com/devfile-samples/devfile-sample-java-springboot-basic/main/docker/Dockerfile\n    imageName: java-springboot-image:latest\n  name: image-build\n- attributes:\n    api.devfile.io/k8sLikeComponent-originalURI: deploy.yaml\n    deployment/container-port: 8081\n    deployment/cpuLimit: 100m\n    deployment/cpuRequest: 10m\n    deployment/memoryLimit: 300Mi\n    deployment/memoryRequest: 180Mi\n    deployment/replicas: 1\n    deployment/storageRequest: \"0\"\n  kubernetes:\n    deployByDefault: false\n    endpoints:\n    - name: http-8081\n      path: /\n      secure: false\n      targetPort: 8081\n    inlined: |-\n      kind: Deployment\n      apiVersion: apps/v1\n      metadata:\n        name: my-java-springboot\n      spec:\n        replicas: 1\n        selector:\n          matchLabels:\n            app: java-springboot-app\n        template:\n          metadata:\n            labels:\n              app: java-springboot-app\n          spec:\n            containers:\n              - name: my-java-springboot\n                image: java-springboot-image:latest\n                ports:\n                  - name: http\n                    containerPort: 8081\n                    protocol: TCP\n                resources:\n                  limits:\n                    memory: \"1024Mi\"\n                    cpu: \"500m\"\n      ---\n      kind: Service\n      apiVersion: v1\n      metadata:\n        name: my-java-springboot-svc\n      spec:\n        ports:\n          - name: http-8081\n            port: 8081\n            protocol: TCP\n            targetPort: 8081\n        selector:\n          app: java-springboot-app\n  name: kubernetes-deploy\nmetadata:\n  attributes:\n    alpha.dockerimage-port: 8081\n  description: Spring Boot® using Maven\n  displayName: Spring Boot®\n  icon: https://raw.githubusercontent.com/devfile-samples/devfile-stack-icons/main/spring.svg\n  language: Java\n  name: java-springboot\n  projectType: springboot\n  provider: Red Hat\n  supportUrl: https://github.com/devfile-samples/devfile-support#support-information\n  tags:\n  - Java\n  - Spring\n  version: 1.2.1\nschemaVersion: 2.2.0\nstarterProjects:\n- attributes:\n    api.devfile.io/imported-from: 'id: java-springboot, registryURL: https://registry.devfile.io'\n  git:\n    remotes:\n      origin: https://github.com/odo-devfiles/springboot-ex.git\n  name: springbootproject\n",
      gitops: {
        commitID: '7dd6ef6bf052aa34c16cd3de12c64c3aa41acae9',
        context: './',
        repositoryURL:
          'https://github.com/redhat-appstudio-appdata/my-test-output-p0QHj-reveal-hold',
      },
    },
  },
  {
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    kind: 'Component',
    metadata: {
      annotations: {
        applicationFailCounter: '0',
      },
      resourceVersion: '73817931',
      name: 'devfile-sample-go-basic-btj3',
      uid: '5b13f214-eb88-46b9-8525-e0fb96310e75',
      creationTimestamp: '2023-03-16T10:54:18Z',
      generation: 2,
      namespace: 'jephilli-tenant',
      ownerReferences: [
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          kind: 'Application',
          name: 'my-test-output',
          uid: '2901ca04-f268-4c04-9ef7-5a46f96a5ab7',
        },
      ],
      finalizers: [
        'component.appstudio.redhat.com/finalizer',
        'pac.component.appstudio.openshift.io/finalizer',
      ],
    },
    spec: {
      application: 'my-test-output',
      componentName: 'devfile-sample-go-basic-btj3',
      containerImage: 'quay.io/redhat-appstudio/user-workload:p0QHj-devfile-sample-go-basic-btj3',
      replicas: 1,
      resources: {
        requests: {
          cpu: '10m',
          memory: '10Mi',
        },
      },
      source: {
        git: {
          context: './',
          devfileUrl:
            'https://raw.githubusercontent.com/devfile-samples/devfile-sample-go-basic/main/devfile.yaml',
          url: 'https://github.com/devfile-samples/devfile-sample-go-basic.git',
        },
      },
      targetPort: 8081,
    },
    status: {
      conditions: [
        {
          lastTransitionTime: '2023-03-16T10:54:20Z',
          message: 'GitOps resource generated successfully',
          reason: 'OK',
          status: 'True',
          type: 'GitOpsResourcesGenerated',
        },
        {
          lastTransitionTime: '2023-03-16T10:54:20Z',
          message: 'Component has been successfully created',
          reason: 'OK',
          status: 'True',
          type: 'Created',
        },
      ],
      containerImage: 'quay.io/redhat-appstudio/user-workload:p0QHj-devfile-sample-go-basic-btj3',
      devfile:
        "commands:\n- attributes:\n    api.devfile.io/imported-from: 'id: go, registryURL: https://registry.devfile.io'\n  exec:\n    commandLine: go build main.go\n    component: runtime\n    env:\n    - name: GOPATH\n      value: ${PROJECT_SOURCE}/.go\n    - name: GOCACHE\n      value: ${PROJECT_SOURCE}/.cache\n    group:\n      isDefault: true\n      kind: build\n    hotReloadCapable: false\n    workingDir: ${PROJECT_SOURCE}\n  id: build\n- attributes:\n    api.devfile.io/imported-from: 'id: go, registryURL: https://registry.devfile.io'\n  exec:\n    commandLine: ./main\n    component: runtime\n    group:\n      isDefault: true\n      kind: run\n    hotReloadCapable: false\n    workingDir: ${PROJECT_SOURCE}\n  id: run\n- apply:\n    component: image-build\n  id: build-image\n- apply:\n    component: kubernetes-deploy\n  id: deployk8s\n- composite:\n    commands:\n    - build-image\n    - deployk8s\n    group:\n      isDefault: true\n      kind: deploy\n    parallel: false\n  id: deploy\ncomponents:\n- attributes:\n    api.devfile.io/imported-from: 'id: go, registryURL: https://registry.devfile.io'\n  container:\n    args:\n    - tail\n    - -f\n    - /dev/null\n    dedicatedPod: false\n    endpoints:\n    - name: http-go\n      secure: false\n      targetPort: 8080\n    image: registry.access.redhat.com/ubi9/go-toolset:latest\n    memoryLimit: 1024Mi\n    mountSources: true\n  name: runtime\n- image:\n    autoBuild: false\n    dockerfile:\n      buildContext: .\n      rootRequired: false\n      uri: docker/Dockerfile\n    imageName: go-image:latest\n  name: image-build\n- attributes:\n    api.devfile.io/k8sLikeComponent-originalURI: deploy.yaml\n    deployment/container-port: 8081\n    deployment/cpuLimit: 100m\n    deployment/cpuRequest: 10m\n    deployment/memoryLimit: 100Mi\n    deployment/memoryRequest: 10Mi\n    deployment/replicas: 1\n    deployment/storageRequest: \"0\"\n  kubernetes:\n    deployByDefault: false\n    endpoints:\n    - name: http-8081\n      path: /\n      secure: false\n      targetPort: 8081\n    inlined: |-\n      kind: Deployment\n      apiVersion: apps/v1\n      metadata:\n        name: my-go\n      spec:\n        replicas: 1\n        selector:\n          matchLabels:\n            app: go-app\n        template:\n          metadata:\n            labels:\n              app: go-app\n          spec:\n            containers:\n              - name: my-go\n                image: go-image:latest\n                ports:\n                  - name: http\n                    containerPort: 8081\n                    protocol: TCP\n                resources:\n                  limits:\n                    memory: \"1024Mi\"\n                    cpu: \"500m\"\n      ---\n      kind: Service\n      apiVersion: v1\n      metadata:\n        name: my-go-svc\n      spec:\n      ports:\n        - name: http-8081\n          port: 8081\n          protocol: TCP\n          targetPort: 8081\n      selector:\n        app: go-app\n  name: kubernetes-deploy\nmetadata:\n  attributes:\n    alpha.dockerimage-port: 8081\n  description: Go is an open source programming language that makes it easy to build\n    simple, reliable, and efficient software.\n  displayName: Go Runtime\n  icon: https://raw.githubusercontent.com/devfile-samples/devfile-stack-icons/main/golang.svg\n  language: Go\n  name: go\n  projectType: Go\n  provider: Red Hat\n  supportUrl: https://github.com/devfile-samples/devfile-support#support-information\n  tags:\n  - Go\n  version: 1.1.0\nschemaVersion: 2.2.0\nstarterProjects:\n- attributes:\n    api.devfile.io/imported-from: 'id: go, registryURL: https://registry.devfile.io'\n  description: A Go project with a simple HTTP server\n  git:\n    checkoutFrom:\n      revision: main\n    remotes:\n      origin: https://github.com/devfile-samples/devfile-stack-go.git\n  name: go-starter\n",
      gitops: {
        commitID: '6c509b7e6d5934393bac63db6f01394e46764128',
        context: './',
        repositoryURL:
          'https://github.com/redhat-appstudio-appdata/my-test-output-p0QHj-reveal-hold',
      },
    },
  },
  {
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    kind: 'Component',
    metadata: {
      annotations: {
        applicationFailCounter: '0',
        'skip-initial-checks': 'true',
      },
      resourceVersion: '76306700',
      name: 'payment-app-webshop-vh3d',
      uid: 'af35d935-35a8-47be-98d9-141c8f65b0f1',
      creationTimestamp: '2023-03-21T12:29:35Z',
      generation: 2,
      namespace: 'jephilli-tenant',
      ownerReferences: [
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          kind: 'Application',
          name: 'my-test-output',
          uid: '2901ca04-f268-4c04-9ef7-5a46f96a5ab7',
        },
      ],
      finalizers: ['component.appstudio.redhat.com/finalizer'],
    },
    spec: {
      application: 'my-test-output',
      componentName: 'payment-app-webshop-vh3d',
      containerImage: 'quay.io/redhat-appstudio/user-workload:p0QHj-payment-app-webshop-vh3d',
      replicas: 1,
      resources: {
        requests: {
          cpu: '10m',
          memory: '180Mi',
        },
      },
      source: {
        git: {
          context: 'payment-app',
          devfileUrl:
            'https://raw.githubusercontent.com/devfile-samples/devfile-sample-java-springboot-basic/main/devfile.yaml',
          dockerfileUrl:
            'https://raw.githubusercontent.com/devfile-samples/devfile-sample-java-springboot-basic/main/docker/Dockerfile',
          url: 'https://github.com/jeff-phillips-18/webshop',
        },
      },
      targetPort: 8081,
    },
    status: {
      conditions: [
        {
          lastTransitionTime: '2023-03-21T12:29:38Z',
          message: 'GitOps resource generated successfully',
          reason: 'OK',
          status: 'True',
          type: 'GitOpsResourcesGenerated',
        },
        {
          lastTransitionTime: '2023-03-21T12:29:38Z',
          message: 'Component has been successfully created',
          reason: 'OK',
          status: 'True',
          type: 'Created',
        },
      ],
      containerImage: 'quay.io/redhat-appstudio/user-workload:p0QHj-payment-app-webshop-vh3d',
      devfile:
        "commands:\n- attributes:\n    api.devfile.io/imported-from: 'id: java-springboot, registryURL: https://registry.devfile.io'\n  exec:\n    commandLine: mvn clean -Dmaven.repo.local=/home/user/.m2/repository package -Dmaven.test.skip=true\n    component: tools\n    group:\n      isDefault: true\n      kind: build\n    hotReloadCapable: false\n    workingDir: ${PROJECT_SOURCE}\n  id: build\n- attributes:\n    api.devfile.io/imported-from: 'id: java-springboot, registryURL: https://registry.devfile.io'\n  exec:\n    commandLine: mvn -Dmaven.repo.local=/home/user/.m2/repository spring-boot:run\n    component: tools\n    group:\n      isDefault: true\n      kind: run\n    hotReloadCapable: false\n    workingDir: ${PROJECT_SOURCE}\n  id: run\n- attributes:\n    api.devfile.io/imported-from: 'id: java-springboot, registryURL: https://registry.devfile.io'\n  exec:\n    commandLine: java -Xdebug -Xrunjdwp:server=y,transport=dt_socket,address=${DEBUG_PORT},suspend=n\n      -jar target/*.jar\n    component: tools\n    group:\n      isDefault: true\n      kind: debug\n    hotReloadCapable: false\n    workingDir: ${PROJECT_SOURCE}\n  id: debug\n- apply:\n    component: image-build\n  id: build-image\n- apply:\n    component: kubernetes-deploy\n  id: deployk8s\n- composite:\n    commands:\n    - build-image\n    - deployk8s\n    group:\n      isDefault: true\n      kind: deploy\n    parallel: false\n  id: deploy\ncomponents:\n- attributes:\n    api.devfile.io/imported-from: 'id: java-springboot, registryURL: https://registry.devfile.io'\n  container:\n    command:\n    - tail\n    - -f\n    - /dev/null\n    dedicatedPod: false\n    endpoints:\n    - name: http-springboot\n      secure: false\n      targetPort: 8080\n    - exposure: none\n      name: debug\n      secure: false\n      targetPort: 5858\n    env:\n    - name: DEBUG_PORT\n      value: \"5858\"\n    image: registry.access.redhat.com/ubi8/openjdk-11:latest\n    memoryLimit: 768Mi\n    mountSources: true\n    volumeMounts:\n    - name: m2\n      path: /home/user/.m2\n  name: tools\n- attributes:\n    api.devfile.io/imported-from: 'id: java-springboot, registryURL: https://registry.devfile.io'\n  name: m2\n  volume:\n    ephemeral: false\n    size: 3Gi\n- image:\n    autoBuild: false\n    dockerfile:\n      buildContext: .\n      rootRequired: false\n      uri: https://raw.githubusercontent.com/devfile-samples/devfile-sample-java-springboot-basic/main/docker/Dockerfile\n    imageName: java-springboot-image:latest\n  name: image-build\n- attributes:\n    api.devfile.io/k8sLikeComponent-originalURI: deploy.yaml\n    deployment/container-port: 8081\n    deployment/cpuLimit: 100m\n    deployment/cpuRequest: 10m\n    deployment/memoryLimit: 300Mi\n    deployment/memoryRequest: 180Mi\n    deployment/replicas: 1\n    deployment/storageRequest: \"0\"\n  kubernetes:\n    deployByDefault: false\n    endpoints:\n    - name: http-8081\n      path: /\n      secure: false\n      targetPort: 8081\n    inlined: |-\n      kind: Deployment\n      apiVersion: apps/v1\n      metadata:\n        name: my-java-springboot\n      spec:\n        replicas: 1\n        selector:\n          matchLabels:\n            app: java-springboot-app\n        template:\n          metadata:\n            labels:\n              app: java-springboot-app\n          spec:\n            containers:\n              - name: my-java-springboot\n                image: java-springboot-image:latest\n                ports:\n                  - name: http\n                    containerPort: 8081\n                    protocol: TCP\n                resources:\n                  limits:\n                    memory: \"1024Mi\"\n                    cpu: \"500m\"\n      ---\n      kind: Service\n      apiVersion: v1\n      metadata:\n        name: my-java-springboot-svc\n      spec:\n        ports:\n          - name: http-8081\n            port: 8081\n            protocol: TCP\n            targetPort: 8081\n        selector:\n          app: java-springboot-app\n  name: kubernetes-deploy\nmetadata:\n  attributes:\n    alpha.dockerimage-port: 8081\n  description: Spring Boot® using Maven\n  displayName: Spring Boot®\n  icon: https://raw.githubusercontent.com/devfile-samples/devfile-stack-icons/main/spring.svg\n  language: Java\n  name: java-springboot\n  projectType: springboot\n  provider: Red Hat\n  supportUrl: https://github.com/devfile-samples/devfile-support#support-information\n  tags:\n  - Java\n  - Spring\n  version: 1.2.1\nschemaVersion: 2.2.0\nstarterProjects:\n- attributes:\n    api.devfile.io/imported-from: 'id: java-springboot, registryURL: https://registry.devfile.io'\n  git:\n    remotes:\n      origin: https://github.com/odo-devfiles/springboot-ex.git\n  name: springbootproject\n",
      gitops: {
        commitID: 'f6a9cdd739f60a5c15643ec7905b1da83a22235d',
        context: './',
        repositoryURL:
          'https://github.com/redhat-appstudio-appdata/my-test-output-p0QHj-reveal-hold',
      },
    },
  },
  {
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    kind: 'Component',
    metadata: {
      annotations: {
        applicationFailCounter: '0',
        'appstudio.openshift.io/sample': 'true',
        'skip-initial-checks': 'true',
      },
      resourceVersion: '52108698',
      name: 'devfile-sample-code-with-quarkus-66zm',
      uid: 'fe92946b-f5a1-4427-8c29-ba5f466dd255',
      creationTimestamp: '2023-03-14T13:23:53Z',
      generation: 3,
      namespace: 'jephilli-tenant',
      ownerReferences: [
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          kind: 'Application',
          name: 'my-test-output',
          uid: '2901ca04-f268-4c04-9ef7-5a46f96a5ab7',
        },
      ],
      finalizers: ['component.appstudio.redhat.com/finalizer'],
    },
    spec: {
      application: 'my-test-output',
      componentName: 'devfile-sample-code-with-quarkus-66zm',
      containerImage:
        'quay.io/redhat-appstudio/user-workload@sha256:8161eeea15f71858d88a1d801ce12c63347f1c27f0bd572c1a657fbb0ad0c8ab',
      replicas: 1,
      resources: {
        requests: {
          cpu: '10m',
          memory: '100Mi',
        },
      },
      source: {
        git: {
          context: './',
          devfileUrl:
            'https://raw.githubusercontent.com/devfile-samples/devfile-sample-code-with-quarkus/main/devfile.yaml',
          url: 'https://github.com/devfile-samples/devfile-sample-code-with-quarkus.git',
        },
      },
      targetPort: 8081,
    },
    status: {
      conditions: [
        {
          lastTransitionTime: '2023-03-14T13:23:55Z',
          message: 'GitOps resource generated successfully',
          reason: 'OK',
          status: 'True',
          type: 'GitOpsResourcesGenerated',
        },
        {
          lastTransitionTime: '2023-03-14T13:23:55Z',
          message: 'Component has been successfully created',
          reason: 'OK',
          status: 'True',
          type: 'Created',
        },
        {
          lastTransitionTime: '2023-03-14T13:27:44Z',
          message: 'Component has been successfully updated',
          reason: 'OK',
          status: 'True',
          type: 'Updated',
        },
      ],
      containerImage:
        'quay.io/redhat-appstudio/user-workload@sha256:8161eeea15f71858d88a1d801ce12c63347f1c27f0bd572c1a657fbb0ad0c8ab',
      devfile:
        "commands:\n- attributes:\n    api.devfile.io/imported-from: 'id: java-quarkus, registryURL: https://registry.devfile.io'\n  exec:\n    commandLine: mvn -Dmaven.repo.local=/home/user/.m2/repository compile\n    component: tools\n    hotReloadCapable: false\n    workingDir: ${PROJECT_SOURCE}\n  id: init-compile\n- attributes:\n    api.devfile.io/imported-from: 'id: java-quarkus, registryURL: https://registry.devfile.io'\n  exec:\n    commandLine: mvn -Dmaven.repo.local=/home/user/.m2/repository quarkus:dev -Dquarkus.http.host=0.0.0.0\n      -Djava.util.logging.manager=org.jboss.logmanager.LogManager\n    component: tools\n    group:\n      isDefault: true\n      kind: run\n    hotReloadCapable: true\n    workingDir: ${PROJECT_SOURCE}\n  id: dev-run\n- attributes:\n    api.devfile.io/imported-from: 'id: java-quarkus, registryURL: https://registry.devfile.io'\n  exec:\n    commandLine: mvn -Dmaven.repo.local=/home/user/.m2/repository quarkus:dev -Dquarkus.http.host=0.0.0.0\n      -Djava.util.logging.manager=org.jboss.logmanager.LogManager -Ddebug=${DEBUG_PORT}\n    component: tools\n    group:\n      isDefault: true\n      kind: debug\n    hotReloadCapable: true\n    workingDir: ${PROJECT_SOURCE}\n  id: dev-debug\n- apply:\n    component: image-build\n  id: build-image\n- apply:\n    component: kubernetes-deploy\n  id: deployk8s\n- composite:\n    commands:\n    - build-image\n    - deployk8s\n    group:\n      isDefault: true\n      kind: deploy\n    parallel: false\n  id: deploy\ncomponents:\n- attributes:\n    api.devfile.io/imported-from: 'id: java-quarkus, registryURL: https://registry.devfile.io'\n  container:\n    args:\n    - tail\n    - -f\n    - /dev/null\n    dedicatedPod: false\n    endpoints:\n    - name: http-quarkus\n      secure: false\n      targetPort: 8080\n    - exposure: none\n      name: debug\n      secure: false\n      targetPort: 5858\n    env:\n    - name: DEBUG_PORT\n      value: \"5858\"\n    image: registry.access.redhat.com/ubi8/openjdk-17\n    memoryLimit: 512Mi\n    mountSources: true\n    volumeMounts:\n    - name: m2\n      path: /home/user/.m2\n  name: tools\n- attributes:\n    api.devfile.io/imported-from: 'id: java-quarkus, registryURL: https://registry.devfile.io'\n  name: m2\n  volume:\n    ephemeral: false\n    size: 3Gi\n- image:\n    autoBuild: false\n    dockerfile:\n      buildContext: .\n      rootRequired: false\n      uri: src/main/docker/Dockerfile.jvm.staged\n    imageName: java-quarkus-image:latest\n  name: image-build\n- attributes:\n    api.devfile.io/k8sLikeComponent-originalURI: deploy.yaml\n    deployment/container-port: 8081\n    deployment/cpuLimit: 100m\n    deployment/cpuRequest: 10m\n    deployment/memoryLimit: 250Mi\n    deployment/memoryRequest: 100Mi\n    deployment/replicas: 1\n    deployment/storageRequest: \"0\"\n  kubernetes:\n    deployByDefault: false\n    endpoints:\n    - name: http-8081\n      path: /\n      secure: false\n      targetPort: 8081\n    inlined: |-\n      kind: Deployment\n      apiVersion: apps/v1\n      metadata:\n        name: my-java-quarkus\n      spec:\n        replicas: 1\n        selector:\n          matchLabels:\n            app: java-quarkus-app\n        template:\n          metadata:\n            labels:\n              app: java-quarkus-app\n          spec:\n            containers:\n              - name: my-java-quarkus\n                image: java-quarkus-image:latest\n                ports:\n                  - name: http\n                    containerPort: 8081\n                    protocol: TCP\n                resources:\n                  limits:\n                    memory: \"1024Mi\"\n                    cpu: \"500m\"\n      ---\n      kind: Service\n      apiVersion: v1\n      metadata:\n        name: my-java-quarkus-svc\n      spec:\n      ports:\n        - name: http-8081\n          port: 8081\n          protocol: TCP\n          targetPort: 8081\n      selector:\n        app: java-quarkus-app\n  name: kubernetes-deploy\nevents:\n  postStart:\n  - init-compile\nmetadata:\n  attributes:\n    alpha.dockerimage-port: 8081\n  description: Quarkus with Java\n  displayName: Quarkus Java\n  icon: https://design.jboss.org/quarkus/logo/final/SVG/quarkus_icon_rgb_default.svg\n  language: Java\n  name: java-quarkus\n  projectType: Quarkus\n  provider: Red Hat\n  supportUrl: https://github.com/devfile-samples/devfile-support#support-information\n  tags:\n  - Java\n  - Quarkus\n  version: 1.2.1\n  website: https://quarkus.io\nschemaVersion: 2.2.0\nstarterProjects:\n- attributes:\n    api.devfile.io/imported-from: 'id: java-quarkus, registryURL: https://registry.devfile.io'\n  name: community\n  zip:\n    location: https://code.quarkus.io/d?e=io.quarkus%3Aquarkus-resteasy&e=io.quarkus%3Aquarkus-micrometer&e=io.quarkus%3Aquarkus-smallrye-health&e=io.quarkus%3Aquarkus-openshift&cn=devfile\n- attributes:\n    api.devfile.io/imported-from: 'id: java-quarkus, registryURL: https://registry.devfile.io'\n  name: redhat-product\n  zip:\n    location: https://code.quarkus.redhat.com/d?e=io.quarkus%3Aquarkus-resteasy&e=io.quarkus%3Aquarkus-smallrye-health&e=io.quarkus%3Aquarkus-openshift\n",
      gitops: {
        commitID: '9e25941f95a9c5f6c0357b4fd68af2e556b54c24',
        context: './',
        repositoryURL:
          'https://github.com/redhat-appstudio-appdata/my-test-output-p0QHj-reveal-hold',
      },
    },
  },
  {
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    kind: 'Component',
    metadata: {
      annotations: {
        applicationFailCounter: '0',
        'skip-initial-checks': 'true',
      },
      resourceVersion: '73820802',
      name: 'devfile-sample-go-basic-kksq',
      uid: 'fc63ca5d-2fc8-4acb-b094-a3a03f93b7ab',
      creationTimestamp: '2023-03-14T14:16:31Z',
      generation: 3,
      namespace: 'jephilli-tenant',
      ownerReferences: [
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          kind: 'Application',
          name: 'my-test-output',
          uid: '2901ca04-f268-4c04-9ef7-5a46f96a5ab7',
        },
      ],
      finalizers: [
        'component.appstudio.redhat.com/finalizer',
        'pac.component.appstudio.openshift.io/finalizer',
      ],
    },
    spec: {
      application: 'my-test-output',
      componentName: 'devfile-sample-go-basic-kksq',
      containerImage:
        'quay.io/redhat-appstudio/user-workload@sha256:0afbdd832f28a7de094e6f0771f5b1b7a80bd8f45d282823ae9ef093d29fac52',
      replicas: 1,
      resources: {
        requests: {
          cpu: '10m',
          memory: '1Gi',
        },
      },
      source: {
        git: {
          context: './',
          devfileUrl:
            'https://raw.githubusercontent.com/jeff-phillips-18/devfile-sample-go-basic/main/devfile.yaml',
          url: 'https://github.com/jeff-phillips-18/devfile-sample-go-basic',
        },
      },
      targetPort: 8081,
    },
    status: {
      conditions: [
        {
          lastTransitionTime: '2023-03-14T14:16:33Z',
          message: 'GitOps resource generated successfully',
          reason: 'OK',
          status: 'True',
          type: 'GitOpsResourcesGenerated',
        },
        {
          lastTransitionTime: '2023-03-14T14:16:33Z',
          message: 'Component has been successfully created',
          reason: 'OK',
          status: 'True',
          type: 'Created',
        },
        {
          lastTransitionTime: '2023-03-14T14:20:27Z',
          message: 'Component has been successfully updated',
          reason: 'OK',
          status: 'True',
          type: 'Updated',
        },
      ],
      containerImage:
        'quay.io/redhat-appstudio/user-workload@sha256:0afbdd832f28a7de094e6f0771f5b1b7a80bd8f45d282823ae9ef093d29fac52',
      devfile:
        "commands:\n- attributes:\n    api.devfile.io/imported-from: 'id: go, registryURL: https://registry.devfile.io'\n  exec:\n    commandLine: go build main.go\n    component: runtime\n    env:\n    - name: GOPATH\n      value: ${PROJECT_SOURCE}/.go\n    - name: GOCACHE\n      value: ${PROJECT_SOURCE}/.cache\n    group:\n      isDefault: true\n      kind: build\n    hotReloadCapable: false\n    workingDir: ${PROJECT_SOURCE}\n  id: build\n- attributes:\n    api.devfile.io/imported-from: 'id: go, registryURL: https://registry.devfile.io'\n  exec:\n    commandLine: ./main\n    component: runtime\n    group:\n      isDefault: true\n      kind: run\n    hotReloadCapable: false\n    workingDir: ${PROJECT_SOURCE}\n  id: run\n- apply:\n    component: image-build\n  id: build-image\n- apply:\n    component: kubernetes-deploy\n  id: deployk8s\n- composite:\n    commands:\n    - build-image\n    - deployk8s\n    group:\n      isDefault: true\n      kind: deploy\n    parallel: false\n  id: deploy\ncomponents:\n- attributes:\n    api.devfile.io/imported-from: 'id: go, registryURL: https://registry.devfile.io'\n  container:\n    args:\n    - tail\n    - -f\n    - /dev/null\n    dedicatedPod: false\n    endpoints:\n    - name: http-go\n      secure: false\n      targetPort: 8080\n    image: registry.access.redhat.com/ubi9/go-toolset:latest\n    memoryLimit: 1024Mi\n    mountSources: true\n  name: runtime\n- image:\n    autoBuild: false\n    dockerfile:\n      buildContext: .\n      rootRequired: false\n      uri: docker/Dockerfile\n    imageName: go-image:latest\n  name: image-build\n- attributes:\n    api.devfile.io/k8sLikeComponent-originalURI: deploy.yaml\n    deployment/container-port: 8081\n    deployment/cpuLimit: 100m\n    deployment/cpuRequest: 10m\n    deployment/memoryLimit: 100Mi\n    deployment/memoryRequest: 1Gi\n    deployment/replicas: 1\n    deployment/storageRequest: \"0\"\n  kubernetes:\n    deployByDefault: false\n    endpoints:\n    - name: http-8081\n      path: /\n      secure: false\n      targetPort: 8081\n    inlined: |-\n      kind: Deployment\n      apiVersion: apps/v1\n      metadata:\n        name: my-go\n      spec:\n        replicas: 1\n        selector:\n          matchLabels:\n            app: go-app\n        template:\n          metadata:\n            labels:\n              app: go-app\n          spec:\n            containers:\n              - name: my-go\n                image: go-image:latest\n                ports:\n                  - name: http\n                    containerPort: 8081\n                    protocol: TCP\n                resources:\n                  limits:\n                    memory: \"1024Mi\"\n                    cpu: \"500m\"\n      ---\n      kind: Service\n      apiVersion: v1\n      metadata:\n        name: my-go-svc\n      spec:\n      ports:\n        - name: http-8081\n          port: 8081\n          protocol: TCP\n          targetPort: 8081\n      selector:\n        app: go-app\n  name: kubernetes-deploy\nmetadata:\n  attributes:\n    alpha.dockerimage-port: 8081\n  description: Go is an open source programming language that makes it easy to build\n    simple, reliable, and efficient software. Sometimes.\n  displayName: Go Runtime\n  icon: https://raw.githubusercontent.com/devfile-samples/devfile-stack-icons/main/golang.svg\n  language: Go\n  name: go\n  projectType: Go\n  provider: Red Hat\n  supportUrl: https://github.com/devfile-samples/devfile-support#support-information\n  tags:\n  - Go\n  version: 1.1.0\nschemaVersion: 2.2.0\nstarterProjects:\n- attributes:\n    api.devfile.io/imported-from: 'id: go, registryURL: https://registry.devfile.io'\n  description: A Go project with a simple HTTP server\n  git:\n    checkoutFrom:\n      revision: main\n    remotes:\n      origin: https://github.com/devfile-samples/devfile-stack-go.git\n  name: go-starter\n",
      gitops: {
        commitID: '7f2aac1294d8dd5dbb2ae2e80d65a72809bfc230',
        context: './',
        repositoryURL:
          'https://github.com/redhat-appstudio-appdata/my-test-output-p0QHj-reveal-hold',
      },
    },
  },
];

export const MockIntegrationTests = [
  {
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    kind: 'IntegrationTestScenario',
    metadata: {
      creationTimestamp: '2023-03-17T12:29:07Z',
      generation: 1,
      name: 'application-test-one',
      namespace: 'jephilli-tenant',
      ownerReferences: [
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          blockOwnerDeletion: true,
          controller: true,
          kind: 'Application',
          name: 'my-test-output',
          uid: '2901ca04-f268-4c04-9ef7-5a46f96a5ab7',
        },
      ],
      resourceVersion: '62905847',
      uid: '94e4a191-52f8-4f9d-a4c6-6ce3598ecfd5',
    },
    spec: {
      application: 'my-test-output',
      bundle: 'quay.io/kpavic/test-bundle:component-pipeline-pass',
      contexts: [
        {
          description: 'Application testing',
          name: 'application',
        },
      ],
      pipeline: 'component-pipeline-pass',
    },
    status: {
      conditions: [
        {
          lastTransitionTime: '2023-03-17T12:29:07Z',
          message: 'Integration test scenario is Valid.',
          reason: 'Valid',
          status: 'True',
          type: 'IntegrationTestScenarioValid',
        },
      ],
    },
  },
  {
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    kind: 'IntegrationTestScenario',
    metadata: {
      creationTimestamp: '2023-03-17T12:29:36Z',
      generation: 1,
      name: 'application-test-two',
      namespace: 'jephilli-tenant',
      ownerReferences: [
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          blockOwnerDeletion: true,
          controller: true,
          kind: 'Application',
          name: 'my-test-output',
          uid: '2901ca04-f268-4c04-9ef7-5a46f96a5ab7',
        },
      ],
      resourceVersion: '62906465',
      uid: 'a0a9a386-f45f-472e-bfa4-d2ae9480c35f',
    },
    spec: {
      application: 'my-test-output',
      bundle: 'quay.io/kpavic/test-bundle:component-pipeline-pass',
      contexts: [
        {
          description: 'Application testing',
          name: 'application',
        },
      ],
      pipeline: 'component-pipeline-pass',
    },
    status: {
      conditions: [
        {
          lastTransitionTime: '2023-03-17T12:29:36Z',
          message: 'Integration test scenario is Valid.',
          reason: 'Valid',
          status: 'True',
          type: 'IntegrationTestScenarioValid',
        },
      ],
    },
  },
  {
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    kind: 'IntegrationTestScenario',
    metadata: {
      annotations: {
        'kubectl.kubernetes.io/last-applied-configuration':
          '{"apiVersion":"appstudio.redhat.com/v1alpha1","kind":"IntegrationTestScenario","metadata":{"annotations":{},"name":"component-integration-test-one","namespace":"jephilli-tenant"},"spec":{"application":"my-test-output","bundle":"quay.io/kpavic/test-bundle:component-pipeline-pass","contexts":[{"description":"Runs only during application testing","name":"component"}],"environment":{"name":"test-environment","params":[],"type":"workspace"},"params":[{"name":"test-param","value":"test"}],"pipeline":"component-pipeline-pass"}}\n',
      },
      resourceVersion: '92249440',
      name: 'component-integration-test-one',
      uid: 'e3e20b5a-3569-48e8-a9cb-95e76d9a9064',
      creationTimestamp: '2023-03-20T14:45:00Z',
      generation: 5,
      namespace: 'jephilli-tenant',
      ownerReferences: [
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          blockOwnerDeletion: true,
          controller: true,
          kind: 'Application',
          name: 'my-test-output',
          uid: '2901ca04-f268-4c04-9ef7-5a46f96a5ab7',
        },
      ],
    },
    spec: {
      application: 'my-test-output',
      bundle: 'quay.io/kpavic/test-bundle:component-pipeline-pass',
      contexts: [
        {
          description: 'Runs only during application testing',
          name: 'component',
        },
      ],
      environment: {
        name: 'test-environment',
        type: 'workspace',
      },
      params: [
        {
          name: 'test-param',
          value: 'test',
        },
      ],
      pipeline: 'component-pipeline-pass',
    },
    status: {
      conditions: [
        {
          lastTransitionTime: '2023-03-20T15:04:32Z',
          message: 'Environment test-environment is located in different namespace than scenario.',
          reason: 'Invalid',
          status: 'False',
          type: 'IntegrationTestScenarioValid',
        },
      ],
    },
  },
  {
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    kind: 'IntegrationTestScenario',
    metadata: {
      creationTimestamp: '2023-03-13T12:55:42Z',
      generation: 1,
      name: 'kpavic-test-bundle',
      namespace: 'jephilli-tenant',
      ownerReferences: [
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          blockOwnerDeletion: true,
          controller: true,
          kind: 'Application',
          name: 'my-test-output',
          uid: '2901ca04-f268-4c04-9ef7-5a46f96a5ab7',
        },
      ],
      resourceVersion: '48394409',
      uid: '5193149d-d2da-4721-8e6a-47b41155c86a',
    },
    spec: {
      application: 'my-test-output',
      bundle: 'quay.io/kpavic/test-bundle:pipeline',
      contexts: [
        {
          description: 'Application testing',
          name: 'application',
        },
      ],
      pipeline: 'demo-pipeline',
    },
    status: {
      conditions: [
        {
          lastTransitionTime: '2023-03-13T12:55:42Z',
          message: 'Integration test scenario is Valid.',
          reason: 'Valid',
          status: 'True',
          type: 'IntegrationTestScenarioValid',
        },
      ],
    },
  },
];

export const MockBuildPipelines = [
  {
    apiVersion: 'tekton.dev/v1beta1',
    kind: 'PipelineRun',
    metadata: {
      generateName: 'human-resources-clkq-on-pull-request-',
      annotations: {
        'pipelinesascode.tekton.dev/on-target-branch': '[main,master]',
        'pipelinesascode.tekton.dev/repo-url':
          'https://github.com/jeff-phillips-18/human-resources',
        'pipelinesascode.tekton.dev/sha-title': 'Update README.md',
        'results.tekton.dev/record':
          'jephilli-tenant/results/47ee10fa-2567-4a8e-bb0e-184b5123bd87/records/47ee10fa-2567-4a8e-bb0e-184b5123bd87',
        'pipelinesascode.tekton.dev/git-auth-secret': 'pac-gitauth-vfnr',
        'build.appstudio.openshift.io/repo':
          'https://github.com/jeff-phillips-18/human-resources?rev=8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
        'chains.tekton.dev/signed': 'true',
        'results.tekton.dev/result': 'jephilli-tenant/results/47ee10fa-2567-4a8e-bb0e-184b5123bd87',
        'pipelinesascode.tekton.dev/log-url':
          'https://console-openshift-console.apps.stone-prd-m01.84db.p1.openshiftapps.com/k8s/ns/jephilli-tenant/tekton.dev~v1beta1~PipelineRun/human-resources-clkq-on-pull-request-fgkpt',
        'build.appstudio.redhat.com/target_branch': 'main',
        'pipelinesascode.tekton.dev/max-keep-runs': '3',
        'build.appstudio.redhat.com/pull_request_number': '6',
        'pipelinesascode.tekton.dev/sha-url':
          'https://github.com/jeff-phillips-18/human-resources/commit/8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
        'pipelinesascode.tekton.dev/on-event': '[pull_request]',
        'pipelinesascode.tekton.dev/installation-id': '34687113',
        'build.appstudio.redhat.com/commit_sha': '8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
        'build.appstudio.openshift.io/image':
          'quay.io/redhat-appstudio/user-workload:on-pr-8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
      },
      resourceVersion: '92260234',
      name: 'human-resources-clkq-on-pull-request-fgkpt',
      uid: '47ee10fa-2567-4a8e-bb0e-184b5123bd87',
      creationTimestamp: '2023-03-27T13:44:03Z',
      generation: 1,
      namespace: 'jephilli-tenant',
      finalizers: ['pipelinesascode.tekton.dev', 'chains.tekton.dev/pipelinerun'],
      labels: {
        'pipelinesascode.tekton.dev/state': 'completed',
        'appstudio.openshift.io/component': 'human-resources-clkq',
        'pipelinesascode.tekton.dev/sender': 'jeff-phillips-18',
        'app.kubernetes.io/version': 'v0.16.0',
        'tekton.dev/pipeline': 'human-resources-clkq-on-pull-request-fgkpt',
        'app.kubernetes.io/managed-by': 'pipelinesascode.tekton.dev',
        'pipelinesascode.tekton.dev/check-run-id': '12302899421',
        'pipelinesascode.tekton.dev/branch': 'main',
        'appstudio.openshift.io/application': 'my-test-output',
        'pipelinesascode.tekton.dev/url-org': 'jeff-phillips-18',
        'pipelinesascode.tekton.dev/original-prname': 'human-resources-clkq-on-pull-request',
        'pipelinesascode.tekton.dev/pull-request': '6',
        'pipelines.appstudio.openshift.io/type': 'build',
        'pipelinesascode.tekton.dev/url-repository': 'human-resources',
        'pipelinesascode.tekton.dev/repository': 'human-resources-clkq',
        'pipelinesascode.tekton.dev/sha': '8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
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
          value: 'https://github.com/jeff-phillips-18/human-resources',
        },
        {
          name: 'output-image',
          value:
            'quay.io/redhat-appstudio/user-workload:on-pr-8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
        },
        {
          name: 'path-context',
          value: '.',
        },
        {
          name: 'revision',
          value: '8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
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
                'quay.io/redhat-appstudio-tekton-catalog/task-summary:0.1@sha256:c0f66b28c338426774e34a8d4a00349fbab798b19df5841a95727148d5ef3c65',
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
                'quay.io/redhat-appstudio-tekton-catalog/task-prefetch-dependencies:0.1@sha256:bebbf6521a5a203410d6b0da5da366a5aa9bdd63522d7bf3f641e81b8cc2ba2d',
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
            secretName: 'pac-gitauth-vfnr',
          },
        },
      ],
    },
    status: {
      childReferences: [
        {
          apiVersion: 'tekton.dev/v1beta1',
          kind: 'TaskRun',
          name: 'human-resources-clkq-on-pull-request-fgkpt-init',
          pipelineTaskName: 'init',
        },
        {
          apiVersion: 'tekton.dev/v1beta1',
          kind: 'TaskRun',
          name: 'human-resources-clkq-on-pull-request-fgkpt-clone-repository',
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
          apiVersion: 'tekton.dev/v1beta1',
          kind: 'TaskRun',
          name: 'human-resources-clkq-on-pull-request-fgkpt-build-container',
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
          apiVersion: 'tekton.dev/v1beta1',
          kind: 'TaskRun',
          name: 'human-resources-clkq-on-pull-request-fgkpt-sanity-inspect-image',
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
          apiVersion: 'tekton.dev/v1beta1',
          kind: 'TaskRun',
          name: 'human-resources-clkq-on-pull-request-fgkpt-sanity-label-check',
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
          apiVersion: 'tekton.dev/v1beta1',
          kind: 'TaskRun',
          name: 'hume37e6ae40551aef337a9d3f259bba4d3-sanity-optional-label-check',
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
          apiVersion: 'tekton.dev/v1beta1',
          kind: 'TaskRun',
          name: 'hume37e6ae40551aef337a9d3f259bba4d3-deprecated-base-image-check',
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
          apiVersion: 'tekton.dev/v1beta1',
          kind: 'TaskRun',
          name: 'human-resources-clkq-on-pull-request-fgkpt-clair-scan',
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
          apiVersion: 'tekton.dev/v1beta1',
          kind: 'TaskRun',
          name: 'human-resources-clkq-on-pull-request-fgkpt-clamav-scan',
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
          apiVersion: 'tekton.dev/v1beta1',
          kind: 'TaskRun',
          name: 'human-resources-clkq-on-pull-request-fgkpt-sbom-json-check',
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
          apiVersion: 'tekton.dev/v1beta1',
          kind: 'TaskRun',
          name: 'human-resources-clkq-on-pull-request-fgkpt-show-summary',
          pipelineTaskName: 'show-summary',
        },
      ],
      completionTime: '2023-03-27T13:47:16Z',
      finallyStartTime: '2023-03-27T13:47:08Z',
      taskRuns: {
        'human-resources-clkq-on-pull-request-fgkpt-show-summary': {
          pipelineTaskName: 'show-summary',
          status: {
            completionTime: '2023-03-27T13:47:16Z',
            conditions: [
              {
                lastTransitionTime: '2023-03-27T13:47:16Z',
                message: 'All Steps have completed executing',
                reason: 'Succeeded',
                status: 'True',
                type: 'Succeeded',
              },
            ],
            podName: 'human-resources-clkq-on-pull-request-fgkpt-show-summary-pod',
            startTime: '2023-03-27T13:47:08Z',
            steps: [
              {
                container: 'step-appstudio-summary',
                imageID:
                  'quay.io/openshift-release-dev/ocp-v4.0-art-dev@sha256:9f0cdc00b1b1a3c17411e50653253b9f6bb5329ea4fb82ad983790a6dbf2d9ad',
                name: 'appstudio-summary',
                terminated: {
                  containerID:
                    'cri-o://03ee4c2ff1f1598e575ddde86aec7d6edb3fb8df09cd51541e23a1d976cd306f',
                  exitCode: 0,
                  finishedAt: '2023-03-27T13:47:15Z',
                  reason: 'Completed',
                  startedAt: '2023-03-27T13:47:14Z',
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
                {
                  default: 'Succeeded',
                  description: 'State of build task in pipelineRun',
                  name: 'build-task-status',
                  type: 'string',
                },
              ],
              steps: [
                {
                  env: [
                    {
                      name: 'GIT_URL',
                      value:
                        'https://github.com/jeff-phillips-18/human-resources?rev=8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
                    },
                    {
                      name: 'IMAGE_URL',
                      value:
                        'quay.io/redhat-appstudio/user-workload:on-pr-8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
                    },
                    {
                      name: 'PIPELINERUN_NAME',
                      value: 'human-resources-clkq-on-pull-request-fgkpt',
                    },
                    {
                      name: 'BUILD_TASK_STATUS',
                      value: 'Succeeded',
                    },
                  ],
                  image:
                    'registry.redhat.io/openshift4/ose-cli:v4.12@sha256:9f0cdc00b1b1a3c17411e50653253b9f6bb5329ea4fb82ad983790a6dbf2d9ad',
                  name: 'appstudio-summary',
                  resources: {},
                  script:
                    '#!/usr/bin/env bash\necho\necho "Build Summary:"\necho\necho "Build repository: $GIT_URL"\nif [ "$BUILD_TASK_STATUS" == "Succeeded" ]; then\n  echo "Generated Image is in : $IMAGE_URL"\nfi\necho\noc annotate --overwrite pipelinerun $PIPELINERUN_NAME build.appstudio.openshift.io/repo=$GIT_URL\nif [ "$BUILD_TASK_STATUS" == "Succeeded" ]; then\n  oc annotate --overwrite pipelinerun $PIPELINERUN_NAME build.appstudio.openshift.io/image=$IMAGE_URL\nfi\necho End Summary\n\noc delete --ignore-not-found=true secret $PIPELINERUN_NAME\n',
                },
              ],
            },
          },
        },
        'human-resources-clkq-on-pull-request-fgkpt-clone-repository': {
          pipelineTaskName: 'clone-repository',
          status: {
            completionTime: '2023-03-27T13:44:27Z',
            conditions: [
              {
                lastTransitionTime: '2023-03-27T13:44:27Z',
                message: 'All Steps have completed executing',
                reason: 'Succeeded',
                status: 'True',
                type: 'Succeeded',
              },
            ],
            podName: 'human-resources-clkq-on-pull-request-fgkpt-clone-repository-pod',
            startTime: '2023-03-27T13:44:14Z',
            steps: [
              {
                container: 'step-clone',
                imageID:
                  'registry.redhat.io/openshift-pipelines/pipelines-git-init-rhel8@sha256:2fa0b06d52b04f377c696412e19307a9eff27383f81d87aae0b4f71672a1cd0b',
                name: 'clone',
                terminated: {
                  containerID:
                    'cri-o://bdbf78d72a560b3adc9c47c08e4eb1c6b29284e51c2db53050e5093d44786da8',
                  exitCode: 0,
                  finishedAt: '2023-03-27T13:44:26Z',
                  message:
                    '[{"key":"commit","value":"8a1fd02d3fec043b009608ac67350cd4a2e02cd9","type":1},{"key":"url","value":"https://github.com/jeff-phillips-18/human-resources","type":1}]',
                  reason: 'Completed',
                  startedAt: '2023-03-27T13:44:26Z',
                },
              },
            ],
            taskResults: [
              {
                name: 'commit',
                type: 'string',
                value: '8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
              },
              {
                name: 'url',
                type: 'string',
                value: 'https://github.com/jeff-phillips-18/human-resources',
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
                      value: 'https://github.com/jeff-phillips-18/human-resources',
                    },
                    {
                      name: 'PARAM_REVISION',
                      value: '8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
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
          },
          whenExpressions: [
            {
              input: 'true',
              operator: 'in',
              values: ['true'],
            },
          ],
        },
        'hume37e6ae40551aef337a9d3f259bba4d3-deprecated-base-image-check': {
          pipelineTaskName: 'deprecated-base-image-check',
          status: {
            completionTime: '2023-03-27T13:45:59Z',
            conditions: [
              {
                lastTransitionTime: '2023-03-27T13:45:59Z',
                message: 'All Steps have completed executing',
                reason: 'Succeeded',
                status: 'True',
                type: 'Succeeded',
              },
            ],
            podName: 'hume37e6ae40551aef337a9d3f2adba2db678860c03f89a7e8c304c4712-pod',
            startTime: '2023-03-27T13:45:52Z',
            steps: [
              {
                container: 'step-query-pyxis',
                imageID:
                  'registry.access.redhat.com/ubi8/ubi-minimal@sha256:ab03679e683010d485ef0399e056b09a38d7843ba4a36ee7dec337dd0037f7a7',
                name: 'query-pyxis',
                terminated: {
                  containerID:
                    'cri-o://8072471c73914d5217fec447c5b1a57581b2d6a8048881ebfe8a26d0613fbd3f',
                  exitCode: 0,
                  finishedAt: '2023-03-27T13:45:58Z',
                  message:
                    '[{"key":"PYXIS_HTTP_CODE","value":"200 registry.access.redhat.com ubi8/openjdk-17-runtime\\n200 registry.access.redhat.com ubi8/openjdk-17\\n","type":1}]',
                  reason: 'Completed',
                  startedAt: '2023-03-27T13:45:57Z',
                },
              },
              {
                container: 'step-run-conftest',
                imageID:
                  'quay.io/redhat-appstudio/hacbs-test@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
                name: 'run-conftest',
                terminated: {
                  containerID:
                    'cri-o://b3b1c69613dc3f6eba8f49bcf6b36576ddc1f7e5b7d7e83716cd92e84a6e46a8',
                  exitCode: 0,
                  finishedAt: '2023-03-27T13:45:58Z',
                  message:
                    '[{"key":"TEST_OUTPUT","value":"{\\"result\\":\\"SUCCESS\\",\\"timestamp\\":\\"1679924758\\",\\"note\\":\\"For more details please visit the logs in workspace of Tekton tasks.\\",\\"namespace\\":\\"required_checks\\",\\"successes\\":2,\\"failures\\":0,\\"warnings\\":0}\\n","type":1},{"key":"PYXIS_HTTP_CODE","value":"200 registry.access.redhat.com ubi8/openjdk-17-runtime\\n200 registry.access.redhat.com ubi8/openjdk-17\\n","type":1}]',
                  reason: 'Completed',
                  startedAt: '2023-03-27T13:45:58Z',
                },
              },
            ],
            taskResults: [
              {
                name: 'PYXIS_HTTP_CODE',
                type: 'string',
                value:
                  '200 registry.access.redhat.com ubi8/openjdk-17-runtime\n200 registry.access.redhat.com ubi8/openjdk-17\n',
              },
              {
                name: 'TEST_OUTPUT',
                type: 'string',
                value:
                  '{"result":"SUCCESS","timestamp":"1679924758","note":"For more details please visit the logs in workspace of Tekton tasks.","namespace":"required_checks","successes":2,"failures":0,"warnings":0}\n',
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
                        'registry.access.redhat.com/ubi8/openjdk-17-runtime:1.15@sha256:539d0efa60fa38e52357085b8870707808223031cbb2dfc49510668e1fb9539a\nregistry.access.redhat.com/ubi8/openjdk-17:1.14@sha256:79585ca02551ecff9d368905d7ce387232b9fd328256e7a715ae3c4ec7b086d3\n',
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
        'human-resources-clkq-on-pull-request-fgkpt-sanity-inspect-image': {
          pipelineTaskName: 'sanity-inspect-image',
          status: {
            completionTime: '2023-03-27T13:46:00Z',
            conditions: [
              {
                lastTransitionTime: '2023-03-27T13:46:00Z',
                message: 'All Steps have completed executing',
                reason: 'Succeeded',
                status: 'True',
                type: 'Succeeded',
              },
            ],
            podName: 'human-resources-clkq-on-pul1a803f80ef3d6da4ed86770cebbac97b-pod',
            startTime: '2023-03-27T13:45:52Z',
            steps: [
              {
                container: 'step-inspect-image',
                imageID:
                  'quay.io/redhat-appstudio/hacbs-test@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
                name: 'inspect-image',
                terminated: {
                  containerID:
                    'cri-o://9b1c7c26b626477b6cc1ef69c7ef6930c97b364cf6218ab354b330b9699b45ea',
                  exitCode: 0,
                  finishedAt: '2023-03-27T13:45:59Z',
                  message:
                    '[{"key":"BASE_IMAGE","value":"registry.access.redhat.com/ubi8/openjdk-17-runtime@sha256:f72a9039039f7c911d360cead99a6a1c0bf40aec28bfc09f261c1ea716a82ada","type":1},{"key":"BASE_IMAGE_REPOSITORY","value":"ubi8/openjdk-17-runtime","type":1},{"key":"TEST_OUTPUT","value":"{\\"result\\":\\"SUCCESS\\",\\"timestamp\\":\\"1679924759\\",\\"note\\":\\"For more details please visit the logs in workspace of Tekton tasks.\\",\\"namespace\\":\\"default\\",\\"successes\\":1,\\"failures\\":0,\\"warnings\\":0}\\n","type":1}]',
                  reason: 'Completed',
                  startedAt: '2023-03-27T13:45:58Z',
                },
              },
            ],
            taskResults: [
              {
                name: 'BASE_IMAGE',
                type: 'string',
                value:
                  'registry.access.redhat.com/ubi8/openjdk-17-runtime@sha256:f72a9039039f7c911d360cead99a6a1c0bf40aec28bfc09f261c1ea716a82ada',
              },
              {
                name: 'BASE_IMAGE_REPOSITORY',
                type: 'string',
                value: 'ubi8/openjdk-17-runtime',
              },
              {
                name: 'TEST_OUTPUT',
                type: 'string',
                value:
                  '{"result":"SUCCESS","timestamp":"1679924759","note":"For more details please visit the logs in workspace of Tekton tasks.","namespace":"default","successes":1,"failures":0,"warnings":0}\n',
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
                        'quay.io/redhat-appstudio/user-workload:on-pr-8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
                    },
                    {
                      name: 'IMAGE_DIGEST',
                      value:
                        'sha256:a273f9c8e642b4bdd27e329e38d552595fb63c42072d4ee2631f6a5dfede8e28',
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
                    secretName: 'human-resources-clkq-on-pull-request-fgkpt',
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
        'human-resources-clkq-on-pull-request-fgkpt-clamav-scan': {
          pipelineTaskName: 'clamav-scan',
          status: {
            completionTime: '2023-03-27T13:47:08Z',
            conditions: [
              {
                lastTransitionTime: '2023-03-27T13:47:08Z',
                message: 'All Steps have completed executing',
                reason: 'Succeeded',
                status: 'True',
                type: 'Succeeded',
              },
            ],
            podName: 'human-resources-clkq-on-pull-request-fgkpt-clamav-scan-pod',
            sidecars: [
              {
                container: 'sidecar-database',
                imageID:
                  'quay.io/redhat-appstudio/clamav-db@sha256:0607a515934817f21034a883481b5248ab64aac1c58281620974a13c69d44fa7',
                name: 'database',
                terminated: {
                  containerID:
                    'cri-o://83228cd319b7b87dc1ba1c61c9951a08525a0198ea920c78172cd649cf432296',
                  exitCode: 0,
                  finishedAt: '2023-03-27T13:45:56Z',
                  reason: 'Completed',
                  startedAt: '2023-03-27T13:45:56Z',
                },
              },
            ],
            startTime: '2023-03-27T13:45:52Z',
            steps: [
              {
                container: 'step-extract-and-scan-image',
                imageID:
                  'quay.io/redhat-appstudio/hacbs-test@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
                name: 'extract-and-scan-image',
                terminated: {
                  containerID:
                    'cri-o://6741b1cb0bad964a84196660bab37e07e3c3dee969f8e61eb60918626f713aaa',
                  exitCode: 0,
                  finishedAt: '2023-03-27T13:47:06Z',
                  reason: 'Completed',
                  startedAt: '2023-03-27T13:45:58Z',
                },
              },
              {
                container: 'step-modify-clam-output-to-json',
                imageID:
                  'quay.io/redhat-appstudio/hacbs-test@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
                name: 'modify-clam-output-to-json',
                terminated: {
                  containerID:
                    'cri-o://da95a0a0b3f4ba92717ddf07d751bc7456c97299566dff2ed5f801118148fc8b',
                  exitCode: 0,
                  finishedAt: '2023-03-27T13:47:06Z',
                  reason: 'Completed',
                  startedAt: '2023-03-27T13:47:06Z',
                },
              },
              {
                container: 'step-store-hacbs-test-output-result',
                imageID:
                  'quay.io/redhat-appstudio/hacbs-test@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
                name: 'store-hacbs-test-output-result',
                terminated: {
                  containerID:
                    'cri-o://64d37d2d2b87d4f967a874280494ab1ac6f14785350d725052750aebdbdfd63c',
                  exitCode: 0,
                  finishedAt: '2023-03-27T13:47:07Z',
                  message:
                    '[{"key":"TEST_OUTPUT","value":"{\\"result\\":\\"SUCCESS\\",\\"timestamp\\":\\"1679924827\\",\\"note\\":\\"For more details please visit the logs in workspace of Tekton tasks.\\",\\"namespace\\":\\"default\\",\\"successes\\":1,\\"failures\\":0,\\"warnings\\":0}\\n","type":1}]',
                  reason: 'Completed',
                  startedAt: '2023-03-27T13:47:07Z',
                },
              },
            ],
            taskResults: [
              {
                name: 'TEST_OUTPUT',
                type: 'string',
                value:
                  '{"result":"SUCCESS","timestamp":"1679924827","note":"For more details please visit the logs in workspace of Tekton tasks.","namespace":"default","successes":1,"failures":0,"warnings":0}\n',
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
                  resources: {},
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
                        'quay.io/redhat-appstudio/user-workload:on-pr-8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
                    },
                    {
                      name: 'IMAGE_DIGEST',
                      value:
                        'sha256:a273f9c8e642b4bdd27e329e38d552595fb63c42072d4ee2631f6a5dfede8e28',
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
                    secretName: 'human-resources-clkq-on-pull-request-fgkpt',
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
        'human-resources-clkq-on-pull-request-fgkpt-build-container': {
          pipelineTaskName: 'build-container',
          status: {
            completionTime: '2023-03-27T13:45:50Z',
            conditions: [
              {
                lastTransitionTime: '2023-03-27T13:45:50Z',
                message: 'All Steps have completed executing',
                reason: 'Succeeded',
                status: 'True',
                type: 'Succeeded',
              },
            ],
            podName: 'human-resources-clkq-on-pull-request-fgkpt-build-container-pod',
            startTime: '2023-03-27T13:44:29Z',
            steps: [
              {
                container: 'step-build',
                imageID:
                  'quay.io/redhat-appstudio/buildah@sha256:381e9bfedd59701477621da93892106873a6951b196105d3d2d85c3f6d7b569b',
                name: 'build',
                terminated: {
                  containerID:
                    'cri-o://a0363b5822a660260f00b10f7584a2f699f9a0722d5808ea5682e0ab7828daca',
                  exitCode: 0,
                  finishedAt: '2023-03-27T13:45:25Z',
                  reason: 'Completed',
                  startedAt: '2023-03-27T13:44:38Z',
                },
              },
              {
                container: 'step-sbom-get',
                imageID:
                  'quay.io/redhat-appstudio/syft@sha256:09afc449976230f66848c19bb5ccf344eb0eeb4ed50747e33b53aff49462c319',
                name: 'sbom-get',
                terminated: {
                  containerID:
                    'cri-o://1085956af4f581486806b545c39c6d1d7106e2116690fadb7f21922f2fd1ff28',
                  exitCode: 0,
                  finishedAt: '2023-03-27T13:45:34Z',
                  reason: 'Completed',
                  startedAt: '2023-03-27T13:45:25Z',
                },
              },
              {
                container: 'step-analyse-dependencies-java-sbom',
                imageID:
                  'quay.io/redhat-appstudio/hacbs-jvm-build-request-processor@sha256:b198cf4b33dab59ce8ac25afd4e1001390db29ca2dec83dc8a1e21b0359ce743',
                name: 'analyse-dependencies-java-sbom',
                terminated: {
                  containerID:
                    'cri-o://cd9c186018b7996677b83d3b7092da5e775c0983ee79e79866e37399ac641167',
                  exitCode: 0,
                  finishedAt: '2023-03-27T13:45:35Z',
                  message: '[{"key":"JAVA_COMMUNITY_DEPENDENCIES","value":"","type":1}]',
                  reason: 'Completed',
                  startedAt: '2023-03-27T13:45:35Z',
                },
              },
              {
                container: 'step-merge-sboms',
                imageID:
                  'registry.access.redhat.com/ubi9/python-39@sha256:89463fe3e086620617a4f6281640469ba7a7abd2f1b5be13e6cf0f46a6565516',
                name: 'merge-sboms',
                terminated: {
                  containerID:
                    'cri-o://338a213c314d83fc8f23a06470bb04706485c6072dff664d0080bdd21afd04f2',
                  exitCode: 0,
                  finishedAt: '2023-03-27T13:45:35Z',
                  message: '[{"key":"JAVA_COMMUNITY_DEPENDENCIES","value":"","type":1}]',
                  reason: 'Completed',
                  startedAt: '2023-03-27T13:45:35Z',
                },
              },
              {
                container: 'step-inject-sbom-and-push',
                imageID:
                  'registry.access.redhat.com/ubi9/buildah@sha256:c8b1d312815452964885680fc5bc8d99b3bfe9b6961228c71a09c72ca8e915eb',
                name: 'inject-sbom-and-push',
                terminated: {
                  containerID:
                    'cri-o://6fa96f96b382b844d1a419754c0ec698fb0e4d80de5f1e931fd96f60cab82558',
                  exitCode: 0,
                  finishedAt: '2023-03-27T13:45:47Z',
                  message:
                    '[{"key":"BASE_IMAGES_DIGESTS","value":"registry.access.redhat.com/ubi8/openjdk-17-runtime:1.15@sha256:539d0efa60fa38e52357085b8870707808223031cbb2dfc49510668e1fb9539a\\nregistry.access.redhat.com/ubi8/openjdk-17:1.14@sha256:79585ca02551ecff9d368905d7ce387232b9fd328256e7a715ae3c4ec7b086d3\\n","type":1},{"key":"IMAGE_DIGEST","value":"sha256:a273f9c8e642b4bdd27e329e38d552595fb63c42072d4ee2631f6a5dfede8e28","type":1},{"key":"IMAGE_URL","value":"quay.io/redhat-appstudio/user-workload:on-pr-8a1fd02d3fec043b009608ac67350cd4a2e02cd9","type":1},{"key":"JAVA_COMMUNITY_DEPENDENCIES","value":"","type":1}]',
                  reason: 'Completed',
                  startedAt: '2023-03-27T13:45:35Z',
                },
              },
              {
                container: 'step-upload-sbom',
                imageID:
                  'quay.io/redhat-appstudio/cosign@sha256:18b3716a6225727877475e1ab4f2493915e72cffd2ce431e9901d2ed2e4b2c0b',
                name: 'upload-sbom',
                terminated: {
                  containerID:
                    'cri-o://446f6a3bbf2b6ca300965c4006fa749431adfb3c1b15ff4d6f08c1f0a86901a9',
                  exitCode: 0,
                  finishedAt: '2023-03-27T13:45:49Z',
                  message:
                    '[{"key":"BASE_IMAGES_DIGESTS","value":"registry.access.redhat.com/ubi8/openjdk-17-runtime:1.15@sha256:539d0efa60fa38e52357085b8870707808223031cbb2dfc49510668e1fb9539a\\nregistry.access.redhat.com/ubi8/openjdk-17:1.14@sha256:79585ca02551ecff9d368905d7ce387232b9fd328256e7a715ae3c4ec7b086d3\\n","type":1},{"key":"IMAGE_DIGEST","value":"sha256:a273f9c8e642b4bdd27e329e38d552595fb63c42072d4ee2631f6a5dfede8e28","type":1},{"key":"IMAGE_URL","value":"quay.io/redhat-appstudio/user-workload:on-pr-8a1fd02d3fec043b009608ac67350cd4a2e02cd9","type":1},{"key":"JAVA_COMMUNITY_DEPENDENCIES","value":"","type":1}]',
                  reason: 'Completed',
                  startedAt: '2023-03-27T13:45:47Z',
                },
              },
            ],
            taskResults: [
              {
                name: 'JAVA_COMMUNITY_DEPENDENCIES',
                type: 'string',
                value: '',
              },
              {
                name: 'BASE_IMAGES_DIGESTS',
                type: 'string',
                value:
                  'registry.access.redhat.com/ubi8/openjdk-17-runtime:1.15@sha256:539d0efa60fa38e52357085b8870707808223031cbb2dfc49510668e1fb9539a\nregistry.access.redhat.com/ubi8/openjdk-17:1.14@sha256:79585ca02551ecff9d368905d7ce387232b9fd328256e7a715ae3c4ec7b086d3\n',
              },
              {
                name: 'IMAGE_DIGEST',
                type: 'string',
                value: 'sha256:a273f9c8e642b4bdd27e329e38d552595fb63c42072d4ee2631f6a5dfede8e28',
              },
              {
                name: 'IMAGE_URL',
                type: 'string',
                value:
                  'quay.io/redhat-appstudio/user-workload:on-pr-8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
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
                      'quay.io/redhat-appstudio/user-workload:on-pr-8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
                  },
                  {
                    name: 'TLSVERIFY',
                    value: 'true',
                  },
                ],
                name: '',
                resources: {},
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
                    "if [ -f /var/lib/containers/java ]; then\n  /opt/jboss/container/java/run/run-java.sh analyse-dependencies path $(cat /workspace/container_path) -s /workspace/source/sbom-image.json --task-run-name human-resources-clkq-on-pull-request-fgkpt-build-container --publishers /tekton/results/SBOM_JAVA_COMPONENTS_COUNT\n  sed -i 's/^/ /' /tekton/results/SBOM_JAVA_COMPONENTS_COUNT # Workaround for SRVKP-2875\nelse\n  touch /tekton/results/JAVA_COMMUNITY_DEPENDENCIES\nfi\n",
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
                    'quay.io/redhat-appstudio/user-workload:on-pr-8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
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
                    secretName: 'human-resources-clkq-on-pull-request-fgkpt',
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
        'human-resources-clkq-on-pull-request-fgkpt-sbom-json-check': {
          pipelineTaskName: 'sbom-json-check',
          status: {
            completionTime: '2023-03-27T13:46:04Z',
            conditions: [
              {
                lastTransitionTime: '2023-03-27T13:46:04Z',
                message: 'All Steps have completed executing',
                reason: 'Succeeded',
                status: 'True',
                type: 'Succeeded',
              },
            ],
            podName: 'human-resources-clkq-on-pull-request-fgkpt-sbom-json-check-pod',
            startTime: '2023-03-27T13:45:52Z',
            steps: [
              {
                container: 'step-sbom-json-check',
                imageID:
                  'quay.io/redhat-appstudio/hacbs-test@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
                name: 'sbom-json-check',
                terminated: {
                  containerID:
                    'cri-o://27fa83f480225cbe39137166f56d0a9d61dddd58abe1f6d5a14a26c23b3c9531',
                  exitCode: 0,
                  finishedAt: '2023-03-27T13:46:04Z',
                  message:
                    '[{"key":"TEST_OUTPUT","value":"{\\"result\\":\\"SUCCESS\\",\\"timestamp\\":\\"1679924763\\",\\"note\\":\\"For more details please visit the logs in workspace of Tekton tasks.\\",\\"namespace\\":\\"default\\",\\"successes\\":1,\\"failures\\":0,\\"warnings\\":0}\\n","type":1}]',
                  reason: 'Completed',
                  startedAt: '2023-03-27T13:45:58Z',
                },
              },
            ],
            taskResults: [
              {
                name: 'TEST_OUTPUT',
                type: 'string',
                value:
                  '{"result":"SUCCESS","timestamp":"1679924763","note":"For more details please visit the logs in workspace of Tekton tasks.","namespace":"default","successes":1,"failures":0,"warnings":0}\n',
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
                        'quay.io/redhat-appstudio/user-workload:on-pr-8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
                    },
                    {
                      name: 'IMAGE_DIGEST',
                      value:
                        'sha256:a273f9c8e642b4bdd27e329e38d552595fb63c42072d4ee2631f6a5dfede8e28',
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
        'human-resources-clkq-on-pull-request-fgkpt-clair-scan': {
          pipelineTaskName: 'clair-scan',
          status: {
            completionTime: '2023-03-27T13:46:15Z',
            conditions: [
              {
                lastTransitionTime: '2023-03-27T13:46:15Z',
                message: 'All Steps have completed executing',
                reason: 'Succeeded',
                status: 'True',
                type: 'Succeeded',
              },
            ],
            podName: 'human-resources-clkq-on-pull-request-fgkpt-clair-scan-pod',
            startTime: '2023-03-27T13:45:52Z',
            steps: [
              {
                container: 'step-get-vulnerabilities',
                imageID:
                  'quay.io/redhat-appstudio/clair-in-ci@sha256:8d259d799e6218e6a20e70f1120665eef3ddddf5753f1a1dc39d1a51568b6067',
                name: 'get-vulnerabilities',
                terminated: {
                  containerID:
                    'cri-o://512a9ea00da8db86a14a43fbfa54589fa75ac3465a5737b64ed27a3e86685f69',
                  exitCode: 0,
                  finishedAt: '2023-03-27T13:46:13Z',
                  reason: 'Completed',
                  startedAt: '2023-03-27T13:46:05Z',
                },
              },
              {
                container: 'step-conftest-vulnerabilities',
                imageID:
                  'quay.io/redhat-appstudio/hacbs-test@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
                name: 'conftest-vulnerabilities',
                terminated: {
                  containerID:
                    'cri-o://d69577cfc082621aaca7cc5e8247ce9ec3d520901cd6d082dbab2b44a8a3661b',
                  exitCode: 0,
                  finishedAt: '2023-03-27T13:46:13Z',
                  reason: 'Completed',
                  startedAt: '2023-03-27T13:46:13Z',
                },
              },
              {
                container: 'step-test-format-result',
                imageID:
                  'quay.io/redhat-appstudio/hacbs-test@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
                name: 'test-format-result',
                terminated: {
                  containerID:
                    'cri-o://1eb1f9faf38dd387b7aad0cfba96cc678e3a00122c4fd9cd6951b0f7cd444224',
                  exitCode: 0,
                  finishedAt: '2023-03-27T13:46:14Z',
                  message:
                    '[{"key":"CLAIR_SCAN_RESULT","value":"{\\"vulnerabilities\\":{\\"critical\\":0,\\"high\\":0,\\"medium\\":1,\\"low\\":0}}\\n","type":1},{"key":"TEST_OUTPUT","value":"{\\"result\\":\\"SUCCESS\\",\\"timestamp\\":\\"1679924774\\",\\"note\\":\\"Please refer to result CLAIR_SCAN_RESULT for the vulnerabilities scanned by clair\\",\\"namespace\\":\\"default\\",\\"successes\\":0,\\"failures\\":0,\\"warnings\\":0}\\n","type":1}]',
                  reason: 'Completed',
                  startedAt: '2023-03-27T13:46:14Z',
                },
              },
            ],
            taskResults: [
              {
                name: 'CLAIR_SCAN_RESULT',
                type: 'string',
                value: '{"vulnerabilities":{"critical":0,"high":0,"medium":1,"low":0}}\n',
              },
              {
                name: 'TEST_OUTPUT',
                type: 'string',
                value:
                  '{"result":"SUCCESS","timestamp":"1679924774","note":"Please refer to result CLAIR_SCAN_RESULT for the vulnerabilities scanned by clair","namespace":"default","successes":0,"failures":0,"warnings":0}\n',
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
                  name: 'CLAIR_SCAN_RESULT',
                  type: 'string',
                },
              ],
              steps: [
                {
                  env: [
                    {
                      name: 'DOCKER_CONFIG',
                      value: 'human-resources-clkq-on-pull-request-fgkpt',
                    },
                    {
                      name: 'IMAGE_URL',
                      value:
                        'quay.io/redhat-appstudio/user-workload:on-pr-8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
                    },
                    {
                      name: 'IMAGE_DIGEST',
                      value:
                        'sha256:a273f9c8e642b4bdd27e329e38d552595fb63c42072d4ee2631f6a5dfede8e28',
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
                    '#!/usr/bin/env bash\n. /utils.sh\n\nif [[ ! -f /tekton/home/clair-vulnerabilities.json ]] || [[ "$(jq \'.[] | has("failures")\' /tekton/home/clair-vulnerabilities.json)" == "false" ]]; then\n  TEST_OUTPUT=$(make_result_json -r "ERROR" -t "/tekton/home/clair-vulnerabilities.json is not generated correctly, please check again")\n  echo "/tekton/home/clair-vulnerabilities.json is not generated correctly, please check again"\n  echo "${TEST_OUTPUT}" | tee /tekton/results/TEST_OUTPUT\n  exit 0\nfi\n\njq -rce \\\n  \'{vulnerabilities:{\n      critical: (.[] | .failures | map(select(.metadata.details.name=="clair_critical_vulnerabilities")) | length),\n      high: (.[] | .failures | map(select(.metadata.details.name=="clair_high_vulnerabilities")) | length),\n      medium: (.[] | .failures | map(select(.metadata.details.name=="clair_medium_vulnerabilities")) | length),\n      low: (.[] | .failures | map(select(.metadata.details.name=="clair_low_vulnerabilities")) | length)\n    }}\' /tekton/home/clair-vulnerabilities.json | tee /tekton/results/CLAIR_SCAN_RESULT\n\nTEST_OUTPUT=$(make_result_json -r "SUCCESS" -t "Please refer to result CLAIR_SCAN_RESULT for the vulnerabilities scanned by clair")\necho "${TEST_OUTPUT}" | tee /tekton/results/TEST_OUTPUT\n',
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
        'hume37e6ae40551aef337a9d3f259bba4d3-sanity-optional-label-check': {
          pipelineTaskName: 'sanity-optional-label-check',
          status: {
            completionTime: '2023-03-27T13:46:09Z',
            conditions: [
              {
                lastTransitionTime: '2023-03-27T13:46:09Z',
                message: 'All Steps have completed executing',
                reason: 'Succeeded',
                status: 'True',
                type: 'Succeeded',
              },
            ],
            podName: 'hume37e6ae40551aef337a9d3f27d1dab94ad6fad2ff95fc32832e73c8b-pod',
            startTime: '2023-03-27T13:46:01Z',
            steps: [
              {
                container: 'step-basic-sanity-checks-required-labels',
                imageID:
                  'quay.io/redhat-appstudio/hacbs-test@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
                name: 'basic-sanity-checks-required-labels',
                terminated: {
                  containerID:
                    'cri-o://76c83d424aa87a785f5841dfc0e0f97d5faf989aa0e70dcbf8d0f61469fdc2fd',
                  exitCode: 0,
                  finishedAt: '2023-03-27T13:46:08Z',
                  message:
                    '[{"key":"TEST_OUTPUT","value":"{\\"result\\":\\"FAILURE\\",\\"timestamp\\":\\"1679924768\\",\\"note\\":\\"For more details please visit the logs in workspace of Tekton tasks.\\",\\"namespace\\":\\"optional_checks\\",\\"successes\\":2,\\"failures\\":5,\\"warnings\\":0}\\n","type":1}]',
                  reason: 'Completed',
                  startedAt: '2023-03-27T13:46:08Z',
                },
              },
            ],
            taskResults: [
              {
                name: 'TEST_OUTPUT',
                type: 'string',
                value:
                  '{"result":"FAILURE","timestamp":"1679924768","note":"For more details please visit the logs in workspace of Tekton tasks.","namespace":"optional_checks","successes":2,"failures":5,"warnings":0}\n',
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
        'human-resources-clkq-on-pull-request-fgkpt-sanity-label-check': {
          pipelineTaskName: 'sanity-label-check',
          status: {
            completionTime: '2023-03-27T13:46:09Z',
            conditions: [
              {
                lastTransitionTime: '2023-03-27T13:46:09Z',
                message: 'All Steps have completed executing',
                reason: 'Succeeded',
                status: 'True',
                type: 'Succeeded',
              },
            ],
            podName: 'human-resources-clkq-on-pul8f1df668ffe194aa5d9a7ab9d55e4840-pod',
            startTime: '2023-03-27T13:46:01Z',
            steps: [
              {
                container: 'step-basic-sanity-checks-required-labels',
                imageID:
                  'quay.io/redhat-appstudio/hacbs-test@sha256:acf4e35adfbe16916d400f36b616236d872c2527c7618ffc6758ae930e353668',
                name: 'basic-sanity-checks-required-labels',
                terminated: {
                  containerID:
                    'cri-o://1ee60ec0bd62de320730645f0bb0946eedf87853adb2095dd2538938a573c4c3',
                  exitCode: 0,
                  finishedAt: '2023-03-27T13:46:08Z',
                  message:
                    '[{"key":"TEST_OUTPUT","value":"{\\"result\\":\\"SUCCESS\\",\\"timestamp\\":\\"1679924768\\",\\"note\\":\\"For more details please visit the logs in workspace of Tekton tasks.\\",\\"namespace\\":\\"required_checks\\",\\"successes\\":21,\\"failures\\":0,\\"warnings\\":0}\\n","type":1}]',
                  reason: 'Completed',
                  startedAt: '2023-03-27T13:46:08Z',
                },
              },
            ],
            taskResults: [
              {
                name: 'TEST_OUTPUT',
                type: 'string',
                value:
                  '{"result":"SUCCESS","timestamp":"1679924768","note":"For more details please visit the logs in workspace of Tekton tasks.","namespace":"required_checks","successes":21,"failures":0,"warnings":0}\n',
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
        'human-resources-clkq-on-pull-request-fgkpt-init': {
          pipelineTaskName: 'init',
          status: {
            completionTime: '2023-03-27T13:44:10Z',
            conditions: [
              {
                lastTransitionTime: '2023-03-27T13:44:10Z',
                message: 'All Steps have completed executing',
                reason: 'Succeeded',
                status: 'True',
                type: 'Succeeded',
              },
            ],
            podName: 'human-resources-clkq-on-pull-request-fgkpt-init-pod',
            startTime: '2023-03-27T13:44:06Z',
            steps: [
              {
                container: 'step-init',
                imageID:
                  'registry.redhat.io/openshift4/ose-tools-rhel8@sha256:253d042ecfad7b64593112a4aa3f528d39cb5fe738852e44f009db87964cf051',
                name: 'init',
                terminated: {
                  containerID:
                    'cri-o://af5c62683b138baa7d59c5f2c5fa5b3f18a0f06ccc9f61f1916fb5fb9385d901',
                  exitCode: 0,
                  finishedAt: '2023-03-27T13:44:10Z',
                  message:
                    '[{"key":"build","value":"true","type":1},{"key":"container-registry-secret","value":"human-resources-clkq-on-pull-request-fgkpt","type":1}]',
                  reason: 'Completed',
                  startedAt: '2023-03-27T13:44:10Z',
                },
              },
            ],
            taskResults: [
              {
                name: 'build',
                type: 'string',
                value: 'true',
              },
              {
                name: 'container-registry-secret',
                type: 'string',
                value: 'human-resources-clkq-on-pull-request-fgkpt',
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
                      value: 'human-resources-clkq-on-pull-request-fgkpt',
                    },
                    {
                      name: 'PIPELINERUN_UID',
                      value: '47ee10fa-2567-4a8e-bb0e-184b5123bd87',
                    },
                    {
                      name: 'IMAGE_URL',
                      value:
                        'quay.io/redhat-appstudio/user-workload:on-pr-8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
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
      },
      startTime: '2023-03-27T13:44:03Z',
      pipelineResults: [
        {
          name: 'IMAGE_URL',
          value:
            'quay.io/redhat-appstudio/user-workload:on-pr-8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
        },
        {
          name: 'IMAGE_DIGEST',
          value: 'sha256:a273f9c8e642b4bdd27e329e38d552595fb63c42072d4ee2631f6a5dfede8e28',
        },
        {
          name: 'CHAINS-GIT_URL',
          value: 'https://github.com/jeff-phillips-18/human-resources',
        },
        {
          name: 'CHAINS-GIT_COMMIT',
          value: '8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
        },
        {
          name: 'JAVA_COMMUNITY_DEPENDENCIES',
          value: '',
        },
      ],
      conditions: [
        {
          lastTransitionTime: '2023-03-27T13:47:16Z',
          message: 'Tasks Completed: 11 (Failed: 0, Cancelled 0), Skipped: 2',
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
                name: 'pipelinerun-name',
                value: 'human-resources-clkq-on-pull-request-fgkpt',
              },
              {
                name: 'git-url',
                value:
                  '$(tasks.clone-repository.results.url)?rev=$(tasks.clone-repository.results.commit)',
              },
              {
                name: 'image-url',
                value:
                  'quay.io/redhat-appstudio/user-workload:on-pr-8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
              },
            ],
            taskRef: {
              bundle:
                'quay.io/redhat-appstudio-tekton-catalog/task-summary:0.1@sha256:c0f66b28c338426774e34a8d4a00349fbab798b19df5841a95727148d5ef3c65',
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
                value:
                  'quay.io/redhat-appstudio/user-workload:on-pr-8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
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
                value: 'human-resources-clkq-on-pull-request-fgkpt',
              },
              {
                name: 'pipelinerun-uid',
                value: '47ee10fa-2567-4a8e-bb0e-184b5123bd87',
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
                value: 'https://github.com/jeff-phillips-18/human-resources',
              },
              {
                name: 'revision',
                value: '8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
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
                value: '',
              },
            ],
            runAfter: ['clone-repository'],
            taskRef: {
              bundle:
                'quay.io/redhat-appstudio-tekton-catalog/task-prefetch-dependencies:0.1@sha256:bebbf6521a5a203410d6b0da5da366a5aa9bdd63522d7bf3f641e81b8cc2ba2d',
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
          },
          {
            name: 'build-container',
            params: [
              {
                name: 'IMAGE',
                value:
                  'quay.io/redhat-appstudio/user-workload:on-pr-8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
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
    },
  },
];
export const MockTestPipelines = [
  {
    apiVersion: 'tekton.dev/v1beta1',
    kind: 'PipelineRun',
    metadata: {
      generateName: 'my-test-output-gwk9q-',
      annotations: {
        'results.tekton.dev/record':
          'jephilli-tenant/results/b1a852c5-063b-4301-84e3-8d487f517ad8/records/b1a852c5-063b-4301-84e3-8d487f517ad8',
        'pac.test.appstudio.openshift.io/on-event': '[pull_request]',
        'pac.test.appstudio.openshift.io/log-url':
          'https://console-openshift-console.apps.stone-prd-m01.84db.p1.openshiftapps.com/k8s/ns/jephilli-tenant/tekton.dev~v1beta1~PipelineRun/human-resources-clkq-on-pull-request-fgkpt',
        'pac.test.appstudio.openshift.io/max-keep-runs': '3',
        'pac.test.appstudio.openshift.io/on-target-branch': '[main,master]',
        'chains.tekton.dev/signed': 'true',
        'pac.test.appstudio.openshift.io/repo-url':
          'https://github.com/jeff-phillips-18/human-resources',
        'pac.test.appstudio.openshift.io/installation-id': '34687113',
        'pac.test.appstudio.openshift.io/sha-url':
          'https://github.com/jeff-phillips-18/human-resources/commit/8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
        'results.tekton.dev/result': 'jephilli-tenant/results/b1a852c5-063b-4301-84e3-8d487f517ad8',
        'pac.test.appstudio.openshift.io/sha-title': 'Update README.md',
        'pac.test.appstudio.openshift.io/git-auth-secret': 'pac-gitauth-vfnr',
      },
      resourceVersion: '92260247',
      name: 'my-test-output-gwk9q-b9ccj',
      uid: 'b1a852c5-063b-4301-84e3-8d487f517ad8',
      creationTimestamp: '2023-03-27T13:47:16Z',
      generation: 1,
      namespace: 'jephilli-tenant',
      ownerReferences: [
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          blockOwnerDeletion: true,
          controller: true,
          kind: 'Snapshot',
          name: 'my-test-output-gwk9q',
          uid: '406579cb-03dc-4ebd-9d36-aafc9478eb9c',
        },
      ],
      finalizers: ['chains.tekton.dev/pipelinerun'],
      labels: {
        'appstudio.openshift.io/snapshot': 'my-test-output-gwk9q',
        'appstudio.openshift.io/component': 'human-resources-clkq',
        'pac.test.appstudio.openshift.io/pull-request': '6',
        'pac.test.appstudio.openshift.io/url-repository': 'human-resources',
        'pac.test.appstudio.openshift.io/repository': 'human-resources-clkq',
        'pac.test.appstudio.openshift.io/git-provider': 'github',
        'pac.test.appstudio.openshift.io/event-type': 'pull_request',
        'pac.test.appstudio.openshift.io/url-org': 'jeff-phillips-18',
        'pac.test.appstudio.openshift.io/original-prname': 'human-resources-clkq-on-pull-request',
        'test.appstudio.openshift.io/scenario': 'component-integration-test-one',
        'pac.test.appstudio.openshift.io/sha': '8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
        'tekton.dev/pipeline': 'component-pipeline-pass',
        'pac.test.appstudio.openshift.io/sender': 'jeff-phillips-18',
        'appstudio.openshift.io/application': 'my-test-output',
        'pac.test.appstudio.openshift.io/state': 'started',
        'pipelines.appstudio.openshift.io/type': 'test',
        'pac.test.appstudio.openshift.io/branch': 'main',
        'pac.test.appstudio.openshift.io/check-run-id': '12302899421',
      },
    },
    spec: {
      params: [
        {
          name: 'SNAPSHOT',
          value:
            '{"application":"my-test-output","components":[{"name":"devfile-sample-go-basic-kksq","containerImage":"quay.io/redhat-appstudio/user-workload@sha256:0afbdd832f28a7de094e6f0771f5b1b7a80bd8f45d282823ae9ef093d29fac52"},{"name":"devfile-sample-go-basic-vwkv","containerImage":"quay.io/redhat-appstudio/user-workload@sha256:704ab805d1f5d6588c97d22c298fc95f41d444d608fc26a8dc4a7b6e177a704a"},{"name":"human-resources-clkq","containerImage":"quay.io/redhat-appstudio/user-workload@sha256:a273f9c8e642b4bdd27e329e38d552595fb63c42072d4ee2631f6a5dfede8e28"},{"name":"order-app-webshop-4cxk","containerImage":"quay.io/redhat-appstudio/user-workload:p0QHj-order-app-webshop-4cxk"},{"name":"governance-policy-propagator-pswg","containerImage":"quay.io/redhat-appstudio/user-workload:p0QHj-governance-policy-propagator-pswg"},{"name":"pacman-f5si","containerImage":"quay.io/redhat-appstudio/user-workload@sha256:079cf227ab4e744ef777b9c4125039b2cadd7362a80b3b76f0bf3f0cdedbccb9"},{"name":"governance-policy-propagator-aua5","containerImage":"quay.io/redhat-appstudio/user-workload:p0QHj-governance-policy-propagator-aua5"},{"name":"payment-app-webshop-vh3d","containerImage":"quay.io/redhat-appstudio/user-workload:p0QHj-payment-app-webshop-vh3d"},{"name":"stock-app-webshop-jhnj","containerImage":"quay.io/redhat-appstudio/user-workload:p0QHj-stock-app-webshop-jhnj"},{"name":"devfile-sample-go-basic-btj3","containerImage":"quay.io/redhat-appstudio/user-workload:p0QHj-devfile-sample-go-basic-btj3"},{"name":"devfile-sample-go-basic-2cnf","containerImage":"quay.io/redhat-appstudio/user-workload:p0QHj-devfile-sample-go-basic-2cnf"},{"name":"payment-app-webshop-ca6l","containerImage":"quay.io/redhat-appstudio/user-workload:p0QHj-payment-app-webshop-ca6l"},{"name":"stock-app-webshop-l2gd","containerImage":"quay.io/redhat-appstudio/user-workload:p0QHj-stock-app-webshop-l2gd"},{"name":"devfile-sample-code-with-quarkus-66zm","containerImage":"quay.io/redhat-appstudio/user-workload@sha256:8161eeea15f71858d88a1d801ce12c63347f1c27f0bd572c1a657fbb0ad0c8ab"}],"artifacts":{}}',
        },
        {
          name: 'test-param',
          value: 'test',
        },
      ],
      pipelineRef: {
        bundle: 'quay.io/kpavic/test-bundle:component-pipeline-pass',
        name: 'component-pipeline-pass',
      },
      serviceAccountName: 'appstudio-pipeline',
      timeout: '1h0m0s',
    },
    status: {
      completionTime: '2023-03-27T13:47:16Z',
      conditions: [
        {
          lastTransitionTime: '2023-03-27T13:47:16Z',
          message:
            'Error retrieving pipeline for pipelinerun jephilli-tenant/my-test-output-gwk9q-b9ccj: error when listing pipelines for pipelineRun my-test-output-gwk9q-b9ccj: could not find object in image with kind: pipeline and name: component-pipeline-pass',
          reason: 'CouldntGetPipeline',
          status: 'False',
          type: 'Succeeded',
        },
      ],
      startTime: '2023-03-27T13:47:16Z',
    },
  },
  {
    apiVersion: 'tekton.dev/v1beta1',
    kind: 'PipelineRun',
    metadata: {
      generateName: 'my-test-output-gwk9q-',
      annotations: {
        'results.tekton.dev/record':
          'jephilli-tenant/results/06555ab9-cbee-4287-9882-7ae922fa58c3/records/06555ab9-cbee-4287-9882-7ae922fa58c3',
        'pac.test.appstudio.openshift.io/on-event': '[pull_request]',
        'pac.test.appstudio.openshift.io/log-url':
          'https://console-openshift-console.apps.stone-prd-m01.84db.p1.openshiftapps.com/k8s/ns/jephilli-tenant/tekton.dev~v1beta1~PipelineRun/human-resources-clkq-on-pull-request-fgkpt',
        'pac.test.appstudio.openshift.io/max-keep-runs': '3',
        'pac.test.appstudio.openshift.io/on-target-branch': '[main,master]',
        'chains.tekton.dev/signed': 'true',
        'pac.test.appstudio.openshift.io/repo-url':
          'https://github.com/jeff-phillips-18/human-resources',
        'pac.test.appstudio.openshift.io/installation-id': '34687113',
        'pac.test.appstudio.openshift.io/sha-url':
          'https://github.com/jeff-phillips-18/human-resources/commit/8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
        'results.tekton.dev/result': 'jephilli-tenant/results/06555ab9-cbee-4287-9882-7ae922fa58c3',
        'pac.test.appstudio.openshift.io/sha-title': 'Update README.md',
        'pac.test.appstudio.openshift.io/git-auth-secret': 'pac-gitauth-vfnr',
      },
      resourceVersion: '92260393',
      name: 'my-test-output-gwk9q-jxxck',
      uid: '06555ab9-cbee-4287-9882-7ae922fa58c3',
      creationTimestamp: '2023-03-27T13:47:16Z',
      generation: 1,
      namespace: 'jephilli-tenant',
      ownerReferences: [
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          blockOwnerDeletion: true,
          controller: true,
          kind: 'Snapshot',
          name: 'my-test-output-gwk9q',
          uid: '406579cb-03dc-4ebd-9d36-aafc9478eb9c',
        },
      ],
      finalizers: ['chains.tekton.dev/pipelinerun'],
      labels: {
        'appstudio.openshift.io/snapshot': 'my-test-output-gwk9q',
        'appstudio.openshift.io/component': 'human-resources-clkq',
        'pac.test.appstudio.openshift.io/pull-request': '6',
        'pac.test.appstudio.openshift.io/url-repository': 'human-resources',
        'pac.test.appstudio.openshift.io/repository': 'human-resources-clkq',
        'pac.test.appstudio.openshift.io/git-provider': 'github',
        'pac.test.appstudio.openshift.io/event-type': 'pull_request',
        'pac.test.appstudio.openshift.io/url-org': 'jeff-phillips-18',
        'pac.test.appstudio.openshift.io/original-prname': 'human-resources-clkq-on-pull-request',
        'test.appstudio.openshift.io/scenario': 'application-test-one',
        'pac.test.appstudio.openshift.io/sha': '8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
        'tekton.dev/pipeline': 'component-pipeline-pass',
        'pac.test.appstudio.openshift.io/sender': 'jeff-phillips-18',
        'appstudio.openshift.io/application': 'my-test-output',
        'pac.test.appstudio.openshift.io/state': 'started',
        'pipelines.appstudio.openshift.io/type': 'test',
        'pac.test.appstudio.openshift.io/branch': 'main',
        'pac.test.appstudio.openshift.io/check-run-id': '12302899421',
      },
    },
    spec: {
      params: [
        {
          name: 'SNAPSHOT',
          value:
            '{"application":"my-test-output","components":[{"name":"devfile-sample-go-basic-kksq","containerImage":"quay.io/redhat-appstudio/user-workload@sha256:0afbdd832f28a7de094e6f0771f5b1b7a80bd8f45d282823ae9ef093d29fac52"},{"name":"devfile-sample-go-basic-vwkv","containerImage":"quay.io/redhat-appstudio/user-workload@sha256:704ab805d1f5d6588c97d22c298fc95f41d444d608fc26a8dc4a7b6e177a704a"},{"name":"human-resources-clkq","containerImage":"quay.io/redhat-appstudio/user-workload@sha256:a273f9c8e642b4bdd27e329e38d552595fb63c42072d4ee2631f6a5dfede8e28"},{"name":"order-app-webshop-4cxk","containerImage":"quay.io/redhat-appstudio/user-workload:p0QHj-order-app-webshop-4cxk"},{"name":"governance-policy-propagator-pswg","containerImage":"quay.io/redhat-appstudio/user-workload:p0QHj-governance-policy-propagator-pswg"},{"name":"pacman-f5si","containerImage":"quay.io/redhat-appstudio/user-workload@sha256:079cf227ab4e744ef777b9c4125039b2cadd7362a80b3b76f0bf3f0cdedbccb9"},{"name":"governance-policy-propagator-aua5","containerImage":"quay.io/redhat-appstudio/user-workload:p0QHj-governance-policy-propagator-aua5"},{"name":"payment-app-webshop-vh3d","containerImage":"quay.io/redhat-appstudio/user-workload:p0QHj-payment-app-webshop-vh3d"},{"name":"stock-app-webshop-jhnj","containerImage":"quay.io/redhat-appstudio/user-workload:p0QHj-stock-app-webshop-jhnj"},{"name":"devfile-sample-go-basic-btj3","containerImage":"quay.io/redhat-appstudio/user-workload:p0QHj-devfile-sample-go-basic-btj3"},{"name":"devfile-sample-go-basic-2cnf","containerImage":"quay.io/redhat-appstudio/user-workload:p0QHj-devfile-sample-go-basic-2cnf"},{"name":"payment-app-webshop-ca6l","containerImage":"quay.io/redhat-appstudio/user-workload:p0QHj-payment-app-webshop-ca6l"},{"name":"stock-app-webshop-l2gd","containerImage":"quay.io/redhat-appstudio/user-workload:p0QHj-stock-app-webshop-l2gd"},{"name":"devfile-sample-code-with-quarkus-66zm","containerImage":"quay.io/redhat-appstudio/user-workload@sha256:8161eeea15f71858d88a1d801ce12c63347f1c27f0bd572c1a657fbb0ad0c8ab"}],"artifacts":{}}',
        },
      ],
      pipelineRef: {
        bundle: 'quay.io/kpavic/test-bundle:component-pipeline-pass',
        name: 'component-pipeline-pass',
      },
      serviceAccountName: 'appstudio-pipeline',
      timeout: '1h0m0s',
    },
    status: {
      completionTime: '2023-03-27T13:47:17Z',
      conditions: [
        {
          lastTransitionTime: '2023-03-27T13:47:17Z',
          message:
            'Error retrieving pipeline for pipelinerun jephilli-tenant/my-test-output-gwk9q-jxxck: error when listing pipelines for pipelineRun my-test-output-gwk9q-jxxck: could not find object in image with kind: pipeline and name: component-pipeline-pass',
          reason: 'CouldntGetPipeline',
          status: 'False',
          type: 'Succeeded',
        },
      ],
      startTime: '2023-03-27T13:47:16Z',
    },
  },
  {
    apiVersion: 'tekton.dev/v1beta1',
    kind: 'PipelineRun',
    metadata: {
      generateName: 'my-test-output-gwk9q-',
      annotations: {
        'results.tekton.dev/record':
          'jephilli-tenant/results/643cc38a-1626-48eb-b1a7-396cdf40dbe2/records/643cc38a-1626-48eb-b1a7-396cdf40dbe2',
        'pac.test.appstudio.openshift.io/on-event': '[pull_request]',
        'pac.test.appstudio.openshift.io/log-url':
          'https://console-openshift-console.apps.stone-prd-m01.84db.p1.openshiftapps.com/k8s/ns/jephilli-tenant/tekton.dev~v1beta1~PipelineRun/human-resources-clkq-on-pull-request-fgkpt',
        'pac.test.appstudio.openshift.io/max-keep-runs': '3',
        'pac.test.appstudio.openshift.io/on-target-branch': '[main,master]',
        'results.tekton.dev/log':
          'jephilli-tenant/results/643cc38a-1626-48eb-b1a7-396cdf40dbe2/logs/c58b59b5-b0b9-3f25-85f7-496088bd5a31',
        'chains.tekton.dev/signed': 'true',
        'pac.test.appstudio.openshift.io/repo-url':
          'https://github.com/jeff-phillips-18/human-resources',
        'pac.test.appstudio.openshift.io/installation-id': '34687113',
        'pac.test.appstudio.openshift.io/sha-url':
          'https://github.com/jeff-phillips-18/human-resources/commit/8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
        'results.tekton.dev/result': 'jephilli-tenant/results/643cc38a-1626-48eb-b1a7-396cdf40dbe2',
        'pac.test.appstudio.openshift.io/sha-title': 'Update README.md',
        'pac.test.appstudio.openshift.io/git-auth-secret': 'pac-gitauth-vfnr',
      },
      resourceVersion: '92260594',
      name: 'my-test-output-gwk9q-mfp99',
      uid: '643cc38a-1626-48eb-b1a7-396cdf40dbe2',
      creationTimestamp: '2023-03-27T13:47:16Z',
      generation: 1,
      namespace: 'jephilli-tenant',
      ownerReferences: [
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          blockOwnerDeletion: true,
          controller: true,
          kind: 'Snapshot',
          name: 'my-test-output-gwk9q',
          uid: '406579cb-03dc-4ebd-9d36-aafc9478eb9c',
        },
      ],
      finalizers: ['chains.tekton.dev/pipelinerun'],
      labels: {
        'appstudio.openshift.io/snapshot': 'my-test-output-gwk9q',
        'appstudio.openshift.io/component': 'human-resources-clkq',
        'pac.test.appstudio.openshift.io/pull-request': '6',
        'pac.test.appstudio.openshift.io/url-repository': 'human-resources',
        'pac.test.appstudio.openshift.io/repository': 'human-resources-clkq',
        'pac.test.appstudio.openshift.io/git-provider': 'github',
        'pac.test.appstudio.openshift.io/event-type': 'pull_request',
        'pac.test.appstudio.openshift.io/url-org': 'jeff-phillips-18',
        'pac.test.appstudio.openshift.io/original-prname': 'human-resources-clkq-on-pull-request',
        'test.appstudio.openshift.io/scenario': 'kpavic-test-bundle',
        'pac.test.appstudio.openshift.io/sha': '8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
        'tekton.dev/pipeline': 'demo-pipeline',
        'pac.test.appstudio.openshift.io/sender': 'jeff-phillips-18',
        'appstudio.openshift.io/application': 'my-test-output',
        'pac.test.appstudio.openshift.io/state': 'started',
        'pipelines.appstudio.openshift.io/type': 'test',
        'pac.test.appstudio.openshift.io/branch': 'main',
        'pac.test.appstudio.openshift.io/check-run-id': '12302899421',
      },
    },
    spec: {
      params: [
        {
          name: 'SNAPSHOT',
          value:
            '{"application":"my-test-output","components":[{"name":"devfile-sample-go-basic-kksq","containerImage":"quay.io/redhat-appstudio/user-workload@sha256:0afbdd832f28a7de094e6f0771f5b1b7a80bd8f45d282823ae9ef093d29fac52"},{"name":"devfile-sample-go-basic-vwkv","containerImage":"quay.io/redhat-appstudio/user-workload@sha256:704ab805d1f5d6588c97d22c298fc95f41d444d608fc26a8dc4a7b6e177a704a"},{"name":"human-resources-clkq","containerImage":"quay.io/redhat-appstudio/user-workload@sha256:a273f9c8e642b4bdd27e329e38d552595fb63c42072d4ee2631f6a5dfede8e28"},{"name":"order-app-webshop-4cxk","containerImage":"quay.io/redhat-appstudio/user-workload:p0QHj-order-app-webshop-4cxk"},{"name":"governance-policy-propagator-pswg","containerImage":"quay.io/redhat-appstudio/user-workload:p0QHj-governance-policy-propagator-pswg"},{"name":"pacman-f5si","containerImage":"quay.io/redhat-appstudio/user-workload@sha256:079cf227ab4e744ef777b9c4125039b2cadd7362a80b3b76f0bf3f0cdedbccb9"},{"name":"governance-policy-propagator-aua5","containerImage":"quay.io/redhat-appstudio/user-workload:p0QHj-governance-policy-propagator-aua5"},{"name":"payment-app-webshop-vh3d","containerImage":"quay.io/redhat-appstudio/user-workload:p0QHj-payment-app-webshop-vh3d"},{"name":"stock-app-webshop-jhnj","containerImage":"quay.io/redhat-appstudio/user-workload:p0QHj-stock-app-webshop-jhnj"},{"name":"devfile-sample-go-basic-btj3","containerImage":"quay.io/redhat-appstudio/user-workload:p0QHj-devfile-sample-go-basic-btj3"},{"name":"devfile-sample-go-basic-2cnf","containerImage":"quay.io/redhat-appstudio/user-workload:p0QHj-devfile-sample-go-basic-2cnf"},{"name":"payment-app-webshop-ca6l","containerImage":"quay.io/redhat-appstudio/user-workload:p0QHj-payment-app-webshop-ca6l"},{"name":"stock-app-webshop-l2gd","containerImage":"quay.io/redhat-appstudio/user-workload:p0QHj-stock-app-webshop-l2gd"},{"name":"devfile-sample-code-with-quarkus-66zm","containerImage":"quay.io/redhat-appstudio/user-workload@sha256:8161eeea15f71858d88a1d801ce12c63347f1c27f0bd572c1a657fbb0ad0c8ab"}],"artifacts":{}}',
        },
      ],
      pipelineRef: {
        bundle: 'quay.io/kpavic/test-bundle:pipeline',
        name: 'demo-pipeline',
      },
      serviceAccountName: 'appstudio-pipeline',
      timeout: '1h0m0s',
    },
    status: {
      childReferences: [
        {
          apiVersion: 'tekton.dev/v1beta1',
          kind: 'TaskRun',
          name: 'my-test-output-gwk9q-mfp99-task-1',
          pipelineTaskName: 'task-1',
        },
      ],
      completionTime: '2023-03-27T13:47:22Z',
      conditions: [
        {
          lastTransitionTime: '2023-03-27T13:47:22Z',
          message: 'Tasks Completed: 1 (Failed: 0, Cancelled 0), Skipped: 0',
          reason: 'Succeeded',
          status: 'True',
          type: 'Succeeded',
        },
      ],
      pipelineSpec: {
        tasks: [
          {
            name: 'task-1',
            taskRef: {
              bundle: 'quay.io/kpavic/test-bundle:demo-task',
              kind: 'Task',
              name: 'demo-task',
            },
          },
        ],
      },
      startTime: '2023-03-27T13:47:17Z',
      taskRuns: {
        'my-test-output-gwk9q-mfp99-task-1': {
          pipelineTaskName: 'task-1',
          status: {
            completionTime: '2023-03-27T13:47:22Z',
            conditions: [
              {
                lastTransitionTime: '2023-03-27T13:47:22Z',
                message: 'All Steps have completed executing',
                reason: 'Succeeded',
                status: 'True',
                type: 'Succeeded',
              },
            ],
            podName: 'my-test-output-gwk9q-mfp99-task-1-pod',
            startTime: '2023-03-27T13:47:17Z',
            steps: [
              {
                container: 'step-unnamed-0',
                imageID:
                  'quay.io/redhat-appstudio/hacbs-test@sha256:581f9e27c748f9900e32a152293b6dffbaa3e390775f3c36c3860c6ed6c87b73',
                name: 'unnamed-0',
                terminated: {
                  containerID:
                    'cri-o://fa10d49d326350559950fc52c1264d1d8a2ee826d8ac8a7276938f15a67b98e3',
                  exitCode: 0,
                  finishedAt: '2023-03-27T13:47:21Z',
                  reason: 'Completed',
                  startedAt: '2023-03-27T13:47:21Z',
                },
              },
            ],
            taskSpec: {
              steps: [
                {
                  env: [
                    {
                      name: 'HOME',
                      value: '/tekton/home',
                    },
                  ],
                  image: 'quay.io/redhat-appstudio/hacbs-test:stable',
                  name: '',
                  resources: {},
                  script: '#!/usr/bin/env bash\necho "All is well!"\n',
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
      generateName: 'my-test-output-gwk9q-',
      annotations: {
        'results.tekton.dev/record':
          'jephilli-tenant/results/51c2196f-97f0-406f-ad72-b43dfae444a5/records/51c2196f-97f0-406f-ad72-b43dfae444a5',
        'pac.test.appstudio.openshift.io/on-event': '[pull_request]',
        'pac.test.appstudio.openshift.io/log-url':
          'https://console-openshift-console.apps.stone-prd-m01.84db.p1.openshiftapps.com/k8s/ns/jephilli-tenant/tekton.dev~v1beta1~PipelineRun/human-resources-clkq-on-pull-request-fgkpt',
        'pac.test.appstudio.openshift.io/max-keep-runs': '3',
        'pac.test.appstudio.openshift.io/on-target-branch': '[main,master]',
        'chains.tekton.dev/signed': 'true',
        'pac.test.appstudio.openshift.io/repo-url':
          'https://github.com/jeff-phillips-18/human-resources',
        'pac.test.appstudio.openshift.io/installation-id': '34687113',
        'pac.test.appstudio.openshift.io/sha-url':
          'https://github.com/jeff-phillips-18/human-resources/commit/8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
        'results.tekton.dev/result': 'jephilli-tenant/results/51c2196f-97f0-406f-ad72-b43dfae444a5',
        'pac.test.appstudio.openshift.io/sha-title': 'Update README.md',
        'pac.test.appstudio.openshift.io/git-auth-secret': 'pac-gitauth-vfnr',
      },
      resourceVersion: '92260396',
      name: 'my-test-output-gwk9q-tx7rl',
      uid: '51c2196f-97f0-406f-ad72-b43dfae444a5',
      creationTimestamp: '2023-03-27T13:47:16Z',
      generation: 1,
      namespace: 'jephilli-tenant',
      ownerReferences: [
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          blockOwnerDeletion: true,
          controller: true,
          kind: 'Snapshot',
          name: 'my-test-output-gwk9q',
          uid: '406579cb-03dc-4ebd-9d36-aafc9478eb9c',
        },
      ],
      finalizers: ['chains.tekton.dev/pipelinerun'],
      labels: {
        'appstudio.openshift.io/snapshot': 'my-test-output-gwk9q',
        'appstudio.openshift.io/component': 'human-resources-clkq',
        'pac.test.appstudio.openshift.io/pull-request': '6',
        'pac.test.appstudio.openshift.io/url-repository': 'human-resources',
        'pac.test.appstudio.openshift.io/repository': 'human-resources-clkq',
        'pac.test.appstudio.openshift.io/git-provider': 'github',
        'pac.test.appstudio.openshift.io/event-type': 'pull_request',
        'pac.test.appstudio.openshift.io/url-org': 'jeff-phillips-18',
        'pac.test.appstudio.openshift.io/original-prname': 'human-resources-clkq-on-pull-request',
        'test.appstudio.openshift.io/scenario': 'application-test-two',
        'pac.test.appstudio.openshift.io/sha': '8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
        'tekton.dev/pipeline': 'component-pipeline-pass',
        'pac.test.appstudio.openshift.io/sender': 'jeff-phillips-18',
        'appstudio.openshift.io/application': 'my-test-output',
        'pac.test.appstudio.openshift.io/state': 'started',
        'pipelines.appstudio.openshift.io/type': 'test',
        'pac.test.appstudio.openshift.io/branch': 'main',
        'pac.test.appstudio.openshift.io/check-run-id': '12302899421',
      },
    },
    spec: {
      params: [
        {
          name: 'SNAPSHOT',
          value:
            '{"application":"my-test-output","components":[{"name":"devfile-sample-go-basic-kksq","containerImage":"quay.io/redhat-appstudio/user-workload@sha256:0afbdd832f28a7de094e6f0771f5b1b7a80bd8f45d282823ae9ef093d29fac52"},{"name":"devfile-sample-go-basic-vwkv","containerImage":"quay.io/redhat-appstudio/user-workload@sha256:704ab805d1f5d6588c97d22c298fc95f41d444d608fc26a8dc4a7b6e177a704a"},{"name":"human-resources-clkq","containerImage":"quay.io/redhat-appstudio/user-workload@sha256:a273f9c8e642b4bdd27e329e38d552595fb63c42072d4ee2631f6a5dfede8e28"},{"name":"order-app-webshop-4cxk","containerImage":"quay.io/redhat-appstudio/user-workload:p0QHj-order-app-webshop-4cxk"},{"name":"governance-policy-propagator-pswg","containerImage":"quay.io/redhat-appstudio/user-workload:p0QHj-governance-policy-propagator-pswg"},{"name":"pacman-f5si","containerImage":"quay.io/redhat-appstudio/user-workload@sha256:079cf227ab4e744ef777b9c4125039b2cadd7362a80b3b76f0bf3f0cdedbccb9"},{"name":"governance-policy-propagator-aua5","containerImage":"quay.io/redhat-appstudio/user-workload:p0QHj-governance-policy-propagator-aua5"},{"name":"payment-app-webshop-vh3d","containerImage":"quay.io/redhat-appstudio/user-workload:p0QHj-payment-app-webshop-vh3d"},{"name":"stock-app-webshop-jhnj","containerImage":"quay.io/redhat-appstudio/user-workload:p0QHj-stock-app-webshop-jhnj"},{"name":"devfile-sample-go-basic-btj3","containerImage":"quay.io/redhat-appstudio/user-workload:p0QHj-devfile-sample-go-basic-btj3"},{"name":"devfile-sample-go-basic-2cnf","containerImage":"quay.io/redhat-appstudio/user-workload:p0QHj-devfile-sample-go-basic-2cnf"},{"name":"payment-app-webshop-ca6l","containerImage":"quay.io/redhat-appstudio/user-workload:p0QHj-payment-app-webshop-ca6l"},{"name":"stock-app-webshop-l2gd","containerImage":"quay.io/redhat-appstudio/user-workload:p0QHj-stock-app-webshop-l2gd"},{"name":"devfile-sample-code-with-quarkus-66zm","containerImage":"quay.io/redhat-appstudio/user-workload@sha256:8161eeea15f71858d88a1d801ce12c63347f1c27f0bd572c1a657fbb0ad0c8ab"}],"artifacts":{}}',
        },
      ],
      pipelineRef: {
        bundle: 'quay.io/kpavic/test-bundle:component-pipeline-pass',
        name: 'component-pipeline-pass',
      },
      serviceAccountName: 'appstudio-pipeline',
      timeout: '1h0m0s',
    },
    status: {
      completionTime: '2023-03-27T13:47:17Z',
      conditions: [
        {
          lastTransitionTime: '2023-03-27T13:47:17Z',
          message:
            'Error retrieving pipeline for pipelinerun jephilli-tenant/my-test-output-gwk9q-tx7rl: error when listing pipelines for pipelineRun my-test-output-gwk9q-tx7rl: could not find object in image with kind: pipeline and name: component-pipeline-pass',
          reason: 'CouldntGetPipeline',
          status: 'False',
          type: 'Succeeded',
        },
      ],
      startTime: '2023-03-27T13:47:17Z',
    },
  },
];

export const MockEnvironments = [
  {
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    kind: 'Environment',
    metadata: {
      annotations: {
        'toolchain.dev.openshift.com/last-applied-configuration':
          '{"apiVersion":"appstudio.redhat.com/v1alpha1","kind":"Environment","metadata":{"labels":{"toolchain.dev.openshift.com/owner":"jephilli","toolchain.dev.openshift.com/provider":"codeready-toolchain"},"name":"development","namespace":"jephilli-tenant"},"spec":{"deploymentStrategy":"AppStudioAutomated","displayName":"Development","type":"Non-POC"}}',
      },
      resourceVersion: '14576436',
      name: 'development',
      uid: '68aea4ae-d422-4f73-8baa-9a1f5d8eaee7',
      creationTimestamp: '2023-03-01T11:47:57Z',
      generation: 1,
      namespace: 'jephilli-tenant',
      labels: {
        'toolchain.dev.openshift.com/owner': 'jephilli',
        'toolchain.dev.openshift.com/provider': 'codeready-toolchain',
      },
    },
    spec: {
      deploymentStrategy: 'AppStudioAutomated',
      displayName: 'Development',
      type: 'Non-POC',
    },
  },
];

export const MockSnapshotsEB = [
  {
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    kind: 'SnapshotEnvironmentBinding',
    metadata: {
      generateName: 'my-test-output-development-binding-',
      resourceVersion: '93207375',
      name: 'my-test-output-development-binding-7n7d8',
      uid: 'be998bd7-6ba0-4014-9961-932c1d4ad1d5',
      creationTimestamp: '2023-03-09T19:08:41Z',
      generation: 39,
      namespace: 'jephilli-tenant',
      ownerReferences: [
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          blockOwnerDeletion: true,
          controller: true,
          kind: 'Application',
          name: 'my-test-output',
          uid: '2901ca04-f268-4c04-9ef7-5a46f96a5ab7',
        },
      ],
      labels: {
        'appstudio.application': 'my-test-output',
        'appstudio.environment': 'development',
      },
    },
    spec: {
      application: 'my-test-output',
      components: [
        {
          configuration: {
            replicas: 1,
          },
          name: 'devfile-sample-go-basic-kksq',
        },
        {
          configuration: {
            replicas: 1,
          },
          name: 'devfile-sample-go-basic-vwkv',
        },
        {
          configuration: {
            replicas: 1,
          },
          name: 'governance-policy-propagator-pswg',
        },
        {
          configuration: {
            replicas: 1,
          },
          name: 'human-resources-clkq',
        },
        {
          configuration: {
            replicas: 1,
          },
          name: 'order-app-webshop-4cxk',
        },
        {
          configuration: {
            replicas: 1,
          },
          name: 'stock-app-webshop-jhnj',
        },
        {
          configuration: {
            replicas: 1,
          },
          name: 'pacman-f5si',
        },
        {
          configuration: {
            replicas: 1,
          },
          name: 'governance-policy-propagator-aua5',
        },
        {
          configuration: {
            replicas: 1,
          },
          name: 'payment-app-webshop-vh3d',
        },
        {
          configuration: {
            replicas: 1,
          },
          name: 'devfile-sample-code-with-quarkus-66zm',
        },
        {
          configuration: {
            replicas: 1,
          },
          name: 'devfile-sample-go-basic-btj3',
        },
        {
          configuration: {
            replicas: 1,
          },
          name: 'devfile-sample-go-basic-2cnf',
        },
        {
          configuration: {
            replicas: 1,
          },
          name: 'payment-app-webshop-ca6l',
        },
        {
          configuration: {
            replicas: 1,
          },
          name: 'stock-app-webshop-l2gd',
        },
      ],
      environment: 'development',
      snapshot: 'my-test-output-5wb9g',
    },
    status: {
      bindingConditions: [
        {
          lastTransitionTime: '2023-03-27T21:25:03Z',
          message:
            "Can not Reconcile Binding 'my-test-output-development-binding-7n7d8', since GitOps Repo Conditions status is false.",
          reason: 'ErrorOccurred',
          status: 'True',
          type: 'ErrorOccurred',
        },
      ],
      componentDeploymentConditions: [
        {
          lastTransitionTime: '2023-03-14T14:52:28Z',
          message: '4 of 5 components deployed',
          reason: 'CommitsUnsynced',
          status: 'False',
          type: 'AllComponentsDeployed',
        },
      ],
      components: [
        {
          gitopsRepository: {
            branch: 'main',
            commitID: 'c6d7b9946d5b399b9c8c823829f0b697bd962e4d',
            generatedResources: ['deployment-patch.yaml'],
            path: 'components/human-resources-clkq/overlays/development',
            url: 'https://github.com/redhat-appstudio-appdata/my-test-output-p0QHj-reveal-hold',
          },
          name: 'human-resources-clkq',
        },
        {
          gitopsRepository: {
            branch: 'main',
            commitID: '5b781d59d5b4cf44df55a57953208b0b6c224efd',
            generatedResources: ['deployment-patch.yaml'],
            path: 'components/pacman-f5si/overlays/development',
            url: 'https://github.com/redhat-appstudio-appdata/my-test-output-p0QHj-reveal-hold',
          },
          name: 'pacman-f5si',
        },
        {
          gitopsRepository: {
            branch: 'main',
            commitID: '65dc1e55ae58cfe49a816cc07a78a4bb40e23068',
            generatedResources: ['deployment-patch.yaml'],
            path: 'components/devfile-sample-code-with-quarkus-66zm/overlays/development',
            url: 'https://github.com/redhat-appstudio-appdata/my-test-output-p0QHj-reveal-hold',
          },
          name: 'devfile-sample-code-with-quarkus-66zm',
        },
        {
          gitopsRepository: {
            branch: 'main',
            commitID: 'fe8e32cccbf0ad6289ce1ea8d684ac93f3fd8034',
            generatedResources: ['deployment-patch.yaml'],
            path: 'components/devfile-sample-go-basic-kksq/overlays/development',
            url: 'https://github.com/redhat-appstudio-appdata/my-test-output-p0QHj-reveal-hold',
          },
          name: 'devfile-sample-go-basic-kksq',
        },
        {
          gitopsRepository: {
            branch: 'main',
            commitID: 'fa0aa3abda7772b8878172c83862e5751159b7ee',
            generatedResources: ['deployment-patch.yaml'],
            path: 'components/devfile-sample-go-basic-vwkv/overlays/development',
            url: 'https://github.com/redhat-appstudio-appdata/my-test-output-p0QHj-reveal-hold',
          },
          name: 'devfile-sample-go-basic-vwkv',
        },
      ],
      gitopsDeployments: [
        {
          componentName: 'human-resources-clkq',
          gitopsDeployment:
            'my-test-output-development-binding-7n7d8-my-test-output-development-human-resources-clkq',
        },
        {
          componentName: 'pacman-f5si',
          gitopsDeployment:
            'my-test-output-development-binding-7n7d8-my-test-output-development-pacman-f5si',
        },
        {
          componentName: 'devfile-sample-code-with-quarkus-66zm',
          gitopsDeployment:
            'my-test-output-development-binding-7n7d8-my-test-output-development-devfile-sample-code-with-quarkus-66zm',
        },
        {
          componentName: 'devfile-sample-go-basic-kksq',
          gitopsDeployment:
            'my-test-output-development-binding-7n7d8-my-test-output-development-devfile-sample-go-basic-kksq',
        },
        {
          componentName: 'devfile-sample-go-basic-vwkv',
          gitopsDeployment:
            'my-test-output-development-binding-7n7d8-my-test-output-development-devfile-sample-go-basic-vwkv',
        },
      ],
      gitopsRepoConditions: [
        {
          lastTransitionTime: '2023-03-15T12:48:37Z',
          message:
            'GitOps repository sync failed: application snapshot my-test-output-5wb9g did not reference component devfile-sample-go-basic-kksq',
          reason: 'GenerateError',
          status: 'False',
          type: 'GitOpsResourcesGenerated',
        },
      ],
    },
  },
];

export const MockSnapshots: Snapshot[] = [
  {
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    kind: 'Snapshot',
    metadata: {
      generateName: 'my-test-output-',
      annotations: {
        'pac.test.appstudio.openshift.io/on-event': '[pull_request]',
        'pac.test.appstudio.openshift.io/log-url':
          'https://console-openshift-console.apps.stone-prd-m01.84db.p1.openshiftapps.com/k8s/ns/jephilli-tenant/tekton.dev~v1beta1~PipelineRun/human-resources-clkq-on-pull-request-fgkpt',
        'pac.test.appstudio.openshift.io/max-keep-runs': '3',
        'pac.test.appstudio.openshift.io/on-target-branch': '[main,master]',
        'pac.test.appstudio.openshift.io/repo-url':
          'https://github.com/jeff-phillips-18/human-resources',
        'pac.test.appstudio.openshift.io/installation-id': '34687113',
        'pac.test.appstudio.openshift.io/sha-url':
          'https://github.com/jeff-phillips-18/human-resources/commit/8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
        'pac.test.appstudio.openshift.io/sha-title': 'Update README.md',
        'pac.test.appstudio.openshift.io/git-auth-secret': 'pac-gitauth-vfnr',
        'test.appstudio.openshift.io/status':
          '[{"scenario":"app-sample-go-basic-enterprise-contract","status":"EnvironmentProvisionError","lastUpdateTime":"2023-09-19T16:00:38.969982048Z","details":"Failed to find deploymentTargetClass with right provisioner for copy of existingEnvironment","startTime":"2023-09-19T16:00:17.970660813Z","completionTime":"2023-09-20T16:00:38.969982048Z"},{"scenario":"scn 2","status":"EnvironmentProvisionError","lastUpdateTime":"2023-09-20T16:00:38.969982048Z","details":"could not find deployment","startTime":"2023-09-20T16:00:17.970660813Z","completionTime":"2023-09-20T16:00:38.969982048Z"}]',
      },
      resourceVersion: '92260135',
      name: 'my-test-output-1',
      uid: '406579cb-03dc-4ebd-9d36-aafc9478eb9c',
      creationTimestamp: '2023-03-27T13:47:16Z',
      generation: 1,
      namespace: 'jephilli-tenant',
      ownerReferences: [
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          blockOwnerDeletion: true,
          controller: true,
          kind: 'Application',
          name: 'my-test-output',
          uid: '2901ca04-f268-4c04-9ef7-5a46f96a5ab7',
        },
      ],
      labels: {
        'appstudio.openshift.io/component': 'human-resources-clkq',
        'pac.test.appstudio.openshift.io/pull-request': '6',
        'pac.test.appstudio.openshift.io/url-repository': 'human-resources',
        'pac.test.appstudio.openshift.io/repository': 'human-resources-clkq',
        'pac.test.appstudio.openshift.io/git-provider': 'github',
        'pac.test.appstudio.openshift.io/event-type': 'pull_request',
        'test.appstudio.openshift.io/pipelinerunfinishtime': '1679924836',
        'pac.test.appstudio.openshift.io/url-org': 'jeff-phillips-18',
        'pac.test.appstudio.openshift.io/original-prname': 'human-resources-clkq-on-pull-request',
        'pac.test.appstudio.openshift.io/sha': '8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
        'pac.test.appstudio.openshift.io/sender': 'jeff-phillips-18',
        'pac.test.appstudio.openshift.io/state': 'started',
        'test.appstudio.openshift.io/type': 'component',
        'pac.test.appstudio.openshift.io/branch': 'main',
        'pac.test.appstudio.openshift.io/check-run-id': '12302899421',
      },
    },
    spec: {
      application: 'my-test-output',
      artifacts: {},
      components: [
        {
          containerImage:
            'quay.io/redhat-appstudio/user-workload@sha256:0afbdd832f28a7de094e6f0771f5b1b7a80bd8f45d282823ae9ef093d29fac52',
          name: 'devfile-sample-go-basic-kksq',
        },
        {
          containerImage:
            'quay.io/redhat-appstudio/user-workload@sha256:704ab805d1f5d6588c97d22c298fc95f41d444d608fc26a8dc4a7b6e177a704a',
          name: 'devfile-sample-go-basic-vwkv',
        },
        {
          containerImage:
            'quay.io/redhat-appstudio/user-workload@sha256:a273f9c8e642b4bdd27e329e38d552595fb63c42072d4ee2631f6a5dfede8e28',
          name: 'human-resources-clkq',
        },
        {
          containerImage: 'quay.io/redhat-appstudio/user-workload:p0QHj-order-app-webshop-4cxk',
          name: 'order-app-webshop-4cxk',
        },
        {
          containerImage:
            'quay.io/redhat-appstudio/user-workload:p0QHj-governance-policy-propagator-pswg',
          name: 'governance-policy-propagator-pswg',
        },
        {
          containerImage:
            'quay.io/redhat-appstudio/user-workload@sha256:079cf227ab4e744ef777b9c4125039b2cadd7362a80b3b76f0bf3f0cdedbccb9',
          name: 'pacman-f5si',
        },
        {
          containerImage:
            'quay.io/redhat-appstudio/user-workload:p0QHj-governance-policy-propagator-aua5',
          name: 'governance-policy-propagator-aua5',
        },
        {
          containerImage: 'quay.io/redhat-appstudio/user-workload:p0QHj-payment-app-webshop-vh3d',
          name: 'payment-app-webshop-vh3d',
        },
        {
          containerImage: 'quay.io/redhat-appstudio/user-workload:p0QHj-stock-app-webshop-jhnj',
          name: 'stock-app-webshop-jhnj',
        },
        {
          containerImage:
            'quay.io/redhat-appstudio/user-workload:p0QHj-devfile-sample-go-basic-btj3',
          name: 'devfile-sample-go-basic-btj3',
        },
        {
          containerImage:
            'quay.io/redhat-appstudio/user-workload:p0QHj-devfile-sample-go-basic-2cnf',
          name: 'devfile-sample-go-basic-2cnf',
        },
        {
          containerImage: 'quay.io/redhat-appstudio/user-workload:p0QHj-payment-app-webshop-ca6l',
          name: 'payment-app-webshop-ca6l',
        },
        {
          containerImage: 'quay.io/redhat-appstudio/user-workload:p0QHj-stock-app-webshop-l2gd',
          name: 'stock-app-webshop-l2gd',
        },
        {
          containerImage:
            'quay.io/redhat-appstudio/user-workload@sha256:8161eeea15f71858d88a1d801ce12c63347f1c27f0bd572c1a657fbb0ad0c8ab',
          name: 'devfile-sample-code-with-quarkus-66zm',
        },
      ],
    },
    status: {
      conditions: [
        {
          lastTransitionTime: '2023-03-27T13:47:16Z',
          message: 'Snapshot starts being tested by the integrationPipelineRun',
          reason: 'InProgress',
          status: 'Unknown',
          type: 'HACBSIntegrationStatus',
        },
      ],
    },
  },
  {
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    kind: 'Snapshot',
    metadata: {
      generateName: 'my-test-output-',
      annotations: {
        'pac.test.appstudio.openshift.io/on-event': '[pull_request]',
        'pac.test.appstudio.openshift.io/log-url':
          'https://console-openshift-console.apps.stone-prd-m01.84db.p1.openshiftapps.com/k8s/ns/jephilli-tenant/tekton.dev~v1beta1~PipelineRun/human-resources-clkq-on-pull-request-fgkpt',
        'pac.test.appstudio.openshift.io/max-keep-runs': '3',
        'pac.test.appstudio.openshift.io/on-target-branch': '[main,master]',
        'pac.test.appstudio.openshift.io/repo-url':
          'https://github.com/jeff-phillips-18/human-resources',
        'pac.test.appstudio.openshift.io/installation-id': '34687113',
        'pac.test.appstudio.openshift.io/sha-url':
          'https://github.com/jeff-phillips-18/human-resources/commit/8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
        'pac.test.appstudio.openshift.io/sha-title': 'Update README.md',
        'pac.test.appstudio.openshift.io/git-auth-secret': 'pac-gitauth-vfnr',
        'test.appstudio.openshift.io/status':
          '[{"scenario":"app-sample-go-basic-enterprise-contract","status":"EnvironmentProvisionError","lastUpdateTime":"2023-09-19T16:00:38.969982048Z","details":"Failed to find deploymentTargetClass with right provisioner for copy of existingEnvironment","startTime":"2023-09-20T16:00:17.970660813Z","completionTime":"2023-09-20T16:00:38.969982048Z"}]',
      },
      resourceVersion: '92260135',
      name: 'my-test-output-2',
      uid: '406579cb-03dc-4ebd-9d36-aafc9478eb9c',
      creationTimestamp: '2023-03-27T13:47:16Z',
      generation: 1,
      namespace: 'jephilli-tenant',
      ownerReferences: [
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          blockOwnerDeletion: true,
          controller: true,
          kind: 'Application',
          name: 'my-test-output',
          uid: '2901ca04-f268-4c04-9ef7-5a46f96a5ab7',
        },
      ],
      labels: {
        'appstudio.openshift.io/component': 'human-resources-clkq',
        'pac.test.appstudio.openshift.io/pull-request': '6',
        'pac.test.appstudio.openshift.io/url-repository': 'human-resources',
        'pac.test.appstudio.openshift.io/repository': 'human-resources-clkq',
        'pac.test.appstudio.openshift.io/git-provider': 'github',
        'pac.test.appstudio.openshift.io/event-type': 'pull_request',
        'test.appstudio.openshift.io/pipelinerunfinishtime': '1679924836',
        'pac.test.appstudio.openshift.io/url-org': 'jeff-phillips-18',
        'pac.test.appstudio.openshift.io/original-prname': 'human-resources-clkq-on-pull-request',
        'pac.test.appstudio.openshift.io/sha': '8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
        'pac.test.appstudio.openshift.io/sender': 'jeff-phillips-18',
        'pac.test.appstudio.openshift.io/state': 'started',
        'test.appstudio.openshift.io/type': 'component',
        'pac.test.appstudio.openshift.io/branch': 'main',
        'pac.test.appstudio.openshift.io/check-run-id': '12302899421',
      },
    },
    spec: {
      application: 'my-test-output',
      artifacts: {},
      components: [
        {
          containerImage:
            'quay.io/redhat-appstudio/user-workload@sha256:0afbdd832f28a7de094e6f0771f5b1b7a80bd8f45d282823ae9ef093d29fac52',
          name: 'devfile-sample-go-basic-kksq',
        },
        {
          containerImage:
            'quay.io/redhat-appstudio/user-workload@sha256:704ab805d1f5d6588c97d22c298fc95f41d444d608fc26a8dc4a7b6e177a704a',
          name: 'devfile-sample-go-basic-vwkv',
        },
        {
          containerImage:
            'quay.io/redhat-appstudio/user-workload@sha256:a273f9c8e642b4bdd27e329e38d552595fb63c42072d4ee2631f6a5dfede8e28',
          name: 'human-resources-clkq',
        },
        {
          containerImage: 'quay.io/redhat-appstudio/user-workload:p0QHj-order-app-webshop-4cxk',
          name: 'order-app-webshop-4cxk',
        },
        {
          containerImage:
            'quay.io/redhat-appstudio/user-workload:p0QHj-governance-policy-propagator-pswg',
          name: 'governance-policy-propagator-pswg',
        },
        {
          containerImage:
            'quay.io/redhat-appstudio/user-workload@sha256:079cf227ab4e744ef777b9c4125039b2cadd7362a80b3b76f0bf3f0cdedbccb9',
          name: 'pacman-f5si',
        },
        {
          containerImage:
            'quay.io/redhat-appstudio/user-workload:p0QHj-governance-policy-propagator-aua5',
          name: 'governance-policy-propagator-aua5',
        },
        {
          containerImage: 'quay.io/redhat-appstudio/user-workload:p0QHj-payment-app-webshop-vh3d',
          name: 'payment-app-webshop-vh3d',
        },
        {
          containerImage: 'quay.io/redhat-appstudio/user-workload:p0QHj-stock-app-webshop-jhnj',
          name: 'stock-app-webshop-jhnj',
        },
        {
          containerImage:
            'quay.io/redhat-appstudio/user-workload:p0QHj-devfile-sample-go-basic-btj3',
          name: 'devfile-sample-go-basic-btj3',
        },
        {
          containerImage:
            'quay.io/redhat-appstudio/user-workload:p0QHj-devfile-sample-go-basic-2cnf',
          name: 'devfile-sample-go-basic-2cnf',
        },
        {
          containerImage: 'quay.io/redhat-appstudio/user-workload:p0QHj-payment-app-webshop-ca6l',
          name: 'payment-app-webshop-ca6l',
        },
        {
          containerImage: 'quay.io/redhat-appstudio/user-workload:p0QHj-stock-app-webshop-l2gd',
          name: 'stock-app-webshop-l2gd',
        },
        {
          containerImage:
            'quay.io/redhat-appstudio/user-workload@sha256:8161eeea15f71858d88a1d801ce12c63347f1c27f0bd572c1a657fbb0ad0c8ab',
          name: 'devfile-sample-code-with-quarkus-66zm',
        },
      ],
    },
    status: {
      conditions: [
        {
          lastTransitionTime: '2023-03-27T13:47:16Z',
          message: 'Snapshot starts being tested by the integrationPipelineRun',
          reason: 'InProgress',
          status: 'Unknown',
          type: 'HACBSIntegrationStatus',
        },
      ],
    },
  },
  {
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    kind: 'Snapshot',
    metadata: {
      generateName: 'my-test-output-',
      annotations: {
        'pac.test.appstudio.openshift.io/on-target-branch': '[main,master]',
        'pac.test.appstudio.openshift.io/repo-url':
          'https://github.com/jeff-phillips-18/human-resources',
        'pac.test.appstudio.openshift.io/installation-id': '34687113',
        'pac.test.appstudio.openshift.io/sha-url':
          'https://github.com/jeff-phillips-18/human-resources/commit/8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
        'pac.test.appstudio.openshift.io/sha-title': 'Update README.md',
      },
      resourceVersion: '92260135',
      name: 'no status snapshot',
      uid: '406579cb-03dc-4ebd-9d36-aafc9478eb9c',
      creationTimestamp: '2023-03-27T13:47:16Z',
      generation: 1,
      namespace: 'jephilli-tenant',
      ownerReferences: [
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          blockOwnerDeletion: true,
          controller: true,
          kind: 'Application',
          name: 'my-test-output',
          uid: '2901ca04-f268-4c04-9ef7-5a46f96a5ab7',
        },
      ],
      labels: {
        'appstudio.openshift.io/component': 'human-resources-clkq',
        'pac.test.appstudio.openshift.io/pull-request': '6',
      },
    },
    spec: {
      application: 'my-test-output',
      artifacts: {},
      components: [
        {
          containerImage:
            'quay.io/redhat-appstudio/user-workload@sha256:0afbdd832f28a7de094e6f0771f5b1b7a80bd8f45d282823ae9ef093d29fac52',
          name: 'devfile-sample-go-basic-kksq',
        },
      ],
    },
    status: {
      conditions: [
        {
          lastTransitionTime: '2023-03-27T13:47:16Z',
          message: 'Snapshot starts being tested by the integrationPipelineRun',
          reason: 'InProgress',
          status: 'Unknown',
          type: 'HACBSIntegrationStatus',
        },
      ],
    },
  },
  {
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    kind: 'Snapshot',
    metadata: {
      generateName: 'my-test-output-',
      annotations: {
        'pac.test.appstudio.openshift.io/on-target-branch': '[main,master]',
        'pac.test.appstudio.openshift.io/repo-url':
          'https://github.com/jeff-phillips-18/human-resources',
        'pac.test.appstudio.openshift.io/installation-id': '34687113',
        'pac.test.appstudio.openshift.io/sha-url':
          'https://github.com/jeff-phillips-18/human-resources/commit/8a1fd02d3fec043b009608ac67350cd4a2e02cd9',
        'pac.test.appstudio.openshift.io/sha-title': 'Update README.md',
        'test.appstudio.openshift.io/status':
          '[{"scenario":"app-sample-go-basic-enterprise-contract","status":"Pending","lastUpdateTime":"2023-09-20T16:00:38.969982048Z","details":"Failed to find deploymentTargetClass with right provisioner for copy of existingEnvironment","startTime":"2023-09-20T16:00:17.970660813Z","completionTime":"2023-09-20T16:00:38.969982048Z"}]',
      },
      resourceVersion: '92260135',
      name: 'snapshot with diff err',
      uid: '406579cb-03dc-4ebd-9d36-aafc9478eb9c',
      creationTimestamp: '2023-03-27T13:47:16Z',
      generation: 1,
      namespace: 'jephilli-tenant',
      ownerReferences: [
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          blockOwnerDeletion: true,
          controller: true,
          kind: 'Application',
          name: 'my-test-output',
          uid: '2901ca04-f268-4c04-9ef7-5a46f96a5ab7',
        },
      ],
      labels: {
        'appstudio.openshift.io/component': 'human-resources-clkq',
        'pac.test.appstudio.openshift.io/pull-request': '6',
      },
    },
    spec: {
      application: 'my-test-output',
      artifacts: {},
      components: [
        {
          containerImage:
            'quay.io/redhat-appstudio/user-workload@sha256:0afbdd832f28a7de094e6f0771f5b1b7a80bd8f45d282823ae9ef093d29fac52',
          name: 'devfile-sample-go-basic-kksq',
        },
      ],
    },
    status: {
      conditions: [
        {
          lastTransitionTime: '2023-03-27T13:47:16Z',
          message: 'Snapshot starts being tested by the integrationPipelineRun',
          reason: 'InProgress',
          status: 'Unknown',
          type: 'HACBSIntegrationStatus',
        },
      ],
    },
  },
];

export const MockReleases = [];

export const MockReleasePlans = [];
