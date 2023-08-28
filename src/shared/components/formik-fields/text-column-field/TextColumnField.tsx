import React from 'react';
import { FormGroup, HelperText, HelperTextItem } from '@patternfly/react-core';
import { FieldArray, useField } from 'formik';
import DragAndDrop from '../../drag-drop/DragAndDrop';
import { getFieldId } from '../field-utils';
import MultiColumnFieldFooter from '../multi-column-field/MultiColumnFieldFooter';
import { TextColumnFieldProps } from './text-column-types';
import TextColumnItem from './TextColumnItem';
import TextColumnItemWithDnd from './TextColumnItemWithDnd';

const TextColumnField: React.FC<TextColumnFieldProps> = (props) => {
  const {
    required,
    name,
    label,
    addLabel,
    helpText,
    isReadOnly,
    onChange,
    children,
    dndEnabled = false,
    noFooter = false,
  } = props;
  const [field] = useField<string[]>(name);
  const rowValues = field.value || [];
  const fieldId = getFieldId(name, 'single-column');
  const getTextColumnKey = (index: number) => index.toString();

  return (
    <FieldArray
      name={name}
      render={(arrayHelpers) => (
        <>
          <FormGroup
            fieldId={fieldId}
            label={label}
            isRequired={required}
            data-test={props['data-test'] || 'text-column-field'}
          >
            {helpText && (
              <HelperText>
                <HelperTextItem variant="indeterminate">{helpText}</HelperTextItem>
              </HelperText>
            )}
            {dndEnabled ? (
              <DragAndDrop>
                {rowValues.map((v, idx) => {
                  return (
                    <TextColumnItemWithDnd
                      {...{ ...props, rowValues, idx, arrayHelpers }}
                      key={getTextColumnKey(idx)}
                    >
                      {children}
                    </TextColumnItemWithDnd>
                  );
                })}
              </DragAndDrop>
            ) : (
              <>
                {rowValues.map((v, idx) => {
                  return (
                    <TextColumnItem
                      {...{ ...props, rowValues, idx, arrayHelpers }}
                      key={getTextColumnKey(idx)}
                    >
                      {children}
                    </TextColumnItem>
                  );
                })}
              </>
            )}
            {!isReadOnly && !noFooter && (
              <MultiColumnFieldFooter
                addLabel={addLabel}
                onAdd={() => {
                  arrayHelpers.push('');
                  onChange && onChange([...rowValues, '']);
                }}
              />
            )}
          </FormGroup>
        </>
      )}
    />
  );
};
export default TextColumnField;
