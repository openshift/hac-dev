import uniqueId from 'lodash/uniqueId';
import { ApplicationModel, ComponentModel, ComponentDetectionQueryModel } from '../models';
import { k8sCreateResource } from './../dynamic-plugin-sdk';

/**
 * Create HAS Application CR
 * @param application application name
 * @returns Returns HAS Application CR data
 *
 * TODO: Return type any should be changed to a proper type like K8sResourceCommon
 */
export const createApplication = (application: string, namespace: string): any => {
  const name = application.split(' ').join('-').toLowerCase();
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
export const createComponent = (component, application: string, namespace: string): any => {
  const name = `${application}-${component.name.split(' ').join('-').toLowerCase()}`;
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
    },
  };
  // TODO: Make Api Calls here
  return k8sCreateResource({
    model: ComponentModel,
    data: requestData,
  });
};

/**
 * Create ComponentDetectionQuery CR
 *
 * @param appName application name
 * @param url the URL of the repository that will be analyzed for components
 * @param namespace namespace to deploy resource in. Defaults to current namespace
 * @param isMulticomponent whether or not the git repository contains multiple components
 * @returns Returns HAS ComponentDetectionQuery results
 *
 * TODO: Return type any should be changed to a proper type like K8sResourceCommon
 */
export const createComponentDetectionQuery = async (
  appName: string,
  repository: string,
  namespace?: string,
  isMulticomponent?: boolean,
): Promise<any> => {
  const name = `detect-${appName.split(' ').join('-').toLowerCase()}-git-repo`;
  const uniqueName = uniqueId(name);
  const mockReturnData = {
    'backend-service': {
      devfileFound: false,
      language: 'go',
      projectType: 'go',
      componentResourceStub: {
        apiVersion: 'has.appstudio/v1alpha1',
        kind: 'Component',
        spec: {
          source: {
            git: {
              url: 'https://github.com/test/repository.git',
              path: 'backend-service',
            },
          },
          resources: {
            memory: '1Gi',
            cpu: '500m',
          },
        },
      },
    },
    'frontend-service': {
      devfileFound: true,
      language: 'js',
      projectType: 'nodejs',
      componentResourceStub: {
        apiVersion: 'has.appstudio/v1alpha1',
        kind: 'Component',
        spec: {
          source: {
            git: {
              url: 'https://github.com/test/repository.git',
              path: 'frontend-service',
            },
          },
          targetPort: 3000,
          resources: {
            memory: '1Gi',
            cpu: '500m',
          },
        },
      },
    },
  };

  const requestData = {
    apiVersion: `${ComponentDetectionQueryModel.apiGroup}/${ComponentDetectionQueryModel.apiVersion}`,
    kind: ComponentDetectionQueryModel.kind,
    metadata: {
      name: uniqueName,
      namespace,
    },
    spec: {
      git: {
        repository,
      },
      isMulticomponent,
    },
    data: mockReturnData,
  };

  // TODO: Make Api Calls here
  return requestData;
};
