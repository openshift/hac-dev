import { RunStatus } from '@patternfly/react-topology';
import { EnvironmentKind } from '../types';
import { SnapshotEnvironmentBinding } from '../types/coreBuildService';
import { GitOpsDeploymentHealthStatus } from '../types/gitops-deployment';

export enum EnvironmentDeploymentStrategy {
  AppStudioAutomated = 'Automatic',
  Manual = 'Manual',
}

export const getEnvironmentDeploymentStrategyLabel = (
  environment: EnvironmentKind,
): EnvironmentDeploymentStrategy =>
  EnvironmentDeploymentStrategy[environment.spec.deploymentStrategy];

const findIndexForEnv = (env: EnvironmentKind, currentEnvs: EnvironmentKind[]): number => {
  if (env.spec.parentEnvironment === undefined) {
    return 0;
  }
  let finalIndex = -1;
  const index = currentEnvs.findIndex((e) => e.metadata.name === env.spec.parentEnvironment);
  if (index >= 0) {
    const alphaIndex = currentEnvs
      .slice(index + 1)
      .findIndex(
        (e) =>
          e.spec.parentEnvironment === env.spec.parentEnvironment &&
          e.metadata.name.localeCompare(env.metadata.name) > 0,
      );
    finalIndex = alphaIndex >= 0 ? index + 1 + alphaIndex : alphaIndex;
  }
  const indexBefore = currentEnvs.findIndex((e) => e.spec.parentEnvironment === env.metadata.name);
  if (indexBefore >= 0 && finalIndex === -1) {
    finalIndex = Math.max(0, indexBefore - 1);
  }
  return finalIndex;
};

export const isPositionedEnvironment = (
  env: EnvironmentKind,
  allEnvs: EnvironmentKind[],
): boolean => !!allEnvs.find((e) => env.spec.parentEnvironment === e.metadata.name);

const insertEnvironment = (env: EnvironmentKind, currentEnvs: EnvironmentKind[]): void => {
  const index = findIndexForEnv(env, currentEnvs);
  if (index >= 0) {
    currentEnvs.splice(index, 0, env);
  } else {
    currentEnvs.push(env);
  }
};

const insertPositionedEnvironments = (
  insertEnvs: EnvironmentKind[],
  currentEnvs: EnvironmentKind[],
): void => {
  if (insertEnvs.length === 0) {
    return;
  }

  const sortedEnvs = insertEnvs.filter((env) => !isPositionedEnvironment(env, insertEnvs));
  const positionedEnvs = insertEnvs.filter((env) => isPositionedEnvironment(env, insertEnvs));

  if (sortedEnvs.length === 0) {
    // Circular dependencies
    positionedEnvs.forEach((i) => insertEnvironment(i, currentEnvs));
    return;
  }

  sortedEnvs.forEach((i) => insertEnvironment(i, currentEnvs));
  insertPositionedEnvironments(positionedEnvs, currentEnvs);
};

// based on the logic from insert before/after extensions
export const sortEnvironmentsBasedonParent = (
  environments: EnvironmentKind[],
): EnvironmentKind[] => {
  if (!environments || !environments.length) {
    return [];
  }
  const sortedEnvs = environments.filter((env) => !isPositionedEnvironment(env, environments));
  const positionedEnvs = environments.filter((env) => isPositionedEnvironment(env, environments));
  insertPositionedEnvironments(positionedEnvs, sortedEnvs);
  return sortedEnvs;
};

export const getComponentDeploymentStatus = (
  snapshotEnvironmentBinding: SnapshotEnvironmentBinding,
): GitOpsDeploymentHealthStatus => {
  if (!snapshotEnvironmentBinding || !snapshotEnvironmentBinding.status) {
    return GitOpsDeploymentHealthStatus.Missing;
  }
  const allcomponentsDeployed =
    snapshotEnvironmentBinding?.status?.componentDeploymentConditions?.some(
      (c) =>
        c.reason === 'CommitsSynced' && c.status === 'True' && c.type === 'AllComponentsDeployed',
    );

  if (allcomponentsDeployed) {
    return GitOpsDeploymentHealthStatus.Healthy;
  }

  return GitOpsDeploymentHealthStatus.Progressing;
};

export const getComponentDeploymentRunStatus = (
  snapshotEnvironmentBinding: SnapshotEnvironmentBinding,
): RunStatus => {
  const status = getComponentDeploymentStatus(snapshotEnvironmentBinding);

  switch (status) {
    case GitOpsDeploymentHealthStatus.Healthy:
      return RunStatus.Succeeded;
    case GitOpsDeploymentHealthStatus.Progressing:
      return RunStatus.Running;
    case GitOpsDeploymentHealthStatus.Degraded:
      return RunStatus.Failed;
    default:
      return RunStatus.Pending;
  }
};
