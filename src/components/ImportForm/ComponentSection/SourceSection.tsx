import * as React from 'react';
import { ValidatedOptions } from '@patternfly/react-core';
import { useField, useFormikContext } from 'formik';
import { InputField, SwitchField } from 'formik-pf';
import GitUrlParse from 'git-url-parse';
import { detectGitType, GitProvider } from '../../../shared/utils/git-utils';
import { GIT_PROVIDER_ANNOTATION_VALUE } from '../../../utils/component-utils';
import { ImportFormValues } from '../type';
import GitOptions from './GitOptions';

export const SourceSection = () => {
  const [, { touched, error }] = useField('source.git.url');
  const [isGitAdvancedOpen, setGitAdvancedOpen] = React.useState<boolean>(false);
  const { touched: touchedValues, setFieldValue } = useFormikContext<ImportFormValues>();
  const validated = touched
    ? touched && !error
      ? ValidatedOptions.success
      : ValidatedOptions.error
    : ValidatedOptions.default;

  const handleChange = React.useCallback(
    (event) => {
      const gitType = detectGitType(event.target?.value);
      if (gitType !== GitProvider.GITHUB && gitType !== GitProvider.GITLAB) {
        setFieldValue('gitProviderAnnotation', '');
        setGitAdvancedOpen(true);
      }
      if (validated) {
        if (gitType === GitProvider.GITHUB) {
          setFieldValue('gitProviderAnnotation', GIT_PROVIDER_ANNOTATION_VALUE.GITHUB);
          setGitAdvancedOpen(false);
        }
        if (gitType === GitProvider.GITLAB) {
          setFieldValue('gitProviderAnnotation', GIT_PROVIDER_ANNOTATION_VALUE.GITLAB);
          setGitAdvancedOpen(false);
        }

        let parsed: GitUrlParse.GitUrl;
        let name: string;
        try {
          parsed = GitUrlParse(event.target?.value ?? '');
          setFieldValue('gitURLAnnotation', `${parsed?.protocol}://${parsed?.resource}`);
          name = parsed.name;
        } catch {
          name = '';
          setFieldValue('gitURLAnnotation', '');
        }
        if (!touchedValues.componentName) {
          setFieldValue('componentName', name);
        }
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
        <SwitchField name="isPrivateRepo" label="Should the image produced be private?" />
      ) : null}
      {validated === ValidatedOptions.success ? (
        <GitOptions isGitAdvancedOpen={isGitAdvancedOpen} setGitAdvancedOpen={setGitAdvancedOpen} />
      ) : null}
    </>
  );
};
