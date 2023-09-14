import { Commit, PipelineRunKind } from '../../../types';

export const pipelineWithCommits: PipelineRunKind[] = [
  {
    apiVersion: 'tekton.dev/v1beta1',
    apiGroup: 'tekton.dev',
    kind: 'PipelineRun',
    metadata: {
      annotations: {
        'build.appstudio.openshift.io/image':
          'quay.io/redhat-appstudio/user-workload:test-java-springboot-sample',
        'pipelinesascode.tekton.dev/sha-url':
          'https://github.com/devfile-samples/devfile-sample-java-springboot-basic',
        'chains.tekton.dev/retries': '3',
        'chains.tekton.dev/signed': 'failed',
        'chains.tekton.dev/transparency':
          'http://rekor-server.enterprise-contract-service.svc:3000/api/v1/log/entries?logIndex=3143',
        'results.tekton.dev/record':
          'test/results/558677f8-e01c-4d15-8729-5e838bd492aa/records/558677f8-e01c-4d15-8729-5e838bd492aa',
        'results.tekton.dev/result': 'test/results/558677f8-e01c-4d15-8729-5e838bd492aa',
        'build.appstudio.redhat.com/target_branch': 'branch_1',
        'pipelinesascode.tekton.dev/sha-title': 'test-title',
        'pipelinesascode.tekton.dev/repo-url': 'https://github.com/test/test-repo',
        'appstudio.openshift.io/snapshot': 'my-test-output-2',
      },
      creationTimestamp: '2022-07-19T11:35:46Z',
      generation: 1,
      labels: {
        'appstudio.openshift.io/application': 'purple-mermaid-app',
        'build.appstudio.openshift.io/build': 'true',
        'build.appstudio.openshift.io/type': 'build',
        'build.appstudio.openshift.io/version': '0.1',
        'pipelines.appstudio.openshift.io/type': 'build',
        'appstudio.openshift.io/component': 'sample-component',
        'pipelinesascode.tekton.dev/sender': 'abhi',
        'pipelinesascode.tekton.dev/sha': 'commit123',
        'pipelinesascode.tekton.dev/url-org': 'openshift',
        'build.appstudio.redhat.com/url-repository': 'console',
        'pipelinesascode.tekton.dev/git-provider': 'github',
        'pipelinesascode.tekton.dev/pull-request': '11',
        'pipelinesascode.tekton.dev/event-type': 'pull_request',
      },
      name: 'java-springboot-sample-x778q',
      namespace: 'test',
      ownerReferences: [
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          kind: 'Component',
          name: 'java-springboot-sample',
          uid: '52b51aec-d31c-4ae9-841e-1cac635c28d2',
        },
      ],
      resourceVersion: '804999040',
      uid: '558677f8-e01c-4d15-8729-5e838bd492aa',
    },
    spec: {},
    status: {
      pipelineSpec: null,
      conditions: [
        {
          reason: 'Completed',
          status: 'True',
          type: 'Succeeded',
        },
      ],
      startTime: '2022-08-19T12:47:26Z',
    },
  },
  {
    apiVersion: 'tekton.dev/v1beta1',
    kind: 'PipelineRun',
    apiGroup: 'tekton.dev',
    metadata: {
      annotations: {
        'build.appstudio.openshift.io/image':
          'quay.io/redhat-appstudio/user-workload:test-nodejs-sample',
        'build.appstudio.openshift.io/repo':
          'https://github.com/nodeshift-starters/devfile-sample.git',
        'pipelinesascode.tekton.dev/sha-url':
          'https://github.com/devfile-samples/devfile-sample-java-springboot-basic',
        'chains.tekton.dev/retries': '3',
        'chains.tekton.dev/signed': 'failed',
        'chains.tekton.dev/transparency':
          'https://rekor.sigstore.dev/api/v1/log/entries?logIndex=2717932',
        'results.tekton.dev/record':
          'test/results/358168a2-e2f1-4fc6-90a5-90ad80079e17/records/358168a2-e2f1-4fc6-90a5-90ad80079e17',
        'results.tekton.dev/result': 'test/results/358168a2-e2f1-4fc6-90a5-90ad80079e17',
        'build.appstudio.redhat.com/commit_sha': 'commit14rt',
        'build.appstudio.redhat.com/target_branch': 'branch_b',
        'pipelinesascode.tekton.dev/sha-title': 'test-title-2',
      },
      creationTimestamp: '2022-06-20T12:47:24Z',
      generateName: 'nodejs-sample-',
      generation: 1,
      labels: {
        'appstudio.openshift.io/application': 'purple-mermaid-app',
        'build.appstudio.openshift.io/type': 'release',
        'build.appstudio.openshift.io/version': '0.1',
        'pipelines.appstudio.openshift.io/type': 'release',
        'build.appstudio.openshift.io/build': 'true',
        'appstudio.openshift.io/component': 'go-3',
        'pipelinesascode.tekton.dev/sender': 'abhi',
        'pipelinesascode.tekton.dev/sha': 'commit14rt',
        'pipelinesascode.tekton.dev/url-org': 'openshift',
        'build.appstudio.redhat.com/url-repository': 'console',
        'pipelinesascode.tekton.dev/git-provider': 'github',
        'pipelinesascode.tekton.dev/pull-request': '11',
        'pipelinesascode.tekton.dev/event-type': 'pull_request',
      },
      name: 'nodejs-sample-zth6t',
      namespace: 'test',
      ownerReferences: [
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          kind: 'Component',
          name: 'nodejs-sample',
          uid: '85cf4351-2cce-4816-9bd3-d04f8c6a98b8',
        },
      ],
      resourceVersion: '644928943',
      uid: '358168a2-e2f1-4fc6-90a5-90ad80079e17',
    },
    spec: {},
  },
  {
    apiVersion: 'tekton.dev/v1beta1',
    kind: 'PipelineRun',
    apiGroup: 'tekton.dev',
    metadata: {
      annotations: {
        'build.appstudio.openshift.io/image':
          'quay.io/redhat-appstudio/user-workload:test-nodejs-sample',
        'build.appstudio.openshift.io/repo':
          'https://github.com/nodeshift-starters/devfile-sample.git',
        'chains.tekton.dev/retries': '3',
        'chains.tekton.dev/signed': 'failed',
        'chains.tekton.dev/transparency':
          'https://rekor.sigstore.dev/api/v1/log/entries?logIndex=2717932',
        'results.tekton.dev/record':
          'test/results/358168a2-e2f1-4fc6-90a5-90ad80079e17/records/358168a2-e2f1-4fc6-90a5-90ad80079e17',
        'results.tekton.dev/result': 'test/results/358168a2-e2f1-4fc6-90a5-90ad80079e17',
        'pipelinesascode.tekton.dev/sha-url':
          'https://github.com/devfile-samples/devfile-sample-java-springboot-basic',
        'build.appstudio.redhat.com/target_branch': 'branch_b',
        'pipelinesascode.tekton.dev/sha-title': 'test-title-3',
      },
      creationTimestamp: '2022-06-20T12:47:24Z',
      generateName: 'nodejs-sample-',
      generation: 1,
      labels: {
        'appstudio.openshift.io/application': 'purple-mermaid-app',
        'build.appstudio.openshift.io/type': 'build',
        'build.appstudio.openshift.io/version': '0.1',
        'pipelines.appstudio.openshift.io/type': 'build',
        'build.appstudio.openshift.io/build': 'true',
        'appstudio.openshift.io/component': 'governance-policy-propagator-aua5',
        'pipelinesascode.tekton.dev/sender': 'abhi',
        'pipelinesascode.tekton.dev/sha': 'commit14rt',
        'pipelinesascode.tekton.dev/url-org': 'openshift',
        'build.appstudio.redhat.com/url-repository': 'console',
        'pipelinesascode.tekton.dev/git-provider': 'github',
      },
      name: 'nodejs-sample-zth6t',
      namespace: 'test',
      ownerReferences: [
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          kind: 'Component',
          name: 'nodejs-sample',
          uid: '85cf4351-2cce-4816-9bd3-d04f8c6a98b8',
        },
      ],
      resourceVersion: '644928943',
      uid: '358168a2-e2f1-4fc6-90a5-90ad80079e17',
    },
    spec: {
      params: [
        {
          name: 'git-url',
          value: 'https://github.com/nodeshift-starters/devfile-sample.git',
        },
        {
          name: 'output-image',
          value: 'quay.io/redhat-appstudio/user-workload:test-nodejs-sample',
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
          'quay.io/redhat-appstudio/build-templates-bundle:ab259a6fef091698b0fc145537338fa78f521c1f',
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
          subPath: 'nodejs-sample/initialbuild-2022-Jun-20_12-47-24',
        },
      ],
    },
    status: {
      pipelineSpec: null,
      completionTime: '2022-06-20T12:49:27Z',
      conditions: [
        {
          lastTransitionTime: '2022-06-20T12:49:27Z',
          message: 'Tasks Completed: 5 (Failed: 0, Cancelled 0), Skipped: 0',
          reason: 'Succeeded',
          status: 'True',
          type: 'Succeeded',
        },
      ],
      startTime: '2022-06-20T12:47:26Z',
    },
  },
  {
    apiVersion: 'tekton.dev/v1beta1',
    kind: 'PipelineRun',
    apiGroup: 'tekton.dev',
    metadata: {
      annotations: {
        'build.appstudio.openshift.io/image':
          'quay.io/redhat-appstudio/user-workload:test-nodejs-sample',
        'build.appstudio.openshift.io/repo':
          'https://github.com/nodeshift-starters/devfile-sample.git',
        'chains.tekton.dev/retries': '3',
        'chains.tekton.dev/signed': 'failed',
        'chains.tekton.dev/transparency':
          'https://rekor.sigstore.dev/api/v1/log/entries?logIndex=2717932',
        'results.tekton.dev/record':
          'test/results/358168a2-e2f1-4fc6-90a5-90ad80079e17/records/358168a2-e2f1-4fc6-90a5-90ad80079e17',
        'results.tekton.dev/result': 'test/results/358168a2-e2f1-4fc6-90a5-90ad80079e17',
        'pipelinesascode.tekton.dev/sha-url':
          'https://github.com/devfile-samples/devfile-sample-java-springboot-basic',
        'build.appstudio.redhat.com/target_branch': 'branch_b',
        'pipelinesascode.tekton.dev/sha-title': 'test-title-4',
      },
      creationTimestamp: '2022-06-20T12:47:24Z',
      generateName: 'nodejs-sample-',
      generation: 1,
      labels: {
        'appstudio.openshift.io/application': 'purple-mermaid-app',
        'build.appstudio.openshift.io/type': 'test',
        'build.appstudio.openshift.io/version': '0.1',
        'pipelines.appstudio.openshift.io/type': 'test',
        'build.appstudio.openshift.io/build': 'true',
        'appstudio.openshift.io/component': 'sample-component',
        'pipelinesascode.tekton.dev/sender': 'abhi',
        'pipelinesascode.tekton.dev/sha': 'commit14rt',
        'pipelinesascode.tekton.dev/url-org': 'openshift',
        'build.appstudio.redhat.com/url-repository': 'console',
        'pipelinesascode.tekton.dev/git-provider': 'github',
      },
      name: 'nodejs-sample-zth6t',
      namespace: 'test',
      ownerReferences: [
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          kind: 'Component',
          name: 'nodejs-sample',
          uid: '85cf4351-2cce-4816-9bd3-d04f8c6a98b8',
        },
      ],
      resourceVersion: '644928943',
      uid: '358168a2-e2f1-4fc6-90a5-90ad80079e17',
    },
    status: {
      pipelineSpec: null,
      completionTime: '2022-06-20T12:49:27Z',
      conditions: [
        {
          lastTransitionTime: '2022-06-20T12:49:27Z',
          message: 'Tasks Completed: 5 (Failed: 0, Cancelled 0), Skipped: 0',
          reason: 'Succeeded',
          status: 'True',
          type: 'Succeeded',
        },
      ],
      startTime: '2022-06-20T12:47:26Z',
    },
    spec: {},
  },
  {
    apiVersion: 'tekton.dev/v1beta1',
    kind: 'PipelineRun',
    metadata: {
      generateName: 'devfile-sample-go-basic-a8bq-',
      annotations: {
        'build.appstudio.openshift.io/repo':
          'https://github.com/jeff-phillips-18/devfile-sample-go-basic?rev=d1ac676fb7e6d06b634bb68239b9dccc035c3b38',
        'build.appstudio.redhat.com/bundle':
          'quay.io/redhat-appstudio-tekton-catalog/pipeline-docker-build:c31f6ad4939f52b30b10331097a21a0d03ca1745',
        'build.appstudio.redhat.com/commit_sha': 'commit777',
        'build.appstudio.redhat.com/pipeline_name': 'docker-build',
        'chains.tekton.dev/signed': 'true',
        'results.tekton.dev/childReadyForDeletion': 'true',
        'results.tekton.dev/record':
          'jephilli-tenant/results/741e7a60-c41a-455b-9f5c-03f54d1ab002/records/741e7a60-c41a-455b-9f5c-03f54d1ab002',
        'results.tekton.dev/result': 'jephilli-tenant/results/741e7a60-c41a-455b-9f5c-03f54d1ab002',
      },
      resourceVersion: '371348927',
      name: 'devfile-sample-go-basic-a8bq-llf8v',
      uid: '741e7a60-c41a-455b-9f5c-03f54d1ab002',
      creationTimestamp: '2023-05-24T12:43:27Z',
      generation: 1,
      namespace: 'jephilli-tenant',
      ownerReferences: [
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          kind: 'Component',
          name: 'devfile-sample-go-basic-a8bq',
          uid: 'c5b8ac2b-dbfb-4634-9e05-dc2a7bcd4e9d',
        },
      ],
      finalizers: ['chains.tekton.dev/pipelinerun'],
      labels: {
        'appstudio.openshift.io/application': 'test-application',
        'appstudio.openshift.io/component': 'manual-build-component',
        'pipelines.appstudio.openshift.io/type': 'build',
        'pipelines.openshift.io/runtime': 'generic',
        'pipelines.openshift.io/strategy': 'docker',
        'pipelines.openshift.io/used-by': 'build-cloud',
        'tekton.dev/pipeline': 'docker-build',
      },
    },
    spec: {
      params: [
        {
          name: 'dockerfile',
          value: 'docker/Dockerfile',
        },
        {
          name: 'git-url',
          value: 'https://github.com/jeff-phillips-18/devfile-sample-go-basic.git',
        },
        {
          name: 'output-image',
          value:
            'quay.io/redhat-user-workloads/jephilli-tenant/test-application/devfile-sample-go-basic-a8bq:build-21392-1684932207',
        },
        {
          name: 'path-context',
          value: '.',
        },
        {
          name: 'skip-checks',
          value: 'true',
        },
      ],
      pipelineRef: {
        bundle:
          'quay.io/redhat-appstudio-tekton-catalog/pipeline-docker-build:c31f6ad4939f52b30b10331097a21a0d03ca1745',
        name: 'docker-build',
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
      ],
    },
    status: {
      childReferences: [
        {
          apiVersion: 'tekton.dev/v1beta1',
          kind: 'TaskRun',
          name: 'devfile-sample-go-basic-a8bq-llf8v-init',
          pipelineTaskName: 'init',
        },
        {
          apiVersion: 'tekton.dev/v1beta1',
          kind: 'TaskRun',
          name: 'devfile-sample-go-basic-a8bq-llf8v-clone-repository',
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
          name: 'devfile-sample-go-basic-a8bq-llf8v-build-container',
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
          name: 'devfile-sample-go-basic-a8bq-llf8v-show-sbom',
          pipelineTaskName: 'show-sbom',
        },
        {
          apiVersion: 'tekton.dev/v1beta1',
          kind: 'TaskRun',
          name: 'devfile-sample-go-basic-a8bq-llf8v-show-summary',
          pipelineTaskName: 'show-summary',
        },
      ],
      completionTime: '2023-06-18T12:46:30Z',
      finallyStartTime: '2023-06-18T12:46:21Z',
      taskRuns: {
        'devfile-sample-go-basic-a8bq-llf8v-build-container': {
          pipelineTaskName: 'build-container',
          status: {
            completionTime: '2023-05-24T12:46:17Z',
            conditions: [
              {
                lastTransitionTime: '2023-05-24T12:46:17Z',
                message: 'All Steps have completed executing',
                reason: 'Succeeded',
                status: 'True',
                type: 'Succeeded',
              },
            ],
            podName: 'devfile-sample-go-basic-a8bq-llf8v-build-container-pod',
            startTime: '2023-05-24T12:43:56Z',
            steps: [
              {
                container: 'step-build',
                imageID:
                  'quay.io/redhat-appstudio/buildah@sha256:381e9bfedd59701477621da93892106873a6951b196105d3d2d85c3f6d7b569b',
                name: 'build',
                terminated: {
                  containerID:
                    'cri-o://e741cf2d67a352ffd08572a4f58d6902999750300072e0efee83feaf182b8e73',
                  exitCode: 0,
                  finishedAt: '2023-05-24T12:45:01Z',
                  reason: 'Completed',
                  startedAt: '2023-05-24T12:44:05Z',
                },
              },
              {
                container: 'step-sbom-get',
                imageID:
                  'quay.io/redhat-appstudio/syft@sha256:09afc449976230f66848c19bb5ccf344eb0eeb4ed50747e33b53aff49462c319',
                name: 'sbom-get',
                terminated: {
                  containerID:
                    'cri-o://200c0eec812da5fd0880a03e17c101a7dd62a7eade61305cec26da2b3f4b732b',
                  exitCode: 0,
                  finishedAt: '2023-05-24T12:45:44Z',
                  reason: 'Completed',
                  startedAt: '2023-05-24T12:45:02Z',
                },
              },
              {
                container: 'step-analyse-dependencies-java-sbom',
                imageID:
                  'quay.io/redhat-appstudio/hacbs-jvm-build-request-processor@sha256:b198cf4b33dab59ce8ac25afd4e1001390db29ca2dec83dc8a1e21b0359ce743',
                name: 'analyse-dependencies-java-sbom',
                terminated: {
                  containerID:
                    'cri-o://f9153fa207264241c170cee9edc73243774256fd4097ee753b4763ee5065d64d',
                  exitCode: 0,
                  finishedAt: '2023-05-24T12:45:45Z',
                  message: '[{"key":"JAVA_COMMUNITY_DEPENDENCIES","value":"","type":1}]',
                  reason: 'Completed',
                  startedAt: '2023-05-24T12:45:44Z',
                },
              },
              {
                container: 'step-merge-sboms',
                imageID:
                  'registry.access.redhat.com/ubi9/python-39@sha256:129f62f8306b325cb7873cf61c6fc4e614d88550f3d7fd030c1a930c57939472',
                name: 'merge-sboms',
                terminated: {
                  containerID:
                    'cri-o://2f42e095b0ece920504d85a3cfa0f496ed7c58aac2edae983a977fd67ebe0d3e',
                  exitCode: 0,
                  finishedAt: '2023-05-24T12:45:45Z',
                  message: '[{"key":"JAVA_COMMUNITY_DEPENDENCIES","value":"","type":1}]',
                  reason: 'Completed',
                  startedAt: '2023-05-24T12:45:45Z',
                },
              },
              {
                container: 'step-inject-sbom-and-push',
                imageID:
                  'registry.access.redhat.com/ubi9/buildah@sha256:c8b1d312815452964885680fc5bc8d99b3bfe9b6961228c71a09c72ca8e915eb',
                name: 'inject-sbom-and-push',
                terminated: {
                  containerID:
                    'cri-o://f00b7e0235d2bb1eb386af016f4bce5fa016c397c0300f5f6ad58a538d8f508e',
                  exitCode: 0,
                  finishedAt: '2023-05-24T12:46:14Z',
                  message:
                    '[{"key":"BASE_IMAGES_DIGESTS","value":"registry.access.redhat.com/ubi9/go-toolset:latest@sha256:a2bdd33c7fc0cda56eb3745e80820c1ee29efeaac720f7c52a59224a39003261\\n","type":1},{"key":"IMAGE_DIGEST","value":"sha256:8f7635ff791cbd71f572a19440e410e129af7b3b8b84da0c574b35dd14052b45","type":1},{"key":"IMAGE_URL","value":"quay.io/redhat-user-workloads/jephilli-tenant/test-application/devfile-sample-go-basic-a8bq:build-21392-1684932207","type":1},{"key":"JAVA_COMMUNITY_DEPENDENCIES","value":"","type":1}]',
                  reason: 'Completed',
                  startedAt: '2023-05-24T12:45:45Z',
                },
              },
              {
                container: 'step-upload-sbom',
                imageID:
                  'quay.io/redhat-appstudio/cosign@sha256:18b3716a6225727877475e1ab4f2493915e72cffd2ce431e9901d2ed2e4b2c0b',
                name: 'upload-sbom',
                terminated: {
                  containerID:
                    'cri-o://e068c4e68ca51730732c04919e17a26c3a52b7b3ce3bdefbc445fa7f89aee9ac',
                  exitCode: 0,
                  finishedAt: '2023-05-24T12:46:16Z',
                  message:
                    '[{"key":"BASE_IMAGES_DIGESTS","value":"registry.access.redhat.com/ubi9/go-toolset:latest@sha256:a2bdd33c7fc0cda56eb3745e80820c1ee29efeaac720f7c52a59224a39003261\\n","type":1},{"key":"IMAGE_DIGEST","value":"sha256:8f7635ff791cbd71f572a19440e410e129af7b3b8b84da0c574b35dd14052b45","type":1},{"key":"IMAGE_URL","value":"quay.io/redhat-user-workloads/jephilli-tenant/test-application/devfile-sample-go-basic-a8bq:build-21392-1684932207","type":1},{"key":"JAVA_COMMUNITY_DEPENDENCIES","value":"","type":1}]',
                  reason: 'Completed',
                  startedAt: '2023-05-24T12:46:14Z',
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
                  'registry.access.redhat.com/ubi9/go-toolset:latest@sha256:a2bdd33c7fc0cda56eb3745e80820c1ee29efeaac720f7c52a59224a39003261\n',
              },
              {
                name: 'IMAGE_DIGEST',
                type: 'string',
                value: 'sha256:8f7635ff791cbd71f572a19440e410e129af7b3b8b84da0c574b35dd14052b45',
              },
              {
                name: 'IMAGE_URL',
                type: 'string',
                value:
                  'quay.io/redhat-user-workloads/jephilli-tenant/test-application/devfile-sample-go-basic-a8bq:build-21392-1684932207',
              },
            ],
            taskSpec: {
              description:
                'Buildah task builds source code into a container image and pushes the image into container registry using buildah tool.\nIn addition it generates a SBOM file, injects the SBOM file into final container image and pushes the SBOM file as separate image using cosign tool.\nWhen [Java dependency rebuild](https://redhat-appstudio.github.io/docs.stonesoup.io/Documentation/main/cli/proc_enabled_java_dependencies.html) is enabled it triggers rebuilds of Java artifacts.\nWhen prefetch-dependencies task was activated it is using its artifacts to run build in hermetic environment.',
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
                {
                  default: '',
                  description:
                    'Delete image tag after specified time. Empty means to keep the image tag. Time values could be something like 1h, 2d, 3w for hours, days, and weeks, respectively.',
                  name: 'IMAGE_EXPIRES_AFTER',
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
                    'if [ -e "$CONTEXT/$DOCKERFILE" ]; then\n  dockerfile_path="$CONTEXT/$DOCKERFILE"\nelif [ -e "$DOCKERFILE" ]; then\n  dockerfile_path="$DOCKERFILE"\nelif echo "$DOCKERFILE" | grep -q "^https\\?://"; then\n  echo "Fetch Dockerfile from $DOCKERFILE"\n  dockerfile_path=$(mktemp --suffix=-Dockerfile)\n  http_code=$(curl -s -L -w "%{http_code}" --output "$dockerfile_path" "$DOCKERFILE")\n  if [ $http_code != 200 ]; then\n    echo "No Dockerfile is fetched. Server responds $http_code"\n    exit 1\n  fi\n  http_code=$(curl -s -L -w "%{http_code}" --output "$dockerfile_path.dockerignore.tmp" "$DOCKERFILE.dockerignore")\n  if [ $http_code = 200 ]; then\n    echo "Fetched .dockerignore from $DOCKERFILE.dockerignore"\n    mv "$dockerfile_path.dockerignore.tmp" $CONTEXT/.dockerignore\n  fi\nelse\n  echo "Cannot find Dockerfile $DOCKERFILE"\n  exit 1\nfi\nif [ -n "$JVM_BUILD_WORKSPACE_ARTIFACT_CACHE_PORT_80_TCP_ADDR" ] && grep -q \'^\\s*RUN \\(./\\)\\?mvn\' "$dockerfile_path"; then\n  sed -i -e "s|^\\s*RUN \\(\\(./\\)\\?mvn\\(.*\\)\\)|RUN echo \\"<settings><mirrors><mirror><id>mirror.default</id><url>http://$JVM_BUILD_WORKSPACE_ARTIFACT_CACHE_PORT_80_TCP_ADDR/v1/cache/default/0/</url><mirrorOf>*</mirrorOf></mirror></mirrors></settings>\\" > /tmp/settings.yaml; \\1 -s /tmp/settings.yaml|g" "$dockerfile_path"\n  touch /var/lib/containers/java\nfi\n\n\nsed -i \'s/^\\s*short-name-mode\\s*=\\s*.*/short-name-mode = "disabled"/\' /etc/containers/registries.conf\n\n# Setting new namespace to run buildah - 2^32-2\necho \'root:1:4294967294\' | tee -a /etc/subuid >> /etc/subgid\n\nif [ "${HERMETIC}" == "true" ]; then\n  BUILDAH_ARGS="--pull=never"\n  UNSHARE_ARGS="--net"\n  for image in $(grep -i \'^\\s*FROM\' "$dockerfile_path" | sed \'s/--platform=\\S*//\' | awk \'{print $2}\'); do\n    unshare -Ufp --keep-caps -r --map-users 1,1,65536 --map-groups 1,1,65536 -- buildah pull $image\n  done\n  echo "Build will be executed with network isolation"\nfi\n\nif [ -n "${PREFETCH_INPUT}" ]; then\n  mv cachi2 /tmp/\n  chmod -R go+rwX /tmp/cachi2\n  VOLUME_MOUNTS="--volume /tmp/cachi2:/cachi2"\n  sed -i \'s|^\\s*run |RUN . /cachi2/cachi2.env \\&\\& \\\\\\n    |i\' "$dockerfile_path"\n  echo "Prefetched content will be made available"\nfi\n\n[ -n "$IMAGE_EXPIRES_AFTER" ] && LABELS="--label quay.expires-after=$IMAGE_EXPIRES_AFTER"\nunshare -Uf $UNSHARE_ARGS --keep-caps -r --map-users 1,1,65536 --map-groups 1,1,65536 -- buildah build \\\n  $VOLUME_MOUNTS \\\n  $BUILDAH_ARGS \\\n  $LABELS \\\n  --tls-verify=$TLSVERIFY --no-cache \\\n  --ulimit nofile=4096:4096 \\\n  -f "$dockerfile_path" -t $IMAGE $CONTEXT\n\ncontainer=$(buildah from --pull-never $IMAGE)\nbuildah mount $container | tee /workspace/container_path\necho $container > /workspace/container_name\n',
                },
                {
                  image: 'quay.io/redhat-appstudio/syft:v0.47.0',
                  name: 'sbom-get',
                  resources: {},
                  script:
                    'syft dir:/workspace/source --file=/workspace/source/sbom-source.json --output=cyclonedx-json\nfind $(cat /workspace/container_path) -xtype l -delete\nsyft dir:$(cat /workspace/container_path) --file=/workspace/source/sbom-image.json --output=cyclonedx-json\n',
                },
                {
                  image:
                    'quay.io/redhat-appstudio/hacbs-jvm-build-request-processor:1d417e6f1f3e68c6c537333b5759796eddae0afc',
                  name: 'analyse-dependencies-java-sbom',
                  resources: {},
                  script:
                    "if [ -f /var/lib/containers/java ]; then\n  /opt/jboss/container/java/run/run-java.sh analyse-dependencies path $(cat /workspace/container_path) -s /workspace/source/sbom-image.json --task-run-name devfile-sample-go-basic-a8bq-llf8v-build-container --publishers /tekton/results/SBOM_JAVA_COMPONENTS_COUNT\n  sed -i 's/^/ /' /tekton/results/SBOM_JAVA_COMPONENTS_COUNT # Workaround for SRVKP-2875\nelse\n  touch /tekton/results/JAVA_COMMUNITY_DEPENDENCIES\nfi\n",
                },
                {
                  image: 'registry.access.redhat.com/ubi9/python-39:1-114.1681379027',
                  name: 'merge-sboms',
                  resources: {},
                  script:
                    '#!/bin/python3\nimport json\nimport os\n\n# load SBOMs\nwith open("./sbom-image.json") as f:\n  image_sbom = json.load(f)\n\nwith open("./sbom-source.json") as f:\n  source_sbom = json.load(f)\n\n# fetch unique components from available SBOMs\ndef get_identifier(component):\n  return component["name"] + \'@\' + component.get("version", "")\n\nexisting_components = [get_identifier(component) for component in image_sbom["components"]]\n\nfor component in source_sbom["components"]:\n  if get_identifier(component) not in existing_components:\n    image_sbom["components"].append(component)\n    existing_components.append(get_identifier(component))\n\nimage_sbom["components"].sort(key=lambda c: get_identifier(c))\n\n# write the CycloneDX unified SBOM\nwith open("./sbom-cyclonedx.json", "w") as f:\n  json.dump(image_sbom, f, indent=4)\n\n# create and write the PURL unified SBOM\npurls = [{"purl": component["purl"]} for component in image_sbom["components"] if "purl" in component]\npurl_content = {"image_contents": {"dependencies": purls}}\n\nwith open("sbom-purl.json", "w") as output_file:\n  json.dump(purl_content, output_file, indent=4)\n',
                },
                {
                  image:
                    'registry.access.redhat.com/ubi9/buildah:9.0.0-19@sha256:c8b1d312815452964885680fc5bc8d99b3bfe9b6961228c71a09c72ca8e915eb',
                  name: 'inject-sbom-and-push',
                  resources: {},
                  script:
                    '# Expose base image digests\nbuildah images --format \'{{ .Name }}:{{ .Tag }}@{{ .Digest }}\' | grep -v $IMAGE > /tekton/results/BASE_IMAGES_DIGESTS\n\nbase_image_name=$(buildah inspect --format \'{{ index .ImageAnnotations "org.opencontainers.image.base.name"}}\' $IMAGE)\nbase_image_digest=$(buildah inspect --format \'{{ index .ImageAnnotations "org.opencontainers.image.base.digest"}}\' $IMAGE)\ncontainer=$(buildah from --pull-never $IMAGE)\nbuildah copy $container sbom-cyclonedx.json sbom-purl.json /root/buildinfo/content_manifests/\nbuildah config -a org.opencontainers.image.base.name=${base_image_name} -a org.opencontainers.image.base.digest=${base_image_digest} $container\nbuildah commit $container $IMAGE\nbuildah push \\\n  --tls-verify=$TLSVERIFY \\\n  --digestfile /workspace/source/image-digest $IMAGE \\\n  docker://$IMAGE\ncat "/workspace/source"/image-digest | tee /tekton/results/IMAGE_DIGEST\necho -n "$IMAGE" | tee /tekton/results/IMAGE_URL\n',
                },
                {
                  args: [
                    'attach',
                    'sbom',
                    '--sbom',
                    'sbom-cyclonedx.json',
                    '--type',
                    'cyclonedx',
                    'quay.io/redhat-user-workloads/jephilli-tenant/test-application/devfile-sample-go-basic-a8bq:build-21392-1684932207',
                  ],
                  image: 'quay.io/redhat-appstudio/cosign:v1.13.1',
                  name: 'upload-sbom',
                  resources: {},
                },
              ],
            },
          },
        },
        'devfile-sample-go-basic-a8bq-llf8v-clone-repository': {
          pipelineTaskName: 'clone-repository',
          status: {
            completionTime: '2023-05-24T12:43:53Z',
            conditions: [
              {
                lastTransitionTime: '2023-05-24T12:43:53Z',
                message: 'All Steps have completed executing',
                reason: 'Succeeded',
                status: 'True',
                type: 'Succeeded',
              },
            ],
            podName: 'devfile-sample-go-basic-a8bq-llf8v-clone-repository-pod',
            startTime: '2023-05-24T12:43:40Z',
            steps: [
              {
                container: 'step-clone',
                imageID:
                  'registry.redhat.io/openshift-pipelines/pipelines-git-init-rhel8@sha256:2fa0b06d52b04f377c696412e19307a9eff27383f81d87aae0b4f71672a1cd0b',
                name: 'clone',
                terminated: {
                  containerID:
                    'cri-o://3d899bb5112ae4e383f3dc5dca2b1fa7e14bd5c322f45fd57f3463fe381b7aad',
                  exitCode: 0,
                  finishedAt: '2023-05-24T12:43:52Z',
                  message:
                    '[{"key":"commit","value":"d1ac676fb7e6d06b634bb68239b9dccc035c3b38","type":1},{"key":"url","value":"https://github.com/jeff-phillips-18/devfile-sample-go-basic.git","type":1}]',
                  reason: 'Completed',
                  startedAt: '2023-05-24T12:43:52Z',
                },
              },
            ],
            taskResults: [
              {
                name: 'commit',
                type: 'string',
                value: 'd1ac676fb7e6d06b634bb68239b9dccc035c3b38',
              },
              {
                name: 'url',
                type: 'string',
                value: 'https://github.com/jeff-phillips-18/devfile-sample-go-basic.git',
              },
            ],
            taskSpec: {
              description:
                'The git-clone Task will clone a repo from the provided url into the output Workspace. By default the repo will be cloned into the root of your Workspace.',
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
                      value: 'https://github.com/jeff-phillips-18/devfile-sample-go-basic.git',
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
                      name: 'PARAM_DELETE_EXISTING',
                      value: 'true',
                    },
                    {
                      name: 'PARAM_VERBOSE',
                      value: 'true',
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
                      name: 'WORKSPACE_BASIC_AUTH_DIRECTORY_BOUND',
                      value: 'false',
                    },
                  ],
                  image:
                    'registry.redhat.io/openshift-pipelines/pipelines-git-init-rhel8:v1.8.2-8@sha256:a538c423e7a11aae6ae582a411fdb090936458075f99af4ce5add038bb6983e8',
                  name: 'clone',
                  resources: {},
                  script:
                    '#!/usr/bin/env sh\nset -eu\n\nif [ "${PARAM_VERBOSE}" = "true" ] ; then\n  set -x\nfi\n\nif [ "${WORKSPACE_BASIC_AUTH_DIRECTORY_BOUND}" = "true" ] ; then\n  cp "${WORKSPACE_BASIC_AUTH_DIRECTORY_PATH}/.git-credentials" "${PARAM_USER_HOME}/.git-credentials"\n  cp "${WORKSPACE_BASIC_AUTH_DIRECTORY_PATH}/.gitconfig" "${PARAM_USER_HOME}/.gitconfig"\n  chmod 400 "${PARAM_USER_HOME}/.git-credentials"\n  chmod 400 "${PARAM_USER_HOME}/.gitconfig"\nfi\n\nif [ "${WORKSPACE_SSH_DIRECTORY_BOUND}" = "true" ] ; then\n  cp -R "${WORKSPACE_SSH_DIRECTORY_PATH}" "${PARAM_USER_HOME}"/.ssh\n  chmod 700 "${PARAM_USER_HOME}"/.ssh\n  chmod -R 400 "${PARAM_USER_HOME}"/.ssh/*\nfi\n\nCHECKOUT_DIR="${WORKSPACE_OUTPUT_PATH}/${PARAM_SUBDIRECTORY}"\n\ncleandir() {\n  # Delete any existing contents of the repo directory if it exists.\n  #\n  # We don\'t just "rm -rf ${CHECKOUT_DIR}" because ${CHECKOUT_DIR} might be "/"\n  # or the root of a mounted volume.\n  if [ -d "${CHECKOUT_DIR}" ] ; then\n    # Delete non-hidden files and directories\n    rm -rf "${CHECKOUT_DIR:?}"/*\n    # Delete files and directories starting with . but excluding ..\n    rm -rf "${CHECKOUT_DIR}"/.[!.]*\n    # Delete files and directories starting with .. plus any other character\n    rm -rf "${CHECKOUT_DIR}"/..?*\n  fi\n}\n\nif [ "${PARAM_DELETE_EXISTING}" = "true" ] ; then\n  cleandir\nfi\n\ntest -z "${PARAM_HTTP_PROXY}" || export HTTP_PROXY="${PARAM_HTTP_PROXY}"\ntest -z "${PARAM_HTTPS_PROXY}" || export HTTPS_PROXY="${PARAM_HTTPS_PROXY}"\ntest -z "${PARAM_NO_PROXY}" || export NO_PROXY="${PARAM_NO_PROXY}"\n\n/ko-app/git-init \\\n  -url="${PARAM_URL}" \\\n  -revision="${PARAM_REVISION}" \\\n  -refspec="${PARAM_REFSPEC}" \\\n  -path="${CHECKOUT_DIR}" \\\n  -sslVerify="${PARAM_SSL_VERIFY}" \\\n  -submodules="${PARAM_SUBMODULES}" \\\n  -depth="${PARAM_DEPTH}" \\\n  -sparseCheckoutDirectories="${PARAM_SPARSE_CHECKOUT_DIRECTORIES}"\ncd "${CHECKOUT_DIR}"\nRESULT_SHA="$(git rev-parse HEAD)"\nEXIT_CODE="$?"\nif [ "${EXIT_CODE}" != 0 ] ; then\n  exit "${EXIT_CODE}"\nfi\nprintf "%s" "${RESULT_SHA}" > "/tekton/results/commit"\nprintf "%s" "${PARAM_URL}" > "/tekton/results/url"\n',
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
        'devfile-sample-go-basic-a8bq-llf8v-init': {
          pipelineTaskName: 'init',
          status: {
            completionTime: '2023-05-24T12:43:35Z',
            conditions: [
              {
                lastTransitionTime: '2023-05-24T12:43:35Z',
                message: 'All Steps have completed executing',
                reason: 'Succeeded',
                status: 'True',
                type: 'Succeeded',
              },
            ],
            podName: 'devfile-sample-go-basic-a8bq-llf8v-init-pod',
            startTime: '2023-05-24T12:43:29Z',
            steps: [
              {
                container: 'step-init',
                imageID:
                  'registry.redhat.io/openshift4/ose-tools-rhel8@sha256:4d89da145a14501b049397dc723a2b5feba1f2238c9f71659c9512bd27ca4e95',
                name: 'init',
                terminated: {
                  containerID:
                    'cri-o://cce30276691c252960f7efe861f1bb5b99dee9ac071b9e72a64aa641ff4c480a',
                  exitCode: 0,
                  finishedAt: '2023-05-24T12:43:35Z',
                  message:
                    '[{"key":"build","value":"true","type":1},{"key":"container-registry-secret","value":"devfile-sample-go-basic-a8bq-llf8v","type":1}]',
                  reason: 'Completed',
                  startedAt: '2023-05-24T12:43:35Z',
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
                value: 'devfile-sample-go-basic-a8bq-llf8v',
              },
            ],
            taskSpec: {
              description:
                'Initialize Pipeline Task, include flags for rebuild and auth. Generates image repository secret used by the PipelineRun.',
              params: [
                {
                  description: 'Image URL for build by PipelineRun',
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
                  description: 'Skip checks against built image',
                  name: 'skip-checks',
                  type: 'string',
                },
                {
                  default: 'true',
                  description: 'Skip optional checks, set false if you want to run optional checks',
                  name: 'skip-optional',
                  type: 'string',
                },
                {
                  description:
                    'Name of current pipelinerun, should be "$(context.pipelineRun.name)"',
                  name: 'pipelinerun-name',
                  type: 'string',
                },
                {
                  description: 'UID of current pipelinerun, should be "$(context.pipelineRun.uid)"',
                  name: 'pipelinerun-uid',
                  type: 'string',
                },
                {
                  default: 'redhat-appstudio-user-workload',
                  description:
                    'Shared resource secret for accessing user-workload image repository',
                  name: 'shared-secret',
                  type: 'string',
                },
              ],
              results: [
                {
                  description: 'Defines if the image in param image-url should be built',
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
                      value: 'devfile-sample-go-basic-a8bq-llf8v',
                    },
                    {
                      name: 'PIPELINERUN_UID',
                      value: '741e7a60-c41a-455b-9f5c-03f54d1ab002',
                    },
                    {
                      name: 'IMAGE_URL',
                      value:
                        'quay.io/redhat-user-workloads/jephilli-tenant/test-application/devfile-sample-go-basic-a8bq:build-21392-1684932207',
                    },
                    {
                      name: 'REBUILD',
                      value: 'false',
                    },
                    {
                      name: 'SKIP_CHECKS',
                      value: 'true',
                    },
                    {
                      name: 'SKIP_OPTIONAL',
                      value: 'true',
                    },
                  ],
                  image:
                    'registry.redhat.io/openshift4/ose-tools-rhel8:v4.12@sha256:4d89da145a14501b049397dc723a2b5feba1f2238c9f71659c9512bd27ca4e95',
                  name: 'init',
                  resources: {},
                  script:
                    '#!/bin/bash\necho "Build Initialize: $IMAGE_URL"\necho\necho "Create pipelinerun repository secret"\nSHARED=/secret/default-push-secret/.dockerconfigjson\nexport DOCKER_CONFIG=/tmp/docker/\nmkdir -p $DOCKER_CONFIG\nif [ -f $SHARED ]; then\n  jq -M -s \'.[0] * .[1]\' $SHARED /root/.docker/config.json > $DOCKER_CONFIG/config.json\nelse\n  cp /root/.docker/config.json $DOCKER_CONFIG/config.json\nfi\noc create secret generic --from-file=$DOCKER_CONFIG/config.json $SHARED_PARAM $PIPELINERUN_NAME\noc patch secret $PIPELINERUN_NAME -p "{\\"metadata\\": {\\"ownerReferences\\": [{\\"apiVersion\\": \\"tekton.dev/v1beta1\\", \\"blockOwnerDeletion\\": false, \\"controller\\": true, \\"kind\\": \\"PipelineRun\\", \\"name\\": \\"$PIPELINERUN_NAME\\", \\"uid\\": \\"$PIPELINERUN_UID\\" }]}}"\necho -n $PIPELINERUN_NAME > /tekton/results/container-registry-secret\n\necho "Determine if Image Already Exists"\n# Build the image when image does not exists or rebuild is set to true\nif ! oc image info $IMAGE_URL &>/dev/null || [ "$REBUILD" == "true" ] || [ "$SKIP_CHECKS" == "false" ]; then\n  echo -n "true" > /tekton/results/build\nelse\n  echo -n "false" > /tekton/results/build\nfi\n',
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
        'devfile-sample-go-basic-a8bq-llf8v-show-sbom': {
          pipelineTaskName: 'show-sbom',
          status: {
            completionTime: '2023-05-24T12:46:26Z',
            conditions: [
              {
                lastTransitionTime: '2023-05-24T12:46:26Z',
                message: 'All Steps have completed executing',
                reason: 'Succeeded',
                status: 'True',
                type: 'Succeeded',
              },
            ],
            podName: 'devfile-sample-go-basic-a8bq-llf8v-show-sbom-pod',
            startTime: '2023-05-24T12:46:21Z',
            steps: [
              {
                container: 'step-show-sbom',
                imageID:
                  'quay.io/redhat-appstudio/cosign@sha256:18b3716a6225727877475e1ab4f2493915e72cffd2ce431e9901d2ed2e4b2c0b',
                name: 'show-sbom',
                terminated: {
                  containerID:
                    'cri-o://2d29d9c4d5e85e5c3a4cd58e8841117302d6de5b6894751813138772408281f0',
                  exitCode: 0,
                  finishedAt: '2023-05-24T12:46:26Z',
                  reason: 'Completed',
                  startedAt: '2023-05-24T12:46:26Z',
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
                    'cosign download sbom quay.io/redhat-user-workloads/jephilli-tenant/test-application/devfile-sample-go-basic-a8bq:build-21392-1684932207 2>/dev/null',
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
        'devfile-sample-go-basic-a8bq-llf8v-show-summary': {
          pipelineTaskName: 'show-summary',
          status: {
            completionTime: '2023-05-24T12:46:28Z',
            conditions: [
              {
                lastTransitionTime: '2023-05-24T12:46:28Z',
                message: 'All Steps have completed executing',
                reason: 'Succeeded',
                status: 'True',
                type: 'Succeeded',
              },
            ],
            podName: 'devfile-sample-go-basic-a8bq-llf8v-show-summary-pod',
            startTime: '2023-05-24T12:46:21Z',
            steps: [
              {
                container: 'step-appstudio-summary',
                imageID:
                  'quay.io/openshift-release-dev/ocp-v4.0-art-dev@sha256:9f0cdc00b1b1a3c17411e50653253b9f6bb5329ea4fb82ad983790a6dbf2d9ad',
                name: 'appstudio-summary',
                terminated: {
                  containerID:
                    'cri-o://cfe00b8d5c4984fd734aa69aca6dd3b9f48742b79ea310e5d56217d74376e0ed',
                  exitCode: 0,
                  finishedAt: '2023-05-24T12:46:28Z',
                  reason: 'Completed',
                  startedAt: '2023-05-24T12:46:27Z',
                },
              },
            ],
            taskSpec: {
              description:
                'Summary Pipeline Task. Prints PipelineRun information, removes image repository secret used by the PipelineRun.',
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
                        'https://github.com/jeff-phillips-18/devfile-sample-go-basic.git?rev=d1ac676fb7e6d06b634bb68239b9dccc035c3b38',
                    },
                    {
                      name: 'IMAGE_URL',
                      value:
                        'quay.io/redhat-user-workloads/jephilli-tenant/test-application/devfile-sample-go-basic-a8bq:build-21392-1684932207',
                    },
                    {
                      name: 'PIPELINERUN_NAME',
                      value: 'devfile-sample-go-basic-a8bq-llf8v',
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
      },
      startTime: '2023-06-18T12:43:27Z',
      pipelineResults: [
        {
          name: 'IMAGE_URL',
          value:
            'quay.io/redhat-user-workloads/jephilli-tenant/test-application/devfile-sample-go-basic-a8bq:build-21392-1684932207',
        },
        {
          name: 'IMAGE_DIGEST',
          value: 'sha256:8f7635ff791cbd71f572a19440e410e129af7b3b8b84da0c574b35dd14052b45',
        },
        {
          name: 'CHAINS-GIT_URL',
          value: 'https://github.com/jeff-phillips-18/devfile-sample-go-basic.git',
        },
        {
          name: 'CHAINS-GIT_COMMIT',
          value: 'd1ac676fb7e6d06b634bb68239b9dccc035c3b38',
        },
        {
          name: 'JAVA_COMMUNITY_DEPENDENCIES',
          value: '',
        },
      ],
      conditions: [
        {
          lastTransitionTime: '2023-05-24T12:46:30Z',
          message: 'Tasks Completed: 5 (Failed: 0, Cancelled 0), Skipped: 9',
          reason: 'Completed',
          status: 'True',
          type: 'Succeeded',
        },
      ],
      pipelineSpec: {
        finally: [
          {
            name: 'show-sbom',
            params: [
              {
                name: 'IMAGE_URL',
                value: '$(tasks.build-container.results.IMAGE_URL)',
              },
            ],
            taskRef: {
              bundle:
                'quay.io/redhat-appstudio-tekton-catalog/task-show-sbom:0.1@sha256:050bab50254e0377c68d63b6b679decfc655e30cad9ce4b0407fc8468852008d',
              kind: 'Task',
              name: 'show-sbom',
            },
          },
          {
            name: 'show-summary',
            params: [
              {
                name: 'pipelinerun-name',
                value: 'devfile-sample-go-basic-a8bq-llf8v',
              },
              {
                name: 'git-url',
                value:
                  '$(tasks.clone-repository.results.url)?rev=$(tasks.clone-repository.results.commit)',
              },
              {
                name: 'image-url',
                value:
                  'quay.io/redhat-user-workloads/jephilli-tenant/test-application/devfile-sample-go-basic-a8bq:build-21392-1684932207',
              },
              {
                name: 'build-task-status',
                value: '$(tasks.build-container.status)',
              },
            ],
            taskRef: {
              bundle:
                'quay.io/redhat-appstudio-tekton-catalog/task-summary:0.1@sha256:9e21e57456c026c15765db23b986e47fc1394fa5d4823d3038b697971dd1a2bd',
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
            default: 'true',
            description: 'Skip optional checks, set false if you want to run optional checks',
            name: 'skip-optional',
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
          {
            default: '',
            description:
              'Image tag expiration time, time values could be something like 1h, 2d, 3w for hours, days, and weeks, respectively.',
            name: 'image-expires-after',
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
                  'quay.io/redhat-user-workloads/jephilli-tenant/test-application/devfile-sample-go-basic-a8bq:build-21392-1684932207',
              },
              {
                name: 'rebuild',
                value: 'false',
              },
              {
                name: 'skip-checks',
                value: 'true',
              },
              {
                name: 'skip-optional',
                value: 'true',
              },
              {
                name: 'pipelinerun-name',
                value: 'devfile-sample-go-basic-a8bq-llf8v',
              },
              {
                name: 'pipelinerun-uid',
                value: '741e7a60-c41a-455b-9f5c-03f54d1ab002',
              },
            ],
            taskRef: {
              bundle:
                'quay.io/redhat-appstudio-tekton-catalog/task-init:0.1@sha256:0eb72d475b171056373384d99dffc9e331264e7f181e50b20e337457d5b87857',
              kind: 'Task',
              name: 'init',
            },
          },
          {
            name: 'clone-repository',
            params: [
              {
                name: 'url',
                value: 'https://github.com/jeff-phillips-18/devfile-sample-go-basic.git',
              },
              {
                name: 'revision',
                value: '',
              },
            ],
            runAfter: ['init'],
            taskRef: {
              bundle:
                'quay.io/redhat-appstudio-tekton-catalog/task-git-clone:0.1@sha256:458f4853a01c3273bd76076ac1b015d5f901e70fb4b776f788b577adb25bf5f8',
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
                'quay.io/redhat-appstudio-tekton-catalog/task-prefetch-dependencies:0.1@sha256:a7f4bb77c2e3949fa782f45c8ac9aa7f91cdde45dbc8ad408770eb902d830a0a',
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
                  'quay.io/redhat-user-workloads/jephilli-tenant/test-application/devfile-sample-go-basic-a8bq:build-21392-1684932207',
              },
              {
                name: 'DOCKERFILE',
                value: 'docker/Dockerfile',
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
              {
                name: 'IMAGE_EXPIRES_AFTER',
                value: '',
              },
            ],
            runAfter: ['prefetch-dependencies'],
            taskRef: {
              bundle:
                'quay.io/redhat-appstudio-tekton-catalog/task-buildah:0.1@sha256:0852e61c1018d7f7a47ac2bd63fbda1d3d2247392624c2176ec341e343386b7c',
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
            name: 'inspect-image',
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
                'quay.io/redhat-appstudio-tekton-catalog/task-inspect-image:0.1@sha256:f7f3f86256f12d151463133d6c4ffc667087a87281ff2bc67c53c29f6463cd99',
              kind: 'Task',
              name: 'inspect-image',
            },
            when: [
              {
                input: 'true',
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
            name: 'label-check',
            runAfter: ['inspect-image'],
            taskRef: {
              bundle:
                'quay.io/redhat-appstudio-tekton-catalog/task-label-check:0.1@sha256:76dee4b8c534986f98ab7d6e89aea14582faf0f1128a09a7f058a4f059d0fcf0',
              kind: 'Task',
              name: 'label-check',
            },
            when: [
              {
                input: 'true',
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
            name: 'optional-label-check',
            params: [
              {
                name: 'POLICY_NAMESPACE',
                value: 'optional_checks',
              },
            ],
            runAfter: ['inspect-image'],
            taskRef: {
              bundle:
                'quay.io/redhat-appstudio-tekton-catalog/task-label-check:0.1@sha256:76dee4b8c534986f98ab7d6e89aea14582faf0f1128a09a7f058a4f059d0fcf0',
              kind: 'Task',
              name: 'label-check',
            },
            when: [
              {
                input: 'true',
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
                'quay.io/redhat-appstudio-tekton-catalog/task-deprecated-image-check:0.2@sha256:f6ad9c9b2a019d28e712287cf3cb5fe42df3078a02af0db75f0e76e6060063ca',
              kind: 'Task',
              name: 'deprecated-image-check',
            },
            when: [
              {
                input: 'true',
                operator: 'in',
                values: ['false'],
              },
            ],
            workspaces: [
              {
                name: 'test-ws',
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
                'quay.io/redhat-appstudio-tekton-catalog/task-clair-scan:0.1@sha256:e654ebb13c0b6d98cde388dfd33e258b7368eea5a5a37f3b2edfef7a3e23ffc2',
              kind: 'Task',
              name: 'clair-scan',
            },
            when: [
              {
                input: 'true',
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
                'quay.io/redhat-appstudio-tekton-catalog/task-sast-snyk-check:0.1@sha256:1bafbb8bb1f41985be67a622080b022d2a6ff8b51b606f7002069df7e79d0cff',
              kind: 'Task',
              name: 'sast-snyk-check',
            },
            when: [
              {
                input: 'true',
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
                'quay.io/redhat-appstudio-tekton-catalog/task-clamav-scan:0.1@sha256:2317e03a1bc713cbfb1f7ad40b3bec587f00ec55ca6a6ae2fc33f921908c6d96',
              kind: 'Task',
              name: 'clamav-scan',
            },
            when: [
              {
                input: 'true',
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
                'quay.io/redhat-appstudio-tekton-catalog/task-sbom-json-check:0.1@sha256:3fe90c210a4df9c98d5a32a2eeeaa36ca4a5c8a199d56b512076ffca9d3db483',
              kind: 'Task',
              name: 'sbom-json-check',
            },
            when: [
              {
                input: 'true',
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
          name: 'inspect-image',
          reason: 'When Expressions evaluated to false',
          whenExpressions: [
            {
              input: 'true',
              operator: 'in',
              values: ['false'],
            },
          ],
        },
        {
          name: 'label-check',
          reason: 'When Expressions evaluated to false',
          whenExpressions: [
            {
              input: 'true',
              operator: 'in',
              values: ['false'],
            },
          ],
        },
        {
          name: 'optional-label-check',
          reason: 'When Expressions evaluated to false',
          whenExpressions: [
            {
              input: 'true',
              operator: 'in',
              values: ['false'],
            },
          ],
        },
        {
          name: 'deprecated-base-image-check',
          reason: 'When Expressions evaluated to false',
          whenExpressions: [
            {
              input: 'true',
              operator: 'in',
              values: ['false'],
            },
          ],
        },
        {
          name: 'clair-scan',
          reason: 'When Expressions evaluated to false',
          whenExpressions: [
            {
              input: 'true',
              operator: 'in',
              values: ['false'],
            },
          ],
        },
        {
          name: 'sast-snyk-check',
          reason: 'When Expressions evaluated to false',
          whenExpressions: [
            {
              input: 'true',
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
        {
          name: 'clamav-scan',
          reason: 'When Expressions evaluated to false',
          whenExpressions: [
            {
              input: 'true',
              operator: 'in',
              values: ['false'],
            },
          ],
        },
        {
          name: 'sbom-json-check',
          reason: 'When Expressions evaluated to false',
          whenExpressions: [
            {
              input: 'true',
              operator: 'in',
              values: ['false'],
            },
          ],
        },
      ],
    },
  },
  {
    apiVersion: 'tekton.dev/v1beta1',
    kind: 'PipelineRun',
    apiGroup: 'tekton.dev',
    metadata: {
      annotations: {
        'build.appstudio.openshift.io/image':
          'quay.io/redhat-appstudio/user-workload:test-nodejs-sample',
        'build.appstudio.openshift.io/repo':
          'https://github.com/nodeshift-starters/devfile-sample.git',
        'chains.tekton.dev/retries': '3',
        'chains.tekton.dev/signed': 'failed',
        'chains.tekton.dev/transparency':
          'https://rekor.sigstore.dev/api/v1/log/entries?logIndex=2717932',
        'pipelinesascode.tekton.dev/sha-url':
          'https://github.com/devfile-samples/devfile-sample-java-springboot-basic',
        'results.tekton.dev/result': 'test/results/358168a2-e2f1-4fc6-90a5-90ad80079e17',
      },
      creationTimestamp: '2022-06-20T12:47:24Z',
      generateName: 'nodejs-sample-',
      generation: 1,
      labels: {
        'appstudio.openshift.io/application': 'purple-mermaid-app',
        'build.appstudio.openshift.io/build': 'true',
        'build.appstudio.openshift.io/type': 'build',
        'build.appstudio.openshift.io/version': '0.1',
        'pipelines.appstudio.openshift.io/type': 'build',
        'pipelines.openshift.io/runtime': 'generic',
        'pipelines.openshift.io/strategy': 'docker',
        'pipelines.openshift.io/used-by': 'build-cloud',
        'tekton.dev/pipeline': 'docker-build',
        'appstudio.openshift.io/component': 'sample-component',
        'build.appstudio.redhat.com/user': 'abhi',
      },
      name: 'nodejs-sample-zth6t',
      namespace: 'test',
      ownerReferences: [
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          kind: 'Component',
          name: 'nodejs-sample',
          uid: '85cf4351-2cce-4816-9bd3-d04f8c6a98b8',
        },
      ],
      resourceVersion: '644928943',
      uid: '358168a2-e2f1-4fc6-90a5-90ad80079e17',
    },
    status: {
      pipelineSpec: null,
      completionTime: '2022-06-20T12:49:27Z',
      conditions: [
        {
          lastTransitionTime: '2022-06-20T12:49:27Z',
          message: 'Tasks Completed: 5 (Failed: 0, Cancelled 0), Skipped: 0',
          reason: 'Succeeded',
          status: 'True',
          type: 'Succeeded',
        },
      ],
      startTime: '2022-06-20T12:47:26Z',
    },
    spec: {},
  },
  {
    apiVersion: 'tekton.dev/v1beta1',
    kind: 'PipelineRun',
    apiGroup: 'tekton.dev',
    metadata: {
      annotations: {
        'build.appstudio.openshift.io/image':
          'quay.io/redhat-appstudio/user-workload:test-nodejs-sample',
        'build.appstudio.openshift.io/repo':
          'https://github.com/nodeshift-starters/devfile-sample.git',
        'chains.tekton.dev/retries': '3',
        'chains.tekton.dev/signed': 'failed',
        'chains.tekton.dev/transparency':
          'https://rekor.sigstore.dev/api/v1/log/entries?logIndex=2717932',
        'results.tekton.dev/record':
          'test/results/358168a2-e2f1-4fc6-90a5-90ad80079e17/records/358168a2-e2f1-4fc6-90a5-90ad80079e17',
        'results.tekton.dev/result': 'test/results/358168a2-e2f1-4fc6-90a5-90ad80079e17',
        'build.appstudio.redhat.com/commit_sha': 'commit14rt',
        'build.appstudio.redhat.com/target_branch': 'branch_b',
        'appstudio.openshift.io/component': 'sample-component',
        'pipelinesascode.tekton.dev/sha-url':
          'https://github.com/devfile-samples/devfile-sample-java-springboot-basic',
      },
      creationTimestamp: '2022-06-20T12:47:24Z',
      generateName: 'nodejs-sample-',
      generation: 1,
      labels: {
        'appstudio.openshift.io/application': 'purple-mermaid-app',
        'build.appstudio.openshift.io/build': 'true',
        'appstudio.openshift.io/component': 'sample-component',
        'pipelinesascode.tekton.dev/sender': 'abhinandan13jan',
        'pipelinesascode.tekton.dev/sha': 'commit14rt',
        'pipelinesascode.tekton.dev/url-org': 'openshift',
        'build.appstudio.redhat.com/url-repository': 'console',
        'pipelinesascode.tekton.dev/git-provider': 'github',
      },
      name: 'nodejs-sample-zth6t',
      namespace: 'test',
      ownerReferences: [
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          kind: 'Component',
          name: 'nodejs-sample',
          uid: '85cf4351-2cce-4816-9bd3-d04f8c6a98b8',
        },
      ],
      resourceVersion: '644928943',
      uid: '358168a2-e2f1-4fc6-90a5-90ad80079e17',
    },
    spec: {
      params: [
        {
          name: 'git-url',
          value: 'https://github.com/nodeshift-starters/devfile-sample.git',
        },
        {
          name: 'output-image',
          value: 'quay.io/redhat-appstudio/user-workload:test-nodejs-sample',
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
          'quay.io/redhat-appstudio/build-templates-bundle:ab259a6fef091698b0fc145537338fa78f521c1f',
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
          subPath: 'nodejs-sample/initialbuild-2022-Jun-20_12-47-24',
        },
      ],
    },
    status: {
      pipelineSpec: null,
      completionTime: '2022-06-20T12:49:27Z',
      conditions: [
        {
          lastTransitionTime: '2022-06-20T12:49:27Z',
          message: 'Tasks Completed: 5 (Failed: 0, Cancelled 0), Skipped: 0',
          reason: 'Succeeded',
          status: 'True',
          type: 'Succeeded',
        },
      ],
      startTime: '2022-06-20T12:47:26Z',
    },
  },
  {
    apiVersion: 'tekton.dev/v1beta1',
    kind: 'PipelineRun',
    apiGroup: 'tekton.dev',
    metadata: {
      name: 'nodejs-sample',
      annotations: {
        'build.appstudio.openshift.io/image':
          'quay.io/redhat-appstudio/user-workload:test-nodejs-sample',
        'build.appstudio.redhat.com/commit_sha': 'commit123',
        'build.appstudio.redhat.com/target_branch': 'branch_1',
        'pipelinesascode.tekton.dev/sha-url':
          'https://github.com/devfile-samples/devfile-sample-java-springboot-basic',
        'build.appstudio.redhat.com/sha_url': 'https://github.com/openshift/console',
      },
      creationTimestamp: '2022-06-20T12:47:24Z',
      generateName: 'nodejs-sample-',
      generation: 1,
      labels: {
        'appstudio.openshift.io/application': 'purple-mermaid-app',
        'build.appstudio.openshift.io/build': 'true',
        'appstudio.openshift.io/component': 'sample-component',
        'pipelinesascode.tekton.dev/sender': 'abhi',
        'pipelinesascode.tekton.dev/sha': 'commit123',
        'pipelinesascode.tekton.dev/url-org': 'openshift',
        'build.appstudio.redhat.com/url-repository': 'console',
        'pipelinesascode.tekton.dev/git-provider': 'github',
      },
    },
    spec: {},
    status: {
      pipelineSpec: null,
      conditions: [
        {
          reason: 'Completed',
          status: 'True',
          type: 'Succeeded',
        },
      ],
      startTime: '2022-08-20T10:47:26Z',
    },
  },
  {
    apiVersion: 'tekton.dev/v1beta1',
    kind: 'PipelineRun',
    apiGroup: 'tekton.dev',
    metadata: {
      annotations: {
        'build.appstudio.openshift.io/image':
          'quay.io/redhat-appstudio/user-workload:test-nodejs-sample',
        'build.appstudio.redhat.com/commit_sha': 'commit123',
        'build.appstudio.redhat.com/target_branch': 'branch_1',
        'pipelinesascode.tekton.dev/sha-url':
          'https://github.com/devfile-samples/devfile-sample-java-springboot-basic',
      },
      creationTimestamp: '2022-06-20T12:47:24Z',
      name: 'nodejs-sample-3',
      generation: 1,
      labels: {
        'appstudio.openshift.io/application': 'purple-mermaid-app',
        'build.appstudio.openshift.io/build': 'true',
        'appstudio.openshift.io/component': 'sample-component',
        'pipelinesascode.tekton.dev/sender': 'abhinandan13jan',
        'pipelinesascode.tekton.dev/sha': 'commit123',
        'pipelinesascode.tekton.dev/url-org': 'openshift',
        'build.appstudio.redhat.com/url-repository': 'console',
        'pipelinesascode.tekton.dev/git-provider': 'github',
      },
    },
    spec: {},
    status: {
      pipelineSpec: null,
      conditions: [
        {
          reason: 'Completed',
          status: 'True',
          type: 'Succeeded',
        },
      ],
      startTime: '2022-08-18T12:47:26Z',
    },
  },
  {
    apiVersion: 'tekton.dev/v1beta1',
    kind: 'PipelineRun',
    apiGroup: 'tekton.dev',
    metadata: {
      name: 'nodejs-sample-4',
      annotations: {
        'build.appstudio.openshift.io/image':
          'quay.io/redhat-appstudio/user-workload:test-nodejs-sample',
        'build.appstudio.redhat.com/commit_sha': 'commit123',
        'build.appstudio.redhat.com/target_branch': 'branch_1',
        'pipelinesascode.tekton.dev/sha-url':
          'https://github.com/devfile-samples/devfile-sample-java-springboot-basic',
      },
      creationTimestamp: '2022-06-20T12:47:24Z',
      generateName: 'nodejs-sample-',
      generation: 1,
      labels: {
        'appstudio.openshift.io/application': 'purple-mermaid-app',
        'build.appstudio.openshift.io/build': 'true',
        'appstudio.openshift.io/component': 'sample-component',
        'pipelinesascode.tekton.dev/sender': 'abhinandan13jan',
        'pipelinesascode.tekton.dev/sha': 'commit123',
        'pipelinesascode.tekton.dev/url-org': 'openshift',
        'build.appstudio.redhat.com/url-repository': 'console',
        'pipelinesascode.tekton.dev/git-provider': 'github',
      },
    },
    spec: {},
    status: {
      pipelineSpec: null,
      conditions: [
        {
          reason: 'Completed',
          status: 'True',
          type: 'Succeeded',
        },
      ],
      startTime: '2022-08-20T11:47:26Z',
    },
  },
  {
    apiVersion: 'tekton.dev/v1beta1',
    kind: 'PipelineRun',
    apiGroup: 'tekton.dev',
    metadata: {
      annotations: {
        'build.appstudio.openshift.io/image':
          'quay.io/redhat-appstudio/user-workload:test-nodejs-sample',
        'build.appstudio.redhat.com/commit_sha': 'commit123',
        'build.appstudio.redhat.com/target_branch': 'branch_1',
        'build.appstudio.redhat.com/sha_url': 'https://github.com/openshift/console',
        'pipelinesascode.tekton.dev/sha-url':
          'https://github.com/devfile-samples/devfile-sample-java-springboot-basic',
      },
      creationTimestamp: '2022-06-20T12:47:24Z',
      name: 'nodejs-sample-4',
      generation: 1,
      labels: {
        'appstudio.openshift.io/application': 'purple-mermaid-app',
        'build.appstudio.openshift.io/build': 'true',
        'appstudio.openshift.io/component': 'sample-component',
        'pipelinesascode.tekton.dev/sender': 'abhi',
        'pipelinesascode.tekton.dev/sha': 'commit123',
        'pipelinesascode.tekton.dev/url-org': 'openshift',
        'build.appstudio.redhat.com/url-repository': 'console',
        'pipelinesascode.tekton.dev/git-provider': 'github',
      },
    },
    spec: {},
    status: {
      pipelineSpec: null,
      conditions: [
        {
          reason: 'Failed',
          status: 'False',
          type: 'Succeeded',
        },
      ],
      startTime: '2022-08-20T12:47:26Z',
    },
  },
  {
    apiVersion: 'tekton.dev/v1beta1',
    kind: 'PipelineRun',
    apiGroup: 'tekton.dev',
    metadata: {
      annotations: {
        'build.appstudio.openshift.io/image':
          'quay.io/redhat-appstudio/user-workload:test-nodejs-sample',
        'build.appstudio.redhat.com/commit_sha': 'commit-ment',
        'build.appstudio.redhat.com/target_branch': 'branch_ment',
        'build.appstudio.redhat.com/sha_url': 'https://github.com/openshift/console',
        'pipelinesascode.tekton.dev/sha-url':
          'https://github.com/devfile-samples/devfile-sample-java-springboot-basic',
      },
      creationTimestamp: '2022-06-20T12:47:24Z',
      name: 'nodejs-sample-5',
      generation: 1,
      labels: {
        'appstudio.openshift.io/component': 'go-3,sample-component',
        'appstudio.openshift.io/application': 'purple-mermaid-app',
        'build.appstudio.openshift.io/build': 'true',
        'pipelinesascode.tekton.dev/sender': 'abhi',
        'pipelinesascode.tekton.dev/sha': 'commit-ment',
        'pipelinesascode.tekton.dev/url-org': 'openshift',
        'build.appstudio.redhat.com/url-repository': 'console',
        'pipelinesascode.tekton.dev/git-provider': 'github',
      },
    },
    spec: {},
  },
  {
    apiVersion: 'tekton.dev/v1beta1',
    kind: 'PipelineRun',
    apiGroup: 'tekton.dev',
    metadata: {
      annotations: {
        'build.appstudio.openshift.io/image':
          'quay.io/redhat-appstudio/user-workload:test-nodejs-sample',
        'build.appstudio.redhat.com/commit_sha': 'commitson',
        'build.appstudio.redhat.com/target_branch': 'branch_1',
        'build.appstudio.redhat.com/sha_url': 'https://github.com/openshift/console',
        'pipelinesascode.tekton.dev/sha-url':
          'https://github.com/devfile-samples/devfile-sample-java-springboot-basic',
      },
      creationTimestamp: '2022-06-20T12:47:24Z',
      name: 'sample-1',
      generation: 1,
      labels: {
        'appstudio.openshift.io/component': 'go-3',
        'appstudio.openshift.io/application': 'purple-mermaid-app',
        'build.appstudio.openshift.io/build': 'true',
        'pipelinesascode.tekton.dev/sender': 'abhi',
        'pipelinesascode.tekton.dev/sha': 'commitson',
        'pipelinesascode.tekton.dev/url-org': 'openshift',
        'build.appstudio.redhat.com/url-repository': 'console',
        'pipelinesascode.tekton.dev/git-provider': 'github',
      },
    },
    spec: {},
  },
  {
    apiVersion: 'tekton.dev/v1beta1',
    kind: 'PipelineRun',
    apiGroup: 'tekton.dev',
    metadata: {
      annotations: {
        'build.appstudio.openshift.io/image':
          'quay.io/redhat-appstudio/user-workload:test-nodejs-sample',
        'build.appstudio.redhat.com/commit_sha': 'commit_try1',
        'build.appstudio.redhat.com/target_branch': 'branch_1',
        'build.appstudio.redhat.com/sha_url': 'https://github.com/openshift/console',
        'pipelinesascode.tekton.dev/sha-url':
          'https://github.com/devfile-samples/devfile-sample-java-springboot-basic',
      },
      creationTimestamp: '2022-06-20T12:47:24Z',
      name: 'sample-2',
      generation: 1,
      labels: {
        'appstudio.openshift.io/component': 'sample-component',
        'appstudio.openshift.io/application': 'purple-mermaid-app',
        'build.appstudio.openshift.io/build': 'true',
        'pipelinesascode.tekton.dev/sender': 'abhi',
        'pipelinesascode.tekton.dev/sha': 'commit_try1',
        'pipelinesascode.tekton.dev/url-org': 'openshift',
        'build.appstudio.redhat.com/url-repository': 'console',
        'pipelinesascode.tekton.dev/git-provider': 'github',
      },
    },
    spec: {},
  },
  {
    apiVersion: 'tekton.dev/v1beta1',
    kind: 'PipelineRun',
    apiGroup: 'tekton.dev',
    metadata: {
      annotations: {
        'build.appstudio.openshift.io/image':
          'quay.io/redhat-appstudio/user-workload:test-nodejs-sample',
        'build.appstudio.redhat.com/commit_sha': 'ertxyz',
        'build.appstudio.redhat.com/target_branch': 'branch_1',
        'pipelinesascode.tekton.dev/sha-url':
          'https://github.com/devfile-samples/devfile-sample-java-springboot-basic',
      },
      creationTimestamp: '2022-06-20T12:47:24Z',
      name: 'sample-3',
      generation: 1,
      labels: {
        'appstudio.openshift.io/component': 'go-3',
        'appstudio.openshift.io/application': 'purple-mermaid-app',
        'build.appstudio.openshift.io/build': 'true',
        'pipelinesascode.tekton.dev/sender': 'abhi',
        'pipelinesascode.tekton.dev/sha': 'ertxyz',
        'pipelinesascode.tekton.dev/url-org': 'openshift',
        'build.appstudio.redhat.com/url-repository': 'console',
        'pipelinesascode.tekton.dev/git-provider': 'github',
      },
    },
    spec: {},
  },
  {
    apiVersion: 'tekton.dev/v1beta1',
    kind: 'PipelineRun',
    apiGroup: 'tekton.dev',
    metadata: {
      annotations: {
        'build.appstudio.openshift.io/image':
          'quay.io/redhat-appstudio/user-workload:test-nodejs-sample',
        'build.appstudio.redhat.com/commit_sha': 'commit_try1',
        'build.appstudio.redhat.com/target_branch': 'branch_try',
        'build.appstudio.redhat.com/sha_url': 'https://github.com/openshift/console',
        'pipelinesascode.tekton.dev/sha-url':
          'https://github.com/devfile-samples/devfile-sample-java-springboot-basic',
      },
      creationTimestamp: '2022-06-20T12:47:24Z',
      name: 'sample-4',
      generation: 1,
      labels: {
        'appstudio.openshift.io/component': 'go-3',
        'appstudio.openshift.io/application': 'purple-mermaid-app',
        'build.appstudio.openshift.io/build': 'true',
        'pipelinesascode.tekton.dev/sender': 'abhi',
        'pipelinesascode.tekton.dev/sha': 'commit_try1',
        'pipelinesascode.tekton.dev/url-org': 'openshift',
        'build.appstudio.redhat.com/url-repository': 'console',
        'pipelinesascode.tekton.dev/git-provider': 'github',
      },
    },
    spec: {},
  },
  {
    apiVersion: 'tekton.dev/v1beta1',
    kind: 'PipelineRun',
    apiGroup: 'tekton.dev',
    metadata: {
      annotations: {
        'build.appstudio.openshift.io/image':
          'quay.io/redhat-appstudio/user-workload:test-nodejs-sample',
        'build.appstudio.redhat.com/commit_sha': 'commitabc',
        'build.appstudio.redhat.com/target_branch': 'branch_x',
        'pipelinesascode.tekton.dev/sha-url':
          'https://github.com/devfile-samples/devfile-sample-java-springboot-basic',
      },
      creationTimestamp: '2022-06-20T12:47:24Z',
      name: 'sample-5',
      generation: 1,
      labels: {
        'appstudio.openshift.io/component': 'go-3',
        'appstudio.openshift.io/application': 'purple-mermaid-app',
        'build.appstudio.openshift.io/build': 'true',
        'pipelinesascode.tekton.dev/sender': 'abhi',
        'pipelinesascode.tekton.dev/sha': 'commitabc',
        'pipelinesascode.tekton.dev/url-org': 'openshift',
        'build.appstudio.redhat.com/url-repository': 'console',
        'pipelinesascode.tekton.dev/git-provider': 'github',
      },
    },
    spec: {},
  },
  {
    apiVersion: 'tekton.dev/v1beta1',
    kind: 'PipelineRun',
    apiGroup: 'tekton.dev',
    metadata: {
      annotations: {
        'build.appstudio.openshift.io/image':
          'quay.io/redhat-appstudio/user-workload:test-nodejs-sample',
        'build.appstudio.redhat.com/commit_sha': 'ertxyz',
        'build.appstudio.redhat.com/target_branch': 'branch_1',
        'pipelinesascode.tekton.dev/sha-url':
          'https://github.com/devfile-samples/devfile-sample-java-springboot-basic',
      },
      creationTimestamp: '2022-06-20T12:47:24Z',
      name: 'sample-6',
      generation: 1,
      labels: {
        'appstudio.openshift.io/component': 'go-3',
        'appstudio.openshift.io/application': 'purple-mermaid-app',
        'build.appstudio.openshift.io/build': 'true',
        'pipelinesascode.tekton.dev/sender': 'abhi',
        'pipelinesascode.tekton.dev/sha': 'ertxyz',
        'pipelinesascode.tekton.dev/url-org': 'openshift',
        'build.appstudio.redhat.com/url-repository': 'console',
        'pipelinesascode.tekton.dev/git-provider': 'github',
      },
    },
    spec: {},
  },
  {
    apiVersion: 'tekton.dev/v1beta1',
    kind: 'PipelineRun',
    apiGroup: 'tekton.dev',
    metadata: {
      annotations: {
        'build.appstudio.openshift.io/image':
          'quay.io/redhat-appstudio/user-workload:test-nodejs-sample',
      },
      creationTimestamp: '2022-06-20T12:47:24Z',
      name: 'nodejs-sample-1',
      generation: 1,
      labels: {
        'appstudio.openshift.io/component': 'sample-component',
        'build.appstudio.redhat.com/user': 'abhi',
      },
    },
    spec: {},
  },
  {
    apiVersion: 'tekton.dev/v1beta1',
    kind: 'PipelineRun',
    apiGroup: 'tekton.dev',
    metadata: {
      annotations: {
        'build.appstudio.openshift.io/image':
          'quay.io/redhat-appstudio/user-workload:test-nodejs-sample',
      },
      creationTimestamp: '2022-06-20T12:47:24Z',
      name: 'nodejs-sample-2',
      generation: 1,
      labels: {
        'appstudio.openshift.io/component': 'sample-component',
        'build.appstudio.redhat.com/user': 'abhi',
      },
    },
    spec: {},
  },
  {
    apiVersion: 'tekton.dev/v1beta1',
    kind: 'PipelineRun',
    apiGroup: 'tekton.dev',
    metadata: {
      annotations: {
        'build.appstudio.openshift.io/image':
          'quay.io/redhat-appstudio/user-workload:test-nodejs-sample',
        'build.appstudio.redhat.com/commit_sha': 'commitabc',
        'build.appstudio.redhat.com/target_branch': 'branch_x',
        'pipelinesascode.tekton.dev/sha-url':
          'https://github.com/devfile-samples/devfile-sample-java-springboot-basic',
      },
      creationTimestamp: '2022-06-20T12:47:24Z',
      name: 'nodejs-sample-3',
      generation: 1,
      labels: {
        'appstudio.openshift.io/component': 'sample-component',
        'appstudio.openshift.io/application': 'purple-mermaid-app',
        'build.appstudio.openshift.io/build': 'true',
        'pipelinesascode.tekton.dev/sender': 'abhinandan13jan',
        'pipelinesascode.tekton.dev/sha': 'commitabc',
        'pipelinesascode.tekton.dev/url-org': 'openshift',
        'build.appstudio.redhat.com/url-repository': 'console',
        'pipelinesascode.tekton.dev/git-provider': 'github',
      },
    },
    spec: {},
  },
];

export const pipelineWithoutCommits: PipelineRunKind[] = [
  {
    apiVersion: 'tekton.dev/v1beta1',
    kind: 'PipelineRun',
    apiGroup: 'tekton.dev',
    metadata: {
      annotations: {
        'build.appstudio.openshift.io/image':
          'quay.io/redhat-appstudio/user-workload:test-nodejs-sample',
      },
      creationTimestamp: '2022-06-20T12:47:24Z',
      name: 'sample-5',
      generation: 1,
      labels: {},
    },
    spec: {},
  },
  {
    apiVersion: 'tekton.dev/v1beta1',
    kind: 'PipelineRun',
    apiGroup: 'tekton.dev',
    metadata: {
      annotations: {
        'build.appstudio.openshift.io/image':
          'quay.io/redhat-appstudio/user-workload:test-nodejs-sample',
      },
      creationTimestamp: '2022-06-20T12:47:24Z',
      name: 'sample-6',
      generation: 1,
      labels: {
        'appstudio.openshift.io/component': 'go-2nd',
        'build.appstudio.redhat.com/user': 'abhi',
      },
    },
    spec: {},
  },
  {
    apiVersion: 'tekton.dev/v1beta1',
    kind: 'PipelineRun',
    apiGroup: 'tekton.dev',
    metadata: {
      annotations: {
        'build.appstudio.openshift.io/image':
          'quay.io/redhat-appstudio/user-workload:test-nodejs-sample',
      },
      creationTimestamp: '2022-06-20T12:47:24Z',
      name: 'nodejs-sample-1',
      generation: 1,
      labels: {},
    },
    spec: {},
  },
  {
    apiVersion: 'tekton.dev/v1beta1',
    kind: 'PipelineRun',
    apiGroup: 'tekton.dev',
    metadata: {
      annotations: {
        'build.appstudio.openshift.io/image':
          'quay.io/redhat-appstudio/user-workload:test-nodejs-sample',
      },
      creationTimestamp: '2022-06-20T12:47:24Z',
      name: 'nodejs-sample-2',
      generation: 1,
      labels: {
        'appstudio.openshift.io/component': 'sample-component',
        'build.appstudio.redhat.com/user': 'abhi',
      },
    },
    spec: {},
  },
  {
    apiVersion: 'tekton.dev/v1beta1',
    kind: 'PipelineRun',
    apiGroup: 'tekton.dev',
    metadata: {
      annotations: {
        'build.appstudio.openshift.io/image':
          'quay.io/redhat-appstudio/user-workload:test-nodejs-sample',
      },
      creationTimestamp: '2022-06-20T12:47:24Z',
      name: 'nodejs-sample-3',
      generation: 1,
      labels: {},
    },
    spec: {},
  },
];

export const mockCommits: Commit[] = [
  {
    sha: 'comm0123456789abcdefghijklmnopqrstuvwxyz',
    metadata: {
      name: 'comm0123456789abcdefghijklmnopqrstuvwxyz',
      uid: 'comm0123456789abcdefghijklmnopqrstuvwxyz',
    },
    branch: 'main',
    displayName: 'comm012',
    application: 'sample-application',
    components: ['my-comp'],
    user: 'abhi',
    shaURL: 'https://github.com/abhinandan13jan/comm0123456789abcdefghijklmnopqrstuvwxyz',
    pipelineRuns: [...pipelineWithCommits.slice(0, 1)],
    isPullRequest: false,
  },
];

export const mockPLRs: PipelineRunKind[] = [
  {
    kind: 'PipelineRun',
    apiVersion: 'tekton.dev/v1beta1',
    metadata: {
      creationTimestamp: '2022-08-04T16:23:43Z',
      finalizers: Array['chains.tekton.dev/pipelinerun'],
      name: 'basic-node-js-first',
      namespace: 'test',
      ownerReferences: [
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          kind: 'Component',
          name: 'basic-node-js',
          uid: '6b79df0c-1bee-40c0-81ee-7c4d1c9a422f',
        },
      ],
      resourceVersion: '497868251',
      uid: '9c1f121c-1eb6-490f-b2d9-befbfc658df1',
    },
    spec: {
      key: 'key1',
    },
  },
  {
    kind: 'PipelineRun',
    apiVersion: 'tekton.dev/v1beta1',
    metadata: {
      creationTimestamp: '2022-08-04T16:23:43Z',
      finalizers: Array['chains.tekton.dev/pipelinerun'],
      name: 'basic-node-js-second',
      namespace: 'test',
      ownerReferences: [
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          kind: 'Component',
          name: 'basic-node-js',
          uid: '6b79df0c-1bee-40c0-81ee-7c4d1c9a422f',
        },
      ],
      resourceVersion: '497868252',
      uid: '9c1f121c-1eb6-490f-b2d9-befbfc658dfb',
    },
    spec: {
      key: 'key2',
    },
  },
  {
    kind: 'PipelineRun',
    apiVersion: 'tekton.dev/v1beta1',
    metadata: {
      creationTimestamp: '2022-08-04T16:23:43Z',
      finalizers: Array['chains.tekton.dev/pipelinerun'],
      name: 'basic-node-js-third',
      namespace: 'test',
      ownerReferences: [
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          kind: 'Component',
          name: 'basic-node-js',
          uid: '6b79df0c-1bee-40c0-81ee-7c4d1c9a422f',
        },
      ],
      resourceVersion: '497868253',
      uid: '9c1f121c-1eb6-490f-b2d9-befbfc658dfc',
    },
    spec: {
      key: 'key3',
    },
  },
];
