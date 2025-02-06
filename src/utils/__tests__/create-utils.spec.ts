import {
  k8sCreateResource,
  k8sGetResource,
  k8sUpdateResource,
  commonFetch,
} from '@openshift/dynamic-plugin-sdk-utils';
import omit from 'lodash/omit';
import { THUMBNAIL_ANNOTATION } from '../../components/ApplicationDetails/ApplicationThumbnail';
import { linkSecretToServiceAccount } from '../../components/Secrets/utils/service-account-utils';
import { SPIAccessTokenBindingModel } from '../../models';
import {
  AddSecretFormValues,
  ComponentDetectionQueryKind,
  SPIAccessTokenBindingKind,
  SecretFor,
  SecretTypeDropdownLabel,
  SourceSecretType,
} from '../../types';
import { ApplicationModel } from './../../models/application';
import { ComponentDetectionQueryModel, ComponentModel } from './../../models/component';
import { ComponentKind, ComponentSpecs } from './../../types/component';
import {
  createApplication,
  createComponent,
  createComponentDetectionQuery,
  createAccessTokenBinding,
  sanitizeName,
  createSecret,
  addSecret,
} from './../create-utils';

jest.mock('@openshift/dynamic-plugin-sdk-utils');

jest.mock('../../components/Secrets/utils/service-account-utils', () => {
  return { linkSecretToServiceAccount: jest.fn() };
});

const createResourceMock = k8sCreateResource as jest.Mock;
const getResourceMock = k8sGetResource as jest.Mock;
const commonFetchMock = commonFetch as jest.Mock;
const linkSecretToServiceAccountMock = linkSecretToServiceAccount as jest.Mock;

jest.mock('../../components/ApplicationDetails/ApplicationThumbnail', () => {
  const actual = jest.requireActual('../../components/ApplicationDetails/ApplicationThumbnail');
  return { ...actual, getRandomSvgNumber: () => 7 };
});

const mockApplicationRequestData = {
  apiVersion: `${ApplicationModel.apiGroup}/${ApplicationModel.apiVersion}`,
  kind: ApplicationModel.kind,
  metadata: {
    name: 'test-application',
    namespace: 'test-ns',
    annotations: {
      [THUMBNAIL_ANNOTATION]: '7',
    },
  },
  spec: {
    displayName: 'test-application',
  },
};

const mockComponent: ComponentSpecs = {
  componentName: 'Test Component',
  application: 'test-application',
  source: {
    git: {
      url: 'http://github.com/test-repo',
    },
  },
};

const mockComponentWithDevfile = {
  ...mockComponent,
  source: {
    git: {
      ...mockComponent.source.git,
      devfileUrl: 'https://registry.devfile.io/sample-devfile',
    },
  },
};

const mockComponentData: ComponentKind = {
  apiVersion: `${ComponentModel.apiGroup}/${ComponentModel.apiVersion}`,
  kind: ComponentModel.kind,
  metadata: {
    name: 'test-component',
    namespace: 'test-ns',
    annotations: {
      'build.appstudio.openshift.io/request': 'configure-pac',
    },
  },
  spec: {
    componentName: mockComponent.componentName,
    application: 'test-application',
    source: {
      git: { url: mockComponent.source.git.url },
    },
    containerImage: undefined,
    env: undefined,
    replicas: undefined,
    resources: undefined,
    secret: undefined,
  },
};

const mockComponentDataWithDevfile: ComponentKind = {
  ...mockComponentData,
  spec: {
    ...mockComponentData.spec,
    source: {
      git: {
        url: mockComponent.source.git.url,
        devfileUrl: 'https://registry.devfile.io/sample-devfile',
      },
    },
  },
};

const mockComponentDataWithoutAnnotation = omit(
  mockComponentDataWithDevfile,
  'metadata.annotations',
);

const mockComponentDataWithPAC = {
  ...mockComponentDataWithDevfile,
  metadata: {
    ...mockComponentDataWithDevfile.metadata,
    annotations: {
      'build.appstudio.openshift.io/request': 'configure-pac',
    },
  },
};

const mockCDQData: ComponentDetectionQueryKind = {
  apiVersion: `${ComponentDetectionQueryModel.apiGroup}/${ComponentDetectionQueryModel.apiVersion}`,
  kind: ComponentDetectionQueryModel.kind,
  metadata: {
    namespace: 'test-ns',
    name: expect.any(String),
  },
  spec: {
    git: { url: 'https://github.com/test/repository' },
  },
};

const mockAccessTokenBinding: SPIAccessTokenBindingKind = {
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

const addSecretFormValues: AddSecretFormValues = {
  type: 'Image pull secret',
  name: 'test',
  secretFor: SecretFor.Build,
  opaque: {
    keyValues: [
      {
        key: 'test',
        value: 'dGVzdA==',
      },
    ],
  },
  image: {
    authType: 'Image registry credentials',
    registryCreds: [
      {
        registry: 'test.io',
        username: 'test',
        password: 'test',
        email: 'test@test.com',
      },
    ],
  },
  source: {
    authType: 'Basic authentication',
    username: 'test',
    password: 'test',
  },
  labels: [{ key: 'test', value: 'test' }],
};
describe('Create Utils', () => {
  it('Should call k8s create util with correct model and data for application', async () => {
    await createApplication('test-application', 'test-ns');

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

  it('Should create component with target port', async () => {
    const mockComponentDataWithTargetPort = {
      ...mockComponent,
      targetPort: 8080,
    };
    await createComponent(mockComponentDataWithTargetPort, 'test-application', 'test-ns');

    expect(k8sCreateResource).toHaveBeenCalledWith({
      model: ComponentModel,
      queryOptions: {
        name: 'test-component',
        ns: 'test-ns',
      },
      resource: {
        ...mockComponentData,
        spec: {
          ...mockComponentData.spec,
          targetPort: 8080,
        },
      },
    });
  });

  it('Should create component without target port, if it is not passed', async () => {
    const mockComponentDataWithoutTargetPort = {
      ...mockComponent,
      targetPort: undefined,
    };
    await createComponent(mockComponentDataWithoutTargetPort, 'test-application', 'test-ns');

    expect(k8sCreateResource).toHaveBeenCalledWith({
      model: ComponentModel,
      queryOptions: {
        name: 'test-component',
        ns: 'test-ns',
      },
      resource: mockComponentData,
    });
  });

  it('Should call k8s create util with pipelines-as-code annotations', async () => {
    await createComponent(
      mockComponentWithDevfile,
      'test-application',
      'test-ns',
      undefined,
      false,
      null,
      'create',
      true,
    );

    expect(k8sCreateResource).toHaveBeenCalledWith({
      model: ComponentModel,
      queryOptions: {
        name: 'test-component',
        ns: 'test-ns',
      },
      resource: mockComponentDataWithPAC,
    });
  });

  it('Should not update pipelines-as-code annotations for the existing components without pac annotations', async () => {
    await createComponent(
      mockComponentWithDevfile,
      'test-application',
      'test-ns',
      undefined,
      false,
      mockComponentDataWithDevfile,
      'update',
      true,
    );

    expect(k8sUpdateResource).toHaveBeenCalledWith({
      model: ComponentModel,
      resource: mockComponentDataWithDevfile,
    });
  });

  it('Should not add skip-initial-checks annotations while updating existing components', async () => {
    await createComponent(
      mockComponentWithDevfile,
      'test-application',
      'test-ns',
      undefined,
      false,
      mockComponentDataWithoutAnnotation,
      'update',
      false,
    );

    expect(k8sUpdateResource).toHaveBeenCalledWith({
      model: ComponentModel,
      resource: mockComponentDataWithoutAnnotation,
    });
  });

  it('Should contain pipelines-as-code annotations for the existing components with pac annotations', async () => {
    await createComponent(
      mockComponentWithDevfile,
      'test-application',
      'test-ns',
      undefined,
      false,
      mockComponentDataWithPAC,
      'update',
      true,
    );

    expect(k8sUpdateResource).toHaveBeenCalledWith({
      model: ComponentModel,
      resource: mockComponentDataWithPAC,
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

  it('Should delete the environment variables while updating', async () => {
    const oldComponentSpecWithEnv = {
      ...mockComponentData,
      spec: {
        ...mockComponentData.spec,
        env: [{ name: 'env', value: 'test' }],
      },
    };

    const updatedComponentWithoutEnv = {
      ...mockComponentData.spec,
      env: undefined,
    };

    await createComponent(
      updatedComponentWithoutEnv,
      'test-application',
      'test-ns',
      '',
      false,
      oldComponentSpecWithEnv,
      'update',
    );
    expect(k8sUpdateResource).toHaveBeenCalledWith({
      model: ComponentModel,
      resource: expect.objectContaining({
        spec: expect.objectContaining({ env: undefined }),
      }),
    });
  });

  it('Should update the environment variables with new values', async () => {
    const oldComponentSpecWithEnv = {
      ...mockComponentData,
      spec: {
        ...mockComponentData.spec,
        env: [{ name: 'old-key', value: 'old-value' }],
      },
    };

    const updatedComponentWithoutEnv = {
      ...mockComponentData.spec,
      env: [{ name: 'new-key', value: 'new-value' }],
    };

    await createComponent(
      updatedComponentWithoutEnv,
      'test-application',
      'test-ns',
      '',
      false,
      oldComponentSpecWithEnv,
      'update',
    );
    expect(k8sUpdateResource).toHaveBeenCalledWith({
      model: ComponentModel,
      resource: expect.objectContaining({
        spec: expect.objectContaining({
          env: expect.arrayContaining([
            expect.not.objectContaining({
              name: 'old-key',
              value: 'old-value',
            }),
            expect.objectContaining({
              name: 'new-key',
              value: 'new-value',
            }),
          ]),
        }),
      }),
    });
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

    await createComponentDetectionQuery('https://github.com/test/repository', 'test-ns');

    expect(k8sCreateResource).toHaveBeenCalledWith({
      model: ComponentDetectionQueryModel,
      queryOptions: {
        name: expect.stringContaining('cdq'),
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

  it('should sanize spaces in resource names', () => {
    expect(sanitizeName('my app')).toBe('my-app');
    expect(sanitizeName('my-app')).toBe('my-app');
    // does not handle special characters
    expect(sanitizeName('!  @  #')).toBe('!--@--#');
  });

  it('should call the create secret api with dryRun query string params', async () => {
    createResourceMock.mockClear().mockImplementationOnce((props) => Promise.resolve(props));
    commonFetchMock.mockClear().mockImplementation((props) => Promise.resolve(props));

    await createSecret(
      {
        secretName: 'my-snyk-secret',
        type: SecretTypeDropdownLabel.opaque,
        opaque: { keyValues: [{ key: 'token', value: 'my-token-data' }] },
      },
      'test-ws',
      'test-ns',
      true,
    );

    expect(commonFetchMock).toHaveBeenCalledTimes(1);

    expect(commonFetchMock).toHaveBeenCalledWith(
      '/workspaces/test-ws/api/v1/namespaces/test-ns/secrets?dryRun=All',
      expect.objectContaining({
        body: expect.stringContaining('"kind":"Secret"'),
      }),
    );
  });

  it('should create a key/value secret', async () => {
    commonFetchMock.mockClear();
    commonFetchMock.mockImplementationOnce((props) => Promise.resolve(props));

    await createSecret(
      {
        secretName: 'my-snyk-secret',
        type: SecretTypeDropdownLabel.opaque,
        opaque: { keyValues: [{ key: 'token', value: 'my-token-data' }] },
      },
      'test-ws',
      'test-ns',
      false,
    );

    expect(commonFetchMock).toHaveBeenCalledTimes(1);

    expect(commonFetchMock).toHaveBeenCalledWith(
      '/workspaces/test-ws/api/v1/namespaces/test-ns/secrets',
      expect.objectContaining({
        body: expect.stringContaining('"type":"Opaque"'),
      }),
    );
  });

  it('should create a Image pull secret', async () => {
    commonFetchMock.mockClear();
    commonFetchMock.mockImplementationOnce((props) => Promise.resolve(props));

    await createSecret(
      {
        secretName: 'registry-creds',
        type: SecretTypeDropdownLabel.image,
        image: { keyValues: [{ key: 'token', value: 'my-token-data' }] },
      },
      'test-ws',
      'test-ns',
      false,
    );

    expect(commonFetchMock).toHaveBeenCalledTimes(1);

    expect(commonFetchMock).toHaveBeenCalledWith(
      '/workspaces/test-ws/api/v1/namespaces/test-ns/secrets',
      expect.objectContaining({
        body: expect.stringContaining('"type":"kubernetes.io/dockerconfigjson"'),
      }),
    );
  });

  it('should add correct values for Image pull secret', async () => {
    commonFetchMock.mockClear();
    commonFetchMock.mockImplementationOnce((props) => Promise.resolve(props));

    await createSecret(
      {
        secretName: 'registry-creds',
        type: SecretTypeDropdownLabel.image,
        image: { keyValues: [{ key: 'test', value: 'test-value' }] },
      },
      'test-ws',
      'test-ns',
      false,
    );

    expect(commonFetchMock).toHaveBeenCalledTimes(1);

    expect(commonFetchMock).toHaveBeenCalledWith(
      '/workspaces/test-ws/api/v1/namespaces/test-ns/secrets',
      expect.objectContaining({
        body: expect.stringContaining('"test":"test-value"'),
      }),
    );
  });

  it('should create a Source secret', async () => {
    commonFetchMock.mockClear();
    commonFetchMock.mockImplementationOnce((props) => Promise.resolve(props));

    await createSecret(
      {
        secretName: 'registry-creds',
        type: SecretTypeDropdownLabel.source,
        source: { authType: SourceSecretType.basic, username: 'test1', password: 'pass-test' },
      },
      'test-ws',
      'test-ns',
      false,
    );

    expect(commonFetchMock).toHaveBeenCalledTimes(1);

    expect(commonFetchMock).toHaveBeenCalledWith(
      '/workspaces/test-ws/api/v1/namespaces/test-ns/secrets',
      expect.objectContaining({
        body: expect.stringContaining('"type":"kubernetes.io/basic-auth"'),
      }),
    );
  });

  it('should add correct data for Source secret', async () => {
    commonFetchMock.mockClear();
    commonFetchMock.mockImplementationOnce((props) => Promise.resolve(props));

    await createSecret(
      {
        secretName: 'registry-creds',
        type: SecretTypeDropdownLabel.source,
        source: { authType: SourceSecretType.basic, username: 'test1', password: 'pass-test' },
      },
      'test-ws',
      'test-ns',
      false,
    );

    expect(commonFetchMock).toHaveBeenCalledTimes(1);

    expect(commonFetchMock).toHaveBeenCalledWith(
      '/workspaces/test-ws/api/v1/namespaces/test-ns/secrets',
      expect.objectContaining({
        body: expect.stringContaining('"username":"dGVzdDE=","password":"cGFzcy10ZXN0"'),
      }),
    );
  });

  it('should create partner task secret', async () => {
    commonFetchMock.mockClear();
    createResourceMock
      .mockClear()
      .mockImplementationOnce((props) => Promise.resolve(props))
      .mockImplementationOnce((props) => Promise.resolve(props));

    await createSecret(
      {
        secretName: 'snyk-secret',
        type: SecretTypeDropdownLabel.opaque,
        opaque: { keyValues: [{ key: 'token', value: 'my-token-data' }] },
      },
      'test-ws',
      'test-ns',
      false,
    );

    expect(commonFetchMock).toHaveBeenCalled();
  });
  it('should add secret', async () => {
    commonFetchMock.mockClear();
    await addSecret(addSecretFormValues, 'test-ws', 'test-ns');
    expect(commonFetchMock).toHaveBeenCalled();

    expect(commonFetchMock).toHaveBeenCalledWith(
      '/workspaces/test-ws/api/v1/namespaces/test-ns/secrets',
      expect.objectContaining({
        body: expect.stringContaining('"type":"kubernetes.io/dockerconfigjson"'),
      }),
    );
  });

  it('should call linkToServiceAccount For image pull secrets', async () => {
    linkSecretToServiceAccountMock.mockClear();
    await addSecret(addSecretFormValues, 'test-ws', 'test-ns');
    expect(linkSecretToServiceAccountMock).toHaveBeenCalled();
    expect(linkSecretToServiceAccountMock).toHaveBeenCalledWith(
      expect.objectContaining({ metadata: expect.objectContaining({ name: 'test' }) }),
      'test-ns',
    );
  });
});
