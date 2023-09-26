import * as React from 'react';
import { Flex, FlexItem, Text, TextVariants } from '@patternfly/react-core';
import { EnvironmentKindWithHealthStatus } from '../hooks/useAllApplicationEnvironmentsWithHealthStatus';
import { Timestamp } from '../shared/components/timestamp/Timestamp';
import { EnvironmentKind } from '../types';
import { SnapshotEnvironmentBinding } from '../types/coreBuildService';
import { GitOpsDeploymentHealthStatus } from '../types/gitops-deployment';
import { getGitOpsDeploymentHealthStatusIcon } from './gitops-utils';
import { runStatus } from './pipeline-utils';

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
  const sortedEnvs = environments
    .filter((env) => !isPositionedEnvironment(env, environments))
    .sort((a, b) => a.metadata.name.localeCompare(b.metadata.name));
  const positionedEnvs = environments.filter((env) => isPositionedEnvironment(env, environments));
  insertPositionedEnvironments(positionedEnvs, sortedEnvs);
  return sortedEnvs;
};

export const getComponentDeploymentStatus = (
  snapshotEnvironmentBinding: SnapshotEnvironmentBinding,
): GitOpsDeploymentHealthStatus => {
  if (!snapshotEnvironmentBinding?.status?.gitopsDeployments?.length) {
    return GitOpsDeploymentHealthStatus.Missing;
  }

  return snapshotEnvironmentBinding.status.gitopsDeployments.reduce((acc, compDeployment) => {
    if (
      compDeployment.health &&
      Object.keys(GitOpsDeploymentHealthStatus).indexOf(compDeployment.health) >
        Object.keys(GitOpsDeploymentHealthStatus).indexOf(acc)
    ) {
      return GitOpsDeploymentHealthStatus[compDeployment.health];
    }
    return acc;
  }, GitOpsDeploymentHealthStatus.Healthy);
};

export const healthStatusToRunStatus = (healthStatus: GitOpsDeploymentHealthStatus): runStatus => {
  switch (healthStatus) {
    case GitOpsDeploymentHealthStatus.Healthy:
      return runStatus.Succeeded;
    case GitOpsDeploymentHealthStatus.Progressing:
      return runStatus.Running;
    case GitOpsDeploymentHealthStatus.Degraded:
      return runStatus.Failed;
    default:
      return runStatus.Pending;
  }
};

export const getComponentDeploymentRunStatus = (
  snapshotEnvironmentBinding: SnapshotEnvironmentBinding,
): runStatus => healthStatusToRunStatus(getComponentDeploymentStatus(snapshotEnvironmentBinding));

export const getEnvironmentStatus = (
  snapshotEnvironmentBinding: SnapshotEnvironmentBinding,
): GitOpsDeploymentHealthStatus => {
  if (!snapshotEnvironmentBinding || !snapshotEnvironmentBinding.status) {
    return GitOpsDeploymentHealthStatus.Missing;
  } else if (
    snapshotEnvironmentBinding?.status?.componentDeploymentConditions?.some(
      (c) => c.type === 'ErrorOccurred',
    )
  ) {
    return GitOpsDeploymentHealthStatus.Degraded;
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

export const getEnvironmentRunStatus = (
  snapshotEnvironmentBinding: SnapshotEnvironmentBinding,
): runStatus => healthStatusToRunStatus(getEnvironmentStatus(snapshotEnvironmentBinding));

export const ApplicationEnvironmentStatus: React.FC<{
  environment: EnvironmentKindWithHealthStatus;
}> = ({ environment }) => {
  return (
    <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsMd' }}>
      <FlexItem>
        <Text component={TextVariants.small} style={{ color: 'var(--pf-v5-global--Color--200)' }}>
          {getGitOpsDeploymentHealthStatusIcon(environment.healthStatus)} Application{' '}
          {environment.healthStatus}
        </Text>
      </FlexItem>
      <FlexItem>
        <Flex spaceItems={{ default: 'spaceItemsSm' }}>
          <Text component={TextVariants.small}>
            <b>Last Deploy:</b>
          </Text>
          <Text component={TextVariants.small} style={{ color: 'var(--pf-v5-global--Color--200)' }}>
            <Timestamp timestamp={environment.lastDeploy} simple />
          </Text>
        </Flex>
      </FlexItem>
    </Flex>
  );
};
