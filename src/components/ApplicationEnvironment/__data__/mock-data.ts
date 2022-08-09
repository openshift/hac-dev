import { ComponentKind, EnvironmentKind } from '../../../types';

export const mockApplication = {
  apiVersion: 'appstudio.redhat.com/v1alpha1',
  kind: 'Application',
  metadata: {
    annotations: {
      finalizeCount: '0',
    },
    creationTimestamp: '2022-04-11T19:36:25Z',
    finalizers: ['application.appstudio.redhat.com/finalizer'],
    generation: 1,
    name: 'test-application',
    namespace: 'rorai',
    resourceVersion: '357091606',
    uid: '400b639d-826d-4071-bfcd-fb142fb9a80c',
  },
  spec: {
    appModelRepository: {
      url: '',
    },
    displayName: 'Test Application',
    gitOpsRepository: {
      url: '',
    },
  },
  status: {
    conditions: [
      {
        lastTransitionTime: '2022-04-11T19:36:26Z',
        message: 'Application has been successfully created',
        reason: 'OK',
        status: 'True',
        type: 'Created',
      },
    ],
    devfile:
      'metadata:\n  attributes:\n    appModelRepository.url: https://github.com/redhat-appstudio-appdata/test-application-rorai-hold-control\n    gitOpsRepository.url: https://github.com/redhat-appstudio-appdata/test-application-rorai-hold-control\n  name: Test Application\nprojects:\n- git:\n    remotes:\n      origin: https://github.com/nodeshift-starters/devfile-sample\n  name: nodejs\nschemaVersion: 2.1.0\n',
  },
};

export const mockEnvironment: EnvironmentKind = {
  apiVersion: 'appstudio.redhat.com/v1alpha1',
  kind: 'environment',
  metadata: { name: 'production' },
  spec: { displayName: 'Production' },
};

export const mockComponents: ComponentKind[] = [
  {
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    kind: 'Component',
    metadata: {
      name: 'basic-node-js',
      namespace: 'sbudhwar-1',
      uid: 'bdec6527-db16-43da-9300-3a20d180e020',
    },
    spec: {
      application: 'test-application',
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
  },
  {
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    kind: 'Component',
    metadata: {
      name: 'nodejs',
      namespace: 'rorai',
      uid: '5a14d4b4-480b-4ca5-b7ab-10c2cfffd3d9',
    },
    spec: {
      application: 'test-application',
      build: {
        containerImage: '',
      },
      componentName: 'nodejs',
      replicas: 1,
      resources: {
        requests: {
          cpu: '0',
          memory: '1Gi',
        },
      },
      source: {
        git: {
          url: 'https://github.com/nodeshift-starters/devfile-sample',
        },
      },
      targetPort: 3000,
    },
    status: {
      conditions: [
        {
          lastTransitionTime: '2022-04-11T19:36:28Z',
          message: 'Component has been successfully created',
          reason: 'OK',
          status: 'True',
          type: 'Created',
        },
      ],
      containerImage: 'quay.io/redhat-appstudio/user-workload:rorai-nodejs',
      devfile:
        "commands:\n- attributes:\n    api.devfile.io/imported-from: 'id: nodejs, registryURL: https://registry.devfile.io'\n  exec:\n    commandLine: npm install\n    component: runtime\n    group:\n      isDefault: true\n      kind: build\n    hotReloadCapable: false\n    workingDir: ${PROJECT_SOURCE}\n  id: install\n- attributes:\n    api.devfile.io/imported-from: 'id: nodejs, registryURL: https://registry.devfile.io'\n  exec:\n    commandLine: npm start\n    component: runtime\n    group:\n      isDefault: true\n      kind: run\n    hotReloadCapable: false\n    workingDir: ${PROJECT_SOURCE}\n  id: run\n- attributes:\n    api.devfile.io/imported-from: 'id: nodejs, registryURL: https://registry.devfile.io'\n  exec:\n    commandLine: npm run debug\n    component: runtime\n    group:\n      isDefault: true\n      kind: debug\n    hotReloadCapable: false\n    workingDir: ${PROJECT_SOURCE}\n  id: debug\n- attributes:\n    api.devfile.io/imported-from: 'id: nodejs, registryURL: https://registry.devfile.io'\n  exec:\n    commandLine: npm test\n    component: runtime\n    group:\n      isDefault: true\n      kind: test\n    hotReloadCapable: false\n    workingDir: ${PROJECT_SOURCE}\n  id: test\n- apply:\n    component: outerloop-build\n  id: build-image\n- apply:\n    component: outerloop-deploy\n  id: deployk8s\n- composite:\n    commands:\n    - build-image\n    - deployk8s\n    group:\n      isDefault: true\n      kind: deploy\n    parallel: false\n  id: deploy\ncomponents:\n- attributes:\n    api.devfile.io/imported-from: 'id: nodejs, registryURL: https://registry.devfile.io'\n    appstudio.has/replicas: 1\n  container:\n    cpuRequest: \"0\"\n    dedicatedPod: true\n    endpoints:\n    - name: http-3000\n      secure: false\n      targetPort: 3000\n    image: registry.access.redhat.com/ubi8/nodejs-14:latest\n    memoryLimit: 1024Mi\n    memoryRequest: 1Gi\n    mountSources: true\n  name: runtime\n- image:\n    dockerfile:\n      buildContext: .\n      rootRequired: false\n      uri: Dockerfile\n    imageName: nodejs-image:latest\n  name: outerloop-build\n- kubernetes:\n    uri: outerloop-deploy.yaml\n  name: outerloop-deploy\nmetadata:\n  attributes:\n    alpha.dockerimage-port: 3001\n  description: Stack with Node.js 14\n  displayName: Node.js Runtime\n  language: nodejs\n  name: nodejs\n  projectType: nodejs\n  provider: Red Hat\n  supportUrl: https://github.com/devfile-samples/devfile-support#support-information\n  tags:\n  - NodeJS\n  - Express\n  - ubi8\n  version: 1.0.1\nschemaVersion: 2.2.0\nstarterProjects:\n- attributes:\n    api.devfile.io/imported-from: 'id: nodejs, registryURL: https://registry.devfile.io'\n  git:\n    remotes:\n      origin: https://github.com/odo-devfiles/nodejs-ex.git\n  name: nodejs-starter\n",
      gitops: {
        repositoryURL:
          'https://github.com/redhat-appstudio-appdata/test-application-rorai-hold-control',
      },
    },
  },
];
