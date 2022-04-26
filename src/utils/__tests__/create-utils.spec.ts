import {
  k8sCreateResource,
  k8sGetResource,
  k8sUpdateResource,
} from '@openshift/dynamic-plugin-sdk-utils';
import { SPIAccessTokenBindingModel } from '../../models';
import { ApplicationModel } from './../../models/application';
import { ComponentDetectionQueryModel, ComponentModel } from './../../models/component';
import {
  createApplication,
  createComponent,
  createComponentDetectionQuery,
  createAccessTokenBinding,
} from './../create-utils';

jest.mock('@openshift/dynamic-plugin-sdk-utils');

const createResourceMock = k8sCreateResource as jest.Mock;
const getResourceMock = k8sGetResource as jest.Mock;

const mockApplicationRequestData = {
  apiVersion: `${ApplicationModel.apiGroup}/${ApplicationModel.apiVersion}`,
  kind: ApplicationModel.kind,
  metadata: {
    name: 'test-application',
    namespace: 'test-ns',
  },
  spec: {
    displayName: 'Test Application',
  },
};

const mockComponent = { name: 'Test Component', gitRepo: 'http://github.com/test-repo' };
const mockComponentWithDevfile = {
  ...mockComponent,
  devfileUrl: 'https://registry.devfile.io/sample-devfile',
};

const mockComponentData = {
  apiVersion: `${ComponentModel.apiGroup}/${ComponentModel.apiVersion}`,
  kind: ComponentModel.kind,
  metadata: {
    name: 'test-component',
    namespace: 'test-ns',
  },
  spec: {
    componentName: mockComponent.name,
    application: 'test-application',
    source: {
      git: { url: mockComponent.gitRepo },
    },
  },
};

const mockComponentDataWithDevfile = {
  ...mockComponentData,
  spec: {
    ...mockComponentData.spec,
    source: {
      git: {
        url: mockComponentWithDevfile.gitRepo,
        devfileUrl: mockComponentWithDevfile.devfileUrl,
      },
    },
  },
};

const mockCDQData = {
  apiVersion: `${ComponentDetectionQueryModel.apiGroup}/${ComponentDetectionQueryModel.apiVersion}`,
  kind: ComponentDetectionQueryModel.kind,
  metadata: {
    namespace: 'test-ns',
    name: expect.any(String),
  },
  spec: {
    git: { url: 'https://github.com/test/repository' },
    isMultiComponent: true,
  },
};

const mockAccessTokenBinding = {
  apiVersion: `${SPIAccessTokenBindingModel.apiGroup}/${SPIAccessTokenBindingModel.apiVersion}`,
  kind: SPIAccessTokenBindingModel.kind,
  metadata: {
    namespace: 'test-ns',
    name: expect.any(String),
  },
  spec: {
    repoUrl: 'https://github.com/test/repository',
    permissions: {
      required: [
        { type: 'r', area: 'repository' },
        { type: 'w', area: 'repository' },
      ],
    },
    secret: {
      name: expect.any(String),
      type: 'kubernetes.io/basic-auth',
    },
  },
};

describe('Create Utils', () => {
  it('Should call k8s create util with correct model and data for application', async () => {
    await createApplication('Test Application', 'test-ns');

    expect(k8sCreateResource).toHaveBeenCalledWith({
      model: ApplicationModel,
      queryOptions: {
        name: 'test-application',
        ns: 'test-ns',
      },
      resource: mockApplicationRequestData,
    });
  });

  it('Should call k8s create util with correct model and data for component', async () => {
    await createComponent(mockComponent, 'test-application', 'test-ns');

    expect(k8sCreateResource).toHaveBeenCalledWith({
      model: ComponentModel,
      queryOptions: {
        name: 'test-component',
        ns: 'test-ns',
      },
      resource: mockComponentData,
    });
  });

  it('Should call k8s create util with correct model and data for component with devfile', async () => {
    await createComponent(mockComponentWithDevfile, 'test-application', 'test-ns');

    expect(k8sCreateResource).toHaveBeenCalledWith({
      model: ComponentModel,
      queryOptions: {
        name: 'test-component',
        ns: 'test-ns',
      },
      resource: mockComponentDataWithDevfile,
    });
  });

  it('Should call k8s update util with when verb is update', async () => {
    await createComponent(
      mockComponent,
      'test-application',
      'test-ns',
      '',
      false,
      mockComponentData,
      'update',
    );

    expect(k8sUpdateResource).toHaveBeenCalled();
  });

  it('Should call k8s create util with correct model and data for component detection query', async () => {
    createResourceMock.mockImplementationOnce(() =>
      Promise.resolve({
        metadata: { name: 'dummy-name' },
        status: { conditions: [{ type: 'Completed', status: 'True' }], componentDetected: true },
      }),
    );

    getResourceMock.mockResolvedValue(() =>
      Promise.resolve({
        metadata: { name: 'dummy-name' },
        status: { conditions: [{ type: 'Completed', status: 'True' }], componentDetected: true },
      }),
    );

    await createComponentDetectionQuery(
      'test-application',
      'https://github.com/test/repository',
      'test-ns',
      true,
    );

    expect(k8sCreateResource).toHaveBeenCalledWith({
      model: ComponentDetectionQueryModel,
      queryOptions: {
        name: expect.stringContaining('test-application'),
        ns: 'test-ns',
      },
      resource: expect.objectContaining(mockCDQData),
    });
  });

  it('Should call k8s create util with correct model and data for access token binding', async () => {
    createResourceMock.mockImplementationOnce(() =>
      Promise.resolve({ status: { phase: 'Injected' } }),
    );

    await createAccessTokenBinding('https://github.com/test/repository', 'test-ns');

    expect(k8sCreateResource).toHaveBeenCalledWith({
      model: SPIAccessTokenBindingModel,
      queryOptions: {
        name: expect.stringContaining('appstudio-import-'),
        ns: 'test-ns',
      },
      resource: expect.objectContaining(mockAccessTokenBinding),
    });
  });
});
