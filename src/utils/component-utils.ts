import { k8sPatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { ComponentModel } from '../models';
import { ComponentKind } from '../types';

// Indicates whether the component was built from a sample and therefore does not support PAC without first forking.
// values: 'true' | 'false'
export const SAMPLE_ANNOTATION = 'appstudio.openshift.io/sample';

// values: 'request' | 'done'
export const PAC_ANNOTATION = 'appstudio.openshift.io/pac-provision';

// removal of this annotation from a non-pac component will trigger a new build
export const INITIAL_BUILD_ANNOTATION = 'appstudio.openshift.io/component-initial-build';

export enum PACProvision {
  done = 'done',
  request = 'request',
}

export const getPACProvision = (component: ComponentKind): PACProvision | undefined => {
  return PACProvision[component.metadata?.annotations?.[PAC_ANNOTATION]];
};

export const isPACEnabled = (component: ComponentKind, done?: boolean) => {
  const value = getPACProvision(component);
  return done ? value === PACProvision.done : !!value;
};

export const enablePAC = (component: ComponentKind) => {
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
        value: 'request',
      },
    ],
  });
};

export const startNewBuild = (component: ComponentKind) => {
  k8sPatchResource({
    model: ComponentModel,
    queryOptions: {
      name: component.metadata.name,
      ns: component.metadata.namespace,
    },
    patches: [
      {
        op: 'remove',
        path: `/metadata/annotations/${INITIAL_BUILD_ANNOTATION}`,
      },
    ],
  });
};

const PR_BOT_NAME = 'appstudio-staging-ci';
const GIT_URL_PREFIX = 'https://github.com/';

export const getURLForComponentPRs = (components: ComponentKind[]): string => {
  const repos = components.reduce((acc, component) => {
    const gitURL = component.spec.source?.git?.url;
    if (gitURL && isPACEnabled(component) && gitURL.startsWith('https://github.com/')) {
      acc = `${acc}+repo:${gitURL.replace(GIT_URL_PREFIX, '')}`;
    }
    return acc;
  }, '');
  return `https://github.com/pulls?q=is:pr+is:open+author:app/${PR_BOT_NAME}${repos}`;
};
