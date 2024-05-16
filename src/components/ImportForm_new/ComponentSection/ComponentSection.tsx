import * as React from 'react';
import { FormSection, Text, TextContent, TextVariants } from '@patternfly/react-core';
import { InputField } from '../../../shared';
import { SourceSection } from './SourceSection';

export const ComponentSection = () => {
  return (
    <FormSection>
      <TextContent>
        <Text component={TextVariants.h3}>Component details</Text>
        <Text component={TextVariants.p}>
          A component is an image built from source code repository.
        </Text>
      </TextContent>
      <SourceSection />
      <InputField name="componentName" label="Component name" required />
    </FormSection>
  );
};
