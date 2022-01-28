import { useState, useEffect } from 'react';
import { useFormValues } from './../components/form-context';
import { k8sListResource } from './../dynamic-plugin-sdk';
import { ProjectModel } from './../models';

export const useActiveNamespace = () => {
  const [activeNamespace, setActiveNamespace] = useState('');
  const [, setFormValues] = useFormValues();

  useEffect(() => {
    const fetchProjects = async () => {
      const projects = await k8sListResource({
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
        setFormValues((formValues) => ({ ...formValues, namespace: ns }));
      } else {
        setActiveNamespace('default');
        // eslint-disable-next-line no-console
        console.warn(
          'Could not find namespace; you are likely not able to do much as we are targeting "default"',
        );
      }
    };

    fetchProjects();
  }, [setFormValues]);

  return activeNamespace;
};
