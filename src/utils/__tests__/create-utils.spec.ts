import * as k8sUtil from '../../dynamic-plugin-sdk';
import { ApplicationModel } from './../../models/application';
import { ComponentModel } from './../../models/component';
import { createApplication, createComponent } from './../create-utils';

jest.mock('../../dynamic-plugin-sdk');

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
    name: 'test-application-test-component',
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

describe('Create Utils', () => {
  it('Should call k8s create util with correct model and data for application', () => {
    createApplication('Test Application', 'test-ns');

    expect(k8sUtil.k8sCreateResource).toHaveBeenCalledWith({
      model: ApplicationModel,
      data: mockApplicationRequestData,
    });
  });

  it('Should call k8s create util with correct model and data for component', () => {
    createComponent(mockComponent, 'test-application', 'test-ns');

    expect(k8sUtil.k8sCreateResource).toHaveBeenCalledWith({
      model: ComponentModel,
      data: mockComponentData,
    });
  });
});
