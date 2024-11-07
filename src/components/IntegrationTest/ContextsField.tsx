import * as React from 'react';
import { useParams } from 'react-router-dom';
import { Bullseye, FormGroup, Spinner } from '@patternfly/react-core';
import { FieldArray, useField, FieldArrayRenderProps } from 'formik';
import { getFieldId } from '../../../src/shared/components/formik-fields/field-utils';
import { useComponents } from '../../hooks/useComponents';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';
import { ContextSelectList } from './ContextSelectList';
import {
  ContextOption,
  contextOptions,
  mapContextsWithSelection,
  addComponentContexts,
} from './utils';

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
  const [inputValue, setInputValue] = React.useState('');

  // The names of the existing selected contexts.
  const selectedContextNames = (contexts ?? []).map((c: ContextOption) => c.name);
  // All the context options available to the user.
  const allContexts = React.useMemo(() => {
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

  // This holds the contexts that are filtered using the user input value.
  const filteredContexts = React.useMemo(() => {
    if (inputValue) {
      const filtered = allContexts.filter((ctx) =>
        ctx.name.toLowerCase().includes(inputValue.toLowerCase()),
      );
      return filtered.length
        ? filtered
        : [{ name: 'No results found', description: 'Please try another value.', selected: false }];
    }
    return allContexts;
  }, [inputValue, allContexts]);

  /**
   * React callback that is used to select or deselect a context option using Formik FieldArray array helpers.
   * If the context exists and it's been selected, remove from array.
   * Else push to the Formik FieldArray array.
   */
  const handleSelect = React.useCallback(
    (arrayHelpers: FieldArrayRenderProps, contextName: string) => {
      const currentContext: ContextOption = allContexts.find(
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
    [contexts, allContexts],
  );

  // Handles unselecting all the contexts
  const handleRemoveAll = (arrayHelpers: FieldArrayRenderProps) => {
    // Clear all selections
    arrayHelpers.form.setFieldValue(fieldName, []);
  };

  return (
    <FormGroup fieldId={fieldId} label={heading ?? 'Contexts'} style={{ maxWidth: '750px' }}>
      {componentsLoaded && components ? (
        <FieldArray
          name={fieldName}
          render={(arrayHelpers) => (
            <ContextSelectList
              allContexts={allContexts}
              filteredContexts={filteredContexts}
              onSelect={(contextName: string) => handleSelect(arrayHelpers, contextName)}
              inputValue={inputValue}
              onInputValueChange={setInputValue}
              onRemoveAll={() => handleRemoveAll(arrayHelpers)}
              editing={editing}
            />
          )}
        />
      ) : (
        <Bullseye>
          <Spinner size="xl" />
        </Bullseye>
      )}
    </FormGroup>
  );
};

export default ContextsField;
