import React from 'react';
import { FormSection, TextInputTypes } from '@patternfly/react-core';
import { useField } from 'formik';
import { DropdownField, InputField } from '../../shared';
import EncodedFileUploadField from './utils/EncodedFileUploadField';
import EncodedInputField from './utils/EncodedInputField';

enum AuthType {
  basic = 'Basic authentication',
  ssh = 'SSH Key',
}

export const SourceSecretForm: React.FC = () => {
  const [{ value: type }] = useField<AuthType>('sourceAuthType');

  return (
    <>
      <FormSection>
        <DropdownField
          name="sourceAuthType"
          label="Authentication type"
          helpText="Select how you want to authenticate"
          items={[
            { key: 'basic', value: AuthType.basic },
            { key: 'ssh', value: AuthType.ssh },
          ]}
          required
        />
      </FormSection>
      {type === AuthType.basic ? (
        <FormSection>
          <InputField name="username" label="Username" helpText="For Git authentication" required />
          <EncodedInputField
            name="password"
            label="Password"
            type={TextInputTypes.password}
            helpText="For Git authentication"
            required
          />
        </FormSection>
      ) : (
        <FormSection>
          <EncodedFileUploadField
            name="sshKey"
            id="text-file-ssh"
            label="SSH private key"
            helpText="For Git authentication"
            required
          />
        </FormSection>
      )}
    </>
  );
};
