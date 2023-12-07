import { K8sResourceCommon } from '@openshift/dynamic-plugin-sdk-utils';
import { ObjectMetadata } from '../shared/components/types';
import { TektonResultsRun } from './coreTekton';
import { PipelineKind, PipelineSpec, WhenExpression } from './pipeline';
import { TaskRunStatus, TaskRunStatusV1Beta1 } from './task-run';

export type PLRTaskRunStep = {
  container: string;
  imageID?: string;
  name: string;
  waiting?: {
    reason: string;
  };
  running?: {
    startedAt: string;
  };
  terminated?: {
    containerID: string;
    exitCode: number;
    finishedAt: string;
    reason: string;
    startedAt: string;
    message?: string;
  };
};

export type PLRTaskRunData = {
  pipelineTaskName: string;
  status: TaskRunStatus;
};

type PLRTaskRuns = {
  [taskRunName: string]: PLRTaskRunData;
};

export type VolumeTypeSecret = {
  secretName: string;
  items?: {
    key: string;
    path: string;
  }[];
};

export type VolumeTypeConfigMaps = {
  name: string;
  items?: {
    key: string;
    path: string;
  }[];
};

export type VolumeTypePVC = {
  claimName: string;
};

export type PersistentVolumeClaimType = {
  persistentVolumeClaim: VolumeTypePVC;
};

export type VolumeClaimTemplateType = {
  volumeClaimTemplate: VolumeTypeClaim;
};
export type VolumeTypeClaim = {
  metadata?: ObjectMetadata;
  spec: {
    accessModes: string[];
    resources: {
      requests: {
        storage: string;
      };
    };
    storageClassName?: string;
    volumeMode?: string;
  };
};

export type Condition = {
  type: string;
  status: string;
  reason?: string;
  message?: string;
  binding?: string;
  lastTransitionTime?: string;
};

export type PipelineRunEmbeddedResourceParam = { name: string; value: string };
export type PipelineRunEmbeddedResource = {
  name: string;
  resourceSpec: {
    params: PipelineRunEmbeddedResourceParam[];
    type: string;
  };
};
export type PipelineRunReferenceResource = {
  name: string;
  resourceRef: {
    name: string;
  };
};
type PipelineRunResource = PipelineRunReferenceResource | PipelineRunEmbeddedResource;

export type PipelineRunWorkspace = {
  name: string;
  [volumeType: string]:
    | VolumeTypeSecret
    | VolumeTypeConfigMaps
    | VolumeTypePVC
    | VolumeTypeClaim
    | {};
};

export type PipelineRunParam = {
  name: string;
  value: string | string[];

  // TODO: To be validated
  input?: string;
  output?: string;
  resource?: object;
};

export type PipelineRunStatus = {
  succeededCondition?: string;
  creationTimestamp?: string;
  conditions?: Condition[];
  startTime?: string;
  completionTime?: string;
  taskRuns?: PLRTaskRuns;
  pipelineSpec: PipelineSpec;
  skippedTasks?: {
    name: string;
    reason?: string;
    whenExpressions?: WhenExpression[];
  }[];
  results?: TektonResultsRun[];
};

export type PipelineRunKindV1 = K8sResourceCommon & {
  spec: {
    pipelineRef?: { name: string; resolver?: string };
    pipelineSpec?: PipelineSpec;
    params?: PipelineRunParam[];
    workspaces?: PipelineRunWorkspace[];
    taskRunTemplate?: {
      serviceAccountName?: string;
    };
    timeout?: {
      pipeline: string;
      tasks: string;
      finally: string;
    };
    // Only used in a single case - cancelling a pipeline; should not be copied between PLRs
    status?: 'StoppedRunFinally' | 'CancelledRunFinally' | 'PipelineRunPending';
  };
  status?: PipelineRunStatus;
};

/**
 * @deprecated
 */
type PLRTaskRunsV1Beta1 = {
  [taskRunName: string]: {
    pipelineTaskName: string;
    status: TaskRunStatusV1Beta1;
  };
};

/**
 * @deprecated
 */
export type PipelineRunStatusV1Beta1 = {
  succeededCondition?: string;
  creationTimestamp?: string;
  conditions?: Condition[];
  startTime?: string;
  completionTime?: string;
  taskRuns?: PLRTaskRunsV1Beta1;
  pipelineSpec: PipelineSpec;
  skippedTasks?: {
    name: string;
    reason?: string;
    whenExpressions?: WhenExpression[];
  }[];
  pipelineResults?: TektonResultsRun[];
};

/**
 * @deprecated
 */
export type PipelineRunKindV1Beta1 = K8sResourceCommon & {
  spec: {
    pipelineRef?: { name: string; bundle?: string };
    pipelineSpec?: PipelineSpec;
    params?: PipelineRunParam[];
    workspaces?: PipelineRunWorkspace[];
    resources?: PipelineRunResource[];
    serviceAccountName?: string;
    timeout?: string;
    // Only used in a single case - cancelling a pipeline; should not be copied between PLRs
    status?: 'StoppedRunFinally' | 'CancelledRunFinally' | 'PipelineRunPending';
  };
  status?: PipelineRunStatusV1Beta1;
};

export type PipelineRunKind = PipelineRunKindV1 | PipelineRunKindV1Beta1;

export type PipelineWithLatest = PipelineKind & {
  latestRun?: PipelineRunKind;
};
