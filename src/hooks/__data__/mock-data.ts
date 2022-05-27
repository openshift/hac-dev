import { RouteKind } from '../../types/routes';

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
        'app.kubernetes.io/name': 'nodejs',
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
