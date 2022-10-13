import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { ComponentGroupVersionKind } from '../models';
import { ComponentKind } from '../types';

export const useLastApplicationDeployTime = (
  namespace: string,
  applicationName: string,
): [string, boolean] => {
  const [components, componentsLoaded] = useK8sWatchResource<ComponentKind[]>({
    groupVersionKind: ComponentGroupVersionKind,
    namespace,
    isList: true,
  });

  const lastDeployTime =
    components
      ?.filter((c) => c.spec.application === applicationName)
      ?.sort((c1, c2) =>
        c2.metadata.creationTimestamp.localeCompare(c1.metadata.creationTimestamp),
      )[0]?.metadata.creationTimestamp ?? '-';

  return [lastDeployTime, componentsLoaded];
};
