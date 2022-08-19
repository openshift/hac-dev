import { EnvironmentKind } from '../types';

export enum EnvironmentDeploymentStrategy {
  AppStudioAutomated = 'Automatic',
  Manual = 'Manual',
}

export const getEnvironmentDeploymentStrategyLabel = (
  environment: EnvironmentKind,
): EnvironmentDeploymentStrategy =>
  EnvironmentDeploymentStrategy[environment.spec.deploymentStrategy];

const findIndexForEnv = (env: EnvironmentKind, currentEnvs: EnvironmentKind[]): number => {
  const index = currentEnvs.findIndex((e) => e.metadata.name === env.spec.parentEnvironment);
  if (index >= 0) {
    return index + 1;
  }
  return index;
};

const isPositionedEnvironment = (env: EnvironmentKind, allEnvs: EnvironmentKind[]): boolean =>
  !!allEnvs.find((e) => env.spec.parentEnvironment === e.metadata.name);

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
