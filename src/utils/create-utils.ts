import { k8sListResourceItems, k8sCreateResource } from '@openshift/dynamic-plugin-sdk-utils';
import isEqual from 'lodash/isEqual';
import uniqueId from 'lodash/uniqueId';
import {
  ApplicationModel,
  ComponentModel,
  ComponentDetectionQueryModel,
  SPIAccessTokenBindingModel,
} from '../models';
import { ApplicationKind, ComponentDetectionQueryKind, SPIAccessTokenBindingKind } from '../types';

/**
 * Create HAS Application CR
 * @param application application name
 * @param namespace namespace of the application
 * @param dryRun dry run without creating any resources
 * @returns Returns HAS Application CR data
 *
 * TODO: Return type any should be changed to a proper type like K8sResourceCommon
 */
export const createApplication = (
  application: string,
  namespace: string,
  dryRun?: boolean,
): Promise<ApplicationKind> => {
  const name = application.split(/ |\./).join('-').toLowerCase();
  // const uniqueName = uniqueId(`${name}-`);
  const requestData = {
    apiVersion: `${ApplicationModel.apiGroup}/${ApplicationModel.apiVersion}`,
    kind: ApplicationModel.kind,
    metadata: {
      name,
      namespace,
    },
    spec: {
      displayName: application,
    },
  };

  return k8sCreateResource({
    model: ApplicationModel,
    queryOptions: {
      name,
      ns: namespace,
      ...(dryRun && { queryParams: { dryRun: 'All' } }),
    },
    resource: requestData,
  });
};

/**
 * Create HAS Component CR
 *
 * @param component component data TODO: Data might change based on the API requirements
 * @param application application name
 * @param namespace namespace of the application
 * @param dryRun dry run without creating any resources
 * @returns Returns HAS Component CR data
 *
 * TODO: Return type any should be changed to a proper type like K8sResourceCommon
 */
export const createComponent = (
  component,
  application: string,
  namespace: string,
  secret?: string,
  dryRun?: boolean,
): any => {
  const name = component.name.split(/ |\./).join('-').toLowerCase();
  // const uniqueName = uniqueId(name);
  const requestData = {
    apiVersion: `${ComponentModel.apiGroup}/${ComponentModel.apiVersion}`,
    kind: ComponentModel.kind,
    metadata: {
      name,
      namespace,
    },
    spec: {
      componentName: component.name,
      application,
      source: {
        git: {
          ...(component.gitRepo ? { url: component.gitRepo } : {}),
          secret,
          ...(component.devfileUrl ? { devfileUrl: component.devfileUrl } : {}),
        },
        ...(component.image ? { image: { containerImage: component.image } } : {}),
      },
      replicas: component.replicas,
      targetPort: component.targetPort,
      resources: component.resources,
      env: component.env,
    },
  };

  return k8sCreateResource({
    model: ComponentModel,
    queryOptions: {
      name,
      ns: namespace,
      ...(dryRun && { queryParams: { dryRun: 'All' } }),
    },
    resource: requestData,
  });
};

// https://stackoverflow.com/q/105034/7683374
const uid = () =>
  Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);

/**
 * Create ComponentDetectionQuery CR
 *
 * @param appName application name
 * @param url the URL of the repository that will be analyzed for components
 * @param namespace namespace to deploy resource in. Defaults to current namespace
 * @param isMultiComponent whether or not the git repository contains multiple components
 * @param secret Name of the secret containing the personal access token
 * @param dryRun dry run without creating any resources
 * @returns Returns CDQ
 *
 */
export const createComponentDetectionQuery = async (
  appName: string,
  url: string,
  namespace: string,
  isMultiComponent?: boolean,
  secret?: string,
  dryRun?: boolean,
): Promise<ComponentDetectionQueryKind> => {
  // append name with uid for additional randomness
  const name = `${appName.split(/ |\./).join('-').toLowerCase()}-${uid()}`;
  const uniqueName = uniqueId(name);

  const requestData = {
    apiVersion: `${ComponentDetectionQueryModel.apiGroup}/${ComponentDetectionQueryModel.apiVersion}`,
    kind: ComponentDetectionQueryModel.kind,
    metadata: {
      name: uniqueName,
      namespace,
    },
    spec: {
      git: {
        url,
        secret,
      },
      isMultiComponent,
    },
  };

  return k8sCreateResource({
    model: ComponentDetectionQueryModel,
    queryOptions: {
      name: uniqueName,
      ns: namespace,
      ...(dryRun && { queryParams: { dryRun: 'All' } }),
    },
    resource: requestData,
  });
};

/**
 * Create SPIAccessTokenBinding CR
 *
 * @param url the URL of the git repository
 * @param namespace namespace to create the binding
 * @param dryRun dry run without creating any resources
 * @returns Returns created SPIAccessTokenBinding resource
 */
export const createAccessTokenBinding = async (
  url: string,
  namespace: string,
  dryRun?: boolean,
) => {
  const id = uid();
  const requestData = {
    apiVersion: `${SPIAccessTokenBindingModel.apiGroup}/${SPIAccessTokenBindingModel.apiVersion}`,
    kind: SPIAccessTokenBindingModel.kind,
    metadata: {
      name: `appstudio-import-${id}`,
      namespace,
    },
    spec: {
      repoUrl: url,
      permissions: {
        required: [
          { type: 'r', area: 'repository' },
          { type: 'w', area: 'repository' },
        ],
      },
      secret: {
        name: `appstudio-token-${id}`,
        type: 'kubernetes.io/basic-auth',
      },
    },
  };

  const binding: SPIAccessTokenBindingKind = await k8sCreateResource({
    model: SPIAccessTokenBindingModel,
    queryOptions: {
      name: `appstudio-import-${id}`,
      ns: namespace,
      ...(dryRun && { queryParams: { dryRun: 'All' } }),
    },
    resource: requestData,
  });

  return binding;
};

/**
 * Create SPIAccessTokenBinding if a binding with the same Git URL & permissins
 * does not already exist.
 * Else return the existing SPIAccessTokenBinding.
 *
 * @param url the URL of the git repository
 * @param namespace namespace to create the binding
 * @returns Returns the SPIAccessTokenBinding resource
 */
export const initiateAccessTokenBinding = async (url: string, namespace: string) => {
  const bindings: SPIAccessTokenBindingKind[] = await k8sListResourceItems({
    model: SPIAccessTokenBindingModel,
    queryOptions: {
      ns: namespace,
    },
  });
  const binding = bindings.find(
    (b) =>
      b.spec.repoUrl === url &&
      isEqual(b.spec.permissions, {
        required: [
          { type: 'r', area: 'repository' },
          { type: 'w', area: 'repository' },
        ],
      }),
  );
  if (binding) {
    return binding;
  }

  return createAccessTokenBinding(url, namespace);
};
