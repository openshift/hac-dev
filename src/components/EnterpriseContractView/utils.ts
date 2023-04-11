import { K8sResourceCommon } from '@openshift/dynamic-plugin-sdk-utils';

const ENTERPRISE_CONTRACT_LABEL = 'build.appstudio.redhat.com/pipeline';

export const isResourceEnterpriseContract = (resource: K8sResourceCommon): boolean => {
  return resource?.metadata?.labels[ENTERPRISE_CONTRACT_LABEL] === 'enterprise-contract';
};
