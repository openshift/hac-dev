import * as React from 'react';
import { useParams } from 'react-router-dom';
import { FormGroup } from '@patternfly/react-core';
import { FieldArray, useField, FieldArrayRenderProps } from 'formik';
import { getFieldId } from '../../../src/shared/components/formik-fields/field-utils';
import { useComponents } from '../../hooks/useComponents';
import { ComponentKind } from '../../types';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';
import { ContextSelectList } from './ContextSelectList';

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

interface IntegrationTestContextProps {
  heading?: React.ReactNode;
  fieldName: string;
  editing: boolean;
}

const ContextsField: React.FC<IntegrationTestContextProps> = ({ heading, fieldName, editing }) => {
  const { namespace } = useWorkspaceInfo();
  const { appName } = useParams();
  const [components, componentsLoaded] = useComponents(namespace, appName);
  const [, { value: contexts }] = useField(fieldName);
  const fieldId = getFieldId(fieldName, 'dropdown');
  const selectedContextNames = (contexts ?? []).map((c: ContextOption) => c.name);
  const selectedContexts = React.useMemo(() => {
    let initialSelectedContexts = mapContextsWithSelection(selectedContextNames, contextOptions);
    // If this is a new integration test, ensure that 'application' is selected by default
    if (!editing && !selectedContextNames.includes('application')) {
      initialSelectedContexts = initialSelectedContexts.map((ctx) => {
        return ctx.name === 'application' ? { ...ctx, selected: true } : ctx;
      });
    }

    // If we have components and they are loaded, add to context option list.
    // Else, return the base context list.
    return componentsLoaded && components
      ? addComponentContexts(initialSelectedContexts, selectedContextNames, components)
      : initialSelectedContexts;
  }, [componentsLoaded, components, selectedContextNames, editing]);

  /**
   * React callback that is used to select or deselect a context option using Formik FieldArray array helpers.
   * If the context exists and it's been selected, remove from array.
   * Else push to the Formik FieldArray array.
   */
  const handleSelect = React.useCallback(
    (arrayHelpers: FieldArrayRenderProps, contextName: string) => {
      const currentContext: ContextOption = selectedContexts.find(
        (ctx: ContextOption) => ctx.name === contextName,
      );
      const isSelected = currentContext && currentContext.selected;
      const index = contexts.findIndex((c: ContextOption) => c.name === contextName);

      if (isSelected && index !== -1) {
        arrayHelpers.remove(index); // Deselect
      } else if (!isSelected) {
        // Select, add necessary data
        arrayHelpers.push({ name: contextName, description: currentContext.description });
      }
    },
    [contexts, selectedContexts],
  );

  return (
    <FormGroup fieldId={fieldId} label={heading ?? 'Contexts'}>
      {componentsLoaded && components ? (
        <FieldArray
          name={fieldName}
          render={(arrayHelpers) => (
            <ContextSelectList
              selectedContexts={selectedContexts}
              onSelect={(_event, contextName: string) => handleSelect(arrayHelpers, contextName)}
              editing={editing}
            />
          )}
        />
      ) : (
        'Loading Additional Component Context options'
      )}
    </FormGroup>
  );
};

export default ContextsField;
