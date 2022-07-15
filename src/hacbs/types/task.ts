import { K8sResourceCommon } from '@openshift/dynamic-plugin-sdk-utils';
import { TektonTaskSpec } from './coreTekton';

export type TaskKind = K8sResourceCommon & {
  spec: TektonTaskSpec;
};
