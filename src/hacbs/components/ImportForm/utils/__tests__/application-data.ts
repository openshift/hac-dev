import { K8sResourceCommon } from '@openshift/dynamic-plugin-sdk-utils';

export const mockApplication: K8sResourceCommon = {
  apiVersion: 'appstudio.redhat.com/v1alpha1',
  kind: 'Application',
  metadata: {
    creationTimestamp: '2022-08-09T18:52:59Z',
    generation: 1,
    managedFields: [
      {
        apiVersion: 'appstudio.redhat.com/v1alpha1',
        fieldsType: 'FieldsV1',
        fieldsV1: {
          'f:spec': {
            '.': {},
            'f:displayName': {},
          },
        },
        manager: 'Mozilla',
        operation: 'Update',
        time: '2022-08-09T18:52:59Z',
      },
    ],
    name: 'my-application-3',
    namespace: 'karthik-jk',
    resourceVersion: '935240056',
    uid: '10e5d5a4-513a-471e-8c44-ee68811811bb',
  },
  spec: {
    appModelRepository: {
      url: '',
    },
    displayName: 'My Application 3',
    gitOpsRepository: {
      url: '',
    },
  },
};
