import uniqueId from 'lodash/uniqueId';
import { ApplicationModel, ComponentModel } from '../models';
import { k8sCreateResource } from './../dynamic-plugin-sdk';

/**
 * Create HAS Application CR
 * @param application application name
 * @returns Returns HAS Application CR data
 *
 * TODO: Return type any should be changed to a proper type like K8sResourceCommon
 */
export const createApplication = (application: string): any => {
  const name = application.split(' ').join('-').toLowerCase();
  const uniqueName = uniqueId(`${name}-`);
  const requestData = {
    apiVersion: `${ApplicationModel.apiGroup}/${ApplicationModel.apiVersion}`,
    kind: ApplicationModel.kind,
    metadata: {
      name: uniqueName,
      namespace: 'rorai',
    },
    spec: {
      displayName: application,
    },
  };
  // TODO: Make Api Calls here
  return k8sCreateResource({
    model: ApplicationModel,
    data: requestData,
  });
};

/**
 * Create HAS Component CR
 *
 * @param component component data TODO: Data might change based on the API requirements
 * @param application application name
 * @returns Returns HAS Component CR data
 *
 * TODO: Return type any should be changed to a proper type like K8sResourceCommon
 */
export const createComponent = (component, application: string): any => {
  const name = `${application}-${component.name.split(' ').join('-').toLowerCase()}-`;
  const uniqueName = uniqueId(name);
  const requestData = {
    apiVersion: `${ComponentModel.apiGroup}/${ComponentModel.apiVersion}`,
    kind: ComponentModel.kind,
    metadata: {
      name: uniqueName,
      namespace: 'rorai',
    },
    spec: {
      componentName: component.name,
      application,
      source: {
        git: { url: component.gitRepo },
      },
    },
  };
  // TODO: Make Api Calls here
  return k8sCreateResource({
    model: ComponentModel,
    data: requestData,
  });
};
