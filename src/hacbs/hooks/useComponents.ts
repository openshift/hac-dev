import * as React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { ComponentGroupVersionKind } from '../../models';
import { ComponentKind } from '../../types';

export const useComponents = (
  namespace: string,
  applicationName: string,
): [ComponentKind[], boolean, unknown] => {
  const [components, componentsLoaded, error] = useK8sWatchResource<ComponentKind[]>({
    groupVersionKind: ComponentGroupVersionKind,
    namespace,
    isList: true,
  });
  const appComponents: ComponentKind[] = React.useMemo(
    () =>
      componentsLoaded
        ? components?.filter((c) => c.spec.application === applicationName) || []
        : [],
    [components, applicationName, componentsLoaded],
  );
  return [appComponents, componentsLoaded, error];
};
