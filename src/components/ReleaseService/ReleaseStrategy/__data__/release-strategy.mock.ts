export const mockReleaseStrategy = {
  apiVersion: 'appstudio.redhat.com/v1alpha1',
  kind: 'ReleaseStrategy',
  metadata: {
    creationTimestamp: '2023-08-03T15:08:32Z',
    generation: 1,
    name: 'test-rs',
    namespace: 'rorai-tenant',
    resourceVersion: '526510775',
    uid: 'd45ac180-4977-4392-8c4c-7b16f654e172',
  },
  spec: {
    bundle: 'quay.io/hacbs-release/pipeline-deploy-release:main',
    params: [
      {
        name: 'extraConfigGitUrl',
        value: 'https://github.com/scoheb/strategy-configs.git',
      },
      {
        name: 'extraConfigPath',
        value: 'mvp.yaml',
      },
      {
        name: 'extraConfigRevision',
        value: 'main',
      },
    ],
    pipeline: 'deploy-release',
    policy: 'mvp-policy',
  },
};
