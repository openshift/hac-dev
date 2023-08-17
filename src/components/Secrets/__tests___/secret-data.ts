import { SecretModel } from '../../../models';
import {
  K8sSecretType,
  RemoteSecretKind,
  RemoteSecretStatusReason,
  SecretTypeDropdownLabel,
} from '../../../types';

export const sampleOpaqueSecret = {
  apiVersion: SecretModel.apiVersion,
  kind: SecretModel.kind,
  metadata: {
    name: 'test-opaque-secret',
    namespace: 'test-ns',
  },
  type: K8sSecretType[SecretTypeDropdownLabel.opaque],
  stringData: {
    a: 'b',
  },
};

export const sampleImagePullSecret = {
  apiVersion: SecretModel.apiVersion,
  kind: SecretModel.kind,
  metadata: {
    name: 'test-image-secret',
    namespace: 'test-ns',
  },
  type: K8sSecretType[SecretTypeDropdownLabel.image],
  stringData: {
    c: 'd',
  },
};

type SampleRemoteSecrets = { [key in RemoteSecretStatusReason]?: RemoteSecretKind };

export const sampleRemoteSecrets: SampleRemoteSecrets = {
  [RemoteSecretStatusReason.AwaitingData]: {
    apiVersion: 'appstudio.redhat.com/v1beta1',
    kind: 'RemoteSecret',
    metadata: {
      creationTimestamp: '2023-07-26T10:00:58Z',
      labels: {
        'appstudio.redhat.com/application': 'test-app',
        'appstudio.redhat.com/component': 'test-component-one',
      },
      name: 'test-secret-one',
      namespace: 'karthik-jk-tenant',
      resourceVersion: '572081071',
      uid: 'fe4ea82d-2bcd-4af2-bea4-c9a96e4b1d61',
    },
    spec: {
      secret: {
        linkedTo: [
          {
            serviceAccount: {
              as: 'secret',
              managed: {
                generateName: '',
                name: '',
              },
              reference: {
                name: 'default',
              },
            },
          },
        ],
        name: 'test-secret-one',
        type: 'kubernetes.io/dockerconfigjson',
      },
      targets: [
        {
          namespace: 'karthik-jk-tenant',
        },
      ],
    },
    status: {
      conditions: [
        {
          lastTransitionTime: '2023-07-26T10:00:59Z',
          message: 'The data of the remote secret not found in storage. Please provide it.',
          reason: 'AwaitingData',
          status: 'False',
          type: 'DataObtained',
        },
      ],
      secret: {},
    },
  },
  [RemoteSecretStatusReason.Injected]: {
    apiVersion: 'appstudio.redhat.com/v1beta1',
    kind: 'RemoteSecret',
    metadata: {
      creationTimestamp: '2023-08-17T08:28:27Z',
      labels: {
        'ui.appstudio.redhat.com/secret-for': 'Build',
      },
      name: 'test-secret-two',
      namespace: 'karthik-jk-tenant',
      uid: '6857498a-f11a-4e1e-b691-584b0338260e',
    },
    spec: {
      secret: {
        name: 'test-secret-two',
        type: 'Opaque',
      },
      targets: [
        {
          namespace: 'karthik-jk-tenant',
        },
      ],
    },
    status: {
      conditions: [
        {
          lastTransitionTime: '2023-08-17T08:28:27Z',
          message: '',
          reason: 'DataFound',
          status: 'True',
          type: 'DataObtained',
        },
        {
          lastTransitionTime: '2023-08-17T08:28:28Z',
          message: '',
          reason: 'Injected',
          status: 'True',
          type: 'Deployed',
        },
      ],
      secret: {
        keys: ['test'],
      },
      targets: [
        {
          namespace: 'karthik-jk-tenant',
          secretName: 'test',
        },
      ],
    },
  },
};
