import * as React from 'react';
import { ValidatedOptions } from '@patternfly/react-core';
import { useField } from 'formik';
import { InputField } from '../../../shared';
import GitOptions from './GitOptions';

export const SourceSection = () => {
  const [, { touched, error }] = useField('source.git.url');
  const validated = touched
    ? touched && !error
      ? ValidatedOptions.success
      : ValidatedOptions.error
    : ValidatedOptions.default;
  return (
    <>
      <InputField
        name="source.git.url"
        label="Git repository url"
        placeholder="Enter your source"
        validated={validated}
        required
        data-test="enter-source"
      />
      {validated === ValidatedOptions.success ? <GitOptions /> : null}
    </>
  );
};
