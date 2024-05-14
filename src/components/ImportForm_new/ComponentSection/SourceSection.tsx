import * as React from 'react';
import { InputField } from 'formik-pf';
import GitOptions from './GitOptions';

export const SourceSection = () => {
  return (
    <>
      <InputField
        name="source.git.url"
        label="Git repository url"
        placeholder="Enter your source"
        // onChange={debouncedHandleSourceChange}
        // validated={validated}
        // helpText={helpText}
        // helpTextInvalid={helpTextInvalid}
        isRequired
        data-test="enter-source"
      />
      <GitOptions />
    </>
  );
};
