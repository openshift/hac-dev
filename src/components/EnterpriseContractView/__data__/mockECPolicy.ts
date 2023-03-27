import { EnterpriseContractPolicyKind } from '../../../types';

export const MockECPolicy: EnterpriseContractPolicyKind = {
  apiVersion: 'appstudio.redhat.com/v1alpha1',
  kind: 'EnterpriseContractPolicy',
  metadata: {
    name: 'm7-policy',
    namespace: 'test-namespace',
  },
  spec: {
    description: `Red Hat's enterprise requirements`,
    exceptions: {
      nonBlocking: ['not_useful', 'attestation_task_bundle', 'java', 'tasks', 'test'],
    },
    sources: [
      {
        git: {
          repository: 'https://github.com/enterprise-contract/ec-policies',
          revision: 'main',
        },
      },
    ],
  },
};
