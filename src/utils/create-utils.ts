import uniqueId from 'lodash/uniqueId';
import { HASApplicationModel, HASComponentModel } from '../models';

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
    apiversion: `${HASApplicationModel.group}/${HASApplicationModel.version}`,
    kind: HASApplicationModel.kind,
    metadata: {
      name: uniqueName,
    },
    spec: {
      displayName: application,
    },
  };
  // TODO: Make Api Calls here
  return new Promise((resolve) => {
    resolve(requestData);
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
    apiversion: `${HASComponentModel.group}/${HASComponentModel.version}`,
    kind: HASComponentModel.kind,
    metadata: {
      name: uniqueName,
    },
    spec: {
      componentName: component.name,
      application,
      source: {
        gitURL: component.gitRepo,
      },
    },
  };
  // TODO: Make Api Calls here
  return new Promise((resolve) => {
    resolve(requestData);
  });
};
