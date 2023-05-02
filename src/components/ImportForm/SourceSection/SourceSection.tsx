import * as React from 'react';
import { Bullseye, FormGroup, FormSection, ValidatedOptions } from '@patternfly/react-core';
import { useField, useFormikContext } from 'formik';
import gitUrlParse from 'git-url-parse';
import { FULL_APPLICATION_TITLE } from '../../../consts/labels';
import { useOnMount } from '../../../hooks/useOnMount';
import { getFieldId, InputField } from '../../../shared';
import { useDebounceCallback } from '../../../shared/hooks/useDebounceCallback';
import { ServiceProviderType } from '../../../types';
import { HeadTitle } from '../../HeadTitle';
import HelpPopover from '../../HelpPopover';
import { useAccessCheck } from '../utils/auth-utils';
import { ImportFormValues } from '../utils/types';
import { gitUrlRegex } from '../utils/validation-utils';
import AuthOptions from './AuthOptions';
import GitOptions from './GitOptions';

import './SourceSection.scss';

enum AccessHelpText {
  default = '',
  checking = 'Checking access...',
  validated = 'Access validated',
}

type SourceSectionProps = {};

const SourceSection: React.FC<SourceSectionProps> = () => {
  const [, { value: source, touched, error }] = useField<string>({
    name: 'source.git.url',
    type: 'input',
  });
  const [, { value: isValidated }] = useField<boolean>('source.isValidated');
  const {
    values: { secret: authSecret },
    setFieldValue,
  } = useFormikContext<ImportFormValues>();

  const [sourceUrl, setSourceUrl] = React.useState('');
  const [validated, setValidated] = React.useState(
    isValidated ? ValidatedOptions.success : ValidatedOptions.default,
  );
  const [helpText, setHelpText] = React.useState(
    isValidated ? AccessHelpText.validated : AccessHelpText.default,
  );
  const [helpTextInvalid, setHelpTextInvalid] = React.useState('');
  const [showAuthOptions, setShowAuthOptions] = React.useState(false);
  const [showGitOptions, setShowGitOptions] = React.useState(isValidated);

  const fieldId = getFieldId('source.git.url', 'input');
  const isValid = !(touched && error);
  const label = 'Git repository URL';

  const [{ isGit, isRepoAccessible, serviceProvider }, accessCheckLoaded] = useAccessCheck(
    isValidated ? null : sourceUrl,
    authSecret,
  );

  const setFormValidating = React.useCallback(() => {
    setValidated(ValidatedOptions.default);
    setHelpText(AccessHelpText.checking);
    setFieldValue('source.isValidated', false);
  }, [setFieldValue]);

  const setFormValidated = React.useCallback(() => {
    setValidated(ValidatedOptions.success);
    setHelpText(AccessHelpText.validated);
    setFieldValue('source.isValidated', true);
  }, [setFieldValue]);

  const handleSourceChange = React.useCallback(() => {
    const searchTerm = source;
    const isGitUrlValid = gitUrlRegex.test(searchTerm?.trim());
    setShowAuthOptions(false);
    setShowGitOptions(false);
    setFieldValue('secret', '');
    if (!searchTerm || !isGitUrlValid) {
      setValidated(ValidatedOptions.error);
      setHelpTextInvalid('Invalid URL');
      setSourceUrl(null);
      return;
    }
    setFormValidating();
    setHelpTextInvalid('');
    setSourceUrl(searchTerm);
  }, [source, setFieldValue, setFormValidating]);

  const debouncedHandleSourceChange = useDebounceCallback(handleSourceChange);

  React.useEffect(() => {
    if (accessCheckLoaded) {
      if (isRepoAccessible) {
        try {
          const { organization } = gitUrlParse(sourceUrl);
          if (!organization) {
            setValidated(ValidatedOptions.error);
            setHelpTextInvalid('Not a valid source repository');
            return;
          }
        } catch {
          // ignore, should never happen when isRepoAccessible is true, but for tests it is not valid
        }
        setFormValidated();
        isGit && setShowGitOptions(true);
      } else {
        setShowGitOptions(false);
        if (
          serviceProvider === ServiceProviderType.GitHub ||
          serviceProvider === ServiceProviderType.Quay
        ) {
          setValidated(ValidatedOptions.error);
          setFieldValue('source.isValidated', false);
          setHelpTextInvalid('Unable to access repository');
          // setShowAuthOptions(true);
        } else if (!serviceProvider) {
          setValidated(ValidatedOptions.error);
          setFieldValue('source.isValidated', false);
          setHelpTextInvalid('This provider is not supported');
        }
      }
    }
  }, [
    accessCheckLoaded,
    isRepoAccessible,
    isGit,
    serviceProvider,
    setFieldValue,
    setFormValidated,
    sourceUrl,
  ]);

  // Sections related to auth options. Disabled until we have full private repo support.

  // const isPrivateAuthorized =
  //   accessCheckLoaded &&
  //   isRepoAccessible &&
  //   !showAuthOptions &&
  //   accessibility === SPIAccessCheckAccessibilityStatus.private;

  // useAccessTokenBinding(isPrivateAuthorized && source);

  // React.useEffect(() => {
  //   if (isPrivateAuthorized) {
  //     if (authSecret) {
  //       setFormValidated();
  //     } else {
  //       setFormValidating();
  //     }
  //   }
  // }, [authSecret, isPrivateAuthorized, setFormValidated, setFormValidating]);

  useOnMount(() => {
    source && !isValidated && handleSourceChange();
  });

  return (
    <Bullseye>
      <HeadTitle>Import - Add components | {FULL_APPLICATION_TITLE}</HeadTitle>
      <FormSection className="source-section pf-u-min-width">
        <FormGroup
          fieldId={fieldId}
          label={label}
          validated={!isValid && ValidatedOptions.error}
          isRequired
          labelIcon={<HelpPopover bodyContent="Make sure the URL is correct." />}
        >
          <InputField
            name="source.git.url"
            placeholder="Enter your source"
            onChange={debouncedHandleSourceChange}
            validated={validated}
            helpText={helpText}
            helpTextInvalid={helpTextInvalid}
            required
            data-test="enter-source"
          />
        </FormGroup>
        {showAuthOptions && <AuthOptions />}
        {showGitOptions && <GitOptions />}
      </FormSection>
    </Bullseye>
  );
};

export default SourceSection;
