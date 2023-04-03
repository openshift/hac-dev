import { PodKind } from '../../../shared/components/types';

export const mockPods: PodKind[] = [
  {
    apiVersion: 'v1Alpha',
    kind: 'Pod',
    metadata: {
      name: 'devfile-sample-6wo1-6f487b5b66-tsdvv',
      generateName: 'devfile-sample-6wo1-6f487b5b66-',
      namespace: 'abhindas-tenant',
      uid: '03b2c46b-d815-4d42-aed3-6b5382444b18',
      resourceVersion: '97905481',
      creationTimestamp: '2023-03-29T11:15:59Z',
      labels: {
        app: 'nodejs-app',
        'app.kubernetes.io/instance': 'devfile-sample-6wo1',
        'pod-template-hash': '6f487b5b66',
      },
      annotations: {
        'k8s.ovn.org/pod-networks':
          '{"default":{"ip_addresses":["10.128.6.218/23"],"mac_address":"0a:58:0a:80:06:da","gateway_ips":["10.128.6.1"],"ip_address":"10.128.6.218/23","gateway_ip":"10.128.6.1"}}',
        'k8s.v1.cni.cncf.io/network-status':
          '[{\n    "name": "ovn-kubernetes",\n    "interface": "eth0",\n    "ips": [\n        "10.128.6.218"\n    ],\n    "mac": "0a:58:0a:80:06:da",\n    "default": true,\n    "dns": {}\n}]',
        'k8s.v1.cni.cncf.io/networks-status':
          '[{\n    "name": "ovn-kubernetes",\n    "interface": "eth0",\n    "ips": [\n        "10.128.6.218"\n    ],\n    "mac": "0a:58:0a:80:06:da",\n    "default": true,\n    "dns": {}\n}]',
        'openshift.io/scc': 'restricted-v2',
        'seccomp.security.alpha.kubernetes.io/pod': 'runtime/default',
      },
      ownerReferences: [
        {
          apiVersion: 'apps/v1',
          kind: 'ReplicaSet',
          name: 'devfile-sample-6wo1-6f487b5b66',
          uid: 'c9d4805f-16bd-4335-a487-4d7fd7257041',
          controller: true,
          blockOwnerDeletion: true,
        },
      ],
      managedFields: [
        {
          manager: 'ip-10-205-25-104',
          operation: 'Update',
          apiVersion: 'v1',
          time: '2023-03-29T11:15:59Z',
          fieldsType: 'FieldsV1',
          fieldsV1: {
            'f:metadata': {
              'f:annotations': {
                'f:k8s.ovn.org/pod-networks': {},
              },
            },
          },
        },
        {
          manager: 'kube-controller-manager',
          operation: 'Update',
          apiVersion: 'v1',
        },
        {
          manager: 'multus',
          operation: 'Update',
          apiVersion: 'v1',
          time: '2023-03-29T11:16:01Z',
          fieldsType: 'FieldsV1',
          fieldsV1: {
            'f:metadata': {
              'f:annotations': {
                'f:k8s.v1.cni.cncf.io/network-status': {},
                'f:k8s.v1.cni.cncf.io/networks-status': {},
              },
            },
          },
          subresource: 'status',
        },
        {
          manager: 'kubelet',
          operation: 'Update',
          apiVersion: 'v1',
          time: '2023-03-29T11:16:05Z',
          subresource: 'status',
        },
      ],
    },
    spec: {
      volumes: [
        {
          name: 'kube-api-access-zr9d9',
          projected: {
            sources: [
              {
                serviceAccountToken: {
                  expirationSeconds: 3607,
                  path: 'token',
                },
              },
              {
                configMap: {
                  name: 'kube-root-ca.crt',
                  items: [
                    {
                      key: 'ca.crt',
                      path: 'ca.crt',
                    },
                  ],
                },
              },
              {
                downwardAPI: {
                  items: [
                    {
                      path: 'namespace',
                      fieldRef: {
                        apiVersion: 'v1',
                        fieldPath: 'metadata.namespace',
                      },
                    },
                  ],
                },
              },
              {
                configMap: {
                  name: 'openshift-service-ca.crt',
                  items: [
                    {
                      key: 'service-ca.crt',
                      path: 'service-ca.crt',
                    },
                  ],
                },
              },
            ],
            defaultMode: 420,
          },
        },
      ],
      initContainers: [
        {
          name: 'my-nodejs',
          image:
            'quay.io/redhat-appstudio/user-workload@sha256:d908ce5beecfb81c28a2f9cd4b26d2eed1ea1f57fe1ce8674188e41a3c063486',
          ports: [
            {
              name: 'http',
              containerPort: 3001,
              protocol: 'TCP',
            },
          ],
          resources: {
            limits: {
              cpu: '100m',
              memory: '100Mi',
            },
          },
          volumeMounts: [
            {
              name: 'kube-api-access-zr9d9',
              readOnly: true,
              mountPath: '/var/run/secrets/kubernetes.io/serviceaccount',
            },
          ],
          terminationMessagePath: '/dev/termination-log',
          terminationMessagePolicy: 'File',
          securityContext: {
            capabilities: {
              drop: ['ALL'],
            },
            runAsUser: 1002280000,
            runAsNonRoot: true,
            allowPrivilegeEscalation: false,
          },
        },
        {
          name: 'my-nodejs-2',
          image:
            'quay.io/redhat-appstudio/user-workload@sha256:d908ce5beecfb81c28a2f9cd4b26d2eed1ea1f57fe1ce8674188e41a3c063486',
          ports: [
            {
              name: 'http',
              containerPort: 3001,
              protocol: 'TCP',
            },
          ],
          resources: {
            limits: {
              cpu: '100m',
              memory: '100Mi',
            },
          },
          volumeMounts: [
            {
              name: 'kube-api-access-zr9d9',
              readOnly: true,
              mountPath: '/var/run/secrets/kubernetes.io/serviceaccount',
            },
          ],
          terminationMessagePath: '/dev/termination-log',
          terminationMessagePolicy: 'File',
          securityContext: {
            capabilities: {
              drop: ['ALL'],
            },
            runAsUser: 1002280000,
            runAsNonRoot: true,
            allowPrivilegeEscalation: false,
          },
        },
        {
          name: 'my-nodejs-3',
          image:
            'quay.io/redhat-appstudio/user-workload@sha256:d908ce5beecfb81c28a2f9cd4b26d2eed1ea1f57fe1ce8674188e41a3c063486',
          ports: [
            {
              name: 'http',
              containerPort: 3001,
              protocol: 'TCP',
            },
          ],
          resources: {
            limits: {
              cpu: '100m',
              memory: '100Mi',
            },
          },
          volumeMounts: [
            {
              name: 'kube-api-access-zr9d9',
              readOnly: true,
              mountPath: '/var/run/secrets/kubernetes.io/serviceaccount',
            },
          ],
          terminationMessagePath: '/dev/termination-log',
          terminationMessagePolicy: 'File',
          securityContext: {
            capabilities: {
              drop: ['ALL'],
            },
            runAsUser: 1002280000,
            runAsNonRoot: true,
            allowPrivilegeEscalation: false,
          },
        },
      ],
      containers: [
        {
          name: 'my-nodejs',
          image:
            'quay.io/redhat-appstudio/user-workload@sha256:d908ce5beecfb81c28a2f9cd4b26d2eed1ea1f57fe1ce8674188e41a3c063486',
          ports: [
            {
              name: 'http',
              containerPort: 3001,
              protocol: 'TCP',
            },
          ],
          resources: {
            limits: {
              cpu: '100m',
              memory: '100Mi',
            },
          },
          volumeMounts: [
            {
              name: 'kube-api-access-zr9d9',
              readOnly: true,
              mountPath: '/var/run/secrets/kubernetes.io/serviceaccount',
            },
          ],
          terminationMessagePath: '/dev/termination-log',
          terminationMessagePolicy: 'File',
          securityContext: {
            capabilities: {
              drop: ['ALL'],
            },
            runAsUser: 1002280000,
            runAsNonRoot: true,
            allowPrivilegeEscalation: false,
          },
        },
        {
          name: 'my-nodejs-2',
          image:
            'quay.io/redhat-appstudio/user-workload@sha256:d908ce5beecfb81c28a2f9cd4b26d2eed1ea1f57fe1ce8674188e41a3c063486',
          ports: [
            {
              name: 'http',
              containerPort: 3001,
              protocol: 'TCP',
            },
          ],
          resources: {
            limits: {
              cpu: '100m',
              memory: '100Mi',
            },
          },
          volumeMounts: [
            {
              name: 'kube-api-access-zr9d9',
              readOnly: true,
              mountPath: '/var/run/secrets/kubernetes.io/serviceaccount',
            },
          ],
          terminationMessagePath: '/dev/termination-log',
          terminationMessagePolicy: 'File',
          securityContext: {
            capabilities: {
              drop: ['ALL'],
            },
            runAsUser: 1002280000,
            runAsNonRoot: true,
            allowPrivilegeEscalation: false,
          },
        },
        {
          name: 'my-nodejs-3',
          image:
            'quay.io/redhat-appstudio/user-workload@sha256:d908ce5beecfb81c28a2f9cd4b26d2eed1ea1f57fe1ce8674188e41a3c063486',
          ports: [
            {
              name: 'http',
              containerPort: 3001,
              protocol: 'TCP',
            },
          ],
          resources: {
            limits: {
              cpu: '100m',
              memory: '100Mi',
            },
          },
          volumeMounts: [
            {
              name: 'kube-api-access-zr9d9',
              readOnly: true,
              mountPath: '/var/run/secrets/kubernetes.io/serviceaccount',
            },
          ],
          terminationMessagePath: '/dev/termination-log',
          terminationMessagePolicy: 'File',
          securityContext: {
            capabilities: {
              drop: ['ALL'],
            },
            runAsUser: 1002280000,
            runAsNonRoot: true,
            allowPrivilegeEscalation: false,
          },
        },
      ],
      restartPolicy: 'Always',
      terminationGracePeriodSeconds: 30,
      dnsPolicy: 'ClusterFirst',
      serviceAccountName: 'default',
      serviceAccount: 'default',
      nodeName: 'ip-10-205-29-65.ec2.internal',
      securityContext: {
        seLinuxOptions: {
          level: 's0:c48,c12',
        },
        fsGroup: 1002280000,
        seccompProfile: {
          type: 'RuntimeDefault',
        },
      },
      imagePullSecrets: [
        {
          name: 'default-dockercfg-wgckq',
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
      phase: 'Running',
      conditions: [
        {
          type: 'Initialized',
          status: 'True',
          lastProbeTime: null,
          lastTransitionTime: '2023-03-29T11:15:59Z',
        },
        {
          type: 'Ready',
          status: 'True',
          lastProbeTime: null,
          lastTransitionTime: '2023-03-29T11:16:05Z',
        },
        {
          type: 'ContainersReady',
          status: 'True',
          lastProbeTime: null,
          lastTransitionTime: '2023-03-29T11:16:05Z',
        },
        {
          type: 'PodScheduled',
          status: 'True',
          lastProbeTime: null,
          lastTransitionTime: '2023-03-29T11:15:59Z',
        },
      ],
      hostIP: '10.205.29.65',
      podIP: '10.128.6.218',
      podIPs: [
        {
          ip: '10.128.6.218',
        },
      ],
      startTime: '2023-03-29T11:15:59Z',
      containerStatuses: [
        {
          name: 'my-nodejs',
          state: {
            terminated: {
              exitCode: '2023-03-29T11:16:05Z',
            },
          },
          lastState: {},
          ready: true,
          restartCount: 0,
          image:
            'quay.io/redhat-appstudio/user-workload@sha256:d908ce5beecfb81c28a2f9cd4b26d2eed1ea1f57fe1ce8674188e41a3c063486',
          imageID:
            'quay.io/redhat-appstudio/user-workload@sha256:d908ce5beecfb81c28a2f9cd4b26d2eed1ea1f57fe1ce8674188e41a3c063486',
          containerID: 'cri-o://8b6f4859b54f6292894e788b44b9b845884e94416b31c897ca687769d7e2046d',
        },
      ],
      qosClass: 'Burstable',
    },
  },
  {
    apiVersion: 'v1Alpha',
    kind: 'Pod',
    metadata: {
      name: 'devfile-sample-6wo1-x99m8-build-container-pod',
      namespace: 'abhindas-tenant',
      uid: '0589115e-e1a1-48c4-a59b-452b974e28eb',
      resourceVersion: '97904375',
      creationTimestamp: '2023-03-29T11:13:57Z',
      labels: {
        'app.kubernetes.io/managed-by': 'tekton-pipelines',
        'app.kubernetes.io/version': '0.1',
        'appstudio.openshift.io/application': 'my-app-2',
        'appstudio.openshift.io/component': 'devfile-sample-6wo1',
        'pipelines.appstudio.openshift.io/type': 'build',
        'pipelines.openshift.io/runtime': 'generic',
        'pipelines.openshift.io/strategy': 'docker',
        'pipelines.openshift.io/used-by': 'build-cloud',
        'tekton.dev/memberOf': 'tasks',
        'tekton.dev/pipeline': 'docker-build',
        'tekton.dev/pipelineRun': 'devfile-sample-6wo1-x99m8',
        'tekton.dev/pipelineTask': 'build-container',
        'tekton.dev/task': 'buildah',
        'tekton.dev/taskRun': 'devfile-sample-6wo1-x99m8-build-container',
      },
      annotations: {
        'build.appstudio.redhat.com/bundle':
          'quay.io/redhat-appstudio-tekton-catalog/pipeline-docker-build:a7f5eaccbaba1fc86ebd39d82be425b2d551c0e8',
        'build.appstudio.redhat.com/pipeline_name': 'docker-build',
        'build.appstudio.redhat.com/target_branch': '',
        'k8s.ovn.org/pod-networks':
          '{"default":{"ip_addresses":["10.128.6.201/23"],"mac_address":"0a:58:0a:80:06:c9","gateway_ips":["10.128.6.1"],"ip_address":"10.128.6.201/23","gateway_ip":"10.128.6.1"}}',
        'k8s.v1.cni.cncf.io/network-status':
          '[{\n    "name": "ovn-kubernetes",\n    "interface": "eth0",\n    "ips": [\n        "10.128.6.201"\n    ],\n    "mac": "0a:58:0a:80:06:c9",\n    "default": true,\n    "dns": {}\n}]',
        'k8s.v1.cni.cncf.io/networks-status':
          '[{\n    "name": "ovn-kubernetes",\n    "interface": "eth0",\n    "ips": [\n        "10.128.6.201"\n    ],\n    "mac": "0a:58:0a:80:06:c9",\n    "default": true,\n    "dns": {}\n}]',
        'kubernetes.io/limit-ranger':
          'LimitRanger plugin set: cpu, memory limit for container step-sbom-get; cpu, memory limit for container step-analyse-dependencies-java-sbom; cpu, memory limit for container step-merge-sboms; cpu, memory limit for container step-inject-sbom-and-push; cpu, memory limit for container step-upload-sbom; cpu, memory request for init container prepare; cpu, memory limit for init container prepare; cpu, memory request for init container place-scripts; cpu, memory limit for init container place-scripts; cpu, memory request for init container working-dir-initializer; cpu, memory limit for init container working-dir-initializer',
        'openshift.io/scc': 'pipelines-scc',
        'pipeline.tekton.dev/release': '9ec444e',
        'results.tekton.dev/record':
          'abhindas-tenant/results/61cc1860-20c0-478a-b2f4-f1ae0407bff1/records/61cc1860-20c0-478a-b2f4-f1ae0407bff1',
        'results.tekton.dev/result': 'abhindas-tenant/results/61cc1860-20c0-478a-b2f4-f1ae0407bff1',
        'tekton.dev/pipelines.minVersion': '0.12.1',
        'tekton.dev/ready': 'READY',
        'tekton.dev/tags': 'image-build, appstudio, hacbs',
      },
      ownerReferences: [
        {
          apiVersion: 'tekton.dev/v1beta1',
          kind: 'TaskRun',
          name: 'devfile-sample-6wo1-x99m8-build-container',
          uid: 'bb619a73-ae27-4e28-ab23-e63c464c9869',
          controller: true,
          blockOwnerDeletion: true,
        },
      ],
      managedFields: [
        {
          manager: 'ip-10-205-25-104',
          operation: 'Update',
          apiVersion: 'v1',
          time: '2023-03-29T11:13:57Z',
          fieldsType: 'FieldsV1',
          fieldsV1: {
            'f:metadata': {
              'f:annotations': {
                'f:k8s.ovn.org/pod-networks': {},
              },
            },
          },
        },
        {
          manager: 'multus',
          operation: 'Update',
          apiVersion: 'v1',
          time: '2023-03-29T11:14:07Z',
          fieldsType: 'FieldsV1',
          fieldsV1: {
            'f:metadata': {
              'f:annotations': {
                'f:k8s.v1.cni.cncf.io/network-status': {},
                'f:k8s.v1.cni.cncf.io/networks-status': {},
              },
            },
          },
          subresource: 'status',
        },
        {
          manager: 'openshift-pipelines-controller',
          operation: 'Update',
          apiVersion: 'v1',
          time: '2023-03-29T11:14:16Z',
        },
        {
          manager: 'kubelet',
          operation: 'Update',
          apiVersion: 'v1',
          time: '2023-03-29T11:15:41Z',
          subresource: 'status',
        },
      ],
    },
    spec: {
      volumes: [
        {
          name: 'tekton-internal-workspace',
          emptyDir: {},
        },
        {
          name: 'tekton-internal-home',
          emptyDir: {},
        },
        {
          name: 'tekton-internal-results',
          emptyDir: {},
        },
        {
          name: 'tekton-internal-steps',
          emptyDir: {},
        },
        {
          name: 'tekton-internal-secret-volume-pipeline-dockercfg-bstjn-46jfg',
          secret: {
            secretName: 'pipeline-dockercfg-bstjn',
            defaultMode: 420,
          },
        },
        {
          name: 'tekton-internal-scripts',
          emptyDir: {},
        },
        {
          name: 'tekton-internal-bin',
          emptyDir: {},
        },
        {
          name: 'tekton-internal-downward',
          downwardAPI: {
            items: [
              {
                path: 'ready',
                fieldRef: {
                  apiVersion: 'v1',
                  fieldPath: "metadata.annotations['tekton.dev/ready']",
                },
              },
            ],
            defaultMode: 420,
          },
        },
        {
          name: 'tekton-creds-init-home-0',
          emptyDir: {
            medium: 'Memory',
          },
        },
        {
          name: 'tekton-internal-run-0',
          emptyDir: {},
        },
        {
          name: 'tekton-creds-init-home-1',
          emptyDir: {
            medium: 'Memory',
          },
        },
        {
          name: 'tekton-internal-run-1',
          emptyDir: {},
        },
        {
          name: 'tekton-creds-init-home-2',
          emptyDir: {
            medium: 'Memory',
          },
        },
        {
          name: 'tekton-internal-run-2',
          emptyDir: {},
        },
        {
          name: 'tekton-creds-init-home-3',
          emptyDir: {
            medium: 'Memory',
          },
        },
        {
          name: 'tekton-internal-run-3',
          emptyDir: {},
        },
        {
          name: 'tekton-creds-init-home-4',
          emptyDir: {
            medium: 'Memory',
          },
        },
        {
          name: 'tekton-internal-run-4',
          emptyDir: {},
        },
        {
          name: 'tekton-creds-init-home-5',
          emptyDir: {
            medium: 'Memory',
          },
        },
        {
          name: 'tekton-internal-run-5',
          emptyDir: {},
        },
        {
          name: 'varlibcontainers',
          emptyDir: {},
        },
        {
          name: 'registry-auth',
          secret: {
            secretName: 'devfile-sample-6wo1-x99m8',
            defaultMode: 420,
            optional: true,
          },
        },
        {
          name: 'ws-gs675',
          persistentVolumeClaim: {
            claimName: 'pvc-4d6d12422a',
          },
        },
        {
          name: 'kube-api-access-8pr65',
          projected: {
            sources: [
              {
                serviceAccountToken: {
                  expirationSeconds: 3607,
                  path: 'token',
                },
              },
              {
                configMap: {
                  name: 'kube-root-ca.crt',
                  items: [
                    {
                      key: 'ca.crt',
                      path: 'ca.crt',
                    },
                  ],
                },
              },
              {
                downwardAPI: {
                  items: [
                    {
                      path: 'namespace',
                      fieldRef: {
                        apiVersion: 'v1',
                        fieldPath: 'metadata.namespace',
                      },
                    },
                  ],
                },
              },
              {
                configMap: {
                  name: 'openshift-service-ca.crt',
                  items: [
                    {
                      key: 'service-ca.crt',
                      path: 'service-ca.crt',
                    },
                  ],
                },
              },
            ],
            defaultMode: 420,
          },
        },
        {
          name: 'config-trusted-cabundle-volume',
          configMap: {
            name: 'config-trusted-cabundle',
            items: [
              {
                key: 'ca-bundle.crt',
                path: 'ca-bundle.crt',
              },
            ],
            defaultMode: 420,
          },
        },
        {
          name: 'config-service-cabundle-volume',
          configMap: {
            name: 'config-service-cabundle',
            items: [
              {
                key: 'service-ca.crt',
                path: 'service-ca.crt',
              },
            ],
            defaultMode: 420,
          },
        },
      ],
      initContainers: [
        {
          name: 'prepare',
          image:
            'registry.redhat.io/openshift-pipelines/pipelines-entrypoint-rhel8@sha256:08cbd580243004da2e2376a0af1d6496ad9e6ef2e42da951fbdbadc0dca30c69',
          command: [
            '/ko-app/entrypoint',
            'init',
            '/ko-app/entrypoint',
            '/tekton/bin/entrypoint',
            'step-build',
            'step-sbom-get',
            'step-analyse-dependencies-java-sbom',
            'step-merge-sboms',
            'step-inject-sbom-and-push',
            'step-upload-sbom',
          ],
          workingDir: '/',
          resources: {
            limits: {
              cpu: '2',
              memory: '2Gi',
            },
          },
          volumeMounts: [
            {
              name: 'tekton-internal-bin',
              mountPath: '/tekton/bin',
            },
            {
              name: 'tekton-internal-steps',
              mountPath: '/tekton/steps',
            },
            {
              name: 'kube-api-access-8pr65',
              readOnly: true,
              mountPath: '/var/run/secrets/kubernetes.io/serviceaccount',
            },
          ],
          terminationMessagePath: '/dev/termination-log',
          terminationMessagePolicy: 'File',
          securityContext: {
            capabilities: {
              drop: ['MKNOD'],
            },
            allowPrivilegeEscalation: false,
          },
        },
        {
          name: 'place-scripts',
          image:
            'registry.redhat.io/ubi8/ubi-minimal@sha256:6910799b75ad41f00891978575a0d955be2f800c51b955af73926e7ab59a41c3',
          command: ['sh'],
          args: [
            '-c',
            'scriptfile="/tekton/scripts/script-0-wbmj4"\ntouch ${scriptfile} \u0026\u0026 chmod +x ${scriptfile}\ncat \u003e ${scriptfile} \u003c\u003c \'_EOF_\'\nIyEvYmluL3NoCnNldCAtZQppZiBbIC1lICIkQ09OVEVYVC8kRE9DS0VSRklMRSIgXTsgdGhlbgogIGRvY2tlcmZpbGVfcGF0aD0iJENPTlRFWFQvJERPQ0tFUkZJTEUiCmVsaWYgWyAtZSAiJERPQ0tFUkZJTEUiIF07IHRoZW4KICBkb2NrZXJmaWxlX3BhdGg9IiRET0NLRVJGSUxFIgplbGlmIGVjaG8gIiRET0NLRVJGSUxFIiB8IGdyZXAgLXEgIl5odHRwc1w/Oi8vIjsgdGhlbgogIGVjaG8gIkZldGNoIERvY2tlcmZpbGUgZnJvbSAkRE9DS0VSRklMRSIKICBkb2NrZXJmaWxlX3BhdGg9JChta3RlbXAgLS1zdWZmaXg9LURvY2tlcmZpbGUpCiAgaHR0cF9jb2RlPSQoY3VybCAtcyAtTCAtdyAiJXtodHRwX2NvZGV9IiAtLW91dHB1dCAiJGRvY2tlcmZpbGVfcGF0aCIgIiRET0NLRVJGSUxFIikKICBpZiBbICRodHRwX2NvZGUgIT0gMjAwIF07IHRoZW4KICAgIGVjaG8gIk5vIERvY2tlcmZpbGUgaXMgZmV0Y2hlZC4gU2VydmVyIHJlc3BvbmRzICRodHRwX2NvZGUiCiAgICBleGl0IDEKICBmaQplbHNlCiAgZWNobyAiQ2Fubm90IGZpbmQgRG9ja2VyZmlsZSAkRE9DS0VSRklMRSIKICBleGl0IDEKZmkKaWYgWyAtbiAiJEpWTV9CVUlMRF9XT1JLU1BBQ0VfQVJUSUZBQ1RfQ0FDSEVfUE9SVF84MF9UQ1BfQUREUiIgXSAmJiBncmVwIC1xICdeXHMqUlVOIFwoLi9cKVw/bXZuJyAiJGRvY2tlcmZpbGVfcGF0aCI7IHRoZW4KICBzZWQgLWkgLWUgInN8XlxzKlJVTiBcKFwoLi9cKVw/bXZuXCguKlwpXCl8UlVOIGVjaG8gXCI8c2V0dGluZ3M+PG1pcnJvcnM+PG1pcnJvcj48aWQ+bWlycm9yLmRlZmF1bHQ8L2lkPjx1cmw+aHR0cDovLyRKVk1fQlVJTERfV09SS1NQQUNFX0FSVElGQUNUX0NBQ0hFX1BPUlRfODBfVENQX0FERFIvdjEvY2FjaGUvZGVmYXVsdC8wLzwvdXJsPjxtaXJyb3JPZj4qPC9taXJyb3JPZj48L21pcnJvcj48L21pcnJvcnM+PC9zZXR0aW5ncz5cIiA+IC90bXAvc2V0dGluZ3MueWFtbDsgXDEgLXMgL3RtcC9zZXR0aW5ncy55YW1sfGciICIkZG9ja2VyZmlsZV9wYXRoIgogIHRvdWNoIC92YXIvbGliL2NvbnRhaW5lcnMvamF2YQpmaQoKCnNlZCAtaSAncy9eXHMqc2hvcnQtbmFtZS1tb2RlXHMqPVxzKi4qL3Nob3J0LW5hbWUtbW9kZSA9ICJkaXNhYmxlZCIvJyAvZXRjL2NvbnRhaW5lcnMvcmVnaXN0cmllcy5jb25mCgojIFNldHRpbmcgbmV3IG5hbWVzcGFjZSB0byBydW4gYnVpbGRhaCAtIDJeMzItMgplY2hvICdyb290OjE6NDI5NDk2NzI5NCcgfCB0ZWUgLWEgL2V0Yy9zdWJ1aWQgPj4gL2V0Yy9zdWJnaWQKCmlmIFsgIiR7SEVSTUVUSUN9IiA9PSAidHJ1ZSIgXTsgdGhlbgogIEJVSUxEQUhfQVJHUz0iLS1wdWxsPW5ldmVyIgogIFVOU0hBUkVfQVJHUz0iLS1uZXQiCiAgZm9yIGltYWdlIGluICQoZ3JlcCAtaSAnXlxzKkZST00nICIkZG9ja2VyZmlsZV9wYXRoIiB8IHNlZCAncy8tLXBsYXRmb3JtPVxTKi8vJyB8IGF3ayAne3ByaW50ICQyfScpOyBkbwogICAgdW5zaGFyZSAtVWZwIC0ta2VlcC1jYXBzIC1yIC0tbWFwLXVzZXJzIDEsMSw2NTUzNiAtLW1hcC1ncm91cHMgMSwxLDY1NTM2IC0tIGJ1aWxkYWggcHVsbCAkaW1hZ2UKICBkb25lCiAgZWNobyAiQnVpbGQgd2lsbCBiZSBleGVjdXRlZCB3aXRoIG5ldHdvcmsgaXNvbGF0aW9uIgpmaQoKaWYgWyAtbiAiJHtQUkVGRVRDSF9JTlBVVH0iIF07IHRoZW4KICBtdiBjYWNoaTIgL3RtcC8KICBjaG1vZCAtUiBnbytyd1ggL3RtcC9jYWNoaTIKICBWT0xVTUVfTU9VTlRTPSItLXZvbHVtZSAvdG1wL2NhY2hpMjovY2FjaGkyIgogIHNlZCAtaSAnc3xeXHMqcnVuIHxSVU4gLiAvY2FjaGkyL2NhY2hpMi5lbnYgXCZcJiBcXFxuICAgIHxpJyAiJGRvY2tlcmZpbGVfcGF0aCIKICBlY2hvICJQcmVmZXRjaGVkIGNvbnRlbnQgd2lsbCBiZSBtYWRlIGF2YWlsYWJsZSIKZmkKCnVuc2hhcmUgLVVmICRVTlNIQVJFX0FSR1MgLS1rZWVwLWNhcHMgLXIgLS1tYXAtdXNlcnMgMSwxLDY1NTM2IC0tbWFwLWdyb3VwcyAxLDEsNjU1MzYgLS0gYnVpbGRhaCBidWQgXAogICRWT0xVTUVfTU9VTlRTIFwKICAkQlVJTERBSF9BUkdTIFwKICAtLXRscy12ZXJpZnk9JFRMU1ZFUklGWSAtLW5vLWNhY2hlIFwKICAtLXVsaW1pdCBub2ZpbGU9NDA5Njo0MDk2IFwKICAtZiAiJGRvY2tlcmZpbGVfcGF0aCIgLXQgJElNQUdFICRDT05URVhUCgpjb250YWluZXI9JChidWlsZGFoIGZyb20gLS1wdWxsLW5ldmVyICRJTUFHRSkKYnVpbGRhaCBtb3VudCAkY29udGFpbmVyIHwgdGVlIC93b3Jrc3BhY2UvY29udGFpbmVyX3BhdGgKZWNobyAkY29udGFpbmVyID4gL3dvcmtzcGFjZS9jb250YWluZXJfbmFtZQo=\n_EOF_\n/tekton/bin/entrypoint decode-script "${scriptfile}"\nscriptfile="/tekton/scripts/script-1-844vr"\ntouch ${scriptfile} \u0026\u0026 chmod +x ${scriptfile}\ncat \u003e ${scriptfile} \u003c\u003c \'_EOF_\'\nIyEvYmluL3NoCnNldCAtZQpzeWZ0IGRpcjovd29ya3NwYWNlL3NvdXJjZSAtLWZpbGU9L3dvcmtzcGFjZS9zb3VyY2Uvc2JvbS1zb3VyY2UuanNvbiAtLW91dHB1dD1jeWNsb25lZHgtanNvbgpmaW5kICQoY2F0IC93b3Jrc3BhY2UvY29udGFpbmVyX3BhdGgpIC14dHlwZSBsIC1kZWxldGUKc3lmdCBkaXI6JChjYXQgL3dvcmtzcGFjZS9jb250YWluZXJfcGF0aCkgLS1maWxlPS93b3Jrc3BhY2Uvc291cmNlL3Nib20taW1hZ2UuanNvbiAtLW91dHB1dD1jeWNsb25lZHgtanNvbgo=\n_EOF_\n/tekton/bin/entrypoint decode-script "${scriptfile}"\nscriptfile="/tekton/scripts/script-2-742d5"\ntouch ${scriptfile} \u0026\u0026 chmod +x ${scriptfile}\ncat \u003e ${scriptfile} \u003c\u003c \'_EOF_\'\nIyEvYmluL3NoCnNldCAtZQppZiBbIC1mIC92YXIvbGliL2NvbnRhaW5lcnMvamF2YSBdOyB0aGVuCiAgL29wdC9qYm9zcy9jb250YWluZXIvamF2YS9ydW4vcnVuLWphdmEuc2ggYW5hbHlzZS1kZXBlbmRlbmNpZXMgcGF0aCAkKGNhdCAvd29ya3NwYWNlL2NvbnRhaW5lcl9wYXRoKSAtcyAvd29ya3NwYWNlL3NvdXJjZS9zYm9tLWltYWdlLmpzb24gLS10YXNrLXJ1bi1uYW1lIGRldmZpbGUtc2FtcGxlLTZ3bzEteDk5bTgtYnVpbGQtY29udGFpbmVyIC0tcHVibGlzaGVycyAvdGVrdG9uL3Jlc3VsdHMvU0JPTV9KQVZBX0NPTVBPTkVOVFNfQ09VTlQKICBzZWQgLWkgJ3MvXi8gLycgL3Rla3Rvbi9yZXN1bHRzL1NCT01fSkFWQV9DT01QT05FTlRTX0NPVU5UICMgV29ya2Fyb3VuZCBmb3IgU1JWS1AtMjg3NQplbHNlCiAgdG91Y2ggL3Rla3Rvbi9yZXN1bHRzL0pBVkFfQ09NTVVOSVRZX0RFUEVOREVOQ0lFUwpmaQo=\n_EOF_\n/tekton/bin/entrypoint decode-script "${scriptfile}"\nscriptfile="/tekton/scripts/script-3-ppwqw"\ntouch ${scriptfile} \u0026\u0026 chmod +x ${scriptfile}\ncat \u003e ${scriptfile} \u003c\u003c \'_EOF_\'\nIyEvYmluL3B5dGhvbjMKaW1wb3J0IGpzb24KaW1wb3J0IG9zCgojIGxvYWQgU0JPTXMKd2l0aCBvcGVuKCIuL3Nib20taW1hZ2UuanNvbiIpIGFzIGY6CiAgaW1hZ2Vfc2JvbSA9IGpzb24ubG9hZChmKQoKd2l0aCBvcGVuKCIuL3Nib20tc291cmNlLmpzb24iKSBhcyBmOgogIHNvdXJjZV9zYm9tID0ganNvbi5sb2FkKGYpCgojIGZldGNoIHVuaXF1ZSBjb21wb25lbnRzIGZyb20gYXZhaWxhYmxlIFNCT01zCmRlZiBnZXRfaWRlbnRpZmllcihjb21wb25lbnQpOgogIHJldHVybiBjb21wb25lbnRbIm5hbWUiXSArICdAJyArIGNvbXBvbmVudC5nZXQoInZlcnNpb24iLCAiIikKCmV4aXN0aW5nX2NvbXBvbmVudHMgPSBbZ2V0X2lkZW50aWZpZXIoY29tcG9uZW50KSBmb3IgY29tcG9uZW50IGluIGltYWdlX3Nib21bImNvbXBvbmVudHMiXV0KCmZvciBjb21wb25lbnQgaW4gc291cmNlX3Nib21bImNvbXBvbmVudHMiXToKICBpZiBnZXRfaWRlbnRpZmllcihjb21wb25lbnQpIG5vdCBpbiBleGlzdGluZ19jb21wb25lbnRzOgogICAgaW1hZ2Vfc2JvbVsiY29tcG9uZW50cyJdLmFwcGVuZChjb21wb25lbnQpCiAgICBleGlzdGluZ19jb21wb25lbnRzLmFwcGVuZChnZXRfaWRlbnRpZmllcihjb21wb25lbnQpKQoKaW1hZ2Vfc2JvbVsiY29tcG9uZW50cyJdLnNvcnQoa2V5PWxhbWJkYSBjOiBnZXRfaWRlbnRpZmllcihjKSkKCiMgd3JpdGUgdGhlIEN5Y2xvbmVEWCB1bmlmaWVkIFNCT00Kd2l0aCBvcGVuKCIuL3Nib20tY3ljbG9uZWR4Lmpzb24iLCAidyIpIGFzIGY6CiAganNvbi5kdW1wKGltYWdlX3Nib20sIGYsIGluZGVudD00KQoKIyBjcmVhdGUgYW5kIHdyaXRlIHRoZSBQVVJMIHVuaWZpZWQgU0JPTQpwdXJscyA9IFt7InB1cmwiOiBjb21wb25lbnRbInB1cmwiXX0gZm9yIGNvbXBvbmVudCBpbiBpbWFnZV9zYm9tWyJjb21wb25lbnRzIl0gaWYgInB1cmwiIGluIGNvbXBvbmVudF0KcHVybF9jb250ZW50ID0geyJpbWFnZV9jb250ZW50cyI6IHsiZGVwZW5kZW5jaWVzIjogcHVybHN9fQoKd2l0aCBvcGVuKCJzYm9tLXB1cmwuanNvbiIsICJ3IikgYXMgb3V0cHV0X2ZpbGU6CiAganNvbi5kdW1wKHB1cmxfY29udGVudCwgb3V0cHV0X2ZpbGUsIGluZGVudD00KQo=\n_EOF_\n/tekton/bin/entrypoint decode-script "${scriptfile}"\nscriptfile="/tekton/scripts/script-4-tfzlh"\ntouch ${scriptfile} \u0026\u0026 chmod +x ${scriptfile}\ncat \u003e ${scriptfile} \u003c\u003c \'_EOF_\'\nIyEvYmluL3NoCnNldCAtZQojIEV4cG9zZSBiYXNlIGltYWdlIGRpZ2VzdHMKYnVpbGRhaCBpbWFnZXMgLS1mb3JtYXQgJ3t7IC5OYW1lIH19Ont7IC5UYWcgfX1Ae3sgLkRpZ2VzdCB9fScgfCBncmVwIC12ICRJTUFHRSA+IC90ZWt0b24vcmVzdWx0cy9CQVNFX0lNQUdFU19ESUdFU1RTCgpiYXNlX2ltYWdlX25hbWU9JChidWlsZGFoIGluc3BlY3QgLS1mb3JtYXQgJ3t7IGluZGV4IC5JbWFnZUFubm90YXRpb25zICJvcmcub3BlbmNvbnRhaW5lcnMuaW1hZ2UuYmFzZS5uYW1lIn19JyAkSU1BR0UpCmJhc2VfaW1hZ2VfZGlnZXN0PSQoYnVpbGRhaCBpbnNwZWN0IC0tZm9ybWF0ICd7eyBpbmRleCAuSW1hZ2VBbm5vdGF0aW9ucyAib3JnLm9wZW5jb250YWluZXJzLmltYWdlLmJhc2UuZGlnZXN0In19JyAkSU1BR0UpCmNvbnRhaW5lcj0kKGJ1aWxkYWggZnJvbSAtLXB1bGwtbmV2ZXIgJElNQUdFKQpidWlsZGFoIGNvcHkgJGNvbnRhaW5lciBzYm9tLWN5Y2xvbmVkeC5qc29uIHNib20tcHVybC5qc29uIC9yb290L2J1aWxkaW5mby9jb250ZW50X21hbmlmZXN0cy8KYnVpbGRhaCBjb25maWcgLWEgb3JnLm9wZW5jb250YWluZXJzLmltYWdlLmJhc2UubmFtZT0ke2Jhc2VfaW1hZ2VfbmFtZX0gLWEgb3JnLm9wZW5jb250YWluZXJzLmltYWdlLmJhc2UuZGlnZXN0PSR7YmFzZV9pbWFnZV9kaWdlc3R9ICRjb250YWluZXIKYnVpbGRhaCBjb21taXQgJGNvbnRhaW5lciAkSU1BR0UKYnVpbGRhaCBwdXNoIFwKICAtLXRscy12ZXJpZnk9JFRMU1ZFUklGWSBcCiAgLS1kaWdlc3RmaWxlIC93b3Jrc3BhY2Uvc291cmNlL2ltYWdlLWRpZ2VzdCAkSU1BR0UgXAogIGRvY2tlcjovLyRJTUFHRQpjYXQgIi93b3Jrc3BhY2Uvc291cmNlIi9pbWFnZS1kaWdlc3QgfCB0ZWUgL3Rla3Rvbi9yZXN1bHRzL0lNQUdFX0RJR0VTVAplY2hvIC1uICIkSU1BR0UiIHwgdGVlIC90ZWt0b24vcmVzdWx0cy9JTUFHRV9VUkwK\n_EOF_\n/tekton/bin/entrypoint decode-script "${scriptfile}"\n',
          ],
          resources: {
            limits: {
              cpu: '2',
              memory: '2Gi',
            },
          },
          volumeMounts: [
            {
              name: 'tekton-internal-scripts',
              mountPath: '/tekton/scripts',
            },
            {
              name: 'tekton-internal-bin',
              mountPath: '/tekton/bin',
            },
            {
              name: 'kube-api-access-8pr65',
              readOnly: true,
              mountPath: '/var/run/secrets/kubernetes.io/serviceaccount',
            },
          ],
          terminationMessagePath: '/dev/termination-log',
          terminationMessagePolicy: 'File',
          securityContext: {
            capabilities: {
              drop: ['MKNOD'],
            },
            allowPrivilegeEscalation: false,
          },
        },
        {
          name: 'working-dir-initializer',
          image:
            'registry.redhat.io/openshift-pipelines/pipelines-workingdirinit-rhel8@sha256:bdb4bcd5e75d236ef1f53cc094c37bb02ba58582fd593decd0c29f5ae4be0c22',
          command: ['/ko-app/workingdirinit'],
          args: ['/workspace/source'],
          workingDir: '/workspace',
          resources: {
            limits: {
              cpu: '2',
              memory: '2Gi',
            },
          },
          volumeMounts: [
            {
              name: 'tekton-internal-workspace',
              mountPath: '/workspace',
            },
            {
              name: 'tekton-internal-home',
              mountPath: '/tekton/home',
            },
            {
              name: 'tekton-internal-results',
              mountPath: '/tekton/results',
            },
            {
              name: 'tekton-internal-steps',
              readOnly: true,
              mountPath: '/tekton/steps',
            },
            {
              name: 'kube-api-access-8pr65',
              readOnly: true,
              mountPath: '/var/run/secrets/kubernetes.io/serviceaccount',
            },
          ],
          terminationMessagePath: '/dev/termination-log',
          terminationMessagePolicy: 'File',
          securityContext: {
            capabilities: {
              drop: ['MKNOD'],
            },
            allowPrivilegeEscalation: false,
          },
        },
      ],
      containers: [
        {
          name: 'step-build',
          image: 'quay.io/redhat-appstudio/buildah:v1.28',
          command: ['/tekton/bin/entrypoint'],
          args: [
            '-wait_file',
            '/tekton/downward/ready',
            '-wait_file_content',
            '-post_file',
            '/tekton/run/0/out',
            '-termination_path',
            '/tekton/termination',
            '-step_metadata_dir',
            '/tekton/run/0/status',
            '-docker-cfg=pipeline-dockercfg-bstjn',
            '-results',
            'IMAGE_DIGEST,IMAGE_URL,BASE_IMAGES_DIGESTS,SBOM_JAVA_COMPONENTS_COUNT,JAVA_COMMUNITY_DEPENDENCIES',
            '-entrypoint',
            '/tekton/scripts/script-0-wbmj4',
            '--',
          ],
          workingDir: '/workspace/source',
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
              name: 'DOCKER_CONFIG',
              value: '/secrets/registry-auth',
            },
            {
              name: 'CONTEXT',
              value: '.',
            },
            {
              name: 'DOCKERFILE',
              value: 'Dockerfile',
            },
            {
              name: 'IMAGE',
              value: 'quay.io/redhat-appstudio/user-workload:build-f3d3f-1680088395',
            },
            {
              name: 'TLSVERIFY',
              value: 'true',
            },
            {
              name: 'SSL_CERT_DIR',
              value:
                '/tekton-custom-certs:/etc/ssl/certs:/etc/pki/tls/certs:/system/etc/security/cacerts',
            },
          ],
          resources: {
            limits: {
              cpu: '2',
              memory: '4Gi',
            },
          },
          volumeMounts: [
            {
              name: 'varlibcontainers',
              mountPath: '/var/lib/containers',
            },
            {
              name: 'registry-auth',
              mountPath: '/secrets/registry-auth',
            },
            {
              name: 'ws-gs675',
              mountPath: '/workspace/source',
            },
            {
              name: 'tekton-internal-scripts',
              readOnly: true,
              mountPath: '/tekton/scripts',
            },
            {
              name: 'tekton-internal-downward',
              readOnly: true,
              mountPath: '/tekton/downward',
            },
            {
              name: 'tekton-creds-init-home-0',
              mountPath: '/tekton/creds',
            },
            {
              name: 'tekton-internal-run-0',
              mountPath: '/tekton/run/0',
            },
            {
              name: 'tekton-internal-run-1',
              readOnly: true,
              mountPath: '/tekton/run/1',
            },
            {
              name: 'tekton-internal-run-2',
              readOnly: true,
              mountPath: '/tekton/run/2',
            },
            {
              name: 'tekton-internal-run-3',
              readOnly: true,
              mountPath: '/tekton/run/3',
            },
            {
              name: 'tekton-internal-run-4',
              readOnly: true,
              mountPath: '/tekton/run/4',
            },
            {
              name: 'tekton-internal-run-5',
              readOnly: true,
              mountPath: '/tekton/run/5',
            },
            {
              name: 'tekton-internal-bin',
              readOnly: true,
              mountPath: '/tekton/bin',
            },
            {
              name: 'tekton-internal-workspace',
              mountPath: '/workspace',
            },
            {
              name: 'tekton-internal-home',
              mountPath: '/tekton/home',
            },
            {
              name: 'tekton-internal-results',
              mountPath: '/tekton/results',
            },
            {
              name: 'tekton-internal-steps',
              readOnly: true,
              mountPath: '/tekton/steps',
            },
            {
              name: 'tekton-internal-secret-volume-pipeline-dockercfg-bstjn-46jfg',
              mountPath: '/tekton/creds-secrets/pipeline-dockercfg-bstjn',
            },
            {
              name: 'kube-api-access-8pr65',
              readOnly: true,
              mountPath: '/var/run/secrets/kubernetes.io/serviceaccount',
            },
            {
              name: 'config-trusted-cabundle-volume',
              readOnly: true,
              mountPath: '/tekton-custom-certs/ca-bundle.crt',
              subPath: 'ca-bundle.crt',
            },
            {
              name: 'config-service-cabundle-volume',
              readOnly: true,
              mountPath: '/tekton-custom-certs/service-ca.crt',
              subPath: 'service-ca.crt',
            },
          ],
          terminationMessagePath: '/tekton/termination',
          terminationMessagePolicy: 'File',
          securityContext: {
            capabilities: {
              add: ['SETFCAP'],
              drop: ['MKNOD'],
            },
            allowPrivilegeEscalation: false,
          },
        },
        {
          name: 'step-sbom-get',
          image: 'quay.io/redhat-appstudio/syft:v0.47.0',
          command: ['/tekton/bin/entrypoint'],
          args: [
            '-wait_file',
            '/tekton/run/0/out',
            '-post_file',
            '/tekton/run/1/out',
            '-termination_path',
            '/tekton/termination',
            '-step_metadata_dir',
            '/tekton/run/1/status',
            '-docker-cfg=pipeline-dockercfg-bstjn',
            '-results',
            'IMAGE_DIGEST,IMAGE_URL,BASE_IMAGES_DIGESTS,SBOM_JAVA_COMPONENTS_COUNT,JAVA_COMMUNITY_DEPENDENCIES',
            '-entrypoint',
            '/tekton/scripts/script-1-844vr',
            '--',
          ],
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
              name: 'DOCKER_CONFIG',
              value: '/secrets/registry-auth',
            },
            {
              name: 'CONTEXT',
              value: '.',
            },
            {
              name: 'DOCKERFILE',
              value: 'Dockerfile',
            },
            {
              name: 'IMAGE',
              value: 'quay.io/redhat-appstudio/user-workload:build-f3d3f-1680088395',
            },
            {
              name: 'TLSVERIFY',
              value: 'true',
            },
            {
              name: 'SSL_CERT_DIR',
              value:
                '/tekton-custom-certs:/etc/ssl/certs:/etc/pki/tls/certs:/system/etc/security/cacerts',
            },
          ],
          resources: {
            limits: {
              cpu: '2',
              memory: '2Gi',
            },
          },
          volumeMounts: [
            {
              name: 'varlibcontainers',
              mountPath: '/var/lib/containers',
            },
            {
              name: 'ws-gs675',
              mountPath: '/workspace/source',
            },
            {
              name: 'tekton-internal-scripts',
              readOnly: true,
              mountPath: '/tekton/scripts',
            },
            {
              name: 'tekton-creds-init-home-1',
              mountPath: '/tekton/creds',
            },
            {
              name: 'tekton-internal-run-0',
              readOnly: true,
              mountPath: '/tekton/run/0',
            },
            {
              name: 'tekton-internal-run-1',
              mountPath: '/tekton/run/1',
            },
            {
              name: 'tekton-internal-run-2',
              readOnly: true,
              mountPath: '/tekton/run/2',
            },
            {
              name: 'tekton-internal-run-3',
              readOnly: true,
              mountPath: '/tekton/run/3',
            },
            {
              name: 'tekton-internal-run-4',
              readOnly: true,
              mountPath: '/tekton/run/4',
            },
            {
              name: 'tekton-internal-run-5',
              readOnly: true,
              mountPath: '/tekton/run/5',
            },
            {
              name: 'tekton-internal-bin',
              readOnly: true,
              mountPath: '/tekton/bin',
            },
            {
              name: 'tekton-internal-workspace',
              mountPath: '/workspace',
            },
            {
              name: 'tekton-internal-home',
              mountPath: '/tekton/home',
            },
            {
              name: 'tekton-internal-results',
              mountPath: '/tekton/results',
            },
            {
              name: 'tekton-internal-steps',
              readOnly: true,
              mountPath: '/tekton/steps',
            },
            {
              name: 'tekton-internal-secret-volume-pipeline-dockercfg-bstjn-46jfg',
              mountPath: '/tekton/creds-secrets/pipeline-dockercfg-bstjn',
            },
            {
              name: 'kube-api-access-8pr65',
              readOnly: true,
              mountPath: '/var/run/secrets/kubernetes.io/serviceaccount',
            },
            {
              name: 'config-trusted-cabundle-volume',
              readOnly: true,
              mountPath: '/tekton-custom-certs/ca-bundle.crt',
              subPath: 'ca-bundle.crt',
            },
            {
              name: 'config-service-cabundle-volume',
              readOnly: true,
              mountPath: '/tekton-custom-certs/service-ca.crt',
              subPath: 'service-ca.crt',
            },
          ],
          terminationMessagePath: '/tekton/termination',
          terminationMessagePolicy: 'File',
          securityContext: {
            capabilities: {
              drop: ['MKNOD'],
            },
            allowPrivilegeEscalation: false,
          },
        },
        {
          name: 'step-analyse-dependencies-java-sbom',
          image:
            'quay.io/redhat-appstudio/hacbs-jvm-build-request-processor:1d417e6f1f3e68c6c537333b5759796eddae0afc',
          command: ['/tekton/bin/entrypoint'],
          args: [
            '-wait_file',
            '/tekton/run/1/out',
            '-post_file',
            '/tekton/run/2/out',
            '-termination_path',
            '/tekton/termination',
            '-step_metadata_dir',
            '/tekton/run/2/status',
            '-docker-cfg=pipeline-dockercfg-bstjn',
            '-results',
            'IMAGE_DIGEST,IMAGE_URL,BASE_IMAGES_DIGESTS,SBOM_JAVA_COMPONENTS_COUNT,JAVA_COMMUNITY_DEPENDENCIES',
            '-entrypoint',
            '/tekton/scripts/script-2-742d5',
            '--',
          ],
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
              name: 'DOCKER_CONFIG',
              value: '/secrets/registry-auth',
            },
            {
              name: 'CONTEXT',
              value: '.',
            },
            {
              name: 'DOCKERFILE',
              value: 'Dockerfile',
            },
            {
              name: 'IMAGE',
              value: 'quay.io/redhat-appstudio/user-workload:build-f3d3f-1680088395',
            },
            {
              name: 'TLSVERIFY',
              value: 'true',
            },
            {
              name: 'SSL_CERT_DIR',
              value:
                '/tekton-custom-certs:/etc/ssl/certs:/etc/pki/tls/certs:/system/etc/security/cacerts',
            },
          ],
          resources: {
            limits: {
              cpu: '2',
              memory: '2Gi',
            },
          },
          volumeMounts: [
            {
              name: 'varlibcontainers',
              mountPath: '/var/lib/containers',
            },
            {
              name: 'ws-gs675',
              mountPath: '/workspace/source',
            },
            {
              name: 'tekton-internal-scripts',
              readOnly: true,
              mountPath: '/tekton/scripts',
            },
            {
              name: 'tekton-creds-init-home-2',
              mountPath: '/tekton/creds',
            },
            {
              name: 'tekton-internal-run-0',
              readOnly: true,
              mountPath: '/tekton/run/0',
            },
            {
              name: 'tekton-internal-run-1',
              readOnly: true,
              mountPath: '/tekton/run/1',
            },
            {
              name: 'tekton-internal-run-2',
              mountPath: '/tekton/run/2',
            },
            {
              name: 'tekton-internal-run-3',
              readOnly: true,
              mountPath: '/tekton/run/3',
            },
            {
              name: 'tekton-internal-run-4',
              readOnly: true,
              mountPath: '/tekton/run/4',
            },
            {
              name: 'tekton-internal-run-5',
              readOnly: true,
              mountPath: '/tekton/run/5',
            },
            {
              name: 'tekton-internal-bin',
              readOnly: true,
              mountPath: '/tekton/bin',
            },
            {
              name: 'tekton-internal-workspace',
              mountPath: '/workspace',
            },
            {
              name: 'tekton-internal-home',
              mountPath: '/tekton/home',
            },
            {
              name: 'tekton-internal-results',
              mountPath: '/tekton/results',
            },
            {
              name: 'tekton-internal-steps',
              readOnly: true,
              mountPath: '/tekton/steps',
            },
            {
              name: 'tekton-internal-secret-volume-pipeline-dockercfg-bstjn-46jfg',
              mountPath: '/tekton/creds-secrets/pipeline-dockercfg-bstjn',
            },
            {
              name: 'kube-api-access-8pr65',
              readOnly: true,
              mountPath: '/var/run/secrets/kubernetes.io/serviceaccount',
            },
            {
              name: 'config-trusted-cabundle-volume',
              readOnly: true,
              mountPath: '/tekton-custom-certs/ca-bundle.crt',
              subPath: 'ca-bundle.crt',
            },
            {
              name: 'config-service-cabundle-volume',
              readOnly: true,
              mountPath: '/tekton-custom-certs/service-ca.crt',
              subPath: 'service-ca.crt',
            },
          ],
          terminationMessagePath: '/tekton/termination',
          terminationMessagePolicy: 'File',
          securityContext: {
            capabilities: {
              drop: ['MKNOD'],
            },
            runAsUser: 0,
            allowPrivilegeEscalation: false,
          },
        },
        {
          name: 'step-merge-sboms',
          image: 'registry.access.redhat.com/ubi9/python-39:1-108',
          command: ['/tekton/bin/entrypoint'],
          args: [
            '-wait_file',
            '/tekton/run/2/out',
            '-post_file',
            '/tekton/run/3/out',
            '-termination_path',
            '/tekton/termination',
            '-step_metadata_dir',
            '/tekton/run/3/status',
            '-docker-cfg=pipeline-dockercfg-bstjn',
            '-results',
            'IMAGE_DIGEST,IMAGE_URL,BASE_IMAGES_DIGESTS,SBOM_JAVA_COMPONENTS_COUNT,JAVA_COMMUNITY_DEPENDENCIES',
            '-entrypoint',
            '/tekton/scripts/script-3-ppwqw',
            '--',
          ],
          workingDir: '/workspace/source',
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
              name: 'DOCKER_CONFIG',
              value: '/secrets/registry-auth',
            },
            {
              name: 'CONTEXT',
              value: '.',
            },
            {
              name: 'DOCKERFILE',
              value: 'Dockerfile',
            },
            {
              name: 'IMAGE',
              value: 'quay.io/redhat-appstudio/user-workload:build-f3d3f-1680088395',
            },
            {
              name: 'TLSVERIFY',
              value: 'true',
            },
            {
              name: 'SSL_CERT_DIR',
              value:
                '/tekton-custom-certs:/etc/ssl/certs:/etc/pki/tls/certs:/system/etc/security/cacerts',
            },
          ],
          resources: {
            limits: {
              cpu: '2',
              memory: '2Gi',
            },
          },
          volumeMounts: [
            {
              name: 'ws-gs675',
              mountPath: '/workspace/source',
            },
            {
              name: 'tekton-internal-scripts',
              readOnly: true,
              mountPath: '/tekton/scripts',
            },
            {
              name: 'tekton-creds-init-home-3',
              mountPath: '/tekton/creds',
            },
            {
              name: 'tekton-internal-run-0',
              readOnly: true,
              mountPath: '/tekton/run/0',
            },
            {
              name: 'tekton-internal-run-1',
              readOnly: true,
              mountPath: '/tekton/run/1',
            },
            {
              name: 'tekton-internal-run-2',
              readOnly: true,
              mountPath: '/tekton/run/2',
            },
            {
              name: 'tekton-internal-run-3',
              mountPath: '/tekton/run/3',
            },
            {
              name: 'tekton-internal-run-4',
              readOnly: true,
              mountPath: '/tekton/run/4',
            },
            {
              name: 'tekton-internal-run-5',
              readOnly: true,
              mountPath: '/tekton/run/5',
            },
            {
              name: 'tekton-internal-bin',
              readOnly: true,
              mountPath: '/tekton/bin',
            },
            {
              name: 'tekton-internal-workspace',
              mountPath: '/workspace',
            },
            {
              name: 'tekton-internal-home',
              mountPath: '/tekton/home',
            },
            {
              name: 'tekton-internal-results',
              mountPath: '/tekton/results',
            },
            {
              name: 'tekton-internal-steps',
              readOnly: true,
              mountPath: '/tekton/steps',
            },
            {
              name: 'tekton-internal-secret-volume-pipeline-dockercfg-bstjn-46jfg',
              mountPath: '/tekton/creds-secrets/pipeline-dockercfg-bstjn',
            },
            {
              name: 'kube-api-access-8pr65',
              readOnly: true,
              mountPath: '/var/run/secrets/kubernetes.io/serviceaccount',
            },
            {
              name: 'config-trusted-cabundle-volume',
              readOnly: true,
              mountPath: '/tekton-custom-certs/ca-bundle.crt',
              subPath: 'ca-bundle.crt',
            },
            {
              name: 'config-service-cabundle-volume',
              readOnly: true,
              mountPath: '/tekton-custom-certs/service-ca.crt',
              subPath: 'service-ca.crt',
            },
          ],
          terminationMessagePath: '/tekton/termination',
          terminationMessagePolicy: 'File',
          securityContext: {
            capabilities: {
              drop: ['MKNOD'],
            },
            runAsUser: 0,
            allowPrivilegeEscalation: false,
          },
        },
        {
          name: 'step-inject-sbom-and-push',
          image:
            'registry.access.redhat.com/ubi9/buildah:9.0.0-19@sha256:c8b1d312815452964885680fc5bc8d99b3bfe9b6961228c71a09c72ca8e915eb',
          command: ['/tekton/bin/entrypoint'],
          args: [
            '-wait_file',
            '/tekton/run/3/out',
            '-post_file',
            '/tekton/run/4/out',
            '-termination_path',
            '/tekton/termination',
            '-step_metadata_dir',
            '/tekton/run/4/status',
            '-docker-cfg=pipeline-dockercfg-bstjn',
            '-results',
            'IMAGE_DIGEST,IMAGE_URL,BASE_IMAGES_DIGESTS,SBOM_JAVA_COMPONENTS_COUNT,JAVA_COMMUNITY_DEPENDENCIES',
            '-entrypoint',
            '/tekton/scripts/script-4-tfzlh',
            '--',
          ],
          workingDir: '/workspace/source',
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
              name: 'DOCKER_CONFIG',
              value: '/secrets/registry-auth',
            },
            {
              name: 'CONTEXT',
              value: '.',
            },
            {
              name: 'DOCKERFILE',
              value: 'Dockerfile',
            },
            {
              name: 'IMAGE',
              value: 'quay.io/redhat-appstudio/user-workload:build-f3d3f-1680088395',
            },
            {
              name: 'TLSVERIFY',
              value: 'true',
            },
            {
              name: 'SSL_CERT_DIR',
              value:
                '/tekton-custom-certs:/etc/ssl/certs:/etc/pki/tls/certs:/system/etc/security/cacerts',
            },
          ],
          resources: {
            limits: {
              cpu: '2',
              memory: '2Gi',
            },
          },
          volumeMounts: [
            {
              name: 'varlibcontainers',
              mountPath: '/var/lib/containers',
            },
            {
              name: 'registry-auth',
              mountPath: '/secrets/registry-auth',
            },
            {
              name: 'ws-gs675',
              mountPath: '/workspace/source',
            },
            {
              name: 'tekton-internal-scripts',
              readOnly: true,
              mountPath: '/tekton/scripts',
            },
            {
              name: 'tekton-creds-init-home-4',
              mountPath: '/tekton/creds',
            },
            {
              name: 'tekton-internal-run-0',
              readOnly: true,
              mountPath: '/tekton/run/0',
            },
            {
              name: 'tekton-internal-run-1',
              readOnly: true,
              mountPath: '/tekton/run/1',
            },
            {
              name: 'tekton-internal-run-2',
              readOnly: true,
              mountPath: '/tekton/run/2',
            },
            {
              name: 'tekton-internal-run-3',
              readOnly: true,
              mountPath: '/tekton/run/3',
            },
            {
              name: 'tekton-internal-run-4',
              mountPath: '/tekton/run/4',
            },
            {
              name: 'tekton-internal-run-5',
              readOnly: true,
              mountPath: '/tekton/run/5',
            },
            {
              name: 'tekton-internal-bin',
              readOnly: true,
              mountPath: '/tekton/bin',
            },
            {
              name: 'tekton-internal-workspace',
              mountPath: '/workspace',
            },
            {
              name: 'tekton-internal-home',
              mountPath: '/tekton/home',
            },
            {
              name: 'tekton-internal-results',
              mountPath: '/tekton/results',
            },
            {
              name: 'tekton-internal-steps',
              readOnly: true,
              mountPath: '/tekton/steps',
            },
            {
              name: 'tekton-internal-secret-volume-pipeline-dockercfg-bstjn-46jfg',
              mountPath: '/tekton/creds-secrets/pipeline-dockercfg-bstjn',
            },
            {
              name: 'kube-api-access-8pr65',
              readOnly: true,
              mountPath: '/var/run/secrets/kubernetes.io/serviceaccount',
            },
            {
              name: 'config-trusted-cabundle-volume',
              readOnly: true,
              mountPath: '/tekton-custom-certs/ca-bundle.crt',
              subPath: 'ca-bundle.crt',
            },
            {
              name: 'config-service-cabundle-volume',
              readOnly: true,
              mountPath: '/tekton-custom-certs/service-ca.crt',
              subPath: 'service-ca.crt',
            },
          ],
          terminationMessagePath: '/tekton/termination',
          terminationMessagePolicy: 'File',
          securityContext: {
            capabilities: {
              add: ['SETFCAP'],
              drop: ['MKNOD'],
            },
            runAsUser: 0,
            allowPrivilegeEscalation: false,
          },
        },
        {
          name: 'step-upload-sbom',
          image:
            'quay.io/redhat-appstudio/cosign@sha256:18b3716a6225727877475e1ab4f2493915e72cffd2ce431e9901d2ed2e4b2c0b',
          command: ['/tekton/bin/entrypoint'],
          args: [
            '-wait_file',
            '/tekton/run/4/out',
            '-post_file',
            '/tekton/run/5/out',
            '-termination_path',
            '/tekton/termination',
            '-step_metadata_dir',
            '/tekton/run/5/status',
            '-docker-cfg=pipeline-dockercfg-bstjn',
            '-results',
            'IMAGE_DIGEST,IMAGE_URL,BASE_IMAGES_DIGESTS,SBOM_JAVA_COMPONENTS_COUNT,JAVA_COMMUNITY_DEPENDENCIES',
            '--',
            'attach',
            'sbom',
            '--sbom',
            'sbom-cyclonedx.json',
            '--type',
            'cyclonedx',
            'quay.io/redhat-appstudio/user-workload:build-f3d3f-1680088395',
          ],
          workingDir: '/workspace/source',
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
              name: 'DOCKER_CONFIG',
              value: '/secrets/registry-auth',
            },
            {
              name: 'CONTEXT',
              value: '.',
            },
            {
              name: 'DOCKERFILE',
              value: 'Dockerfile',
            },
            {
              name: 'IMAGE',
              value: 'quay.io/redhat-appstudio/user-workload:build-f3d3f-1680088395',
            },
            {
              name: 'TLSVERIFY',
              value: 'true',
            },
            {
              name: 'TEKTON_PLATFORM_COMMANDS',
              value: '{"linux/amd64":["/ko-app/cosign"]}',
            },
            {
              name: 'SSL_CERT_DIR',
              value:
                '/tekton-custom-certs:/etc/ssl/certs:/etc/pki/tls/certs:/system/etc/security/cacerts',
            },
          ],
          resources: {
            limits: {
              cpu: '2',
              memory: '2Gi',
            },
          },
          volumeMounts: [
            {
              name: 'registry-auth',
              mountPath: '/secrets/registry-auth',
            },
            {
              name: 'ws-gs675',
              mountPath: '/workspace/source',
            },
            {
              name: 'tekton-creds-init-home-5',
              mountPath: '/tekton/creds',
            },
            {
              name: 'tekton-internal-run-0',
              readOnly: true,
              mountPath: '/tekton/run/0',
            },
            {
              name: 'tekton-internal-run-1',
              readOnly: true,
              mountPath: '/tekton/run/1',
            },
            {
              name: 'tekton-internal-run-2',
              readOnly: true,
              mountPath: '/tekton/run/2',
            },
            {
              name: 'tekton-internal-run-3',
              readOnly: true,
              mountPath: '/tekton/run/3',
            },
            {
              name: 'tekton-internal-run-4',
              readOnly: true,
              mountPath: '/tekton/run/4',
            },
            {
              name: 'tekton-internal-run-5',
              mountPath: '/tekton/run/5',
            },
            {
              name: 'tekton-internal-bin',
              readOnly: true,
              mountPath: '/tekton/bin',
            },
            {
              name: 'tekton-internal-workspace',
              mountPath: '/workspace',
            },
            {
              name: 'tekton-internal-home',
              mountPath: '/tekton/home',
            },
            {
              name: 'tekton-internal-results',
              mountPath: '/tekton/results',
            },
            {
              name: 'tekton-internal-steps',
              readOnly: true,
              mountPath: '/tekton/steps',
            },
            {
              name: 'tekton-internal-secret-volume-pipeline-dockercfg-bstjn-46jfg',
              mountPath: '/tekton/creds-secrets/pipeline-dockercfg-bstjn',
            },
            {
              name: 'kube-api-access-8pr65',
              readOnly: true,
              mountPath: '/var/run/secrets/kubernetes.io/serviceaccount',
            },
            {
              name: 'config-trusted-cabundle-volume',
              readOnly: true,
              mountPath: '/tekton-custom-certs/ca-bundle.crt',
              subPath: 'ca-bundle.crt',
            },
            {
              name: 'config-service-cabundle-volume',
              readOnly: true,
              mountPath: '/tekton-custom-certs/service-ca.crt',
              subPath: 'service-ca.crt',
            },
          ],
          terminationMessagePath: '/tekton/termination',
          terminationMessagePolicy: 'File',
          securityContext: {
            capabilities: {
              drop: ['MKNOD'],
            },
            allowPrivilegeEscalation: false,
          },
        },
      ],
      restartPolicy: 'Never',
      terminationGracePeriodSeconds: 30,
      activeDeadlineSeconds: 5400,
      dnsPolicy: 'ClusterFirst',
      serviceAccountName: 'pipeline',
      serviceAccount: 'pipeline',
      nodeName: 'ip-10-205-29-65.ec2.internal',
      securityContext: {
        seLinuxOptions: {
          level: 's0:c48,c12',
        },
        fsGroup: 1002280000,
      },
      imagePullSecrets: [
        {
          name: 'pipeline-dockercfg-bstjn',
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
          lastTransitionTime: '2023-03-29T11:14:10Z',
          reason: 'PodCompleted',
        },
        {
          type: 'Ready',
          status: 'False',
          lastProbeTime: null,
          lastTransitionTime: '2023-03-29T11:15:13Z',
          reason: 'PodCompleted',
        },
        {
          type: 'ContainersReady',
          status: 'False',
          lastProbeTime: null,
          lastTransitionTime: '2023-03-29T11:15:13Z',
          reason: 'PodCompleted',
        },
      ],
      hostIP: '10.205.29.65',
      podIP: '10.128.6.201',
      podIPs: [
        {
          ip: '10.128.6.201',
        },
      ],
      startTime: '2023-03-29T11:13:57Z',
      deletionTime: '2023-03-29T11:13:57Z',
      initContainerStatuses: [
        {
          name: 'prepare',
          state: {
            terminated: {
              exitCode: 0,
              reason: 'Completed',
              startedAt: '2023-03-29T11:14:08Z',
              finishedAt: '2023-03-29T11:14:08Z',
              containerID:
                'cri-o://82782d8a81b9c6b7d639b0252bb9d931c302cfc3265ef21c739757e5069c540d',
            },
          },
          lastState: {},
          ready: true,
          restartCount: 0,
          image:
            'registry.redhat.io/openshift-pipelines/pipelines-entrypoint-rhel8@sha256:08cbd580243004da2e2376a0af1d6496ad9e6ef2e42da951fbdbadc0dca30c69',
          imageID:
            'registry.redhat.io/openshift-pipelines/pipelines-entrypoint-rhel8@sha256:08cbd580243004da2e2376a0af1d6496ad9e6ef2e42da951fbdbadc0dca30c69',
          containerID: 'cri-o://82782d8a81b9c6b7d639b0252bb9d931c302cfc3265ef21c739757e5069c540d',
        },
        {
          name: 'place-scripts',
          state: {
            terminated: {
              exitCode: 0,
              reason: 'Completed',
              startedAt: '2023-03-29T11:14:09Z',
              finishedAt: '2023-03-29T11:14:09Z',
              containerID:
                'cri-o://b3e230c1ccd9a61ae857049ea3308ddf954fac0b1edba112380535aa32925819',
            },
          },
          lastState: {},
          ready: true,
          restartCount: 0,
          image:
            'registry.redhat.io/ubi8/ubi-minimal@sha256:6910799b75ad41f00891978575a0d955be2f800c51b955af73926e7ab59a41c3',
          imageID:
            'registry.redhat.io/ubi8/ubi-minimal@sha256:34e7fd35ddac937263dbbdb6d492c9a031dbd38880777bc8ddb9ed0442a0fb03',
          containerID: 'cri-o://b3e230c1ccd9a61ae857049ea3308ddf954fac0b1edba112380535aa32925819',
        },
        {
          name: 'working-dir-initializer',
          state: {
            terminated: {
              exitCode: 0,
              reason: 'Completed',
              startedAt: '2023-03-29T11:14:10Z',
              finishedAt: '2023-03-29T11:14:10Z',
              containerID:
                'cri-o://5a58edc9043697c612531dc720a3f95188b0f6ff721d4514550573129894497b',
            },
          },
          lastState: {},
          ready: true,
          restartCount: 0,
          image:
            'registry.redhat.io/openshift-pipelines/pipelines-workingdirinit-rhel8@sha256:bdb4bcd5e75d236ef1f53cc094c37bb02ba58582fd593decd0c29f5ae4be0c22',
          imageID:
            'registry.redhat.io/openshift-pipelines/pipelines-workingdirinit-rhel8@sha256:235e8c0670c3455330452fceb591f25d6073dd17d868524ac3275c5707f61b37',
          containerID: 'cri-o://5a58edc9043697c612531dc720a3f95188b0f6ff721d4514550573129894497b',
        },
      ],
      containerStatuses: [
        {
          name: 'step-analyse-dependencies-java-sbom',
          state: {
            terminated: {
              exitCode: 0,
              reason: 'Completed',
              message:
                '[{"key":"JAVA_COMMUNITY_DEPENDENCIES","value":"","type":1},{"key":"StartedAt","value":"2023-03-29T11:15:23.889Z","type":3}]',
              startedAt: '2023-03-29T11:14:12Z',
              finishedAt: '2023-03-29T11:15:23Z',
              containerID:
                'cri-o://d22c74373d093b59ac003b0d1430290c548fe0b4190af78261a485a883e42854',
            },
          },
          lastState: {},
          ready: false,
          restartCount: 0,
          image:
            'quay.io/redhat-appstudio/hacbs-jvm-build-request-processor:1d417e6f1f3e68c6c537333b5759796eddae0afc',
          imageID:
            'quay.io/redhat-appstudio/hacbs-jvm-build-request-processor@sha256:b198cf4b33dab59ce8ac25afd4e1001390db29ca2dec83dc8a1e21b0359ce743',
          containerID: 'cri-o://d22c74373d093b59ac003b0d1430290c548fe0b4190af78261a485a883e42854',
        },
        {
          name: 'step-build',
          state: {
            terminated: {
              exitCode: 0,
              reason: 'Completed',
              message: '[{"key":"StartedAt","value":"2023-03-29T11:14:17.574Z","type":3}]',
              startedAt: '2023-03-29T11:14:11Z',
              finishedAt: '2023-03-29T11:15:12Z',
              containerID:
                'cri-o://d8380e3c91c8033b07b575ed7080f9b38190bfe687ec50312da1d9f7d340a4fe',
            },
          },
          lastState: {},
          ready: false,
          restartCount: 0,
          image: 'quay.io/redhat-appstudio/buildah:v1.28',
          imageID:
            'quay.io/redhat-appstudio/buildah@sha256:381e9bfedd59701477621da93892106873a6951b196105d3d2d85c3f6d7b569b',
          containerID: 'cri-o://d8380e3c91c8033b07b575ed7080f9b38190bfe687ec50312da1d9f7d340a4fe',
        },
        {
          name: 'step-inject-sbom-and-push',
          state: {
            terminated: {
              exitCode: 0,
              reason: 'Completed',
              message:
                '[{"key":"IMAGE_DIGEST","value":"sha256:d908ce5beecfb81c28a2f9cd4b26d2eed1ea1f57fe1ce8674188e41a3c063486","type":1},{"key":"IMAGE_URL","value":"quay.io/redhat-appstudio/user-workload:build-f3d3f-1680088395","type":1},{"key":"BASE_IMAGES_DIGESTS","value":"registry.access.redhat.com/ubi8/nodejs-16-minimal:latest@sha256:7b01d525918434fa6d89d12300cefb93c2e3fe729c63d9cf195ffed005759450\\nregistry.access.redhat.com/ubi8/nodejs-16:latest@sha256:dcc790663f4c289abef6c186534793d0f484b3c739aee0b8c9f37f6221beba1d\\n","type":1},{"key":"JAVA_COMMUNITY_DEPENDENCIES","value":"","type":1},{"key":"StartedAt","value":"2023-03-29T11:15:25.176Z","type":3}]',
              startedAt: '2023-03-29T11:14:14Z',
              finishedAt: '2023-03-29T11:15:34Z',
              containerID:
                'cri-o://650c38d70275ffa8acaaf7188e469dcee8864785e0b63c3aeef90dbda3a4bc43',
            },
          },
          lastState: {},
          ready: false,
          restartCount: 0,
          image:
            'registry.access.redhat.com/ubi9/buildah@sha256:c8b1d312815452964885680fc5bc8d99b3bfe9b6961228c71a09c72ca8e915eb',
          imageID:
            'registry.access.redhat.com/ubi9/buildah@sha256:c8b1d312815452964885680fc5bc8d99b3bfe9b6961228c71a09c72ca8e915eb',
          containerID: 'cri-o://650c38d70275ffa8acaaf7188e469dcee8864785e0b63c3aeef90dbda3a4bc43',
        },
        {
          name: 'step-merge-sboms',
          state: {
            terminated: {
              exitCode: 0,
              reason: 'Completed',
              message:
                '[{"key":"JAVA_COMMUNITY_DEPENDENCIES","value":"","type":1},{"key":"StartedAt","value":"2023-03-29T11:15:24.504Z","type":3}]',
              startedAt: '2023-03-29T11:14:13Z',
              finishedAt: '2023-03-29T11:15:24Z',
              containerID:
                'cri-o://6df5e02dd528ef9e992922c12170bfe2d6ec9b8798a1477b8bf1e0daa0ebcc37',
            },
          },
          lastState: {},
          ready: false,
          restartCount: 0,
          image: 'registry.access.redhat.com/ubi9/python-39:1-108',
          imageID:
            'registry.access.redhat.com/ubi9/python-39@sha256:89463fe3e086620617a4f6281640469ba7a7abd2f1b5be13e6cf0f46a6565516',
          containerID: 'cri-o://6df5e02dd528ef9e992922c12170bfe2d6ec9b8798a1477b8bf1e0daa0ebcc37',
        },
        {
          name: 'step-sbom-get',
          state: {
            terminated: {
              exitCode: 0,
              reason: 'Completed',
              message: '[{"key":"StartedAt","value":"2023-03-29T11:15:13.219Z","type":3}]',
              startedAt: '2023-03-29T11:14:12Z',
              finishedAt: '2023-03-29T11:15:23Z',
              containerID:
                'cri-o://a0207251db3d3f3e574ecf6a71b48b5e519f34f83f9a29484b38e76ac3f7c408',
            },
          },
          lastState: {},
          ready: false,
          restartCount: 0,
          image: 'quay.io/redhat-appstudio/syft:v0.47.0',
          imageID:
            'quay.io/redhat-appstudio/syft@sha256:09afc449976230f66848c19bb5ccf344eb0eeb4ed50747e33b53aff49462c319',
          containerID: 'cri-o://a0207251db3d3f3e574ecf6a71b48b5e519f34f83f9a29484b38e76ac3f7c408',
        },
        {
          name: 'step-upload-sbom',
          state: {
            terminated: {
              exitCode: 0,
              reason: 'Completed',
              message:
                '[{"key":"IMAGE_DIGEST","value":"sha256:d908ce5beecfb81c28a2f9cd4b26d2eed1ea1f57fe1ce8674188e41a3c063486","type":1},{"key":"IMAGE_URL","value":"quay.io/redhat-appstudio/user-workload:build-f3d3f-1680088395","type":1},{"key":"BASE_IMAGES_DIGESTS","value":"registry.access.redhat.com/ubi8/nodejs-16-minimal:latest@sha256:7b01d525918434fa6d89d12300cefb93c2e3fe729c63d9cf195ffed005759450\\nregistry.access.redhat.com/ubi8/nodejs-16:latest@sha256:dcc790663f4c289abef6c186534793d0f484b3c739aee0b8c9f37f6221beba1d\\n","type":1},{"key":"JAVA_COMMUNITY_DEPENDENCIES","value":"","type":1},{"key":"StartedAt","value":"2023-03-29T11:15:35.082Z","type":3}]',
              startedAt: '2023-03-29T11:14:14Z',
              finishedAt: '2023-03-29T11:15:36Z',
              containerID:
                'cri-o://18aba62faa34359fb27198f910331be36aeec66f5577e434fe944ff4b87a63d4',
            },
          },
          lastState: {},
          ready: false,
          restartCount: 0,
          image:
            'quay.io/redhat-appstudio/cosign@sha256:18b3716a6225727877475e1ab4f2493915e72cffd2ce431e9901d2ed2e4b2c0b',
          imageID:
            'quay.io/redhat-appstudio/cosign@sha256:18b3716a6225727877475e1ab4f2493915e72cffd2ce431e9901d2ed2e4b2c0b',
          containerID: 'cri-o://18aba62faa34359fb27198f910331be36aeec66f5577e434fe944ff4b87a63d4',
        },
      ],
      qosClass: 'Burstable',
    },
  },
  {
    kind: 'Pod',
    apiVersion: 'a',
    metadata: {
      generateName: 'analytics-deployment-59dd7c47d4-',
      annotations: {
        'openshift.io/scc': 'restricted',
      },
      resourceVersion: '1395096',
      name: 'analytics-deployment-59dd7c47d4-2jp7t',
      uid: '5cec460e-680d-11e9-8c69-5254003f9382',
      namespace: 'testproject3',
      ownerReferences: [
        {
          apiVersion: 'apps/v1',
          kind: 'ReplicaSet',
          name: 'analytics-deployment-59dd7c47d4',
          uid: '5cad37cb-680d-11e9-8c69-5254003f9382',
          controller: true,
          blockOwnerDeletion: true,
        },
      ],
      labels: {
        'app.kubernetes.io/component': 'backend',
        'app.kubernetes.io/instance': 'analytics',
        'app.kubernetes.io/name': 'python',
        'app.kubernetes.io/part-of': 'application-1',
        'app.kubernetes.io/version': '1.0',
        'pod-template-hash': '1588370380',
      },
    },
    spec: {
      containers: [],
    },
    status: {
      phase: 'Running',
    },
  },
  {
    apiVersion: 'v1Alpha',
    kind: 'Pod',
    metadata: {
      name: 'devfile-sample-6wo1-x99m8-clone-repository-pod',
      namespace: 'abhindas-tenant',
      uid: '846cec4b-254c-40fe-b9c2-83619f5f21c3',
      resourceVersion: '97899669',
      creationTimestamp: '2023-03-29T11:13:35Z',
      labels: {
        'app.kubernetes.io/managed-by': 'tekton-pipelines',
        'app.kubernetes.io/version': '0.1',
        'appstudio.openshift.io/application': 'my-app-2',
        'appstudio.openshift.io/component': 'devfile-sample-6wo1',
        'pipelines.appstudio.openshift.io/type': 'build',
        'pipelines.openshift.io/runtime': 'generic',
        'pipelines.openshift.io/strategy': 'docker',
        'pipelines.openshift.io/used-by': 'build-cloud',
        'tekton.dev/memberOf': 'tasks',
        'tekton.dev/pipeline': 'docker-build',
        'tekton.dev/pipelineRun': 'devfile-sample-6wo1-x99m8',
        'tekton.dev/pipelineTask': 'clone-repository',
        'tekton.dev/task': 'git-clone',
        'tekton.dev/taskRun': 'devfile-sample-6wo1-x99m8-clone-repository',
      },
      annotations: {
        'build.appstudio.redhat.com/bundle':
          'quay.io/redhat-appstudio-tekton-catalog/pipeline-docker-build:a7f5eaccbaba1fc86ebd39d82be425b2d551c0e8',
        'build.appstudio.redhat.com/pipeline_name': 'docker-build',
        'build.appstudio.redhat.com/target_branch': '',
        'k8s.ovn.org/pod-networks':
          '{"default":{"ip_addresses":["10.128.6.199/23"],"mac_address":"0a:58:0a:80:06:c7","gateway_ips":["10.128.6.1"],"ip_address":"10.128.6.199/23","gateway_ip":"10.128.6.1"}}',
        'k8s.v1.cni.cncf.io/network-status':
          '[{\n    "name": "ovn-kubernetes",\n    "interface": "eth0",\n    "ips": [\n        "10.128.6.199"\n    ],\n    "mac": "0a:58:0a:80:06:c7",\n    "default": true,\n    "dns": {}\n}]',
        'k8s.v1.cni.cncf.io/networks-status':
          '[{\n    "name": "ovn-kubernetes",\n    "interface": "eth0",\n    "ips": [\n        "10.128.6.199"\n    ],\n    "mac": "0a:58:0a:80:06:c7",\n    "default": true,\n    "dns": {}\n}]',
        'kubernetes.io/limit-ranger':
          'LimitRanger plugin set: cpu, memory limit for container step-clone; cpu, memory request for init container prepare; cpu, memory limit for init container prepare; cpu, memory request for init container place-scripts; cpu, memory limit for init container place-scripts',
        'openshift.io/scc': 'pipelines-scc',
        'pipeline.tekton.dev/release': '9ec444e',
        'results.tekton.dev/record':
          'abhindas-tenant/results/61cc1860-20c0-478a-b2f4-f1ae0407bff1/records/61cc1860-20c0-478a-b2f4-f1ae0407bff1',
        'results.tekton.dev/result': 'abhindas-tenant/results/61cc1860-20c0-478a-b2f4-f1ae0407bff1',
        'tekton.dev/categories': 'Git',
        'tekton.dev/displayName': 'git clone',
        'tekton.dev/pipelines.minVersion': '0.21.0',
        'tekton.dev/platforms': 'linux/amd64,linux/s390x,linux/ppc64le,linux/arm64',
        'tekton.dev/ready': 'READY',
        'tekton.dev/tags': 'git',
      },
      ownerReferences: [
        {
          apiVersion: 'tekton.dev/v1beta1',
          kind: 'TaskRun',
          name: 'devfile-sample-6wo1-x99m8-clone-repository',
          uid: 'deddaef7-af27-43e8-8356-090a0e626f33',
          controller: true,
          blockOwnerDeletion: true,
        },
      ],
      managedFields: [
        {
          manager: 'ip-10-205-25-104',
          operation: 'Update',
          apiVersion: 'v1',
          time: '2023-03-29T11:13:39Z',
          subresource: 'status',
        },
      ],
    },
    spec: {
      volumes: [
        {
          name: 'tekton-internal-workspace',
          emptyDir: {},
        },
        {
          name: 'tekton-internal-home',
          emptyDir: {},
        },
        {
          name: 'tekton-internal-results',
          emptyDir: {},
        },
        {
          name: 'tekton-internal-steps',
          emptyDir: {},
        },
        {
          name: 'tekton-internal-secret-volume-pipeline-dockercfg-bstjn-n8hjt',
          secret: {
            secretName: 'pipeline-dockercfg-bstjn',
            defaultMode: 420,
          },
        },
        {
          name: 'tekton-internal-scripts',
          emptyDir: {},
        },
        {
          name: 'tekton-internal-bin',
          emptyDir: {},
        },
        {
          name: 'tekton-internal-downward',
          downwardAPI: {
            items: [
              {
                path: 'ready',
                fieldRef: {
                  apiVersion: 'v1',
                  fieldPath: "metadata.annotations['tekton.dev/ready']",
                },
              },
            ],
            defaultMode: 420,
          },
        },
        {
          name: 'tekton-creds-init-home-0',
          emptyDir: {
            medium: 'Memory',
          },
        },
        {
          name: 'tekton-internal-run-0',
          emptyDir: {},
        },
        {
          name: 'ws-fkm84',
          persistentVolumeClaim: {
            claimName: 'pvc-4d6d12422a',
          },
        },
        {
          name: 'kube-api-access-kldrk',
          projected: {
            sources: [
              {
                serviceAccountToken: {
                  expirationSeconds: 3607,
                  path: 'token',
                },
              },
              {
                configMap: {
                  name: 'kube-root-ca.crt',
                  items: [
                    {
                      key: 'ca.crt',
                      path: 'ca.crt',
                    },
                  ],
                },
              },
              {
                downwardAPI: {
                  items: [
                    {
                      path: 'namespace',
                      fieldRef: {
                        apiVersion: 'v1',
                        fieldPath: 'metadata.namespace',
                      },
                    },
                  ],
                },
              },
              {
                configMap: {
                  name: 'openshift-service-ca.crt',
                  items: [
                    {
                      key: 'service-ca.crt',
                      path: 'service-ca.crt',
                    },
                  ],
                },
              },
            ],
            defaultMode: 420,
          },
        },
        {
          name: 'config-trusted-cabundle-volume',
          configMap: {
            name: 'config-trusted-cabundle',
            items: [
              {
                key: 'ca-bundle.crt',
                path: 'ca-bundle.crt',
              },
            ],
            defaultMode: 420,
          },
        },
        {
          name: 'config-service-cabundle-volume',
          configMap: {
            name: 'config-service-cabundle',
            items: [
              {
                key: 'service-ca.crt',
                path: 'service-ca.crt',
              },
            ],
            defaultMode: 420,
          },
        },
      ],
      initContainers: [
        {
          name: 'prepare',
          image:
            'registry.redhat.io/openshift-pipelines/pipelines-entrypoint-rhel8@sha256:08cbd580243004da2e2376a0af1d6496ad9e6ef2e42da951fbdbadc0dca30c69',
          command: [
            '/ko-app/entrypoint',
            'init',
            '/ko-app/entrypoint',
            '/tekton/bin/entrypoint',
            'step-clone',
          ],
          workingDir: '/',
          resources: {
            limits: {
              cpu: '2',
              memory: '2Gi',
            },
          },
          volumeMounts: [
            {
              name: 'tekton-internal-bin',
              mountPath: '/tekton/bin',
            },
            {
              name: 'tekton-internal-steps',
              mountPath: '/tekton/steps',
            },
            {
              name: 'kube-api-access-kldrk',
              readOnly: true,
              mountPath: '/var/run/secrets/kubernetes.io/serviceaccount',
            },
          ],
          terminationMessagePath: '/dev/termination-log',
          terminationMessagePolicy: 'File',
          securityContext: {
            capabilities: {
              drop: ['MKNOD'],
            },
            allowPrivilegeEscalation: false,
          },
        },
        {
          name: 'place-scripts',
          image:
            'registry.redhat.io/ubi8/ubi-minimal@sha256:6910799b75ad41f00891978575a0d955be2f800c51b955af73926e7ab59a41c3',
          command: ['sh'],
          args: [
            '-c',
            'scriptfile="/tekton/scripts/script-0-f9gn8"\ntouch ${scriptfile} \u0026\u0026 chmod +x ${scriptfile}\ncat \u003e ${scriptfile} \u003c\u003c \'_EOF_\'\nIyEvdXNyL2Jpbi9lbnYgc2gKc2V0IC1ldQoKaWYgWyAiJHtQQVJBTV9WRVJCT1NFfSIgPSAidHJ1ZSIgXSA7IHRoZW4KICBzZXQgLXgKZmkKCmlmIFsgIiR7V09SS1NQQUNFX0JBU0lDX0FVVEhfRElSRUNUT1JZX0JPVU5EfSIgPSAidHJ1ZSIgXSA7IHRoZW4KICBjcCAiJHtXT1JLU1BBQ0VfQkFTSUNfQVVUSF9ESVJFQ1RPUllfUEFUSH0vLmdpdC1jcmVkZW50aWFscyIgIiR7UEFSQU1fVVNFUl9IT01FfS8uZ2l0LWNyZWRlbnRpYWxzIgogIGNwICIke1dPUktTUEFDRV9CQVNJQ19BVVRIX0RJUkVDVE9SWV9QQVRIfS8uZ2l0Y29uZmlnIiAiJHtQQVJBTV9VU0VSX0hPTUV9Ly5naXRjb25maWciCiAgY2htb2QgNDAwICIke1BBUkFNX1VTRVJfSE9NRX0vLmdpdC1jcmVkZW50aWFscyIKICBjaG1vZCA0MDAgIiR7UEFSQU1fVVNFUl9IT01FfS8uZ2l0Y29uZmlnIgpmaQoKaWYgWyAiJHtXT1JLU1BBQ0VfU1NIX0RJUkVDVE9SWV9CT1VORH0iID0gInRydWUiIF0gOyB0aGVuCiAgY3AgLVIgIiR7V09SS1NQQUNFX1NTSF9ESVJFQ1RPUllfUEFUSH0iICIke1BBUkFNX1VTRVJfSE9NRX0iLy5zc2gKICBjaG1vZCA3MDAgIiR7UEFSQU1fVVNFUl9IT01FfSIvLnNzaAogIGNobW9kIC1SIDQwMCAiJHtQQVJBTV9VU0VSX0hPTUV9Ii8uc3NoLyoKZmkKCkNIRUNLT1VUX0RJUj0iJHtXT1JLU1BBQ0VfT1VUUFVUX1BBVEh9LyR7UEFSQU1fU1VCRElSRUNUT1JZfSIKCmNsZWFuZGlyKCkgewogICMgRGVsZXRlIGFueSBleGlzdGluZyBjb250ZW50cyBvZiB0aGUgcmVwbyBkaXJlY3RvcnkgaWYgaXQgZXhpc3RzLgogICMKICAjIFdlIGRvbid0IGp1c3QgInJtIC1yZiAke0NIRUNLT1VUX0RJUn0iIGJlY2F1c2UgJHtDSEVDS09VVF9ESVJ9IG1pZ2h0IGJlICIvIgogICMgb3IgdGhlIHJvb3Qgb2YgYSBtb3VudGVkIHZvbHVtZS4KICBpZiBbIC1kICIke0NIRUNLT1VUX0RJUn0iIF0gOyB0aGVuCiAgICAjIERlbGV0ZSBub24taGlkZGVuIGZpbGVzIGFuZCBkaXJlY3RvcmllcwogICAgcm0gLXJmICIke0NIRUNLT1VUX0RJUjo/fSIvKgogICAgIyBEZWxldGUgZmlsZXMgYW5kIGRpcmVjdG9yaWVzIHN0YXJ0aW5nIHdpdGggLiBidXQgZXhjbHVkaW5nIC4uCiAgICBybSAtcmYgIiR7Q0hFQ0tPVVRfRElSfSIvLlshLl0qCiAgICAjIERlbGV0ZSBmaWxlcyBhbmQgZGlyZWN0b3JpZXMgc3RhcnRpbmcgd2l0aCAuLiBwbHVzIGFueSBvdGhlciBjaGFyYWN0ZXIKICAgIHJtIC1yZiAiJHtDSEVDS09VVF9ESVJ9Ii8uLj8qCiAgZmkKfQoKaWYgWyAiJHtQQVJBTV9ERUxFVEVfRVhJU1RJTkd9IiA9ICJ0cnVlIiBdIDsgdGhlbgogIGNsZWFuZGlyCmZpCgp0ZXN0IC16ICIke1BBUkFNX0hUVFBfUFJPWFl9IiB8fCBleHBvcnQgSFRUUF9QUk9YWT0iJHtQQVJBTV9IVFRQX1BST1hZfSIKdGVzdCAteiAiJHtQQVJBTV9IVFRQU19QUk9YWX0iIHx8IGV4cG9ydCBIVFRQU19QUk9YWT0iJHtQQVJBTV9IVFRQU19QUk9YWX0iCnRlc3QgLXogIiR7UEFSQU1fTk9fUFJPWFl9IiB8fCBleHBvcnQgTk9fUFJPWFk9IiR7UEFSQU1fTk9fUFJPWFl9IgoKL2tvLWFwcC9naXQtaW5pdCBcCiAgLXVybD0iJHtQQVJBTV9VUkx9IiBcCiAgLXJldmlzaW9uPSIke1BBUkFNX1JFVklTSU9OfSIgXAogIC1yZWZzcGVjPSIke1BBUkFNX1JFRlNQRUN9IiBcCiAgLXBhdGg9IiR7Q0hFQ0tPVVRfRElSfSIgXAogIC1zc2xWZXJpZnk9IiR7UEFSQU1fU1NMX1ZFUklGWX0iIFwKICAtc3VibW9kdWxlcz0iJHtQQVJBTV9TVUJNT0RVTEVTfSIgXAogIC1kZXB0aD0iJHtQQVJBTV9ERVBUSH0iIFwKICAtc3BhcnNlQ2hlY2tvdXREaXJlY3Rvcmllcz0iJHtQQVJBTV9TUEFSU0VfQ0hFQ0tPVVRfRElSRUNUT1JJRVN9IgpjZCAiJHtDSEVDS09VVF9ESVJ9IgpSRVNVTFRfU0hBPSIkKGdpdCByZXYtcGFyc2UgSEVBRCkiCkVYSVRfQ09ERT0iJD8iCmlmIFsgIiR7RVhJVF9DT0RFfSIgIT0gMCBdIDsgdGhlbgogIGV4aXQgIiR7RVhJVF9DT0RFfSIKZmkKcHJpbnRmICIlcyIgIiR7UkVTVUxUX1NIQX0iID4gIi90ZWt0b24vcmVzdWx0cy9jb21taXQiCnByaW50ZiAiJXMiICIke1BBUkFNX1VSTH0iID4gIi90ZWt0b24vcmVzdWx0cy91cmwiCg==\n_EOF_\n/tekton/bin/entrypoint decode-script "${scriptfile}"\n',
          ],
          resources: {
            limits: {
              cpu: '2',
              memory: '2Gi',
            },
          },
          volumeMounts: [
            {
              name: 'tekton-internal-scripts',
              mountPath: '/tekton/scripts',
            },
            {
              name: 'tekton-internal-bin',
              mountPath: '/tekton/bin',
            },
            {
              name: 'kube-api-access-kldrk',
              readOnly: true,
              mountPath: '/var/run/secrets/kubernetes.io/serviceaccount',
            },
          ],
          terminationMessagePath: '/dev/termination-log',
          terminationMessagePolicy: 'File',
          securityContext: {
            capabilities: {
              drop: ['MKNOD'],
            },
            allowPrivilegeEscalation: false,
          },
        },
      ],
      containers: [
        {
          name: 'step-clone',
          image:
            'registry.redhat.io/openshift-pipelines/pipelines-git-init-rhel8:v1.8.2-8@sha256:a538c423e7a11aae6ae582a411fdb090936458075f99af4ce5add038bb6983e8',
          command: ['/tekton/bin/entrypoint'],
          args: [
            '-wait_file',
            '/tekton/downward/ready',
            '-wait_file_content',
            '-post_file',
            '/tekton/run/0/out',
            '-termination_path',
            '/tekton/termination',
            '-step_metadata_dir',
            '/tekton/run/0/status',
            '-docker-cfg=pipeline-dockercfg-bstjn',
            '-results',
            'commit,url',
            '-entrypoint',
            '/tekton/scripts/script-0-f9gn8',
            '--',
          ],
          env: [
            {
              name: 'HOME',
              value: '/tekton/home',
            },
            {
              name: 'PARAM_URL',
              value: 'https://github.com/nodeshift-starters/devfile-sample.git',
            },
            {
              name: 'PARAM_REVISION',
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
              value: 'false',
            },
            {
              name: 'WORKSPACE_BASIC_AUTH_DIRECTORY_PATH',
            },
            {
              name: 'SSL_CERT_DIR',
              value:
                '/tekton-custom-certs:/etc/ssl/certs:/etc/pki/tls/certs:/system/etc/security/cacerts',
            },
          ],
          resources: {
            limits: {
              cpu: '2',
              memory: '2Gi',
            },
          },
          volumeMounts: [
            {
              name: 'ws-fkm84',
              mountPath: '/workspace/output',
            },
            {
              name: 'tekton-internal-scripts',
              readOnly: true,
              mountPath: '/tekton/scripts',
            },
            {
              name: 'tekton-internal-downward',
              readOnly: true,
              mountPath: '/tekton/downward',
            },
            {
              name: 'tekton-creds-init-home-0',
              mountPath: '/tekton/creds',
            },
            {
              name: 'tekton-internal-run-0',
              mountPath: '/tekton/run/0',
            },
            {
              name: 'tekton-internal-bin',
              readOnly: true,
              mountPath: '/tekton/bin',
            },
            {
              name: 'tekton-internal-workspace',
              mountPath: '/workspace',
            },
            {
              name: 'tekton-internal-home',
              mountPath: '/tekton/home',
            },
            {
              name: 'tekton-internal-results',
              mountPath: '/tekton/results',
            },
            {
              name: 'tekton-internal-steps',
              readOnly: true,
              mountPath: '/tekton/steps',
            },
            {
              name: 'tekton-internal-secret-volume-pipeline-dockercfg-bstjn-n8hjt',
              mountPath: '/tekton/creds-secrets/pipeline-dockercfg-bstjn',
            },
            {
              name: 'kube-api-access-kldrk',
              readOnly: true,
              mountPath: '/var/run/secrets/kubernetes.io/serviceaccount',
            },
            {
              name: 'config-trusted-cabundle-volume',
              readOnly: true,
              mountPath: '/tekton-custom-certs/ca-bundle.crt',
              subPath: 'ca-bundle.crt',
            },
            {
              name: 'config-service-cabundle-volume',
              readOnly: true,
              mountPath: '/tekton-custom-certs/service-ca.crt',
              subPath: 'service-ca.crt',
            },
          ],
          terminationMessagePath: '/tekton/termination',
          terminationMessagePolicy: 'File',
          securityContext: {
            capabilities: {
              drop: ['MKNOD'],
            },
            runAsUser: 0,
            allowPrivilegeEscalation: false,
          },
        },
      ],
      restartPolicy: 'Never',
      terminationGracePeriodSeconds: 30,
      activeDeadlineSeconds: 5400,
      dnsPolicy: 'ClusterFirst',
      serviceAccountName: 'pipeline',
      serviceAccount: 'pipeline',
      nodeName: 'ip-10-205-29-65.ec2.internal',
      securityContext: {
        seLinuxOptions: {
          level: 's0:c48,c12',
        },
        fsGroup: 1002280000,
      },
      imagePullSecrets: [
        {
          name: 'pipeline-dockercfg-bstjn',
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
          lastTransitionTime: '2023-03-29T11:13:50Z',
          reason: 'PodCompleted',
        },
        {
          type: 'Ready',
          status: 'True',
          lastProbeTime: null,
          lastTransitionTime: '2023-03-29T11:13:53Z',
          reason: 'PodCompleted',
        },
        {
          type: 'ContainersReady',
          status: 'True',
          lastProbeTime: null,
          lastTransitionTime: '2023-03-29T11:13:53Z',
          reason: 'PodCompleted',
        },
      ],
      hostIP: '10.205.29.65',
      podIP: '10.128.6.199',
      podIPs: [
        {
          ip: '10.128.6.199',
        },
      ],
      startTime: '2023-03-29T11:13:39Z',
      initContainerStatuses: [
        {
          name: 'prepare',
          state: {
            terminated: {
              exitCode: 0,
              reason: 'Completed',
              startedAt: '2023-03-29T11:13:48Z',
              finishedAt: '2023-03-29T11:13:48Z',
              containerID:
                'cri-o://ef135f7ed774de08bcff6445a2bed2d819d4c366caf6667884e49e195193bcde',
            },
          },
          lastState: {},
          ready: true,
          restartCount: 0,
          image:
            'registry.redhat.io/openshift-pipelines/pipelines-entrypoint-rhel8@sha256:08cbd580243004da2e2376a0af1d6496ad9e6ef2e42da951fbdbadc0dca30c69',
          imageID:
            'registry.redhat.io/openshift-pipelines/pipelines-entrypoint-rhel8@sha256:08cbd580243004da2e2376a0af1d6496ad9e6ef2e42da951fbdbadc0dca30c69',
          containerID: 'cri-o://ef135f7ed774de08bcff6445a2bed2d819d4c366caf6667884e49e195193bcde',
        },
        {
          name: 'place-scripts',
          state: {
            terminated: {
              exitCode: 0,
              reason: 'Completed',
              startedAt: '2023-03-29T11:13:49Z',
              finishedAt: '2023-03-29T11:13:49Z',
              containerID:
                'cri-o://671e9b1a07b9bbb60e0e1b3bc5d630fd7d484924c1b61281613c6f45ac04da75',
            },
          },
          lastState: {},
          ready: true,
          restartCount: 0,
          image:
            'registry.redhat.io/ubi8/ubi-minimal@sha256:6910799b75ad41f00891978575a0d955be2f800c51b955af73926e7ab59a41c3',
          imageID:
            'registry.redhat.io/ubi8/ubi-minimal@sha256:34e7fd35ddac937263dbbdb6d492c9a031dbd38880777bc8ddb9ed0442a0fb03',
          containerID: 'cri-o://671e9b1a07b9bbb60e0e1b3bc5d630fd7d484924c1b61281613c6f45ac04da75',
        },
      ],
      containerStatuses: [
        {
          name: 'step-clone',
          state: {
            terminated: {
              exitCode: 2,
              reason: 'Completed',
              message:
                '[{"key":"commit","value":"5c6e7135b780cbe69fc7b4a44cc3c164fa3a8946"},{"key":"url","value":"https://github.com/nodeshift-starters/devfile-sample.git"},{"key":"commit","value":"5c6e7135b780cbe69fc7b4a44cc3c164fa3a8946","type":1},{"key":"url","value":"https://github.com/nodeshift-starters/devfile-sample.git","type":1},{"key":"StartedAt","value":"2023-03-29T11:13:53.473Z","type":3}]',
              startedAt: '2023-03-29T11:13:51Z',
              finishedAt: '2023-03-29T11:13:53Z',
              containerID:
                'cri-o://d08f069c77f6f29d488b1b91181471efd2b88ab83b4e818d309d7ecaa517d642',
            },
          },
          lastState: {},
          ready: false,
          restartCount: 0,
          image:
            'registry.redhat.io/openshift-pipelines/pipelines-git-init-rhel8@sha256:a538c423e7a11aae6ae582a411fdb090936458075f99af4ce5add038bb6983e8',
          imageID:
            'registry.redhat.io/openshift-pipelines/pipelines-git-init-rhel8@sha256:2fa0b06d52b04f377c696412e19307a9eff27383f81d87aae0b4f71672a1cd0b',
          containerID: 'cri-o://d08f069c77f6f29d488b1b91181471efd2b88ab83b4e818d309d7ecaa517d642',
          started: false,
        },
      ],
      qosClass: 'Burstable',
    },
  },
  {
    apiVersion: 'v1Alpha',
    kind: 'Pod',
    metadata: {
      name: 'devfile-sample-6wo1-x99m8-init-pod',
      namespace: 'abhindas-tenant',
      uid: '448e75b0-d6f3-44d2-b929-385d231e9a3d',
      resourceVersion: '97898668',
      creationTimestamp: '2023-03-29T11:13:21Z',
      labels: {
        'app.kubernetes.io/managed-by': 'tekton-pipelines',
        'app.kubernetes.io/version': '0.1',
        'appstudio.openshift.io/application': 'my-app-2',
        'appstudio.openshift.io/component': 'devfile-sample-6wo1',
        'pipelines.appstudio.openshift.io/type': 'build',
        'pipelines.openshift.io/runtime': 'generic',
        'pipelines.openshift.io/strategy': 'docker',
        'pipelines.openshift.io/used-by': 'build-cloud',
        'tekton.dev/memberOf': 'tasks',
        'tekton.dev/pipeline': 'docker-build',
        'tekton.dev/pipelineRun': 'devfile-sample-6wo1-x99m8',
        'tekton.dev/pipelineTask': 'init',
        'tekton.dev/task': 'init',
        'tekton.dev/taskRun': 'devfile-sample-6wo1-x99m8-init',
      },
      annotations: {
        'build.appstudio.redhat.com/bundle':
          'quay.io/redhat-appstudio-tekton-catalog/pipeline-docker-build:a7f5eaccbaba1fc86ebd39d82be425b2d551c0e8',
        'build.appstudio.redhat.com/pipeline_name': 'docker-build',
        'build.appstudio.redhat.com/target_branch': '',
        'k8s.ovn.org/pod-networks':
          '{"default":{"ip_addresses":["10.128.6.194/23"],"mac_address":"0a:58:0a:80:06:c2","gateway_ips":["10.128.6.1"],"ip_address":"10.128.6.194/23","gateway_ip":"10.128.6.1"}}',
        'k8s.v1.cni.cncf.io/network-status':
          '[{\n    "name": "ovn-kubernetes",\n    "interface": "eth0",\n    "ips": [\n        "10.128.6.194"\n    ],\n    "mac": "0a:58:0a:80:06:c2",\n    "default": true,\n    "dns": {}\n}]',
        'k8s.v1.cni.cncf.io/networks-status':
          '[{\n    "name": "ovn-kubernetes",\n    "interface": "eth0",\n    "ips": [\n        "10.128.6.194"\n    ],\n    "mac": "0a:58:0a:80:06:c2",\n    "default": true,\n    "dns": {}\n}]',
        'kubernetes.io/limit-ranger':
          'LimitRanger plugin set: cpu, memory limit for container step-init; cpu, memory request for init container prepare; cpu, memory limit for init container prepare; cpu, memory request for init container place-scripts; cpu, memory limit for init container place-scripts',
        'openshift.io/scc': 'csi-scc',
        'pipeline.tekton.dev/release': '9ec444e',
        'tekton.dev/pipelines.minVersion': '0.12.1',
        'tekton.dev/ready': 'READY',
        'tekton.dev/tags': 'appstudio, hacbs',
      },
      ownerReferences: [
        {
          apiVersion: 'tekton.dev/v1beta1',
          kind: 'TaskRun',
          name: 'devfile-sample-6wo1-x99m8-init',
          uid: '97ba3fba-efc5-49b6-8443-930be1fdd375',
          controller: true,
          blockOwnerDeletion: true,
        },
      ],
      managedFields: [
        {
          manager: 'ip-10-205-25-104',
          operation: 'Update',
          apiVersion: 'v1',
          time: '2023-03-29T11:13:21Z',
        },
        {
          manager: 'multus',
          operation: 'Update',
          apiVersion: 'v1',
          time: '2023-03-29T11:13:22Z',
          subresource: 'status',
        },
        {
          manager: 'openshift-pipelines-controller',
          operation: 'Update',
          apiVersion: 'v1',
          time: '2023-03-29T11:13:25Z',
          subresource: 'status',
        },
      ],
    },
    spec: {
      volumes: [
        {
          name: 'tekton-internal-workspace',
          emptyDir: {},
        },
        {
          name: 'tekton-internal-home',
          emptyDir: {},
        },
        {
          name: 'tekton-internal-results',
          emptyDir: {},
        },
        {
          name: 'tekton-internal-steps',
          emptyDir: {},
        },
        {
          name: 'tekton-internal-secret-volume-pipeline-dockercfg-bstjn-lwbjl',
          secret: {
            secretName: 'pipeline-dockercfg-bstjn',
            defaultMode: 420,
          },
        },
        {
          name: 'tekton-internal-scripts',
          emptyDir: {},
        },
        {
          name: 'tekton-internal-bin',
          emptyDir: {},
        },
        {
          name: 'tekton-internal-downward',
          downwardAPI: {
            items: [
              {
                path: 'ready',
                fieldRef: {
                  apiVersion: 'v1',
                  fieldPath: "metadata.annotations['tekton.dev/ready']",
                },
              },
            ],
            defaultMode: 420,
          },
        },
        {
          name: 'tekton-creds-init-home-0',
          emptyDir: {
            medium: 'Memory',
          },
        },
        {
          name: 'tekton-internal-run-0',
          emptyDir: {},
        },
        {
          name: 'default-push-secret',
          csi: {
            driver: 'csi.sharedresource.openshift.io',
            readOnly: true,
            volumeAttributes: {
              sharedSecret: 'redhat-appstudio-user-workload',
            },
          },
        },
        {
          name: 'kube-api-access-z6bm9',
          projected: {
            sources: [
              {
                serviceAccountToken: {
                  expirationSeconds: 3607,
                  path: 'token',
                },
              },
              {
                configMap: {
                  name: 'kube-root-ca.crt',
                  items: [
                    {
                      key: 'ca.crt',
                      path: 'ca.crt',
                    },
                  ],
                },
              },
              {
                downwardAPI: {
                  items: [
                    {
                      path: 'namespace',
                      fieldRef: {
                        apiVersion: 'v1',
                        fieldPath: 'metadata.namespace',
                      },
                    },
                  ],
                },
              },
              {
                configMap: {
                  name: 'openshift-service-ca.crt',
                  items: [
                    {
                      key: 'service-ca.crt',
                      path: 'service-ca.crt',
                    },
                  ],
                },
              },
            ],
            defaultMode: 420,
          },
        },
        {
          name: 'config-trusted-cabundle-volume',
          configMap: {
            name: 'config-trusted-cabundle',
            items: [
              {
                key: 'ca-bundle.crt',
                path: 'ca-bundle.crt',
              },
            ],
            defaultMode: 420,
          },
        },
        {
          name: 'config-service-cabundle-volume',
          configMap: {
            name: 'config-service-cabundle',
            items: [
              {
                key: 'service-ca.crt',
                path: 'service-ca.crt',
              },
            ],
            defaultMode: 420,
          },
        },
      ],
      initContainers: [
        {
          name: 'prepare',
          image:
            'registry.redhat.io/openshift-pipelines/pipelines-entrypoint-rhel8@sha256:08cbd580243004da2e2376a0af1d6496ad9e6ef2e42da951fbdbadc0dca30c69',
          command: [
            '/ko-app/entrypoint',
            'init',
            '/ko-app/entrypoint',
            '/tekton/bin/entrypoint',
            'step-init',
          ],
          workingDir: '/',
          resources: {
            limits: {
              cpu: '2',
              memory: '2Gi',
            },
          },
          volumeMounts: [
            {
              name: 'tekton-internal-bin',
              mountPath: '/tekton/bin',
            },
            {
              name: 'tekton-internal-steps',
              mountPath: '/tekton/steps',
            },
            {
              name: 'kube-api-access-z6bm9',
              readOnly: true,
              mountPath: '/var/run/secrets/kubernetes.io/serviceaccount',
            },
          ],
          terminationMessagePath: '/dev/termination-log',
          terminationMessagePolicy: 'File',
          securityContext: {
            capabilities: {
              drop: ['KILL', 'MKNOD', 'SETGID', 'SETUID'],
            },
          },
        },
        {
          name: 'place-scripts',
          image:
            'registry.redhat.io/ubi8/ubi-minimal@sha256:6910799b75ad41f00891978575a0d955be2f800c51b955af73926e7ab59a41c3',
          command: ['sh'],
          args: [
            '-c',
            'scriptfile="/tekton/scripts/script-0-ztxp5"\ntouch ${scriptfile} \u0026\u0026 chmod +x ${scriptfile}\ncat \u003e ${scriptfile} \u003c\u003c \'_EOF_\'\nIyEvYmluL2Jhc2gKZWNobyAiQnVpbGQgSW5pdGlhbGl6ZTogJElNQUdFX1VSTCIKZWNobwplY2hvICJDcmVhdGUgcGlwZWxpbmVydW4gcmVwb3NpdG9yeSBzZWNyZXQiClNIQVJFRD0vc2VjcmV0L2RlZmF1bHQtcHVzaC1zZWNyZXQvLmRvY2tlcmNvbmZpZ2pzb24KZXhwb3J0IERPQ0tFUl9DT05GSUc9L3RtcC9kb2NrZXIvCm1rZGlyIC1wICRET0NLRVJfQ09ORklHCmlmIFsgLWYgJFNIQVJFRCBdOyB0aGVuCiAganEgLU0gLXMgJy5bMF0gKiAuWzFdJyAkU0hBUkVEIC9yb290Ly5kb2NrZXIvY29uZmlnLmpzb24gPiAkRE9DS0VSX0NPTkZJRy9jb25maWcuanNvbgplbHNlCiAgY3AgL3Jvb3QvLmRvY2tlci9jb25maWcuanNvbiAkRE9DS0VSX0NPTkZJRy9jb25maWcuanNvbgpmaQpvYyBjcmVhdGUgc2VjcmV0IGdlbmVyaWMgLS1mcm9tLWZpbGU9JERPQ0tFUl9DT05GSUcvY29uZmlnLmpzb24gJFNIQVJFRF9QQVJBTSAkUElQRUxJTkVSVU5fTkFNRQpvYyBwYXRjaCBzZWNyZXQgJFBJUEVMSU5FUlVOX05BTUUgLXAgIntcIm1ldGFkYXRhXCI6IHtcIm93bmVyUmVmZXJlbmNlc1wiOiBbe1wiYXBpVmVyc2lvblwiOiBcInRla3Rvbi5kZXYvdjFiZXRhMVwiLCBcImJsb2NrT3duZXJEZWxldGlvblwiOiBmYWxzZSwgXCJjb250cm9sbGVyXCI6IHRydWUsIFwia2luZFwiOiBcIlBpcGVsaW5lUnVuXCIsIFwibmFtZVwiOiBcIiRQSVBFTElORVJVTl9OQU1FXCIsIFwidWlkXCI6IFwiJFBJUEVMSU5FUlVOX1VJRFwiIH1dfX0iCmVjaG8gLW4gJFBJUEVMSU5FUlVOX05BTUUgPiAvdGVrdG9uL3Jlc3VsdHMvY29udGFpbmVyLXJlZ2lzdHJ5LXNlY3JldAoKZWNobyAiRGV0ZXJtaW5lIGlmIEltYWdlIEFscmVhZHkgRXhpc3RzIgojIEJ1aWxkIHRoZSBpbWFnZSB3aGVuIGltYWdlIGRvZXMgbm90IGV4aXN0cyBvciByZWJ1aWxkIGlzIHNldCB0byB0cnVlCmlmICEgb2MgaW1hZ2UgaW5mbyAkSU1BR0VfVVJMICY+L2Rldi9udWxsIHx8IFsgIiRSRUJVSUxEIiA9PSAidHJ1ZSIgXSB8fCBbICIkU0tJUF9DSEVDS1MiID09ICJmYWxzZSIgXTsgdGhlbgogIGVjaG8gLW4gInRydWUiID4gL3Rla3Rvbi9yZXN1bHRzL2J1aWxkCmVsc2UKICBlY2hvIC1uICJmYWxzZSIgPiAvdGVrdG9uL3Jlc3VsdHMvYnVpbGQKZmkK\n_EOF_\n/tekton/bin/entrypoint decode-script "${scriptfile}"\n',
          ],
          resources: {
            limits: {
              cpu: '2',
              memory: '2Gi',
            },
          },
          volumeMounts: [
            {
              name: 'tekton-internal-scripts',
              mountPath: '/tekton/scripts',
            },
            {
              name: 'tekton-internal-bin',
              mountPath: '/tekton/bin',
            },
            {
              name: 'kube-api-access-z6bm9',
              readOnly: true,
              mountPath: '/var/run/secrets/kubernetes.io/serviceaccount',
            },
          ],
          terminationMessagePath: '/dev/termination-log',
          terminationMessagePolicy: 'File',
          securityContext: {
            capabilities: {
              drop: ['KILL', 'MKNOD', 'SETGID', 'SETUID'],
            },
          },
        },
      ],
      containers: [
        {
          name: 'step-init',
          image:
            'registry.redhat.io/openshift4/ose-tools-rhel8:v4.12@sha256:253d042ecfad7b64593112a4aa3f528d39cb5fe738852e44f009db87964cf051',
          command: ['/tekton/bin/entrypoint'],
          args: [
            '-wait_file',
            '/tekton/downward/ready',
            '-wait_file_content',
            '-post_file',
            '/tekton/run/0/out',
            '-termination_path',
            '/tekton/termination',
            '-step_metadata_dir',
            '/tekton/run/0/status',
            '-docker-cfg=pipeline-dockercfg-bstjn',
            '-results',
            'build,container-registry-secret',
            '-entrypoint',
            '/tekton/scripts/script-0-ztxp5',
            '--',
          ],
          env: [
            {
              name: 'PIPELINERUN_NAME',
              value: 'devfile-sample-6wo1-x99m8',
            },
            {
              name: 'PIPELINERUN_UID',
              value: '61cc1860-20c0-478a-b2f4-f1ae0407bff1',
            },
            {
              name: 'IMAGE_URL',
              value: 'quay.io/redhat-appstudio/user-workload:build-f3d3f-1680088395',
            },
            {
              name: 'REBUILD',
              value: 'false',
            },
            {
              name: 'SKIP_CHECKS',
              value: 'true',
            },
            {
              name: 'SSL_CERT_DIR',
              value:
                '/tekton-custom-certs:/etc/ssl/certs:/etc/pki/tls/certs:/system/etc/security/cacerts',
            },
          ],
          resources: {
            limits: {
              cpu: '2',
              memory: '2Gi',
            },
          },
          volumeMounts: [
            {
              name: 'default-push-secret',
              mountPath: '/secret/default-push-secret',
            },
            {
              name: 'tekton-internal-scripts',
              readOnly: true,
              mountPath: '/tekton/scripts',
            },
            {
              name: 'tekton-internal-downward',
              readOnly: true,
              mountPath: '/tekton/downward',
            },
            {
              name: 'tekton-creds-init-home-0',
              mountPath: '/tekton/creds',
            },
            {
              name: 'tekton-internal-run-0',
              mountPath: '/tekton/run/0',
            },
            {
              name: 'tekton-internal-bin',
              readOnly: true,
              mountPath: '/tekton/bin',
            },
            {
              name: 'tekton-internal-workspace',
              mountPath: '/workspace',
            },
            {
              name: 'tekton-internal-home',
              mountPath: '/tekton/home',
            },
            {
              name: 'tekton-internal-results',
              mountPath: '/tekton/results',
            },
            {
              name: 'tekton-internal-steps',
              readOnly: true,
              mountPath: '/tekton/steps',
            },
            {
              name: 'tekton-internal-secret-volume-pipeline-dockercfg-bstjn-lwbjl',
              mountPath: '/tekton/creds-secrets/pipeline-dockercfg-bstjn',
            },
            {
              name: 'kube-api-access-z6bm9',
              readOnly: true,
              mountPath: '/var/run/secrets/kubernetes.io/serviceaccount',
            },
            {
              name: 'config-trusted-cabundle-volume',
              readOnly: true,
              mountPath: '/tekton-custom-certs/ca-bundle.crt',
              subPath: 'ca-bundle.crt',
            },
            {
              name: 'config-service-cabundle-volume',
              readOnly: true,
              mountPath: '/tekton-custom-certs/service-ca.crt',
              subPath: 'service-ca.crt',
            },
          ],
          terminationMessagePath: '/tekton/termination',
          terminationMessagePolicy: 'File',
          securityContext: {
            capabilities: {
              drop: ['KILL', 'MKNOD', 'SETGID', 'SETUID'],
            },
          },
        },
      ],
      restartPolicy: 'Never',
      terminationGracePeriodSeconds: 30,
      activeDeadlineSeconds: 5400,
      dnsPolicy: 'ClusterFirst',
      serviceAccountName: 'pipeline',
      serviceAccount: 'pipeline',
      nodeName: 'ip-10-205-29-65.ec2.internal',
      securityContext: {
        seLinuxOptions: {
          level: 's0:c48,c12',
        },
        fsGroup: 1002280000,
      },
      imagePullSecrets: [
        {
          name: 'pipeline-dockercfg-bstjn',
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
          lastTransitionTime: '2023-03-29T11:13:24Z',
          reason: 'PodCompleted',
        },
        {
          type: 'Ready',
          status: 'False',
          lastProbeTime: null,
          lastTransitionTime: '2023-03-29T11:13:28Z',
          reason: 'PodCompleted',
        },
      ],
      hostIP: '10.205.29.65',
      podIP: '10.128.6.194',
      podIPs: [
        {
          ip: '10.128.6.194',
        },
      ],
      startTime: '2023-03-29T11:13:21Z',
      initContainerStatuses: [
        {
          name: 'prepare',
          state: {
            terminated: {
              exitCode: 0,
              reason: 'Completed',
              startedAt: '2023-03-29T11:13:23Z',
              finishedAt: '2023-03-29T11:13:23Z',
              containerID:
                'cri-o://2777382db2e8c8bf15f0d78a41f3f54edbddbc075cd2246ee4821711f529a6c2',
            },
          },
          lastState: {},
          ready: true,
          restartCount: 0,
          image:
            'registry.redhat.io/openshift-pipelines/pipelines-entrypoint-rhel8@sha256:08cbd580243004da2e2376a0af1d6496ad9e6ef2e42da951fbdbadc0dca30c69',
          imageID:
            'registry.redhat.io/openshift-pipelines/pipelines-entrypoint-rhel8@sha256:08cbd580243004da2e2376a0af1d6496ad9e6ef2e42da951fbdbadc0dca30c69',
          containerID: 'cri-o://2777382db2e8c8bf15f0d78a41f3f54edbddbc075cd2246ee4821711f529a6c2',
        },
        {
          name: 'place-scripts',
          state: {
            terminated: {
              exitCode: 0,
              reason: 'Completed',
              startedAt: '2023-03-29T11:13:24Z',
              finishedAt: '2023-03-29T11:13:24Z',
              containerID:
                'cri-o://7a98db7080089f6edd0657c49adba266a59e63cef4dde8815ad1db5822203e87',
            },
          },
          lastState: {},
          ready: true,
          restartCount: 0,
          image:
            'registry.redhat.io/ubi8/ubi-minimal@sha256:6910799b75ad41f00891978575a0d955be2f800c51b955af73926e7ab59a41c3',
          imageID:
            'registry.redhat.io/ubi8/ubi-minimal@sha256:34e7fd35ddac937263dbbdb6d492c9a031dbd38880777bc8ddb9ed0442a0fb03',
          containerID: 'cri-o://7a98db7080089f6edd0657c49adba266a59e63cef4dde8815ad1db5822203e87',
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
                '[{"key":"build","value":"true","type":1},{"key":"container-registry-secret","value":"devfile-sample-6wo1-x99m8","type":1},{"key":"StartedAt","value":"2023-03-29T11:13:27.276Z","type":3}]',
              startedAt: '2023-03-29T11:13:25Z',
              finishedAt: '2023-03-29T11:13:27Z',
              containerID:
                'cri-o://23cf20c65c2a66ea16b11d8b095173676ae4829f70c95961ec1aaaede46989f6',
            },
          },
          lastState: {},
          ready: false,
          restartCount: 0,
          image:
            'registry.redhat.io/openshift4/ose-tools-rhel8@sha256:253d042ecfad7b64593112a4aa3f528d39cb5fe738852e44f009db87964cf051',
          imageID:
            'registry.redhat.io/openshift4/ose-tools-rhel8@sha256:253d042ecfad7b64593112a4aa3f528d39cb5fe738852e44f009db87964cf051',
          containerID: 'cri-o://23cf20c65c2a66ea16b11d8b095173676ae4829f70c95961ec1aaaede46989f6',
          started: false,
        },
      ],
      qosClass: 'Burstable',
    },
  },
  {
    apiVersion: 'v1Alpha',
    kind: 'Pod',
    metadata: {
      name: 'devfile-sample-6wo1-x99m8-show-summary-pod',
      namespace: 'abhindas-tenant',
      uid: '9e5a06ca-b819-4e92-9afe-0d68bd5cfeda',
      resourceVersion: '97904911',
      creationTimestamp: '2023-03-29T11:15:40Z',
      labels: {
        'app.kubernetes.io/managed-by': 'tekton-pipelines',
        'app.kubernetes.io/version': '0.1',
        'appstudio.openshift.io/application': 'my-app-2',
        'appstudio.openshift.io/component': 'devfile-sample-6wo1',
        'pipelines.appstudio.openshift.io/type': 'build',
        'pipelines.openshift.io/runtime': 'generic',
        'pipelines.openshift.io/strategy': 'docker',
        'pipelines.openshift.io/used-by': 'build-cloud',
        'tekton.dev/memberOf': 'finally',
        'tekton.dev/pipeline': 'docker-build',
        'tekton.dev/pipelineRun': 'devfile-sample-6wo1-x99m8',
        'tekton.dev/pipelineTask': 'show-summary',
        'tekton.dev/task': 'summary',
        'tekton.dev/taskRun': 'devfile-sample-6wo1-x99m8-show-summary',
      },
      annotations: {
        'build.appstudio.redhat.com/bundle':
          'quay.io/redhat-appstudio-tekton-catalog/pipeline-docker-build:a7f5eaccbaba1fc86ebd39d82be425b2d551c0e8',
        'build.appstudio.redhat.com/pipeline_name': 'docker-build',
        'build.appstudio.redhat.com/target_branch': '',
        'k8s.ovn.org/pod-networks':
          '{"default":{"ip_addresses":["10.128.6.215/23"],"mac_address":"0a:58:0a:80:06:d7","gateway_ips":["10.128.6.1"],"ip_address":"10.128.6.215/23","gateway_ip":"10.128.6.1"}}',
        'k8s.v1.cni.cncf.io/network-status':
          '[{\n    "name": "ovn-kubernetes",\n    "interface": "eth0",\n    "ips": [\n        "10.128.6.215"\n    ],\n    "mac": "0a:58:0a:80:06:d7",\n    "default": true,\n    "dns": {}\n}]',
        'k8s.v1.cni.cncf.io/networks-status':
          '[{\n    "name": "ovn-kubernetes",\n    "interface": "eth0",\n    "ips": [\n        "10.128.6.215"\n    ],\n    "mac": "0a:58:0a:80:06:d7",\n    "default": true,\n    "dns": {}\n}]',
        'kubernetes.io/limit-ranger':
          'LimitRanger plugin set: cpu, memory limit for container step-appstudio-summary; cpu, memory request for init container prepare; cpu, memory limit for init container prepare; cpu, memory request for init container place-scripts; cpu, memory limit for init container place-scripts',
        'openshift.io/scc': 'pipelines-scc',
        'pipeline.tekton.dev/release': '9ec444e',
        'results.tekton.dev/record':
          'abhindas-tenant/results/61cc1860-20c0-478a-b2f4-f1ae0407bff1/records/61cc1860-20c0-478a-b2f4-f1ae0407bff1',
        'results.tekton.dev/result': 'abhindas-tenant/results/61cc1860-20c0-478a-b2f4-f1ae0407bff1',
        'tekton.dev/pipelines.minVersion': '0.12.1',
        'tekton.dev/ready': 'READY',
        'tekton.dev/tags': 'appstudio, hacbs',
      },
      ownerReferences: [
        {
          apiVersion: 'tekton.dev/v1beta1',
          kind: 'TaskRun',
          name: 'devfile-sample-6wo1-x99m8-show-summary',
          uid: '0d61a164-d952-48f9-89cd-48b18147c323',
          controller: true,
          blockOwnerDeletion: true,
        },
      ],
      managedFields: [
        {
          manager: 'ip-10-205-25-104',
          operation: 'Update',
          apiVersion: 'v1',
          time: '2023-03-29T11:15:40Z',
          fieldsType: 'FieldsV1',
          fieldsV1: {
            'f:metadata': {
              'f:annotations': {
                'f:k8s.ovn.org/pod-networks': {},
              },
            },
          },
        },
        {
          manager: 'multus',
          operation: 'Update',
          apiVersion: 'v1',
          time: '2023-03-29T11:15:42Z',
          fieldsType: 'FieldsV1',
          fieldsV1: {
            'f:metadata': {
              'f:annotations': {
                'f:k8s.v1.cni.cncf.io/network-status': {},
                'f:k8s.v1.cni.cncf.io/networks-status': {},
              },
            },
          },
          subresource: 'status',
        },
        {
          manager: 'openshift-pipelines-controller',
          operation: 'Update',
          apiVersion: 'v1',
          time: '2023-03-29T11:15:47Z',
        },
        {
          manager: 'kubelet',
          operation: 'Update',
          apiVersion: 'v1',
          time: '2023-03-29T11:15:52Z',
          subresource: 'status',
        },
      ],
    },
    spec: {
      volumes: [
        {
          name: 'tekton-internal-workspace',
          emptyDir: {},
        },
        {
          name: 'tekton-internal-home',
          emptyDir: {},
        },
        {
          name: 'tekton-internal-results',
          emptyDir: {},
        },
        {
          name: 'tekton-internal-steps',
          emptyDir: {},
        },
        {
          name: 'tekton-internal-secret-volume-pipeline-dockercfg-bstjn-m7xrg',
          secret: {
            secretName: 'pipeline-dockercfg-bstjn',
            defaultMode: 420,
          },
        },
        {
          name: 'tekton-internal-scripts',
          emptyDir: {},
        },
        {
          name: 'tekton-internal-bin',
          emptyDir: {},
        },
        {
          name: 'tekton-internal-downward',
          downwardAPI: {
            items: [
              {
                path: 'ready',
                fieldRef: {
                  apiVersion: 'v1',
                  fieldPath: "metadata.annotations['tekton.dev/ready']",
                },
              },
            ],
            defaultMode: 420,
          },
        },
        {
          name: 'tekton-creds-init-home-0',
          emptyDir: {
            medium: 'Memory',
          },
        },
        {
          name: 'tekton-internal-run-0',
          emptyDir: {},
        },
        {
          name: 'kube-api-access-npdx5',
          projected: {
            sources: [
              {
                serviceAccountToken: {
                  expirationSeconds: 3607,
                  path: 'token',
                },
              },
              {
                configMap: {
                  name: 'kube-root-ca.crt',
                  items: [
                    {
                      key: 'ca.crt',
                      path: 'ca.crt',
                    },
                  ],
                },
              },
              {
                downwardAPI: {
                  items: [
                    {
                      path: 'namespace',
                      fieldRef: {
                        apiVersion: 'v1',
                        fieldPath: 'metadata.namespace',
                      },
                    },
                  ],
                },
              },
              {
                configMap: {
                  name: 'openshift-service-ca.crt',
                  items: [
                    {
                      key: 'service-ca.crt',
                      path: 'service-ca.crt',
                    },
                  ],
                },
              },
            ],
            defaultMode: 420,
          },
        },
        {
          name: 'config-trusted-cabundle-volume',
          configMap: {
            name: 'config-trusted-cabundle',
            items: [
              {
                key: 'ca-bundle.crt',
                path: 'ca-bundle.crt',
              },
            ],
            defaultMode: 420,
          },
        },
        {
          name: 'config-service-cabundle-volume',
          configMap: {
            name: 'config-service-cabundle',
            items: [
              {
                key: 'service-ca.crt',
                path: 'service-ca.crt',
              },
            ],
            defaultMode: 420,
          },
        },
      ],
      initContainers: [
        {
          name: 'prepare',
          image:
            'registry.redhat.io/openshift-pipelines/pipelines-entrypoint-rhel8@sha256:08cbd580243004da2e2376a0af1d6496ad9e6ef2e42da951fbdbadc0dca30c69',
          command: [
            '/ko-app/entrypoint',
            'init',
            '/ko-app/entrypoint',
            '/tekton/bin/entrypoint',
            'step-appstudio-summary',
          ],
          workingDir: '/',
          resources: {
            limits: {
              cpu: '2',
              memory: '2Gi',
            },
          },
          volumeMounts: [
            {
              name: 'tekton-internal-bin',
              mountPath: '/tekton/bin',
            },
            {
              name: 'tekton-internal-steps',
              mountPath: '/tekton/steps',
            },
            {
              name: 'kube-api-access-npdx5',
              readOnly: true,
              mountPath: '/var/run/secrets/kubernetes.io/serviceaccount',
            },
          ],
          terminationMessagePath: '/dev/termination-log',
          terminationMessagePolicy: 'File',
          securityContext: {
            capabilities: {
              drop: ['MKNOD'],
            },
            allowPrivilegeEscalation: false,
          },
        },
        {
          name: 'place-scripts',
          image:
            'registry.redhat.io/ubi8/ubi-minimal@sha256:6910799b75ad41f00891978575a0d955be2f800c51b955af73926e7ab59a41c3',
          command: ['sh'],
          args: [
            '-c',
            'scriptfile="/tekton/scripts/script-0-86497"\ntouch ${scriptfile} \u0026\u0026 chmod +x ${scriptfile}\ncat \u003e ${scriptfile} \u003c\u003c \'_EOF_\'\nIyEvdXNyL2Jpbi9lbnYgYmFzaAplY2hvCmVjaG8gIkJ1aWxkIFN1bW1hcnk6IgplY2hvCmVjaG8gIkJ1aWxkIHJlcG9zaXRvcnk6ICRHSVRfVVJMIgppZiBbICIkQlVJTERfVEFTS19TVEFUVVMiID09ICJTdWNjZWVkZWQiIF07IHRoZW4KICBlY2hvICJHZW5lcmF0ZWQgSW1hZ2UgaXMgaW4gOiAkSU1BR0VfVVJMIgpmaQplY2hvCm9jIGFubm90YXRlIC0tb3ZlcndyaXRlIHBpcGVsaW5lcnVuICRQSVBFTElORVJVTl9OQU1FIGJ1aWxkLmFwcHN0dWRpby5vcGVuc2hpZnQuaW8vcmVwbz0kR0lUX1VSTAppZiBbICIkQlVJTERfVEFTS19TVEFUVVMiID09ICJTdWNjZWVkZWQiIF07IHRoZW4KICBvYyBhbm5vdGF0ZSAtLW92ZXJ3cml0ZSBwaXBlbGluZXJ1biAkUElQRUxJTkVSVU5fTkFNRSBidWlsZC5hcHBzdHVkaW8ub3BlbnNoaWZ0LmlvL2ltYWdlPSRJTUFHRV9VUkwKZmkKZWNobyBFbmQgU3VtbWFyeQoKb2MgZGVsZXRlIC0taWdub3JlLW5vdC1mb3VuZD10cnVlIHNlY3JldCAkUElQRUxJTkVSVU5fTkFNRQo=\n_EOF_\n/tekton/bin/entrypoint decode-script "${scriptfile}"\n',
          ],
          resources: {
            limits: {
              cpu: '2',
              memory: '2Gi',
            },
          },
          volumeMounts: [
            {
              name: 'tekton-internal-scripts',
              mountPath: '/tekton/scripts',
            },
            {
              name: 'tekton-internal-bin',
              mountPath: '/tekton/bin',
            },
            {
              name: 'kube-api-access-npdx5',
              readOnly: true,
              mountPath: '/var/run/secrets/kubernetes.io/serviceaccount',
            },
          ],
          terminationMessagePath: '/dev/termination-log',
          terminationMessagePolicy: 'File',
          securityContext: {
            capabilities: {
              drop: ['MKNOD'],
            },
            allowPrivilegeEscalation: false,
          },
        },
      ],
      containers: [
        {
          name: 'step-appstudio-summary',
          image:
            'registry.redhat.io/openshift4/ose-cli:v4.12@sha256:9f0cdc00b1b1a3c17411e50653253b9f6bb5329ea4fb82ad983790a6dbf2d9ad',
          command: ['/tekton/bin/entrypoint'],
          args: [
            '-wait_file',
            '/tekton/downward/ready',
            '-wait_file_content',
            '-post_file',
            '/tekton/run/0/out',
            '-termination_path',
            '/tekton/termination',
            '-step_metadata_dir',
            '/tekton/run/0/status',
            '-docker-cfg=pipeline-dockercfg-bstjn',
            '-entrypoint',
            '/tekton/scripts/script-0-86497',
            '--',
          ],
          env: [
            {
              name: 'GIT_URL',
              value:
                'https://github.com/nodeshift-starters/devfile-sample.git?rev=5c6e7135b780cbe69fc7b4a44cc3c164fa3a8946',
            },
            {
              name: 'IMAGE_URL',
              value: 'quay.io/redhat-appstudio/user-workload:build-f3d3f-1680088395',
            },
            {
              name: 'PIPELINERUN_NAME',
              value: 'devfile-sample-6wo1-x99m8',
            },
            {
              name: 'BUILD_TASK_STATUS',
              value: 'Succeeded',
            },
            {
              name: 'SSL_CERT_DIR',
              value:
                '/tekton-custom-certs:/etc/ssl/certs:/etc/pki/tls/certs:/system/etc/security/cacerts',
            },
          ],
          resources: {
            limits: {
              cpu: '2',
              memory: '2Gi',
            },
          },
          volumeMounts: [
            {
              name: 'tekton-internal-scripts',
              readOnly: true,
              mountPath: '/tekton/scripts',
            },
            {
              name: 'tekton-internal-downward',
              readOnly: true,
              mountPath: '/tekton/downward',
            },
            {
              name: 'tekton-creds-init-home-0',
              mountPath: '/tekton/creds',
            },
            {
              name: 'tekton-internal-run-0',
              mountPath: '/tekton/run/0',
            },
            {
              name: 'tekton-internal-bin',
              readOnly: true,
              mountPath: '/tekton/bin',
            },
            {
              name: 'tekton-internal-workspace',
              mountPath: '/workspace',
            },
            {
              name: 'tekton-internal-home',
              mountPath: '/tekton/home',
            },
            {
              name: 'tekton-internal-results',
              mountPath: '/tekton/results',
            },
            {
              name: 'tekton-internal-steps',
              readOnly: true,
              mountPath: '/tekton/steps',
            },
            {
              name: 'tekton-internal-secret-volume-pipeline-dockercfg-bstjn-m7xrg',
              mountPath: '/tekton/creds-secrets/pipeline-dockercfg-bstjn',
            },
            {
              name: 'kube-api-access-npdx5',
              readOnly: true,
              mountPath: '/var/run/secrets/kubernetes.io/serviceaccount',
            },
            {
              name: 'config-trusted-cabundle-volume',
              readOnly: true,
              mountPath: '/tekton-custom-certs/ca-bundle.crt',
              subPath: 'ca-bundle.crt',
            },
            {
              name: 'config-service-cabundle-volume',
              readOnly: true,
              mountPath: '/tekton-custom-certs/service-ca.crt',
              subPath: 'service-ca.crt',
            },
          ],
          terminationMessagePath: '/tekton/termination',
          terminationMessagePolicy: 'File',
          securityContext: {
            capabilities: {
              drop: ['MKNOD'],
            },
            allowPrivilegeEscalation: false,
          },
        },
      ],
      restartPolicy: 'Never',
      terminationGracePeriodSeconds: 30,
      activeDeadlineSeconds: 5400,
      dnsPolicy: 'ClusterFirst',
      serviceAccountName: 'pipeline',
      serviceAccount: 'pipeline',
      nodeName: 'ip-10-205-29-65.ec2.internal',
      securityContext: {
        seLinuxOptions: {
          level: 's0:c48,c12',
        },
        fsGroup: 1002280000,
      },
      imagePullSecrets: [
        {
          name: 'pipeline-dockercfg-bstjn',
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
          lastTransitionTime: '2023-03-29T11:15:46Z',
          reason: 'PodCompleted',
        },
      ],
      hostIP: '10.205.29.65',
      podIP: '10.128.6.215',
      podIPs: [
        {
          ip: '10.128.6.215',
        },
      ],
      startTime: '2023-03-29T11:15:40Z',
      initContainerStatuses: [
        {
          name: 'prepare',
          state: {
            terminated: {
              exitCode: 0,
              reason: 'Completed',
              startedAt: '2023-03-29T11:15:43Z',
              finishedAt: '2023-03-29T11:15:43Z',
              containerID:
                'cri-o://6b284d30308df9a18ff9841cb723efec60620ec46c75ecef09ce2f76093d7f0b',
            },
          },
          lastState: {},
          ready: true,
          restartCount: 0,
          image:
            'registry.redhat.io/openshift-pipelines/pipelines-entrypoint-rhel8@sha256:08cbd580243004da2e2376a0af1d6496ad9e6ef2e42da951fbdbadc0dca30c69',
          imageID:
            'registry.redhat.io/openshift-pipelines/pipelines-entrypoint-rhel8@sha256:08cbd580243004da2e2376a0af1d6496ad9e6ef2e42da951fbdbadc0dca30c69',
          containerID: 'cri-o://6b284d30308df9a18ff9841cb723efec60620ec46c75ecef09ce2f76093d7f0b',
        },
        {
          name: 'place-scripts',
          state: {
            terminated: {
              exitCode: 0,
              reason: 'Completed',
              startedAt: '2023-03-29T11:15:45Z',
              finishedAt: '2023-03-29T11:15:45Z',
              containerID:
                'cri-o://1289cd8218c2189922b99a422e7dc3a7cfee49ae05f16f87966da510286c5e61',
            },
          },
          lastState: {},
          ready: true,
          restartCount: 0,
          image:
            'registry.redhat.io/ubi8/ubi-minimal@sha256:6910799b75ad41f00891978575a0d955be2f800c51b955af73926e7ab59a41c3',
          imageID:
            'registry.redhat.io/ubi8/ubi-minimal@sha256:34e7fd35ddac937263dbbdb6d492c9a031dbd38880777bc8ddb9ed0442a0fb03',
          containerID: 'cri-o://1289cd8218c2189922b99a422e7dc3a7cfee49ae05f16f87966da510286c5e61',
        },
      ],
      containerStatuses: [
        {
          name: 'step-appstudio-summary',
          state: {
            terminated: {
              exitCode: 0,
              reason: 'Completed',
              message: '[{"key":"StartedAt","value":"2023-03-29T11:15:48.956Z","type":3}]',
              startedAt: '2023-03-29T11:15:46Z',
              finishedAt: '2023-03-29T11:15:49Z',
              containerID:
                'cri-o://f53f24306a83804d49eafff0bf2b3eec442039d124916a23e8fa948737d38ec6',
            },
          },
          lastState: {},
          ready: false,
          restartCount: 0,
          image:
            'registry.redhat.io/openshift4/ose-cli@sha256:9f0cdc00b1b1a3c17411e50653253b9f6bb5329ea4fb82ad983790a6dbf2d9ad',
          imageID:
            'quay.io/openshift-release-dev/ocp-v4.0-art-dev@sha256:9f0cdc00b1b1a3c17411e50653253b9f6bb5329ea4fb82ad983790a6dbf2d9ad',
          containerID: 'cri-o://f53f24306a83804d49eafff0bf2b3eec442039d124916a23e8fa948737d38ec6',
          started: false,
        },
      ],
      qosClass: 'Burstable',
    },
  },
  {
    apiVersion: 'v1Alpha',
    kind: 'Pod',
    metadata: {
      name: 'devfile-sample-g42b-fscdj-show-summary-pod',
      namespace: 'abhindas-tenant',
      uid: '8403272f-1963-4a2a-9866-f5039fd1dd1b',
      resourceVersion: '58962438',
      creationTimestamp: '2023-03-16T10:15:49Z',
      labels: {
        'app.kubernetes.io/managed-by': 'tekton-pipelines',
        'app.kubernetes.io/version': '0.1',
        'appstudio.openshift.io/application': 'my-app-1',
        'appstudio.openshift.io/component': 'devfile-sample-g42b',
        'pipelines.appstudio.openshift.io/type': 'build',
        'pipelines.openshift.io/runtime': 'generic',
        'pipelines.openshift.io/strategy': 'docker',
        'pipelines.openshift.io/used-by': 'build-cloud',
        'tekton.dev/memberOf': 'finally',
        'tekton.dev/pipeline': 'docker-build',
        'tekton.dev/pipelineRun': 'devfile-sample-g42b-fscdj',
        'tekton.dev/pipelineTask': 'show-summary',
        'tekton.dev/task': 'summary',
        'tekton.dev/taskRun': 'devfile-sample-g42b-fscdj-show-summary',
      },
      annotations: {
        'build.appstudio.redhat.com/bundle':
          'quay.io/redhat-appstudio-tekton-catalog/pipeline-docker-build:0d1d35af732ffe202e207dd0074acf5c4c48ef43',
        'build.appstudio.redhat.com/pipeline_name': 'docker-build',
        'build.appstudio.redhat.com/target_branch': '',
        'k8s.ovn.org/pod-networks':
          '{"default":{"ip_addresses":["10.128.10.193/23"],"mac_address":"0a:58:0a:80:0a:c1","gateway_ips":["10.128.10.1"],"ip_address":"10.128.10.193/23","gateway_ip":"10.128.10.1"}}',
        'k8s.v1.cni.cncf.io/network-status':
          '[{\n    "name": "ovn-kubernetes",\n    "interface": "eth0",\n    "ips": [\n        "10.128.10.193"\n    ],\n    "mac": "0a:58:0a:80:0a:c1",\n    "default": true,\n    "dns": {}\n}]',
        'k8s.v1.cni.cncf.io/networks-status':
          '[{\n    "name": "ovn-kubernetes",\n    "interface": "eth0",\n    "ips": [\n        "10.128.10.193"\n    ],\n    "mac": "0a:58:0a:80:0a:c1",\n    "default": true,\n    "dns": {}\n}]',
        'kubernetes.io/limit-ranger':
          'LimitRanger plugin set: cpu, memory limit for container step-appstudio-summary; cpu, memory request for init container prepare; cpu, memory limit for init container prepare; cpu, memory request for init container place-scripts; cpu, memory limit for init container place-scripts',
        'openshift.io/scc': 'pipelines-scc',
        'pipeline.tekton.dev/release': '9ec444e',
        'results.tekton.dev/record':
          'abhindas-tenant/results/26603b8b-4003-4060-a15d-90ae8c131bb9/records/26603b8b-4003-4060-a15d-90ae8c131bb9',
        'results.tekton.dev/result': 'abhindas-tenant/results/26603b8b-4003-4060-a15d-90ae8c131bb9',
        'tekton.dev/pipelines.minVersion': '0.12.1',
        'tekton.dev/ready': 'READY',
        'tekton.dev/tags': 'appstudio, hacbs',
      },
      ownerReferences: [
        {
          apiVersion: 'tekton.dev/v1beta1',
          kind: 'TaskRun',
          name: 'devfile-sample-g42b-fscdj-show-summary',
          uid: '9996ef2b-7cc7-4015-9870-0d679d1590fc',
          controller: true,
          blockOwnerDeletion: true,
        },
      ],
      managedFields: [
        {
          manager: 'ip-10-205-25-104',
          operation: 'Update',
          apiVersion: 'v1',
          time: '2023-03-16T10:15:49Z',
          fieldsType: 'FieldsV1',
          fieldsV1: {
            'f:metadata': {
              'f:annotations': {
                'f:k8s.ovn.org/pod-networks': {},
              },
            },
          },
        },
        {
          manager: 'multus',
          operation: 'Update',
          apiVersion: 'v1',
          time: '2023-03-16T10:15:50Z',
          fieldsType: 'FieldsV1',
          fieldsV1: {
            'f:metadata': {
              'f:annotations': {
                'f:k8s.v1.cni.cncf.io/network-status': {},
                'f:k8s.v1.cni.cncf.io/networks-status': {},
              },
            },
          },
          subresource: 'status',
        },
        {
          manager: 'openshift-pipelines-controller',
          operation: 'Update',
          apiVersion: 'v1',
          time: '2023-03-16T10:15:54Z',
        },
        {
          manager: 'kubelet',
          operation: 'Update',
          apiVersion: 'v1',
          time: '2023-03-16T10:15:59Z',
        },
      ],
    },
    spec: {
      volumes: [
        {
          name: 'tekton-internal-workspace',
          emptyDir: {},
        },
        {
          name: 'tekton-internal-home',
          emptyDir: {},
        },
        {
          name: 'tekton-internal-results',
          emptyDir: {},
        },
        {
          name: 'tekton-internal-steps',
          emptyDir: {},
        },
        {
          name: 'tekton-internal-secret-volume-pipeline-dockercfg-bstjn-6dh5x',
          secret: {
            secretName: 'pipeline-dockercfg-bstjn',
            defaultMode: 420,
          },
        },
        {
          name: 'tekton-internal-scripts',
          emptyDir: {},
        },
        {
          name: 'tekton-internal-bin',
          emptyDir: {},
        },
        {
          name: 'tekton-internal-downward',
          downwardAPI: {
            items: [
              {
                path: 'ready',
                fieldRef: {
                  apiVersion: 'v1',
                  fieldPath: "metadata.annotations['tekton.dev/ready']",
                },
              },
            ],
            defaultMode: 420,
          },
        },
        {
          name: 'tekton-creds-init-home-0',
          emptyDir: {
            medium: 'Memory',
          },
        },
        {
          name: 'tekton-internal-run-0',
          emptyDir: {},
        },
        {
          name: 'kube-api-access-q9q75',
          projected: {
            sources: [
              {
                serviceAccountToken: {
                  expirationSeconds: 3607,
                  path: 'token',
                },
              },
              {
                configMap: {
                  name: 'kube-root-ca.crt',
                  items: [
                    {
                      key: 'ca.crt',
                      path: 'ca.crt',
                    },
                  ],
                },
              },
              {
                downwardAPI: {
                  items: [
                    {
                      path: 'namespace',
                      fieldRef: {
                        apiVersion: 'v1',
                        fieldPath: 'metadata.namespace',
                      },
                    },
                  ],
                },
              },
              {
                configMap: {
                  name: 'openshift-service-ca.crt',
                  items: [
                    {
                      key: 'service-ca.crt',
                      path: 'service-ca.crt',
                    },
                  ],
                },
              },
            ],
            defaultMode: 420,
          },
        },
        {
          name: 'config-trusted-cabundle-volume',
          configMap: {
            name: 'config-trusted-cabundle',
            items: [
              {
                key: 'ca-bundle.crt',
                path: 'ca-bundle.crt',
              },
            ],
            defaultMode: 420,
          },
        },
        {
          name: 'config-service-cabundle-volume',
          configMap: {
            name: 'config-service-cabundle',
            items: [
              {
                key: 'service-ca.crt',
                path: 'service-ca.crt',
              },
            ],
            defaultMode: 420,
          },
        },
      ],
      initContainers: [
        {
          name: 'prepare',
          image:
            'registry.redhat.io/openshift-pipelines/pipelines-entrypoint-rhel8@sha256:08cbd580243004da2e2376a0af1d6496ad9e6ef2e42da951fbdbadc0dca30c69',
          command: [
            '/ko-app/entrypoint',
            'init',
            '/ko-app/entrypoint',
            '/tekton/bin/entrypoint',
            'step-appstudio-summary',
          ],
          workingDir: '/',
          resources: {
            limits: {
              cpu: '2',
              memory: '2Gi',
            },
          },
          volumeMounts: [
            {
              name: 'tekton-internal-bin',
              mountPath: '/tekton/bin',
            },
            {
              name: 'tekton-internal-steps',
              mountPath: '/tekton/steps',
            },
            {
              name: 'kube-api-access-q9q75',
              readOnly: true,
              mountPath: '/var/run/secrets/kubernetes.io/serviceaccount',
            },
          ],
          terminationMessagePath: '/dev/termination-log',
          terminationMessagePolicy: 'File',
          securityContext: {
            capabilities: {
              drop: ['MKNOD'],
            },
            allowPrivilegeEscalation: false,
          },
        },
        {
          name: 'place-scripts',
          image:
            'registry.redhat.io/ubi8/ubi-minimal@sha256:6910799b75ad41f00891978575a0d955be2f800c51b955af73926e7ab59a41c3',
          command: ['sh'],
          args: [
            '-c',
            'scriptfile="/tekton/scripts/script-0-wr7gz"\ntouch ${scriptfile} \u0026\u0026 chmod +x ${scriptfile}\ncat \u003e ${scriptfile} \u003c\u003c \'_EOF_\'\nIyEvdXNyL2Jpbi9lbnYgYmFzaAplY2hvCmVjaG8gIkJ1aWxkIFN1bW1hcnk6IgplY2hvCmVjaG8gIkJ1aWxkIHJlcG9zaXRvcnk6ICRHSVRfVVJMIgplY2hvICJHZW5lcmF0ZWQgSW1hZ2UgaXMgaW4gOiAkSU1BR0VfVVJMIgplY2hvCm9jIGFubm90YXRlIC0tb3ZlcndyaXRlIHBpcGVsaW5lcnVuICRQSVBFTElORVJVTl9OQU1FIGJ1aWxkLmFwcHN0dWRpby5vcGVuc2hpZnQuaW8vcmVwbz0kR0lUX1VSTApvYyBhbm5vdGF0ZSAtLW92ZXJ3cml0ZSBwaXBlbGluZXJ1biAkUElQRUxJTkVSVU5fTkFNRSBidWlsZC5hcHBzdHVkaW8ub3BlbnNoaWZ0LmlvL2ltYWdlPSRJTUFHRV9VUkwKZWNobyBFbmQgU3VtbWFyeQoKb2MgZGVsZXRlIC0taWdub3JlLW5vdC1mb3VuZD10cnVlIHNlY3JldCAkUElQRUxJTkVSVU5fTkFNRQo=\n_EOF_\n/tekton/bin/entrypoint decode-script "${scriptfile}"\n',
          ],
          resources: {
            limits: {
              cpu: '2',
              memory: '2Gi',
            },
          },
          volumeMounts: [
            {
              name: 'tekton-internal-scripts',
              mountPath: '/tekton/scripts',
            },
            {
              name: 'tekton-internal-bin',
              mountPath: '/tekton/bin',
            },
            {
              name: 'kube-api-access-q9q75',
              readOnly: true,
              mountPath: '/var/run/secrets/kubernetes.io/serviceaccount',
            },
          ],
          terminationMessagePath: '/dev/termination-log',
          terminationMessagePolicy: 'File',
          securityContext: {
            capabilities: {
              drop: ['MKNOD'],
            },
            allowPrivilegeEscalation: false,
          },
        },
      ],
      containers: [
        {
          name: 'step-appstudio-summary',
          image:
            'registry.redhat.io/openshift4/ose-cli:v4.12@sha256:9f0cdc00b1b1a3c17411e50653253b9f6bb5329ea4fb82ad983790a6dbf2d9ad',
          command: ['/tekton/bin/entrypoint'],
          args: [
            '-wait_file',
            '/tekton/downward/ready',
            '-wait_file_content',
            '-post_file',
            '/tekton/run/0/out',
            '-termination_path',
            '/tekton/termination',
            '-step_metadata_dir',
            '/tekton/run/0/status',
            '-docker-cfg=pipeline-dockercfg-bstjn',
            '-entrypoint',
            '/tekton/scripts/script-0-wr7gz',
            '--',
          ],
          env: [
            {
              name: 'GIT_URL',
              value:
                'https://github.com/nodeshift-starters/devfile-sample?rev=98bd0acdebadb357544a69a65accd3f8c4da7c1c',
            },
            {
              name: 'IMAGE_URL',
              value: 'quay.io/redhat-appstudio/user-workload:initial-build-583da-1678961530',
            },
            {
              name: 'PIPELINERUN_NAME',
              value: 'devfile-sample-g42b-fscdj',
            },
            {
              name: 'SSL_CERT_DIR',
              value:
                '/tekton-custom-certs:/etc/ssl/certs:/etc/pki/tls/certs:/system/etc/security/cacerts',
            },
          ],
          resources: {
            limits: {
              cpu: '2',
              memory: '2Gi',
            },
          },
          volumeMounts: [
            {
              name: 'tekton-internal-scripts',
              readOnly: true,
              mountPath: '/tekton/scripts',
            },
            {
              name: 'tekton-internal-downward',
              readOnly: true,
              mountPath: '/tekton/downward',
            },
            {
              name: 'tekton-creds-init-home-0',
              mountPath: '/tekton/creds',
            },
            {
              name: 'tekton-internal-run-0',
              mountPath: '/tekton/run/0',
            },
            {
              name: 'tekton-internal-bin',
              readOnly: true,
              mountPath: '/tekton/bin',
            },
            {
              name: 'tekton-internal-workspace',
              mountPath: '/workspace',
            },
            {
              name: 'tekton-internal-home',
              mountPath: '/tekton/home',
            },
            {
              name: 'tekton-internal-results',
              mountPath: '/tekton/results',
            },
            {
              name: 'tekton-internal-steps',
              readOnly: true,
              mountPath: '/tekton/steps',
            },
            {
              name: 'tekton-internal-secret-volume-pipeline-dockercfg-bstjn-6dh5x',
              mountPath: '/tekton/creds-secrets/pipeline-dockercfg-bstjn',
            },
            {
              name: 'kube-api-access-q9q75',
              readOnly: true,
              mountPath: '/var/run/secrets/kubernetes.io/serviceaccount',
            },
            {
              name: 'config-trusted-cabundle-volume',
              readOnly: true,
              mountPath: '/tekton-custom-certs/ca-bundle.crt',
              subPath: 'ca-bundle.crt',
            },
            {
              name: 'config-service-cabundle-volume',
              readOnly: true,
              mountPath: '/tekton-custom-certs/service-ca.crt',
              subPath: 'service-ca.crt',
            },
          ],
          terminationMessagePath: '/tekton/termination',
          terminationMessagePolicy: 'File',
          securityContext: {
            capabilities: {
              drop: ['MKNOD'],
            },
            allowPrivilegeEscalation: false,
          },
        },
      ],
      restartPolicy: 'Never',
      terminationGracePeriodSeconds: 30,
      activeDeadlineSeconds: 5400,
      dnsPolicy: 'ClusterFirst',
      serviceAccountName: 'pipeline',
      serviceAccount: 'pipeline',
      nodeName: 'ip-10-205-26-223.ec2.internal',
      securityContext: {
        seLinuxOptions: {
          level: 's0:c48,c12',
        },
        fsGroup: 1002280000,
      },
      imagePullSecrets: [
        {
          name: 'pipeline-dockercfg-bstjn',
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
          lastTransitionTime: '2023-03-16T10:15:53Z',
          reason: 'PodCompleted',
        },
        {
          type: 'Ready',
          status: 'False',
          lastProbeTime: null,
          lastTransitionTime: '2023-03-16T10:15:57Z',
          reason: 'PodCompleted',
        },
        {
          type: 'ContainersReady',
          status: 'False',
          lastProbeTime: null,
          lastTransitionTime: '2023-03-16T10:15:57Z',
          reason: 'PodCompleted',
        },
        {
          type: 'PodScheduled',
          status: 'True',
          lastProbeTime: null,
          lastTransitionTime: '2023-03-16T10:15:49Z',
        },
      ],
      hostIP: '10.205.26.223',
      podIP: '10.128.10.193',
      podIPs: [
        {
          ip: '10.128.10.193',
        },
      ],
      startTime: '2023-03-16T10:15:49Z',
      initContainerStatuses: [
        {
          name: 'prepare',
          state: {
            terminated: {
              exitCode: 0,
              reason: 'Completed',
              startedAt: '2023-03-16T10:15:51Z',
              finishedAt: '2023-03-16T10:15:51Z',
              containerID:
                'cri-o://48b7133427bbae30523addc627bb02e8e300b3e4767cc484735929e1bf93a7d4',
            },
          },
          lastState: {},
          ready: true,
          restartCount: 0,
          image:
            'registry.redhat.io/openshift-pipelines/pipelines-entrypoint-rhel8@sha256:08cbd580243004da2e2376a0af1d6496ad9e6ef2e42da951fbdbadc0dca30c69',
          imageID:
            'registry.redhat.io/openshift-pipelines/pipelines-entrypoint-rhel8@sha256:08cbd580243004da2e2376a0af1d6496ad9e6ef2e42da951fbdbadc0dca30c69',
          containerID: 'cri-o://48b7133427bbae30523addc627bb02e8e300b3e4767cc484735929e1bf93a7d4',
        },
        {
          name: 'place-scripts',
          state: {
            terminated: {
              exitCode: 0,
              reason: 'Completed',
              startedAt: '2023-03-16T10:15:53Z',
              finishedAt: '2023-03-16T10:15:53Z',
              containerID:
                'cri-o://84a784b0c9b2194f6013f42739cf7cac4a35eb9b1b1857c72170e01621da46b1',
            },
          },
          lastState: {},
          ready: true,
          restartCount: 0,
          image:
            'registry.redhat.io/ubi8/ubi-minimal@sha256:6910799b75ad41f00891978575a0d955be2f800c51b955af73926e7ab59a41c3',
          imageID:
            'registry.redhat.io/ubi8/ubi-minimal@sha256:34e7fd35ddac937263dbbdb6d492c9a031dbd38880777bc8ddb9ed0442a0fb03',
          containerID: 'cri-o://84a784b0c9b2194f6013f42739cf7cac4a35eb9b1b1857c72170e01621da46b1',
        },
      ],
      containerStatuses: [
        {
          name: 'step-appstudio-summary',
          state: {
            terminated: {
              exitCode: 0,
              reason: 'Completed',
              message: '[{"key":"StartedAt","value":"2023-03-16T10:15:56.380Z","type":3}]',
              startedAt: '2023-03-16T10:15:54Z',
              finishedAt: '2023-03-16T10:15:56Z',
              containerID:
                'cri-o://963bff4d08d2474c88c28daff4cc7eae87c04ef4a6efa21c69c4512b4e6d1e6f',
            },
          },
          lastState: {},
          ready: false,
          restartCount: 0,
          image:
            'registry.redhat.io/openshift4/ose-cli@sha256:9f0cdc00b1b1a3c17411e50653253b9f6bb5329ea4fb82ad983790a6dbf2d9ad',
          imageID:
            'quay.io/openshift-release-dev/ocp-v4.0-art-dev@sha256:9f0cdc00b1b1a3c17411e50653253b9f6bb5329ea4fb82ad983790a6dbf2d9ad',
          containerID: 'cri-o://963bff4d08d2474c88c28daff4cc7eae87c04ef4a6efa21c69c4512b4e6d1e6f',
          started: false,
        },
      ],
      qosClass: 'Burstable',
    },
  },
];
