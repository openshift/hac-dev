import { K8sResourceCommon } from '@openshift/dynamic-plugin-sdk-utils';
import { K8sGroupVersionKind } from '../dynamic-plugin-sdk';
import { TektonResource, TektonResultsRun, TektonTaskSpec } from './coreTekton';
import { PipelineTaskParam, PipelineTaskRef } from './pipeline';
import {
  Condition,
  PLRTaskRunStep,
  VolumeTypeConfigMaps,
  VolumeTypePVC,
  VolumeTypeSecret,
} from './pipeline-run';
import { TaskKind } from '.';

export type TaskRunWorkspace = {
  name: string;
  volumeClaimTemplate?: any; //PersistentVolumeClaimKind;
  persistentVolumeClaim?: VolumeTypePVC;
  configMap?: VolumeTypeConfigMaps;
  emptyDir?: {};
  secret?: VolumeTypeSecret;
  subPath?: string;
};

export type TaskRunStatus = {
  completionTime?: string;
  conditions?: Condition[];
  podName?: string;
  startTime?: string;
  steps?: PLRTaskRunStep[];
  taskResults?: TektonResultsRun[];
  taskSpec?: TaskKind['spec'];
};

export type TaskRunKind = K8sResourceCommon & {
  spec: {
    taskRef?: PipelineTaskRef;
    taskSpec?: TektonTaskSpec;
    serviceAccountName?: string;
    params?: PipelineTaskParam[];
    resources?: TektonResource[];
    timeout?: string;
    workspaces?: TaskRunWorkspace[];
  };
  status?: TaskRunStatus;
};

export const TaskRunGroupVersionKind: K8sGroupVersionKind = {
  group: 'tekton.dev',
  version: 'v1beta1',
  kind: 'TaskRun',
};
