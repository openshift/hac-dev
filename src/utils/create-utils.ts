import {
  k8sListResourceItems,
  k8sCreateResource,
  k8sUpdateResource,
} from '@openshift/dynamic-plugin-sdk-utils';
import isEqual from 'lodash/isEqual';
import isNumber from 'lodash/isNumber';
import { v4 as uuidv4 } from 'uuid';
import {
  ApplicationModel,
  ComponentModel,
  ComponentDetectionQueryModel,
  SPIAccessTokenBindingModel,
} from '../models';
import {
  ComponentKind,
  ApplicationKind,
  ComponentDetectionQueryKind,
  SPIAccessTokenBindingKind,
} from '../types';
import { ComponentSpecs } from './../types/component';

export const sanitizeName = (name: string) => name.split(/ |\./).join('-').toLowerCase();
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
  const requestData = {
    apiVersion: `${ApplicationModel.apiGroup}/${ApplicationModel.apiVersion}`,
    kind: ApplicationModel.kind,
    metadata: {
      name: application,
      namespace,
    },
    spec: {
      displayName: application,
    },
  };

  return k8sCreateResource({
    model: ApplicationModel,
    queryOptions: {
      name: application,
      ns: namespace,
      ...(dryRun && { queryParams: { dryRun: 'All' } }),
    },
    resource: requestData,
  });
};

/**
 * Create HAS Component CR
 *
 * @param component component data
 * @param application application name
 * @param namespace namespace of the application
 * @param dryRun dry run without creating any resources
 * @returns Returns HAS Component CR data
 *
 * TODO: Return type any should be changed to a proper type like K8sResourceCommon
 */
export const createComponent = (
  // TODO need better type for `component`
  component: ComponentSpecs,
  application: string,
  namespace: string,
  secret?: string,
  dryRun?: boolean,
  originalComponent?: ComponentKind,
  verb: 'create' | 'update' = 'create',
  enablePac: boolean = false,
): any => {
  const { componentName, containerImage, source, replicas, resources, env, targetPort } = component;

  const name = component.componentName.split(/ |\./).join('-').toLowerCase();

  const newComponent = {
    apiVersion: `${ComponentModel.apiGroup}/${ComponentModel.apiVersion}`,
    kind: ComponentModel.kind,
    metadata: {
      name,
      namespace,
      ...(verb === 'create' &&
        (enablePac
          ? {
              annotations: {
                'appstudio.openshift.io/pac-provision': 'request',
              },
            }
          : {
              annotations: {
                'skip-initial-checks': 'true',
              },
            })),
    },
    spec: {
      componentName,
      application,
      source,
      secret,
      containerImage,
      replicas,
      ...(isNumber(targetPort) && { targetPort }),
      resources,
      env,
    },
  };

  const resource =
    verb === 'update' ? { ...originalComponent, spec: newComponent.spec } : newComponent;

  return verb === 'create'
    ? k8sCreateResource({
        model: ComponentModel,
        queryOptions: {
          name,
          ns: namespace,
          ...(dryRun && { queryParams: { dryRun: 'All' } }),
        },
        resource,
      })
    : k8sUpdateResource({ model: ComponentModel, resource });
};

/**
 * Create ComponentDetectionQuery CR
 *
 * @param appName application name
 * @param url the URL of the repository that will be analyzed for components
 * @param namespace namespace to deploy resource in. Defaults to current namespace
 * @param secret Name of the secret containing the personal access token
 * @param context Context directory
 * @param revision Git revision if other than master/main
 * @param dryRun dry run without creating any resources
 * @returns Returns CDQ
 *
 */
export const createComponentDetectionQuery = async (
  appName: string,
  url: string,
  namespace: string,
  secret?: string,
  context?: string,
  revision?: string,
  dryRun?: boolean,
): Promise<ComponentDetectionQueryKind> => {
  // append name with uid for additional randomness
  const name = `${appName.split(/ |\./).join('-').toLowerCase()}`;
  const uniqueName = `${name}-${uuidv4()}`;

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
        context,
        revision,
      },
      secret,
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
  const id = uuidv4();
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
