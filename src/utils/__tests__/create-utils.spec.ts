import * as k8sUtil from '../../dynamic-plugin-sdk';
import { SPIAccessTokenBindingModel } from '../../models';
import { ApplicationModel } from './../../models/application';
import { ComponentDetectionQueryModel, ComponentModel } from './../../models/component';
import {
  createApplication,
  createComponent,
  createComponentDetectionQuery,
  createAccessTokenBinding,
} from './../create-utils';

jest.mock('../../dynamic-plugin-sdk');

const createResourceMock = k8sUtil.k8sCreateResource as jest.Mock;

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

    expect(k8sUtil.k8sCreateResource).toHaveBeenCalledWith({
      model: ApplicationModel,
      data: mockApplicationRequestData,
    });
  });

  it('Should call k8s create util with correct model and data for component', async () => {
    await createComponent(mockComponent, 'test-application', 'test-ns');

    expect(k8sUtil.k8sCreateResource).toHaveBeenCalledWith({
      model: ComponentModel,
      data: mockComponentData,
    });
  });

  it('Should call k8s create util with correct model and data for component detection query', async () => {
    createResourceMock.mockImplementationOnce(() =>
      Promise.resolve({
        status: { conditions: [{ type: 'Completed', status: 'True' }], componentDetected: true },
      }),
    );

    await createComponentDetectionQuery(
      'test-application',
      'https://github.com/test/repository',
      'test-ns',
      true,
    );

    expect(k8sUtil.k8sCreateResource).toHaveBeenCalledWith({
      model: ComponentDetectionQueryModel,
      data: expect.objectContaining(mockCDQData),
    });
  });

  it('Should throw error when no components are detected', async () => {
    createResourceMock.mockImplementationOnce(() =>
      Promise.resolve({
        status: { conditions: [{ type: 'Completed', status: 'False' }], componentDetected: false },
      }),
    );

    await expect(
      createComponentDetectionQuery(
        'test-application',
        'https://github.com/test/repository',
        'test-ns',
        true,
      ),
    ).rejects.toThrow();
  });

  it('Should call k8s create util with correct model and data for access token binding', async () => {
    createResourceMock.mockImplementationOnce(() =>
      Promise.resolve({ status: { phase: 'Injected' } }),
    );

    await createAccessTokenBinding('https://github.com/test/repository', 'test-ns');

    expect(k8sUtil.k8sCreateResource).toHaveBeenCalledWith({
      model: SPIAccessTokenBindingModel,
      data: expect.objectContaining(mockAccessTokenBinding),
    });
  });
});
