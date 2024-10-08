import * as React from 'react';
import { k8sPatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { useApplicationPipelineGitHubApp } from '../hooks/useApplicationPipelineGitHubApp';
import { ComponentModel } from '../models';
import { ComponentKind } from '../types';

// Indicates whether the component was built from a sample and therefore does not support PAC without first forking.
// values: 'true' | 'false'
export const SAMPLE_ANNOTATION = 'appstudio.openshift.io/sample';

// Use with `BuildRequest` to request PaC state changes
// this annotaion gets removed after the request is processed
export const BUILD_REQUEST_ANNOTATION = 'build.appstudio.openshift.io/request';

export const BUILD_STATUS_ANNOTATION = 'build.appstudio.openshift.io/status';

export const GIT_PROVIDER_ANNOTATION = 'git-provider';
export const GIT_PROVIDER_ANNOTATION_VALUE = {
  GITHUB: 'github',
  GITLAB: 'gitlab',
  OTHERS: 'others',
};
export const GITLAB_PROVIDER_URL_ANNOTATION = 'git-provider-url';

export enum ComponentBuildState {
  enabled = 'enabled',
  disabled = 'disabled',
  error = 'error',
}

export type ComponentBuildStatus = {
  simple?: {
    'build-start-time'?: string;
    'error-id'?: number;
    'error-message'?: string;
  };
  pac?: {
    state?: ComponentBuildState;
    'merge-url'?: string;
    'error-id'?: number;
    'error-message'?: string;
    /** datetime in RFC 1123 format */
    'configuration-time'?: string;
  };
  message?: string;
};

/**
 * If whole pac section is missing, PaC state is considered disabled
 * Missing pac section shows that PaC was never requested on this component before,
 * where as pac.state=disabled means that it was provisioned and then removed.
 *
 * https://github.com/redhat-appstudio/build-service/pull/164
 */
export const getComponentBuildStatus = (component: ComponentKind) => {
  const buildStatusJSON = component.metadata?.annotations?.[BUILD_STATUS_ANNOTATION];
  if (!buildStatusJSON) {
    return null;
  }
  try {
    const buildStatus = JSON.parse(buildStatusJSON) as ComponentBuildStatus;
    return buildStatus;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Error while parsing component build status: ', e);
    return null;
  }
};

export const getPACProvision = (component: ComponentKind) =>
  getComponentBuildStatus(component)?.pac?.state;

export const isPACEnabled = (component: ComponentKind) =>
  getPACProvision(component) === ComponentBuildState.enabled;

export enum BuildRequest {
  /**
   * submits a new simple build pipeline. The build could be requested at any time regardless PaC Component configuration
   */
  triggerSimpleBuild = 'trigger-simple-build',
  /**
   * submits a new pac build pipeline. The build could be requested at any time regardless PaC Component configuration
   */
  triggerPACBuild = 'trigger-pac-build',
  /**
   * requests Pipelines-as-Code provision for the Component
   */
  configurePac = 'configure-pac',
  /**
   * requests Pipelines-as-Code clean up for the Component
   */
  unconfigurePac = 'unconfigure-pac',
}

export const enablePAC = (component: ComponentKind) =>
  k8sPatchResource({
    model: ComponentModel,
    queryOptions: {
      name: component.metadata.name,
      ns: component.metadata.namespace,
    },
    patches: [
      {
        op: 'add',
        path: `/metadata/annotations/${BUILD_REQUEST_ANNOTATION.replace('/', '~1')}`,
        value: BuildRequest.configurePac,
      },
    ],
  });

export const disablePAC = (component: ComponentKind) =>
  k8sPatchResource({
    model: ComponentModel,
    queryOptions: {
      name: component.metadata.name,
      ns: component.metadata.namespace,
    },
    patches: [
      {
        op: 'add',
        path: `/metadata/annotations/${BUILD_REQUEST_ANNOTATION.replace('/', '~1')}`,
        value: BuildRequest.unconfigurePac,
      },
    ],
  });

export const startNewBuild = (component: ComponentKind) =>
  k8sPatchResource({
    model: ComponentModel,
    queryOptions: {
      name: component.metadata.name,
      ns: component.metadata.namespace,
    },
    patches: [
      {
        op: 'add',
        path: `/metadata/annotations/${BUILD_REQUEST_ANNOTATION.replace('/', '~1')}`,
        value: isPACEnabled(component)
          ? BuildRequest.triggerPACBuild
          : BuildRequest.triggerSimpleBuild,
      },
    ],
  });

const GIT_URL_PREFIX = 'https://github.com/';

export const useURLForComponentPRs = (components: ComponentKind[]): string => {
  const { name: PR_BOT_NAME } = useApplicationPipelineGitHubApp();
  const repos = components.reduce((acc, component) => {
    const gitURL = component.spec.source?.git?.url;
    if (gitURL && isPACEnabled(component) && gitURL.startsWith('https://github.com/')) {
      acc = `${acc}+repo:${gitURL.replace(GIT_URL_PREFIX, '').replace(/.git$/i, '')}`;
    }
    return acc;
  }, '');
  return `https://github.com/pulls?q=is:pr+is:open+author:app/${PR_BOT_NAME}${repos}`;
};

export const useComponentBuildStatus = (component: ComponentKind): ComponentBuildStatus =>
  React.useMemo(() => getComponentBuildStatus(component), [component]);
