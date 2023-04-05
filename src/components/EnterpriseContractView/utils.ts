import { K8sResourceCommon } from '@openshift/dynamic-plugin-sdk-utils';
import { PipelineRunLabel } from '../../consts/pipelinerun';

export const isResourceEnterpriseContract = (resource: K8sResourceCommon): boolean => {
  return resource.metadata?.labels[PipelineRunLabel.PIPELINE_NAME] === 'enterprise-contract';
};
