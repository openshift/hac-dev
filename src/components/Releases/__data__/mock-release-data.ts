export const mockRelease = {
  apiVersion: 'appstudio.redhat.com/v1alpha1',
  kind: 'Release',
  metadata: {
    name: 'test-release',
    creationTimestamp: '2025-01-01T10:30:00Z',
  },
  spec: {
    releasePlan: 'test-plan',
    snapshot: 'test-snapshot',
  },
  status: {
    startTime: '2025-01-01T10:30:00Z',
    completionTime: '2025-01-01T10:30:10Z',
    target: 'test-target',
    processing: {
      releaseStrategy: 'test-target/test-strategy',
      pipelineRun: 'test-target/test-pipelinerun',
    },
  },
};
