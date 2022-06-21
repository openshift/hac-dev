import { K8sResourceCommon } from '@openshift/dynamic-plugin-sdk-utils';
import { ResourceStatusCondition } from '../types';

export const getConditionForResource = <R extends K8sResourceCommon>(
  resource: R,
): ResourceStatusCondition => {
  const conditions = (resource.status?.conditions as ResourceStatusCondition[]) ?? [];
  const updatedCondition = conditions?.filter((condition) => condition.type === 'Updated');
  const findConditionWithReason = (searchConditions: ResourceStatusCondition[], reason: string) =>
    searchConditions?.find((condition) => condition.reason === reason);
  if (updatedCondition?.length > 0) {
    return (
      findConditionWithReason(updatedCondition, 'Error') ||
      findConditionWithReason(updatedCondition, 'OK')
    );
  }
  const createdCondition = conditions?.filter((condition) => condition.type === 'Created');
  if (createdCondition?.length > 0) {
    return (
      findConditionWithReason(createdCondition, 'Error') ||
      findConditionWithReason(createdCondition, 'OK')
    );
  }
  return undefined;
};
