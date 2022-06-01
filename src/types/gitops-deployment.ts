import { K8sResourceCommon } from '@openshift/dynamic-plugin-sdk-utils';

export enum GitOpsDeploymentStrategy {
  automated = 'Automated',
  manual = 'Manual',
}

export enum GitOpsDeploymentHealthStatus {
  Healthy = 'Healthy',
  Progressing = 'Progressing',
  Degraded = 'Degraded',
  Suspended = 'Suspended',
  Missing = 'Missing',
  Unknown = 'Unknown',
}

export enum GitOpsDeploymentSyncStatus {
  Synced = 'Synced',
  Unknown = 'Unknown',
  OutOfSync = 'OutOfSync',
}

export type GitOpsDeploymentKind = {
  spec: {
    source: {
      path: string;
      repoUrl: string;
    };
    type: GitOpsDeploymentStrategy;
  };
  status: {
    health: {
      status: GitOpsDeploymentHealthStatus;
      message?: string;
    };
    sync: {
      revision: string;
      status: GitOpsDeploymentSyncStatus;
    };
  };
} & K8sResourceCommon;
