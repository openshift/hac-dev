import * as React from 'react';
import { useFeatureFlag } from '@openshift/dynamic-plugin-sdk';
import { Bullseye, FormGroup, FormSection, ValidatedOptions } from '@patternfly/react-core';
import { useField, useFormikContext } from 'formik';
import gitUrlParse from 'git-url-parse';
import { FULL_APPLICATION_TITLE } from '../../../consts/labels';
import { useOnMount } from '../../../hooks/useOnMount';
import { getFieldId, InputField } from '../../../shared';
import { HeadTitle } from '../../../shared/components/HeadTitle';
import { useDebounceCallback } from '../../../shared/hooks/useDebounceCallback';
import { SPIAccessCheckAccessibilityStatus, ServiceProviderType } from '../../../types';
import { PROD_FLAG } from '../../../utils/flag-utils';
import { useAccessCheck, useAccessTokenBinding } from '../utils/auth-utils';
import { ImportFormValues } from '../utils/types';
import { gitUrlRegex } from '../utils/validation-utils';
import AuthOptions from './AuthOptions';
import GitOptions from './GitOptions';

import './SourceSection.scss';

export enum AccessHelpText {
  default = '',
  checking = 'Checking access...',
  validated = 'Access validated',
}

type SourceSectionProps = {};

const SourceSection: React.FC<SourceSectionProps> = () => {
  const [isProdFlag] = useFeatureFlag(PROD_FLAG);
  const [, { value: source }] = useField<string>({
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
  const label = 'Git repository URL';

  const [{ isGit, isRepoAccessible, serviceProvider, accessibility }, accessCheckLoaded] =
    useAccessCheck(isValidated ? null : sourceUrl, authSecret);

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
    setHelpTextInvalid('');
    requestAnimationFrame(() => {
      setFormValidating();
    });
    setSourceUrl(searchTerm);
  }, [source, setFieldValue, setFormValidating]);

  const debouncedHandleSourceChange = useDebounceCallback(handleSourceChange);

  React.useEffect(() => {
    if (accessCheckLoaded) {
      if (isRepoAccessible) {
        try {
          const { organization, ref, filepath } = gitUrlParse(sourceUrl);
          if (!organization) {
            setValidated(ValidatedOptions.error);
            setHelpTextInvalid("That repository URL isn't quite right. Try again.");
            return;
          }
          setFieldValue('source.git.revision', ref);
          setFieldValue('source.git.context', filepath);
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
          setHelpTextInvalid(
            "Looks like your repository is private, so we're not able to access it.",
          );
          !isProdFlag && setShowAuthOptions(true);
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
    isProdFlag,
  ]);

  const isPrivateAuthorized =
    accessCheckLoaded &&
    isRepoAccessible &&
    !showAuthOptions &&
    accessibility === SPIAccessCheckAccessibilityStatus.private;

  useAccessTokenBinding(isPrivateAuthorized && source);

  React.useEffect(() => {
    if (isPrivateAuthorized && !isProdFlag) {
      if (authSecret) {
        setFormValidated();
      } else {
        setFormValidating();
      }
    }
  }, [authSecret, isPrivateAuthorized, isProdFlag, setFormValidated, setFormValidating]);

  useOnMount(() => {
    source && !isValidated && handleSourceChange();
  });

  return (
    <Bullseye>
      <HeadTitle>Import - Add components | {FULL_APPLICATION_TITLE}</HeadTitle>
      <FormSection className="source-section pf-v5-u-min-width">
        <FormGroup fieldId={fieldId} label={label} isRequired>
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
        {!isProdFlag && showAuthOptions ? <AuthOptions /> : null}
        {!isProdFlag && showGitOptions ? <GitOptions /> : null}
      </FormSection>
    </Bullseye>
  );
};

export default SourceSection;
