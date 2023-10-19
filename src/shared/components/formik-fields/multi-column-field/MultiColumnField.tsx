import React from 'react';
import { FormGroup, gridItemSpanValueShape } from '@patternfly/react-core';
import { FieldArray, useFormikContext, FormikValues } from 'formik';
import { get } from 'lodash-es';
import SecondaryStatus from '../../status/SecondaryStatus';
import { MultiColumnFieldProps } from '../field-types';
import FieldHelperText from '../FieldHelperText';
import { getSpans } from './multicolumn-field-utils';
import MultiColumnFieldFooter from './MultiColumnFieldFooter';
import MultiColumnFieldHeader from './MultiColumnFieldHeader';
import MultiColumnFieldRow from './MultiColumnFieldRow';
import './MultiColumnField.scss';

const MultiColumnField: React.FC<React.PropsWithChildren<MultiColumnFieldProps>> = ({
  children,
  name,
  label,
  helpText,
  required,
  addLabel,
  headers,
  emptyValues,
  emptyMessage,
  isReadOnly,
  disableDeleteRow,
  disableAddRow,
  toolTip,
  spans,
  complexFields,
  rowRenderer,
  ...props
}) => {
  const { values } = useFormikContext<FormikValues>();
  const fieldValue = get(values, name, []);
  const totalFieldCount: gridItemSpanValueShape = React.Children.count(
    children,
  ) as gridItemSpanValueShape;
  const fieldSpans = spans || getSpans(totalFieldCount);
  return (
    <FieldArray
      name={name}
      render={({ push, remove }) => {
        return (
          <FormGroup
            data-test={props['data-test'] || 'multicolumn-field'}
            fieldId={`form-multi-column-input-${name.replace(/\./g, '-')}-field`}
            label={label}
            isRequired={required}
          >
            {fieldValue.length < 1 ? (
              emptyMessage && (
                <div className="multi-column-field__empty-message">
                  <SecondaryStatus status={emptyMessage} />
                </div>
              )
            ) : (
              <MultiColumnFieldHeader headers={headers} spans={fieldSpans} />
            )}
            {fieldValue.length > 0 &&
              fieldValue.map((value, index) => (
                <MultiColumnFieldRow
                  key={`${index.toString()}`} // There is no other usable value for key prop in this case.
                  name={name}
                  toolTip={toolTip}
                  rowIndex={index}
                  onDelete={() => remove(index)}
                  isReadOnly={isReadOnly}
                  disableDeleteRow={disableDeleteRow}
                  spans={fieldSpans}
                  complexFields={complexFields}
                  rowRenderer={rowRenderer}
                >
                  {children}
                </MultiColumnFieldRow>
              ))}
            {!isReadOnly && (
              <MultiColumnFieldFooter
                disableAddRow={disableAddRow}
                addLabel={addLabel}
                onAdd={() => push(emptyValues)}
              />
            )}
            <FieldHelperText helpText={helpText} />
          </FormGroup>
        );
      }}
    />
  );
};

export default MultiColumnField;
