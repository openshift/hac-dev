import { PodKind } from '../shared/components/types';

export const samplePod: PodKind = {
  kind: 'Pod',
  apiVersion: 'v1',
  metadata: {
    name: 'go-app-5few-65cc6-appstudio-init-pod',
    namespace: 'test-tenant',
    uid: '297258bd-c1d2-42dd-87a2-e42611fdc822',
  },
  spec: {
    volumes: [],
    initContainers: [],
    containers: [
      {
        command: ['/bin/bash', '-c', 'echo', 'hello world'],
        image: 'registry.redhat.io/ubi7/ubi-minimal',
        name: 'step-init',
        resources: {},
      },
    ],
    restartPolicy: 'Never',
    terminationGracePeriodSeconds: 30,
    activeDeadlineSeconds: 5395,
    dnsPolicy: 'ClusterFirst',
    serviceAccountName: 'pipeline',
    serviceAccount: 'pipeline',
    nodeName: 'ip-10-0-202-33.us-east-2.compute.internal',
    securityContext: {
      seLinuxOptions: {
        level: 's0:c57,c49',
      },
      fsGroup: 1003290000,
    },
    imagePullSecrets: [
      {
        name: 'pipeline-dockercfg-vk7gx',
      },
    ],
    schedulerName: 'default-scheduler',
    tolerations: [
      {
        key: 'node.kubernetes.io/not-ready',
        operator: 'Exists',
        effect: 'NoExecute',
        tolerationSeconds: 300,
      },
      {
        key: 'node.kubernetes.io/unreachable',
        operator: 'Exists',
        effect: 'NoExecute',
        tolerationSeconds: 300,
      },
      {
        key: 'node.kubernetes.io/memory-pressure',
        operator: 'Exists',
        effect: 'NoSchedule',
      },
    ],
    priorityClassName: 'sandbox-users-pods',
    priority: -3,
    enableServiceLinks: true,
    preemptionPolicy: 'PreemptLowerPriority',
  },
  status: {
    phase: 'Succeeded',
    conditions: [
      {
        type: 'Initialized',
        status: 'True',
        lastProbeTime: null,
        lastTransitionTime: '2023-02-03T09:58:51Z',
        reason: 'PodCompleted',
      },
      {
        type: 'Ready',
        status: 'False',
        lastProbeTime: null,
        lastTransitionTime: '2023-02-03T09:58:57Z',
        reason: 'PodCompleted',
      },
      {
        type: 'ContainersReady',
        status: 'False',
        lastProbeTime: null,
        lastTransitionTime: '2023-02-03T09:58:57Z',
        reason: 'PodCompleted',
      },
      {
        type: 'PodScheduled',
        status: 'True',
        lastProbeTime: null,
        lastTransitionTime: '2023-02-03T09:58:47Z',
      },
    ],
    hostIP: '10.0.202.33',
    podIP: '10.130.14.58',
    podIPs: [
      {
        ip: '10.130.14.58',
      },
    ],
    startTime: '2023-02-03T09:58:47Z',
    initContainerStatuses: [
      {
        name: 'prepare',
        state: {
          terminated: {
            exitCode: 0,
            reason: 'Completed',
            startedAt: '2023-02-03T09:58:50Z',
            finishedAt: '2023-02-03T09:58:50Z',
            containerID: 'cri-o://fac0b3262d49bab9e3ff43dfde9949ee19520ef48cc854c1852449d361d0c0c5',
          },
        },
        lastState: {},
        ready: true,
        restartCount: 0,
        image:
          'registry.redhat.io/openshift-pipelines/pipelines-entrypoint-rhel8@sha256:3580541d0912cdba214343b79868d2adcfa1c60a6e5ee940c255fa76d4431f07',
        imageID:
          'registry.redhat.io/openshift-pipelines/pipelines-entrypoint-rhel8@sha256:3580541d0912cdba214343b79868d2adcfa1c60a6e5ee940c255fa76d4431f07',
        containerID: 'cri-o://fac0b3262d49bab9e3ff43dfde9949ee19520ef48cc854c1852449d361d0c0c5',
      },
      {
        name: 'place-scripts',
        state: {
          terminated: {
            exitCode: 0,
            reason: 'Completed',
            startedAt: '2023-02-03T09:58:51Z',
            finishedAt: '2023-02-03T09:58:51Z',
            containerID: 'cri-o://72b2e1972f51f21e4e284b0438d0516038f81b8236db7fb0e870d21be2397d35',
          },
        },
        lastState: {},
        ready: true,
        restartCount: 0,
        image:
          'registry.redhat.io/ubi8/ubi-minimal@sha256:c7b45019f4db32e536e69e102c4028b66bf5cde173cfff4ffd3281ccf7bb3863',
        imageID:
          'registry.redhat.io/ubi8/ubi-minimal@sha256:2c8e091b26cc5a73cc7c61f4baee718021cfe5bd2fbc556d1411499c9a99ccdb',
        containerID: 'cri-o://72b2e1972f51f21e4e284b0438d0516038f81b8236db7fb0e870d21be2397d35',
      },
    ],
    containerStatuses: [
      {
        name: 'step-init',
        state: {
          terminated: {
            exitCode: 0,
            reason: 'Completed',
            message:
              '[{"key":"build","value":"false","type":1},{"key":"StartedAt","value":"2023-02-03T09:58:56.096Z","type":3}]',
            startedAt: '2023-02-03T09:58:53Z',
            finishedAt: '2023-02-03T09:58:56Z',
            containerID: 'cri-o://5e596b389a3c995e30138eff66b3d310b477e0859700902e7656ac82ecf6f2d9',
          },
        },
        lastState: {},
        ready: false,
        restartCount: 0,
        image:
          'registry.access.redhat.com/ubi9/skopeo@sha256:6ebbdfce633f9915a6a99d8ee035d9fd258121aa1acf944229e90696eb353549',
        imageID:
          'registry.access.redhat.com/ubi9/skopeo@sha256:6ebbdfce633f9915a6a99d8ee035d9fd258121aa1acf944229e90696eb353549',
        containerID: 'cri-o://5e596b389a3c995e30138eff66b3d310b477e0859700902e7656ac82ecf6f2d9',
        started: false,
      },
    ],
    qosClass: 'Burstable',
  },
};
