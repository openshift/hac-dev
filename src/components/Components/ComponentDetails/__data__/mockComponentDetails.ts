import { ComponentKind, RouteKind } from '../../../../types';

export const mockComponent: ComponentKind = {
  apiVersion: 'appstudio.redhat.com/v1alpha1',
  kind: 'Component',
  metadata: {
    annotations: {
      applicationFailCounter: '0',
    },
    name: 'human-resources',
    uid: 'fbc4b7fa-a9c5-4458-bac5-a158e28ad7f9',
    creationTimestamp: '2023-07-06T18:04:40Z',
    namespace: 'test-ns',
  },
  spec: {
    application: 'test-application',
    componentName: 'human-resources',
    containerImage:
      'quay.io/redhat-user-workloads-stage/test-ns/test-application/human-resources@sha256:6abea50ce7c0fd7f6f8dc83913d7b47e31612ed81a00d7ce3a7dc4ffe406a830',
    replicas: 1,
    resources: {
      requests: {
        cpu: '10m',
        memory: '180Mi',
      },
    },
    source: {
      git: {
        context: './',
        devfileUrl:
          'https://raw.githubusercontent.com/devfile-samples/devfile-sample-java-springboot-basic/main/devfile.yaml',
        dockerfileUrl:
          'https://raw.githubusercontent.com/devfile-samples/devfile-sample-java-springboot-basic/main/docker/Dockerfile',
        revision: 'main',
        url: 'https://github.com/gituser/human-resources.git',
      },
    },
    env: [
      {
        name: 'IMAGE_URL',
        value:
          'quay.io/redhat-user-workloads-stage/test-ns/test-application/human-resources:3450decf7174f23304c8e523bc998526ef57e559',
      },
      {
        name: 'IMAGE_DIGEST',
        value: 'sha256:1d6da200c8ae98384a35bae37516d07b453dde85a91ff891ce57f3a99d420e6a',
      },
    ],
    targetPort: 8081,
  },
  status: {
    conditions: [
      {
        lastTransitionTime: '2023-07-26T14:29:00Z',
        message: 'GitOps resource generated successfully',
        reason: 'OK',
        status: 'True',
        type: 'GitOpsResourcesGenerated',
      },
      {
        lastTransitionTime: '2023-07-06T18:04:42Z',
        message: 'Component has been successfully created',
        reason: 'OK',
        status: 'True',
        type: 'Created',
      },
      {
        lastTransitionTime: '2023-07-26T14:29:00Z',
        message: 'Component has been successfully updated',
        reason: 'OK',
        status: 'True',
        type: 'Updated',
      },
    ],
    containerImage:
      'quay.io/redhat-user-workloads-stage/test-ns/test-application/human-resources@sha256:6abea50ce7c0fd7f6f8dc83913d7b47e31612ed81a00d7ce3a7dc4ffe406a830',
    devfile:
      "commands:\n- attributes:\n    api.devfile.io/imported-from: 'id: java-springboot, registryURL: https://registry.devfile.io'\n  exec:\n    commandLine: mvn clean -Dmaven.repo.local=/home/user/.m2/repository package -Dmaven.test.skip=true\n    component: tools\n    group:\n      isDefault: true\n      kind: build\n    hotReloadCapable: false\n    workingDir: ${PROJECT_SOURCE}\n  id: build\n- attributes:\n    api.devfile.io/imported-from: 'id: java-springboot, registryURL: https://registry.devfile.io'\n  exec:\n    commandLine: mvn -Dmaven.repo.local=/home/user/.m2/repository spring-boot:run\n    component: tools\n    group:\n      isDefault: true\n      kind: run\n    hotReloadCapable: false\n    workingDir: ${PROJECT_SOURCE}\n  id: run\n- attributes:\n    api.devfile.io/imported-from: 'id: java-springboot, registryURL: https://registry.devfile.io'\n  exec:\n    commandLine: java -Xdebug -Xrunjdwp:server=y,transport=dt_socket,address=${DEBUG_PORT},suspend=n\n      -jar target/*.jar\n    component: tools\n    group:\n      isDefault: true\n      kind: debug\n    hotReloadCapable: false\n    workingDir: ${PROJECT_SOURCE}\n  id: debug\n- apply:\n    component: image-build\n  id: build-image\n- apply:\n    component: kubernetes-deploy\n  id: deployk8s\n- composite:\n    commands:\n    - build-image\n    - deployk8s\n    group:\n      isDefault: true\n      kind: deploy\n    parallel: false\n  id: deploy\ncomponents:\n- attributes:\n    api.devfile.io/imported-from: 'id: java-springboot, registryURL: https://registry.devfile.io'\n  container:\n    command:\n    - tail\n    - -f\n    - /dev/null\n    dedicatedPod: false\n    endpoints:\n    - name: http-springboot\n      secure: false\n      targetPort: 8080\n    - exposure: none\n      name: debug\n      secure: false\n      targetPort: 5858\n    env:\n    - name: DEBUG_PORT\n      value: \"5858\"\n    image: registry.access.redhat.com/ubi8/openjdk-11:1.16-1\n    memoryLimit: 768Mi\n    mountSources: true\n    volumeMounts:\n    - name: m2\n      path: /home/user/.m2\n  name: tools\n- attributes:\n    api.devfile.io/imported-from: 'id: java-springboot, registryURL: https://registry.devfile.io'\n  name: m2\n  volume:\n    ephemeral: false\n    size: 3Gi\n- image:\n    autoBuild: false\n    dockerfile:\n      buildContext: .\n      rootRequired: false\n      uri: https://raw.githubusercontent.com/devfile-samples/devfile-sample-java-springboot-basic/main/docker/Dockerfile\n    imageName: java-springboot-image:latest\n  name: image-build\n- attributes:\n    api.devfile.io/k8sLikeComponent-originalURI: deploy.yaml\n    deployment/container-port: 8081\n    deployment/cpuRequest: 10m\n    deployment/memoryRequest: 180Mi\n    deployment/replicas: 1\n    deployment/storageRequest: \"0\"\n  kubernetes:\n    deployByDefault: false\n    endpoints:\n    - name: http-8081\n      path: /\n      secure: false\n      targetPort: 8081\n    inlined: |-\n      kind: Deployment\n      apiVersion: apps/v1\n      metadata:\n        name: my-java-springboot\n      spec:\n        replicas: 1\n        selector:\n          matchLabels:\n            app: java-springboot-app\n        template:\n          metadata:\n            labels:\n              app: java-springboot-app\n          spec:\n            containers:\n              - name: my-java-springboot\n                image: java-springboot-image:latest\n                ports:\n                  - name: http\n                    containerPort: 8081\n                    protocol: TCP\n                resources:\n                  requests:\n                    memory: \"180Mi\"\n                    cpu: \"10m\"\n      ---\n      kind: Service\n      apiVersion: v1\n      metadata:\n        name: my-java-springboot-svc\n      spec:\n        ports:\n          - name: http-8081\n            port: 8081\n            protocol: TCP\n            targetPort: 8081\n        selector:\n          app: java-springboot-app\n  name: kubernetes-deploy\nmetadata:\n  attributes:\n    alpha.dockerimage-port: 8081\n  description: Spring Boot® using Maven\n  displayName: Spring Boot®\n  icon: https://raw.githubusercontent.com/devfile-samples/devfile-stack-icons/main/spring.svg\n  language: Java\n  name: java-springboot\n  projectType: springboot\n  provider: Red Hat\n  supportUrl: https://github.com/devfile-samples/devfile-support#support-information\n  tags:\n  - Java\n  - Spring\n  version: 1.2.1\nschemaVersion: 2.2.0\nstarterProjects:\n- attributes:\n    api.devfile.io/imported-from: 'id: java-springboot, registryURL: https://registry.devfile.io'\n  git:\n    remotes:\n      origin: https://github.com/odo-devfiles/springboot-ex.git\n  name: springbootproject\n",
    gitops: {
      commitID: 'c855ee09239d64da9e3c7ab08594f7639668c987\n',
      context: './',
      repositoryURL:
        'https://github.com/redhat-appstudio-appdata-staging/test-application-p0QHj-travel-break',
    },
    lastBuiltCommit: '26af3e4c779c10f215071b89fe92c2765f463a4d',
  },
};

export const mockComponentWithoutEnvs: ComponentKind = {
  apiVersion: 'appstudio.redhat.com/v1alpha1',
  kind: 'Component',
  metadata: {
    annotations: {
      applicationFailCounter: '0',
    },
    name: 'human-resources',
    uid: 'fbc4b7fa-a9c5-4458-bac5-a158e28ad7f9',
    creationTimestamp: '2023-07-06T18:04:40Z',
    namespace: 'test-ns',
  },
  spec: {
    application: 'test-application',
    componentName: 'human-resources',
    containerImage:
      'quay.io/redhat-user-workloads-stage/test-ns/test-application/human-resources@sha256:6abea50ce7c0fd7f6f8dc83913d7b47e31612ed81a00d7ce3a7dc4ffe406a830',
    replicas: 1,
    resources: {
      requests: {
        cpu: '10m',
        memory: '180Mi',
      },
    },
    source: {
      git: {
        context: './',
        devfileUrl:
          'https://raw.githubusercontent.com/devfile-samples/devfile-sample-java-springboot-basic/main/devfile.yaml',
        dockerfileUrl:
          'https://raw.githubusercontent.com/devfile-samples/devfile-sample-java-springboot-basic/main/docker/Dockerfile',
        revision: 'main',
        url: 'https://github.com/gituser/human-resources.git',
      },
    },
    targetPort: 8081,
  },
  status: {
    conditions: [
      {
        lastTransitionTime: '2023-07-26T14:29:00Z',
        message: 'GitOps resource generated successfully',
        reason: 'OK',
        status: 'True',
        type: 'GitOpsResourcesGenerated',
      },
      {
        lastTransitionTime: '2023-07-06T18:04:42Z',
        message: 'Component has been successfully created',
        reason: 'OK',
        status: 'True',
        type: 'Created',
      },
      {
        lastTransitionTime: '2023-07-26T14:29:00Z',
        message: 'Component has been successfully updated',
        reason: 'OK',
        status: 'True',
        type: 'Updated',
      },
    ],
    containerImage:
      'quay.io/redhat-user-workloads-stage/test-ns/test-application/human-resources@sha256:6abea50ce7c0fd7f6f8dc83913d7b47e31612ed81a00d7ce3a7dc4ffe406a830',
    devfile:
      "commands:\n- attributes:\n    api.devfile.io/imported-from: 'id: java-springboot, registryURL: https://registry.devfile.io'\n  exec:\n    commandLine: mvn clean -Dmaven.repo.local=/home/user/.m2/repository package -Dmaven.test.skip=true\n    component: tools\n    group:\n      isDefault: true\n      kind: build\n    hotReloadCapable: false\n    workingDir: ${PROJECT_SOURCE}\n  id: build\n- attributes:\n    api.devfile.io/imported-from: 'id: java-springboot, registryURL: https://registry.devfile.io'\n  exec:\n    commandLine: mvn -Dmaven.repo.local=/home/user/.m2/repository spring-boot:run\n    component: tools\n    group:\n      isDefault: true\n      kind: run\n    hotReloadCapable: false\n    workingDir: ${PROJECT_SOURCE}\n  id: run\n- attributes:\n    api.devfile.io/imported-from: 'id: java-springboot, registryURL: https://registry.devfile.io'\n  exec:\n    commandLine: java -Xdebug -Xrunjdwp:server=y,transport=dt_socket,address=${DEBUG_PORT},suspend=n\n      -jar target/*.jar\n    component: tools\n    group:\n      isDefault: true\n      kind: debug\n    hotReloadCapable: false\n    workingDir: ${PROJECT_SOURCE}\n  id: debug\n- apply:\n    component: image-build\n  id: build-image\n- apply:\n    component: kubernetes-deploy\n  id: deployk8s\n- composite:\n    commands:\n    - build-image\n    - deployk8s\n    group:\n      isDefault: true\n      kind: deploy\n    parallel: false\n  id: deploy\ncomponents:\n- attributes:\n    api.devfile.io/imported-from: 'id: java-springboot, registryURL: https://registry.devfile.io'\n  container:\n    command:\n    - tail\n    - -f\n    - /dev/null\n    dedicatedPod: false\n    endpoints:\n    - name: http-springboot\n      secure: false\n      targetPort: 8080\n    - exposure: none\n      name: debug\n      secure: false\n      targetPort: 5858\n    env:\n    - name: DEBUG_PORT\n      value: \"5858\"\n    image: registry.access.redhat.com/ubi8/openjdk-11:1.16-1\n    memoryLimit: 768Mi\n    mountSources: true\n    volumeMounts:\n    - name: m2\n      path: /home/user/.m2\n  name: tools\n- attributes:\n    api.devfile.io/imported-from: 'id: java-springboot, registryURL: https://registry.devfile.io'\n  name: m2\n  volume:\n    ephemeral: false\n    size: 3Gi\n- image:\n    autoBuild: false\n    dockerfile:\n      buildContext: .\n      rootRequired: false\n      uri: https://raw.githubusercontent.com/devfile-samples/devfile-sample-java-springboot-basic/main/docker/Dockerfile\n    imageName: java-springboot-image:latest\n  name: image-build\n- attributes:\n    api.devfile.io/k8sLikeComponent-originalURI: deploy.yaml\n    deployment/container-port: 8081\n    deployment/cpuRequest: 10m\n    deployment/memoryRequest: 180Mi\n    deployment/replicas: 1\n    deployment/storageRequest: \"0\"\n  kubernetes:\n    deployByDefault: false\n    endpoints:\n    - name: http-8081\n      path: /\n      secure: false\n      targetPort: 8081\n    inlined: |-\n      kind: Deployment\n      apiVersion: apps/v1\n      metadata:\n        name: my-java-springboot\n      spec:\n        replicas: 1\n        selector:\n          matchLabels:\n            app: java-springboot-app\n        template:\n          metadata:\n            labels:\n              app: java-springboot-app\n          spec:\n            containers:\n              - name: my-java-springboot\n                image: java-springboot-image:latest\n                ports:\n                  - name: http\n                    containerPort: 8081\n                    protocol: TCP\n                resources:\n                  requests:\n                    memory: \"180Mi\"\n                    cpu: \"10m\"\n      ---\n      kind: Service\n      apiVersion: v1\n      metadata:\n        name: my-java-springboot-svc\n      spec:\n        ports:\n          - name: http-8081\n            port: 8081\n            protocol: TCP\n            targetPort: 8081\n        selector:\n          app: java-springboot-app\n  name: kubernetes-deploy\nmetadata:\n  attributes:\n    alpha.dockerimage-port: 8081\n  description: Spring Boot® using Maven\n  displayName: Spring Boot®\n  icon: https://raw.githubusercontent.com/devfile-samples/devfile-stack-icons/main/spring.svg\n  language: Java\n  name: java-springboot\n  projectType: springboot\n  provider: Red Hat\n  supportUrl: https://github.com/devfile-samples/devfile-support#support-information\n  tags:\n  - Java\n  - Spring\n  version: 1.2.1\nschemaVersion: 2.2.0\nstarterProjects:\n- attributes:\n    api.devfile.io/imported-from: 'id: java-springboot, registryURL: https://registry.devfile.io'\n  git:\n    remotes:\n      origin: https://github.com/odo-devfiles/springboot-ex.git\n  name: springbootproject\n",
    gitops: {
      commitID: 'c855ee09239d64da9e3c7ab08594f7639668c987\n',
      context: './',
      repositoryURL:
        'https://github.com/redhat-appstudio-appdata-staging/test-application-p0QHj-travel-break',
    },
    lastBuiltCommit: '26af3e4c779c10f215071b89fe92c2765f463a4d',
  },
};

export const mockLatestSuccessfulBuild = {
  kind: 'PipelineRun',
  spec: {
    params: [
      {
        name: 'dockerfile',
        value:
          'https://raw.githubusercontent.com/devfile-samples/devfile-sample-java-springboot-basic/main/docker/Dockerfile',
      },
      {
        name: 'git-url',
        value: 'https://github.com/github-user/human-resources',
      },
      {
        name: 'output-image',
        value:
          'quay.io/redhat-user-workloads-stage/test-ns/test-application/human-resources:3450decf7174f23304c8e523bc998526ef57e559',
      },
      {
        name: 'path-context',
        value: '.',
      },
      {
        name: 'revision',
        value: '3450decf7174f23304c8e523bc998526ef57e559',
      },
    ],
    timeouts: {
      pipeline: '1h0m0s',
    },
    workspaces: [
      {
        name: 'workspace',
        volumeClaimTemplate: {
          spec: {
            resources: {
              requests: {
                storage: '1Gi',
              },
            },
            accessModes: ['ReadWriteOnce'],
          },
          status: {},
          metadata: {
            creationTimestamp: null,
          },
        },
      },
      {
        name: 'git-auth',
        secret: {
          secretName: 'pac-gitauth-mgmx',
        },
      },
    ],
    pipelineSpec: {
      tasks: [
        {
          name: 'init',
          params: [
            {
              name: 'image-url',
              value: '$(params.output-image)',
            },
            {
              name: 'rebuild',
              value: '$(params.rebuild)',
            },
            {
              name: 'skip-checks',
              value: '$(params.skip-checks)',
            },
            {
              name: 'skip-optional',
              value: '$(params.skip-optional)',
            },
            {
              name: 'pipelinerun-name',
              value: '$(context.pipelineRun.name)',
            },
            {
              name: 'pipelinerun-uid',
              value: '$(context.pipelineRun.uid)',
            },
          ],
          taskRef: {
            kind: 'Task',
            params: [
              {
                name: 'name',
                value: 'init',
              },
              {
                name: 'bundle',
                value:
                  'quay.io/redhat-appstudio-tekton-catalog/task-init:0.1@sha256:26586a7ef08c3e86dfdaf0a5cc38dd3d70c4c02db1331b469caaed0a0f5b3d86',
              },
              {
                name: 'kind',
                value: 'task',
              },
            ],
            resolver: 'bundles',
          },
        },
        {
          name: 'clone-repository',
          when: [
            {
              input: '$(tasks.init.results.build)',
              values: ['true'],
              operator: 'in',
            },
          ],
          params: [
            {
              name: 'url',
              value: '$(params.git-url)',
            },
            {
              name: 'revision',
              value: '$(params.revision)',
            },
          ],
          taskRef: {
            kind: 'Task',
            params: [
              {
                name: 'name',
                value: 'git-clone',
              },
              {
                name: 'bundle',
                value:
                  'quay.io/redhat-appstudio-tekton-catalog/task-git-clone:0.1@sha256:44260edd7da429a3bca3843be5049a15f05f658d1e9766521379e067e972c1e0',
              },
              {
                name: 'kind',
                value: 'task',
              },
            ],
            resolver: 'bundles',
          },
          runAfter: ['init'],
          workspaces: [
            {
              name: 'output',
              workspace: 'workspace',
            },
            {
              name: 'basic-auth',
              workspace: 'git-auth',
            },
          ],
        },
        {
          name: 'prefetch-dependencies',
          when: [
            {
              input: '$(params.hermetic)',
              values: ['true'],
              operator: 'in',
            },
          ],
          params: [
            {
              name: 'input',
              value: '$(params.prefetch-input)',
            },
          ],
          taskRef: {
            kind: 'Task',
            params: [
              {
                name: 'name',
                value: 'prefetch-dependencies',
              },
              {
                name: 'bundle',
                value:
                  'quay.io/redhat-appstudio-tekton-catalog/task-prefetch-dependencies:0.1@sha256:7851457b29fc187c8027fd53ed4f54c6e3a2e9fb0fd85da058022c6fd4dce1b1',
              },
              {
                name: 'kind',
                value: 'task',
              },
            ],
            resolver: 'bundles',
          },
          runAfter: ['clone-repository'],
          workspaces: [
            {
              name: 'source',
              workspace: 'workspace',
            },
          ],
        },
        {
          name: 'build-container',
          when: [
            {
              input: '$(tasks.init.results.build)',
              values: ['true'],
              operator: 'in',
            },
          ],
          params: [
            {
              name: 'IMAGE',
              value: '$(params.output-image)',
            },
            {
              name: 'DOCKERFILE',
              value: '$(params.dockerfile)',
            },
            {
              name: 'CONTEXT',
              value: '$(params.path-context)',
            },
            {
              name: 'HERMETIC',
              value: '$(params.hermetic)',
            },
            {
              name: 'PREFETCH_INPUT',
              value: '$(params.prefetch-input)',
            },
            {
              name: 'IMAGE_EXPIRES_AFTER',
              value: '$(params.image-expires-after)',
            },
            {
              name: 'COMMIT_SHA',
              value: '$(tasks.clone-repository.results.commit)',
            },
          ],
          taskRef: {
            kind: 'Task',
            params: [
              {
                name: 'name',
                value: 'buildah',
              },
              {
                name: 'bundle',
                value:
                  'quay.io/redhat-appstudio-tekton-catalog/task-buildah:0.1@sha256:3b99002047326ed803f32a9b952c715338c513c95ea1ebcf28e59a851e9930e2',
              },
              {
                name: 'kind',
                value: 'task',
              },
            ],
            resolver: 'bundles',
          },
          runAfter: ['prefetch-dependencies'],
          workspaces: [
            {
              name: 'source',
              workspace: 'workspace',
            },
          ],
        },
        {
          name: 'inspect-image',
          when: [
            {
              input: '$(params.skip-checks)',
              values: ['false'],
              operator: 'in',
            },
          ],
          params: [
            {
              name: 'IMAGE_URL',
              value: '$(tasks.build-container.results.IMAGE_URL)',
            },
            {
              name: 'IMAGE_DIGEST',
              value: '$(tasks.build-container.results.IMAGE_DIGEST)',
            },
          ],
          taskRef: {
            kind: 'Task',
            params: [
              {
                name: 'name',
                value: 'inspect-image',
              },
              {
                name: 'bundle',
                value:
                  'quay.io/redhat-appstudio-tekton-catalog/task-inspect-image:0.1@sha256:8b0b066c7d4adb5ffcb02cfbcb55393d741c9cddeda2099d7d1d7505c1e683ba',
              },
              {
                name: 'kind',
                value: 'task',
              },
            ],
            resolver: 'bundles',
          },
          runAfter: ['build-container'],
          workspaces: [
            {
              name: 'source',
              workspace: 'workspace',
            },
          ],
        },
        {
          name: 'label-check',
          when: [
            {
              input: '$(params.skip-checks)',
              values: ['false'],
              operator: 'in',
            },
          ],
          taskRef: {
            kind: 'Task',
            params: [
              {
                name: 'name',
                value: 'label-check',
              },
              {
                name: 'bundle',
                value:
                  'quay.io/redhat-appstudio-tekton-catalog/task-label-check:0.1@sha256:0c0739fdda24cd1e3587bbab9b07d4493efc21884baac7723f4b446e95bf1fd3',
              },
              {
                name: 'kind',
                value: 'task',
              },
            ],
            resolver: 'bundles',
          },
          runAfter: ['inspect-image'],
          workspaces: [
            {
              name: 'workspace',
              workspace: 'workspace',
            },
          ],
        },
        {
          name: 'optional-label-check',
          when: [
            {
              input: '$(params.skip-optional)',
              values: ['false'],
              operator: 'in',
            },
          ],
          params: [
            {
              name: 'POLICY_NAMESPACE',
              value: 'optional_checks',
            },
          ],
          taskRef: {
            kind: 'Task',
            params: [
              {
                name: 'name',
                value: 'label-check',
              },
              {
                name: 'bundle',
                value:
                  'quay.io/redhat-appstudio-tekton-catalog/task-label-check:0.1@sha256:0c0739fdda24cd1e3587bbab9b07d4493efc21884baac7723f4b446e95bf1fd3',
              },
              {
                name: 'kind',
                value: 'task',
              },
            ],
            resolver: 'bundles',
          },
          runAfter: ['inspect-image'],
          workspaces: [
            {
              name: 'workspace',
              workspace: 'workspace',
            },
          ],
        },
        {
          name: 'deprecated-base-image-check',
          when: [
            {
              input: '$(params.skip-checks)',
              values: ['false'],
              operator: 'in',
            },
          ],
          params: [
            {
              name: 'BASE_IMAGES_DIGESTS',
              value: '$(tasks.build-container.results.BASE_IMAGES_DIGESTS)',
            },
          ],
          taskRef: {
            kind: 'Task',
            params: [
              {
                name: 'name',
                value: 'deprecated-image-check',
              },
              {
                name: 'bundle',
                value:
                  'quay.io/redhat-appstudio-tekton-catalog/task-deprecated-image-check:0.2@sha256:40856a6c6b4452361a2cdb17b927a35fd03edc3eec2e5bf94f96d211cc1d1d52',
              },
              {
                name: 'kind',
                value: 'task',
              },
            ],
            resolver: 'bundles',
          },
          workspaces: [
            {
              name: 'test-ws',
              workspace: 'workspace',
            },
          ],
        },
        {
          name: 'clair-scan',
          when: [
            {
              input: '$(params.skip-checks)',
              values: ['false'],
              operator: 'in',
            },
          ],
          params: [
            {
              name: 'image-digest',
              value: '$(tasks.build-container.results.IMAGE_DIGEST)',
            },
            {
              name: 'image-url',
              value: '$(tasks.build-container.results.IMAGE_URL)',
            },
          ],
          taskRef: {
            kind: 'Task',
            params: [
              {
                name: 'name',
                value: 'clair-scan',
              },
              {
                name: 'bundle',
                value:
                  'quay.io/redhat-appstudio-tekton-catalog/task-clair-scan:0.1@sha256:2016d1d4a1fc02ed353d7aede4bc5f81c5a335f6bcf4a9a2c97d33364afc3210',
              },
              {
                name: 'kind',
                value: 'task',
              },
            ],
            resolver: 'bundles',
          },
          runAfter: ['build-container'],
        },
        {
          name: 'sast-snyk-check',
          when: [
            {
              input: '$(params.skip-checks)',
              values: ['false'],
              operator: 'in',
            },
            {
              input: '$(params.snyk-secret)',
              values: [''],
              operator: 'notin',
            },
          ],
          params: [
            {
              name: 'SNYK_SECRET',
              value: '$(params.snyk-secret)',
            },
          ],
          taskRef: {
            kind: 'Task',
            params: [
              {
                name: 'name',
                value: 'sast-snyk-check',
              },
              {
                name: 'bundle',
                value:
                  'quay.io/redhat-appstudio-tekton-catalog/task-sast-snyk-check:0.1@sha256:c17b7f15d2f48d0025a4f5cd16d470d8a3f7f368416eb35d1e25bda5f7949c41',
              },
              {
                name: 'kind',
                value: 'task',
              },
            ],
            resolver: 'bundles',
          },
          runAfter: ['clone-repository'],
          workspaces: [
            {
              name: 'workspace',
              workspace: 'workspace',
            },
          ],
        },
        {
          name: 'clamav-scan',
          when: [
            {
              input: '$(params.skip-checks)',
              values: ['false'],
              operator: 'in',
            },
          ],
          params: [
            {
              name: 'image-digest',
              value: '$(tasks.build-container.results.IMAGE_DIGEST)',
            },
            {
              name: 'image-url',
              value: '$(tasks.build-container.results.IMAGE_URL)',
            },
          ],
          taskRef: {
            kind: 'Task',
            params: [
              {
                name: 'name',
                value: 'clamav-scan',
              },
              {
                name: 'bundle',
                value:
                  'quay.io/redhat-appstudio-tekton-catalog/task-clamav-scan:0.1@sha256:a666a7dd4fd633d268d1ba26eaaa5ca2dd848c76b7fb2f04b8b37b7ce1c65f9a',
              },
              {
                name: 'kind',
                value: 'task',
              },
            ],
            resolver: 'bundles',
          },
          runAfter: ['build-container'],
        },
        {
          name: 'sbom-json-check',
          when: [
            {
              input: '$(params.skip-checks)',
              values: ['false'],
              operator: 'in',
            },
          ],
          params: [
            {
              name: 'IMAGE_URL',
              value: '$(tasks.build-container.results.IMAGE_URL)',
            },
            {
              name: 'IMAGE_DIGEST',
              value: '$(tasks.build-container.results.IMAGE_DIGEST)',
            },
          ],
          taskRef: {
            kind: 'Task',
            params: [
              {
                name: 'name',
                value: 'sbom-json-check',
              },
              {
                name: 'bundle',
                value:
                  'quay.io/redhat-appstudio-tekton-catalog/task-sbom-json-check:0.1@sha256:30829c02906bfb5761a2c3509ec00fa7b41a97ae1c931cdedcd007664fdbc292',
              },
              {
                name: 'kind',
                value: 'task',
              },
            ],
            resolver: 'bundles',
          },
          runAfter: ['build-container'],
        },
      ],
      params: [
        {
          name: 'git-url',
          type: 'string',
          description: 'Source Repository URL',
        },
        {
          name: 'revision',
          type: 'string',
          default: '',
          description: 'Revision of the Source Repository',
        },
        {
          name: 'output-image',
          type: 'string',
          description: 'Fully Qualified Output Image',
        },
        {
          name: 'path-context',
          type: 'string',
          default: '.',
          description: 'The path to your source code',
        },
        {
          name: 'dockerfile',
          type: 'string',
          default: 'Dockerfile',
          description: 'Path to the Dockerfile',
        },
        {
          name: 'rebuild',
          type: 'string',
          default: 'false',
          description: 'Force rebuild image',
        },
        {
          name: 'skip-checks',
          type: 'string',
          default: 'false',
          description: 'Skip checks against built image',
        },
        {
          name: 'skip-optional',
          type: 'string',
          default: 'true',
          description: 'Skip optional checks, set false if you want to run optional checks',
        },
        {
          name: 'hermetic',
          type: 'string',
          default: 'false',
          description: 'Execute the build with network isolation',
        },
        {
          name: 'prefetch-input',
          type: 'string',
          default: '',
          description: 'Build dependencies to be prefetched by Cachi2',
        },
        {
          name: 'java',
          type: 'string',
          default: 'false',
          description: 'Java build',
        },
        {
          name: 'snyk-secret',
          type: 'string',
          default: '',
          description: 'Snyk Token Secret Name',
        },
        {
          name: 'image-expires-after',
          type: 'string',
          default: '',
          description:
            'Image tag expiration time, time values could be something like 1h, 2d, 3w for hours, days, and weeks, respectively.',
        },
      ],
      finally: [
        {
          name: 'show-sbom',
          params: [
            {
              name: 'IMAGE_URL',
              value: '$(tasks.build-container.results.IMAGE_URL)',
            },
          ],
          taskRef: {
            kind: 'Task',
            params: [
              {
                name: 'name',
                value: 'show-sbom',
              },
              {
                name: 'bundle',
                value:
                  'quay.io/redhat-appstudio-tekton-catalog/task-show-sbom:0.1@sha256:7db0af43dcebaeb33e34413148370e17078c30fd2fc78fb84c8941b444199f36',
              },
              {
                name: 'kind',
                value: 'task',
              },
            ],
            resolver: 'bundles',
          },
        },
        {
          name: 'show-summary',
          params: [
            {
              name: 'pipelinerun-name',
              value: '$(context.pipelineRun.name)',
            },
            {
              name: 'git-url',
              value:
                '$(tasks.clone-repository.results.url)?rev=$(tasks.clone-repository.results.commit)',
            },
            {
              name: 'image-url',
              value: '$(params.output-image)',
            },
            {
              name: 'build-task-status',
              value: '$(tasks.build-container.status)',
            },
          ],
          taskRef: {
            kind: 'Task',
            params: [
              {
                name: 'name',
                value: 'summary',
              },
              {
                name: 'bundle',
                value:
                  'quay.io/redhat-appstudio-tekton-catalog/task-summary:0.1@sha256:bd6a2285974541df01260deca99a84b3b48a6b40759049e7e41e96b4942d83d3',
              },
              {
                name: 'kind',
                value: 'task',
              },
            ],
            resolver: 'bundles',
          },
        },
      ],
      results: [
        {
          name: 'IMAGE_URL',
          value: '$(tasks.build-container.results.IMAGE_URL)',
          description: '',
        },
        {
          name: 'IMAGE_DIGEST',
          value: '$(tasks.build-container.results.IMAGE_DIGEST)',
          description: '',
        },
        {
          name: 'CHAINS-GIT_URL',
          value: '$(tasks.clone-repository.results.url)',
          description: '',
        },
        {
          name: 'CHAINS-GIT_COMMIT',
          value: '$(tasks.clone-repository.results.commit)',
          description: '',
        },
        {
          name: 'JAVA_COMMUNITY_DEPENDENCIES',
          value: '$(tasks.build-container.results.JAVA_COMMUNITY_DEPENDENCIES)',
          description: '',
        },
      ],
      workspaces: [
        {
          name: 'workspace',
        },
        {
          name: 'git-auth',
          optional: true,
        },
      ],
    },
    serviceAccountName: 'appstudio-pipeline',
  },
  status: {
    startTime: '2023-07-31T09:54:31Z',
    conditions: [
      {
        type: 'Succeeded',
        reason: 'Completed',
        status: 'True',
        message: 'Tasks Completed: 11 (Failed: 0, Cancelled 0), Skipped: 3',
        lastTransitionTime: '2023-07-31T09:58:03Z',
      },
    ],
    pipelineSpec: {
      tasks: [
        {
          name: 'init',
          params: [
            {
              name: 'image-url',
              value:
                'quay.io/redhat-user-workloads-stage/test-ns/test-application/human-resources:3450decf7174f23304c8e523bc998526ef57e559',
            },
            {
              name: 'rebuild',
              value: 'false',
            },
            {
              name: 'skip-checks',
              value: 'false',
            },
            {
              name: 'skip-optional',
              value: 'true',
            },
            {
              name: 'pipelinerun-name',
              value: 'human-resources-on-push-z79cl',
            },
            {
              name: 'pipelinerun-uid',
              value: 'cfc81c92-3418-446c-a819-62b2241f2e65',
            },
          ],
          taskRef: {
            kind: 'Task',
            params: [
              {
                name: 'name',
                value: 'init',
              },
              {
                name: 'bundle',
                value:
                  'quay.io/redhat-appstudio-tekton-catalog/task-init:0.1@sha256:26586a7ef08c3e86dfdaf0a5cc38dd3d70c4c02db1331b469caaed0a0f5b3d86',
              },
              {
                name: 'kind',
                value: 'task',
              },
            ],
            resolver: 'bundles',
          },
        },
        {
          name: 'clone-repository',
          when: [
            {
              input: '$(tasks.init.results.build)',
              values: ['true'],
              operator: 'in',
            },
          ],
          params: [
            {
              name: 'url',
              value: 'https://github.com/github-user/human-resources',
            },
            {
              name: 'revision',
              value: '3450decf7174f23304c8e523bc998526ef57e559',
            },
          ],
          taskRef: {
            kind: 'Task',
            params: [
              {
                name: 'name',
                value: 'git-clone',
              },
              {
                name: 'bundle',
                value:
                  'quay.io/redhat-appstudio-tekton-catalog/task-git-clone:0.1@sha256:44260edd7da429a3bca3843be5049a15f05f658d1e9766521379e067e972c1e0',
              },
              {
                name: 'kind',
                value: 'task',
              },
            ],
            resolver: 'bundles',
          },
          runAfter: ['init'],
          workspaces: [
            {
              name: 'output',
              workspace: 'workspace',
            },
            {
              name: 'basic-auth',
              workspace: 'git-auth',
            },
          ],
        },
        {
          name: 'prefetch-dependencies',
          when: [
            {
              input: 'false',
              values: ['true'],
              operator: 'in',
            },
          ],
          params: [
            {
              name: 'input',
              value: '',
            },
          ],
          taskRef: {
            kind: 'Task',
            params: [
              {
                name: 'name',
                value: 'prefetch-dependencies',
              },
              {
                name: 'bundle',
                value:
                  'quay.io/redhat-appstudio-tekton-catalog/task-prefetch-dependencies:0.1@sha256:7851457b29fc187c8027fd53ed4f54c6e3a2e9fb0fd85da058022c6fd4dce1b1',
              },
              {
                name: 'kind',
                value: 'task',
              },
            ],
            resolver: 'bundles',
          },
          runAfter: ['clone-repository'],
          workspaces: [
            {
              name: 'source',
              workspace: 'workspace',
            },
          ],
        },
        {
          name: 'build-container',
          when: [
            {
              input: '$(tasks.init.results.build)',
              values: ['true'],
              operator: 'in',
            },
          ],
          params: [
            {
              name: 'IMAGE',
              value:
                'quay.io/redhat-user-workloads-stage/test-ns/test-application/human-resources:3450decf7174f23304c8e523bc998526ef57e559',
            },
            {
              name: 'DOCKERFILE',
              value:
                'https://raw.githubusercontent.com/devfile-samples/devfile-sample-java-springboot-basic/main/docker/Dockerfile',
            },
            {
              name: 'CONTEXT',
              value: '.',
            },
            {
              name: 'HERMETIC',
              value: 'false',
            },
            {
              name: 'PREFETCH_INPUT',
              value: '',
            },
            {
              name: 'IMAGE_EXPIRES_AFTER',
              value: '',
            },
            {
              name: 'COMMIT_SHA',
              value: '$(tasks.clone-repository.results.commit)',
            },
          ],
          taskRef: {
            kind: 'Task',
            params: [
              {
                name: 'name',
                value: 'buildah',
              },
              {
                name: 'bundle',
                value:
                  'quay.io/redhat-appstudio-tekton-catalog/task-buildah:0.1@sha256:3b99002047326ed803f32a9b952c715338c513c95ea1ebcf28e59a851e9930e2',
              },
              {
                name: 'kind',
                value: 'task',
              },
            ],
            resolver: 'bundles',
          },
          runAfter: ['prefetch-dependencies'],
          workspaces: [
            {
              name: 'source',
              workspace: 'workspace',
            },
          ],
        },
        {
          name: 'inspect-image',
          when: [
            {
              input: 'false',
              values: ['false'],
              operator: 'in',
            },
          ],
          params: [
            {
              name: 'IMAGE_URL',
              value: '$(tasks.build-container.results.IMAGE_URL)',
            },
            {
              name: 'IMAGE_DIGEST',
              value: '$(tasks.build-container.results.IMAGE_DIGEST)',
            },
          ],
          taskRef: {
            kind: 'Task',
            params: [
              {
                name: 'name',
                value: 'inspect-image',
              },
              {
                name: 'bundle',
                value:
                  'quay.io/redhat-appstudio-tekton-catalog/task-inspect-image:0.1@sha256:8b0b066c7d4adb5ffcb02cfbcb55393d741c9cddeda2099d7d1d7505c1e683ba',
              },
              {
                name: 'kind',
                value: 'task',
              },
            ],
            resolver: 'bundles',
          },
          runAfter: ['build-container'],
          workspaces: [
            {
              name: 'source',
              workspace: 'workspace',
            },
          ],
        },
        {
          name: 'label-check',
          when: [
            {
              input: 'false',
              values: ['false'],
              operator: 'in',
            },
          ],
          taskRef: {
            kind: 'Task',
            params: [
              {
                name: 'name',
                value: 'label-check',
              },
              {
                name: 'bundle',
                value:
                  'quay.io/redhat-appstudio-tekton-catalog/task-label-check:0.1@sha256:0c0739fdda24cd1e3587bbab9b07d4493efc21884baac7723f4b446e95bf1fd3',
              },
              {
                name: 'kind',
                value: 'task',
              },
            ],
            resolver: 'bundles',
          },
          runAfter: ['inspect-image'],
          workspaces: [
            {
              name: 'workspace',
              workspace: 'workspace',
            },
          ],
        },
        {
          name: 'optional-label-check',
          when: [
            {
              input: 'true',
              values: ['false'],
              operator: 'in',
            },
          ],
          params: [
            {
              name: 'POLICY_NAMESPACE',
              value: 'optional_checks',
            },
          ],
          taskRef: {
            kind: 'Task',
            params: [
              {
                name: 'name',
                value: 'label-check',
              },
              {
                name: 'bundle',
                value:
                  'quay.io/redhat-appstudio-tekton-catalog/task-label-check:0.1@sha256:0c0739fdda24cd1e3587bbab9b07d4493efc21884baac7723f4b446e95bf1fd3',
              },
              {
                name: 'kind',
                value: 'task',
              },
            ],
            resolver: 'bundles',
          },
          runAfter: ['inspect-image'],
          workspaces: [
            {
              name: 'workspace',
              workspace: 'workspace',
            },
          ],
        },
        {
          name: 'deprecated-base-image-check',
          when: [
            {
              input: 'false',
              values: ['false'],
              operator: 'in',
            },
          ],
          params: [
            {
              name: 'BASE_IMAGES_DIGESTS',
              value: '$(tasks.build-container.results.BASE_IMAGES_DIGESTS)',
            },
          ],
          taskRef: {
            kind: 'Task',
            params: [
              {
                name: 'name',
                value: 'deprecated-image-check',
              },
              {
                name: 'bundle',
                value:
                  'quay.io/redhat-appstudio-tekton-catalog/task-deprecated-image-check:0.2@sha256:40856a6c6b4452361a2cdb17b927a35fd03edc3eec2e5bf94f96d211cc1d1d52',
              },
              {
                name: 'kind',
                value: 'task',
              },
            ],
            resolver: 'bundles',
          },
          workspaces: [
            {
              name: 'test-ws',
              workspace: 'workspace',
            },
          ],
        },
        {
          name: 'clair-scan',
          when: [
            {
              input: 'false',
              values: ['false'],
              operator: 'in',
            },
          ],
          params: [
            {
              name: 'image-digest',
              value: '$(tasks.build-container.results.IMAGE_DIGEST)',
            },
            {
              name: 'image-url',
              value: '$(tasks.build-container.results.IMAGE_URL)',
            },
          ],
          taskRef: {
            kind: 'Task',
            params: [
              {
                name: 'name',
                value: 'clair-scan',
              },
              {
                name: 'bundle',
                value:
                  'quay.io/redhat-appstudio-tekton-catalog/task-clair-scan:0.1@sha256:2016d1d4a1fc02ed353d7aede4bc5f81c5a335f6bcf4a9a2c97d33364afc3210',
              },
              {
                name: 'kind',
                value: 'task',
              },
            ],
            resolver: 'bundles',
          },
          runAfter: ['build-container'],
        },
        {
          name: 'sast-snyk-check',
          when: [
            {
              input: 'false',
              values: ['false'],
              operator: 'in',
            },
            {
              input: '',
              values: [''],
              operator: 'notin',
            },
          ],
          params: [
            {
              name: 'SNYK_SECRET',
              value: '',
            },
          ],
          taskRef: {
            kind: 'Task',
            params: [
              {
                name: 'name',
                value: 'sast-snyk-check',
              },
              {
                name: 'bundle',
                value:
                  'quay.io/redhat-appstudio-tekton-catalog/task-sast-snyk-check:0.1@sha256:c17b7f15d2f48d0025a4f5cd16d470d8a3f7f368416eb35d1e25bda5f7949c41',
              },
              {
                name: 'kind',
                value: 'task',
              },
            ],
            resolver: 'bundles',
          },
          runAfter: ['clone-repository'],
          workspaces: [
            {
              name: 'workspace',
              workspace: 'workspace',
            },
          ],
        },
        {
          name: 'clamav-scan',
          when: [
            {
              input: 'false',
              values: ['false'],
              operator: 'in',
            },
          ],
          params: [
            {
              name: 'image-digest',
              value: '$(tasks.build-container.results.IMAGE_DIGEST)',
            },
            {
              name: 'image-url',
              value: '$(tasks.build-container.results.IMAGE_URL)',
            },
          ],
          taskRef: {
            kind: 'Task',
            params: [
              {
                name: 'name',
                value: 'clamav-scan',
              },
              {
                name: 'bundle',
                value:
                  'quay.io/redhat-appstudio-tekton-catalog/task-clamav-scan:0.1@sha256:a666a7dd4fd633d268d1ba26eaaa5ca2dd848c76b7fb2f04b8b37b7ce1c65f9a',
              },
              {
                name: 'kind',
                value: 'task',
              },
            ],
            resolver: 'bundles',
          },
          runAfter: ['build-container'],
        },
        {
          name: 'sbom-json-check',
          when: [
            {
              input: 'false',
              values: ['false'],
              operator: 'in',
            },
          ],
          params: [
            {
              name: 'IMAGE_URL',
              value: '$(tasks.build-container.results.IMAGE_URL)',
            },
            {
              name: 'IMAGE_DIGEST',
              value: '$(tasks.build-container.results.IMAGE_DIGEST)',
            },
          ],
          taskRef: {
            kind: 'Task',
            params: [
              {
                name: 'name',
                value: 'sbom-json-check',
              },
              {
                name: 'bundle',
                value:
                  'quay.io/redhat-appstudio-tekton-catalog/task-sbom-json-check:0.1@sha256:30829c02906bfb5761a2c3509ec00fa7b41a97ae1c931cdedcd007664fdbc292',
              },
              {
                name: 'kind',
                value: 'task',
              },
            ],
            resolver: 'bundles',
          },
          runAfter: ['build-container'],
        },
      ],
      params: [
        {
          name: 'git-url',
          type: 'string',
          description: 'Source Repository URL',
        },
        {
          name: 'revision',
          type: 'string',
          default: '',
          description: 'Revision of the Source Repository',
        },
        {
          name: 'output-image',
          type: 'string',
          description: 'Fully Qualified Output Image',
        },
        {
          name: 'path-context',
          type: 'string',
          default: '.',
          description: 'The path to your source code',
        },
        {
          name: 'dockerfile',
          type: 'string',
          default: 'Dockerfile',
          description: 'Path to the Dockerfile',
        },
        {
          name: 'rebuild',
          type: 'string',
          default: 'false',
          description: 'Force rebuild image',
        },
        {
          name: 'skip-checks',
          type: 'string',
          default: 'false',
          description: 'Skip checks against built image',
        },
        {
          name: 'skip-optional',
          type: 'string',
          default: 'true',
          description: 'Skip optional checks, set false if you want to run optional checks',
        },
        {
          name: 'hermetic',
          type: 'string',
          default: 'false',
          description: 'Execute the build with network isolation',
        },
        {
          name: 'prefetch-input',
          type: 'string',
          default: '',
          description: 'Build dependencies to be prefetched by Cachi2',
        },
        {
          name: 'java',
          type: 'string',
          default: 'false',
          description: 'Java build',
        },
        {
          name: 'snyk-secret',
          type: 'string',
          default: '',
          description: 'Snyk Token Secret Name',
        },
        {
          name: 'image-expires-after',
          type: 'string',
          default: '',
          description:
            'Image tag expiration time, time values could be something like 1h, 2d, 3w for hours, days, and weeks, respectively.',
        },
      ],
      finally: [
        {
          name: 'show-sbom',
          params: [
            {
              name: 'IMAGE_URL',
              value: '$(tasks.build-container.results.IMAGE_URL)',
            },
          ],
          taskRef: {
            kind: 'Task',
            params: [
              {
                name: 'name',
                value: 'show-sbom',
              },
              {
                name: 'bundle',
                value:
                  'quay.io/redhat-appstudio-tekton-catalog/task-show-sbom:0.1@sha256:7db0af43dcebaeb33e34413148370e17078c30fd2fc78fb84c8941b444199f36',
              },
              {
                name: 'kind',
                value: 'task',
              },
            ],
            resolver: 'bundles',
          },
        },
        {
          name: 'show-summary',
          params: [
            {
              name: 'pipelinerun-name',
              value: 'human-resources-on-push-z79cl',
            },
            {
              name: 'git-url',
              value:
                '$(tasks.clone-repository.results.url)?rev=$(tasks.clone-repository.results.commit)',
            },
            {
              name: 'image-url',
              value:
                'quay.io/redhat-user-workloads-stage/test-ns/test-application/human-resources:3450decf7174f23304c8e523bc998526ef57e559',
            },
            {
              name: 'build-task-status',
              value: '$(tasks.build-container.status)',
            },
          ],
          taskRef: {
            kind: 'Task',
            params: [
              {
                name: 'name',
                value: 'summary',
              },
              {
                name: 'bundle',
                value:
                  'quay.io/redhat-appstudio-tekton-catalog/task-summary:0.1@sha256:bd6a2285974541df01260deca99a84b3b48a6b40759049e7e41e96b4942d83d3',
              },
              {
                name: 'kind',
                value: 'task',
              },
            ],
            resolver: 'bundles',
          },
        },
      ],
      results: [
        {
          name: 'IMAGE_URL',
          value: '$(tasks.build-container.results.IMAGE_URL)',
          description: '',
        },
        {
          name: 'IMAGE_DIGEST',
          value: '$(tasks.build-container.results.IMAGE_DIGEST)',
          description: '',
        },
        {
          name: 'CHAINS-GIT_URL',
          value: '$(tasks.clone-repository.results.url)',
          description: '',
        },
        {
          name: 'CHAINS-GIT_COMMIT',
          value: '$(tasks.clone-repository.results.commit)',
          description: '',
        },
        {
          name: 'JAVA_COMMUNITY_DEPENDENCIES',
          value: '$(tasks.build-container.results.JAVA_COMMUNITY_DEPENDENCIES)',
          description: '',
        },
      ],
      workspaces: [
        {
          name: 'workspace',
        },
        {
          name: 'git-auth',
          optional: true,
        },
      ],
    },
    skippedTasks: [
      {
        name: 'prefetch-dependencies',
        reason: 'When Expressions evaluated to false',
        whenExpressions: [
          {
            input: 'false',
            values: ['true'],
            operator: 'in',
          },
        ],
      },
      {
        name: 'optional-label-check',
        reason: 'When Expressions evaluated to false',
        whenExpressions: [
          {
            input: 'true',
            values: ['false'],
            operator: 'in',
          },
        ],
      },
      {
        name: 'sast-snyk-check',
        reason: 'When Expressions evaluated to false',
        whenExpressions: [
          {
            input: 'false',
            values: ['false'],
            operator: 'in',
          },
          {
            input: '',
            values: [''],
            operator: 'notin',
          },
        ],
      },
    ],
    completionTime: '2023-07-31T09:58:03Z',
    childReferences: [
      {
        kind: 'TaskRun',
        name: 'human-resources-on-push-z79cl-init',
        apiVersion: 'tekton.dev/v1beta1',
        pipelineTaskName: 'init',
      },
      {
        kind: 'TaskRun',
        name: 'human-resources-on-push-z79cl-clone-repository',
        apiVersion: 'tekton.dev/v1beta1',
        whenExpressions: [
          {
            input: '$(tasks.init.results.build)',
            values: ['true'],
            operator: 'in',
          },
        ],
        pipelineTaskName: 'clone-repository',
      },
      {
        kind: 'TaskRun',
        name: 'human-resources-on-push-z79cl-build-container',
        apiVersion: 'tekton.dev/v1beta1',
        whenExpressions: [
          {
            input: '$(tasks.init.results.build)',
            values: ['true'],
            operator: 'in',
          },
        ],
        pipelineTaskName: 'build-container',
      },
      {
        kind: 'TaskRun',
        name: 'human-resources-on-push-z79cl-inspect-image',
        apiVersion: 'tekton.dev/v1beta1',
        whenExpressions: [
          {
            input: 'false',
            values: ['false'],
            operator: 'in',
          },
        ],
        pipelineTaskName: 'inspect-image',
      },
      {
        kind: 'TaskRun',
        name: 'human-resources-on-push-z79cl-label-check',
        apiVersion: 'tekton.dev/v1beta1',
        whenExpressions: [
          {
            input: 'false',
            values: ['false'],
            operator: 'in',
          },
        ],
        pipelineTaskName: 'label-check',
      },
      {
        kind: 'TaskRun',
        name: 'human-resources-on-push-z79cl-deprecated-base-image-check',
        apiVersion: 'tekton.dev/v1beta1',
        whenExpressions: [
          {
            input: 'false',
            values: ['false'],
            operator: 'in',
          },
        ],
        pipelineTaskName: 'deprecated-base-image-check',
      },
      {
        kind: 'TaskRun',
        name: 'human-resources-on-push-z79cl-clair-scan',
        apiVersion: 'tekton.dev/v1beta1',
        whenExpressions: [
          {
            input: 'false',
            values: ['false'],
            operator: 'in',
          },
        ],
        pipelineTaskName: 'clair-scan',
      },
      {
        kind: 'TaskRun',
        name: 'human-resources-on-push-z79cl-clamav-scan',
        apiVersion: 'tekton.dev/v1beta1',
        whenExpressions: [
          {
            input: 'false',
            values: ['false'],
            operator: 'in',
          },
        ],
        pipelineTaskName: 'clamav-scan',
      },
      {
        kind: 'TaskRun',
        name: 'human-resources-on-push-z79cl-sbom-json-check',
        apiVersion: 'tekton.dev/v1beta1',
        whenExpressions: [
          {
            input: 'false',
            values: ['false'],
            operator: 'in',
          },
        ],
        pipelineTaskName: 'sbom-json-check',
      },
      {
        kind: 'TaskRun',
        name: 'human-resources-on-push-z79cl-show-sbom',
        apiVersion: 'tekton.dev/v1beta1',
        pipelineTaskName: 'show-sbom',
      },
      {
        kind: 'TaskRun',
        name: 'human-resources-on-push-z79cl-show-summary',
        apiVersion: 'tekton.dev/v1beta1',
        pipelineTaskName: 'show-summary',
      },
    ],
    pipelineResults: [
      {
        name: 'IMAGE_URL',
        value:
          'quay.io/redhat-user-workloads-stage/test-ns/test-application/human-resources:3450decf7174f23304c8e523bc998526ef57e559',
      },
      {
        name: 'IMAGE_DIGEST',
        value: 'sha256:1d6da200c8ae98384a35bae37516d07b453dde85a91ff891ce57f3a99d420e6a',
      },
      {
        name: 'CHAINS-GIT_URL',
        value: 'https://github.com/github-user/human-resources',
      },
      {
        name: 'CHAINS-GIT_COMMIT',
        value: '3450decf7174f23304c8e523bc998526ef57e559',
      },
      {
        name: 'JAVA_COMMUNITY_DEPENDENCIES',
        value: '',
      },
    ],
  },
  metadata: {
    uid: 'cfc81c92-3418-446c-a819-62b2241f2e65',
    name: 'human-resources-on-push-z79cl',
    labels: {
      'tekton.dev/pipeline': 'human-resources-on-push-z79cl',
      'app.kubernetes.io/version': 'v0.19.2',
      'app.kubernetes.io/managed-by': 'pipelinesascode.tekton.dev',
      'pipelinesascode.tekton.dev/sha': '3450decf7174f23304c8e523bc998526ef57e559',
      'appstudio.openshift.io/component': 'human-resources',
      'pipelinesascode.tekton.dev/state': 'completed',
      'pipelinesascode.tekton.dev/branch': 'refs-heads-rhtap-references-main',
      'pipelinesascode.tekton.dev/sender': 'red-hat-trusted-app-pipeline__bot',
      'appstudio.openshift.io/application': 'test-application',
      'pipelinesascode.tekton.dev/url-org': 'github-user',
      'pipelines.appstudio.openshift.io/type': 'build',
      'pipelinesascode.tekton.dev/event-type': 'push',
      'pipelinesascode.tekton.dev/repository': 'human-resources',
      'pipelinesascode.tekton.dev/check-run-id': '15478301138',
      'pipelinesascode.tekton.dev/git-provider': 'github',
      'pipelinesascode.tekton.dev/url-repository': 'human-resources',
      'pipelinesascode.tekton.dev/original-prname': 'human-resources-on-push',
    },
    namespace: 'test-ns',
    finalizers: ['pipelinesascode.tekton.dev', 'chains.tekton.dev/pipelinerun'],
    generation: 2,
    annotations: {
      'chains.tekton.dev/signed': 'true',
      'results.tekton.dev/record':
        'test-ns/results/cfc81c92-3418-446c-a819-62b2241f2e65/records/cfc81c92-3418-446c-a819-62b2241f2e65',
      'results.tekton.dev/result': 'test-ns/results/cfc81c92-3418-446c-a819-62b2241f2e65',
      'pipelinesascode.tekton.dev/sha': '3450decf7174f23304c8e523bc998526ef57e559',
      'pipelinesascode.tekton.dev/state': 'completed',
      'build.appstudio.openshift.io/repo':
        'https://github.com/github-user/human-resources?rev=3450decf7174f23304c8e523bc998526ef57e559',
      'pipelinesascode.tekton.dev/branch': 'refs/heads/rhtap/references/main',
      'pipelinesascode.tekton.dev/sender': 'red-hat-trusted-app-pipeline[bot]',
      'pipelinesascode.tekton.dev/log-url':
        'https://console-openshift-console.apps.stone-stg-m01.7ayg.p1.openshiftapps.com/k8s/ns/test-ns/tekton.dev~v1beta1~PipelineRun/human-resources-on-push-z79cl',
      'pipelinesascode.tekton.dev/sha-url':
        'https://github.com/github-user/human-resources/commit/3450decf7174f23304c8e523bc998526ef57e559',
      'pipelinesascode.tekton.dev/url-org': 'github-user',
      'pipelinesascode.tekton.dev/on-event': '[push]',
      'pipelinesascode.tekton.dev/repo-url': 'https://github.com/github-user/human-resources',
      'pipelinesascode.tekton.dev/sha-title': 'Update RHTAP references',
      'build.appstudio.redhat.com/commit_sha': '3450decf7174f23304c8e523bc998526ef57e559',
      'pipelinesascode.tekton.dev/event-type': 'push',
      'pipelinesascode.tekton.dev/repository': 'human-resources',
      'pipelinesascode.tekton.dev/check-run-id': '15478301138',
      'pipelinesascode.tekton.dev/git-provider': 'github',
      'build.appstudio.redhat.com/target_branch': 'rhtap/references/main',
      'pipelinesascode.tekton.dev/max-keep-runs': '3',
      'pipelinesascode.tekton.dev/url-repository': 'human-resources',
      'pipelinesascode.tekton.dev/git-auth-secret': 'pac-gitauth-mgmx',
      'pipelinesascode.tekton.dev/installation-id': '39596769',
      'pipelinesascode.tekton.dev/original-prname': 'human-resources-on-push',
      'pipelinesascode.tekton.dev/on-target-branch': '[main]',
    },
    generateName: 'human-resources-on-push-',
    resourceVersion: '515807849',
    creationTimestamp: '2023-07-31T09:54:31Z',
    deletionTimestamp: '2023-07-31T09:58:10Z',
    deletionGracePeriodSeconds: 0,
  },
  apiVersion: 'tekton.dev/v1beta1',
};

export const mockTaskRuns = [
  {
    kind: 'TaskRun',
    spec: {
      params: [
        {
          name: 'image-url',
          value:
            'quay.io/redhat-user-workloads-stage/test-ns/test-application/human-resources:3450decf7174f23304c8e523bc998526ef57e559',
        },
        {
          name: 'rebuild',
          value: 'false',
        },
        {
          name: 'skip-checks',
          value: 'false',
        },
        {
          name: 'skip-optional',
          value: 'true',
        },
        {
          name: 'pipelinerun-name',
          value: 'human-resources-on-push-z79cl',
        },
        {
          name: 'pipelinerun-uid',
          value: 'cfc81c92-3418-446c-a819-62b2241f2e65',
        },
      ],
      taskRef: {
        kind: 'Task',
        params: [
          {
            name: 'name',
            value: 'init',
          },
          {
            name: 'bundle',
            value:
              'quay.io/redhat-appstudio-tekton-catalog/task-init:0.1@sha256:26586a7ef08c3e86dfdaf0a5cc38dd3d70c4c02db1331b469caaed0a0f5b3d86',
          },
          {
            name: 'kind',
            value: 'task',
          },
        ],
        resolver: 'bundles',
      },
      timeout: '1h0m0s',
      serviceAccountName: 'appstudio-pipeline',
    },
    status: {
      steps: [
        {
          name: 'init',
          imageID:
            'registry.redhat.io/openshift4/ose-cli@sha256:73df37794ffff7de1101016c23dc623e4990810390ebdabcbbfa065214352c7c',
          container: 'step-init',
          terminated: {
            reason: 'Completed',
            message:
              '[{"key":"build","value":"true","type":1},{"key":"container-registry-secret","value":"unused\\n","type":1}]',
            exitCode: 0,
            startedAt: '2023-07-31T09:54:42Z',
            finishedAt: '2023-07-31T09:54:43Z',
            containerID: 'cri-o://602b89a7f7b2292ff194008f19ebd167c3a1b663551870e3a6fced435ed74007',
          },
        },
      ],
      podName: 'human-resources-on-push-z79cl-init-pod',
      taskSpec: {
        steps: [
          {
            env: [
              {
                name: 'IMAGE_URL',
                value:
                  'quay.io/redhat-user-workloads-stage/test-ns/test-application/human-resources:3450decf7174f23304c8e523bc998526ef57e559',
              },
              {
                name: 'REBUILD',
                value: 'false',
              },
              {
                name: 'SKIP_CHECKS',
                value: 'false',
              },
              {
                name: 'SKIP_OPTIONAL',
                value: 'true',
              },
            ],
            name: 'init',
            image:
              'registry.redhat.io/openshift4/ose-cli:4.13@sha256:73df37794ffff7de1101016c23dc623e4990810390ebdabcbbfa065214352c7c',
            script:
              '#!/bin/bash\necho "Build Initialize: $IMAGE_URL"\necho\n\necho "Determine if Image Already Exists"\n# Build the image when image does not exists or rebuild is set to true\nif ! oc image info $IMAGE_URL &>/dev/null || [ "$REBUILD" == "true" ] || [ "$SKIP_CHECKS" == "false" ]; then\n  echo -n "true" > /tekton/results/build\nelse\n  echo -n "false" > /tekton/results/build\nfi\necho unused > /tekton/results/container-registry-secret\n',
            resources: {},
          },
        ],
        params: [
          {
            name: 'image-url',
            type: 'string',
            description: 'Image URL for build by PipelineRun',
          },
          {
            name: 'rebuild',
            type: 'string',
            default: 'false',
            description: 'Rebuild the image if exists',
          },
          {
            name: 'skip-checks',
            type: 'string',
            default: 'false',
            description: 'Skip checks against built image',
          },
          {
            name: 'skip-optional',
            type: 'string',
            default: 'true',
            description: 'Skip optional checks, set false if you want to run optional checks',
          },
          {
            name: 'pipelinerun-name',
            type: 'string',
            default: '',
            description: 'unused, should be removed in next task version',
          },
          {
            name: 'pipelinerun-uid',
            type: 'string',
            default: '',
            description: 'unused, should be removed in next task version',
          },
        ],
        results: [
          {
            name: 'build',
            type: 'string',
            description: 'Defines if the image in param image-url should be built',
          },
          {
            name: 'container-registry-secret',
            type: 'string',
            description: 'unused, should be removed in next task version',
          },
        ],
        description:
          'Initialize Pipeline Task, include flags for rebuild and auth. Generates image repository secret used by the PipelineRun.',
      },
      startTime: '2023-07-31T09:54:39Z',
      conditions: [
        {
          type: 'Succeeded',
          reason: 'Succeeded',
          status: 'True',
          message: 'All Steps have completed executing',
          lastTransitionTime: '2023-07-31T09:54:43Z',
        },
      ],
      taskResults: [
        {
          name: 'build',
          type: 'string',
          value: 'true',
        },
        {
          name: 'container-registry-secret',
          type: 'string',
          value: 'unused\n',
        },
      ],
      completionTime: '2023-07-31T09:54:43Z',
    },
    metadata: {
      uid: '95b8676f-3cd2-4e9c-a9a5-36b43a8a93a1',
      name: 'human-resources-on-push-z79cl-init',
      labels: {
        'tekton.dev/task': 'init',
        'tekton.dev/memberOf': 'tasks',
        'tekton.dev/pipeline': 'human-resources-on-push-z79cl',
        'tekton.dev/pipelineRun': 'human-resources-on-push-z79cl',
        'tekton.dev/pipelineTask': 'init',
        'app.kubernetes.io/version': 'v0.19.2',
        'app.kubernetes.io/managed-by': 'pipelinesascode.tekton.dev',
        'pipelinesascode.tekton.dev/sha': '3450decf7174f23304c8e523bc998526ef57e559',
        'appstudio.openshift.io/component': 'human-resources',
        'pipelinesascode.tekton.dev/state': 'started',
        'pipelinesascode.tekton.dev/branch': 'refs-heads-rhtap-references-main',
        'pipelinesascode.tekton.dev/sender': 'red-hat-trusted-app-pipeline__bot',
        'appstudio.openshift.io/application': 'test-application',
        'pipelinesascode.tekton.dev/url-org': 'github-user',
        'pipelines.appstudio.openshift.io/type': 'build',
        'pipelinesascode.tekton.dev/event-type': 'push',
        'pipelinesascode.tekton.dev/repository': 'human-resources',
        'pipelinesascode.tekton.dev/check-run-id': '15478301138',
        'pipelinesascode.tekton.dev/git-provider': 'github',
        'pipelinesascode.tekton.dev/url-repository': 'human-resources',
        'pipelinesascode.tekton.dev/original-prname': 'human-resources-on-push',
      },
      namespace: 'test-ns',
      finalizers: ['chains.tekton.dev'],
      generation: 1,
      annotations: {
        'tekton.dev/tags': 'appstudio, hacbs',
        'results.tekton.dev/log':
          'test-ns/results/cfc81c92-3418-446c-a819-62b2241f2e65/logs/0fcf6cd7-6387-3089-adf8-1e92d53db919',
        'chains.tekton.dev/signed': 'true',
        'results.tekton.dev/record':
          'test-ns/results/cfc81c92-3418-446c-a819-62b2241f2e65/records/95b8676f-3cd2-4e9c-a9a5-36b43a8a93a1',
        'results.tekton.dev/result': 'test-ns/results/cfc81c92-3418-446c-a819-62b2241f2e65',
        'pipeline.tekton.dev/release': 'c8ef1db',
        'pipelinesascode.tekton.dev/sha': '3450decf7174f23304c8e523bc998526ef57e559',
        'tekton.dev/pipelines.minVersion': '0.12.1',
        'pipelinesascode.tekton.dev/state': 'started',
        'build.appstudio.openshift.io/repo':
          'https://github.com/github-user/human-resources?rev=3450decf7174f23304c8e523bc998526ef57e559',
        'pipelinesascode.tekton.dev/branch': 'refs/heads/rhtap/references/main',
        'pipelinesascode.tekton.dev/sender': 'red-hat-trusted-app-pipeline[bot]',
        'pipelinesascode.tekton.dev/log-url':
          'https://console-openshift-console.apps.stone-stg-m01.7ayg.p1.openshiftapps.com/k8s/ns/test-ns/tekton.dev~v1beta1~PipelineRun/human-resources-on-push-z79cl',
        'pipelinesascode.tekton.dev/sha-url':
          'https://github.com/github-user/human-resources/commit/3450decf7174f23304c8e523bc998526ef57e559',
        'pipelinesascode.tekton.dev/url-org': 'github-user',
        'pipelinesascode.tekton.dev/on-event': '[push]',
        'pipelinesascode.tekton.dev/repo-url': 'https://github.com/github-user/human-resources',
        'pipelinesascode.tekton.dev/sha-title': 'Update RHTAP references',
        'build.appstudio.redhat.com/commit_sha': '3450decf7174f23304c8e523bc998526ef57e559',
        'pipelinesascode.tekton.dev/event-type': 'push',
        'pipelinesascode.tekton.dev/repository': 'human-resources',
        'pipelinesascode.tekton.dev/check-run-id': '15478301138',
        'pipelinesascode.tekton.dev/git-provider': 'github',
        'build.appstudio.redhat.com/target_branch': 'rhtap/references/main',
        'pipelinesascode.tekton.dev/max-keep-runs': '3',
        'results.tekton.dev/childReadyForDeletion': 'true',
        'pipelinesascode.tekton.dev/url-repository': 'human-resources',
        'pipelinesascode.tekton.dev/git-auth-secret': 'pac-gitauth-mgmx',
        'pipelinesascode.tekton.dev/installation-id': '39596769',
        'pipelinesascode.tekton.dev/original-prname': 'human-resources-on-push',
        'pipelinesascode.tekton.dev/on-target-branch': '[main]',
      },
      resourceVersion: '515798791',
      creationTimestamp: '2023-07-31T09:54:38Z',
    },
    apiVersion: 'tekton.dev/v1beta1',
  },
  {
    kind: 'TaskRun',
    spec: {
      params: [
        {
          name: 'url',
          value: 'https://github.com/github-user/human-resources',
        },
        {
          name: 'revision',
          value: '3450decf7174f23304c8e523bc998526ef57e559',
        },
      ],
      taskRef: {
        kind: 'Task',
        params: [
          {
            name: 'name',
            value: 'git-clone',
          },
          {
            name: 'bundle',
            value:
              'quay.io/redhat-appstudio-tekton-catalog/task-git-clone:0.1@sha256:44260edd7da429a3bca3843be5049a15f05f658d1e9766521379e067e972c1e0',
          },
          {
            name: 'kind',
            value: 'task',
          },
        ],
        resolver: 'bundles',
      },
      timeout: '1h0m0s',
      workspaces: [
        {
          name: 'output',
          persistentVolumeClaim: {
            claimName: 'pvc-62f466d23f',
          },
        },
        {
          name: 'basic-auth',
          secret: {
            secretName: 'pac-gitauth-mgmx',
          },
        },
      ],
      serviceAccountName: 'appstudio-pipeline',
    },
    status: {
      steps: [
        {
          name: 'clone',
          imageID:
            'registry.redhat.io/openshift-pipelines/pipelines-git-init-rhel8@sha256:2fa0b06d52b04f377c696412e19307a9eff27383f81d87aae0b4f71672a1cd0b',
          container: 'step-clone',
          terminated: {
            reason: 'Completed',
            message:
              '[{"key":"commit","value":"3450decf7174f23304c8e523bc998526ef57e559","type":1},{"key":"url","value":"https://github.com/github-user/human-resources","type":1}]',
            exitCode: 0,
            startedAt: '2023-07-31T09:55:01Z',
            finishedAt: '2023-07-31T09:55:01Z',
            containerID: 'cri-o://c1f096709ae569084b8d6a1f2b440533905c863ad05baee8122184b6a04cc82c',
          },
        },
        {
          name: 'symlink-check',
          imageID:
            'registry.redhat.io/ubi9@sha256:089bd3b82a78ac45c0eed231bb58bfb43bfcd0560d9bba240fc6355502c92976',
          container: 'step-symlink-check',
          terminated: {
            reason: 'Completed',
            message:
              '[{"key":"commit","value":"3450decf7174f23304c8e523bc998526ef57e559","type":1},{"key":"url","value":"https://github.com/github-user/human-resources","type":1}]',
            exitCode: 0,
            startedAt: '2023-07-31T09:55:02Z',
            finishedAt: '2023-07-31T09:55:02Z',
            containerID: 'cri-o://ef46e57d46f647e999830fbf35f19577d83b0cc7cda36fa438e65051910c53e8',
          },
        },
      ],
      podName: 'human-resources-on-push-z79cl-clone-repository-pod',
      taskSpec: {
        steps: [
          {
            env: [
              {
                name: 'HOME',
                value: '/tekton/home',
              },
              {
                name: 'PARAM_URL',
                value: 'https://github.com/github-user/human-resources',
              },
              {
                name: 'PARAM_REVISION',
                value: '3450decf7174f23304c8e523bc998526ef57e559',
              },
              {
                name: 'PARAM_REFSPEC',
              },
              {
                name: 'PARAM_SUBMODULES',
                value: 'true',
              },
              {
                name: 'PARAM_DEPTH',
                value: '1',
              },
              {
                name: 'PARAM_SSL_VERIFY',
                value: 'true',
              },
              {
                name: 'PARAM_SUBDIRECTORY',
              },
              {
                name: 'PARAM_DELETE_EXISTING',
                value: 'true',
              },
              {
                name: 'PARAM_HTTP_PROXY',
              },
              {
                name: 'PARAM_HTTPS_PROXY',
              },
              {
                name: 'PARAM_NO_PROXY',
              },
              {
                name: 'PARAM_VERBOSE',
                value: 'true',
              },
              {
                name: 'PARAM_SPARSE_CHECKOUT_DIRECTORIES',
              },
              {
                name: 'PARAM_USER_HOME',
                value: '/tekton/home',
              },
              {
                name: 'WORKSPACE_OUTPUT_PATH',
                value: '/workspace/output',
              },
              {
                name: 'WORKSPACE_SSH_DIRECTORY_BOUND',
                value: 'false',
              },
              {
                name: 'WORKSPACE_SSH_DIRECTORY_PATH',
              },
              {
                name: 'WORKSPACE_BASIC_AUTH_DIRECTORY_BOUND',
                value: 'true',
              },
              {
                name: 'WORKSPACE_BASIC_AUTH_DIRECTORY_PATH',
                value: '/workspace/basic-auth',
              },
            ],
            name: 'clone',
            image:
              'registry.redhat.io/openshift-pipelines/pipelines-git-init-rhel8:v1.8.2-8@sha256:a538c423e7a11aae6ae582a411fdb090936458075f99af4ce5add038bb6983e8',
            script:
              '#!/usr/bin/env sh\nset -eu\n\nif [ "${PARAM_VERBOSE}" = "true" ] ; then\n  set -x\nfi\n\nif [ "${WORKSPACE_BASIC_AUTH_DIRECTORY_BOUND}" = "true" ] ; then\n  cp "${WORKSPACE_BASIC_AUTH_DIRECTORY_PATH}/.git-credentials" "${PARAM_USER_HOME}/.git-credentials"\n  cp "${WORKSPACE_BASIC_AUTH_DIRECTORY_PATH}/.gitconfig" "${PARAM_USER_HOME}/.gitconfig"\n  chmod 400 "${PARAM_USER_HOME}/.git-credentials"\n  chmod 400 "${PARAM_USER_HOME}/.gitconfig"\nfi\n\nif [ "${WORKSPACE_SSH_DIRECTORY_BOUND}" = "true" ] ; then\n  cp -R "${WORKSPACE_SSH_DIRECTORY_PATH}" "${PARAM_USER_HOME}"/.ssh\n  chmod 700 "${PARAM_USER_HOME}"/.ssh\n  chmod -R 400 "${PARAM_USER_HOME}"/.ssh/*\nfi\n\nCHECKOUT_DIR="${WORKSPACE_OUTPUT_PATH}/${PARAM_SUBDIRECTORY}"\n\ncleandir() {\n  # Delete any existing contents of the repo directory if it exists.\n  #\n  # We don\'t just "rm -rf ${CHECKOUT_DIR}" because ${CHECKOUT_DIR} might be "/"\n  # or the root of a mounted volume.\n  if [ -d "${CHECKOUT_DIR}" ] ; then\n    # Delete non-hidden files and directories\n    rm -rf "${CHECKOUT_DIR:?}"/*\n    # Delete files and directories starting with . but excluding ..\n    rm -rf "${CHECKOUT_DIR}"/.[!.]*\n    # Delete files and directories starting with .. plus any other character\n    rm -rf "${CHECKOUT_DIR}"/..?*\n  fi\n}\n\nif [ "${PARAM_DELETE_EXISTING}" = "true" ] ; then\n  cleandir\nfi\n\ntest -z "${PARAM_HTTP_PROXY}" || export HTTP_PROXY="${PARAM_HTTP_PROXY}"\ntest -z "${PARAM_HTTPS_PROXY}" || export HTTPS_PROXY="${PARAM_HTTPS_PROXY}"\ntest -z "${PARAM_NO_PROXY}" || export NO_PROXY="${PARAM_NO_PROXY}"\n\n/ko-app/git-init \\\n  -url="${PARAM_URL}" \\\n  -revision="${PARAM_REVISION}" \\\n  -refspec="${PARAM_REFSPEC}" \\\n  -path="${CHECKOUT_DIR}" \\\n  -sslVerify="${PARAM_SSL_VERIFY}" \\\n  -submodules="${PARAM_SUBMODULES}" \\\n  -depth="${PARAM_DEPTH}" \\\n  -sparseCheckoutDirectories="${PARAM_SPARSE_CHECKOUT_DIRECTORIES}"\ncd "${CHECKOUT_DIR}"\nRESULT_SHA="$(git rev-parse HEAD)"\nEXIT_CODE="$?"\nif [ "${EXIT_CODE}" != 0 ] ; then\n  exit "${EXIT_CODE}"\nfi\nprintf "%s" "${RESULT_SHA}" > "/tekton/results/commit"\nprintf "%s" "${PARAM_URL}" > "/tekton/results/url"\n',
            resources: {},
            securityContext: {
              runAsUser: 0,
            },
          },
          {
            env: [
              {
                name: 'PARAM_ENABLE_SYMLINK_CHECK',
                value: 'true',
              },
              {
                name: 'PARAM_SUBDIRECTORY',
              },
              {
                name: 'WORKSPACE_OUTPUT_PATH',
                value: '/workspace/output',
              },
            ],
            name: 'symlink-check',
            image: 'registry.redhat.io/ubi9:9.2-696',
            script:
              '#!/usr/bin/env bash\nset -euo pipefail\n\nCHECKOUT_DIR="${WORKSPACE_OUTPUT_PATH}/${PARAM_SUBDIRECTORY}"\ncheck_symlinks() {\n  FOUND_SYMLINK_POINTING_OUTSIDE_OF_REPO=false\n  while read symlink\n  do\n    target=$(readlink -f "$symlink")\n    if ! [[ "$target" =~ ^$CHECKOUT_DIR ]]; then\n      echo "The cloned repository contains symlink pointing outside of the cloned repository: $symlink"\n      FOUND_SYMLINK_POINTING_OUTSIDE_OF_REPO=true\n    fi\n  done < <(find $CHECKOUT_DIR -type l -print)\n  if [ "$FOUND_SYMLINK_POINTING_OUTSIDE_OF_REPO" = true ] ; then\n    return 1\n  fi\n}\n\nif [ "${PARAM_ENABLE_SYMLINK_CHECK}" = "true" ] ; then\n  echo "Running symlink check"\n  check_symlinks\nfi\n',
            resources: {},
          },
        ],
        params: [
          {
            name: 'url',
            type: 'string',
            description: 'Repository URL to clone from.',
          },
          {
            name: 'revision',
            type: 'string',
            default: '',
            description: 'Revision to checkout. (branch, tag, sha, ref, etc...)',
          },
          {
            name: 'refspec',
            type: 'string',
            default: '',
            description: 'Refspec to fetch before checking out revision.',
          },
          {
            name: 'submodules',
            type: 'string',
            default: 'true',
            description: 'Initialize and fetch git submodules.',
          },
          {
            name: 'depth',
            type: 'string',
            default: '1',
            description: 'Perform a shallow clone, fetching only the most recent N commits.',
          },
          {
            name: 'sslVerify',
            type: 'string',
            default: 'true',
            description:
              'Set the `http.sslVerify` global git config. Setting this to `false` is not advised unless you are sure that you trust your git remote.',
          },
          {
            name: 'subdirectory',
            type: 'string',
            default: '',
            description: 'Subdirectory inside the `output` Workspace to clone the repo into.',
          },
          {
            name: 'sparseCheckoutDirectories',
            type: 'string',
            default: '',
            description:
              'Define the directory patterns to match or exclude when performing a sparse checkout.',
          },
          {
            name: 'deleteExisting',
            type: 'string',
            default: 'true',
            description:
              'Clean out the contents of the destination directory if it already exists before cloning.',
          },
          {
            name: 'httpProxy',
            type: 'string',
            default: '',
            description: 'HTTP proxy server for non-SSL requests.',
          },
          {
            name: 'httpsProxy',
            type: 'string',
            default: '',
            description: 'HTTPS proxy server for SSL requests.',
          },
          {
            name: 'noProxy',
            type: 'string',
            default: '',
            description: 'Opt out of proxying HTTP/HTTPS requests.',
          },
          {
            name: 'verbose',
            type: 'string',
            default: 'true',
            description: "Log the commands that are executed during `git-clone`'s operation.",
          },
          {
            name: 'gitInitImage',
            type: 'string',
            default:
              'registry.redhat.io/openshift-pipelines/pipelines-git-init-rhel8:v1.8.2-8@sha256:a538c423e7a11aae6ae582a411fdb090936458075f99af4ce5add038bb6983e8',
            description: 'The image providing the git-init binary that this Task runs.',
          },
          {
            name: 'userHome',
            type: 'string',
            default: '/tekton/home',
            description:
              "Absolute path to the user's home directory. Set this explicitly if you are running the image as a non-root user or have overridden\nthe gitInitImage param with an image containing custom user configuration.\n",
          },
          {
            name: 'enableSymlinkCheck',
            type: 'string',
            default: 'true',
            description:
              "Check symlinks in the repo. If they're pointing outside of the repo, the build will fail.\n",
          },
        ],
        results: [
          {
            name: 'commit',
            type: 'string',
            description: 'The precise commit SHA that was fetched by this Task.',
          },
          {
            name: 'url',
            type: 'string',
            description: 'The precise URL that was fetched by this Task.',
          },
        ],
        workspaces: [
          {
            name: 'output',
            description: 'The git repo will be cloned onto the volume backing this Workspace.',
          },
          {
            name: 'ssh-directory',
            optional: true,
            description:
              "A .ssh directory with private key, known_hosts, config, etc. Copied to\nthe user's home before git commands are executed. Used to authenticate\nwith the git remote when performing the clone. Binding a Secret to this\nWorkspace is strongly recommended over other volume types.\n",
          },
          {
            name: 'basic-auth',
            optional: true,
            description:
              "A Workspace containing a .gitconfig and .git-credentials file. These\nwill be copied to the user's home before any git commands are run. Any\nother files in this Workspace are ignored. It is strongly recommended\nto use ssh-directory over basic-auth whenever possible and to bind a\nSecret to this Workspace over other volume types.\n",
          },
        ],
        description:
          'The git-clone Task will clone a repo from the provided url into the output Workspace. By default the repo will be cloned into the root of your Workspace.',
      },
      startTime: '2023-07-31T09:54:44Z',
      conditions: [
        {
          type: 'Succeeded',
          reason: 'Succeeded',
          status: 'True',
          message: 'All Steps have completed executing',
          lastTransitionTime: '2023-07-31T09:55:02Z',
        },
      ],
      taskResults: [
        {
          name: 'commit',
          type: 'string',
          value: '3450decf7174f23304c8e523bc998526ef57e559',
        },
        {
          name: 'url',
          type: 'string',
          value: 'https://github.com/github-user/human-resources',
        },
      ],
      completionTime: '2023-07-31T09:55:02Z',
    },
    metadata: {
      uid: '6b2e6979-6c04-4ef5-866f-24963100fba2',
      name: 'human-resources-on-push-z79cl-clone-repository',
      labels: {
        'tekton.dev/task': 'git-clone',
        'tekton.dev/memberOf': 'tasks',
        'tekton.dev/pipeline': 'human-resources-on-push-z79cl',
        'tekton.dev/pipelineRun': 'human-resources-on-push-z79cl',
        'tekton.dev/pipelineTask': 'clone-repository',
        'app.kubernetes.io/version': 'v0.19.2',
        'app.kubernetes.io/managed-by': 'pipelinesascode.tekton.dev',
        'pipelinesascode.tekton.dev/sha': '3450decf7174f23304c8e523bc998526ef57e559',
        'appstudio.openshift.io/component': 'human-resources',
        'pipelinesascode.tekton.dev/state': 'started',
        'pipelinesascode.tekton.dev/branch': 'refs-heads-rhtap-references-main',
        'pipelinesascode.tekton.dev/sender': 'red-hat-trusted-app-pipeline__bot',
        'appstudio.openshift.io/application': 'test-application',
        'pipelinesascode.tekton.dev/url-org': 'github-user',
        'pipelines.appstudio.openshift.io/type': 'build',
        'pipelinesascode.tekton.dev/event-type': 'push',
        'pipelinesascode.tekton.dev/repository': 'human-resources',
        'pipelinesascode.tekton.dev/check-run-id': '15478301138',
        'pipelinesascode.tekton.dev/git-provider': 'github',
        'pipelinesascode.tekton.dev/url-repository': 'human-resources',
        'pipelinesascode.tekton.dev/original-prname': 'human-resources-on-push',
      },
      namespace: 'test-ns',
      finalizers: ['chains.tekton.dev'],
      generation: 1,
      annotations: {
        'tekton.dev/tags': 'git',
        'tekton.dev/platforms': 'linux/amd64,linux/s390x,linux/ppc64le,linux/arm64',
        'tekton.dev/categories': 'Git',
        'results.tekton.dev/log':
          'test-ns/results/cfc81c92-3418-446c-a819-62b2241f2e65/logs/9080e484-e4d8-343a-914b-0d5b39a69f62',
        'tekton.dev/displayName': 'git clone',
        'chains.tekton.dev/signed': 'true',
        'results.tekton.dev/record':
          'test-ns/results/cfc81c92-3418-446c-a819-62b2241f2e65/records/6b2e6979-6c04-4ef5-866f-24963100fba2',
        'results.tekton.dev/result': 'test-ns/results/cfc81c92-3418-446c-a819-62b2241f2e65',
        'pipeline.tekton.dev/release': 'c8ef1db',
        'pipelinesascode.tekton.dev/sha': '3450decf7174f23304c8e523bc998526ef57e559',
        'tekton.dev/pipelines.minVersion': '0.21.0',
        'pipelinesascode.tekton.dev/state': 'started',
        'build.appstudio.openshift.io/repo':
          'https://github.com/github-user/human-resources?rev=3450decf7174f23304c8e523bc998526ef57e559',
        'pipelinesascode.tekton.dev/branch': 'refs/heads/rhtap/references/main',
        'pipelinesascode.tekton.dev/sender': 'red-hat-trusted-app-pipeline[bot]',
        'pipelinesascode.tekton.dev/log-url':
          'https://console-openshift-console.apps.stone-stg-m01.7ayg.p1.openshiftapps.com/k8s/ns/test-ns/tekton.dev~v1beta1~PipelineRun/human-resources-on-push-z79cl',
        'pipelinesascode.tekton.dev/sha-url':
          'https://github.com/github-user/human-resources/commit/3450decf7174f23304c8e523bc998526ef57e559',
        'pipelinesascode.tekton.dev/url-org': 'github-user',
        'pipelinesascode.tekton.dev/on-event': '[push]',
        'pipelinesascode.tekton.dev/repo-url': 'https://github.com/github-user/human-resources',
        'pipelinesascode.tekton.dev/sha-title': 'Update RHTAP references',
        'build.appstudio.redhat.com/commit_sha': '3450decf7174f23304c8e523bc998526ef57e559',
        'pipelinesascode.tekton.dev/event-type': 'push',
        'pipelinesascode.tekton.dev/repository': 'human-resources',
        'pipelinesascode.tekton.dev/check-run-id': '15478301138',
        'pipelinesascode.tekton.dev/git-provider': 'github',
        'build.appstudio.redhat.com/target_branch': 'rhtap/references/main',
        'pipelinesascode.tekton.dev/max-keep-runs': '3',
        'results.tekton.dev/childReadyForDeletion': 'true',
        'pipelinesascode.tekton.dev/url-repository': 'human-resources',
        'pipelinesascode.tekton.dev/git-auth-secret': 'pac-gitauth-mgmx',
        'pipelinesascode.tekton.dev/installation-id': '39596769',
        'pipelinesascode.tekton.dev/original-prname': 'human-resources-on-push',
        'pipelinesascode.tekton.dev/on-target-branch': '[main]',
      },
      resourceVersion: '515799373',
      creationTimestamp: '2023-07-31T09:54:43Z',
    },
    apiVersion: 'tekton.dev/v1beta1',
  },
  {
    kind: 'TaskRun',
    spec: {
      params: [
        {
          name: 'IMAGE',
          value:
            'quay.io/redhat-user-workloads-stage/test-ns/test-application/human-resources:3450decf7174f23304c8e523bc998526ef57e559',
        },
        {
          name: 'DOCKERFILE',
          value:
            'https://raw.githubusercontent.com/devfile-samples/devfile-sample-java-springboot-basic/main/docker/Dockerfile',
        },
        {
          name: 'CONTEXT',
          value: '.',
        },
        {
          name: 'HERMETIC',
          value: 'false',
        },
        {
          name: 'PREFETCH_INPUT',
          value: '',
        },
        {
          name: 'IMAGE_EXPIRES_AFTER',
          value: '',
        },
        {
          name: 'COMMIT_SHA',
          value: '3450decf7174f23304c8e523bc998526ef57e559',
        },
      ],
      taskRef: {
        kind: 'Task',
        params: [
          {
            name: 'name',
            value: 'buildah',
          },
          {
            name: 'bundle',
            value:
              'quay.io/redhat-appstudio-tekton-catalog/task-buildah:0.1@sha256:3b99002047326ed803f32a9b952c715338c513c95ea1ebcf28e59a851e9930e2',
          },
          {
            name: 'kind',
            value: 'task',
          },
        ],
        resolver: 'bundles',
      },
      timeout: '1h0m0s',
      workspaces: [
        {
          name: 'source',
          persistentVolumeClaim: {
            claimName: 'pvc-62f466d23f',
          },
        },
      ],
      serviceAccountName: 'appstudio-pipeline',
    },
    status: {
      steps: [
        {
          name: 'build',
          imageID:
            'quay.io/redhat-appstudio/buildah@sha256:381e9bfedd59701477621da93892106873a6951b196105d3d2d85c3f6d7b569b',
          container: 'step-build',
          terminated: {
            reason: 'Completed',
            exitCode: 0,
            startedAt: '2023-07-31T09:55:11Z',
            finishedAt: '2023-07-31T09:56:03Z',
            containerID: 'cri-o://2b1ff45e03b4cb9b736353a78d054040b0656d9b72ad82437e9a4456ed46bbe2',
          },
        },
        {
          name: 'sbom-syft-generate',
          imageID:
            'quay.io/redhat-appstudio/syft@sha256:09afc449976230f66848c19bb5ccf344eb0eeb4ed50747e33b53aff49462c319',
          container: 'step-sbom-syft-generate',
          terminated: {
            reason: 'Completed',
            exitCode: 0,
            startedAt: '2023-07-31T09:56:03Z',
            finishedAt: '2023-07-31T09:56:16Z',
            containerID: 'cri-o://f8b6cea71d5ff29df576e6a43d6fa3aaafec35c6a4b9a0d5bda195e797326937',
          },
        },
        {
          name: 'analyse-dependencies-java-sbom',
          imageID:
            'quay.io/redhat-appstudio/hacbs-jvm-build-request-processor@sha256:b198cf4b33dab59ce8ac25afd4e1001390db29ca2dec83dc8a1e21b0359ce743',
          container: 'step-analyse-dependencies-java-sbom',
          terminated: {
            reason: 'Completed',
            message: '[{"key":"JAVA_COMMUNITY_DEPENDENCIES","value":"","type":1}]',
            exitCode: 0,
            startedAt: '2023-07-31T09:56:17Z',
            finishedAt: '2023-07-31T09:56:17Z',
            containerID: 'cri-o://2fcb66b21cdfab83593c55858e62fbf21c4a81b644ccbf436cf7d44f961a7526',
          },
        },
        {
          name: 'merge-syft-sboms',
          imageID:
            'registry.access.redhat.com/ubi9/python-39@sha256:0c2f708b4977469d090719d939778eb95b42c02c1da6476aa95f2e875920652b',
          container: 'step-merge-syft-sboms',
          terminated: {
            reason: 'Completed',
            message: '[{"key":"JAVA_COMMUNITY_DEPENDENCIES","value":"","type":1}]',
            exitCode: 0,
            startedAt: '2023-07-31T09:56:17Z',
            finishedAt: '2023-07-31T09:56:17Z',
            containerID: 'cri-o://857f0612fc57382629982edf0893075a18394f6076aee40f5ecfabbb81342d4f',
          },
        },
        {
          name: 'merge-cachi2-sbom',
          imageID:
            'quay.io/redhat-appstudio/cachi2@sha256:4bbc8bb086522568c76aa71a0d0c0a1a891ed5a683ffb1e3d696f3a02914ecaa',
          container: 'step-merge-cachi2-sbom',
          terminated: {
            reason: 'Completed',
            message: '[{"key":"JAVA_COMMUNITY_DEPENDENCIES","value":"","type":1}]',
            exitCode: 0,
            startedAt: '2023-07-31T09:56:17Z',
            finishedAt: '2023-07-31T09:56:17Z',
            containerID: 'cri-o://894385d8c0095b9dab05dc31c829f3abd9726c6f10a394cade3acc9444047dea',
          },
        },
        {
          name: 'create-purl-sbom',
          imageID:
            'registry.access.redhat.com/ubi9/python-39@sha256:0c2f708b4977469d090719d939778eb95b42c02c1da6476aa95f2e875920652b',
          container: 'step-create-purl-sbom',
          terminated: {
            reason: 'Completed',
            message: '[{"key":"JAVA_COMMUNITY_DEPENDENCIES","value":"","type":1}]',
            exitCode: 0,
            startedAt: '2023-07-31T09:56:18Z',
            finishedAt: '2023-07-31T09:56:18Z',
            containerID: 'cri-o://0637dc2a68896399a82301e3f36c26c11c89f4156d9474719e0dcfa4a80bfa91',
          },
        },
        {
          name: 'inject-sbom-and-push',
          imageID:
            'registry.access.redhat.com/ubi9/buildah@sha256:c8b1d312815452964885680fc5bc8d99b3bfe9b6961228c71a09c72ca8e915eb',
          container: 'step-inject-sbom-and-push',
          terminated: {
            reason: 'Completed',
            message:
              '[{"key":"BASE_IMAGES_DIGESTS","value":"registry.access.redhat.com/ubi8/openjdk-17:1.15-1.1682053058@sha256:b00f687d913b8d1e027f7eabd6765de6c8d469629bef9550f10dbf207af24fe5\\nregistry.access.redhat.com/ubi8/openjdk-17-runtime:1.15-1.1682053056@sha256:f921cf1f9147e4b306908f3bcb61dd215b4a51970f8db560ede02ee6a492fa99\\n","type":1},{"key":"IMAGE_DIGEST","value":"sha256:1d6da200c8ae98384a35bae37516d07b453dde85a91ff891ce57f3a99d420e6a","type":1},{"key":"IMAGE_URL","value":"quay.io/redhat-user-workloads-stage/test-ns/test-application/human-resources:3450decf7174f23304c8e523bc998526ef57e559","type":1},{"key":"JAVA_COMMUNITY_DEPENDENCIES","value":"","type":1}]',
            exitCode: 0,
            startedAt: '2023-07-31T09:56:18Z',
            finishedAt: '2023-07-31T09:56:29Z',
            containerID: 'cri-o://15f7bd4de0210a4427a3d9dda5a136f570f6fb00e0c523c381be73ab3e625399',
          },
        },
        {
          name: 'upload-sbom',
          imageID:
            'quay.io/redhat-appstudio/cosign@sha256:c883d6f8d39148f2cea71bff4622d196d89df3e510f36c140c097b932f0dd5d5',
          container: 'step-upload-sbom',
          terminated: {
            reason: 'Completed',
            message:
              '[{"key":"BASE_IMAGES_DIGESTS","value":"registry.access.redhat.com/ubi8/openjdk-17:1.15-1.1682053058@sha256:b00f687d913b8d1e027f7eabd6765de6c8d469629bef9550f10dbf207af24fe5\\nregistry.access.redhat.com/ubi8/openjdk-17-runtime:1.15-1.1682053056@sha256:f921cf1f9147e4b306908f3bcb61dd215b4a51970f8db560ede02ee6a492fa99\\n","type":1},{"key":"IMAGE_DIGEST","value":"sha256:1d6da200c8ae98384a35bae37516d07b453dde85a91ff891ce57f3a99d420e6a","type":1},{"key":"IMAGE_URL","value":"quay.io/redhat-user-workloads-stage/test-ns/test-application/human-resources:3450decf7174f23304c8e523bc998526ef57e559","type":1},{"key":"JAVA_COMMUNITY_DEPENDENCIES","value":"","type":1}]',
            exitCode: 0,
            startedAt: '2023-07-31T09:56:30Z',
            finishedAt: '2023-07-31T09:56:31Z',
            containerID: 'cri-o://638ca83074074787d7efdeef8f9599bcdcf3e99b49e48e12a1c95d009805c4fe',
          },
        },
      ],
      podName: 'human-resources-on-push-z79cl-build-container-pod',
      taskSpec: {
        steps: [
          {
            env: [
              {
                name: 'COMMIT_SHA',
                value: '3450decf7174f23304c8e523bc998526ef57e559',
              },
              {
                name: 'BUILDAH_FORMAT',
                value: 'oci',
              },
              {
                name: 'STORAGE_DRIVER',
                value: 'vfs',
              },
              {
                name: 'HERMETIC',
                value: 'false',
              },
              {
                name: 'PREFETCH_INPUT',
              },
              {
                name: 'CONTEXT',
                value: '.',
              },
              {
                name: 'DOCKERFILE',
                value:
                  'https://raw.githubusercontent.com/devfile-samples/devfile-sample-java-springboot-basic/main/docker/Dockerfile',
              },
              {
                name: 'IMAGE',
                value:
                  'quay.io/redhat-user-workloads-stage/test-ns/test-application/human-resources:3450decf7174f23304c8e523bc998526ef57e559',
              },
              {
                name: 'TLSVERIFY',
                value: 'true',
              },
              {
                name: 'IMAGE_EXPIRES_AFTER',
              },
            ],
            name: 'build',
            image: 'quay.io/redhat-appstudio/buildah:v1.28',
            script:
              'if [ -e "$CONTEXT/$DOCKERFILE" ]; then\n  dockerfile_path="$CONTEXT/$DOCKERFILE"\nelif [ -e "$DOCKERFILE" ]; then\n  dockerfile_path="$DOCKERFILE"\nelif echo "$DOCKERFILE" | grep -q "^https\\?://"; then\n  echo "Fetch Dockerfile from $DOCKERFILE"\n  dockerfile_path=$(mktemp --suffix=-Dockerfile)\n  http_code=$(curl -s -L -w "%{http_code}" --output "$dockerfile_path" "$DOCKERFILE")\n  if [ $http_code != 200 ]; then\n    echo "No Dockerfile is fetched. Server responds $http_code"\n    exit 1\n  fi\n  http_code=$(curl -s -L -w "%{http_code}" --output "$dockerfile_path.dockerignore.tmp" "$DOCKERFILE.dockerignore")\n  if [ $http_code = 200 ]; then\n    echo "Fetched .dockerignore from $DOCKERFILE.dockerignore"\n    mv "$dockerfile_path.dockerignore.tmp" $CONTEXT/.dockerignore\n  fi\nelse\n  echo "Cannot find Dockerfile $DOCKERFILE"\n  exit 1\nfi\nif [ -n "$JVM_BUILD_WORKSPACE_ARTIFACT_CACHE_PORT_80_TCP_ADDR" ] && grep -q \'^\\s*RUN \\(./\\)\\?mvn\' "$dockerfile_path"; then\n  sed -i -e "s|^\\s*RUN \\(\\(./\\)\\?mvn\\(.*\\)\\)|RUN echo \\"<settings><mirrors><mirror><id>mirror.default</id><url>http://$JVM_BUILD_WORKSPACE_ARTIFACT_CACHE_PORT_80_TCP_ADDR/v1/cache/default/0/</url><mirrorOf>*</mirrorOf></mirror></mirrors></settings>\\" > /tmp/settings.yaml; \\1 -s /tmp/settings.yaml|g" "$dockerfile_path"\n  touch /var/lib/containers/java\nfi\n\n# Fixing group permission on /var/lib/containers\nchown root:root /var/lib/containers\n\nsed -i \'s/^\\s*short-name-mode\\s*=\\s*.*/short-name-mode = "disabled"/\' /etc/containers/registries.conf\n\n# Setting new namespace to run buildah - 2^32-2\necho \'root:1:4294967294\' | tee -a /etc/subuid >> /etc/subgid\n\nif [ "${HERMETIC}" == "true" ]; then\n  BUILDAH_ARGS="--pull=never"\n  UNSHARE_ARGS="--net"\n  for image in $(grep -i \'^\\s*FROM\' "$dockerfile_path" | sed \'s/--platform=\\S*//\' | awk \'{print $2}\'); do\n    unshare -Ufp --keep-caps -r --map-users 1,1,65536 --map-groups 1,1,65536 -- buildah pull $image\n  done\n  echo "Build will be executed with network isolation"\nfi\n\nif [ -n "${PREFETCH_INPUT}" ]; then\n  mv cachi2 /tmp/\n  chmod -R go+rwX /tmp/cachi2\n  VOLUME_MOUNTS="--volume /tmp/cachi2:/cachi2"\n  sed -i \'s|^\\s*run |RUN . /cachi2/cachi2.env \\&\\& \\\\\\n    |i\' "$dockerfile_path"\n  echo "Prefetched content will be made available"\nfi\n\nLABELS=(\n  "--label" "build-date=$(date -u +\'%Y-%m-%dT%H:%M:%S\')"\n  "--label" "architecture=$(uname -m)"\n  "--label" "vcs-type=git"\n)\n[ -n "$COMMIT_SHA" ] && LABELS+=("--label" "vcs-ref=$COMMIT_SHA")\n[ -n "$IMAGE_EXPIRES_AFTER" ] && LABELS+=("--label" "quay.expires-after=$IMAGE_EXPIRES_AFTER")\n\nunshare -Uf $UNSHARE_ARGS --keep-caps -r --map-users 1,1,65536 --map-groups 1,1,65536 -- buildah build \\\n  $VOLUME_MOUNTS \\\n  $BUILDAH_ARGS \\\n  ${LABELS[@]} \\\n  --tls-verify=$TLSVERIFY --no-cache \\\n  --ulimit nofile=4096:4096 \\\n  -f "$dockerfile_path" -t $IMAGE $CONTEXT\n\ncontainer=$(buildah from --pull-never $IMAGE)\nbuildah mount $container | tee /workspace/container_path\necho $container > /workspace/container_name\n\n# Save the SBOM produced by Cachi2 so it can be merged into the final SBOM later\nif [ -n "${PREFETCH_INPUT}" ]; then\n  cp /tmp/cachi2/output/bom.json ./sbom-cachi2.json\nfi\n',
            resources: {
              limits: {
                cpu: '2',
                memory: '4Gi',
              },
              requests: {
                cpu: '250m',
                memory: '512Mi',
              },
            },
            workingDir: '/workspace/source',
            volumeMounts: [
              {
                name: 'varlibcontainers',
                mountPath: '/var/lib/containers',
              },
            ],
            securityContext: {
              capabilities: {
                add: ['SETFCAP'],
              },
            },
          },
          {
            env: [
              {
                name: 'BUILDAH_FORMAT',
                value: 'oci',
              },
              {
                name: 'STORAGE_DRIVER',
                value: 'vfs',
              },
              {
                name: 'HERMETIC',
                value: 'false',
              },
              {
                name: 'PREFETCH_INPUT',
              },
              {
                name: 'CONTEXT',
                value: '.',
              },
              {
                name: 'DOCKERFILE',
                value:
                  'https://raw.githubusercontent.com/devfile-samples/devfile-sample-java-springboot-basic/main/docker/Dockerfile',
              },
              {
                name: 'IMAGE',
                value:
                  'quay.io/redhat-user-workloads-stage/test-ns/test-application/human-resources:3450decf7174f23304c8e523bc998526ef57e559',
              },
              {
                name: 'TLSVERIFY',
                value: 'true',
              },
              {
                name: 'IMAGE_EXPIRES_AFTER',
              },
            ],
            name: 'sbom-syft-generate',
            image: 'quay.io/redhat-appstudio/syft:v0.47.0',
            script:
              'syft dir:/workspace/source --file=/workspace/source/sbom-source.json --output=cyclonedx-json\nfind $(cat /workspace/container_path) -xtype l -delete\nsyft dir:$(cat /workspace/container_path) --file=/workspace/source/sbom-image.json --output=cyclonedx-json\n',
            resources: {},
            volumeMounts: [
              {
                name: 'varlibcontainers',
                mountPath: '/var/lib/containers',
              },
            ],
          },
          {
            env: [
              {
                name: 'BUILDAH_FORMAT',
                value: 'oci',
              },
              {
                name: 'STORAGE_DRIVER',
                value: 'vfs',
              },
              {
                name: 'HERMETIC',
                value: 'false',
              },
              {
                name: 'PREFETCH_INPUT',
              },
              {
                name: 'CONTEXT',
                value: '.',
              },
              {
                name: 'DOCKERFILE',
                value:
                  'https://raw.githubusercontent.com/devfile-samples/devfile-sample-java-springboot-basic/main/docker/Dockerfile',
              },
              {
                name: 'IMAGE',
                value:
                  'quay.io/redhat-user-workloads-stage/test-ns/test-application/human-resources:3450decf7174f23304c8e523bc998526ef57e559',
              },
              {
                name: 'TLSVERIFY',
                value: 'true',
              },
              {
                name: 'IMAGE_EXPIRES_AFTER',
              },
            ],
            name: 'analyse-dependencies-java-sbom',
            image:
              'quay.io/redhat-appstudio/hacbs-jvm-build-request-processor:1d417e6f1f3e68c6c537333b5759796eddae0afc',
            script:
              "if [ -f /var/lib/containers/java ]; then\n  /opt/jboss/container/java/run/run-java.sh analyse-dependencies path $(cat /workspace/container_path) -s /workspace/source/sbom-image.json --task-run-name human-resources-on-push-z79cl-build-container --publishers /tekton/results/SBOM_JAVA_COMPONENTS_COUNT\n  sed -i 's/^/ /' /tekton/results/SBOM_JAVA_COMPONENTS_COUNT # Workaround for SRVKP-2875\nelse\n  touch /tekton/results/JAVA_COMMUNITY_DEPENDENCIES\nfi\n",
            resources: {},
            volumeMounts: [
              {
                name: 'varlibcontainers',
                mountPath: '/var/lib/containers',
              },
            ],
            securityContext: {
              runAsUser: 0,
            },
          },
          {
            env: [
              {
                name: 'BUILDAH_FORMAT',
                value: 'oci',
              },
              {
                name: 'STORAGE_DRIVER',
                value: 'vfs',
              },
              {
                name: 'HERMETIC',
                value: 'false',
              },
              {
                name: 'PREFETCH_INPUT',
              },
              {
                name: 'CONTEXT',
                value: '.',
              },
              {
                name: 'DOCKERFILE',
                value:
                  'https://raw.githubusercontent.com/devfile-samples/devfile-sample-java-springboot-basic/main/docker/Dockerfile',
              },
              {
                name: 'IMAGE',
                value:
                  'quay.io/redhat-user-workloads-stage/test-ns/test-application/human-resources:3450decf7174f23304c8e523bc998526ef57e559',
              },
              {
                name: 'TLSVERIFY',
                value: 'true',
              },
              {
                name: 'IMAGE_EXPIRES_AFTER',
              },
            ],
            name: 'merge-syft-sboms',
            image: 'registry.access.redhat.com/ubi9/python-39:1-125',
            script:
              '#!/bin/python3\nimport json\n\n# load SBOMs\nwith open("./sbom-image.json") as f:\n  image_sbom = json.load(f)\n\nwith open("./sbom-source.json") as f:\n  source_sbom = json.load(f)\n\n# fetch unique components from available SBOMs\ndef get_identifier(component):\n  return component["name"] + \'@\' + component.get("version", "")\n\nexisting_components = [get_identifier(component) for component in image_sbom["components"]]\n\nfor component in source_sbom["components"]:\n  if get_identifier(component) not in existing_components:\n    image_sbom["components"].append(component)\n    existing_components.append(get_identifier(component))\n\nimage_sbom["components"].sort(key=lambda c: get_identifier(c))\n\n# write the CycloneDX unified SBOM\nwith open("./sbom-cyclonedx.json", "w") as f:\n  json.dump(image_sbom, f, indent=4)\n',
            resources: {},
            workingDir: '/workspace/source',
            securityContext: {
              runAsUser: 0,
            },
          },
          {
            env: [
              {
                name: 'BUILDAH_FORMAT',
                value: 'oci',
              },
              {
                name: 'STORAGE_DRIVER',
                value: 'vfs',
              },
              {
                name: 'HERMETIC',
                value: 'false',
              },
              {
                name: 'PREFETCH_INPUT',
              },
              {
                name: 'CONTEXT',
                value: '.',
              },
              {
                name: 'DOCKERFILE',
                value:
                  'https://raw.githubusercontent.com/devfile-samples/devfile-sample-java-springboot-basic/main/docker/Dockerfile',
              },
              {
                name: 'IMAGE',
                value:
                  'quay.io/redhat-user-workloads-stage/test-ns/test-application/human-resources:3450decf7174f23304c8e523bc998526ef57e559',
              },
              {
                name: 'TLSVERIFY',
                value: 'true',
              },
              {
                name: 'IMAGE_EXPIRES_AFTER',
              },
            ],
            name: 'merge-cachi2-sbom',
            image:
              'quay.io/redhat-appstudio/cachi2:0.2.0@sha256:4bbc8bb086522568c76aa71a0d0c0a1a891ed5a683ffb1e3d696f3a02914ecaa',
            script:
              'if [ -n "${PREFETCH_INPUT}" ]; then\n  echo "Merging contents of sbom-cachi2.json into sbom-cyclonedx.json"\n  /src/utils/merge_syft_sbom.py sbom-cachi2.json sbom-cyclonedx.json > sbom-temp.json\n  mv sbom-temp.json sbom-cyclonedx.json\nelse\n  echo "Skipping step since no Cachi2 SBOM was produced"\nfi\n',
            resources: {},
            workingDir: '/workspace/source',
            securityContext: {
              runAsUser: 0,
            },
          },
          {
            env: [
              {
                name: 'BUILDAH_FORMAT',
                value: 'oci',
              },
              {
                name: 'STORAGE_DRIVER',
                value: 'vfs',
              },
              {
                name: 'HERMETIC',
                value: 'false',
              },
              {
                name: 'PREFETCH_INPUT',
              },
              {
                name: 'CONTEXT',
                value: '.',
              },
              {
                name: 'DOCKERFILE',
                value:
                  'https://raw.githubusercontent.com/devfile-samples/devfile-sample-java-springboot-basic/main/docker/Dockerfile',
              },
              {
                name: 'IMAGE',
                value:
                  'quay.io/redhat-user-workloads-stage/test-ns/test-application/human-resources:3450decf7174f23304c8e523bc998526ef57e559',
              },
              {
                name: 'TLSVERIFY',
                value: 'true',
              },
              {
                name: 'IMAGE_EXPIRES_AFTER',
              },
            ],
            name: 'create-purl-sbom',
            image: 'registry.access.redhat.com/ubi9/python-39:1-125',
            script:
              '#!/bin/python3\nimport json\n\nwith open("./sbom-cyclonedx.json") as f:\n  cyclonedx_sbom = json.load(f)\n\npurls = [{"purl": component["purl"]} for component in cyclonedx_sbom["components"] if "purl" in component]\npurl_content = {"image_contents": {"dependencies": purls}}\n\nwith open("sbom-purl.json", "w") as output_file:\n  json.dump(purl_content, output_file, indent=4)\n',
            resources: {},
            workingDir: '/workspace/source',
            securityContext: {
              runAsUser: 0,
            },
          },
          {
            env: [
              {
                name: 'BUILDAH_FORMAT',
                value: 'oci',
              },
              {
                name: 'STORAGE_DRIVER',
                value: 'vfs',
              },
              {
                name: 'HERMETIC',
                value: 'false',
              },
              {
                name: 'PREFETCH_INPUT',
              },
              {
                name: 'CONTEXT',
                value: '.',
              },
              {
                name: 'DOCKERFILE',
                value:
                  'https://raw.githubusercontent.com/devfile-samples/devfile-sample-java-springboot-basic/main/docker/Dockerfile',
              },
              {
                name: 'IMAGE',
                value:
                  'quay.io/redhat-user-workloads-stage/test-ns/test-application/human-resources:3450decf7174f23304c8e523bc998526ef57e559',
              },
              {
                name: 'TLSVERIFY',
                value: 'true',
              },
              {
                name: 'IMAGE_EXPIRES_AFTER',
              },
            ],
            name: 'inject-sbom-and-push',
            image:
              'registry.access.redhat.com/ubi9/buildah:9.0.0-19@sha256:c8b1d312815452964885680fc5bc8d99b3bfe9b6961228c71a09c72ca8e915eb',
            script:
              '# Expose base image digests\nbuildah images --format \'{{ .Name }}:{{ .Tag }}@{{ .Digest }}\' | grep -v $IMAGE > /tekton/results/BASE_IMAGES_DIGESTS\n\nbase_image_name=$(buildah inspect --format \'{{ index .ImageAnnotations "org.opencontainers.image.base.name"}}\' $IMAGE | cut -f1 -d\'@\')\nbase_image_digest=$(buildah inspect --format \'{{ index .ImageAnnotations "org.opencontainers.image.base.digest"}}\' $IMAGE)\ncontainer=$(buildah from --pull-never $IMAGE)\nbuildah copy $container sbom-cyclonedx.json sbom-purl.json /root/buildinfo/content_manifests/\nbuildah config -a org.opencontainers.image.base.name=${base_image_name} -a org.opencontainers.image.base.digest=${base_image_digest} $container\nbuildah commit $container $IMAGE\nbuildah push \\\n  --tls-verify=$TLSVERIFY \\\n  --digestfile /workspace/source/image-digest $IMAGE \\\n  docker://$IMAGE\ncat "/workspace/source"/image-digest | tee /tekton/results/IMAGE_DIGEST\necho -n "$IMAGE" | tee /tekton/results/IMAGE_URL\n',
            resources: {},
            workingDir: '/workspace/source',
            volumeMounts: [
              {
                name: 'varlibcontainers',
                mountPath: '/var/lib/containers',
              },
            ],
            securityContext: {
              runAsUser: 0,
              capabilities: {
                add: ['SETFCAP'],
              },
            },
          },
          {
            env: [
              {
                name: 'BUILDAH_FORMAT',
                value: 'oci',
              },
              {
                name: 'STORAGE_DRIVER',
                value: 'vfs',
              },
              {
                name: 'HERMETIC',
                value: 'false',
              },
              {
                name: 'PREFETCH_INPUT',
              },
              {
                name: 'CONTEXT',
                value: '.',
              },
              {
                name: 'DOCKERFILE',
                value:
                  'https://raw.githubusercontent.com/devfile-samples/devfile-sample-java-springboot-basic/main/docker/Dockerfile',
              },
              {
                name: 'IMAGE',
                value:
                  'quay.io/redhat-user-workloads-stage/test-ns/test-application/human-resources:3450decf7174f23304c8e523bc998526ef57e559',
              },
              {
                name: 'TLSVERIFY',
                value: 'true',
              },
              {
                name: 'IMAGE_EXPIRES_AFTER',
              },
            ],
            args: [
              'attach',
              'sbom',
              '--sbom',
              'sbom-cyclonedx.json',
              '--type',
              'cyclonedx',
              'quay.io/redhat-user-workloads-stage/test-ns/test-application/human-resources:3450decf7174f23304c8e523bc998526ef57e559',
            ],
            name: 'upload-sbom',
            image: 'quay.io/redhat-appstudio/cosign:v2.1.1',
            resources: {},
            workingDir: '/workspace/source',
          },
        ],
        params: [
          {
            name: 'IMAGE',
            type: 'string',
            description: 'Reference of the image buildah will produce.',
          },
          {
            name: 'BUILDER_IMAGE',
            type: 'string',
            default:
              'registry.access.redhat.com/ubi9/buildah:9.0.0-19@sha256:c8b1d312815452964885680fc5bc8d99b3bfe9b6961228c71a09c72ca8e915eb',
            description: 'The location of the buildah builder image.',
          },
          {
            name: 'DOCKERFILE',
            type: 'string',
            default: './Dockerfile',
            description: 'Path to the Dockerfile to build.',
          },
          {
            name: 'CONTEXT',
            type: 'string',
            default: '.',
            description: 'Path to the directory to use as context.',
          },
          {
            name: 'TLSVERIFY',
            type: 'string',
            default: 'true',
            description:
              'Verify the TLS on the registry endpoint (for push/pull to a non-TLS registry)',
          },
          {
            name: 'DOCKER_AUTH',
            type: 'string',
            default: '',
            description: 'unused, should be removed in next task version',
          },
          {
            name: 'HERMETIC',
            type: 'string',
            default: 'false',
            description: 'Determines if build will be executed without network access.',
          },
          {
            name: 'PREFETCH_INPUT',
            type: 'string',
            default: '',
            description:
              'In case it is not empty, the prefetched content should be made available to the build.',
          },
          {
            name: 'IMAGE_EXPIRES_AFTER',
            type: 'string',
            default: '',
            description:
              'Delete image tag after specified time. Empty means to keep the image tag. Time values could be something like 1h, 2d, 3w for hours, days, and weeks, respectively.',
          },
          {
            name: 'COMMIT_SHA',
            type: 'string',
            default: '',
            description: 'The image is built from this commit.',
          },
        ],
        results: [
          {
            name: 'IMAGE_DIGEST',
            type: 'string',
            description: 'Digest of the image just built',
          },
          {
            name: 'IMAGE_URL',
            type: 'string',
            description: 'Image repository where the built image was pushed',
          },
          {
            name: 'BASE_IMAGES_DIGESTS',
            type: 'string',
            description: 'Digests of the base images used for build',
          },
          {
            name: 'SBOM_JAVA_COMPONENTS_COUNT',
            type: 'string',
            description: 'The counting of Java components by publisher in JSON format',
          },
          {
            name: 'JAVA_COMMUNITY_DEPENDENCIES',
            type: 'string',
            description:
              'The Java dependencies that came from community sources such as Maven central.',
          },
        ],
        volumes: [
          {
            name: 'varlibcontainers',
            emptyDir: {},
          },
        ],
        workspaces: [
          {
            name: 'source',
            description: 'Workspace containing the source code to build.',
          },
        ],
        description:
          'Buildah task builds source code into a container image and pushes the image into container registry using buildah tool.\nIn addition it generates a SBOM file, injects the SBOM file into final container image and pushes the SBOM file as separate image using cosign tool.\nWhen [Java dependency rebuild](https://redhat-appstudio.github.io/docs.stonesoup.io/Documentation/main/cli/proc_enabled_java_dependencies.html) is enabled it triggers rebuilds of Java artifacts.\nWhen prefetch-dependencies task was activated it is using its artifacts to run build in hermetic environment.',
        stepTemplate: {
          env: [
            {
              name: 'BUILDAH_FORMAT',
              value: 'oci',
            },
            {
              name: 'STORAGE_DRIVER',
              value: 'vfs',
            },
            {
              name: 'HERMETIC',
              value: 'false',
            },
            {
              name: 'PREFETCH_INPUT',
            },
            {
              name: 'CONTEXT',
              value: '.',
            },
            {
              name: 'DOCKERFILE',
              value:
                'https://raw.githubusercontent.com/devfile-samples/devfile-sample-java-springboot-basic/main/docker/Dockerfile',
            },
            {
              name: 'IMAGE',
              value:
                'quay.io/redhat-user-workloads-stage/test-ns/test-application/human-resources:3450decf7174f23304c8e523bc998526ef57e559',
            },
            {
              name: 'TLSVERIFY',
              value: 'true',
            },
            {
              name: 'IMAGE_EXPIRES_AFTER',
            },
          ],
          name: '',
          resources: {},
          volumeMounts: [
            {
              name: 'ws-l7xqq',
              mountPath: '/workspace/source',
            },
          ],
        },
      },
      startTime: '2023-07-31T09:55:02Z',
      conditions: [
        {
          type: 'Succeeded',
          reason: 'Succeeded',
          status: 'True',
          message: 'All Steps have completed executing',
          lastTransitionTime: '2023-07-31T09:56:32Z',
        },
      ],
      taskResults: [
        {
          name: 'JAVA_COMMUNITY_DEPENDENCIES',
          type: 'string',
          value: '',
        },
        {
          name: 'BASE_IMAGES_DIGESTS',
          type: 'string',
          value:
            'registry.access.redhat.com/ubi8/openjdk-17:1.15-1.1682053058@sha256:b00f687d913b8d1e027f7eabd6765de6c8d469629bef9550f10dbf207af24fe5\nregistry.access.redhat.com/ubi8/openjdk-17-runtime:1.15-1.1682053056@sha256:f921cf1f9147e4b306908f3bcb61dd215b4a51970f8db560ede02ee6a492fa99\n',
        },
        {
          name: 'IMAGE_DIGEST',
          type: 'string',
          value: 'sha256:1d6da200c8ae98384a35bae37516d07b453dde85a91ff891ce57f3a99d420e6a',
        },
        {
          name: 'IMAGE_URL',
          type: 'string',
          value:
            'quay.io/redhat-user-workloads-stage/test-ns/test-application/human-resources:3450decf7174f23304c8e523bc998526ef57e559',
        },
      ],
      completionTime: '2023-07-31T09:56:32Z',
    },
    metadata: {
      uid: 'bb5cbb9b-c241-4bb7-a652-e1b87de4220d',
      name: 'human-resources-on-push-z79cl-build-container',
      labels: {
        'tekton.dev/task': 'buildah',
        'tekton.dev/memberOf': 'tasks',
        'tekton.dev/pipeline': 'human-resources-on-push-z79cl',
        'tekton.dev/pipelineRun': 'human-resources-on-push-z79cl',
        'tekton.dev/pipelineTask': 'build-container',
        'app.kubernetes.io/version': 'v0.19.2',
        'app.kubernetes.io/managed-by': 'pipelinesascode.tekton.dev',
        'pipelinesascode.tekton.dev/sha': '3450decf7174f23304c8e523bc998526ef57e559',
        'appstudio.openshift.io/component': 'human-resources',
        'pipelinesascode.tekton.dev/state': 'started',
        'pipelinesascode.tekton.dev/branch': 'refs-heads-rhtap-references-main',
        'pipelinesascode.tekton.dev/sender': 'red-hat-trusted-app-pipeline__bot',
        'appstudio.openshift.io/application': 'test-application',
        'pipelinesascode.tekton.dev/url-org': 'github-user',
        'build.appstudio.redhat.com/build_type': 'docker',
        'pipelines.appstudio.openshift.io/type': 'build',
        'pipelinesascode.tekton.dev/event-type': 'push',
        'pipelinesascode.tekton.dev/repository': 'human-resources',
        'pipelinesascode.tekton.dev/check-run-id': '15478301138',
        'pipelinesascode.tekton.dev/git-provider': 'github',
        'pipelinesascode.tekton.dev/url-repository': 'human-resources',
        'pipelinesascode.tekton.dev/original-prname': 'human-resources-on-push',
      },
      namespace: 'test-ns',
      finalizers: ['chains.tekton.dev'],
      generation: 1,
      annotations: {
        'tekton.dev/tags': 'image-build, appstudio, hacbs',
        'chains.tekton.dev/signed': 'true',
        'results.tekton.dev/record':
          'test-ns/results/cfc81c92-3418-446c-a819-62b2241f2e65/records/bb5cbb9b-c241-4bb7-a652-e1b87de4220d',
        'results.tekton.dev/result': 'test-ns/results/cfc81c92-3418-446c-a819-62b2241f2e65',
        'pipeline.tekton.dev/release': 'c8ef1db',
        'pipelinesascode.tekton.dev/sha': '3450decf7174f23304c8e523bc998526ef57e559',
        'tekton.dev/pipelines.minVersion': '0.12.1',
        'pipelinesascode.tekton.dev/state': 'started',
        'build.appstudio.openshift.io/repo':
          'https://github.com/github-user/human-resources?rev=3450decf7174f23304c8e523bc998526ef57e559',
        'pipelinesascode.tekton.dev/branch': 'refs/heads/rhtap/references/main',
        'pipelinesascode.tekton.dev/sender': 'red-hat-trusted-app-pipeline[bot]',
        'pipelinesascode.tekton.dev/log-url':
          'https://console-openshift-console.apps.stone-stg-m01.7ayg.p1.openshiftapps.com/k8s/ns/test-ns/tekton.dev~v1beta1~PipelineRun/human-resources-on-push-z79cl',
        'pipelinesascode.tekton.dev/sha-url':
          'https://github.com/github-user/human-resources/commit/3450decf7174f23304c8e523bc998526ef57e559',
        'pipelinesascode.tekton.dev/url-org': 'github-user',
        'pipelinesascode.tekton.dev/on-event': '[push]',
        'pipelinesascode.tekton.dev/repo-url': 'https://github.com/github-user/human-resources',
        'pipelinesascode.tekton.dev/sha-title': 'Update RHTAP references',
        'build.appstudio.redhat.com/commit_sha': '3450decf7174f23304c8e523bc998526ef57e559',
        'pipelinesascode.tekton.dev/event-type': 'push',
        'pipelinesascode.tekton.dev/repository': 'human-resources',
        'pipelinesascode.tekton.dev/check-run-id': '15478301138',
        'pipelinesascode.tekton.dev/git-provider': 'github',
        'build.appstudio.redhat.com/target_branch': 'rhtap/references/main',
        'pipelinesascode.tekton.dev/max-keep-runs': '3',
        'pipelinesascode.tekton.dev/url-repository': 'human-resources',
        'pipelinesascode.tekton.dev/git-auth-secret': 'pac-gitauth-mgmx',
        'pipelinesascode.tekton.dev/installation-id': '39596769',
        'pipelinesascode.tekton.dev/original-prname': 'human-resources-on-push',
        'pipelinesascode.tekton.dev/on-target-branch': '[main]',
      },
      resourceVersion: '515803336',
      creationTimestamp: '2023-07-31T09:55:02Z',
    },
    apiVersion: 'tekton.dev/v1beta1',
  },
  {
    kind: 'TaskRun',
    spec: {
      params: [
        {
          name: 'IMAGE_URL',
          value:
            'quay.io/redhat-user-workloads-stage/test-ns/test-application/human-resources:3450decf7174f23304c8e523bc998526ef57e559',
        },
        {
          name: 'IMAGE_DIGEST',
          value: 'sha256:1d6da200c8ae98384a35bae37516d07b453dde85a91ff891ce57f3a99d420e6a',
        },
      ],
      taskRef: {
        kind: 'Task',
        params: [
          {
            name: 'name',
            value: 'inspect-image',
          },
          {
            name: 'bundle',
            value:
              'quay.io/redhat-appstudio-tekton-catalog/task-inspect-image:0.1@sha256:8b0b066c7d4adb5ffcb02cfbcb55393d741c9cddeda2099d7d1d7505c1e683ba',
          },
          {
            name: 'kind',
            value: 'task',
          },
        ],
        resolver: 'bundles',
      },
      timeout: '1h0m0s',
      workspaces: [
        {
          name: 'source',
          persistentVolumeClaim: {
            claimName: 'pvc-62f466d23f',
          },
        },
      ],
      serviceAccountName: 'appstudio-pipeline',
    },
    status: {
      steps: [
        {
          name: 'inspect-image',
          imageID:
            'quay.io/redhat-appstudio/hacbs-test@sha256:82b43bffe4eacc717239424f64478b18f36528df47c2d11df3a8d031e81a3c67',
          container: 'step-inspect-image',
          terminated: {
            reason: 'Completed',
            message:
              '[{"key":"BASE_IMAGE","value":"registry.access.redhat.com/ubi8/openjdk-17-runtime@sha256:14de89e89efc97aee3b50141108b7833708c3a93ad90bf89940025ab5267ba86","type":1},{"key":"BASE_IMAGE_REPOSITORY","value":"ubi8/openjdk-17-runtime","type":1},{"key":"TEST_OUTPUT","value":"{\\"result\\":\\"SUCCESS\\",\\"timestamp\\":\\"1690797406\\",\\"note\\":\\"Task inspect-image completed: Check inspected JSON files under /workspace/source/hacbs/inspect-image.\\",\\"namespace\\":\\"default\\",\\"successes\\":1,\\"failures\\":0,\\"warnings\\":0}\\n","type":1}]',
            exitCode: 0,
            startedAt: '2023-07-31T09:56:44Z',
            finishedAt: '2023-07-31T09:56:46Z',
            containerID: 'cri-o://7ebab1f1c9e9de9aa0c43edfe4fc6f7b0c216facbe9cc5eccc1127ee22c650eb',
          },
        },
      ],
      podName: 'human-resources-on-push-z79cl-inspect-image-pod',
      taskSpec: {
        steps: [
          {
            env: [
              {
                name: 'IMAGE_URL',
                value:
                  'quay.io/redhat-user-workloads-stage/test-ns/test-application/human-resources:3450decf7174f23304c8e523bc998526ef57e559',
              },
              {
                name: 'IMAGE_DIGEST',
                value: 'sha256:1d6da200c8ae98384a35bae37516d07b453dde85a91ff891ce57f3a99d420e6a',
              },
            ],
            name: 'inspect-image',
            image:
              'quay.io/redhat-appstudio/hacbs-test:v1.1.0@sha256:82b43bffe4eacc717239424f64478b18f36528df47c2d11df3a8d031e81a3c67',
            script:
              '#!/usr/bin/env bash\nsource /utils.sh\nIMAGE_INSPECT=image_inspect.json\nBASE_IMAGE_INSPECT=base_image_inspect.json\nRAW_IMAGE_INSPECT=raw_image_inspect.json\n\nIMAGE_URL="${IMAGE_URL}@${IMAGE_DIGEST}"\n# Given a tag and a the digest in the IMAGE_URL we opt to use the digest alone\n# this is because containers/image currently doesn\'t support image references\n# that contain both. See https://github.com/containers/image/issues/1736\nif [[ "${IMAGE_URL}" == *":"*"@"* ]]; then\n  IMAGE_URL="${IMAGE_URL/:*@/@}"\nfi\n\nstatus=-1\nmax_run=5\nsleep_sec=10\nfor run in $(seq 1 $max_run); do\n  status=0\n  [ "$run" -gt 1 ] && sleep $sleep_sec  # skip last sleep\n  echo "Inspecting manifest for source image ${IMAGE_URL} (try $run/$max_run)."\n  skopeo inspect --no-tags docker://"${IMAGE_URL}" > $IMAGE_INSPECT && break || status=$?\ndone\nif [ "$status" -ne 0 ]; then\n    echo "Failed to inspect image ${IMAGE_URL}"\n    note="Task inspect-image failed: Encountered errors while inspecting image. For details, check Tekton task log."\n    TEST_OUTPUT=$(make_result_json -r ERROR -t "$note")\n    echo "${TEST_OUTPUT}" | tee /tekton/results/TEST_OUTPUT\n    exit 0\nfi\necho "Image ${IMAGE_URL} metadata:"\ncat "$IMAGE_INSPECT"\n\nfor run in $(seq 1 $max_run); do\n  status=0\n  [ "$run" -gt 1 ] && sleep $sleep_sec  # skip last sleep\n  echo "Inspecting raw image manifest ${IMAGE_URL} (try $run/$max_run)."\n  skopeo inspect --no-tags --raw docker://"${IMAGE_URL}" > $RAW_IMAGE_INSPECT && break || status=$?\ndone\nif [ "$status" -ne 0 ]; then\n    echo "Failed to get raw metadata of image ${IMAGE_URL}"\n    note="Task inspect-image failed: Encountered errors while inspecting image. For details, check Tekton task log."\n    TEST_OUTPUT=$(make_result_json -r ERROR -t "$note")\n    echo "${TEST_OUTPUT}" | tee /tekton/results/TEST_OUTPUT\n    exit 0\nfi\necho "Image ${IMAGE_URL} raw metadata:"\ncat "$RAW_IMAGE_INSPECT" | jq  # jq for readable formatting\n\necho "Getting base image manifest for source image ${IMAGE_URL}."\nBASE_IMAGE_NAME="$(jq -r ".annotations.\\"org.opencontainers.image.base.name\\"" $RAW_IMAGE_INSPECT)"\nBASE_IMAGE_DIGEST="$(jq -r ".annotations.\\"org.opencontainers.image.base.digest\\"" $RAW_IMAGE_INSPECT)"\nif [ $BASE_IMAGE_NAME == \'null\' ]; then\n  echo "Cannot get base image info from annotations."\n  BASE_IMAGE_NAME="$(jq -r ".Labels.\\"org.opencontainers.image.base.name\\"" $IMAGE_INSPECT)"\n  BASE_IMAGE_DIGEST="$(jq -r ".annotations.\\"org.opencontainers.image.base.digest\\"" $IMAGE_INSPECT)"\n  if [ "$BASE_IMAGE_NAME" == \'null\' ]; then\n    echo "Cannot get base image info from Labels. For details, check source image ${IMAGE_URL}."\n    exit 0\n  fi\nfi\nif [ -z "$BASE_IMAGE_NAME" ]; then\n  echo "Source image ${IMAGE_URL} is built from scratch, so there is no base image."\n  exit 0\nfi\n\nBASE_IMAGE="${BASE_IMAGE_NAME%:*}@$BASE_IMAGE_DIGEST"\necho "Detected base image: $BASE_IMAGE"\necho -n "$BASE_IMAGE" > /tekton/results/BASE_IMAGE\n\nfor run in $(seq 1 $max_run); do\n  status=0\n  [ "$run" -gt 1 ] && sleep $sleep_sec  # skip last sleep\n  echo "Inspecting base image ${BASE_IMAGE} (try $run/$max_run)."\n  skopeo inspect --no-tags "docker://$BASE_IMAGE"  > $BASE_IMAGE_INSPECT && break || status=$?\ndone\nif [ "$status" -ne 0 ]; then\n    echo "Failed to inspect base image ${BASE_IMAGE}"\n    note="Task inspect-image failed: Encountered errors while inspecting image. For details, check Tekton task log."\n    TEST_OUTPUT=$(make_result_json -r ERROR -t "$note")\n    echo "${TEST_OUTPUT}" | tee /tekton/results/TEST_OUTPUT\n    exit 0\nfi\n\nBASE_IMAGE_REPOSITORY="$(jq -r \'.Name | sub("[^/]+/"; "") | sub("[:@].*"; "")\' "$BASE_IMAGE_INSPECT")"\necho "Detected base image repository: $BASE_IMAGE_REPOSITORY"\necho -n "$BASE_IMAGE_REPOSITORY" > /tekton/results/BASE_IMAGE_REPOSITORY\n\nnote="Task inspect-image completed: Check inspected JSON files under /workspace/source/hacbs/inspect-image."\nTEST_OUTPUT=$(make_result_json -r SUCCESS -s 1 -t "$note")\necho "${TEST_OUTPUT}" | tee /tekton/results/TEST_OUTPUT\n',
            resources: {},
            workingDir: '/workspace/source/hacbs/inspect-image',
            securityContext: {
              runAsUser: 0,
              capabilities: {
                add: ['SETFCAP'],
              },
            },
          },
        ],
        params: [
          {
            name: 'IMAGE_URL',
            type: 'string',
            description: 'Fully qualified image name.',
          },
          {
            name: 'IMAGE_DIGEST',
            type: 'string',
            description: 'Image digest.',
          },
          {
            name: 'DOCKER_AUTH',
            type: 'string',
            default: '',
            description: 'unused, should be removed in next task version',
          },
        ],
        results: [
          {
            name: 'BASE_IMAGE',
            type: 'string',
            description: 'Base image source image is built from.',
          },
          {
            name: 'BASE_IMAGE_REPOSITORY',
            type: 'string',
            description: 'Base image repository URL.',
          },
          {
            name: 'TEST_OUTPUT',
            type: 'string',
            description: 'Tekton task test output.',
          },
        ],
        workspaces: [
          {
            name: 'source',
          },
        ],
        description:
          "Inspects and analyzes manifest data of the container's source image, and its base image (if available) using Skopeo. An image's manifest data contains information about the layers that make up the image, the platforms for which the image is intended, and other metadata about the image.",
      },
      startTime: '2023-07-31T09:56:32Z',
      conditions: [
        {
          type: 'Succeeded',
          reason: 'Succeeded',
          status: 'True',
          message: 'All Steps have completed executing',
          lastTransitionTime: '2023-07-31T09:56:46Z',
        },
      ],
      taskResults: [
        {
          name: 'BASE_IMAGE',
          type: 'string',
          value:
            'registry.access.redhat.com/ubi8/openjdk-17-runtime@sha256:14de89e89efc97aee3b50141108b7833708c3a93ad90bf89940025ab5267ba86',
        },
        {
          name: 'BASE_IMAGE_REPOSITORY',
          type: 'string',
          value: 'ubi8/openjdk-17-runtime',
        },
        {
          name: 'TEST_OUTPUT',
          type: 'string',
          value:
            '{"result":"SUCCESS","timestamp":"1690797406","note":"Task inspect-image completed: Check inspected JSON files under /workspace/source/hacbs/inspect-image.","namespace":"default","successes":1,"failures":0,"warnings":0}\n',
        },
      ],
      completionTime: '2023-07-31T09:56:46Z',
    },
    metadata: {
      uid: '54132da0-4c3f-4eef-8597-2ad5e2cfd893',
      name: 'human-resources-on-push-z79cl-inspect-image',
      labels: {
        'tekton.dev/task': 'inspect-image',
        'tekton.dev/memberOf': 'tasks',
        'tekton.dev/pipeline': 'human-resources-on-push-z79cl',
        'tekton.dev/pipelineRun': 'human-resources-on-push-z79cl',
        'tekton.dev/pipelineTask': 'inspect-image',
        'app.kubernetes.io/version': 'v0.19.2',
        'app.kubernetes.io/managed-by': 'pipelinesascode.tekton.dev',
        'pipelinesascode.tekton.dev/sha': '3450decf7174f23304c8e523bc998526ef57e559',
        'appstudio.openshift.io/component': 'human-resources',
        'pipelinesascode.tekton.dev/state': 'started',
        'pipelinesascode.tekton.dev/branch': 'refs-heads-rhtap-references-main',
        'pipelinesascode.tekton.dev/sender': 'red-hat-trusted-app-pipeline__bot',
        'appstudio.openshift.io/application': 'test-application',
        'pipelinesascode.tekton.dev/url-org': 'github-user',
        'pipelines.appstudio.openshift.io/type': 'build',
        'pipelinesascode.tekton.dev/event-type': 'push',
        'pipelinesascode.tekton.dev/repository': 'human-resources',
        'pipelinesascode.tekton.dev/check-run-id': '15478301138',
        'pipelinesascode.tekton.dev/git-provider': 'github',
        'pipelinesascode.tekton.dev/url-repository': 'human-resources',
        'pipelinesascode.tekton.dev/original-prname': 'human-resources-on-push',
      },
      namespace: 'test-ns',
      finalizers: ['chains.tekton.dev'],
      generation: 1,
      annotations: {
        'tekton.dev/tags': 'appstudio, hacbs',
        'chains.tekton.dev/signed': 'true',
        'results.tekton.dev/record':
          'test-ns/results/cfc81c92-3418-446c-a819-62b2241f2e65/records/cfc81c92-3418-446c-a819-62b2241f2e65',
        'results.tekton.dev/result': 'test-ns/results/cfc81c92-3418-446c-a819-62b2241f2e65',
        'pipeline.tekton.dev/release': 'c8ef1db',
        'pipelinesascode.tekton.dev/sha': '3450decf7174f23304c8e523bc998526ef57e559',
        'tekton.dev/pipelines.minVersion': '0.12.1',
        'pipelinesascode.tekton.dev/state': 'started',
        'build.appstudio.openshift.io/repo':
          'https://github.com/github-user/human-resources?rev=3450decf7174f23304c8e523bc998526ef57e559',
        'pipelinesascode.tekton.dev/branch': 'refs/heads/rhtap/references/main',
        'pipelinesascode.tekton.dev/sender': 'red-hat-trusted-app-pipeline[bot]',
        'pipelinesascode.tekton.dev/log-url':
          'https://console-openshift-console.apps.stone-stg-m01.7ayg.p1.openshiftapps.com/k8s/ns/test-ns/tekton.dev~v1beta1~PipelineRun/human-resources-on-push-z79cl',
        'pipelinesascode.tekton.dev/sha-url':
          'https://github.com/github-user/human-resources/commit/3450decf7174f23304c8e523bc998526ef57e559',
        'pipelinesascode.tekton.dev/url-org': 'github-user',
        'pipelinesascode.tekton.dev/on-event': '[push]',
        'pipelinesascode.tekton.dev/repo-url': 'https://github.com/github-user/human-resources',
        'pipelinesascode.tekton.dev/sha-title': 'Update RHTAP references',
        'build.appstudio.redhat.com/commit_sha': '3450decf7174f23304c8e523bc998526ef57e559',
        'pipelinesascode.tekton.dev/event-type': 'push',
        'pipelinesascode.tekton.dev/repository': 'human-resources',
        'pipelinesascode.tekton.dev/check-run-id': '15478301138',
        'pipelinesascode.tekton.dev/git-provider': 'github',
        'build.appstudio.redhat.com/target_branch': 'rhtap/references/main',
        'pipelinesascode.tekton.dev/max-keep-runs': '3',
        'pipelinesascode.tekton.dev/url-repository': 'human-resources',
        'pipelinesascode.tekton.dev/git-auth-secret': 'pac-gitauth-mgmx',
        'pipelinesascode.tekton.dev/installation-id': '39596769',
        'pipelinesascode.tekton.dev/original-prname': 'human-resources-on-push',
        'pipelinesascode.tekton.dev/on-target-branch': '[main]',
      },
      resourceVersion: '515804201',
      creationTimestamp: '2023-07-31T09:56:32Z',
    },
    apiVersion: 'tekton.dev/v1beta1',
  },
  {
    kind: 'TaskRun',
    spec: {
      params: [
        {
          name: 'BASE_IMAGES_DIGESTS',
          value:
            'registry.access.redhat.com/ubi8/openjdk-17:1.15-1.1682053058@sha256:b00f687d913b8d1e027f7eabd6765de6c8d469629bef9550f10dbf207af24fe5\nregistry.access.redhat.com/ubi8/openjdk-17-runtime:1.15-1.1682053056@sha256:f921cf1f9147e4b306908f3bcb61dd215b4a51970f8db560ede02ee6a492fa99\n',
        },
      ],
      taskRef: {
        kind: 'Task',
        params: [
          {
            name: 'name',
            value: 'deprecated-image-check',
          },
          {
            name: 'bundle',
            value:
              'quay.io/redhat-appstudio-tekton-catalog/task-deprecated-image-check:0.2@sha256:40856a6c6b4452361a2cdb17b927a35fd03edc3eec2e5bf94f96d211cc1d1d52',
          },
          {
            name: 'kind',
            value: 'task',
          },
        ],
        resolver: 'bundles',
      },
      timeout: '1h0m0s',
      workspaces: [
        {
          name: 'test-ws',
          persistentVolumeClaim: {
            claimName: 'pvc-62f466d23f',
          },
        },
      ],
      serviceAccountName: 'appstudio-pipeline',
    },
    status: {
      steps: [
        {
          name: 'query-pyxis',
          imageID:
            'registry.access.redhat.com/ubi8/ubi-minimal@sha256:14b404f4181904fb5edfde1a7a6b03fe1b0bb4dad1f5c02e16f797d5eea8c0cb',
          container: 'step-query-pyxis',
          terminated: {
            reason: 'Completed',
            message:
              '[{"key":"PYXIS_HTTP_CODE","value":"200 registry.access.redhat.com ubi8/openjdk-17\\n200 registry.access.redhat.com ubi8/openjdk-17-runtime\\n","type":1}]',
            exitCode: 0,
            startedAt: '2023-07-31T09:56:44Z',
            finishedAt: '2023-07-31T09:56:45Z',
            containerID: 'cri-o://40b28447d9f5800e0cc76397764845b2a4ca976ed352c129188eab9c3fe441ac',
          },
        },
        {
          name: 'run-conftest',
          imageID:
            'quay.io/redhat-appstudio/hacbs-test@sha256:82b43bffe4eacc717239424f64478b18f36528df47c2d11df3a8d031e81a3c67',
          container: 'step-run-conftest',
          terminated: {
            reason: 'Completed',
            message:
              '[{"key":"PYXIS_HTTP_CODE","value":"200 registry.access.redhat.com ubi8/openjdk-17\\n200 registry.access.redhat.com ubi8/openjdk-17-runtime\\n","type":1},{"key":"TEST_OUTPUT","value":"{\\"result\\":\\"SUCCESS\\",\\"timestamp\\":\\"1690797406\\",\\"note\\":\\"Task deprecated-image-check completed: Check result for task result.\\",\\"namespace\\":\\"required_checks\\",\\"successes\\":2,\\"failures\\":0,\\"warnings\\":0}\\n","type":1}]',
            exitCode: 0,
            startedAt: '2023-07-31T09:56:46Z',
            finishedAt: '2023-07-31T09:56:46Z',
            containerID: 'cri-o://48be661f3e90fbc6303e46d14649ed169d275d75101238f7500553894c73729f',
          },
        },
      ],
      podName: 'human-resources-on-push-z79cl-deprecated-base-image-check-pod',
      taskSpec: {
        steps: [
          {
            env: [
              {
                name: 'BASE_IMAGES_DIGESTS',
                value:
                  'registry.access.redhat.com/ubi8/openjdk-17:1.15-1.1682053058@sha256:b00f687d913b8d1e027f7eabd6765de6c8d469629bef9550f10dbf207af24fe5\nregistry.access.redhat.com/ubi8/openjdk-17-runtime:1.15-1.1682053056@sha256:f921cf1f9147e4b306908f3bcb61dd215b4a51970f8db560ede02ee6a492fa99\n',
              },
            ],
            name: 'query-pyxis',
            image:
              'registry.access.redhat.com/ubi8/ubi-minimal:8.8-1014@sha256:e52fc1de73dc2879516431ff1865e0fb61b1a32f57b6f914bdcddb13c62f84e6',
            script:
              '#!/usr/bin/env bash\nreadarray -t IMAGE_ARRAY < <(echo -n "$BASE_IMAGES_DIGESTS" | sed \'s/\\\\n/\\\'$\'\\n\'\'/g\')\nfor BASE_IMAGE in ${IMAGE_ARRAY[@]};\ndo\n  IFS=:\'/\' read -r IMAGE_REGISTRY IMAGE_WITH_TAG <<< $BASE_IMAGE; echo "[$IMAGE_REGISTRY] [$IMAGE_WITH_TAG]"\n  IMAGE_REPOSITORY=`echo $IMAGE_WITH_TAG | cut -d ":" -f1`\n  IMAGE_REGISTRY=${IMAGE_REGISTRY//registry.redhat.io/registry.access.redhat.com}\n  export IMAGE_REPO_PATH=/workspace/test-ws/${IMAGE_REPOSITORY}\n  mkdir -p ${IMAGE_REPO_PATH}\n  echo "Querying Pyxis for $BASE_IMAGE."\n  http_code=$(curl -s -k -o ${IMAGE_REPO_PATH}/repository_data.json -w \'%{http_code}\' "https://catalog.redhat.com/api/containers/v1/repositories/registry/${IMAGE_REGISTRY}/repository/${IMAGE_REPOSITORY}")\n  echo "Response code: $http_code."\n  echo $http_code $IMAGE_REGISTRY $IMAGE_REPOSITORY>> /tekton/results/PYXIS_HTTP_CODE\ndone\n',
            resources: {},
          },
          {
            env: [
              {
                name: 'POLICY_DIR',
                value: '/project/repository/',
              },
              {
                name: 'POLICY_NAMESPACE',
                value: 'required_checks',
              },
            ],
            name: 'run-conftest',
            image:
              'quay.io/redhat-appstudio/hacbs-test:v1.1.0@sha256:82b43bffe4eacc717239424f64478b18f36528df47c2d11df3a8d031e81a3c67',
            script:
              '#!/usr/bin/env sh\nsource /utils.sh\n\nsuccess_counter=0\nfailure_counter=0\nerror_counter=0\nif [ ! -f /tekton/results/PYXIS_HTTP_CODE ]; then\n  error_counter=$((error_counter++))\nfi\nwhile IFS= read -r line\ndo\n  IFS=:\' \' read -r http_code IMAGE_REGISTRY IMAGE_REPOSITORY <<< $line; echo "[$http_code] [$IMAGE_REGISTRY] [$IMAGE_REPOSITORY]"\n  export IMAGE_REPO_PATH=/workspace/test-ws/${IMAGE_REPOSITORY}\n  if [ "$http_code" == "200" ];\n  then\n    echo "Running conftest using $POLICY_DIR policy, $POLICY_NAMESPACE namespace."\n    /usr/bin/conftest test --no-fail ${IMAGE_REPO_PATH}/repository_data.json \\\n    --policy $POLICY_DIR --namespace $POLICY_NAMESPACE \\\n    --output=json 2> ${IMAGE_REPO_PATH}/stderr.txt | tee ${IMAGE_REPO_PATH}/deprecated_image_check_output.json\n\n    failure_counter=$((failure_counter+$(jq -r \'.[].failures|length\' ${IMAGE_REPO_PATH}/deprecated_image_check_output.json)))\n    success_counter=$((success_counter+$(jq -r \'.[].successes\' ${IMAGE_REPO_PATH}/deprecated_image_check_output.json)))\n\n  elif [ "$http_code" == "404" ];\n  then\n    echo "Registry/image ${IMAGE_REGISTRY}/${IMAGE_REPOSITORY} not found in Pyxis." >> /workspace/test-ws/stderr.txt\n    cat /workspace/test-ws/stderr.txt\n  else\n    echo "Unexpected error HTTP code $http_code) occurred for registry/image ${IMAGE_REGISTRY}/${IMAGE_REPOSITORY}." >> /workspace/test-ws/stderr.txt\n    cat /workspace/test-ws/stderr.txt\n    error_counter=$((error_counter++))\n    exit 0\n  fi\ndone < /tekton/results/PYXIS_HTTP_CODE\n\nnote="Task deprecated-image-check failed: Command conftest failed. For details, check Tekton task log."\nERROR_OUTPUT=$(make_result_json -r ERROR -n "$POLICY_NAMESPACE" -t "$note")\nif [[ "$error_counter" == 0 && "$success_counter" > 0 ]];\nthen\n  if [[ "${failure_counter}" -gt 0 ]]; then RES="FAILURE"; else RES="SUCCESS"; fi\n  note="Task deprecated-image-check completed: Check result for task result."\n  TEST_OUTPUT=$(make_result_json \\\n    -r "${RES}" -n "$POLICY_NAMESPACE" \\\n    -s "${success_counter}" -f "${failure_counter}" -t "$note")\nfi\necho "${TEST_OUTPUT:-${ERROR_OUTPUT}}" | tee /tekton/results/TEST_OUTPUT\n',
            resources: {},
          },
        ],
        params: [
          {
            name: 'POLICY_DIR',
            type: 'string',
            default: '/project/repository/',
            description: 'Path to directory containing Conftest policies.',
          },
          {
            name: 'POLICY_NAMESPACE',
            type: 'string',
            default: 'required_checks',
            description: 'Namespace for Conftest policy.',
          },
          {
            name: 'BASE_IMAGES_DIGESTS',
            type: 'string',
            description: 'Digests of base build images.',
          },
        ],
        results: [
          {
            name: 'PYXIS_HTTP_CODE',
            type: 'string',
            description: 'HTTP code returned by Pyxis API endpoint.',
          },
          {
            name: 'TEST_OUTPUT',
            type: 'string',
            description: 'Tekton task test output.',
          },
        ],
        workspaces: [
          {
            name: 'test-ws',
          },
        ],
        description:
          'Identifies the unmaintained and potentially insecure deprecated base images. Pyxis API collects metadata from image repository, and Conftest applies supplied policy to identify the deprecated images using that metadata.',
      },
      startTime: '2023-07-31T09:56:32Z',
      conditions: [
        {
          type: 'Succeeded',
          reason: 'Succeeded',
          status: 'True',
          message: 'All Steps have completed executing',
          lastTransitionTime: '2023-07-31T09:56:46Z',
        },
      ],
      taskResults: [
        {
          name: 'PYXIS_HTTP_CODE',
          type: 'string',
          value:
            '200 registry.access.redhat.com ubi8/openjdk-17\n200 registry.access.redhat.com ubi8/openjdk-17-runtime\n',
        },
        {
          name: 'TEST_OUTPUT',
          type: 'string',
          value:
            '{"result":"SUCCESS","timestamp":"1690797406","note":"Task deprecated-image-check completed: Check result for task result.","namespace":"required_checks","successes":2,"failures":0,"warnings":0}\n',
        },
      ],
      completionTime: '2023-07-31T09:56:46Z',
    },
    metadata: {
      uid: '40cb1b4c-3aaf-4617-a4a1-7f840b066d5d',
      name: 'human-resources-on-push-z79cl-deprecated-base-image-check',
      labels: {
        'tekton.dev/task': 'deprecated-image-check',
        'tekton.dev/memberOf': 'tasks',
        'tekton.dev/pipeline': 'human-resources-on-push-z79cl',
        'tekton.dev/pipelineRun': 'human-resources-on-push-z79cl',
        'tekton.dev/pipelineTask': 'deprecated-base-image-check',
        'app.kubernetes.io/version': 'v0.19.2',
        'app.kubernetes.io/managed-by': 'pipelinesascode.tekton.dev',
        'pipelinesascode.tekton.dev/sha': '3450decf7174f23304c8e523bc998526ef57e559',
        'appstudio.openshift.io/component': 'human-resources',
        'pipelinesascode.tekton.dev/state': 'started',
        'pipelinesascode.tekton.dev/branch': 'refs-heads-rhtap-references-main',
        'pipelinesascode.tekton.dev/sender': 'red-hat-trusted-app-pipeline__bot',
        'appstudio.openshift.io/application': 'test-application',
        'pipelinesascode.tekton.dev/url-org': 'github-user',
        'pipelines.appstudio.openshift.io/type': 'build',
        'pipelinesascode.tekton.dev/event-type': 'push',
        'pipelinesascode.tekton.dev/repository': 'human-resources',
        'pipelinesascode.tekton.dev/check-run-id': '15478301138',
        'pipelinesascode.tekton.dev/git-provider': 'github',
        'pipelinesascode.tekton.dev/url-repository': 'human-resources',
        'pipelinesascode.tekton.dev/original-prname': 'human-resources-on-push',
      },
      namespace: 'test-ns',
      finalizers: ['chains.tekton.dev'],
      generation: 1,
      annotations: {
        'tekton.dev/tags': 'appstudio, hacbs',
        'chains.tekton.dev/signed': 'true',
        'results.tekton.dev/record':
          'test-ns/results/cfc81c92-3418-446c-a819-62b2241f2e65/records/cfc81c92-3418-446c-a819-62b2241f2e65',
        'results.tekton.dev/result': 'test-ns/results/cfc81c92-3418-446c-a819-62b2241f2e65',
        'pipeline.tekton.dev/release': 'c8ef1db',
        'pipelinesascode.tekton.dev/sha': '3450decf7174f23304c8e523bc998526ef57e559',
        'tekton.dev/pipelines.minVersion': '0.12.1',
        'pipelinesascode.tekton.dev/state': 'started',
        'build.appstudio.openshift.io/repo':
          'https://github.com/github-user/human-resources?rev=3450decf7174f23304c8e523bc998526ef57e559',
        'pipelinesascode.tekton.dev/branch': 'refs/heads/rhtap/references/main',
        'pipelinesascode.tekton.dev/sender': 'red-hat-trusted-app-pipeline[bot]',
        'pipelinesascode.tekton.dev/log-url':
          'https://console-openshift-console.apps.stone-stg-m01.7ayg.p1.openshiftapps.com/k8s/ns/test-ns/tekton.dev~v1beta1~PipelineRun/human-resources-on-push-z79cl',
        'pipelinesascode.tekton.dev/sha-url':
          'https://github.com/github-user/human-resources/commit/3450decf7174f23304c8e523bc998526ef57e559',
        'pipelinesascode.tekton.dev/url-org': 'github-user',
        'pipelinesascode.tekton.dev/on-event': '[push]',
        'pipelinesascode.tekton.dev/repo-url': 'https://github.com/github-user/human-resources',
        'pipelinesascode.tekton.dev/sha-title': 'Update RHTAP references',
        'build.appstudio.redhat.com/commit_sha': '3450decf7174f23304c8e523bc998526ef57e559',
        'pipelinesascode.tekton.dev/event-type': 'push',
        'pipelinesascode.tekton.dev/repository': 'human-resources',
        'pipelinesascode.tekton.dev/check-run-id': '15478301138',
        'pipelinesascode.tekton.dev/git-provider': 'github',
        'build.appstudio.redhat.com/target_branch': 'rhtap/references/main',
        'pipelinesascode.tekton.dev/max-keep-runs': '3',
        'pipelinesascode.tekton.dev/url-repository': 'human-resources',
        'pipelinesascode.tekton.dev/git-auth-secret': 'pac-gitauth-mgmx',
        'pipelinesascode.tekton.dev/installation-id': '39596769',
        'pipelinesascode.tekton.dev/original-prname': 'human-resources-on-push',
        'pipelinesascode.tekton.dev/on-target-branch': '[main]',
      },
      resourceVersion: '515804205',
      creationTimestamp: '2023-07-31T09:56:32Z',
    },
    apiVersion: 'tekton.dev/v1beta1',
  },
  {
    kind: 'TaskRun',
    spec: {
      params: [
        {
          name: 'IMAGE_URL',
          value:
            'quay.io/redhat-user-workloads-stage/test-ns/test-application/human-resources:3450decf7174f23304c8e523bc998526ef57e559',
        },
        {
          name: 'IMAGE_DIGEST',
          value: 'sha256:1d6da200c8ae98384a35bae37516d07b453dde85a91ff891ce57f3a99d420e6a',
        },
      ],
      taskRef: {
        kind: 'Task',
        params: [
          {
            name: 'name',
            value: 'sbom-json-check',
          },
          {
            name: 'bundle',
            value:
              'quay.io/redhat-appstudio-tekton-catalog/task-sbom-json-check:0.1@sha256:30829c02906bfb5761a2c3509ec00fa7b41a97ae1c931cdedcd007664fdbc292',
          },
          {
            name: 'kind',
            value: 'task',
          },
        ],
        resolver: 'bundles',
      },
      timeout: '1h0m0s',
      serviceAccountName: 'appstudio-pipeline',
    },
    status: {
      steps: [
        {
          name: 'sbom-json-check',
          imageID:
            'quay.io/redhat-appstudio/hacbs-test@sha256:82b43bffe4eacc717239424f64478b18f36528df47c2d11df3a8d031e81a3c67',
          container: 'step-sbom-json-check',
          terminated: {
            reason: 'Completed',
            message:
              '[{"key":"TEST_OUTPUT","value":"{\\"result\\":\\"SUCCESS\\",\\"timestamp\\":\\"1690797412\\",\\"note\\":\\"Task sbom-json-check completed: Check result for JSON check result.\\",\\"namespace\\":\\"default\\",\\"successes\\":1,\\"failures\\":0,\\"warnings\\":0}\\n","type":1}]',
            exitCode: 0,
            startedAt: '2023-07-31T09:56:43Z',
            finishedAt: '2023-07-31T09:56:52Z',
            containerID: 'cri-o://82bb4d41d28e603f1e25fb3fe99920751e9b0a16047efe4fe84a8ef4c6cc5e43',
          },
        },
      ],
      podName: 'human-resources-on-push-z79cl-sbom-json-check-pod',
      taskSpec: {
        steps: [
          {
            env: [
              {
                name: 'IMAGE_URL',
                value:
                  'quay.io/redhat-user-workloads-stage/test-ns/test-application/human-resources:3450decf7174f23304c8e523bc998526ef57e559',
              },
              {
                name: 'IMAGE_DIGEST',
                value: 'sha256:1d6da200c8ae98384a35bae37516d07b453dde85a91ff891ce57f3a99d420e6a',
              },
            ],
            name: 'sbom-json-check',
            image:
              'quay.io/redhat-appstudio/hacbs-test:v1.1.0@sha256:82b43bffe4eacc717239424f64478b18f36528df47c2d11df3a8d031e81a3c67',
            script:
              '#!/usr/bin/env bash\nsource /utils.sh\n\nmkdir /manifests/ && cd /manifests/\n\nimage_with_digest="${IMAGE_URL}@${IMAGE_DIGEST}"\n\nif ! oc image extract --registry-config ~/.docker/config.json "${image_with_digest}" --path \'/root/buildinfo/content_manifests/*:/manifests/\'; then\n  echo "Failed to extract manifests from image ${image_with_digest}."\n  note="Task sbom-json-check failed: Failed to extract manifests from image ${image_with_digest} with oc extract. For details, check Tekton task log."\n  ERROR_OUTPUT=$(make_result_json -r "ERROR" -t "$note")\nfi\n\ntouch fail_result.txt\nif [ -f "sbom-cyclonedx.json" ]\nthen\n  result=$(echo -n $(cyclonedx-linux-x64 validate --input-file sbom-cyclonedx.json))\n  if [[ ! $result =~ "BOM validated successfully" ]]\n  then\n    echo "sbom-cyclonedx.json: $result" > fail_result.txt\n  fi\nelse\n  echo "Cannot access sbom-cyclonedx.json: No such file or directory exists." > fail_result.txt\nfi\n\nFAIL_RESULTS="$(cat fail_result.txt)"\nif [[ -z $FAIL_RESULTS ]]\nthen\n  note="Task sbom-json-check completed: Check result for JSON check result."\n  TEST_OUTPUT=$(make_result_json -r "SUCCESS" -s 1 -t "$note")\nelse\n  echo "Failed to verify sbom-cyclonedx.json for image $IMAGE_URL with reason: $FAIL_RESULTS."\n  note="Task sbom-json-check failed: Failed to verify SBOM for image $IMAGE_URL."\n  ERROR_OUTPUT=$(make_result_json -r "FAILURE" -f 1 -t "$note")\nfi\n\necho "${TEST_OUTPUT:-${ERROR_OUTPUT}}" | tee /tekton/results/TEST_OUTPUT\n',
            resources: {},
            volumeMounts: [
              {
                name: 'shared',
                mountPath: '/shared',
              },
            ],
            securityContext: {
              runAsUser: 0,
              capabilities: {
                add: ['SETFCAP'],
              },
            },
          },
        ],
        params: [
          {
            name: 'IMAGE_URL',
            type: 'string',
            description: 'Fully qualified image name to verify.',
          },
          {
            name: 'IMAGE_DIGEST',
            type: 'string',
            description: 'Image digest.',
          },
        ],
        results: [
          {
            name: 'TEST_OUTPUT',
            type: 'string',
            description: 'Tekton task test output.',
          },
        ],
        volumes: [
          {
            name: 'shared',
            emptyDir: {},
          },
        ],
        description:
          'Verifies the integrity and security of the Software Bill of Materials (SBOM) file in JSON format using CyloneDX tool.',
      },
      startTime: '2023-07-31T09:56:36Z',
      conditions: [
        {
          type: 'Succeeded',
          reason: 'Succeeded',
          status: 'True',
          message: 'All Steps have completed executing',
          lastTransitionTime: '2023-07-31T09:56:52Z',
        },
      ],
      taskResults: [
        {
          name: 'TEST_OUTPUT',
          type: 'string',
          value:
            '{"result":"SUCCESS","timestamp":"1690797412","note":"Task sbom-json-check completed: Check result for JSON check result.","namespace":"default","successes":1,"failures":0,"warnings":0}\n',
        },
      ],
      completionTime: '2023-07-31T09:56:52Z',
    },
    metadata: {
      uid: '66dc16df-7c05-4788-8604-b3c5e565fab3',
      name: 'human-resources-on-push-z79cl-sbom-json-check',
      labels: {
        'tekton.dev/task': 'sbom-json-check',
        'tekton.dev/memberOf': 'tasks',
        'tekton.dev/pipeline': 'human-resources-on-push-z79cl',
        'tekton.dev/pipelineRun': 'human-resources-on-push-z79cl',
        'tekton.dev/pipelineTask': 'sbom-json-check',
        'app.kubernetes.io/version': 'v0.19.2',
        'app.kubernetes.io/managed-by': 'pipelinesascode.tekton.dev',
        'pipelinesascode.tekton.dev/sha': '3450decf7174f23304c8e523bc998526ef57e559',
        'appstudio.openshift.io/component': 'human-resources',
        'pipelinesascode.tekton.dev/state': 'started',
        'pipelinesascode.tekton.dev/branch': 'refs-heads-rhtap-references-main',
        'pipelinesascode.tekton.dev/sender': 'red-hat-trusted-app-pipeline__bot',
        'appstudio.openshift.io/application': 'test-application',
        'pipelinesascode.tekton.dev/url-org': 'github-user',
        'pipelines.appstudio.openshift.io/type': 'build',
        'pipelinesascode.tekton.dev/event-type': 'push',
        'pipelinesascode.tekton.dev/repository': 'human-resources',
        'pipelinesascode.tekton.dev/check-run-id': '15478301138',
        'pipelinesascode.tekton.dev/git-provider': 'github',
        'pipelinesascode.tekton.dev/url-repository': 'human-resources',
        'pipelinesascode.tekton.dev/original-prname': 'human-resources-on-push',
      },
      namespace: 'test-ns',
      finalizers: ['chains.tekton.dev'],
      generation: 1,
      annotations: {
        'chains.tekton.dev/signed': 'true',
        'results.tekton.dev/record':
          'test-ns/results/cfc81c92-3418-446c-a819-62b2241f2e65/records/cfc81c92-3418-446c-a819-62b2241f2e65',
        'results.tekton.dev/result': 'test-ns/results/cfc81c92-3418-446c-a819-62b2241f2e65',
        'pipeline.tekton.dev/release': 'c8ef1db',
        'pipelinesascode.tekton.dev/sha': '3450decf7174f23304c8e523bc998526ef57e559',
        'pipelinesascode.tekton.dev/state': 'started',
        'build.appstudio.openshift.io/repo':
          'https://github.com/github-user/human-resources?rev=3450decf7174f23304c8e523bc998526ef57e559',
        'pipelinesascode.tekton.dev/branch': 'refs/heads/rhtap/references/main',
        'pipelinesascode.tekton.dev/sender': 'red-hat-trusted-app-pipeline[bot]',
        'pipelinesascode.tekton.dev/log-url':
          'https://console-openshift-console.apps.stone-stg-m01.7ayg.p1.openshiftapps.com/k8s/ns/test-ns/tekton.dev~v1beta1~PipelineRun/human-resources-on-push-z79cl',
        'pipelinesascode.tekton.dev/sha-url':
          'https://github.com/github-user/human-resources/commit/3450decf7174f23304c8e523bc998526ef57e559',
        'pipelinesascode.tekton.dev/url-org': 'github-user',
        'pipelinesascode.tekton.dev/on-event': '[push]',
        'pipelinesascode.tekton.dev/repo-url': 'https://github.com/github-user/human-resources',
        'pipelinesascode.tekton.dev/sha-title': 'Update RHTAP references',
        'build.appstudio.redhat.com/commit_sha': '3450decf7174f23304c8e523bc998526ef57e559',
        'pipelinesascode.tekton.dev/event-type': 'push',
        'pipelinesascode.tekton.dev/repository': 'human-resources',
        'pipelinesascode.tekton.dev/check-run-id': '15478301138',
        'pipelinesascode.tekton.dev/git-provider': 'github',
        'build.appstudio.redhat.com/target_branch': 'rhtap/references/main',
        'pipelinesascode.tekton.dev/max-keep-runs': '3',
        'pipelinesascode.tekton.dev/url-repository': 'human-resources',
        'pipelinesascode.tekton.dev/git-auth-secret': 'pac-gitauth-mgmx',
        'pipelinesascode.tekton.dev/installation-id': '39596769',
        'pipelinesascode.tekton.dev/original-prname': 'human-resources-on-push',
        'pipelinesascode.tekton.dev/on-target-branch': '[main]',
      },
      resourceVersion: '515804512',
      creationTimestamp: '2023-07-31T09:56:33Z',
    },
    apiVersion: 'tekton.dev/v1beta1',
  },
  {
    kind: 'TaskRun',
    spec: {
      taskRef: {
        kind: 'Task',
        params: [
          {
            name: 'name',
            value: 'label-check',
          },
          {
            name: 'bundle',
            value:
              'quay.io/redhat-appstudio-tekton-catalog/task-label-check:0.1@sha256:0c0739fdda24cd1e3587bbab9b07d4493efc21884baac7723f4b446e95bf1fd3',
          },
          {
            name: 'kind',
            value: 'task',
          },
        ],
        resolver: 'bundles',
      },
      timeout: '1h0m0s',
      workspaces: [
        {
          name: 'workspace',
          persistentVolumeClaim: {
            claimName: 'pvc-62f466d23f',
          },
        },
      ],
      serviceAccountName: 'appstudio-pipeline',
    },
    status: {
      steps: [
        {
          name: 'surface-level-checks-required-labels',
          imageID:
            'quay.io/redhat-appstudio/hacbs-test@sha256:82b43bffe4eacc717239424f64478b18f36528df47c2d11df3a8d031e81a3c67',
          container: 'step-surface-level-checks-required-labels',
          terminated: {
            reason: 'Completed',
            message:
              '[{"key":"TEST_OUTPUT","value":"{\\"result\\":\\"SUCCESS\\",\\"timestamp\\":\\"1690797412\\",\\"note\\":\\"For details, check Tekton task log.\\",\\"namespace\\":\\"required_checks\\",\\"successes\\":21,\\"failures\\":0,\\"warnings\\":0}\\n","type":1}]',
            exitCode: 0,
            startedAt: '2023-07-31T09:56:51Z',
            finishedAt: '2023-07-31T09:56:52Z',
            containerID: 'cri-o://60f3590ec4d0576be4731bb75ddd181b8ce6c0ca9bc917d7faf96679d55124b4',
          },
        },
      ],
      podName: 'human-resources-on-push-z79cl-label-check-pod',
      taskSpec: {
        steps: [
          {
            env: [
              {
                name: 'POLICY_NAMESPACE',
                value: 'required_checks',
              },
              {
                name: 'POLICY_DIR',
                value: '/project/image/',
              },
            ],
            name: 'surface-level-checks-required-labels',
            image:
              'quay.io/redhat-appstudio/hacbs-test:v1.1.0@sha256:82b43bffe4eacc717239424f64478b18f36528df47c2d11df3a8d031e81a3c67',
            script:
              '#!/usr/bin/env bash\n\n. /utils.sh\nif [ ! -s ../inspect-image/image_inspect.json ]; then\n  echo "File $(workspaces.source.path)/hacbs/inspect-image/image_inspect.json did not generate correctly. Check task inspect-image log."\n  note="Task label-check failed: $(workspaces.source.path)/hacbs/inspect-image/image_inspect.json did not generate correctly. For details, check Tekton task result TEST_OUTPUT in task inspect-image."\n  TEST_OUTPUT=$(make_result_json -r ERROR -t "$note")\n  echo "${TEST_OUTPUT}" | tee /tekton/results/TEST_OUTPUT\n  exit 0\nfi\n\nCONFTEST_OPTIONS=""\nif [ -s "../inspect-image/base_image_inspect.json" ]; then\n  CONFTEST_OPTIONS="-d=../inspect-image/base_image_inspect.json"\nfi\n\necho "Running conftest using $POLICY_DIR policy, $POLICY_NAMESPACE namespace."\n/usr/bin/conftest test --no-fail ../inspect-image/image_inspect.json "${CONFTEST_OPTIONS}" \\\n--policy $POLICY_DIR --namespace $POLICY_NAMESPACE \\\n--output=json 2> stderr.txt | tee label_check_output.json\n\nif [ ! -z $(cat stderr.txt) ]; then\n  echo "label-check test encountered the following error:"\n  cat stderr.txt\n  note="Task label-check failed: Command conftest failed. For details, check Tekton task log."\n  ERROR_OUTPUT=$(make_result_json -r "ERROR" -t "$note")\nfi\n\nTEST_OUTPUT=\nparse_test_output label-check conftest label_check_output.json || true\n\necho "${TEST_OUTPUT:-${ERROR_OUTPUT}}" | tee /tekton/results/TEST_OUTPUT\n',
            resources: {},
            workingDir: '/workspace/workspace/hacbs/label-check-required_checks',
            securityContext: {
              capabilities: {
                add: ['SETFCAP'],
              },
            },
          },
        ],
        params: [
          {
            name: 'POLICY_DIR',
            type: 'string',
            default: '/project/image/',
            description: 'Path to directory containing Conftest policies.',
          },
          {
            name: 'POLICY_NAMESPACE',
            type: 'string',
            default: 'required_checks',
            description: 'Namespace for Conftest policy.',
          },
        ],
        results: [
          {
            name: 'TEST_OUTPUT',
            type: 'string',
            description: 'Tekton task test output.',
          },
        ],
        workspaces: [
          {
            name: 'workspace',
          },
        ],
        description: 'Verifies whether an image contains the best practice labels using Conftest.',
      },
      startTime: '2023-07-31T09:56:46Z',
      conditions: [
        {
          type: 'Succeeded',
          reason: 'Succeeded',
          status: 'True',
          message: 'All Steps have completed executing',
          lastTransitionTime: '2023-07-31T09:56:52Z',
        },
      ],
      taskResults: [
        {
          name: 'TEST_OUTPUT',
          type: 'string',
          value:
            '{"result":"SUCCESS","timestamp":"1690797412","note":"For details, check Tekton task log.","namespace":"required_checks","successes":21,"failures":0,"warnings":0}\n',
        },
      ],
      completionTime: '2023-07-31T09:56:52Z',
    },
    metadata: {
      uid: '30bb0c20-5af1-4f98-8f84-c4c5ca6dc0b7',
      name: 'human-resources-on-push-z79cl-label-check',
      labels: {
        'tekton.dev/task': 'label-check',
        'tekton.dev/memberOf': 'tasks',
        'tekton.dev/pipeline': 'human-resources-on-push-z79cl',
        'tekton.dev/pipelineRun': 'human-resources-on-push-z79cl',
        'tekton.dev/pipelineTask': 'label-check',
        'app.kubernetes.io/version': 'v0.19.2',
        'app.kubernetes.io/managed-by': 'pipelinesascode.tekton.dev',
        'pipelinesascode.tekton.dev/sha': '3450decf7174f23304c8e523bc998526ef57e559',
        'appstudio.openshift.io/component': 'human-resources',
        'pipelinesascode.tekton.dev/state': 'started',
        'pipelinesascode.tekton.dev/branch': 'refs-heads-rhtap-references-main',
        'pipelinesascode.tekton.dev/sender': 'red-hat-trusted-app-pipeline__bot',
        'appstudio.openshift.io/application': 'test-application',
        'pipelinesascode.tekton.dev/url-org': 'github-user',
        'pipelines.appstudio.openshift.io/type': 'build',
        'pipelinesascode.tekton.dev/event-type': 'push',
        'pipelinesascode.tekton.dev/repository': 'human-resources',
        'pipelinesascode.tekton.dev/check-run-id': '15478301138',
        'pipelinesascode.tekton.dev/git-provider': 'github',
        'pipelinesascode.tekton.dev/url-repository': 'human-resources',
        'pipelinesascode.tekton.dev/original-prname': 'human-resources-on-push',
      },
      namespace: 'test-ns',
      finalizers: ['chains.tekton.dev'],
      generation: 1,
      annotations: {
        'tekton.dev/tags': 'appstudio, hacbs',
        'chains.tekton.dev/signed': 'true',
        'results.tekton.dev/record':
          'test-ns/results/cfc81c92-3418-446c-a819-62b2241f2e65/records/cfc81c92-3418-446c-a819-62b2241f2e65',
        'results.tekton.dev/result': 'test-ns/results/cfc81c92-3418-446c-a819-62b2241f2e65',
        'pipeline.tekton.dev/release': 'c8ef1db',
        'pipelinesascode.tekton.dev/sha': '3450decf7174f23304c8e523bc998526ef57e559',
        'tekton.dev/pipelines.minVersion': '0.12.1',
        'pipelinesascode.tekton.dev/state': 'started',
        'build.appstudio.openshift.io/repo':
          'https://github.com/github-user/human-resources?rev=3450decf7174f23304c8e523bc998526ef57e559',
        'pipelinesascode.tekton.dev/branch': 'refs/heads/rhtap/references/main',
        'pipelinesascode.tekton.dev/sender': 'red-hat-trusted-app-pipeline[bot]',
        'pipelinesascode.tekton.dev/log-url':
          'https://console-openshift-console.apps.stone-stg-m01.7ayg.p1.openshiftapps.com/k8s/ns/test-ns/tekton.dev~v1beta1~PipelineRun/human-resources-on-push-z79cl',
        'pipelinesascode.tekton.dev/sha-url':
          'https://github.com/github-user/human-resources/commit/3450decf7174f23304c8e523bc998526ef57e559',
        'pipelinesascode.tekton.dev/url-org': 'github-user',
        'pipelinesascode.tekton.dev/on-event': '[push]',
        'pipelinesascode.tekton.dev/repo-url': 'https://github.com/github-user/human-resources',
        'pipelinesascode.tekton.dev/sha-title': 'Update RHTAP references',
        'build.appstudio.redhat.com/commit_sha': '3450decf7174f23304c8e523bc998526ef57e559',
        'pipelinesascode.tekton.dev/event-type': 'push',
        'pipelinesascode.tekton.dev/repository': 'human-resources',
        'pipelinesascode.tekton.dev/check-run-id': '15478301138',
        'pipelinesascode.tekton.dev/git-provider': 'github',
        'build.appstudio.redhat.com/target_branch': 'rhtap/references/main',
        'pipelinesascode.tekton.dev/max-keep-runs': '3',
        'pipelinesascode.tekton.dev/url-repository': 'human-resources',
        'pipelinesascode.tekton.dev/git-auth-secret': 'pac-gitauth-mgmx',
        'pipelinesascode.tekton.dev/installation-id': '39596769',
        'pipelinesascode.tekton.dev/original-prname': 'human-resources-on-push',
        'pipelinesascode.tekton.dev/on-target-branch': '[main]',
      },
      resourceVersion: '515804495',
      creationTimestamp: '2023-07-31T09:56:46Z',
    },
    apiVersion: 'tekton.dev/v1beta1',
  },
  {
    kind: 'TaskRun',
    spec: {
      params: [
        {
          name: 'image-digest',
          value: 'sha256:1d6da200c8ae98384a35bae37516d07b453dde85a91ff891ce57f3a99d420e6a',
        },
        {
          name: 'image-url',
          value:
            'quay.io/redhat-user-workloads-stage/test-ns/test-application/human-resources:3450decf7174f23304c8e523bc998526ef57e559',
        },
      ],
      taskRef: {
        kind: 'Task',
        params: [
          {
            name: 'name',
            value: 'clair-scan',
          },
          {
            name: 'bundle',
            value:
              'quay.io/redhat-appstudio-tekton-catalog/task-clair-scan:0.1@sha256:2016d1d4a1fc02ed353d7aede4bc5f81c5a335f6bcf4a9a2c97d33364afc3210',
          },
          {
            name: 'kind',
            value: 'task',
          },
        ],
        resolver: 'bundles',
      },
      timeout: '1h0m0s',
      serviceAccountName: 'appstudio-pipeline',
    },
    status: {
      steps: [
        {
          name: 'get-vulnerabilities',
          imageID:
            'quay.io/redhat-appstudio/clair-in-ci@sha256:117d99fb2746dc76ce6340253e45713bc5206ea291336a28655e65bcd58c2093',
          container: 'step-get-vulnerabilities',
          terminated: {
            reason: 'Completed',
            exitCode: 0,
            startedAt: '2023-07-31T09:56:42Z',
            finishedAt: '2023-07-31T09:56:52Z',
            containerID: 'cri-o://402838621cbba02fcea92f6fa242c8ae4e06c3bd8c1972ce6b29f5a9c9c0b021',
          },
        },
        {
          name: 'conftest-vulnerabilities',
          imageID:
            'quay.io/redhat-appstudio/hacbs-test@sha256:82b43bffe4eacc717239424f64478b18f36528df47c2d11df3a8d031e81a3c67',
          container: 'step-conftest-vulnerabilities',
          terminated: {
            reason: 'Completed',
            exitCode: 0,
            startedAt: '2023-07-31T09:56:53Z',
            finishedAt: '2023-07-31T09:56:53Z',
            containerID: 'cri-o://4fba345c9a6bd17179d03a0eada4722bac0bc99d0d175ac2be3dcf1767818307',
          },
        },
        {
          name: 'test-format-result',
          imageID:
            'quay.io/redhat-appstudio/hacbs-test@sha256:82b43bffe4eacc717239424f64478b18f36528df47c2d11df3a8d031e81a3c67',
          container: 'step-test-format-result',
          terminated: {
            reason: 'Completed',
            message:
              '[{"key":"CLAIR_SCAN_RESULT","value":"{\\"vulnerabilities\\":{\\"critical\\":0,\\"high\\":2,\\"medium\\":7,\\"low\\":3}}\\n","type":1},{"key":"TEST_OUTPUT","value":"{\\"result\\":\\"SUCCESS\\",\\"timestamp\\":\\"1690797413\\",\\"note\\":\\"Task clair-scan completed: Refer to Tekton task result CLAIR_SCAN_RESULT for vulnerabilities scanned by Clair.\\",\\"namespace\\":\\"default\\",\\"successes\\":0,\\"failures\\":0,\\"warnings\\":0}\\n","type":1}]',
            exitCode: 0,
            startedAt: '2023-07-31T09:56:53Z',
            finishedAt: '2023-07-31T09:56:54Z',
            containerID: 'cri-o://61013ddcffc80b19024ddcf64c5292e9c1901a6d05d3d50563c627a1595f6bc9',
          },
        },
      ],
      podName: 'human-resources-on-push-z79cl-clair-scan-pod',
      taskSpec: {
        steps: [
          {
            env: [
              {
                name: 'IMAGE_URL',
                value:
                  'quay.io/redhat-user-workloads-stage/test-ns/test-application/human-resources:3450decf7174f23304c8e523bc998526ef57e559',
              },
              {
                name: 'IMAGE_DIGEST',
                value: 'sha256:1d6da200c8ae98384a35bae37516d07b453dde85a91ff891ce57f3a99d420e6a',
              },
            ],
            name: 'get-vulnerabilities',
            image: 'quay.io/redhat-appstudio/clair-in-ci:latest',
            script:
              '#!/usr/bin/env bash\n\nimagewithouttag=$(echo $IMAGE_URL | sed "s/\\(.*\\):.*/\\1/" | tr -d \'\\n\')\n# strip new-line escape symbol from parameter and save it to variable\nimageanddigest=$(echo $imagewithouttag@$IMAGE_DIGEST)\n\nclair-action report --image-ref=$imageanddigest --db-path=/tmp/matcher.db --format=quay | tee /tekton/home/clair-result.json || true\n',
            resources: {},
            imagePullPolicy: 'Always',
          },
          {
            name: 'conftest-vulnerabilities',
            image:
              'quay.io/redhat-appstudio/hacbs-test:v1.1.0@sha256:82b43bffe4eacc717239424f64478b18f36528df47c2d11df3a8d031e81a3c67',
            script:
              'if [ ! -s /tekton/home/clair-result.json ]; then\n  echo "Previous step [get-vulnerabilities] failed: /tekton/home/clair-result.json is empty."\nelse\n  /usr/bin/conftest test --no-fail /tekton/home/clair-result.json \\\n  --policy /project/clair/vulnerabilities-check.rego --namespace required_checks \\\n  --output=json | tee /tekton/home/clair-vulnerabilities.json || true\nfi\n',
            resources: {},
            securityContext: {
              capabilities: {
                add: ['SETFCAP'],
              },
            },
          },
          {
            name: 'test-format-result',
            image:
              'quay.io/redhat-appstudio/hacbs-test:v1.1.0@sha256:82b43bffe4eacc717239424f64478b18f36528df47c2d11df3a8d031e81a3c67',
            script:
              '#!/usr/bin/env bash\n. /utils.sh\n\nif [[ ! -f /tekton/home/clair-vulnerabilities.json ]]; then\n  note="Task clair-scan failed: /tekton/home/clair-vulnerabilities.json did not generate. For details, check Tekton task log."\n  TEST_OUTPUT=$(make_result_json -r "ERROR" -t "$note")\n  echo "/tekton/home/clair-vulnerabilities.json did not generate correctly. For details, check conftest command in Tekton task log."\n  echo "${TEST_OUTPUT}" | tee /tekton/results/TEST_OUTPUT\n  exit 0\nfi\n\njq -rce \\\n  \'{vulnerabilities:{\n      critical: (.[] | .warnings? // [] | map(select(.metadata.details.name=="clair_critical_vulnerabilities").metadata."vulnerabilities_number" // 0)| add // 0),\n      high: (.[] | .warnings? // [] | map(select(.metadata.details.name=="clair_high_vulnerabilities").metadata."vulnerabilities_number" // 0)| add // 0),\n      medium: (.[] | .warnings? // [] | map(select(.metadata.details.name=="clair_medium_vulnerabilities").metadata."vulnerabilities_number" // 0)| add // 0),\n      low: (.[] | .warnings? // [] | map(select(.metadata.details.name=="clair_low_vulnerabilities").metadata."vulnerabilities_number" // 0)| add // 0)\n    }}\' /tekton/home/clair-vulnerabilities.json | tee /tekton/results/CLAIR_SCAN_RESULT\n\nnote="Task clair-scan completed: Refer to Tekton task result CLAIR_SCAN_RESULT for vulnerabilities scanned by Clair."\nTEST_OUTPUT=$(make_result_json -r "SUCCESS" -t "$note")\necho "${TEST_OUTPUT}" | tee /tekton/results/TEST_OUTPUT\n',
            resources: {},
          },
        ],
        params: [
          {
            name: 'image-digest',
            type: 'string',
            description: 'Image digest to scan.',
          },
          {
            name: 'image-url',
            type: 'string',
            description: 'Image URL.',
          },
          {
            name: 'docker-auth',
            type: 'string',
            default: '',
            description: 'unused, should be removed in next task version.',
          },
        ],
        results: [
          {
            name: 'TEST_OUTPUT',
            type: 'string',
            description: 'Tekton task test output.',
          },
          {
            name: 'CLAIR_SCAN_RESULT',
            type: 'string',
            description: 'Clair scan result.',
          },
        ],
        description:
          "Scans container images for vulnerabilities using Clair, by comparing the components of container image against Clair's vulnerability databases.",
      },
      startTime: '2023-07-31T09:56:34Z',
      conditions: [
        {
          type: 'Succeeded',
          reason: 'Succeeded',
          status: 'True',
          message: 'All Steps have completed executing',
          lastTransitionTime: '2023-07-31T09:56:55Z',
        },
      ],
      taskResults: [
        {
          name: 'CLAIR_SCAN_RESULT',
          type: 'string',
          value: '{"vulnerabilities":{"critical":0,"high":2,"medium":7,"low":3}}\n',
        },
        {
          name: 'TEST_OUTPUT',
          type: 'string',
          value:
            '{"result":"SUCCESS","timestamp":"1690797413","note":"Task clair-scan completed: Refer to Tekton task result CLAIR_SCAN_RESULT for vulnerabilities scanned by Clair.","namespace":"default","successes":0,"failures":0,"warnings":0}\n',
        },
      ],
      completionTime: '2023-07-31T09:56:55Z',
    },
    metadata: {
      uid: '2848f55f-8361-4345-8393-38f0480f93b4',
      name: 'human-resources-on-push-z79cl-clair-scan',
      labels: {
        'tekton.dev/task': 'clair-scan',
        'tekton.dev/memberOf': 'tasks',
        'tekton.dev/pipeline': 'human-resources-on-push-z79cl',
        'tekton.dev/pipelineRun': 'human-resources-on-push-z79cl',
        'tekton.dev/pipelineTask': 'clair-scan',
        'app.kubernetes.io/version': 'v0.19.2',
        'app.kubernetes.io/managed-by': 'pipelinesascode.tekton.dev',
        'pipelinesascode.tekton.dev/sha': '3450decf7174f23304c8e523bc998526ef57e559',
        'appstudio.openshift.io/component': 'human-resources',
        'pipelinesascode.tekton.dev/state': 'started',
        'pipelinesascode.tekton.dev/branch': 'refs-heads-rhtap-references-main',
        'pipelinesascode.tekton.dev/sender': 'red-hat-trusted-app-pipeline__bot',
        'appstudio.openshift.io/application': 'test-application',
        'pipelinesascode.tekton.dev/url-org': 'github-user',
        'pipelines.appstudio.openshift.io/type': 'build',
        'pipelinesascode.tekton.dev/event-type': 'push',
        'pipelinesascode.tekton.dev/repository': 'human-resources',
        'pipelinesascode.tekton.dev/check-run-id': '15478301138',
        'pipelinesascode.tekton.dev/git-provider': 'github',
        'pipelinesascode.tekton.dev/url-repository': 'human-resources',
        'pipelinesascode.tekton.dev/original-prname': 'human-resources-on-push',
      },
      namespace: 'test-ns',
      finalizers: ['chains.tekton.dev'],
      generation: 1,
      annotations: {
        'tekton.dev/tags': 'appstudio, hacbs',
        'chains.tekton.dev/signed': 'true',
        'results.tekton.dev/record':
          'test-ns/results/cfc81c92-3418-446c-a819-62b2241f2e65/records/cfc81c92-3418-446c-a819-62b2241f2e65',
        'results.tekton.dev/result': 'test-ns/results/cfc81c92-3418-446c-a819-62b2241f2e65',
        'pipeline.tekton.dev/release': 'c8ef1db',
        'pipelinesascode.tekton.dev/sha': '3450decf7174f23304c8e523bc998526ef57e559',
        'tekton.dev/pipelines.minVersion': '0.12.1',
        'pipelinesascode.tekton.dev/state': 'started',
        'build.appstudio.openshift.io/repo':
          'https://github.com/github-user/human-resources?rev=3450decf7174f23304c8e523bc998526ef57e559',
        'pipelinesascode.tekton.dev/branch': 'refs/heads/rhtap/references/main',
        'pipelinesascode.tekton.dev/sender': 'red-hat-trusted-app-pipeline[bot]',
        'pipelinesascode.tekton.dev/log-url':
          'https://console-openshift-console.apps.stone-stg-m01.7ayg.p1.openshiftapps.com/k8s/ns/test-ns/tekton.dev~v1beta1~PipelineRun/human-resources-on-push-z79cl',
        'pipelinesascode.tekton.dev/sha-url':
          'https://github.com/github-user/human-resources/commit/3450decf7174f23304c8e523bc998526ef57e559',
        'pipelinesascode.tekton.dev/url-org': 'github-user',
        'pipelinesascode.tekton.dev/on-event': '[push]',
        'pipelinesascode.tekton.dev/repo-url': 'https://github.com/github-user/human-resources',
        'pipelinesascode.tekton.dev/sha-title': 'Update RHTAP references',
        'build.appstudio.redhat.com/commit_sha': '3450decf7174f23304c8e523bc998526ef57e559',
        'pipelinesascode.tekton.dev/event-type': 'push',
        'pipelinesascode.tekton.dev/repository': 'human-resources',
        'pipelinesascode.tekton.dev/check-run-id': '15478301138',
        'pipelinesascode.tekton.dev/git-provider': 'github',
        'build.appstudio.redhat.com/target_branch': 'rhtap/references/main',
        'pipelinesascode.tekton.dev/max-keep-runs': '3',
        'pipelinesascode.tekton.dev/url-repository': 'human-resources',
        'pipelinesascode.tekton.dev/git-auth-secret': 'pac-gitauth-mgmx',
        'pipelinesascode.tekton.dev/installation-id': '39596769',
        'pipelinesascode.tekton.dev/original-prname': 'human-resources-on-push',
        'pipelinesascode.tekton.dev/on-target-branch': '[main]',
      },
      resourceVersion: '515804610',
      creationTimestamp: '2023-07-31T09:56:32Z',
    },
    apiVersion: 'tekton.dev/v1beta1',
  },
  {
    kind: 'TaskRun',
    spec: {
      params: [
        {
          name: 'image-digest',
          value: 'sha256:1d6da200c8ae98384a35bae37516d07b453dde85a91ff891ce57f3a99d420e6a',
        },
        {
          name: 'image-url',
          value:
            'quay.io/redhat-user-workloads-stage/test-ns/test-application/human-resources:3450decf7174f23304c8e523bc998526ef57e559',
        },
      ],
      taskRef: {
        kind: 'Task',
        params: [
          {
            name: 'name',
            value: 'clamav-scan',
          },
          {
            name: 'bundle',
            value:
              'quay.io/redhat-appstudio-tekton-catalog/task-clamav-scan:0.1@sha256:a666a7dd4fd633d268d1ba26eaaa5ca2dd848c76b7fb2f04b8b37b7ce1c65f9a',
          },
          {
            name: 'kind',
            value: 'task',
          },
        ],
        resolver: 'bundles',
      },
      timeout: '1h0m0s',
      serviceAccountName: 'appstudio-pipeline',
    },
    status: {
      steps: [
        {
          name: 'extract-and-scan-image',
          imageID:
            'quay.io/redhat-appstudio/hacbs-test@sha256:82b43bffe4eacc717239424f64478b18f36528df47c2d11df3a8d031e81a3c67',
          running: {
            startedAt: '2023-07-31T09:56:38Z',
          },
          container: 'step-extract-and-scan-image',
        },
        {
          name: 'modify-clam-output-to-json',
          imageID:
            'quay.io/redhat-appstudio/hacbs-test@sha256:82b43bffe4eacc717239424f64478b18f36528df47c2d11df3a8d031e81a3c67',
          running: {
            startedAt: '2023-07-31T09:56:38Z',
          },
          container: 'step-modify-clam-output-to-json',
        },
        {
          name: 'store-hacbs-test-output-result',
          imageID:
            'quay.io/redhat-appstudio/hacbs-test@sha256:82b43bffe4eacc717239424f64478b18f36528df47c2d11df3a8d031e81a3c67',
          running: {
            startedAt: '2023-07-31T09:56:39Z',
          },
          container: 'step-store-hacbs-test-output-result',
        },
      ],
      podName: 'human-resources-on-push-z79cl-clamav-scan-pod',
      sidecars: [
        {
          name: 'database',
          imageID:
            'quay.io/redhat-appstudio/clamav-db@sha256:6e80591aee06ffec641cd6f6c846425698122fea689e38f22991ad8231143584',
          container: 'sidecar-database',
          terminated: {
            reason: 'Completed',
            exitCode: 0,
            startedAt: '2023-07-31T09:56:39Z',
            finishedAt: '2023-07-31T09:56:39Z',
            containerID: 'cri-o://6c7ce0eee491da74142dde59aa7d6a165a7c295093c45c476a0b4098fdce18ca',
          },
        },
      ],
      taskSpec: {
        steps: [
          {
            env: [
              {
                name: 'HOME',
                value: '/work',
              },
              {
                name: 'IMAGE_URL',
                value:
                  'quay.io/redhat-user-workloads-stage/test-ns/test-application/human-resources:3450decf7174f23304c8e523bc998526ef57e559',
              },
              {
                name: 'IMAGE_DIGEST',
                value: 'sha256:1d6da200c8ae98384a35bae37516d07b453dde85a91ff891ce57f3a99d420e6a',
              },
            ],
            name: 'extract-and-scan-image',
            image:
              'quay.io/redhat-appstudio/hacbs-test:v1.1.0@sha256:82b43bffe4eacc717239424f64478b18f36528df47c2d11df3a8d031e81a3c67',
            script:
              'imagewithouttag=$(echo $IMAGE_URL | sed "s/\\(.*\\):.*/\\1/" | tr -d \'\\n\')\n\n# strip new-line escape symbol from parameter and save it to variable\nimageanddigest=$(echo $imagewithouttag@$IMAGE_DIGEST)\n\n# check if image is attestation one, skip the clamav scan in such case\nif [[ $imageanddigest == *.att ]]\nthen\n    echo "$imageanddigest is an attestation image. Skipping ClamAV scan."\n    exit 0\nfi\nmkdir content\ncd content\necho Extracting image.\nif ! oc image extract --registry-config ~/.docker/config.json $imageanddigest; then\n  echo "Unable to extract image. Skipping ClamAV scan!"\n  exit 0\nfi\necho Extraction done.\nclamscan -ri --max-scansize=250M | tee /tekton/home/clamscan-result.log\necho "Executed-on: Scan was executed on version - $(clamscan --version)" | tee -a /tekton/home/clamscan-result.log\n',
            resources: {
              limits: {
                cpu: '2',
                memory: '4Gi',
              },
              requests: {
                cpu: '10m',
                memory: '512Mi',
              },
            },
            workingDir: '/work',
            volumeMounts: [
              {
                name: 'dbfolder',
                mountPath: '/var/lib/clamav',
              },
              {
                name: 'work',
                mountPath: '/work',
              },
            ],
            securityContext: {
              runAsUser: 1000,
            },
          },
          {
            name: 'modify-clam-output-to-json',
            image:
              'quay.io/redhat-appstudio/hacbs-test:v1.1.0@sha256:82b43bffe4eacc717239424f64478b18f36528df47c2d11df3a8d031e81a3c67',
            script:
              '#!/usr/bin/env python3.9\nimport json\nimport dateutil.parser as parser\nimport os\n\nclamscan_result = "/tekton/home/clamscan-result.log"\nif not os.path.exists(clamscan_result) or os.stat(clamscan_result).st_size == 0:\n    print("clamscan-result.log file is empty, so compiled code not extracted. Parsing skipped.")\n    exit(0)\n\nwith open(clamscan_result, "r") as file:\n    clam_result_str = file.read()\n\ndef clam_result_str_to_json(clam_result_str):\n\n    clam_result_list = clam_result_str.split("\\n")\n    clam_result_list.remove(\'\')\n\n    results_marker = \\\n        clam_result_list.index("----------- SCAN SUMMARY -----------")\n\n    hit_list = clam_result_list[:results_marker]\n    summary_list = clam_result_list[(results_marker + 1):]\n\n    r_dict = { "hits": hit_list }\n    for item in summary_list:\n        # in case of blank lines\n        if not item:\n            continue\n        split_index = [c == \':\' for c in item].index(True)\n        key = item[:split_index].lower()\n        key = key.replace(" ", "_")\n        value = item[(split_index + 1):].strip(" ")\n        if (key == "start_date" or key == "end_date"):\n          isodate = parser.parse(value)\n          value = isodate.isoformat()\n        r_dict[key] = value\n    print(json.dumps(r_dict))\n    with open(\'/tekton/home/clamscan-result.json\', \'w\') as f:\n      print(json.dumps(r_dict), file=f)\n\ndef main():\n    clam_result_str_to_json(clam_result_str)\n\nif __name__ == "__main__":\n    main()\n',
            resources: {},
          },
          {
            name: 'store-hacbs-test-output-result',
            image:
              'quay.io/redhat-appstudio/hacbs-test:v1.1.0@sha256:82b43bffe4eacc717239424f64478b18f36528df47c2d11df3a8d031e81a3c67',
            script:
              '#!/usr/bin/env bash\nsource /utils.sh\n\nif [ -f /tekton/home/clamscan-result.json ];\nthen\n  cat /tekton/home/clamscan-result.json\n  INFECTED_FILES=$(jq -r \'.infected_files\' /tekton/home/clamscan-result.json || true )\n  if [ -z "${INFECTED_FILES}" ]; then\n    echo "Failed to get number of infected files."\n    note="Task clamav-scan failed: Unable to get number of infected files from /tekton/home/clamscan-result.json. For details, check Tekton task log."\n  else\n    if [[ "${INFECTED_FILES}" -gt 0 ]]; then RES="FAILURE"; else RES="SUCCESS"; fi\n    note="Task clamav-scan completed: Check result for antivirus scan result."\n    TEST_OUTPUT=$(make_result_json -r "${RES}" -s 1 -f "${INFECTED_FILES}" -t "$note")\n  fi\nelse\n  note="Task clamav-scan failed: /tekton/home/clamscan-result.json doesn\'t exist. For details, check Tekton task log."\nfi\n\nERROR_OUTPUT=$(make_result_json -r "ERROR" -t "$note")\necho "${TEST_OUTPUT:-${ERROR_OUTPUT}}" | tee /tekton/results/TEST_OUTPUT\n',
            resources: {},
          },
        ],
        params: [
          {
            name: 'image-digest',
            type: 'string',
            description: 'Image digest to scan.',
          },
          {
            name: 'image-url',
            type: 'string',
            description: 'Image URL.',
          },
          {
            name: 'docker-auth',
            type: 'string',
            default: '',
            description: 'unused',
          },
        ],
        results: [
          {
            name: 'TEST_OUTPUT',
            type: 'string',
            description: 'Tekton task test output.',
          },
        ],
        volumes: [
          {
            name: 'dbfolder',
          },
          {
            name: 'work',
          },
        ],
        sidecars: [
          {
            name: 'database',
            image: 'quay.io/redhat-appstudio/clamav-db:latest',
            script:
              '#!/usr/bin/env bash\nclamscan --version\ncp -r /var/lib/clamav/* /tmp/clamdb\n',
            resources: {},
            volumeMounts: [
              {
                name: 'dbfolder',
                mountPath: '/tmp/clamdb',
              },
            ],
            imagePullPolicy: 'Always',
          },
        ],
        description:
          'Scans the content of container images for viruses, malware, and other malicious content using ClamAV antivirus scanner.',
      },
      startTime: '2023-07-31T09:56:34Z',
      conditions: [
        {
          type: 'Succeeded',
          reason: 'Running',
          status: 'Unknown',
          message: 'Not all Steps in the Task have finished executing',
          lastTransitionTime: '2023-07-31T09:56:39Z',
        },
      ],
    },
    metadata: {
      uid: '7c3052e2-93fb-4790-a67f-ef0c35e1872b',
      name: 'human-resources-on-push-z79cl-clamav-scan',
      labels: {
        'tekton.dev/task': 'clamav-scan',
        'tekton.dev/memberOf': 'tasks',
        'tekton.dev/pipeline': 'human-resources-on-push-z79cl',
        'tekton.dev/pipelineRun': 'human-resources-on-push-z79cl',
        'tekton.dev/pipelineTask': 'clamav-scan',
        'app.kubernetes.io/version': 'v0.19.2',
        'app.kubernetes.io/managed-by': 'pipelinesascode.tekton.dev',
        'pipelinesascode.tekton.dev/sha': '3450decf7174f23304c8e523bc998526ef57e559',
        'appstudio.openshift.io/component': 'human-resources',
        'pipelinesascode.tekton.dev/state': 'started',
        'pipelinesascode.tekton.dev/branch': 'refs-heads-rhtap-references-main',
        'pipelinesascode.tekton.dev/sender': 'red-hat-trusted-app-pipeline__bot',
        'appstudio.openshift.io/application': 'test-application',
        'pipelinesascode.tekton.dev/url-org': 'github-user',
        'pipelines.appstudio.openshift.io/type': 'build',
        'pipelinesascode.tekton.dev/event-type': 'push',
        'pipelinesascode.tekton.dev/repository': 'human-resources',
        'pipelinesascode.tekton.dev/check-run-id': '15478301138',
        'pipelinesascode.tekton.dev/git-provider': 'github',
        'pipelinesascode.tekton.dev/url-repository': 'human-resources',
        'pipelinesascode.tekton.dev/original-prname': 'human-resources-on-push',
      },
      namespace: 'test-ns',
      finalizers: ['chains.tekton.dev'],
      generation: 1,
      annotations: {
        'tekton.dev/tags': 'virus, appstudio, hacbs',
        'results.tekton.dev/record':
          'test-ns/results/cfc81c92-3418-446c-a819-62b2241f2e65/records/cfc81c92-3418-446c-a819-62b2241f2e65',
        'results.tekton.dev/result': 'test-ns/results/cfc81c92-3418-446c-a819-62b2241f2e65',
        'pipeline.tekton.dev/release': 'c8ef1db',
        'pipelinesascode.tekton.dev/sha': '3450decf7174f23304c8e523bc998526ef57e559',
        'tekton.dev/pipelines.minVersion': '0.12.1',
        'pipelinesascode.tekton.dev/state': 'started',
        'build.appstudio.openshift.io/repo':
          'https://github.com/github-user/human-resources?rev=3450decf7174f23304c8e523bc998526ef57e559',
        'pipelinesascode.tekton.dev/branch': 'refs/heads/rhtap/references/main',
        'pipelinesascode.tekton.dev/sender': 'red-hat-trusted-app-pipeline[bot]',
        'pipelinesascode.tekton.dev/log-url':
          'https://console-openshift-console.apps.stone-stg-m01.7ayg.p1.openshiftapps.com/k8s/ns/test-ns/tekton.dev~v1beta1~PipelineRun/human-resources-on-push-z79cl',
        'pipelinesascode.tekton.dev/sha-url':
          'https://github.com/github-user/human-resources/commit/3450decf7174f23304c8e523bc998526ef57e559',
        'pipelinesascode.tekton.dev/url-org': 'github-user',
        'pipelinesascode.tekton.dev/on-event': '[push]',
        'pipelinesascode.tekton.dev/repo-url': 'https://github.com/github-user/human-resources',
        'pipelinesascode.tekton.dev/sha-title': 'Update RHTAP references',
        'build.appstudio.redhat.com/commit_sha': '3450decf7174f23304c8e523bc998526ef57e559',
        'pipelinesascode.tekton.dev/event-type': 'push',
        'pipelinesascode.tekton.dev/repository': 'human-resources',
        'pipelinesascode.tekton.dev/check-run-id': '15478301138',
        'pipelinesascode.tekton.dev/git-provider': 'github',
        'build.appstudio.redhat.com/target_branch': 'rhtap/references/main',
        'pipelinesascode.tekton.dev/max-keep-runs': '3',
        'pipelinesascode.tekton.dev/url-repository': 'human-resources',
        'pipelinesascode.tekton.dev/git-auth-secret': 'pac-gitauth-mgmx',
        'pipelinesascode.tekton.dev/installation-id': '39596769',
        'pipelinesascode.tekton.dev/original-prname': 'human-resources-on-push',
        'pipelinesascode.tekton.dev/on-target-branch': '[main]',
      },
      resourceVersion: '515803802',
      creationTimestamp: '2023-07-31T09:56:32Z',
    },
    apiVersion: 'tekton.dev/v1beta1',
  },
];

export const mockSnapshotEBs = [
  {
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    kind: 'SnapshotEnvironmentBinding',
    metadata: {
      generateName: 'test-application-development-binding-',
      resourceVersion: '551578207',
      name: 'test-application-development-binding-fgr78',
      uid: '28ecb910-ce25-4268-9003-fb744083e1c4',
      creationTimestamp: '2023-06-22T14:15:01Z',
      generation: 199,
      namespace: 'test-ns',
      finalizers: ['spi.appstudio.redhat.com/remote-secrets'],
      labels: {
        'appstudio.application': 'test-application',
        'appstudio.environment': 'development',
      },
    },
    spec: {
      application: 'test-application',
      components: [
        {
          configuration: {
            replicas: 0,
          },
          name: 'nodejs-app-multi-components-repo',
        },
        {
          configuration: {
            replicas: 0,
          },
          name: 'pacman-ccgs',
        },
        {
          configuration: {
            replicas: 0,
          },
          name: 'python-app-multi-components-repo',
        },
        {
          configuration: {
            replicas: 0,
          },
          name: 'human-resources',
        },
        {
          configuration: {
            replicas: 0,
          },
          name: 'devfile-sample-go-basic-fj5r',
        },
      ],
      environment: 'development',
      snapshot: 'test-application-xrvgq',
    },
    status: {
      bindingConditions: [
        {
          lastTransitionTime: '2023-08-03T23:35:53Z',
          message:
            "Can not Reconcile Binding 'test-application-development-binding-fgr78', since GitOps Repo Conditions status is false.",
          reason: 'ErrorOccurred',
          status: 'True',
          type: 'ErrorOccurred',
        },
      ],
      componentDeploymentConditions: [
        {
          lastTransitionTime: '2023-07-26T13:14:07Z',
          message: '0 of 5 components deployed',
          reason: 'CommitsUnsynced',
          status: 'False',
          type: 'AllComponentsDeployed',
        },
      ],
      components: [
        {
          generatedRouteName: 'human-resources0khq',
          gitopsRepository: {
            branch: 'main',
            commitID: '7ee30dc135e65fe53bcac4f30dbdacaec8cd4e1c\n',
            generatedResources: ['deployment-patch.yaml'],
            path: 'components/human-resources/overlays/development',
            url: 'https://github.com/redhat-appstudio-appdata-staging/test-application-p0QHj-travel-break',
          },
          name: 'human-resources',
        },
        {
          generatedRouteName: 'devfile-sample-go-basic-ff5jv',
          gitopsRepository: {
            branch: 'main',
            commitID: '7ee30dc135e65fe53bcac4f30dbdacaec8cd4e1c\n',
            generatedResources: ['deployment-patch.yaml'],
            path: 'components/devfile-sample-go-basic-fj5r/overlays/development',
            url: 'https://github.com/redhat-appstudio-appdata-staging/test-application-p0QHj-travel-break',
          },
          name: 'devfile-sample-go-basic-fj5r',
        },
        {
          generatedRouteName: 'nodejs-app-multi-componenz3cm',
          gitopsRepository: {
            branch: 'main',
            commitID: '7ee30dc135e65fe53bcac4f30dbdacaec8cd4e1c\n',
            generatedResources: ['deployment-patch.yaml'],
            path: 'components/nodejs-app-multi-components-repo/overlays/development',
            url: 'https://github.com/redhat-appstudio-appdata-staging/test-application-p0QHj-travel-break',
          },
          name: 'nodejs-app-multi-components-repo',
        },
        {
          generatedRouteName: 'python-app-multi-componenrfl5',
          gitopsRepository: {
            branch: 'main',
            commitID: '7ee30dc135e65fe53bcac4f30dbdacaec8cd4e1c\n',
            generatedResources: ['deployment-patch.yaml'],
            path: 'components/python-app-multi-components-repo/overlays/development',
            url: 'https://github.com/redhat-appstudio-appdata-staging/test-application-p0QHj-travel-break',
          },
          name: 'python-app-multi-components-repo',
        },
        {
          generatedRouteName: 'pacman-ccgsxilk',
          gitopsRepository: {
            branch: 'main',
            commitID: '7ee30dc135e65fe53bcac4f30dbdacaec8cd4e1c\n',
            generatedResources: ['deployment-patch.yaml'],
            path: 'components/pacman-ccgs/overlays/development',
            url: 'https://github.com/redhat-appstudio-appdata-staging/test-application-p0QHj-travel-break',
          },
          name: 'pacman-ccgs',
        },
      ],
      gitopsDeployments: [
        {
          componentName: 'pacman-ccgs',
          gitopsDeployment:
            'test-application-development-binding-fgr78-test-application-development-pacman-ccgs',
          health: 'Healthy',
          syncStatus: 'Unknown',
        },
        {
          componentName: 'human-resources',
          gitopsDeployment:
            'test-application-development-binding-fgr78-test-application-development-human-resources',
          health: 'Progressing',
          syncStatus: 'Unknown',
        },
        {
          componentName: 'devfile-sample-go-basic-fj5r',
          gitopsDeployment:
            'test-application-development-binding-fgr78-test-application-development-devfile-sample-go-basic-fj5r',
          health: 'Progressing',
          syncStatus: 'Unknown',
        },
        {
          componentName: 'nodejs-app-multi-components-repo',
          gitopsDeployment:
            'test-application-development-binding-fgr78-test-application-development-nodejs-app-multi-components-repo',
          health: 'Healthy',
          syncStatus: 'Unknown',
        },
        {
          componentName: 'python-app-multi-components-repo',
          gitopsDeployment:
            'test-application-development-binding-fgr78-test-application-development-python-app-multi-components-repo',
          health: 'Progressing',
          syncStatus: 'Unknown',
        },
      ],
      gitopsRepoConditions: [
        {
          lastTransitionTime: '2023-08-03T23:35:53Z',
          message:
            'GitOps repository sync failed: failed to generate the gitops resources in overlays dir "/tmp/test-application-development-binding-fgr78042206135/test-application/components/nodejs-app-multi-components-repo/overlays/development" for component "nodejs-app-multi-components-repo": failed to unmarshal items from "/tmp/test-application-development-binding-fgr78042206135/test-application/components/nodejs-app-multi-components-repo/overlays/development/kustomization.yaml": failed to unmarshal data: error unmarshaling JSON: while decoding JSON: json: cannot unmarshal string into Go struct field Kustomization.patches of type resources.Patch',
          reason: 'GenerateError',
          status: 'False',
          type: 'GitOpsResourcesGenerated',
        },
      ],
    },
  },
  {
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    kind: 'SnapshotEnvironmentBinding',
    metadata: {
      generateName: 'test-application-staging-binding-',
      resourceVersion: '551570874',
      name: 'test-application-staging-binding-7hh2j',
      uid: 'a1db7266-8048-465e-9c16-9365a2959b19',
      creationTimestamp: '2023-07-20T15:09:17Z',
      generation: 161,
      namespace: 'test-ns',
      finalizers: ['spi.appstudio.redhat.com/remote-secrets'],
      labels: {
        'appstudio.application': 'test-application',
        'appstudio.environment': 'staging',
      },
    },
    spec: {
      application: 'test-application',
      components: [
        {
          configuration: {
            replicas: 0,
          },
          name: 'nodejs-app-multi-components-repo',
        },
        {
          configuration: {
            replicas: 0,
          },
          name: 'pacman-ccgs',
        },
        {
          configuration: {
            replicas: 0,
          },
          name: 'python-app-multi-components-repo',
        },
        {
          configuration: {
            replicas: 0,
          },
          name: 'human-resources',
        },
        {
          configuration: {
            replicas: 0,
          },
          name: 'devfile-sample-go-basic-fj5r',
        },
      ],
      environment: 'staging',
      snapshot: 'test-application-xrvgq',
    },
    status: {
      bindingConditions: [
        {
          lastTransitionTime: '2023-08-03T23:35:32Z',
          message:
            "Can not Reconcile Binding 'test-application-staging-binding-7hh2j', since GitOps Repo Conditions status is false.",
          reason: 'ErrorOccurred',
          status: 'True',
          type: 'ErrorOccurred',
        },
      ],
      componentDeploymentConditions: [
        {
          lastTransitionTime: '2023-07-21T03:11:00Z',
          message: '0 of 5 components deployed',
          reason: 'CommitsUnsynced',
          status: 'False',
          type: 'AllComponentsDeployed',
        },
      ],
      components: [
        {
          generatedRouteName: 'human-resourcesi1a6',
          gitopsRepository: {
            branch: 'main',
            commitID: '7ee30dc135e65fe53bcac4f30dbdacaec8cd4e1c\n',
            generatedResources: ['deployment-patch.yaml'],
            path: 'components/human-resources/overlays/staging',
            url: 'https://github.com/redhat-appstudio-appdata-staging/test-application-p0QHj-travel-break',
          },
          name: 'human-resources',
        },
        {
          generatedRouteName: 'devfile-sample-go-basic-frw8z',
          gitopsRepository: {
            branch: 'main',
            commitID: '7ee30dc135e65fe53bcac4f30dbdacaec8cd4e1c\n',
            generatedResources: ['deployment-patch.yaml'],
            path: 'components/devfile-sample-go-basic-fj5r/overlays/staging',
            url: 'https://github.com/redhat-appstudio-appdata-staging/test-application-p0QHj-travel-break',
          },
          name: 'devfile-sample-go-basic-fj5r',
        },
        {
          generatedRouteName: 'nodejs-app-multi-componen3hxe',
          gitopsRepository: {
            branch: 'main',
            commitID: '7ee30dc135e65fe53bcac4f30dbdacaec8cd4e1c\n',
            generatedResources: ['deployment-patch.yaml'],
            path: 'components/nodejs-app-multi-components-repo/overlays/staging',
            url: 'https://github.com/redhat-appstudio-appdata-staging/test-application-p0QHj-travel-break',
          },
          name: 'nodejs-app-multi-components-repo',
        },
        {
          generatedRouteName: 'pacman-ccgscro0',
          gitopsRepository: {
            branch: 'main',
            commitID: '7ee30dc135e65fe53bcac4f30dbdacaec8cd4e1c\n',
            generatedResources: ['deployment-patch.yaml'],
            path: 'components/pacman-ccgs/overlays/staging',
            url: 'https://github.com/redhat-appstudio-appdata-staging/test-application-p0QHj-travel-break',
          },
          name: 'pacman-ccgs',
        },
        {
          generatedRouteName: 'python-app-multi-componen0plz',
          gitopsRepository: {
            branch: 'main',
            commitID: '7ee30dc135e65fe53bcac4f30dbdacaec8cd4e1c\n',
            generatedResources: ['deployment-patch.yaml'],
            path: 'components/python-app-multi-components-repo/overlays/staging',
            url: 'https://github.com/redhat-appstudio-appdata-staging/test-application-p0QHj-travel-break',
          },
          name: 'python-app-multi-components-repo',
        },
      ],
      gitopsDeployments: [
        {
          componentName: 'pacman-ccgs',
          gitopsDeployment:
            'test-application-staging-binding-7hh2j-test-application-staging-pacman-ccgs',
          health: 'Healthy',
          syncStatus: 'Unknown',
        },
        {
          componentName: 'python-app-multi-components-repo',
          gitopsDeployment:
            'test-application-staging-binding-7hh2j-test-application-staging-python-app-multi-components-repo',
          health: 'Healthy',
          syncStatus: 'Unknown',
        },
        {
          componentName: 'human-resources',
          gitopsDeployment:
            'test-application-staging-binding-7hh2j-test-application-staging-human-resources',
          health: 'Healthy',
          syncStatus: 'Unknown',
        },
        {
          componentName: 'devfile-sample-go-basic-fj5r',
          gitopsDeployment:
            'test-application-staging-binding-7hh2j-test-application-staging-devfile-sample-go-basic-fj5r',
          health: 'Healthy',
          syncStatus: 'Unknown',
        },
        {
          componentName: 'nodejs-app-multi-components-repo',
          gitopsDeployment:
            'test-application-staging-binding-7hh2j-test-application-staging-nodejs-app-multi-components-repo',
          health: 'Healthy',
          syncStatus: 'Unknown',
        },
      ],
      gitopsRepoConditions: [
        {
          lastTransitionTime: '2023-08-03T23:35:32Z',
          message:
            'GitOps repository sync failed: failed to generate the gitops resources in overlays dir "/tmp/test-application-staging-binding-7hh2j147296141/test-application/components/nodejs-app-multi-components-repo/overlays/staging" for component "nodejs-app-multi-components-repo": failed to unmarshal items from "/tmp/test-application-staging-binding-7hh2j147296141/test-application/components/nodejs-app-multi-components-repo/overlays/staging/kustomization.yaml": failed to unmarshal data: error unmarshaling JSON: while decoding JSON: json: cannot unmarshal string into Go struct field Kustomization.patches of type resources.Patch',
          reason: 'GenerateError',
          status: 'False',
          type: 'GitOpsResourcesGenerated',
        },
      ],
    },
  },
];

export const mockGitOpsDeploymentCRs = [
  {
    apiVersion: 'managed-gitops.redhat.com/v1alpha1',
    kind: 'GitOpsDeployment',
    metadata: {
      resourceVersion: '551596526',
      name: 'test-app-1-development-binding-xrqw8-test-app-1-development-react-topology',
      uid: '3605224f-c2a7-4ae9-848c-e7cc785c5b8d',
      creationTimestamp: '2023-07-21T09:43:10Z',
      generation: 1,
      namespace: 'test-ns',
      labels: {
        'appstudio.openshift.io/application': 'test-app-1',
        'appstudio.openshift.io/component': 'react-topology',
        'appstudio.openshift.io/environment': 'development',
      },
    },
    spec: {
      destination: {},
      source: {
        path: 'components/react-topology/overlays/development',
        repoURL: 'https://github.com/redhat-appstudio-appdata-staging/test-app-1-p0QHj-play-differ',
        targetRevision: 'main',
      },
      type: 'automated',
    },
    status: {
      conditions: [
        {
          lastProbeTime: '2023-08-10T15:28:18Z',
          lastTransitionTime: '2023-08-10T15:25:43Z',
          message:
            'rpc error: code = Unknown desc = `kustomize build .components/react-topology/overlays/development` failed exit status 1: Error: invalid Kustomization: json: cannot unmarshal string into Go struct field Kustomization.patches of type types.Patch',
          reason: 'ComparisonError',
          status: 'True',
          type: 'ComparisonError',
        },
      ],
      health: {
        status: 'Progressing',
      },
      operationState: {
        finishedAt: '2023-07-21T10:01:47Z',
        message: 'successfully synced (all tasks run)',
        operation: {
          initiatedBy: {
            automated: true,
          },
          retry: {
            backoff: {
              duration: '5s',
              factor: 2,
              maxDuration: '3m',
            },
            limit: -1,
          },
          sync: {
            prune: true,
            revision: '133cc3bd94609e2c05b076c23fcaa7399502925a',
            syncOptions: ['PrunePropagationPolicy=background'],
          },
        },
        phase: 'Succeeded',
        startedAt: '2023-07-21T10:01:41Z',
        syncResult: {
          resources: [
            {
              syncPhase: 'Sync',
              message: 'service/react-topology created',
              name: 'react-topology',
              status: 'Synced',
              kind: 'Service',
              version: 'v1',
              hookPhase: 'Running',
              namespace: 'test-ns',
              group: '',
            },
            {
              syncPhase: 'Sync',
              message: 'deployment.apps/react-topology created',
              name: 'react-topology',
              status: 'Synced',
              kind: 'Deployment',
              version: 'v1',
              hookPhase: 'Running',
              namespace: 'test-ns',
              group: 'apps',
            },
            {
              syncPhase: 'Sync',
              message: 'route.route.openshift.io/react-topologylgdi created',
              name: 'react-topologylgdi',
              status: 'Synced',
              kind: 'Route',
              version: 'v1',
              hookPhase: 'Running',
              namespace: 'test-ns',
              group: 'route.openshift.io',
            },
          ],
          revision: '133cc3bd94609e2c05b076c23fcaa7399502925a',
          source: {
            path: 'components/react-topology/overlays/development',
            repoURL:
              'https://github.com/redhat-appstudio-appdata-staging/test-app-1-p0QHj-play-differ',
            targetRevision: 'main',
          },
        },
      },
      reconciledState: {
        destination: {
          name: '',
          namespace: 'test-ns',
        },
        source: {
          branch: 'main',
          path: 'components/react-topology/overlays/development',
          repoURL:
            'https://github.com/redhat-appstudio-appdata-staging/test-app-1-p0QHj-play-differ',
        },
      },
      resources: [
        {
          health: {
            status: 'Healthy',
          },
          kind: 'Service',
          name: 'react-topology',
          namespace: 'test-ns',
          status: 'Unknown',
          version: 'v1',
        },
        {
          group: 'apps',
          health: {
            message: 'Waiting for rollout to finish: 0 of 1 updated replicas are available...',
            status: 'Progressing',
          },
          kind: 'Deployment',
          name: 'react-topology',
          namespace: 'test-ns',
          status: 'Unknown',
          version: 'v1',
        },
        {
          group: 'route.openshift.io',
          health: {
            message: 'Route is healthy',
            status: 'Healthy',
          },
          kind: 'Route',
          name: 'react-topologylgdi',
          namespace: 'test-ns',
          status: 'Unknown',
          version: 'v1',
        },
      ],
      sync: {
        status: 'Unknown',
      },
    },
  },
  {
    apiVersion: 'managed-gitops.redhat.com/v1alpha1',
    kind: 'GitOpsDeployment',
    metadata: {
      resourceVersion: '551596384',
      name: 'test-application-staging-binding-7hh2j-test-application-staging-nodejs-app-multi-components-repo',
      uid: 'eb713b7f-e7f1-4f49-b138-39a94de97190',
      creationTimestamp: '2023-07-20T15:09:25Z',
      generation: 1,
      namespace: 'test-ns',
      labels: {
        'appstudio.openshift.io/application': 'test-application',
        'appstudio.openshift.io/component': 'nodejs-app-multi-components-repo',
        'appstudio.openshift.io/environment': 'staging',
      },
    },
    spec: {
      destination: {
        environment: 'managed-environment-staging',
        namespace: 'test-ns',
      },
      source: {
        path: 'components/nodejs-app-multi-components-repo/overlays/staging',
        repoURL:
          'https://github.com/redhat-appstudio-appdata-staging/test-application-p0QHj-travel-break',
        targetRevision: 'main',
      },
      type: 'automated',
    },
    status: {
      conditions: [
        {
          lastProbeTime: '2023-08-10T15:28:16Z',
          lastTransitionTime: '2023-07-24T10:25:55Z',
          message:
            'unable to reconcile the ManagedEnvironment resource. Ensure that the ManagedEnvironment exists, it references a Secret, and the Secret is valid',
          reason: 'ErrorOccurred',
          status: 'True',
          type: 'ErrorOccurred',
        },
      ],
      health: {
        status: 'Healthy',
      },
      operationState: {
        finishedAt: '2023-07-20T15:09:53Z',
        message: 'successfully synced (all tasks run)',
        operation: {
          initiatedBy: {
            automated: true,
          },
          retry: {
            backoff: {
              duration: '5s',
              factor: 2,
              maxDuration: '3m',
            },
            limit: -1,
          },
          sync: {
            prune: true,
            revision: '54e3b4e01cfb0417dd77582658bd4c3fd080940d',
            syncOptions: ['PrunePropagationPolicy=background'],
          },
        },
        phase: 'Succeeded',
        startedAt: '2023-07-20T15:09:47Z',
        syncResult: {
          resources: [
            {
              syncPhase: 'Sync',
              message: 'service/nodejs-app-multi-components-repo created',
              name: 'nodejs-app-multi-components-repo',
              status: 'Synced',
              kind: 'Service',
              version: 'v1',
              hookPhase: 'Running',
              namespace: 'test-ns',
              group: '',
            },
            {
              syncPhase: 'Sync',
              message: 'deployment.apps/nodejs-app-multi-components-repo created',
              name: 'nodejs-app-multi-components-repo',
              status: 'Synced',
              kind: 'Deployment',
              version: 'v1',
              hookPhase: 'Running',
              namespace: 'test-ns',
              group: 'apps',
            },
            {
              syncPhase: 'Sync',
              message: 'route.route.openshift.io/nodejs-app-multi-componen3hxe created',
              name: 'nodejs-app-multi-componen3hxe',
              status: 'Synced',
              kind: 'Route',
              version: 'v1',
              hookPhase: 'Running',
              namespace: 'test-ns',
              group: 'route.openshift.io',
            },
          ],
          revision: '54e3b4e01cfb0417dd77582658bd4c3fd080940d',
          source: {
            path: 'components/nodejs-app-multi-components-repo/overlays/staging',
            repoURL:
              'https://github.com/redhat-appstudio-appdata-staging/test-application-p0QHj-travel-break',
            targetRevision: 'main',
          },
        },
      },
      reconciledState: {
        destination: {
          name: 'managed-environment-staging',
          namespace: 'test-ns',
        },
        source: {
          branch: 'main',
          path: 'components/nodejs-app-multi-components-repo/overlays/staging',
          repoURL:
            'https://github.com/redhat-appstudio-appdata-staging/test-application-p0QHj-travel-break',
        },
      },
      sync: {
        status: 'Unknown',
      },
    },
  },
  {
    apiVersion: 'managed-gitops.redhat.com/v1alpha1',
    kind: 'GitOpsDeployment',
    metadata: {
      resourceVersion: '551596373',
      name: 'test-application-development-binding-fgr78-test-application-development-nodejs-app-multi-components-repo',
      uid: '2511ab3b-686f-43ac-ae6a-eb4e53fd87f9',
      creationTimestamp: '2023-07-06T15:14:09Z',
      generation: 1,
      namespace: 'test-ns',
      labels: {
        'appstudio.openshift.io/application': 'test-application',
        'appstudio.openshift.io/component': 'nodejs-app-multi-components-repo',
        'appstudio.openshift.io/environment': 'development',
      },
    },
    spec: {
      destination: {},
      source: {
        path: 'components/nodejs-app-multi-components-repo/overlays/development',
        repoURL:
          'https://github.com/redhat-appstudio-appdata-staging/test-application-p0QHj-travel-break',
        targetRevision: 'main',
      },
      type: 'automated',
    },
    status: {
      conditions: [
        {
          lastProbeTime: '2023-08-10T15:28:15Z',
          lastTransitionTime: '2023-08-10T15:16:38Z',
          message:
            'rpc error: code = Unknown desc = Manifest generation error (cached): `kustomize build .components/nodejs-app-multi-components-repo/overlays/development` failed exit status 1: Error: invalid Kustomization: json: cannot unmarshal string into Go struct field Kustomization.patches of type types.Patch',
          reason: 'ComparisonError',
          status: 'True',
          type: 'ComparisonError',
        },
      ],
      health: {
        status: 'Healthy',
      },
      operationState: {
        finishedAt: '2023-07-24T10:35:58Z',
        message: 'successfully synced (all tasks run)',
        operation: {
          initiatedBy: {
            automated: true,
          },
          retry: {
            backoff: {
              duration: '5s',
              factor: 2,
              maxDuration: '3m',
            },
            limit: -1,
          },
          sync: {
            prune: true,
            revision: 'c48df983cfb6fc5a2a15a57e49f722fd6a60d931',
            syncOptions: ['PrunePropagationPolicy=background'],
          },
        },
        phase: 'Succeeded',
        startedAt: '2023-07-24T10:35:55Z',
        syncResult: {
          resources: [
            {
              syncPhase: 'Sync',
              message: 'service/nodejs-app-multi-components-repo configured',
              name: 'nodejs-app-multi-components-repo',
              status: 'Synced',
              kind: 'Service',
              version: 'v1',
              hookPhase: 'Running',
              namespace: 'test-ns',
              group: '',
            },
            {
              syncPhase: 'Sync',
              message: 'deployment.apps/nodejs-app-multi-components-repo configured',
              name: 'nodejs-app-multi-components-repo',
              status: 'Synced',
              kind: 'Deployment',
              version: 'v1',
              hookPhase: 'Running',
              namespace: 'test-ns',
              group: 'apps',
            },
            {
              syncPhase: 'Sync',
              message: 'route.route.openshift.io/nodejs-app-multi-componenz3cm unchanged',
              name: 'nodejs-app-multi-componenz3cm',
              status: 'Synced',
              kind: 'Route',
              version: 'v1',
              hookPhase: 'Running',
              namespace: 'test-ns',
              group: 'route.openshift.io',
            },
          ],
          revision: 'c48df983cfb6fc5a2a15a57e49f722fd6a60d931',
          source: {
            path: 'components/nodejs-app-multi-components-repo/overlays/development',
            repoURL:
              'https://github.com/redhat-appstudio-appdata-staging/test-application-p0QHj-travel-break',
            targetRevision: 'main',
          },
        },
      },
      reconciledState: {
        destination: {
          name: '',
          namespace: 'test-ns',
        },
        source: {
          branch: 'main',
          path: 'components/nodejs-app-multi-components-repo/overlays/development',
          repoURL:
            'https://github.com/redhat-appstudio-appdata-staging/test-application-p0QHj-travel-break',
        },
      },
      resources: [
        {
          health: {
            status: 'Healthy',
          },
          kind: 'Service',
          name: 'nodejs-app-multi-components-repo',
          namespace: 'test-ns',
          status: 'Unknown',
          version: 'v1',
        },
        {
          group: 'apps',
          health: {
            status: 'Healthy',
          },
          kind: 'Deployment',
          name: 'nodejs-app-multi-components-repo',
          namespace: 'test-ns',
          status: 'Unknown',
          version: 'v1',
        },
        {
          group: 'route.openshift.io',
          health: {
            message: 'Route is healthy',
            status: 'Healthy',
          },
          kind: 'Route',
          name: 'nodejs-app-multi-componenz3cm',
          namespace: 'test-ns',
          status: 'Unknown',
          version: 'v1',
        },
      ],
      sync: {
        status: 'Unknown',
      },
    },
  },
  {
    apiVersion: 'managed-gitops.redhat.com/v1alpha1',
    kind: 'GitOpsDeployment',
    metadata: {
      resourceVersion: '551595968',
      name: 'my-test-app-staging-binding-4tv7c-my-test-app-staging-react-topology-ujs8',
      uid: '6beef2c7-8bab-4f87-8c8e-a9437bb4745b',
      creationTimestamp: '2023-07-21T09:42:05Z',
      generation: 1,
      namespace: 'test-ns',
      labels: {
        'appstudio.openshift.io/application': 'my-test-app',
        'appstudio.openshift.io/component': 'react-topology-ujs8',
        'appstudio.openshift.io/environment': 'staging',
      },
    },
    spec: {
      destination: {
        environment: 'managed-environment-staging',
        namespace: 'test-ns',
      },
      source: {
        path: 'components/react-topology-ujs8/overlays/staging',
        repoURL:
          'https://github.com/redhat-appstudio-appdata-staging/my-test-app-p0QHj-marry-promise',
        targetRevision: 'main',
      },
      type: 'automated',
    },
    status: {
      conditions: [
        {
          lastProbeTime: '2023-08-10T15:28:06Z',
          lastTransitionTime: '2023-07-21T09:42:05Z',
          message:
            'Unable to reconcile the ManagedEnvironment. Verify that the ManagedEnvironment and Secret are correctly defined, and have valid credentials',
          reason: 'ErrorOccurred',
          status: 'True',
          type: 'ErrorOccurred',
        },
      ],
      health: {},
      reconciledState: {
        destination: {
          name: '',
          namespace: '',
        },
        source: {
          branch: '',
          path: '',
          repoURL: '',
        },
      },
      sync: {
        status: '',
      },
    },
  },
  {
    apiVersion: 'managed-gitops.redhat.com/v1alpha1',
    kind: 'GitOpsDeployment',
    metadata: {
      resourceVersion: '551596438',
      name: 'test-application-development-binding-fgr78-test-application-development-human-resources',
      uid: '3ce2e396-5682-47ff-80f8-38e6b7284adf',
      creationTimestamp: '2023-07-06T18:21:26Z',
      generation: 1,
      namespace: 'test-ns',
      labels: {
        'appstudio.openshift.io/application': 'test-application',
        'appstudio.openshift.io/component': 'human-resources',
        'appstudio.openshift.io/environment': 'development',
      },
    },
    spec: {
      destination: {},
      source: {
        path: 'components/human-resources/overlays/development',
        repoURL:
          'https://github.com/redhat-appstudio-appdata-staging/test-application-p0QHj-travel-break',
        targetRevision: 'main',
      },
      type: 'automated',
    },
    status: {
      conditions: [
        {
          lastProbeTime: '2023-08-10T15:28:16Z',
          lastTransitionTime: '2023-08-10T15:15:34Z',
          message:
            'rpc error: code = Unknown desc = Manifest generation error (cached): `kustomize build .components/human-resources/overlays/development` failed exit status 1: Error: invalid Kustomization: json: cannot unmarshal string into Go struct field Kustomization.patches of type types.Patch',
          reason: 'ComparisonError',
          status: 'True',
          type: 'ComparisonError',
        },
      ],
      health: {
        status: 'Progressing',
      },
      operationState: {
        finishedAt: '2023-07-24T10:52:03Z',
        message: 'successfully synced (all tasks run)',
        operation: {
          initiatedBy: {
            automated: true,
          },
          retry: {
            backoff: {
              duration: '5s',
              factor: 2,
              maxDuration: '3m',
            },
            limit: -1,
          },
          sync: {
            prune: true,
            revision: '7ee2ff4ab4e85512bf0cf5e6847e09eb4ff0033a',
            syncOptions: ['PrunePropagationPolicy=background'],
          },
        },
        phase: 'Succeeded',
        startedAt: '2023-07-24T10:52:01Z',
        syncResult: {
          resources: [
            {
              syncPhase: 'Sync',
              message: 'service/human-resources configured',
              name: 'human-resources',
              status: 'Synced',
              kind: 'Service',
              version: 'v1',
              hookPhase: 'Running',
              namespace: 'test-ns',
              group: '',
            },
            {
              syncPhase: 'Sync',
              message: 'deployment.apps/human-resources configured',
              name: 'human-resources',
              status: 'Synced',
              kind: 'Deployment',
              version: 'v1',
              hookPhase: 'Running',
              namespace: 'test-ns',
              group: 'apps',
            },
            {
              syncPhase: 'Sync',
              message: 'route.route.openshift.io/human-resources0khq unchanged',
              name: 'human-resources0khq',
              status: 'Synced',
              kind: 'Route',
              version: 'v1',
              hookPhase: 'Running',
              namespace: 'test-ns',
              group: 'route.openshift.io',
            },
          ],
          revision: '7ee2ff4ab4e85512bf0cf5e6847e09eb4ff0033a',
          source: {
            path: 'components/human-resources/overlays/development',
            repoURL:
              'https://github.com/redhat-appstudio-appdata-staging/test-application-p0QHj-travel-break',
            targetRevision: 'main',
          },
        },
      },
      reconciledState: {
        destination: {
          name: '',
          namespace: 'test-ns',
        },
        source: {
          branch: 'main',
          path: 'components/human-resources/overlays/development',
          repoURL:
            'https://github.com/redhat-appstudio-appdata-staging/test-application-p0QHj-travel-break',
        },
      },
      resources: [
        {
          health: {
            status: 'Healthy',
          },
          kind: 'Service',
          name: 'human-resources',
          namespace: 'test-ns',
          status: 'Unknown',
          version: 'v1',
        },
        {
          group: 'apps',
          health: {
            message: 'Waiting for rollout to finish: 0 of 1 updated replicas are available...',
            status: 'Progressing',
          },
          kind: 'Deployment',
          name: 'human-resources',
          namespace: 'test-ns',
          status: 'Unknown',
          version: 'v1',
        },
        {
          group: 'route.openshift.io',
          health: {
            message: 'Route is healthy',
            status: 'Healthy',
          },
          kind: 'Route',
          name: 'human-resources0khq',
          namespace: 'test-ns',
          status: 'Unknown',
          version: 'v1',
        },
      ],
      sync: {
        status: 'Unknown',
      },
    },
  },
  {
    apiVersion: 'managed-gitops.redhat.com/v1alpha1',
    kind: 'GitOpsDeployment',
    metadata: {
      resourceVersion: '551596313',
      name: 'test-application-staging-binding-7hh2j-test-application-staging-human-resources',
      uid: '7c24ffb7-2f3f-4052-aa1b-6e720ec37095',
      creationTimestamp: '2023-07-20T15:09:25Z',
      generation: 1,
      namespace: 'test-ns',
      labels: {
        'appstudio.openshift.io/application': 'test-application',
        'appstudio.openshift.io/component': 'human-resources',
        'appstudio.openshift.io/environment': 'staging',
      },
    },
    spec: {
      destination: {
        environment: 'managed-environment-staging',
        namespace: 'test-ns',
      },
      source: {
        path: 'components/human-resources/overlays/staging',
        repoURL:
          'https://github.com/redhat-appstudio-appdata-staging/test-application-p0QHj-travel-break',
        targetRevision: 'main',
      },
      type: 'automated',
    },
    status: {
      conditions: [
        {
          lastProbeTime: '2023-08-10T15:28:14Z',
          lastTransitionTime: '2023-07-24T10:25:49Z',
          message:
            'unable to reconcile the ManagedEnvironment resource. Ensure that the ManagedEnvironment exists, it references a Secret, and the Secret is valid',
          reason: 'ErrorOccurred',
          status: 'True',
          type: 'ErrorOccurred',
        },
      ],
      health: {
        status: 'Healthy',
      },
      operationState: {
        finishedAt: '2023-07-20T15:09:53Z',
        message: 'successfully synced (all tasks run)',
        operation: {
          initiatedBy: {
            automated: true,
          },
          retry: {
            backoff: {
              duration: '5s',
              factor: 2,
              maxDuration: '3m',
            },
            limit: -1,
          },
          sync: {
            prune: true,
            revision: '54e3b4e01cfb0417dd77582658bd4c3fd080940d',
            syncOptions: ['PrunePropagationPolicy=background'],
          },
        },
        phase: 'Succeeded',
        startedAt: '2023-07-20T15:09:47Z',
        syncResult: {
          resources: [
            {
              syncPhase: 'Sync',
              message: 'service/human-resources created',
              name: 'human-resources',
              status: 'Synced',
              kind: 'Service',
              version: 'v1',
              hookPhase: 'Running',
              namespace: 'test-ns',
              group: '',
            },
            {
              syncPhase: 'Sync',
              message: 'deployment.apps/human-resources created',
              name: 'human-resources',
              status: 'Synced',
              kind: 'Deployment',
              version: 'v1',
              hookPhase: 'Running',
              namespace: 'test-ns',
              group: 'apps',
            },
            {
              syncPhase: 'Sync',
              message: 'route.route.openshift.io/human-resourcesi1a6 created',
              name: 'human-resourcesi1a6',
              status: 'Synced',
              kind: 'Route',
              version: 'v1',
              hookPhase: 'Running',
              namespace: 'test-ns',
              group: 'route.openshift.io',
            },
          ],
          revision: '54e3b4e01cfb0417dd77582658bd4c3fd080940d',
          source: {
            path: 'components/human-resources/overlays/staging',
            repoURL:
              'https://github.com/redhat-appstudio-appdata-staging/test-application-p0QHj-travel-break',
            targetRevision: 'main',
          },
        },
      },
      reconciledState: {
        destination: {
          name: 'managed-environment-staging',
          namespace: 'test-ns',
        },
        source: {
          branch: 'main',
          path: 'components/human-resources/overlays/staging',
          repoURL:
            'https://github.com/redhat-appstudio-appdata-staging/test-application-p0QHj-travel-break',
        },
      },
      sync: {
        status: 'Unknown',
      },
    },
  },
  {
    apiVersion: 'managed-gitops.redhat.com/v1alpha1',
    kind: 'GitOpsDeployment',
    metadata: {
      resourceVersion: '551597048',
      name: 'my-test-app-development-binding-9wrdw-my-test-app-development-react-topology-ujs8',
      uid: '0d60f7d4-4c60-4fff-b5de-bf5fd2c712a7',
      creationTimestamp: '2023-07-21T09:42:06Z',
      generation: 1,
      namespace: 'test-ns',
      labels: {
        'appstudio.openshift.io/application': 'my-test-app',
        'appstudio.openshift.io/component': 'react-topology-ujs8',
        'appstudio.openshift.io/environment': 'development',
      },
    },
    spec: {
      destination: {},
      source: {
        path: 'components/react-topology-ujs8/overlays/development',
        repoURL:
          'https://github.com/redhat-appstudio-appdata-staging/my-test-app-p0QHj-marry-promise',
        targetRevision: 'main',
      },
      type: 'automated',
    },
    status: {
      conditions: [
        {
          lastProbeTime: '2023-08-10T15:28:27Z',
          lastTransitionTime: '2023-08-10T15:15:47Z',
          message:
            'rpc error: code = Unknown desc = Manifest generation error (cached): `kustomize build .components/react-topology-ujs8/overlays/development` failed exit status 1: Error: invalid Kustomization: json: cannot unmarshal string into Go struct field Kustomization.patches of type types.Patch',
          reason: 'ComparisonError',
          status: 'True',
          type: 'ComparisonError',
        },
      ],
      health: {
        status: 'Progressing',
      },
      operationState: {
        finishedAt: '2023-07-21T10:01:27Z',
        message: 'successfully synced (all tasks run)',
        operation: {
          initiatedBy: {
            automated: true,
          },
          retry: {
            backoff: {
              duration: '5s',
              factor: 2,
              maxDuration: '3m',
            },
            limit: -1,
          },
          sync: {
            prune: true,
            revision: 'c8fee97a278971322126c3c068369528137f39fe',
            syncOptions: ['PrunePropagationPolicy=background'],
          },
        },
        phase: 'Succeeded',
        startedAt: '2023-07-21T10:01:21Z',
        syncResult: {
          resources: [
            {
              syncPhase: 'Sync',
              message: 'service/react-topology-ujs8 created',
              name: 'react-topology-ujs8',
              status: 'Synced',
              kind: 'Service',
              version: 'v1',
              hookPhase: 'Running',
              namespace: 'test-ns',
              group: '',
            },
            {
              syncPhase: 'Sync',
              message: 'deployment.apps/react-topology-ujs8 created',
              name: 'react-topology-ujs8',
              status: 'Synced',
              kind: 'Deployment',
              version: 'v1',
              hookPhase: 'Running',
              namespace: 'test-ns',
              group: 'apps',
            },
            {
              syncPhase: 'Sync',
              message: 'route.route.openshift.io/react-topology-ujs8s5ry created',
              name: 'react-topology-ujs8s5ry',
              status: 'Synced',
              kind: 'Route',
              version: 'v1',
              hookPhase: 'Running',
              namespace: 'test-ns',
              group: 'route.openshift.io',
            },
          ],
          revision: 'c8fee97a278971322126c3c068369528137f39fe',
          source: {
            path: 'components/react-topology-ujs8/overlays/development',
            repoURL:
              'https://github.com/redhat-appstudio-appdata-staging/my-test-app-p0QHj-marry-promise',
            targetRevision: 'main',
          },
        },
      },
      reconciledState: {
        destination: {
          name: '',
          namespace: 'test-ns',
        },
        source: {
          branch: 'main',
          path: 'components/react-topology-ujs8/overlays/development',
          repoURL:
            'https://github.com/redhat-appstudio-appdata-staging/my-test-app-p0QHj-marry-promise',
        },
      },
      resources: [
        {
          health: {
            status: 'Healthy',
          },
          kind: 'Service',
          name: 'react-topology-ujs8',
          namespace: 'test-ns',
          status: 'Unknown',
          version: 'v1',
        },
        {
          group: 'apps',
          health: {
            message: 'Waiting for rollout to finish: 0 of 1 updated replicas are available...',
            status: 'Progressing',
          },
          kind: 'Deployment',
          name: 'react-topology-ujs8',
          namespace: 'test-ns',
          status: 'Unknown',
          version: 'v1',
        },
        {
          group: 'route.openshift.io',
          health: {
            message: 'Route is healthy',
            status: 'Healthy',
          },
          kind: 'Route',
          name: 'react-topology-ujs8s5ry',
          namespace: 'test-ns',
          status: 'Unknown',
          version: 'v1',
        },
      ],
      sync: {
        status: 'Unknown',
      },
    },
  },
  {
    apiVersion: 'managed-gitops.redhat.com/v1alpha1',
    kind: 'GitOpsDeployment',
    metadata: {
      resourceVersion: '551595802',
      name: 'test-app-1-staging-binding-8j7ml-test-app-1-staging-react-topology',
      uid: '7ab85073-ecf1-423b-a0f0-e1b35ce2533e',
      creationTimestamp: '2023-07-21T09:43:09Z',
      generation: 1,
      namespace: 'test-ns',
      labels: {
        'appstudio.openshift.io/application': 'test-app-1',
        'appstudio.openshift.io/component': 'react-topology',
        'appstudio.openshift.io/environment': 'staging',
      },
    },
    spec: {
      destination: {
        environment: 'managed-environment-staging',
        namespace: 'test-ns',
      },
      source: {
        path: 'components/react-topology/overlays/staging',
        repoURL: 'https://github.com/redhat-appstudio-appdata-staging/test-app-1-p0QHj-play-differ',
        targetRevision: 'main',
      },
      type: 'automated',
    },
    status: {
      conditions: [
        {
          lastProbeTime: '2023-08-10T15:28:03Z',
          lastTransitionTime: '2023-07-21T09:43:09Z',
          message:
            'Unable to reconcile the ManagedEnvironment. Verify that the ManagedEnvironment and Secret are correctly defined, and have valid credentials',
          reason: 'ErrorOccurred',
          status: 'True',
          type: 'ErrorOccurred',
        },
      ],
      health: {},
      reconciledState: {
        destination: {
          name: '',
          namespace: '',
        },
        source: {
          branch: '',
          path: '',
          repoURL: '',
        },
      },
      sync: {
        status: '',
      },
    },
  },
  {
    apiVersion: 'managed-gitops.redhat.com/v1alpha1',
    kind: 'GitOpsDeployment',
    metadata: {
      resourceVersion: '551596489',
      name: 'test-application-staging-binding-7hh2j-test-application-staging-python-app-multi-components-repo',
      uid: '06bb9ec2-a038-4bb5-a102-c05bab45ea1c',
      creationTimestamp: '2023-07-20T15:09:25Z',
      generation: 1,
      namespace: 'test-ns',
      labels: {
        'appstudio.openshift.io/application': 'test-application',
        'appstudio.openshift.io/component': 'python-app-multi-components-repo',
        'appstudio.openshift.io/environment': 'staging',
      },
    },
    spec: {
      destination: {
        environment: 'managed-environment-staging',
        namespace: 'test-ns',
      },
      source: {
        path: 'components/python-app-multi-components-repo/overlays/staging',
        repoURL:
          'https://github.com/redhat-appstudio-appdata-staging/test-application-p0QHj-travel-break',
        targetRevision: 'main',
      },
      type: 'automated',
    },
    status: {
      conditions: [
        {
          lastProbeTime: '2023-08-10T15:28:18Z',
          lastTransitionTime: '2023-07-24T10:25:47Z',
          message:
            'unable to reconcile the ManagedEnvironment resource. Ensure that the ManagedEnvironment exists, it references a Secret, and the Secret is valid',
          reason: 'ErrorOccurred',
          status: 'True',
          type: 'ErrorOccurred',
        },
      ],
      health: {
        status: 'Healthy',
      },
      operationState: {
        finishedAt: '2023-07-20T15:09:53Z',
        message: 'successfully synced (all tasks run)',
        operation: {
          initiatedBy: {
            automated: true,
          },
          retry: {
            backoff: {
              duration: '5s',
              factor: 2,
              maxDuration: '3m',
            },
            limit: -1,
          },
          sync: {
            prune: true,
            revision: '54e3b4e01cfb0417dd77582658bd4c3fd080940d',
            syncOptions: ['PrunePropagationPolicy=background'],
          },
        },
        phase: 'Succeeded',
        startedAt: '2023-07-20T15:09:47Z',
        syncResult: {
          resources: [
            {
              syncPhase: 'Sync',
              message: 'service/python-app-multi-components-repo created',
              name: 'python-app-multi-components-repo',
              status: 'Synced',
              kind: 'Service',
              version: 'v1',
              hookPhase: 'Running',
              namespace: 'test-ns',
              group: '',
            },
            {
              syncPhase: 'Sync',
              message: 'deployment.apps/python-app-multi-components-repo created',
              name: 'python-app-multi-components-repo',
              status: 'Synced',
              kind: 'Deployment',
              version: 'v1',
              hookPhase: 'Running',
              namespace: 'test-ns',
              group: 'apps',
            },
            {
              syncPhase: 'Sync',
              message: 'route.route.openshift.io/python-app-multi-componen0plz created',
              name: 'python-app-multi-componen0plz',
              status: 'Synced',
              kind: 'Route',
              version: 'v1',
              hookPhase: 'Running',
              namespace: 'test-ns',
              group: 'route.openshift.io',
            },
          ],
          revision: '54e3b4e01cfb0417dd77582658bd4c3fd080940d',
          source: {
            path: 'components/python-app-multi-components-repo/overlays/staging',
            repoURL:
              'https://github.com/redhat-appstudio-appdata-staging/test-application-p0QHj-travel-break',
            targetRevision: 'main',
          },
        },
      },
      reconciledState: {
        destination: {
          name: 'managed-environment-staging',
          namespace: 'test-ns',
        },
        source: {
          branch: 'main',
          path: 'components/python-app-multi-components-repo/overlays/staging',
          repoURL:
            'https://github.com/redhat-appstudio-appdata-staging/test-application-p0QHj-travel-break',
        },
      },
      sync: {
        status: 'Unknown',
      },
    },
  },
  {
    apiVersion: 'managed-gitops.redhat.com/v1alpha1',
    kind: 'GitOpsDeployment',
    metadata: {
      resourceVersion: '551596363',
      name: 'test-application-development-binding-fgr78-test-application-development-pacman-ccgs',
      uid: '956889ee-7622-4641-b01e-72963e0f0c6f',
      creationTimestamp: '2023-07-13T11:48:26Z',
      generation: 1,
      namespace: 'test-ns',
      labels: {
        'appstudio.openshift.io/application': 'test-application',
        'appstudio.openshift.io/component': 'pacman-ccgs',
        'appstudio.openshift.io/environment': 'development',
      },
    },
    spec: {
      destination: {},
      source: {
        path: 'components/pacman-ccgs/overlays/development',
        repoURL:
          'https://github.com/redhat-appstudio-appdata-staging/test-application-p0QHj-travel-break',
        targetRevision: 'main',
      },
      type: 'automated',
    },
    status: {
      conditions: [
        {
          lastProbeTime: '2023-08-10T15:28:15Z',
          lastTransitionTime: '2023-08-10T15:20:29Z',
          message:
            'rpc error: code = Unknown desc = Manifest generation error (cached): `kustomize build .components/pacman-ccgs/overlays/development` failed exit status 1: Error: invalid Kustomization: json: cannot unmarshal string into Go struct field Kustomization.patches of type types.Patch',
          reason: 'ComparisonError',
          status: 'True',
          type: 'ComparisonError',
        },
      ],
      health: {
        status: 'Healthy',
      },
      operationState: {
        finishedAt: '2023-07-20T15:20:36Z',
        message: 'successfully synced (all tasks run)',
        operation: {
          initiatedBy: {
            automated: true,
          },
          retry: {
            backoff: {
              duration: '5s',
              factor: 2,
              maxDuration: '3m',
            },
            limit: -1,
          },
          sync: {
            prune: true,
            revision: '3b53df995e4503048491e5db0ca0ccc1285634af',
            syncOptions: ['PrunePropagationPolicy=background'],
          },
        },
        phase: 'Succeeded',
        startedAt: '2023-07-20T15:20:27Z',
        syncResult: {
          resources: [
            {
              syncPhase: 'Sync',
              message: 'service/pacman-ccgs configured',
              name: 'pacman-ccgs',
              status: 'Synced',
              kind: 'Service',
              version: 'v1',
              hookPhase: 'Running',
              namespace: 'test-ns',
              group: '',
            },
            {
              syncPhase: 'Sync',
              message: 'deployment.apps/pacman-ccgs configured',
              name: 'pacman-ccgs',
              status: 'Synced',
              kind: 'Deployment',
              version: 'v1',
              hookPhase: 'Running',
              namespace: 'test-ns',
              group: 'apps',
            },
            {
              syncPhase: 'Sync',
              message: 'route.route.openshift.io/pacman-ccgsxilk unchanged',
              name: 'pacman-ccgsxilk',
              status: 'Synced',
              kind: 'Route',
              version: 'v1',
              hookPhase: 'Running',
              namespace: 'test-ns',
              group: 'route.openshift.io',
            },
          ],
          revision: '3b53df995e4503048491e5db0ca0ccc1285634af',
          source: {
            path: 'components/pacman-ccgs/overlays/development',
            repoURL:
              'https://github.com/redhat-appstudio-appdata-staging/test-application-p0QHj-travel-break',
            targetRevision: 'main',
          },
        },
      },
      reconciledState: {
        destination: {
          name: '',
          namespace: 'test-ns',
        },
        source: {
          branch: 'main',
          path: 'components/pacman-ccgs/overlays/development',
          repoURL:
            'https://github.com/redhat-appstudio-appdata-staging/test-application-p0QHj-travel-break',
        },
      },
      resources: [
        {
          health: {
            status: 'Healthy',
          },
          kind: 'Service',
          name: 'pacman-ccgs',
          namespace: 'test-ns',
          status: 'Unknown',
          version: 'v1',
        },
        {
          group: 'apps',
          health: {
            status: 'Healthy',
          },
          kind: 'Deployment',
          name: 'pacman-ccgs',
          namespace: 'test-ns',
          status: 'Unknown',
          version: 'v1',
        },
        {
          group: 'route.openshift.io',
          health: {
            message: 'Route is healthy',
            status: 'Healthy',
          },
          kind: 'Route',
          name: 'pacman-ccgsxilk',
          namespace: 'test-ns',
          status: 'Unknown',
          version: 'v1',
        },
      ],
      sync: {
        status: 'Unknown',
      },
    },
  },
  {
    apiVersion: 'managed-gitops.redhat.com/v1alpha1',
    kind: 'GitOpsDeployment',
    metadata: {
      resourceVersion: '551596594',
      name: 'second-application-development-binding-djqwn-second-application-development-pacman-qzqe',
      uid: '87306bd0-f4a8-475f-9018-91f6653640d1',
      creationTimestamp: '2023-07-21T09:42:05Z',
      generation: 1,
      namespace: 'test-ns',
      labels: {
        'appstudio.openshift.io/application': 'second-application',
        'appstudio.openshift.io/component': 'pacman-qzqe',
        'appstudio.openshift.io/environment': 'development',
      },
    },
    spec: {
      destination: {},
      source: {
        path: 'components/pacman-qzqe/overlays/development',
        repoURL:
          'https://github.com/redhat-appstudio-appdata-staging/second-application-p0QHj-resist-satisfy',
        targetRevision: 'main',
      },
      type: 'automated',
    },
    status: {
      conditions: [
        {
          lastProbeTime: '2023-08-10T15:28:20Z',
          lastTransitionTime: '2023-08-10T15:19:45Z',
          message:
            'rpc error: code = Unknown desc = Manifest generation error (cached): `kustomize build .components/pacman-qzqe/overlays/development` failed exit status 1: Error: invalid Kustomization: json: cannot unmarshal string into Go struct field Kustomization.patches of type types.Patch',
          reason: 'ComparisonError',
          status: 'True',
          type: 'ComparisonError',
        },
      ],
      health: {
        status: 'Healthy',
      },
      operationState: {
        finishedAt: '2023-07-24T10:52:04Z',
        message: 'successfully synced (all tasks run)',
        operation: {
          initiatedBy: {
            automated: true,
          },
          retry: {
            backoff: {
              duration: '5s',
              factor: 2,
              maxDuration: '3m',
            },
            limit: -1,
          },
          sync: {
            prune: true,
            revision: 'ccc9a1bfdc1b7f68501654fcd5309ab9b9983bee',
            syncOptions: ['PrunePropagationPolicy=background'],
          },
        },
        phase: 'Succeeded',
        startedAt: '2023-07-24T10:52:02Z',
        syncResult: {
          resources: [
            {
              syncPhase: 'Sync',
              message: 'service/pacman-qzqe configured',
              name: 'pacman-qzqe',
              status: 'Synced',
              kind: 'Service',
              version: 'v1',
              hookPhase: 'Running',
              namespace: 'test-ns',
              group: '',
            },
            {
              syncPhase: 'Sync',
              message: 'deployment.apps/pacman-qzqe configured',
              name: 'pacman-qzqe',
              status: 'Synced',
              kind: 'Deployment',
              version: 'v1',
              hookPhase: 'Running',
              namespace: 'test-ns',
              group: 'apps',
            },
            {
              syncPhase: 'Sync',
              message: 'route.route.openshift.io/pacman-qzqetav8 unchanged',
              name: 'pacman-qzqetav8',
              status: 'Synced',
              kind: 'Route',
              version: 'v1',
              hookPhase: 'Running',
              namespace: 'test-ns',
              group: 'route.openshift.io',
            },
          ],
          revision: 'ccc9a1bfdc1b7f68501654fcd5309ab9b9983bee',
          source: {
            path: 'components/pacman-qzqe/overlays/development',
            repoURL:
              'https://github.com/redhat-appstudio-appdata-staging/second-application-p0QHj-resist-satisfy',
            targetRevision: 'main',
          },
        },
      },
      reconciledState: {
        destination: {
          name: '',
          namespace: 'test-ns',
        },
        source: {
          branch: 'main',
          path: 'components/pacman-qzqe/overlays/development',
          repoURL:
            'https://github.com/redhat-appstudio-appdata-staging/second-application-p0QHj-resist-satisfy',
        },
      },
      resources: [
        {
          health: {
            status: 'Healthy',
          },
          kind: 'Service',
          name: 'pacman-qzqe',
          namespace: 'test-ns',
          status: 'Unknown',
          version: 'v1',
        },
        {
          group: 'apps',
          health: {
            status: 'Healthy',
          },
          kind: 'Deployment',
          name: 'pacman-qzqe',
          namespace: 'test-ns',
          status: 'Unknown',
          version: 'v1',
        },
        {
          group: 'route.openshift.io',
          health: {
            message: 'Route is healthy',
            status: 'Healthy',
          },
          kind: 'Route',
          name: 'pacman-qzqetav8',
          namespace: 'test-ns',
          status: 'Unknown',
          version: 'v1',
        },
      ],
      sync: {
        status: 'Unknown',
      },
    },
  },
  {
    apiVersion: 'managed-gitops.redhat.com/v1alpha1',
    kind: 'GitOpsDeployment',
    metadata: {
      resourceVersion: '551597087',
      name: 'test-application-development-binding-fgr78-test-application-development-python-app-multi-components-repo',
      uid: '34edf6b5-775c-4f79-bafa-ae3e8956223a',
      creationTimestamp: '2023-07-06T15:14:09Z',
      generation: 1,
      namespace: 'test-ns',
      labels: {
        'appstudio.openshift.io/application': 'test-application',
        'appstudio.openshift.io/component': 'python-app-multi-components-repo',
        'appstudio.openshift.io/environment': 'development',
      },
    },
    spec: {
      destination: {},
      source: {
        path: 'components/python-app-multi-components-repo/overlays/development',
        repoURL:
          'https://github.com/redhat-appstudio-appdata-staging/test-application-p0QHj-travel-break',
        targetRevision: 'main',
      },
      type: 'automated',
    },
    status: {
      conditions: [
        {
          lastProbeTime: '2023-08-10T15:28:28Z',
          lastTransitionTime: '2023-08-10T15:13:45Z',
          message:
            'rpc error: code = Unknown desc = Manifest generation error (cached): `kustomize build .components/python-app-multi-components-repo/overlays/development` failed exit status 1: Error: invalid Kustomization: json: cannot unmarshal string into Go struct field Kustomization.patches of type types.Patch',
          reason: 'ComparisonError',
          status: 'True',
          type: 'ComparisonError',
        },
      ],
      health: {
        status: 'Progressing',
      },
      operationState: {
        finishedAt: '2023-07-11T19:58:02Z',
        message: 'successfully synced (all tasks run)',
        operation: {
          initiatedBy: {
            automated: true,
          },
          retry: {
            backoff: {
              duration: '5s',
              factor: 2,
              maxDuration: '3m',
            },
            limit: -1,
          },
          sync: {
            prune: true,
            revision: '9a2fab6ebb68bd454f419d22ad0f85e7d559396b',
            syncOptions: ['PrunePropagationPolicy=background'],
          },
        },
        phase: 'Succeeded',
        startedAt: '2023-07-11T19:58:00Z',
        syncResult: {
          resources: [
            {
              syncPhase: 'Sync',
              message: 'pruned',
              name: 'python-app-multi-componenjjlz',
              status: 'Pruned',
              kind: 'Route',
              version: 'v1',
              hookPhase: 'Succeeded',
              namespace: 'test-ns',
              group: 'route.openshift.io',
            },
            {
              syncPhase: 'Sync',
              message: 'service/python-app-multi-components-repo configured',
              name: 'python-app-multi-components-repo',
              status: 'Synced',
              kind: 'Service',
              version: 'v1',
              hookPhase: 'Running',
              namespace: 'test-ns',
              group: '',
            },
            {
              syncPhase: 'Sync',
              message: 'deployment.apps/python-app-multi-components-repo unchanged',
              name: 'python-app-multi-components-repo',
              status: 'Synced',
              kind: 'Deployment',
              version: 'v1',
              hookPhase: 'Running',
              namespace: 'test-ns',
              group: 'apps',
            },
            {
              syncPhase: 'Sync',
              message: 'route.route.openshift.io/python-app-multi-componenrfl5 created',
              name: 'python-app-multi-componenrfl5',
              status: 'Synced',
              kind: 'Route',
              version: 'v1',
              hookPhase: 'Running',
              namespace: 'test-ns',
              group: 'route.openshift.io',
            },
          ],
          revision: '9a2fab6ebb68bd454f419d22ad0f85e7d559396b',
          source: {
            path: 'components/python-app-multi-components-repo/overlays/development',
            repoURL:
              'https://github.com/redhat-appstudio-appdata-staging/test-application-p0QHj-travel-break',
            targetRevision: 'main',
          },
        },
      },
      reconciledState: {
        destination: {
          name: '',
          namespace: 'test-ns',
        },
        source: {
          branch: 'main',
          path: 'components/python-app-multi-components-repo/overlays/development',
          repoURL:
            'https://github.com/redhat-appstudio-appdata-staging/test-application-p0QHj-travel-break',
        },
      },
      resources: [
        {
          health: {
            status: 'Healthy',
          },
          kind: 'Service',
          name: 'python-app-multi-components-repo',
          namespace: 'test-ns',
          status: 'Unknown',
          version: 'v1',
        },
        {
          group: 'apps',
          health: {
            message: 'Waiting for rollout to finish: 0 of 1 updated replicas are available...',
            status: 'Progressing',
          },
          kind: 'Deployment',
          name: 'python-app-multi-components-repo',
          namespace: 'test-ns',
          status: 'Unknown',
          version: 'v1',
        },
        {
          group: 'route.openshift.io',
          health: {
            message: 'Route is healthy',
            status: 'Healthy',
          },
          kind: 'Route',
          name: 'python-app-multi-componenrfl5',
          namespace: 'test-ns',
          status: 'Unknown',
          version: 'v1',
        },
      ],
      sync: {
        status: 'Unknown',
      },
    },
  },
  {
    apiVersion: 'managed-gitops.redhat.com/v1alpha1',
    kind: 'GitOpsDeployment',
    metadata: {
      resourceVersion: '551596283',
      name: 'test-application-staging-binding-7hh2j-test-application-staging-pacman-ccgs',
      uid: '7ce13e33-4bbb-41bb-950e-f39cb10f871f',
      creationTimestamp: '2023-07-20T15:09:25Z',
      generation: 1,
      namespace: 'test-ns',
      labels: {
        'appstudio.openshift.io/application': 'test-application',
        'appstudio.openshift.io/component': 'pacman-ccgs',
        'appstudio.openshift.io/environment': 'staging',
      },
    },
    spec: {
      destination: {
        environment: 'managed-environment-staging',
        namespace: 'test-ns',
      },
      source: {
        path: 'components/pacman-ccgs/overlays/staging',
        repoURL:
          'https://github.com/redhat-appstudio-appdata-staging/test-application-p0QHj-travel-break',
        targetRevision: 'main',
      },
      type: 'automated',
    },
    status: {
      conditions: [
        {
          lastProbeTime: '2023-08-10T15:28:13Z',
          lastTransitionTime: '2023-07-24T10:25:48Z',
          message:
            'unable to reconcile the ManagedEnvironment resource. Ensure that the ManagedEnvironment exists, it references a Secret, and the Secret is valid',
          reason: 'ErrorOccurred',
          status: 'True',
          type: 'ErrorOccurred',
        },
      ],
      health: {
        status: 'Healthy',
      },
      operationState: {
        finishedAt: '2023-07-20T15:19:30Z',
        message: 'successfully synced (all tasks run)',
        operation: {
          initiatedBy: {
            automated: true,
          },
          retry: {
            backoff: {
              duration: '5s',
              factor: 2,
              maxDuration: '3m',
            },
            limit: -1,
          },
          sync: {
            prune: true,
            revision: '3b53df995e4503048491e5db0ca0ccc1285634af',
            syncOptions: ['PrunePropagationPolicy=background'],
          },
        },
        phase: 'Succeeded',
        startedAt: '2023-07-20T15:19:28Z',
        syncResult: {
          resources: [
            {
              syncPhase: 'Sync',
              message: 'service/pacman-ccgs configured',
              name: 'pacman-ccgs',
              status: 'Synced',
              kind: 'Service',
              version: 'v1',
              hookPhase: 'Running',
              namespace: 'test-ns',
              group: '',
            },
            {
              syncPhase: 'Sync',
              message: 'deployment.apps/pacman-ccgs configured',
              name: 'pacman-ccgs',
              status: 'Synced',
              kind: 'Deployment',
              version: 'v1',
              hookPhase: 'Running',
              namespace: 'test-ns',
              group: 'apps',
            },
            {
              syncPhase: 'Sync',
              message: 'route.route.openshift.io/pacman-ccgscro0 unchanged',
              name: 'pacman-ccgscro0',
              status: 'Synced',
              kind: 'Route',
              version: 'v1',
              hookPhase: 'Running',
              namespace: 'test-ns',
              group: 'route.openshift.io',
            },
          ],
          revision: '3b53df995e4503048491e5db0ca0ccc1285634af',
          source: {
            path: 'components/pacman-ccgs/overlays/staging',
            repoURL:
              'https://github.com/redhat-appstudio-appdata-staging/test-application-p0QHj-travel-break',
            targetRevision: 'main',
          },
        },
      },
      reconciledState: {
        destination: {
          name: 'managed-environment-staging',
          namespace: 'test-ns',
        },
        source: {
          branch: 'main',
          path: 'components/pacman-ccgs/overlays/staging',
          repoURL:
            'https://github.com/redhat-appstudio-appdata-staging/test-application-p0QHj-travel-break',
        },
      },
      sync: {
        status: 'Unknown',
      },
    },
  },
  {
    apiVersion: 'managed-gitops.redhat.com/v1alpha1',
    kind: 'GitOpsDeployment',
    metadata: {
      resourceVersion: '551595814',
      name: 'test-application-staging-binding-7hh2j-test-application-staging-devfile-sample-go-basic-fj5r',
      uid: '72910553-1092-4969-9368-7a4652b94a3f',
      creationTimestamp: '2023-07-20T15:09:25Z',
      generation: 1,
      namespace: 'test-ns',
      ownerReferences: [
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          blockOwnerDeletion: true,
          controller: true,
          kind: 'SnapshotEnvironmentBinding',
          name: 'test-application-staging-binding-7hh2j',
          uid: 'a1db7266-8048-465e-9c16-9365a2959b19',
        },
      ],
      labels: {
        'appstudio.openshift.io/application': 'test-application',
        'appstudio.openshift.io/component': 'devfile-sample-go-basic-fj5r',
        'appstudio.openshift.io/environment': 'staging',
      },
    },
    spec: {
      destination: {
        environment: 'managed-environment-staging',
        namespace: 'test-ns',
      },
      source: {
        path: 'components/devfile-sample-go-basic-fj5r/overlays/staging',
        repoURL:
          'https://github.com/redhat-appstudio-appdata-staging/test-application-p0QHj-travel-break',
        targetRevision: 'main',
      },
      type: 'automated',
    },
    status: {
      conditions: [
        {
          lastProbeTime: '2023-08-10T15:28:03Z',
          lastTransitionTime: '2023-07-24T10:25:49Z',
          message:
            'unable to reconcile the ManagedEnvironment resource. Ensure that the ManagedEnvironment exists, it references a Secret, and the Secret is valid',
          reason: 'ErrorOccurred',
          status: 'True',
          type: 'ErrorOccurred',
        },
      ],
      health: {
        status: 'Healthy',
      },
      operationState: {
        finishedAt: '2023-07-20T15:09:53Z',
        message: 'successfully synced (all tasks run)',
        operation: {
          initiatedBy: {
            automated: true,
          },
          retry: {
            backoff: {
              duration: '5s',
              factor: 2,
              maxDuration: '3m',
            },
            limit: -1,
          },
          sync: {
            prune: true,
            revision: '54e3b4e01cfb0417dd77582658bd4c3fd080940d',
            syncOptions: ['PrunePropagationPolicy=background'],
          },
        },
        phase: 'Succeeded',
        startedAt: '2023-07-20T15:09:47Z',
        syncResult: {
          resources: [
            {
              syncPhase: 'Sync',
              message: 'service/devfile-sample-go-basic-fj5r created',
              name: 'devfile-sample-go-basic-fj5r',
              status: 'Synced',
              kind: 'Service',
              version: 'v1',
              hookPhase: 'Running',
              namespace: 'test-ns',
              group: '',
            },
            {
              syncPhase: 'Sync',
              message: 'deployment.apps/devfile-sample-go-basic-fj5r created',
              name: 'devfile-sample-go-basic-fj5r',
              status: 'Synced',
              kind: 'Deployment',
              version: 'v1',
              hookPhase: 'Running',
              namespace: 'test-ns',
              group: 'apps',
            },
            {
              syncPhase: 'Sync',
              message: 'route.route.openshift.io/devfile-sample-go-basic-frw8z created',
              name: 'devfile-sample-go-basic-frw8z',
              status: 'Synced',
              kind: 'Route',
              version: 'v1',
              hookPhase: 'Running',
              namespace: 'test-ns',
              group: 'route.openshift.io',
            },
          ],
          revision: '54e3b4e01cfb0417dd77582658bd4c3fd080940d',
          source: {
            path: 'components/devfile-sample-go-basic-fj5r/overlays/staging',
            repoURL:
              'https://github.com/redhat-appstudio-appdata-staging/test-application-p0QHj-travel-break',
            targetRevision: 'main',
          },
        },
      },
      reconciledState: {
        destination: {
          name: 'managed-environment-staging',
          namespace: 'test-ns',
        },
        source: {
          branch: 'main',
          path: 'components/devfile-sample-go-basic-fj5r/overlays/staging',
          repoURL:
            'https://github.com/redhat-appstudio-appdata-staging/test-application-p0QHj-travel-break',
        },
      },
      sync: {
        status: 'Unknown',
      },
    },
  },
  {
    apiVersion: 'managed-gitops.redhat.com/v1alpha1',
    kind: 'GitOpsDeployment',
    metadata: {
      resourceVersion: '551596296',
      name: 'second-application-staging-binding-l9ptn-second-application-staging-pacman-qzqe',
      uid: '487d95c8-5c89-4c91-8fa5-0d2e85538435',
      creationTimestamp: '2023-07-21T09:42:03Z',
      generation: 1,
      namespace: 'test-ns',
      labels: {
        'appstudio.openshift.io/application': 'second-application',
        'appstudio.openshift.io/component': 'pacman-qzqe',
        'appstudio.openshift.io/environment': 'staging',
      },
    },
    spec: {
      destination: {
        environment: 'managed-environment-staging',
        namespace: 'test-ns',
      },
      source: {
        path: 'components/pacman-qzqe/overlays/staging',
        repoURL:
          'https://github.com/redhat-appstudio-appdata-staging/second-application-p0QHj-resist-satisfy',
        targetRevision: 'main',
      },
      type: 'automated',
    },
    status: {
      conditions: [
        {
          lastProbeTime: '2023-08-10T15:28:13Z',
          lastTransitionTime: '2023-07-21T09:42:03Z',
          message:
            'Unable to reconcile the ManagedEnvironment. Verify that the ManagedEnvironment and Secret are correctly defined, and have valid credentials',
          reason: 'ErrorOccurred',
          status: 'True',
          type: 'ErrorOccurred',
        },
      ],
      health: {},
      reconciledState: {
        destination: {
          name: '',
          namespace: '',
        },
        source: {
          branch: '',
          path: '',
          repoURL: '',
        },
      },
      sync: {
        status: '',
      },
    },
  },
  {
    apiVersion: 'managed-gitops.redhat.com/v1alpha1',
    kind: 'GitOpsDeployment',
    metadata: {
      resourceVersion: '551596616',
      name: 'test-application-development-binding-fgr78-test-application-development-devfile-sample-go-basic-fj5r',
      uid: 'e621bd8e-6eff-47ef-a0e5-f5914a368736',
      creationTimestamp: '2023-06-22T14:17:08Z',
      generation: 1,
      namespace: 'test-ns',
      labels: {
        'appstudio.openshift.io/application': 'test-application',
        'appstudio.openshift.io/component': 'devfile-sample-go-basic-fj5r',
        'appstudio.openshift.io/environment': 'development',
      },
    },
    spec: {
      destination: {},
      source: {
        path: 'components/devfile-sample-go-basic-fj5r/overlays/development',
        repoURL:
          'https://github.com/redhat-appstudio-appdata-staging/test-application-p0QHj-travel-break',
        targetRevision: 'main',
      },
      type: 'automated',
    },
    status: {
      conditions: [
        {
          lastProbeTime: '2023-08-10T15:28:20Z',
          lastTransitionTime: '2023-08-10T15:14:38Z',
          message:
            'rpc error: code = Unknown desc = Manifest generation error (cached): `kustomize build .components/devfile-sample-go-basic-fj5r/overlays/development` failed exit status 1: Error: invalid Kustomization: json: cannot unmarshal string into Go struct field Kustomization.patches of type types.Patch',
          reason: 'ComparisonError',
          status: 'True',
          type: 'ComparisonError',
        },
      ],
      health: {
        status: 'Progressing',
      },
      operationState: {
        finishedAt: '2023-07-24T10:51:31Z',
        message: 'successfully synced (all tasks run)',
        operation: {
          initiatedBy: {
            automated: true,
          },
          retry: {
            backoff: {
              duration: '5s',
              factor: 2,
              maxDuration: '3m',
            },
            limit: -1,
          },
          sync: {
            prune: true,
            revision: '7ee2ff4ab4e85512bf0cf5e6847e09eb4ff0033a',
            syncOptions: ['PrunePropagationPolicy=background'],
          },
        },
        phase: 'Succeeded',
        startedAt: '2023-07-24T10:51:31Z',
        syncResult: {
          resources: [
            {
              syncPhase: 'Sync',
              message: 'service/devfile-sample-go-basic-fj5r configured',
              name: 'devfile-sample-go-basic-fj5r',
              status: 'Synced',
              kind: 'Service',
              version: 'v1',
              hookPhase: 'Running',
              namespace: 'test-ns',
              group: '',
            },
            {
              syncPhase: 'Sync',
              message: 'deployment.apps/devfile-sample-go-basic-fj5r configured',
              name: 'devfile-sample-go-basic-fj5r',
              status: 'Synced',
              kind: 'Deployment',
              version: 'v1',
              hookPhase: 'Running',
              namespace: 'test-ns',
              group: 'apps',
            },
            {
              syncPhase: 'Sync',
              message: 'route.route.openshift.io/devfile-sample-go-basic-ff5jv unchanged',
              name: 'devfile-sample-go-basic-ff5jv',
              status: 'Synced',
              kind: 'Route',
              version: 'v1',
              hookPhase: 'Running',
              namespace: 'test-ns',
              group: 'route.openshift.io',
            },
          ],
          revision: '7ee2ff4ab4e85512bf0cf5e6847e09eb4ff0033a',
          source: {
            path: 'components/devfile-sample-go-basic-fj5r/overlays/development',
            repoURL:
              'https://github.com/redhat-appstudio-appdata-staging/test-application-p0QHj-travel-break',
            targetRevision: 'main',
          },
        },
      },
      reconciledState: {
        destination: {
          name: '',
          namespace: 'test-ns',
        },
        source: {
          branch: 'main',
          path: 'components/devfile-sample-go-basic-fj5r/overlays/development',
          repoURL:
            'https://github.com/redhat-appstudio-appdata-staging/test-application-p0QHj-travel-break',
        },
      },
      resources: [
        {
          health: {
            status: 'Healthy',
          },
          kind: 'Service',
          name: 'devfile-sample-go-basic-fj5r',
          namespace: 'test-ns',
          status: 'Unknown',
          version: 'v1',
        },
        {
          group: 'apps',
          health: {
            message: 'Waiting for rollout to finish: 0 of 1 updated replicas are available...',
            status: 'Progressing',
          },
          kind: 'Deployment',
          name: 'devfile-sample-go-basic-fj5r',
          namespace: 'test-ns',
          status: 'Unknown',
          version: 'v1',
        },
        {
          group: 'route.openshift.io',
          health: {
            message: 'Route is healthy',
            status: 'Healthy',
          },
          kind: 'Route',
          name: 'devfile-sample-go-basic-ff5jv',
          namespace: 'test-ns',
          status: 'Unknown',
          version: 'v1',
        },
      ],
      sync: {
        status: 'Unknown',
      },
    },
  },
];

export const mockEnvironments = [
  {
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    kind: 'Environment',
    metadata: {
      annotations: {
        'toolchain.dev.openshift.com/last-applied-configuration':
          '{"apiVersion":"appstudio.redhat.com/v1alpha1","kind":"Environment","metadata":{"labels":{"toolchain.dev.openshift.com/provider":"codeready-toolchain","toolchain.dev.openshift.com/space":"test-user"},"name":"development","namespace":"test-ns"},"spec":{"deploymentStrategy":"AppStudioAutomated","displayName":"Development","type":"Non-POC"}}',
      },
      resourceVersion: '376772469',
      name: 'development',
      uid: '4db19edb-a3b5-42c9-a661-2c465558731e',
      creationTimestamp: '2023-06-22T13:57:15Z',
      generation: 1,
      namespace: 'test-ns',
    },
    spec: {
      deploymentStrategy: 'AppStudioAutomated',
      displayName: 'Development',
      type: 'Non-POC',
    },
  },
  {
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    kind: 'Environment',
    metadata: {
      creationTimestamp: '2023-07-20T15:08:39Z',
      generation: 1,
      name: 'staging',
      namespace: 'test-ns',
      resourceVersion: '476486846',
      uid: 'cc44a05a-b0b2-4594-85ad-4bdca3d6555d',
    },
    spec: {
      deploymentStrategy: 'AppStudioAutomated',
      displayName: 'staging',
      tags: ['managed'],
      unstableConfigurationFields: {
        clusterType: 'OpenShift',
        kubernetesCredentials: {
          allowInsecureSkipTLSVerify: true,
          apiURL: 'https://api.rhamilto.devcluster.openshift.com:6443',
          clusterCredentialsSecret: 'env-cluster-credentials-5s56v',
          namespaces: ['test-ns'],
          targetNamespace: 'test-ns',
        },
      },
    },
  },
];

export const mockDeployment = {
  kind: 'Deployment',
  apiVersion: 'apps/v1',
  metadata: {
    annotations: {
      'deployment.kubernetes.io/revision': '8',
      'kubectl.kubernetes.io/last-applied-configuration':
        '{"apiVersion":"apps/v1","kind":"Deployment","metadata":{"annotations":{},"labels":{"app.kubernetes.io/created-by":"application-service","app.kubernetes.io/instance":"gitopsdepl-3ce2e396-5682-47ff-80f8-38e6b7284adf","app.kubernetes.io/managed-by":"kustomize","app.kubernetes.io/name":"human-resources","app.kubernetes.io/part-of":"test-application"},"name":"human-resources","namespace":"test-ns"},"spec":{"replicas":1,"revisionHistoryLimit":0,"selector":{"matchLabels":{"app":"java-springboot-app","app.kubernetes.io/instance":"human-resources"}},"strategy":{},"template":{"metadata":{"labels":{"app":"java-springboot-app","app.kubernetes.io/instance":"human-resources"}},"spec":{"containers":[{"image":"quay.io/redhat-user-workloads-stage/test-ns/test-application/human-resources@sha256:a0109b5839892ed31abff61faf904971fb511250fef26c4a2f31d7f1c6394b69","name":"my-java-springboot","ports":[{"containerPort":8081,"name":"http","protocol":"TCP"}],"resources":{"requests":{"cpu":"10m","memory":"180Mi"}}}]}}},"status":{}}\n',
    },
    resourceVersion: '551642403',
    name: 'human-resources',
    uid: 'f5b6c39b-a5a3-44df-9c72-a36bd1deb4c2',
    creationTimestamp: '2023-07-06T18:21:28Z',
    generation: 8,
    namespace: 'test-ns',
    labels: {
      'app.kubernetes.io/created-by': 'application-service',
      'app.kubernetes.io/instance': 'gitopsdepl-3ce2e396-5682-47ff-80f8-38e6b7284adf',
      'app.kubernetes.io/managed-by': 'kustomize',
      'app.kubernetes.io/name': 'human-resources',
      'app.kubernetes.io/part-of': 'test-application',
    },
  },
  spec: {
    replicas: 1,
    selector: {
      matchLabels: {
        app: 'java-springboot-app',
        'app.kubernetes.io/instance': 'human-resources',
      },
    },
    template: {
      metadata: {
        creationTimestamp: null,
        labels: {
          app: 'java-springboot-app',
          'app.kubernetes.io/instance': 'human-resources',
        },
      },
      spec: {
        containers: [
          {
            name: 'my-java-springboot',
            image:
              'quay.io/redhat-user-workloads-stage/test-ns/test-application/human-resources@sha256:a0109b5839892ed31abff61faf904971fb511250fef26c4a2f31d7f1c6394b69',
            ports: [
              {
                name: 'http',
                containerPort: 8081,
                protocol: 'TCP',
              },
            ],
            resources: {
              requests: {
                cpu: '10m',
                memory: '180Mi',
              },
            },
            terminationMessagePath: '/dev/termination-log',
            terminationMessagePolicy: 'File',
            imagePullPolicy: 'IfNotPresent',
          },
        ],
        restartPolicy: 'Always',
        terminationGracePeriodSeconds: 30,
        dnsPolicy: 'ClusterFirst',
        securityContext: {},
        schedulerName: 'default-scheduler',
      },
    },
    strategy: {
      type: 'RollingUpdate',
      rollingUpdate: {
        maxUnavailable: '25%',
        maxSurge: '25%',
      },
    },
    revisionHistoryLimit: 0,
    progressDeadlineSeconds: 600,
  },
  status: {
    observedGeneration: 8,
    replicas: 1,
    updatedReplicas: 1,
    unavailableReplicas: 1,
    conditions: [
      {
        type: 'Progressing',
        status: 'True',
        lastUpdateTime: '2023-07-24T10:52:13Z',
        lastTransitionTime: '2023-07-06T18:21:28Z',
        reason: 'NewReplicaSetAvailable',
        message: 'ReplicaSet "human-resources-9994c76c6" has successfully progressed.',
      },
      {
        type: 'Available',
        status: 'False',
        lastUpdateTime: '2023-08-10T15:42:19Z',
        lastTransitionTime: '2023-08-10T15:42:19Z',
        reason: 'MinimumReplicasUnavailable',
        message: 'Deployment does not have minimum availability.',
      },
    ],
  },
};

export const mockRoutes: RouteKind[] = [
  {
    apiVersion: 'route.openshift.io/v1',
    kind: 'Route',
    metadata: {
      annotations: {
        'kubectl.kubernetes.io/last-applied-configuration':
          '{"apiVersion":"route.openshift.io/v1","kind":"Route","metadata":{"annotations":{},"creationTimestamp":null,"labels":{"app.kubernetes.io/created-by":"application-service","app.kubernetes.io/instance":"gitopsdepl-f56e3027-168b-43cf-aa3a-99d784d69b05","app.kubernetes.io/managed-by":"kustomize","app.kubernetes.io/name":"nodejs","app.kubernetes.io/part-of":"new-application"},"name":"nodejs","namespace":"rorai"},"spec":{"port":{"targetPort":3000},"tls":{"insecureEdgeTerminationPolicy":"Redirect","termination":"edge"},"to":{"kind":"Service","name":"nodejs","weight":100}},"status":{}}\n',
        'openshift.io/host.generated': 'true',
      },
      creationTimestamp: '2022-05-16T09:52:33Z',
      labels: {
        'app.kubernetes.io/created-by': 'application-service',
        'app.kubernetes.io/instance': 'gitopsdepl-f56e3027-168b-43cf-aa3a-99d784d69b05',
        'app.kubernetes.io/managed-by': 'kustomize',
        'app.kubernetes.io/name': 'human-resources',
        'app.kubernetes.io/part-of': 'new-application',
      },
      name: 'nodejs',
      namespace: 'test',
      resourceVersion: '515569114',
      uid: '3d3e557d-34c8-4f1f-9a9b-9b199d96c6b3',
    },
    spec: {
      host: 'nodejs-test.apps.appstudio-stage.x99m.p1.openshiftapps.com',
      port: {
        targetPort: 3000,
      },
      tls: {
        insecureEdgeTerminationPolicy: 'Redirect',
        termination: 'edge',
      },
      to: {
        kind: 'Service',
        name: 'nodejs',
        weight: 100,
      },
      wildcardPolicy: 'None',
    },
    status: {
      ingress: [
        {
          conditions: [
            {
              lastTransitionTime: '2022-05-16T09:52:33Z',
              status: 'True',
              type: 'Admitted',
            },
          ],
          host: 'nodejs-test.apps.appstudio-stage.x99m.p1.openshiftapps.com',
          routerCanonicalHostname: 'router-default.apps.appstudio-stage.x99m.p1.openshiftapps.com',
          routerName: 'default',
          wildcardPolicy: 'None',
        },
      ],
    },
  },
  {
    apiVersion: 'route.openshift.io/v1',
    kind: 'Route',
    metadata: {
      annotations: {
        'kubectl.kubernetes.io/last-applied-configuration':
          '{"apiVersion":"route.openshift.io/v1","kind":"Route","metadata":{"annotations":{},"creationTimestamp":null,"labels":{"app.kubernetes.io/created-by":"application-service","app.kubernetes.io/instance":"gitopsdepl-3d00e628-1320-4e5e-b927-49329b9ca800","app.kubernetes.io/managed-by":"kustomize","app.kubernetes.io/name":"java-quarkus","app.kubernetes.io/part-of":"test-application"},"name":"java-quarkus","namespace":"rorai"},"spec":{"port":{"targetPort":8080},"tls":{"insecureEdgeTerminationPolicy":"Redirect","termination":"edge"},"to":{"kind":"Service","name":"java-quarkus","weight":100}},"status":{}}\n',
        'openshift.io/host.generated': 'true',
      },
      creationTimestamp: '2022-05-06T16:06:28Z',
      labels: {
        'app.kubernetes.io/created-by': 'application-service',
        'app.kubernetes.io/instance': 'gitopsdepl-3d00e628-1320-4e5e-b927-49329b9ca800',
        'app.kubernetes.io/managed-by': 'kustomize',
        'app.kubernetes.io/name': 'java-quarkus',
        'app.kubernetes.io/part-of': 'test-application',
      },
      name: 'java-quarkus',
      namespace: 'test',
      resourceVersion: '437696426',
      uid: '6f8cbe58-7274-4061-b68a-ed4d9afc57fd',
    },
    spec: {
      host: 'java-quarkus-test.apps.appstudio-stage.x99m.p1.openshiftapps.com',
      port: {
        targetPort: 8080,
      },
      tls: {
        insecureEdgeTerminationPolicy: 'Redirect',
        termination: 'edge',
      },
      to: {
        kind: 'Service',
        name: 'java-quarkus',
        weight: 100,
      },
      wildcardPolicy: 'None',
    },
    status: {
      ingress: [
        {
          conditions: [
            {
              lastTransitionTime: '2022-05-06T16:06:28Z',
              status: 'True',
              type: 'Admitted',
            },
          ],
          host: 'java-quarkus-test.apps.appstudio-stage.x99m.p1.openshiftapps.com',
          routerCanonicalHostname: 'router-default.apps.appstudio-stage.x99m.p1.openshiftapps.com',
          routerName: 'default',
          wildcardPolicy: 'None',
        },
      ],
    },
  },
];
