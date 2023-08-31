import React from 'react';
import { FormSection, Text, TextVariants } from '@patternfly/react-core';
import { ApplicationDropdown } from './utils/ApplicationDropdown';
import { ComponentDropdown } from './utils/ComponentDropdown';
import EncodedKeyValueFileInputField from './utils/EncodedKeyValueUploadField';
import { EnvironmentDropdown } from './utils/EnvironmentDropdown';

export const KeyValueSecretForm: React.FC = () => (
  <>
    <FormSection>
      <ApplicationDropdown
        name="application"
        helpText="The secret key and its value will be associated with the selected target"
        required
      />
      <ComponentDropdown
        name="component"
        helpText="The secret key and its value will be associated with the selected target"
        required
      />
      <EnvironmentDropdown
        name="environment"
        helpText="The secret key and its value will be associated with the selected target"
        required
      />
    </FormSection>
    <FormSection title="Key/value secret">
      <Text component={TextVariants.small}>
        Key/value secrets let you inject sensitive data into your application as files or
        environment variables.
      </Text>
      <EncodedKeyValueFileInputField name="keyValues" data-test="secret-key-value-pair" />
    </FormSection>
  </>
);
