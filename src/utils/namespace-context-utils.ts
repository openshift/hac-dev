import * as React from 'react';
import { k8sListResourceItems } from '@openshift/dynamic-plugin-sdk-utils';
import { ProjectModel } from '../models';

type NamespaceContextData = { namespace: string; namespaceLoaded: boolean };

export const NamespaceContext = React.createContext<NamespaceContextData>({
  namespace: '',
  namespaceLoaded: false,
});

export const NamespaceProvider = NamespaceContext.Provider;

export const useNamespace = () => React.useContext(NamespaceContext).namespace;

export const useActiveNamespace = (): NamespaceContextData => {
  const [activeNamespace, setActiveNamespace] = React.useState<string>('');
  const [loaded, setLoaded] = React.useState<boolean>(false);

  React.useEffect(() => {
    const fetchProjects = async () => {
      const projects: any = await k8sListResourceItems({
        model: ProjectModel,
      });
      // Lock in the namespace
      let ns = null;
      if (Array.isArray(projects)) {
        const namespaces = projects.map((dataResource) => dataResource.metadata.name);
        ns = namespaces[0];
      } else if (projects?.metadata?.namespace) {
        ns = projects.metadata.namespace;
      }

      if (ns) {
        setActiveNamespace(ns);
      } else {
        setActiveNamespace('default');
        // eslint-disable-next-line no-console
        console.warn(
          'Could not find namespace; you are likely not able to do much as we are targeting "default"',
        );
      }
      setLoaded(true);
    };

    try {
      fetchProjects();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }, []);

  return { namespace: activeNamespace, namespaceLoaded: loaded };
};
