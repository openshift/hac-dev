import { K8sResourceCommon } from '@openshift/dynamic-plugin-sdk-utils';
import { ImportSecret } from '../components/ImportForm/utils/types';

export const SecretByUILabel = 'ui.appstudio.redhat.com/secret-for';

export enum SecretFor {
  Deployment = 'Deployment',
  Build = 'Build',
}

export type SecretKind = K8sResourceCommon & {
  data?: { [key: string]: string };
  stringData?: { [key: string]: string };
  type?: string;
};

type linkServiceAccount = {
  serviceAccount: {
    as?: 'secret' | 'imagePullSecret';
    managed?: {
      generateName?: string;
      name?: string;
    };
    reference: {
      name: string;
    };
  };
};

export type RemoteSecretKind = K8sResourceCommon & {
  spec: {
    secret: {
      linkedTo?: linkServiceAccount[];
      name: string;
      type: string;
      labels?: {
        [key: string]: string;
      };
      annotations?: {
        [key: string]: string;
      };
    };
    targets: { namespace: string }[];
  };
  status?: RemoteSecretStatus;
};

export interface RemoteSecretStatus {
  conditions?: SecretCondition[];
  secret?: Secret;
  targets?: Target[];
}

export enum RemoteSecretStatusReason {
  AwaitingData = 'AwaitingData',
  DataFound = 'DataFound',
  Injected = 'Injected',
  PartiallyInjected = 'PartiallyInjected',
  Error = 'Error',
  Unknown = '-',
}

export enum RemoteSecretStatusType {
  Deployed = 'Deployed',
  DataObtained = 'DataObtained',
}
export interface SecretCondition {
  lastTransitionTime: string;
  message: string;
  reason: RemoteSecretStatusReason | string;
  status: string;
  type: RemoteSecretStatusType | string;
}

export interface Secret {
  keys?: string[];
}

export interface Target {
  namespace: string;
  secretName: string;
}

export type SecretFormValues = ImportSecret & {
  existingSecrets?: string[];
};

export enum SecretTypeDropdownLabel {
  opaque = 'Key/value secret',
  image = 'Image pull secret',
  source = 'Source secret',
}

export enum SecretType {
  opaque = 'Opaque',
  dockerconfigjson = 'kubernetes.io/dockerconfigjson',
  basicAuth = 'kubernetes.io/basic-auth',
  dockercfg = 'kubernetes.io/dockercfg',
  serviceAccountToken = 'kubernetes.io/service-account-token',
  sshAuth = 'kubernetes.io/ssh-auth',
  tls = 'kubernetes.io/tls',
}

export enum SecretTypeAbstraction {
  generic = 'generic',
  source = 'source',
  image = 'image',
}

export enum SecretTypeDisplayLabel {
  imagePull = 'Image pull',
  keyValue = 'Key/value',
}

export enum ImagePullSecretType {
  ImageRegistryCreds = 'Image registry credentials',
  UploadConfigFile = 'Upload configuration file',
}

export enum SourceSecretType {
  basic = 'Basic authentication',
  ssh = 'SSH Key',
}
export const K8sSecretType = {
  [SecretTypeDropdownLabel.opaque]: SecretType.opaque,
  [SecretTypeDropdownLabel.image]: SecretType.dockerconfigjson,
  [ImagePullSecretType.ImageRegistryCreds]: SecretType.dockerconfigjson,
  [ImagePullSecretType.UploadConfigFile]: SecretType.dockercfg,
  [SourceSecretType.basic]: SecretType.basicAuth,
  [SourceSecretType.ssh]: SecretType.sshAuth,
};

export interface AddSecretFormValues {
  type: string;
  name: string;
  secretFor: SecretFor;
  targets: Targets;
  opaque: Opaque;
  image: Image;
  source: Source;
  labels?: KeyValueEntry[];
}

export interface Image {
  authType: string;
  registryCreds?: RegistryCred[];
  dockerconfig?: string;
}

export interface RegistryCred {
  registry: string;
  username: string;
  password: string;
  email: string;
}

export type KeyValueEntry = {
  key: string;
  value: string;
  readOnlyKey?: boolean;
};
export interface Opaque {
  keyValues: KeyValueEntry[];
}

export interface Source {
  authType: string;
  username?: string;
  password?: string;
}

export interface Targets {
  application: string;
  component: string;
  environment: string;
}
