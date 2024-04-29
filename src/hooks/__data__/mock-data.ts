import { LimitRange, SnapshotEnvironmentBinding } from '../../types/coreBuildService';
import { RouteKind } from '../../types/routes';

const baseSnapshotEnvironmentBinding: SnapshotEnvironmentBinding = {
  apiVersion: 'appstudio.redhat.com/v1alpha1',
  kind: 'SnapshotEnvironmentBinding',
  metadata: {
    creationTimestamp: '2023-02-21T05:10:22Z',
    generateName: 'test-app-prod-binding-',
    labels: {
      'appstudio.application': 'test-app',
      'appstudio.environment': 'prod',
    },
    name: 'test-app-prod-binding-dxbcz',
    namespace: 'test-ns',
    uid: '30341053-fe45-4bc3-824a-075af3b6ba23',
  },
  spec: {
    application: 'test-app',
    components: [
      {
        configuration: {
          env: [],
          replicas: 1,
        },
        name: 'test-app-devfile-sample-dlod-sample',
      },
    ],
    environment: 'prod',
    snapshot: 'test-app-dmmr7',
  },
};
export enum SEB_STATUS {
  SUCCEEDED = 'Succeeded',
  RUNNING = 'Running',
  MISSING = 'Missing',
  PARTIAL = 'Partial',
  DEGRADED = 'Degraded',
}

export const mockSnapshotEnvironmentBindings: {
  [key in SEB_STATUS]: SnapshotEnvironmentBinding[];
} = {
  [SEB_STATUS.MISSING]: [{ ...baseSnapshotEnvironmentBinding }],
  [SEB_STATUS.PARTIAL]: [
    {
      ...baseSnapshotEnvironmentBinding,
      status: {
        bindingConditions: [
          {
            lastTransitionTime: '2023-02-21T05:10:23Z',
            message:
              "Can not Reconcile Binding 'test-app-development-binding-dxbcz', since GitOps Repo Conditions status is false.",
            reason: 'ErrorOccurred',
            status: 'True',
            type: 'ErrorOccurred',
          },
        ],
        gitopsRepoConditions: [
          {
            lastTransitionTime: '2023-02-21T05:10:23Z',
            message:
              'GitOps repository sync failed: failed to push remote to repository "https://<TOKEN>@github.com/ch007m/test-app-nmNw5-identify-count" "fatal: could not read Password for \'https://<TOKEN>@github.com\': No such device or address\\n": exit status 128',
            reason: 'GenerateError',
            status: 'False',
            type: 'GitOpsResourcesGenerated',
          },
        ],
        gitopsDeployments: [
          {
            componentName: 'comp1',
            gitopsDeployment: 'test-app-prod-binding-dxbcz-test-app-prod-comp1-ccgs',
            health: 'Progressing',
            syncStatus: 'Unknown',
          },
          {
            componentName: 'comp2',
            gitopsDeployment: 'test-app-prod-binding-dxbcz-test-app-prod-comp2-xdss',
            health: 'Healthy',
            syncStatus: 'Unknown',
          },
          {
            componentName: 'comp3',
            gitopsDeployment: 'test-app-prod-binding-dxbcz-test-app-prod-comp3-jkkl',
            health: 'Healthy',
            syncStatus: 'Unknown',
          },
        ],
      },
    },
  ],
  [SEB_STATUS.SUCCEEDED]: [
    {
      ...baseSnapshotEnvironmentBinding,
      status: {
        bindingConditions: [
          {
            lastTransitionTime: '2023-02-21T05:26:52Z',
            message:
              "SnapshotEventBinding Component status is required to generate GitOps deployment, waiting for the Application Service controller to finish reconciling binding 'my-app-development-binding-w8plb'",
            reason: 'ErrorOccurred',
            status: 'True',
            type: 'ErrorOccurred',
          },
        ],
        componentDeploymentConditions: [
          {
            lastTransitionTime: '2023-02-21T05:27:25Z',
            message: '1 of 1 components deployed',
            reason: 'CommitsSynced',
            status: 'True',
            type: 'AllComponentsDeployed',
          },
        ],
        components: [
          {
            gitopsRepository: {
              branch: 'main',
              commitID: 'd99ca37ecdb9213a14123ff775f21f44f16d8c96',
              generatedResources: ['deployment-patch.yaml'],
              path: 'components/devfile-sample-guhp/overlays/development',
              url: 'https://github.com/redhat-appstudio-appdata/my-app-ls2Qa-assess-press',
            },
            name: 'devfile-sample-guhp',
          },
        ],
        gitopsDeployments: [
          {
            componentName: 'comp1',
            gitopsDeployment: 'test-app-prod-binding-dxbcz-test-app-prod-comp1-ccgs',
            health: 'Healthy',
            syncStatus: 'Unknown',
          },
          {
            componentName: 'comp2',
            gitopsDeployment: 'test-app-prod-binding-dxbcz-test-app-prod-comp2-xdss',
            health: 'Healthy',
            syncStatus: 'Unknown',
          },
          {
            componentName: 'comp3',
            gitopsDeployment: 'test-app-prod-binding-dxbcz-test-app-prod-comp3-jkkl',
            health: 'Healthy',
            syncStatus: 'Unknown',
          },
        ],
        gitopsRepoConditions: [
          {
            lastTransitionTime: '2023-02-21T05:26:53Z',
            message: 'GitOps repository sync successful',
            reason: 'OK',
            status: 'True',
            type: 'GitOpsResourcesGenerated',
          },
        ],
      },
    },
  ],
  [SEB_STATUS.RUNNING]: [
    {
      ...baseSnapshotEnvironmentBinding,
      status: {
        components: [
          {
            gitopsRepository: {
              branch: 'main',
              commitID: '95598ffacde7586c92a1eecf7c813080b8a9a1c8\n',
              generatedResources: ['deployment-patch.yaml'],
              path: 'components/test-nodeapp/overlays/production',
              url: 'https://github.com/HACbs-ui-org/test-application-jephilli-define-laugh',
            },
            name: 'test-nodeapp',
          },
        ],
        bindingConditions: [
          {
            lastTransitionTime: '2023-01-24T09:31:03Z',
            message:
              'SnapshotEventBinding Component status is required to generate GitOps deployment, waiting for the Application Service controller to finish reconciling',
            binding: 'test-app-2-development-binding-w7f2z',
            reason: 'ErrorOccurred',
            status: 'True',
            type: 'ErrorOccurred',
          },
        ],

        componentDeploymentConditions: [
          {
            lastTransitionTime: '2023-01-24T09:31:34Z',
            message: '1 of 1 components deployed',
            reason: 'CommitsUnsynced',
            status: 'False',
            type: 'AllComponentsDeployed',
          },
        ],
        gitopsDeployments: [
          {
            componentName: 'comp1',
            gitopsDeployment: 'test-app-prod-binding-dxbcz-test-app-prod-comp1-ccgs',
            health: 'Healthy',
            syncStatus: 'Unknown',
          },
          {
            componentName: 'comp2',
            gitopsDeployment: 'test-app-prod-binding-dxbcz-test-app-prod-comp2-xdss',
            health: 'Healthy',
            syncStatus: 'Unknown',
          },
          {
            componentName: 'comp3',
            gitopsDeployment: 'test-app-prod-binding-dxbcz-test-app-prod-comp3-jkkl',
            health: 'Progressing',
            syncStatus: 'Unknown',
          },
        ],
        gitopsRepoConditions: [
          {
            lastTransitionTime: '2022-11-09T17:33:47Z',
            message: 'GitOps repository sync successful',
            reason: 'OK',
            status: 'True',
            type: 'GitOpsResourcesGenerated',
          },
        ],
      },
    },
  ],
  [SEB_STATUS.DEGRADED]: [
    {
      ...baseSnapshotEnvironmentBinding,
      status: {
        components: [
          {
            gitopsRepository: {
              branch: 'main',
              commitID: '95598ffacde7586c92a1eecf7c813080b8a9a1c8\n',
              generatedResources: ['deployment-patch.yaml'],
              path: 'components/test-nodeapp/overlays/production',
              url: 'https://github.com/HACbs-ui-org/test-application-jephilli-define-laugh',
            },
            name: 'test-nodeapp',
          },
        ],
        bindingConditions: [
          {
            lastTransitionTime: '2023-01-24T09:31:03Z',
            message:
              'SnapshotEventBinding Component status is required to generate GitOps deployment, waiting for the Application Service controller to finish reconciling',
            binding: 'test-app-2-development-binding-w7f2z',
            reason: 'ErrorOccurred',
            status: 'True',
            type: 'ErrorOccurred',
          },
        ],

        componentDeploymentConditions: [
          {
            lastTransitionTime: '2023-01-24T09:31:34Z',
            message: '1 of 1 components deployed',
            reason: 'CommitsUnsynced',
            status: 'False',
            type: 'ErrorOccurred',
          },
        ],
        gitopsDeployments: [
          {
            componentName: 'comp1',
            gitopsDeployment: 'test-app-prod-binding-dxbcz-test-app-prod-comp1-ccgs',
            health: 'Healthy',
            syncStatus: 'Unknown',
          },
          {
            componentName: 'comp2',
            gitopsDeployment: 'test-app-prod-binding-dxbcz-test-app-prod-comp2-xdss',
            health: 'Degraded',
            syncStatus: 'Unknown',
          },
          {
            componentName: 'comp3',
            gitopsDeployment: 'test-app-prod-binding-dxbcz-test-app-prod-comp3-jkkl',
            health: 'Progressing',
            syncStatus: 'Unknown',
          },
        ],
        gitopsRepoConditions: [
          {
            lastTransitionTime: '2022-11-09T17:33:47Z',
            message: 'GitOps repository sync successful',
            reason: 'OK',
            status: 'True',
            type: 'GitOpsResourcesGenerated',
          },
        ],
      },
    },
  ],
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
        'app.kubernetes.io/name': 'basic-node-js',
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

export const mockGitOpsDeployment = [
  {
    apiVersion: 'managed-gitops.redhat.com/v1alpha1',
    kind: 'GitOpsDeployment',
    metadata: {
      creationTimestamp: '2022-06-01T14:00:56Z',
      generation: 1,
      labels: {
        'appstudio.application.name': 'application-to-test-git-ops',
      },
      name: 'application-to-test-git-ops-deployment',
      namespace: 'sbudhwar-1',
      ownerReferences: [
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          kind: 'Application',
          name: 'application-to-test-git-ops',
          uid: '1935564f-c9a0-4ed5-acea-22ce1315311c',
        },
      ],
      resourceVersion: '548372841',
      uid: '85fba8b1-a728-4aed-9d17-c874d14c512e',
    },
    spec: {
      destination: {},
      source: {
        path: './',
        repoURL:
          'https://github.com/redhat-appstudio-appdata/application-to-test-git-ops-sbudhwar-1-rise-stop',
      },
      type: 'automated',
    },
    status: {
      health: {
        status: 'Healthy',
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
      creationTimestamp: '2022-06-01T14:00:56Z',
      generation: 1,
      labels: {
        'appstudio.application.name': 'application-to-test',
      },
      name: 'application-to-test-deployment',
      namespace: 'sbudhwar-1',
      ownerReferences: [
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          kind: 'Application',
          name: 'application-to-test',
          uid: '1935564f-c9a0-4ed5-acea-22ce1315311c',
        },
      ],
      resourceVersion: '548372841',
      uid: '85fba8b1-a728-4aed-9d17-c874d14c512e',
    },
    spec: {
      destination: {},
      source: {
        path: './',
        repoURL:
          'https://github.com/redhat-appstudio-appdata/application-to-test-git-ops-sbudhwar-1-rise-stop',
      },
      type: 'automated',
    },
    status: {
      health: {
        status: 'Degraded',
      },
      sync: {
        status: 'Unknown',
      },
    },
  },
];

export const mockLimitRange: LimitRange = {
  apiVersion: 'v1',
  kind: 'LimitRange',
  metadata: { name: 'resource-limits' },
  spec: {
    limits: [
      {
        default: {
          cpu: '2',
          memory: '2Gi',
        },
        defaultRequest: {
          cpu: '10m',
          memory: '256Mi',
        },
        type: 'Container',
      },
    ],
  },
};
