import { ComponentKind } from '../../types';

export interface ContextOption {
  name: string;
  description: string;
  selected: boolean;
}

// Base context options list.
export const contextOptions: ContextOption[] = [
  {
    name: 'application',
    description: 'execute the integration test in all cases - this would be the default state',
    selected: false,
  },
  {
    name: 'group',
    description: 'execute the integration test for a Snapshot of the `group` type',
    selected: false,
  },
  {
    name: 'override',
    description: 'execute the integration test for a Snapshot of the `override` type',
    selected: false,
  },
  {
    name: 'component',
    description: 'execute the integration test for a Snapshot of the `component` type',
    selected: false,
  },
  {
    name: 'pull_request',
    description: 'execute the integration test for a Snapshot created for a `pull request` event',
    selected: false,
  },
  {
    name: 'push',
    description: 'execute the integration test for a Snapshot created for a `push` event',
    selected: false,
  },
  {
    name: 'disabled',
    description:
      'disables the execution of the given integration test if it’s the only context that’s defined',
    selected: false,
  },
];

/**
 * Maps over the provided context options and assigns a `selected` property to each context
 * based on whether its `name` is present in the array of selected context names.
 *
 * @param {string[]} selectedContextNames - Array of context names that should be marked as selected.
 * @param {ContextOption[]} contextSelectOptions - Array of context objects that include details such as name and description.
 * @returns {ContextOption[]} - An array of context objects where each context has an additional `selected` field indicating if it's selected.
 */
export const mapContextsWithSelection = (
  selectedContextNames: string[],
  contextSelectOptions: ContextOption[],
): ContextOption[] => {
  return contextSelectOptions.map((ctx) => {
    return { ...ctx, selected: selectedContextNames.some((name) => name === ctx.name) };
  });
};

/**
 * Combines existing selected contexts with new component-based contexts.
 *
 * This function creates new context options for each component, including a description and
 * a `selected` flag based on whether the component is present in the selected context names.
 * It then merges these component contexts with the provided base selected contexts.
 *
 * @param {ContextOption[]} baseSelectedContexts - Array of already selected context objects to be combined with new component contexts.
 * @param {string[]} selectedContextNames - Array of names that represent the currently selected contexts, including component contexts.
 * @param {ComponentKind[]} components - Array of components from which new context options will be created.
 *
 * @returns {ContextOption[]} - An array combining the base selected contexts and the newly generated component contexts, each having a `selected` field.
 */
export const addComponentContexts = (
  baseSelectedContexts: ContextOption[],
  selectedContextNames: string[],
  components: ComponentKind[],
) => {
  const selectedContextNameSet = new Set(selectedContextNames); // Faster lookups
  const componentContexts = components.map((component) => {
    const componentName = component.metadata.name;
    return {
      // if a component context has been previously selected, it should be prefixed with 'component_'
      // after it's been selected and saved.
      name: `component_${componentName}`,
      description: `execute the integration test when component ${componentName} updates`,
      selected: selectedContextNameSet.has(`component_${componentName}`), // Check if it's selected
    };
  });

  return [...baseSelectedContexts, ...componentContexts];
};
