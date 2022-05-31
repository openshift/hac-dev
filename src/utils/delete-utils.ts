import { k8sDeleteResource, K8sResourceCommon } from '@openshift/dynamic-plugin-sdk-utils';
import { ComponentModel } from '../models';

/**
 * Delete Component CR
 *
 * @param component component data TODO: Data might change based on the API requirements
 * @param application application name
 * @returns A promise
 *
 * TODO: Return type any should be changed to a proper type like K8sResourceCommon
 */
export const deleteComponent = (
  componentName: string,
  namespace: string,
): Promise<K8sResourceCommon> => {
  return k8sDeleteResource({
    model: ComponentModel,
    queryOptions: {
      name: componentName,
      ns: namespace,
    },
  });
};
