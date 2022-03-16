import { ComponentKind } from '../../../types';

export const componentCRMock: ComponentKind = {
  apiVersion: 'appstudio.redhat.com/v1alpha1',
  kind: 'Component',
  metadata: {
    creationTimestamp: '2022-03-16T04:45:08Z',
    generation: 1,
    managedFields: [
      {
        apiVersion: 'appstudio.redhat.com/v1alpha1',
        fieldsType: 'FieldsV1',
        fieldsV1: {
          'f:spec': {
            '.': {},
            'f:application': {},
            'f:componentName': {},
            'f:source': {
              '.': {},
              'f:git': {
                '.': {},
                'f:url': {},
              },
            },
          },
        },
        manager: 'Mozilla',
        operation: 'Update',
        time: '2022-03-16T04:45:08Z',
      },
      {
        apiVersion: 'appstudio.redhat.com/v1alpha1',
        fieldsType: 'FieldsV1',
        fieldsV1: {
          'f:status': {
            '.': {},
            'f:conditions': {},
            'f:containerImage': {},
            'f:devfile': {},
            'f:gitops': {
              '.': {},
              'f:repositoryURL': {},
            },
          },
        },
        manager: 'manager',
        operation: 'Update',
        subresource: 'status',
        time: '2022-03-16T04:45:09Z',
      },
    ],
    name: 'basic-node-js',
    namespace: 'sbudhwar-1',
    resourceVersion: '284043254',
    uid: 'bdec6527-db16-43da-9300-3a20d180e020',
  },
  spec: {
    application: 'purple-mermaid-app',
    build: {
      containerImage: '',
    },
    componentName: 'basic-node-js',
    resources: {},
    source: {
      git: {
        url: 'https://github.com/nodeshift-starters/devfile-sample.git',
      },
    },
  },
  status: {
    conditions: [
      {
        lastTransitionTime: '2022-03-16T04:45:09Z',
        message: 'Component has been successfully created',
        reason: 'OK',
        status: 'True',
        type: 'Created',
      },
    ],
    containerImage: 'quay.io/redhat-appstudio/user-workload:sbudhwar-1-basic-node-js',
    devfile:
      "commands:\n- attributes:\n    api.devfile.io/imported-from: 'id: nodejs, registryURL: https://registry.devfile.io'\n  exec:\n    commandLine: npm install\n    component: runtime\n    group:\n      isDefault: true\n      kind: build\n    hotReloadCapable: false\n    workingDir: ${PROJECT_SOURCE}\n  id: install\n- attributes:\n    api.devfile.io/imported-from: 'id: nodejs, registryURL: https://registry.devfile.io'\n  exec:\n    commandLine: npm start\n    component: runtime\n    group:\n      isDefault: true\n      kind: run\n    hotReloadCapable: false\n    workingDir: ${PROJECT_SOURCE}\n  id: run\n- attributes:\n    api.devfile.io/imported-from: 'id: nodejs, registryURL: https://registry.devfile.io'\n  exec:\n    commandLine: npm run debug\n    component: runtime\n    group:\n      isDefault: true\n      kind: debug\n    hotReloadCapable: false\n    workingDir: ${PROJECT_SOURCE}\n  id: debug\n- attributes:\n    api.devfile.io/imported-from: 'id: nodejs, registryURL: https://registry.devfile.io'\n  exec:\n    commandLine: npm test\n    component: runtime\n    group:\n      isDefault: true\n      kind: test\n    hotReloadCapable: false\n    workingDir: ${PROJECT_SOURCE}\n  id: test\n- apply:\n    component: outerloop-build\n  id: build-image\n- apply:\n    component: outerloop-deploy\n  id: deployk8s\n- composite:\n    commands:\n    - build-image\n    - deployk8s\n    group:\n      isDefault: true\n      kind: deploy\n    parallel: false\n  id: deploy\ncomponents:\n- attributes:\n    api.devfile.io/imported-from: 'id: nodejs, registryURL: https://registry.devfile.io'\n  container:\n    dedicatedPod: true\n    endpoints:\n    - name: http-3000\n      secure: false\n      targetPort: 3000\n    image: registry.access.redhat.com/ubi8/nodejs-14:latest\n    memoryLimit: 1024Mi\n    mountSources: true\n  name: runtime\n- image:\n    dockerfile:\n      buildContext: .\n      rootRequired: false\n      uri: Dockerfile\n    imageName: nodejs-image:latest\n  name: outerloop-build\n- kubernetes:\n    uri: outerloop-deploy.yaml\n  name: outerloop-deploy\nmetadata:\n  attributes:\n    alpha.dockerimage-port: 3001\n  description: Stack with Node.js 14\n  displayName: Node.js Runtime\n  language: nodejs\n  name: nodejs\n  projectType: nodejs\n  provider: Red Hat\n  supportUrl: https://github.com/devfile-samples/devfile-support#support-information\n  tags:\n  - NodeJS\n  - Express\n  - ubi8\n  version: 1.0.1\nschemaVersion: 2.2.0\nstarterProjects:\n- attributes:\n    api.devfile.io/imported-from: 'id: nodejs, registryURL: https://registry.devfile.io'\n  git:\n    remotes:\n      origin: https://github.com/odo-devfiles/nodejs-ex.git\n  name: nodejs-starter\n",
    gitops: {
      repositoryURL:
        'https://github.com/redhat-appstudio-appdata/purple-mermaid-app-sbudhwar-1-research-fig',
    },
  },
};
