import * as React from 'react';
import { ValidatedOptions } from '@patternfly/react-core';
import { useField, useFormikContext } from 'formik';
import { InputField, SwitchField } from 'formik-pf';
import GitUrlParse from 'git-url-parse';
import { ImportFormValues } from '../type';
import GitOptions from './GitOptions';

export const SourceSection = () => {
  const [, { touched, error }] = useField('source.git.url');
  const { touched: touchedValues, setFieldValue } = useFormikContext<ImportFormValues>();
  const validated = touched
    ? touched && !error
      ? ValidatedOptions.success
      : ValidatedOptions.error
    : ValidatedOptions.default;

  const handleChange = React.useCallback(
    (event) => {
      if (validated && !touchedValues.componentName) {
        let name: string;
        try {
          name = GitUrlParse(event.target?.value ?? '').name;
        } catch {
          name = '';
        }
        setFieldValue('componentName', name);
      }
    },
    [setFieldValue, touchedValues.componentName, validated],
  );
  return (
    <>
      <InputField
        name="source.git.url"
        label="Git repository url"
        placeholder="Enter your source"
        validated={validated}
        isRequired
        data-testid="enter-source"
        onChange={handleChange}
      />
      {validated === ValidatedOptions.success ? (
        <SwitchField name="isPrivateRepo" label="Is this a private repository?" />
      ) : null}
      {validated === ValidatedOptions.success ? <GitOptions /> : null}
    </>
  );
};
