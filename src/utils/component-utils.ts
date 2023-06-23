import * as React from 'react';
import { k8sPatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { useApplicationPipelineGitHubApp } from '../hooks/useApplicationPipelineGitHubApp';
import { ComponentModel } from '../models';
import { ComponentKind } from '../types';

// Indicates whether the component was built from a sample and therefore does not support PAC without first forking.
// values: 'true' | 'false'
export const SAMPLE_ANNOTATION = 'appstudio.openshift.io/sample';

// values: 'request' | 'done'
export const PAC_ANNOTATION = 'appstudio.openshift.io/pac-provision';

// removal of this annotation from a non-pac component will trigger a new build
export const INITIAL_BUILD_ANNOTATION = 'appstudio.openshift.io/component-initial-build';

export const BUILD_STATUS_ANNOTATION = 'build.appstudio.openshift.io/status';

export enum PACProvision {
  done = 'done',
  request = 'request',
  error = 'error',
}

export const getPACProvision = (component: ComponentKind): PACProvision | undefined => {
  return PACProvision[component.metadata?.annotations?.[PAC_ANNOTATION]];
};

export const isPACEnabled = (component: ComponentKind, done?: boolean) => {
  const value = getPACProvision(component);
  return done ? value === PACProvision.done : !!value;
};

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
        path: `/metadata/annotations/${PAC_ANNOTATION.replace('/', '~1')}`,
        value: PACProvision.request,
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
        op: 'remove',
        path: `/metadata/annotations/${PAC_ANNOTATION.replace('/', '~1')}`,
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
        op: 'remove',
        path: `/metadata/annotations/${INITIAL_BUILD_ANNOTATION.replace('/', '~1')}`,
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

export type ComponentBuildStatus = {
  simple?: {
    'build-start-time'?: string;
    'error-id'?: number;
    'error-message'?: string;
  };
  pac?: {
    state?: 'enabled' | 'disabled' | 'error';
    'merge-url'?: string;
    'error-id'?: number;
    'error-message'?: string;
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
export const useComponentBuildStatus = (component: ComponentKind): ComponentBuildStatus => {
  const buildStatusJSON = component.metadata.annotations[BUILD_STATUS_ANNOTATION];
  return React.useMemo(() => {
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
  }, [buildStatusJSON]);
};
