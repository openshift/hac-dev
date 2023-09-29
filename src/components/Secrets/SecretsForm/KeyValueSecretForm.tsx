import React from 'react';
import { HelperText, HelperTextItem, Title, TitleSizes } from '@patternfly/react-core';
import EncodedKeyValueFileInputField from './EncodedKeyValueUploadField';

export const KeyValueSecretForm: React.FC = () => (
  <>
    <Title size={TitleSizes.md} headingLevel="h4">
      Key/value secret
      <HelperText style={{ fontWeight: 100 }}>
        <HelperTextItem variant="indeterminate">
          Key/value secrets let you inject sensitive data into your application as files or
          environment variables
        </HelperTextItem>
      </HelperText>
    </Title>
    <EncodedKeyValueFileInputField name="opaque.keyValues" data-test="secret-key-value-pair" />
  </>
);
