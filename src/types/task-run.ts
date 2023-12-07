import { K8sResourceCommon } from '@openshift/dynamic-plugin-sdk-utils';
import {
  TektonResource,
  TektonResultsRun,
  TektonTaskSpec,
  TektonTaskSpecV1Beta1,
} from './coreTekton';
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
  results?: TektonResultsRun[];
  taskSpec?: TaskKind['spec'];
};

export type TaskRunKindV1 = K8sResourceCommon & {
  spec: {
    taskRef?: PipelineTaskRef;
    taskSpec?: TektonTaskSpec;
    serviceAccountName?: string;
    params?: PipelineTaskParam[];
    timeout?: string;
    workspaces?: TaskRunWorkspace[];
  };
  status?: TaskRunStatus;
};

/**
 * @deprecated
 */
export type TaskRunStatusV1Beta1 = {
  completionTime?: string;
  conditions?: Condition[];
  podName?: string;
  startTime?: string;
  steps?: PLRTaskRunStep[];
  taskResults?: TektonResultsRun[];
  taskSpec?: TaskKind['spec'];
};

/**
 * @deprecated
 */
export type TaskRunKindV1Beta1 = K8sResourceCommon & {
  spec: {
    taskRef?: PipelineTaskRef;
    taskSpec?: TektonTaskSpecV1Beta1;
    serviceAccountName?: string;
    params?: PipelineTaskParam[];
    resources?: TektonResource[];
    timeout?: string;
    workspaces?: TaskRunWorkspace[];
  };
  status?: TaskRunStatusV1Beta1;
};

export type TaskRunKind = TaskRunKindV1 | TaskRunKindV1Beta1;
