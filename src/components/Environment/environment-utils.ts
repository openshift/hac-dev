import * as React from 'react';
import { k8sCreateResource, useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import YAML from 'js-yaml';
import * as yup from 'yup';
import {
  EnvironmentGroupVersionKind,
  EnvironmentModel,
  GitOpsDeploymentManagedEnvironmentGroupVersionKind,
  SecretModel,
} from '../../models';
import { GitOpsDeploymentManagedEnvironmentKind, EnvironmentKind, SecretKind } from '../../types';
import { ReleasePlanKind } from '../../types/coreBuildService';
import {
  dnsSubDomainRegex,
  MAX_RESOURCE_NAME_LENGTH,
  RESOURCE_NAME_LENGTH_ERROR_MSG,
  RESOURCE_NAME_REGEX_MSG,
  resourceNameRegex,
} from '../ImportForm/utils/validation-utils';
import { CreateEnvironmentFormValues } from './create/CreateEnvironmentForm';

export enum EnvironmentDeploymentStrategy {
  Automatic = 'AppStudioAutomated',
  Manual = 'Manual',
}

export enum EnvironmentFormDropdownType {
  'POC' = 'poc',
  'NON POC' = 'non-poc',
}

export enum EnvironmentType {
  default = 'default',
  static = 'static',
  managed = 'managed',
}

export enum ClusterType {
  kubernetes = 'Kubernetes',
  openshift = 'OpenShift',
}

export type KubeConfig = {
  clusters: {
    cluster: {
      server: string;
    };
  }[];
  users: {
    name: string;
    user: {
      token: string;
    };
  };
};

export const environmentTypeItems = [
  { key: EnvironmentType.managed, value: 'I want to bring my own cluster' },
];

export const clusterTypeValues = {
  [ClusterType.openshift]: 'OpenShift',
  [ClusterType.kubernetes]: 'Non-OpenShift',
};

export const clusterTypeItems = [
  { key: ClusterType.openshift, value: clusterTypeValues[ClusterType.openshift] },
  { key: ClusterType.kubernetes, value: clusterTypeValues[ClusterType.kubernetes] },
];

export const environmentFormSchema = yup.object({
  name: yup
    .string()
    .matches(resourceNameRegex, RESOURCE_NAME_REGEX_MSG)
    .max(MAX_RESOURCE_NAME_LENGTH, RESOURCE_NAME_LENGTH_ERROR_MSG)
    .required('Required'),
  deploymentStrategy: yup.string().required('Required'),
  environmentType: yup.string().required('Required'),
  clusterType: yup.string().required('Required'),
  ingressDomain: yup
    .string()
    .matches(dnsSubDomainRegex, 'Must be a valid DNS domain name.')
    .test(
      'ingress-domain-required',
      'Ingress domain is required for non-OpenShift clusters.',
      (value, options) =>
        !!value || options.parent?.clusterType !== clusterTypeValues[ClusterType.kubernetes],
    ),
  kubeconfig: yup
    .string()
    .required('Required')
    .test(
      'is-valid-yaml',
      'Required fields missing from the file. Please upload or paste the file with all needed information.',
      (value) => {
        try {
          const kubeconfig = YAML.load(value) as KubeConfig;
          if (
            typeof kubeconfig !== 'object' ||
            !kubeconfig?.clusters?.[0]?.cluster?.server ||
            !kubeconfig?.users?.[0]?.user?.token
          ) {
            return false;
          }
          return true;
        } catch {
          return false;
        }
      },
    ),
  targetNamespace: yup
    .string()
    .matches(resourceNameRegex, RESOURCE_NAME_REGEX_MSG)
    .required('Required'),
});

/**
 * @deprecated Remove Environments and Deployment references
 * https://issues.redhat.com/browse/HAC-5682
 */
export const getEnvironmentType = (env: EnvironmentKind): EnvironmentType =>
  env.spec?.tags?.includes(EnvironmentType.managed)
    ? EnvironmentType.managed
    : env.spec?.tags?.includes(EnvironmentType.static)
    ? EnvironmentType.static
    : EnvironmentType.default;

/**
 * @deprecated Remove Environments and Deployment references
 * https://issues.redhat.com/browse/HAC-5682
 */
export const getEnvironmentTypeLabel = (type: EnvironmentType) => {
  switch (type) {
    case EnvironmentType.managed:
      return 'Self Managed';
    case EnvironmentType.static:
      return 'Static';
    default:
      return 'Default';
  }
};

export const createEnvironmentKindFromReleasePlan = (
  releasePlan: ReleasePlanKind,
): EnvironmentKind => ({
  apiGroup: releasePlan.apiGroup,
  apiVersion: EnvironmentGroupVersionKind.version,
  kind: EnvironmentGroupVersionKind.kind,
  metadata: releasePlan.metadata,
  spec: {
    displayName: releasePlan.metadata.name,
    tags: [EnvironmentType.managed],
    type: 'non-poc',
    deploymentStrategy: EnvironmentDeploymentStrategy.Manual,
  },
});

const createCredentialsSecret = async (kubeconfig: string, namespace: string, dryRun = false) => {
  const resource: SecretKind = {
    apiVersion: SecretModel.apiVersion,
    kind: SecretModel.kind,
    metadata: { generateName: 'env-cluster-credentials-', namespace },
    type: 'managed-gitops.redhat.com/managed-environment',
    stringData: { kubeconfig },
  };
  return k8sCreateResource({
    model: SecretModel,
    resource,
    ...(dryRun && { queryOptions: { queryParams: { dryRun: 'All' } } }),
  });
};

/**
 * @deprecated Remove Environments and Deployment references
 * https://issues.redhat.com/browse/HAC-5682
 */
export const createEnvironment = async (
  values: CreateEnvironmentFormValues,
  namespace: string,
  dryRun = false,
) => {
  const secret = await createCredentialsSecret(values.kubeconfig, namespace, dryRun);
  const kubeconfig = YAML.load(values.kubeconfig) as KubeConfig;
  const envType = environmentTypeItems.find((e) => e.value === values.environmentType)?.key;
  const clusterType = clusterTypeItems.find((e) => e.value === values.clusterType)?.key;
  const resource: EnvironmentKind = {
    apiVersion: `${EnvironmentModel.apiGroup}/${EnvironmentModel.apiVersion}`,
    kind: EnvironmentModel.kind,
    metadata: { name: values.name.toLowerCase().trim().split(' ').join('-'), namespace },
    spec: {
      displayName: values.name,
      deploymentStrategy: EnvironmentDeploymentStrategy[values.deploymentStrategy],
      tags: [envType],
      unstableConfigurationFields: {
        clusterType,
        kubernetesCredentials: {
          allowInsecureSkipTLSVerify: true,
          apiURL: kubeconfig.clusters[0].cluster.server,
          clusterCredentialsSecret: secret.metadata.name,
          targetNamespace: values.targetNamespace,
          ingressDomain: clusterType === ClusterType.kubernetes ? values.ingressDomain : undefined,
          namespaces: [values.targetNamespace],
        },
      },
    },
  };
  return k8sCreateResource({
    model: EnvironmentModel,
    resource,
    ...(dryRun && { queryOptions: { queryParams: { dryRun: 'All' } } }),
  });
};

export const useEnvConnectionStatus = (environment: EnvironmentKind) => {
  const [managedEnvs] = useK8sWatchResource<GitOpsDeploymentManagedEnvironmentKind[]>({
    groupVersionKind: GitOpsDeploymentManagedEnvironmentGroupVersionKind,
    isList: true,
    namespace: environment.metadata.namespace,
  });

  return React.useMemo(() => {
    const managedEnv = managedEnvs?.find((e) =>
      e.metadata.ownerReferences?.some(
        (r) => r.kind === 'Environment' && r.name === environment.metadata.name,
      ),
    );

    return managedEnv?.status?.conditions?.find(
      (s) => s.type === 'ConnectionInitializationSucceeded',
    );
  }, [environment.metadata.name, managedEnvs]);
};
