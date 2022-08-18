import { EnvironmentKind } from '../../../types';

export enum EnvironmentType {
  static = 'static',
  managed = 'managed',
  ephemeral = 'ephemeral',
}

export const getEnvironmentType = (env: EnvironmentKind): EnvironmentType =>
  env.spec?.tags?.includes(EnvironmentType.managed)
    ? EnvironmentType.managed
    : env.spec?.tags?.includes(EnvironmentType.ephemeral)
    ? EnvironmentType.ephemeral
    : EnvironmentType.static;

export const getEnvironmentTypeLabel = (type: EnvironmentType) => {
  switch (type) {
    case EnvironmentType.managed:
      return 'Managed';
    case EnvironmentType.ephemeral:
      return 'Ephemeral';
    default:
      return 'Static';
  }
};
