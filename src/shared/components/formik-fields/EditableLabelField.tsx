import React from 'react';
import { Flex, FlexItem, FormGroup, FormGroupProps, TextInputTypes } from '@patternfly/react-core';
import { useField } from 'formik';
import ActionGroupWithIcons from '../form-components/ActionGroupWithIcons';
import { GrayPencilAltIcon } from '../status/icons';
import { getFieldId } from './field-utils';
import InputField from './InputField';
import './EditableLabelField.scss';

type EditableLabelFieldProps = {
  name: string;
  type?: TextInputTypes;
} & Omit<FormGroupProps, 'fieldId'>;

const EditableLabelField: React.FC<EditableLabelFieldProps> = ({
  name,
  label,
  type = TextInputTypes.text,
  ...props
}) => {
  const [, { value, error }, { setValue, setTouched }] = useField({ name, type });
  const [editing, setEditing] = React.useState(false);
  const [oldValue, setOldValue] = React.useState('');
  const fieldId = getFieldId(name, 'label-field');

  React.useEffect(() => {
    if (error && !editing) {
      setEditing(true);
      setTouched(true);
    }
  }, [error, editing, setTouched]);

  const editIcon = (
    <GrayPencilAltIcon
      onClick={() => {
        setEditing(true);
        setOldValue(value);
      }}
    />
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setEditing(false);
      e.preventDefault();
    }
  };

  return (
    <FormGroup fieldId={fieldId} {...props} label={label} labelIcon={editing ? null : editIcon}>
      {editing ? (
        <Flex>
          <FlexItem>
            <InputField name={name} dataTest="editable-label-input" onKeyDown={handleKeyDown} />
          </FlexItem>
          <FlexItem>
            <ActionGroupWithIcons
              className="editable-label-field__action-group"
              onSubmit={() => setEditing(false)}
              isDisabled={!!error}
              onClose={() => {
                setEditing(false);
                setValue(oldValue);
              }}
            />
          </FlexItem>
        </Flex>
      ) : (
        <div className="editable-label-field__label">
          {value} {!label && editIcon}
        </div>
      )}
    </FormGroup>
  );
};

export default EditableLabelField;
