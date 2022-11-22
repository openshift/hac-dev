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
      },
      creationTimestamp: '2022-07-19T11:35:46Z',
      generation: 1,
      labels: {
        'build.appstudio.openshift.io/application': 'purple-mermaid-app',
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
      },
      creationTimestamp: '2022-06-20T12:47:24Z',
      generateName: 'nodejs-sample-',
      generation: 1,
      labels: {
        'build.appstudio.openshift.io/application': 'purple-mermaid-app',
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
      },
      creationTimestamp: '2022-06-20T12:47:24Z',
      generateName: 'nodejs-sample-',
      generation: 1,
      labels: {
        'build.appstudio.openshift.io/application': 'purple-mermaid-app',
        'build.appstudio.openshift.io/type': 'build',
        'build.appstudio.openshift.io/version': '0.1',
        'pipelines.appstudio.openshift.io/type': 'build',
        'build.appstudio.openshift.io/build': 'true',
        'appstudio.openshift.io/component': 'go-3',
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
      serviceAccountName: 'pipeline',
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
      },
      creationTimestamp: '2022-06-20T12:47:24Z',
      generateName: 'nodejs-sample-',
      generation: 1,
      labels: {
        'build.appstudio.openshift.io/application': 'purple-mermaid-app',
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
        'build.appstudio.openshift.io/application': 'purple-mermaid-app',
        'build.appstudio.openshift.io/build': 'true',
        'build.appstudio.openshift.io/component': 'nodejs-sample',
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
        'build.appstudio.openshift.io/component': 'sample-component',
        'pipelinesascode.tekton.dev/sha-url':
          'https://github.com/devfile-samples/devfile-sample-java-springboot-basic',
      },
      creationTimestamp: '2022-06-20T12:47:24Z',
      generateName: 'nodejs-sample-',
      generation: 1,
      labels: {
        'build.appstudio.openshift.io/application': 'purple-mermaid-app',
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
      serviceAccountName: 'pipeline',
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
        'build.appstudio.openshift.io/application': 'purple-mermaid-app',
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
        'build.appstudio.openshift.io/application': 'purple-mermaid-app',
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
        'build.appstudio.openshift.io/application': 'purple-mermaid-app',
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
        'build.appstudio.openshift.io/application': 'purple-mermaid-app',
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
        'build.appstudio.openshift.io/application': 'purple-mermaid-app',
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
        'build.appstudio.openshift.io/application': 'purple-mermaid-app',
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
        'build.appstudio.openshift.io/application': 'purple-mermaid-app',
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
        'build.appstudio.openshift.io/application': 'purple-mermaid-app',
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
        'build.appstudio.openshift.io/application': 'purple-mermaid-app',
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
        'build.appstudio.openshift.io/application': 'purple-mermaid-app',
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
        'build.appstudio.openshift.io/application': 'purple-mermaid-app',
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
        'build.appstudio.openshift.io/component': 'sample-component',
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
        'build.appstudio.openshift.io/component': 'sample-component',
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
        'build.appstudio.openshift.io/application': 'purple-mermaid-app',
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
        'build.appstudio.openshift.io/component': 'go-2nd',
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
        'build.appstudio.openshift.io/component': 'sample-component',
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
    application: 'sample-application',
    components: ['my-comp'],
    user: 'abhi',
    shaURL: 'https://github.com/abhinandan13jan/comm0123456789abcdefghijklmnopqrstuvwxyz',
    pipelineRuns: [...pipelineWithCommits.slice(0, 1)],
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
