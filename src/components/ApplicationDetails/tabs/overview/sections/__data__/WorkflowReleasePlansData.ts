export const mockReleasePlansData = [
  {
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    kind: 'ReleasePlan',
    metadata: {
      annotations: {
        'kubectl.kubernetes.io/last-applied-configuration':
          '{"apiVersion":"appstudio.redhat.com/v1alpha1","kind":"ReleasePlan","metadata":{"annotations":{},"labels":{"release.appstudio.openshift.io/auto-release":"true"},"name":"sre-production","namespace":"jephilli"},"spec":{"application":"test-application","displayName":"SRE Production","target":{"namespace":"jeff-managed-hacbs"}}}\n',
      },
      resourceVersion: '183512',
      name: 'sre-production',
      uid: '836c15db-1498-48da-b3c0-4c80bc7febaf',
      creationTimestamp: '2022-11-09T17:22:53Z',
      generation: 1,
      managedFields: [
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          fieldsType: 'FieldsV1',
          fieldsV1: {
            'f:metadata': {
              'f:annotations': {
                '.': {},
                'f:kubectl.kubernetes.io/last-applied-configuration': {},
              },
              'f:labels': {
                '.': {},
                'f:release.appstudio.openshift.io/auto-release': {},
              },
            },
            'f:spec': {
              '.': {},
              'f:application': {},
              'f:displayName': {},
              'f:target': {
                '.': {},
                'f:namespace': {},
              },
            },
          },
          manager: 'kubectl-client-side-apply',
          operation: 'Update',
          time: '2022-11-09T17:22:53Z',
        },
      ],
      namespace: 'jephilli',
      labels: {
        'release.appstudio.openshift.io/auto-release': 'true',
      },
    },
    spec: {
      application: 'test-application',
      displayName: 'SRE Production',
      target: {
        namespace: 'jeff-managed-hacbs',
      },
    },
  },
];
