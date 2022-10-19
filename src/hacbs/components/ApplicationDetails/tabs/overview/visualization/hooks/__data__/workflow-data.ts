import { PipelineRunKind } from '../../../../../../../../shared/components/pipeline-run-logs/types';
import { ComponentKind } from '../../../../../../../../types';
import {
  EnvironmentKind,
  IntegrationTestScenarioKind,
  ReleasePlanKind,
} from '../../../../../../../types/coreBuildService';

export const sampleBuildPipelines: PipelineRunKind[] = [
  {
    apiVersion: 'tekton.dev/v1beta1',
    kind: 'PipelineRun',
    metadata: {
      name: '1-nodejs-2bwzn',
      uid: '94c9a362-f5a5-4e67-b642-c61c6d1134dc',
      namespace: 'karthik-jk',
      labels: {
        'build.appstudio.openshift.io/component': '1-nodejs',
        'pipelines.openshift.io/runtime': 'generic',
        'pipelines.openshift.io/strategy': 'docker',
        'tekton.dev/pipeline': 'docker-build',
        'pipelines.openshift.io/used-by': 'build-cloud',
        'pipelinesascode.tekton.dev/sha': '010101010110',
        'build.appstudio.openshift.io/build': 'true',
        'build.appstudio.openshift.io/application': 'frontend-app',
        'build.appstudio.openshift.io/type': 'build',
        'pipelines.appstudio.openshift.io/type': 'build',
        'build.appstudio.openshift.io/version': '0.1',
      },
      annotations: {
        'build.appstudio.openshift.io/component': '1-nodejs',
        'pipelines.openshift.io/runtime': 'generic',
      },
    },
    spec: {
      params: [
        {
          name: 'git-url',
          value: 'https://github.com/karthikjeeyar/demo-app',
        },
        {
          name: 'output-image',
          value: '',
        },
        {
          name: 'dockerfile',
          value: 'Dockerfile',
        },
        {
          name: 'path-context',
          value: '.',
        },
      ],
      pipelineRef: {
        bundle:
          'quay.io/redhat-appstudio/build-templates-bundle:19cf17aa63a1c65eee897af8430dbb9c1682d77a',
        name: 'docker-build',
      },
      serviceAccountName: 'pipeline',
      timeout: '1h0m0s',
      workspaces: [
        {
          name: 'workspace',
          persistentVolumeClaim: {
            claimName: 'appstudio',
          },
          subPath: '1-nodejs/initialbuild-2022-Feb-13_12-39-17',
        },
        {
          name: 'registry-auth',
          secret: {
            secretName: 'redhat-appstudio-registry-pull-secret',
          },
        },
      ],
    },
    status: {
      pipelineSpec: {
        tasks: [],
      },
      conditions: [
        {
          message: 'failed to create task run pod "1-nodejs-2bwzn-show-summary',
          status: 'False',
          type: 'Succeeded',
        },
      ],
      taskRuns: {
        '1-nodejs-2bwzn-show-summary': {
          pipelineTaskName: 'show-summary',
          status: {
            completionTime: '2022-08-23T19:08:18Z',
            conditions: [
              {
                lastTransitionTime: '2022-08-23T19:08:18Z',
                message:
                  'failed to create task run pod "1-nodejs-2bwzn-show-summary": Pod "1-nodejs-2bwzn-show-summary-pod" is invalid: spec.activeDeadlineSeconds: Invalid value: 0: must be between 1 and 2147483647, inclusive. Maybe missing or invalid Task mfrances/summary',
                reason: 'CouldntGetTask',
                status: 'False',
                type: 'Succeeded',
              },
            ],
            podName: '',
            startTime: '2022-08-23T19:08:18Z',
            taskSpec: {
              description: 'App Studio Summary Pipeline Task.',
              params: [
                {
                  description: 'pipeline-run to annotate',
                  name: 'pipeline-run-name',
                  type: 'string',
                },
                {
                  description: 'Git URL',
                  name: 'git-url',
                  type: 'string',
                },
                {
                  description: 'Image URL',
                  name: 'image-url',
                  type: 'string',
                },
              ],
              steps: [
                {
                  image:
                    'registry.redhat.io/openshift4/ose-cli@sha256:e6b307c51374607294d1756b871d3c702251c396efdd44d4ef8db68e239339d3',
                  name: 'appstudio-summary',
                  resources: {},
                  script: [
                    '#!/usr/bin/env bash\necho\necho "App Studio Build Summary:"\necho\necho "Build repository: $(params.git-url)"\necho "Generated Image is in : $(params.image-url)"\necho\noc annotate pipelinerun $(params.pipeline-run-name) build.appstudio.openshift.io/repo=$(params.git-url)\noc annotate pipelinerun $(params.pipeline-run-name) build.appstudio.openshift.io/image=$(params.image-url)\n\necho "Output is in the following annotations:"\n\necho "Build Repo is in \'build.appstudio.openshift.io/repo\' "\necho \'oc get pr $(params.pipeline-run-name) -o jsonpath="{.metadata.annotations.build\\.appstudio\\.openshift\\.io/repo}"\'\n\necho "Build Image is in \'build.appstudio.openshift.io/image\' "\necho \'oc get pr $(params.pipeline-run-name) -o jsonpath="{.metadata.annotations.build\\.appstudio\\.openshift\\.io/image}"\'\n\necho End Summary\n',
                  ],
                },
              ],
            },
          },
        },
      },
    },
  },
  {
    apiVersion: 'tekton.dev/v1beta1',
    kind: 'PipelineRun',
    metadata: {
      name: '1-nodejs-2bwzn',
      uid: '94c9a362-f5a5-4e67-b642-c61c6d1134dc',
      namespace: 'karthik-jk',
      labels: {
        'build.appstudio.openshift.io/component': '1-nodejs',
        'pipelines.openshift.io/runtime': 'generic',
        'pipelines.openshift.io/strategy': 'docker',
        'tekton.dev/pipeline': 'docker-build',
        'pipelines.openshift.io/used-by': 'build-cloud',
        'build.appstudio.openshift.io/build': 'true',
        'build.appstudio.openshift.io/application': 'frontend-app',
        'build.appstudio.openshift.io/type': 'build',
        'pipelines.appstudio.openshift.io/type': 'build',
        'build.appstudio.openshift.io/version': '0.1',
        'pipelinesascode.tekton.dev/sha': '010101010110',
      },
      annotations: {
        'build.appstudio.openshift.io/component': '1-nodejs',
        'pipelines.openshift.io/runtime': 'generic',
      },
    },
    spec: {
      params: [
        {
          name: 'git-url',
          value: 'https://github.com/karthikjeeyar/demo-app',
        },
        {
          name: 'output-image',
          value: '',
        },
        {
          name: 'dockerfile',
          value: 'Dockerfile',
        },
        {
          name: 'path-context',
          value: '.',
        },
      ],
      pipelineRef: {
        bundle:
          'quay.io/redhat-appstudio/build-templates-bundle:19cf17aa63a1c65eee897af8430dbb9c1682d77a',
        name: 'docker-build',
      },
      serviceAccountName: 'pipeline',
      timeout: '1h0m0s',
      workspaces: [
        {
          name: 'workspace',
          persistentVolumeClaim: {
            claimName: 'appstudio',
          },
          subPath: '1-nodejs/initialbuild-2022-Feb-13_12-39-17',
        },
        {
          name: 'registry-auth',
          secret: {
            secretName: 'redhat-appstudio-registry-pull-secret',
          },
        },
      ],
    },
  },
];

export const sampleComponents: ComponentKind[] = [
  {
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    kind: 'Component',
    metadata: {
      annotations: {
        'com.redhat.appstudio/component-initial-build-happend': 'true',
        'com.redhat.appstudio/component-initial-build-processed': 'true',
      },
      name: '1-nodejs',
      uid: '585309d5-6156-427b-8fd3-ea55cb1b2606',
    },
    spec: {
      application: 'frontend-app',
      componentName: '1-nodejs',
      containerImage: 'quay.io/redhat-appstudio/user-workload:karthik-jk-1-nodejs',
      replicas: 1,
      resources: {
        requests: {
          cpu: '1',
          memory: '1Gi',
        },
      },
      source: {
        git: {
          devfileUrl: 'https://registry.devfile.io/devfiles/nodejs-basic',
          url: 'https://github.com/karthikjeeyar/demo-app',
        },
      },
      targetPort: 3000,
    },
    status: {
      conditions: [
        {
          lastTransitionTime: '2022-05-13T12:39:17Z',
          message: 'Component has been successfully created',
          reason: 'OK',
          status: 'True',
          type: 'Created',
        },
        {
          lastTransitionTime: '2022-06-06T14:22:46Z',
          message: 'Component has been successfully updated',
          reason: 'OK',
          status: 'True',
          type: 'Updated',
        },
      ],
      containerImage: 'quay.io/redhat-appstudio/user-workload:karthik-jk-1-nodejs',
      devfile:
        "commands:\n- attributes:\n    api.devfile.io/imported-from: 'id: nodejs, registryURL: https://registry.devfile.io'\n  exec:\n    commandLine: npm install\n    component: runtime\n    group:\n      isDefault: true\n      kind: build\n    hotReloadCapable: false\n    workingDir: ${PROJECT_SOURCE}\n  id: install\n- attributes:\n    api.devfile.io/imported-from: 'id: nodejs, registryURL: https://registry.devfile.io'\n  exec:\n    commandLine: npm start\n    component: runtime\n    group:\n      isDefault: true\n      kind: run\n    hotReloadCapable: false\n    workingDir: ${PROJECT_SOURCE}\n  id: run\n- attributes:\n    api.devfile.io/imported-from: 'id: nodejs, registryURL: https://registry.devfile.io'\n  exec:\n    commandLine: npm run debug\n    component: runtime\n    group:\n      isDefault: true\n      kind: debug\n    hotReloadCapable: false\n    workingDir: ${PROJECT_SOURCE}\n  id: debug\n- attributes:\n    api.devfile.io/imported-from: 'id: nodejs, registryURL: https://registry.devfile.io'\n  exec:\n    commandLine: npm test\n    component: runtime\n    group:\n      isDefault: true\n      kind: test\n    hotReloadCapable: false\n    workingDir: ${PROJECT_SOURCE}\n  id: test\n- apply:\n    component: outerloop-build\n  id: build-image\n- apply:\n    component: outerloop-deploy\n  id: deployk8s\n- composite:\n    commands:\n    - build-image\n    - deployk8s\n    group:\n      isDefault: true\n      kind: deploy\n    parallel: false\n  id: deploy\ncomponents:\n- attributes:\n    api.devfile.io/imported-from: 'id: nodejs, registryURL: https://registry.devfile.io'\n    appstudio.has/replicas: 1\n  container:\n    cpuRequest: \"1\"\n    dedicatedPod: true\n    endpoints:\n    - name: http-3000\n      secure: false\n      targetPort: 3000\n    image: registry.access.redhat.com/ubi8/nodejs-14:latest\n    memoryLimit: 1024Mi\n    memoryRequest: 1Gi\n    mountSources: true\n  name: runtime\n- image:\n    dockerfile:\n      buildContext: .\n      rootRequired: false\n      uri: Dockerfile\n    imageName: nodejs-image:latest\n  name: outerloop-build\n- attributes:\n    deployment/container-port: 3000\n    deployment/cpuRequest: \"1\"\n    deployment/memoryRequest: 1Gi\n    deployment/replicas: 1\n    deployment/storageRequest: \"0\"\n  kubernetes:\n    uri: outerloop-deploy.yaml\n  name: outerloop-deploy\nmetadata:\n  attributes:\n    alpha.dockerimage-port: 3001\n  description: Stack with Node.js 14\n  displayName: Node.js Runtime\n  language: nodejs\n  name: nodejs\n  projectType: nodejs\n  provider: Red Hat\n  supportUrl: https://github.com/devfile-samples/devfile-support#support-information\n  tags:\n  - NodeJS\n  - Express\n  - ubi8\n  version: 1.0.1\nschemaVersion: 2.2.0\nstarterProjects:\n- attributes:\n    api.devfile.io/imported-from: 'id: nodejs, registryURL: https://registry.devfile.io'\n  git:\n    remotes:\n      origin: https://github.com/odo-devfiles/nodejs-ex.git\n  name: nodejs-starter\n",
      gitops: {
        repositoryURL:
          'https://github.com/redhat-appstudio-appdata/frontend-app-karthik-jk-be-involvement',
      },
    },
  },
];

export const sampleEnvironments: EnvironmentKind[] = [
  {
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    kind: 'Environment',
    metadata: {
      name: 'test-environment',
      uid: '210d9440-2ebf-49c7-a6df-1fa5d21cb111',
    },
    spec: {
      configuration: {
        env: [
          {
            name: 'env',
            value: 'test',
          },
        ],
      },
      deploymentStrategy: 'Manual',
      displayName: 'Test Environment',
      tags: ['test'],
      type: 'poc',
    },
  },
  {
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    kind: 'Environment',
    metadata: {
      name: 'staging-environment',
      uid: '210d9440-2ebf-49c7-a6df-1fa5d21cb111',
    },
    spec: {
      configuration: {
        env: [
          {
            name: 'env',
            value: 'stage',
          },
        ],
      },
      parentEnvironment: 'test-environment',
      deploymentStrategy: 'Manual',
      displayName: 'Staging Environment',
      tags: ['stage'],
      type: 'poc',
    },
  },
  {
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    kind: 'Environment',
    metadata: {
      name: 'production-environment',
      uid: '210d9440-2ebf-49c7-a6df-1fa5d21cb111',
    },
    spec: {
      configuration: {
        env: [
          {
            name: 'env',
            value: 'prod',
          },
        ],
      },
      parentEnvironment: 'staging-environment',
      deploymentStrategy: 'Manual',
      displayName: 'Staging Environment',
      tags: ['prod'],
      type: 'poc',
    },
  },
];

export const sampleEnvironmentsWithInvalidParentEnvironment: EnvironmentKind[] = [
  ...sampleEnvironments,
  {
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    kind: 'Environment',
    metadata: {
      name: 'testing-environment',
      uid: '210d9440-2ebf-49c7-a6df-1fa5d21cb111',
    },
    spec: {
      configuration: {
        env: [
          {
            name: 'env',
            value: 'prod',
          },
        ],
      },
      parentEnvironment: 'invalid-environment',
      deploymentStrategy: 'Manual',
      displayName: 'Staging Environment',
      tags: ['prod'],
      type: 'poc',
    },
  },
];

export const sampleIntegrationTestScenarios: IntegrationTestScenarioKind[] = [
  {
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    kind: 'IntegrationTestScenario',
    metadata: {
      name: 'app-integration-test',
      uid: 'df7988a5-0ff4-4f65-b794-8874af3d3094',
    },
    spec: {
      application: 'frontend-app',
      bundle: 'quay.io/kpavic/test-bundle:pipeline',
      contexts: [
        {
          description: 'Runs only during application testing',
          name: 'application',
        },
      ],
      environment: {
        name: 'test-environment',
        params: [],
        type: 'workspace',
      },
      params: [
        {
          name: 'test-param',
          value: ['test'],
        },
      ],
      pipeline: 'demo-pipeline',
    },
  },
  {
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    kind: 'IntegrationTestScenario',
    metadata: {
      name: 'component-integration-test',
      uid: 'df7988a5-0ff4-4f65-b794-8874af3d3094',
    },
    spec: {
      application: 'frontend-app',
      bundle: 'quay.io/kpavic/test-bundle:pipeline',
      contexts: [
        {
          description: 'Runs only during application testing',
          name: 'component',
        },
      ],
      environment: {
        name: 'test-environment',
        params: [],
        type: 'workspace',
      },
      params: [
        {
          name: 'test-param',
          value: ['test'],
        },
      ],
      pipeline: 'demo-pipeline',
    },
  },
];

export const sampleReleasePlans: ReleasePlanKind[] = [
  {
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    kind: 'ReleasePlan',
    metadata: {
      name: 'm5-release-link-managed',
      namespace: 'managed',
    },
    spec: {
      displayName: "Managed Workspace's ReleasePlan",
      application: 'm5-app',
      target: {
        namespace: 'demo',
      },
      releaseStrategy: 'm5-strategy',
    },
  },
];
