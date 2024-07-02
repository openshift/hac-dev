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
  notifications?: {
    title: string;
    uuid: string;
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
  notifications?: {
    title: string;
    event: 'repo_push';
    method: 'email' | 'webhook';
    config: {
      url?: string;
      email?: string;
    };
  }[];
};

/**
 * Resource types taken from https://github.com/konflux-ci/image-controller/blob/main/api/v1alpha1/imagerepository_types.go
 */
export type ImageRepositoryKind = {
  spec: ImageRepositorySpec;
  status?: ImageRepositoryStatus;
} & K8sResourceCommon;
