import { RouteKind } from '../../types/routes';

export const mockRoutes: RouteKind[] = [
  {
    apiVersion: 'route.openshift.io/v1',
    kind: 'Route',
    metadata: {
      annotations: {
        'build.appstudio.openshift.io/application': 'purple-mermaid-app',
        'build.appstudio.openshift.io/build': 'true',
        'build.appstudio.openshift.io/component': 'nodejs',
        'build.appstudio.openshift.io/type': 'build',
        'build.appstudio.openshift.io/version': '0.1',
        'openshift.io/host.generated': 'true',
      },
      name: 'elnodejs',
      namespace: 'test',
    },
    spec: {
      host: 'elnodejs-test.apps.appstudio-stage.x99m.p1.openshiftapps.com',
      path: '/',
      port: {
        targetPort: 8080,
      },
      to: {
        kind: 'Service',
        name: 'el-nodejs',
        weight: 100,
      },
      wildcardPolicy: 'None',
    },
    status: {
      ingress: [
        {
          conditions: [
            {
              lastTransitionTime: '2022-03-08T15:35:35Z',
              status: 'True',
              type: 'Admitted',
            },
          ],
          host: 'elnodejs-test.apps.appstudio-stage.x99m.p1.openshiftapps.com',
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
        'build.appstudio.openshift.io/application': 'purple-merman-app',
        'build.appstudio.openshift.io/build': 'true',
        'build.appstudio.openshift.io/component': 'python',
        'build.appstudio.openshift.io/type': 'build',
        'build.appstudio.openshift.io/version': '0.1',
        'openshift.io/host.generated': 'true',
      },
      name: 'elpython',
      namespace: 'test',
    },
    spec: {
      host: 'elpython-test.apps.appstudio-stage.x99m.p1.openshiftapps.com',
      path: '/',
      port: {
        targetPort: 8080,
      },
      to: {
        kind: 'Service',
        name: 'el-python',
        weight: 100,
      },
      wildcardPolicy: 'None',
    },
    status: {
      ingress: [
        {
          conditions: [
            {
              lastTransitionTime: '2022-03-08T15:35:35Z',
              status: 'True',
              type: 'Admitted',
            },
          ],
          host: 'elpython-test.apps.appstudio-stage.x99m.p1.openshiftapps.com',
          routerCanonicalHostname: 'router-default.apps.appstudio-stage.x99m.p1.openshiftapps.com',
          routerName: 'default',
          wildcardPolicy: 'None',
        },
      ],
    },
  },
];
