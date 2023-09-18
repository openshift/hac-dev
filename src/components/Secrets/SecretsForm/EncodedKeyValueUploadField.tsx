import * as React from 'react';
import {
  Button,
  TextInputTypes,
  FormFieldGroupExpandable,
  FormFieldGroupHeader,
} from '@patternfly/react-core';
import { MinusCircleIcon } from '@patternfly/react-icons/dist/js/icons/minus-circle-icon';
import { PlusCircleIcon } from '@patternfly/react-icons/dist/js/icons/plus-circle-icon';
import { FieldArray, useField } from 'formik';
import { uniqueId } from 'lodash-es';
import { FieldProps, InputField } from '../../../shared';
import { KeyValueEntry } from '../../../types';
import EncodedFileUploadField from './EncodedFileUploadField';

type EncodedKeyValueEntryFormProps = {
  label?: string;
  helpText?: string;
  onChange?: (value: string, keyIndex: string) => void;
};

const EncodedKeyValueFileInputField: React.FC<EncodedKeyValueEntryFormProps & FieldProps> = ({
  name,
}) => {
  const [{ value: fieldValues }] = useField<KeyValueEntry[]>(name);
  const [uniqId, setUniqId] = React.useState(uniqueId());

  return (
    <FieldArray
      key={`${name}-${uniqId}`}
      name={name}
      render={(arrayHelpers) => (
        <>
          {fieldValues?.map((v, idx) => (
            <FormFieldGroupExpandable
              key={`${idx.toString()}-${uniqId}`}
              toggleAriaLabel="Details"
              isExpanded
              header={
                <FormFieldGroupHeader
                  titleText={{ text: `Key/value ${idx + 1}`, id: `${idx.toString()}-${uniqId}` }}
                  actions={
                    fieldValues.length > 1 && (
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
                        {`Remove key/value ${idx + 1}`}
                      </Button>
                    )
                  }
                />
              }
            >
              <InputField
                data-test={`key-${idx.toString()}`}
                type={TextInputTypes.text}
                name={`${name}.${idx.toString()}.key`}
                isDisabled={v.readOnlyKey}
                label="Key"
                required
              />
              <EncodedFileUploadField
                required
                data-testid={`file-upload-value-${idx}`}
                id="value"
                label="Upload the file with value for your key or paste its contents"
                name={`${name}.${idx.toString()}.value`}
              />
            </FormFieldGroupExpandable>
          ))}
          <Button
            className="pf-v5-u-text-align-left"
            onClick={() => arrayHelpers.push({ key: '', value: '' })}
            type="button"
            data-test="add-key-value-button"
            variant="link"
            icon={<PlusCircleIcon />}
          >
            Add another key/value
          </Button>
        </>
      )}
    />
  );
};

export default EncodedKeyValueFileInputField;
