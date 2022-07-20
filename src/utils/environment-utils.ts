export enum EnvironmentDeploymentStrategy {
  AppStudioAutomated = 'Automatic',
  Manual = 'Manual',
}

export const getEnvironmentDeploymentStrategyLabel = (environment): EnvironmentDeploymentStrategy =>
  EnvironmentDeploymentStrategy[environment.spec.deploymentStrategy];
