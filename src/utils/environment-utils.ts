import { EnvironmentKind } from '../types';

export enum EnvironmentDeploymentStrategy {
  AppStudioAutomated = 'Automatic',
  Manual = 'Manual',
}

export const getEnvironmentDeploymentStrategyLabel = (
  environment: EnvironmentKind,
): EnvironmentDeploymentStrategy =>
  EnvironmentDeploymentStrategy[environment.spec.deploymentStrategy];
