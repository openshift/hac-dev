import React from 'react';
import { TextInputTypes } from '@patternfly/react-core';
import { useField } from 'formik';
import { DropdownField, InputField } from '../../../shared';
import { SourceSecretType } from '../../../types';
import EncodedFileUploadField from './EncodedFileUploadField';

export const SourceSecretForm: React.FC = () => {
  const [{ value: type }] = useField<SourceSecretType>('source.authType');

  return (
    <>
      <DropdownField
        name="source.authType"
        label="Authentication type"
        helpText="Select how you want to authenticate"
        items={[
          { key: 'basic', value: SourceSecretType.basic },
          { key: 'ssh', value: SourceSecretType.ssh },
        ]}
        required
      />
      {type === SourceSecretType.basic ? (
        <>
          <InputField
            name="source.username"
            label="Username"
            helpText="For Git authentication"
            required
          />
          <InputField
            name="source.password"
            label="Password"
            type={TextInputTypes.password}
            helpText="For Git authentication"
            required
          />
        </>
      ) : (
        <EncodedFileUploadField
          name="source.ssh-privatekey"
          id="text-file-ssh"
          label="SSH private key"
          helpText="For Git authentication"
          required
        />
      )}
    </>
  );
};
