import * as React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { ComponentGroupVersionKind } from '../models';
import { ComponentKind } from '../types';
import { useWorkspaceInfo } from '../utils/workspace-context-utils';

export const useComponent = (
  namespace: string,
  componentName?: string,
): [ComponentKind, boolean, unknown] => {
  const [component, componentsLoaded, error] = useK8sWatchResource<ComponentKind>(
    componentName
      ? {
          groupVersionKind: ComponentGroupVersionKind,
          namespace,
          name: componentName,
        }
      : undefined,
  );
  return React.useMemo(() => {
    if (componentsLoaded && !error && component?.metadata.deletionTimestamp) {
      return [null, componentsLoaded, { code: 404 }];
    }
    return [component, componentsLoaded, error];
  }, [component, componentsLoaded, error]);
};

export const useComponents = (
  namespace: string,
  applicationName: string,
): [ComponentKind[], boolean, unknown] => {
  const [components, componentsLoaded, error] = useK8sWatchResource<ComponentKind[]>(
    namespace
      ? {
          groupVersionKind: ComponentGroupVersionKind,
          namespace,
          isList: true,
        }
      : null,
  );
  const appComponents: ComponentKind[] = React.useMemo(
    () =>
      componentsLoaded
        ? components?.filter(
            (c) => c.spec.application === applicationName && !c.metadata.deletionTimestamp,
          ) || []
        : [],
    [components, applicationName, componentsLoaded],
  );
  return [appComponents, componentsLoaded, error];
};

const sortComponentsByCreation = (components: ComponentKind[]): ComponentKind[] =>
  components.sort(
    (a, b) =>
      new Date(b.metadata?.creationTimestamp).getTime() -
      new Date(a.metadata?.creationTimestamp).getTime(),
  );

export const useSortedComponents = (
  applicationName: string,
  namespace?: string,
): [ComponentKind[], boolean, unknown] => {
  const { namespace: ns } = useWorkspaceInfo();
  const [cmps, loaded, error] = useComponents(namespace ?? ns, applicationName);

  const components = React.useMemo(() => {
    return loaded && !error ? sortComponentsByCreation(cmps) : [];
  }, [cmps, error, loaded]);

  return [components, loaded, error];
};
