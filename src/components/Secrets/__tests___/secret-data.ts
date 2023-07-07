import { SecretModel } from '../../../models';
import { K8sSecretType, SecretType } from '../../../types';

export const sampleOpaqueSecret = {
  apiVersion: SecretModel.apiVersion,
  kind: SecretModel.kind,
  metadata: {
    name: 'test-opaque-secret',
    namespace: 'test-ns',
  },
  type: K8sSecretType[SecretType.opaque],
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
  type: K8sSecretType[SecretType.image],
  stringData: {
    c: 'd',
  },
};
