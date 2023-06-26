import { K8sResourceCommon } from '@openshift/dynamic-plugin-sdk-utils';
import { ImportSecret } from '../components/ImportForm/utils/types';

export type SecretKind = K8sResourceCommon & {
  data?: { [key: string]: string };
  stringData?: { [key: string]: string };
  type?: string;
};

type linkServiceAccount = {
  serviceAccount: {
    as?: 'secret' | 'imagePullSecret';
    reference: {
      name: string;
    };
  };
};

export type RemoteSecretKind = K8sResourceCommon & {
  spec: {
    secret: {
      linkedTo: linkServiceAccount[];
      name: string;
      type: string;
    };
    targets: { namespace: string }[];
  };
};

export type SecretFormValues = ImportSecret & {
  existingSecrets?: string[];
};

export enum SecretType {
  opaque = 'Opaque secret',
  image = 'Image pull secret',
}

export const K8sSecretType = {
  [SecretType.opaque]: 'Opaque',
  [SecretType.image]: 'kubernetes.io/dockerconfigjson',
};
