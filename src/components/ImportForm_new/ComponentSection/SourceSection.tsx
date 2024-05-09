import * as React from 'react';
import { FormSection } from '@patternfly/react-core';
import { InputField } from '../components/InputField';
import GitOptions from './GitOptions';

export const SourceSection = () => {
  return (
    <FormSection>
      <InputField
        name="source.git.url"
        label="Git repository url"
        placeholder="Enter your source"
        // onChange={debouncedHandleSourceChange}
        // validated={validated}
        // helpText={helpText}
        // helpTextInvalid={helpTextInvalid}
        required
        data-test="enter-source"
      />

      <GitOptions />
    </FormSection>
  );
};
