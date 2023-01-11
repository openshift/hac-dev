import * as React from 'react';
import { TextContent, Text, HelperText, FormSection } from '@patternfly/react-core';
import { InputField } from '../../../shared';

const ApplicationSection: React.FunctionComponent = () => {
  return (
    <>
      <TextContent>
        <Text component="h2">Name your application</Text>
        <HelperText>Enter a name for your application.</HelperText>
      </TextContent>
      <FormSection>
        <InputField
          name="application"
          label="Application name"
          placeholder="My Application"
          required
        />
      </FormSection>
    </>
  );
};

export default ApplicationSection;
