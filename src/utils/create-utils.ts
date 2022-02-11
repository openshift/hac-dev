import uniqueId from 'lodash/uniqueId';
import { ApplicationModel, ComponentModel, ComponentDetectionQueryModel } from '../models';
import { ApplicationKind, ComponentDetectionQueryKind } from '../types';
import { k8sCreateResource, k8sGetResource } from './../dynamic-plugin-sdk';

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

  // TODO: Make Api Calls here
  return k8sCreateResource({
    model: ApplicationModel,
    data: requestData,
    dryRun,
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
        git: { url: component.gitRepo },
      },
      replicas: component.replicas,
      targetPort: component.targetPort,
      resources: component.resources,
    },
  };
  // TODO: Make Api Calls here
  return k8sCreateResource({
    model: ComponentModel,
    data: requestData,
    dryRun,
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
 * @param dryRun dry run without creating any resources
 * @returns Returns HAS ComponentDetectionQuery results
 *
 * TODO: Return type any should be changed to a proper type like K8sResourceCommon
 */
export const createComponentDetectionQuery = async (
  appName: string,
  url: string,
  namespace: string,
  isMultiComponent?: boolean,
  dryRun?: boolean,
): Promise<ComponentDetectionQueryKind['status']['componentDetected']> => {
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
      },
      isMultiComponent,
    },
  };

  let cdq: ComponentDetectionQueryKind = await k8sCreateResource({
    model: ComponentDetectionQueryModel,
    data: requestData,
    dryRun,
  });

  while (cdq.status?.conditions?.[0]?.type !== 'Completed') {
    // sleep for 200ms before refetching
    await new Promise((r) => setTimeout(r, 200));
    cdq = await k8sGetResource({
      model: ComponentDetectionQueryModel,
      name: cdq.metadata.name,
      ns: namespace,
      data: requestData,
    });
  }

  if (!cdq.status.componentDetected || cdq.status.conditions[0].status !== 'True') {
    throw new Error(cdq.status.conditions[0].message);
  }

  return cdq.status.componentDetected;
};
