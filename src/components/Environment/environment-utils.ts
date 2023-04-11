import * as yup from 'yup';
import { EnvironmentGroupVersionKind } from '../../models';
import { EnvironmentKind } from '../../types';
import { ReleasePlanKind } from '../../types/coreBuildService';

export enum EnvironmentDeploymentStrategy {
  Automatic = 'AppStudioAutomated',
  Manual = 'Manual',
}

export enum EnvironmentFormDropdownType {
  'POC' = 'poc',
  'NON POC' = 'non-poc',
}

export enum EnvironmentType {
  default = 'default',
  static = 'static',
  managed = 'managed',
}

export const environmentFormSchema = yup.object({
  name: yup.string().trim().min(1).required('Required'),
  deploymentStrategy: yup.string().required('Required'),
  parentEnvironment: yup.string(),
  location: yup.string(),
});

export const getEnvironmentType = (env: EnvironmentKind): EnvironmentType =>
  env.spec?.tags?.includes(EnvironmentType.managed)
    ? EnvironmentType.managed
    : env.spec?.tags?.includes(EnvironmentType.static)
    ? EnvironmentType.static
    : EnvironmentType.default;

export const getEnvironmentTypeLabel = (type: EnvironmentType) => {
  switch (type) {
    case EnvironmentType.managed:
      return 'Self Managed';
    case EnvironmentType.static:
      return 'Static';
    default:
      return 'Default';
  }
};

export const createEnvironmentKindFromReleasePlan = (
  releasePlan: ReleasePlanKind,
): EnvironmentKind => ({
  apiGroup: releasePlan.apiGroup,
  apiVersion: EnvironmentGroupVersionKind.version,
  kind: EnvironmentGroupVersionKind.kind,
  metadata: releasePlan.metadata,
  spec: {
    displayName: releasePlan.spec.displayName,
    tags: [EnvironmentType.managed],
    type: 'non-poc',
    deploymentStrategy: EnvironmentDeploymentStrategy.Manual,
  },
});
