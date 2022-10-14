import * as yup from 'yup';

export enum EnvironmentDeploymentStrategy {
  Automatic = 'AppStudioAutomated',
  Manual = 'Manual',
}

export enum EnvironmentFormDropdownType {
  'POC' = 'poc',
  'NON POC' = 'non-poc',
}

export enum EnvironmentType {
  poc = 'poc',
  nonPoc = 'non-poc',
}

export const environmentFormSchema = yup.object({
  name: yup.string().trim().min(1).required('Required'),
  deploymentStrategy: yup.string().required('Required'),
  parentEnvironment: yup.string(),
  location: yup.string(),
});
