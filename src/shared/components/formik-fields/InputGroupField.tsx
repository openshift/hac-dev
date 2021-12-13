import React from 'react';
import { InputGroup, TextInput, TextArea } from '@patternfly/react-core';
import BaseInputField from './BaseInputField';
import { GroupInputProps, GroupTextType } from './field-types';

const InputGroupField: React.FC<GroupInputProps> = ({
  beforeInput,
  afterInput,
  groupTextType,
  ...baseProps
}) => {
  return (
    <BaseInputField {...baseProps}>
      {(props) => {
        return (
          <InputGroup>
            {beforeInput}
            {groupTextType === GroupTextType.TextArea ? (
              <TextArea {...props} />
            ) : (
              <TextInput {...props} />
            )}
            {afterInput}
          </InputGroup>
        );
      }}
    </BaseInputField>
  );
};

export default InputGroupField;
