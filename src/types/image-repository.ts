import { K8sResourceCommon } from '@openshift/dynamic-plugin-sdk-utils';

export enum ImageRepositoryVisibility {
  public = 'public',
  private = 'private',
}

type ImageRepositoryStatus = {
  state?: string;
  message?: string;
  image?: {
    url: string;
    visibility: ImageRepositoryVisibility;
  };
  credentials?: {
    generationTimestamp: string;
    'push-secret'?: string;
    'pull-secret'?: string;
    'push-robot-account'?: string;
    'pull-robot-account'?: string;
    'push-remote-secret'?: string;
    'pull-remote-secret'?: string;
  };
};

type ImageRepositorySpec = {
  image?: {
    name?: string;
    visibility?: ImageRepositoryVisibility;
  };
  credentials?: {
    'regenerate-token': boolean;
  };
};

export type ImageRepositoryKind = {
  spec: ImageRepositorySpec;
  status?: ImageRepositoryStatus;
} & K8sResourceCommon;
