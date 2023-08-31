import * as React from 'react';
import { Flex, FlexItem, Button, FormGroup, TextInputTypes } from '@patternfly/react-core';
import { MinusCircleIcon } from '@patternfly/react-icons/dist/js/icons/minus-circle-icon';
import { PlusCircleIcon } from '@patternfly/react-icons/dist/js/icons/plus-circle-icon';
import { FieldArray, FormikValues, useField, useFormikContext } from 'formik';
import { get, uniqueId } from 'lodash-es';
import { FieldProps } from '../field-types';
import { getFieldId } from '../field-utils';
import FieldHelperText from '../FieldHelperText';
import FileUploadField from '../FileUploadField';
import InputField from '../InputField';

import './KeyValueFileInputField.scss';

export type KeyValueEntry = {
  key: string;
  value: string;
  readOnlyKey?: boolean;
};

type KeyValueEntryFormProps = {
  label?: string;
  helpText?: string;
  disableRemoveAction?: boolean;
  entries: KeyValueEntry[];
  onChange?: (value: string, keyIndex: string) => void;
};

const KeyValueFileInputField: React.FC<KeyValueEntryFormProps & FieldProps> = ({
  name,
  label = '',
  helpText = '',
  disableRemoveAction = false,
  entries = [{ key: '', value: '' }],
  onChange,
}) => {
  const [field] = useField<KeyValueEntry[]>(name);
  const { values, setFieldValue } = useFormikContext<FormikValues>();
  const rowValues = field.value ?? entries;
  const fieldId = getFieldId(name, 'key-value--input');
  const fieldValues = get(values, name, rowValues);
  const [uniqId, setUniqId] = React.useState(uniqueId());

  return (
    <FieldArray
      key={`${name}-${uniqId}`}
      name={name}
      render={(arrayHelpers) => (
        <FormGroup fieldId={fieldId} label={label}>
          <FieldHelperText helpText={helpText} />
          {fieldValues?.map((v, idx) => {
            return (
              <Flex
                className="key-value--wrapper"
                data-test={'key-value-pair'}
                key={`${idx.toString()}-${uniqId}`}
                direction={{ default: 'column' }}
              >
                {!disableRemoveAction && (
                  <FlexItem className="key-value--remove-button">
                    <Button
                      type="button"
                      data-test="remove-key-value-button"
                      onClick={() => {
                        setUniqId(uniqueId());
                        arrayHelpers.remove(idx);
                      }}
                      variant="link"
                      icon={<MinusCircleIcon />}
                    >
                      Remove key/value
                    </Button>
                  </FlexItem>
                )}

                <FlexItem>
                  <InputField
                    data-test={`key-${idx.toString()}`}
                    type={TextInputTypes.text}
                    name={`${name}.${idx.toString()}.key`}
                    label="Key"
                    required
                    isReadOnly={v.readOnlyKey}
                  />
                </FlexItem>
                <FlexItem>
                  <FileUploadField
                    required
                    data-testid="file-upload-value"
                    id="value"
                    type="text"
                    label="Value"
                    name={`${name}.${idx.toString()}.value`}
                    filenamePlaceholder="Drag a file here or upload one"
                    onDataChange={(ev, data: string) => {
                      setFieldValue(`${name}.${idx.toString()}.value`, data);
                      onChange && onChange(data, `${name}.${idx.toString()}.value`);
                    }}
                    onTextChange={(ev, text: string) => {
                      setFieldValue(`${name}.${idx.toString()}.value`, text);
                      onChange && onChange(text, `${name}.${idx.toString()}.value`);
                    }}
                    onClearClick={() => {
                      setFieldValue(`${name}.${idx.toString()}.value`, '');
                    }}
                    browseButtonText="Upload"
                  />
                </FlexItem>
              </Flex>
            );
          })}
          <Button
            className="pf-m-link--align-left"
            onClick={() => arrayHelpers.push({ key: '', value: '' })}
            type="button"
            data-test="add-key-value-button"
            variant="link"
            icon={<PlusCircleIcon />}
          >
            Add key/value
          </Button>
        </FormGroup>
      )}
    />
  );
};

export default KeyValueFileInputField;
