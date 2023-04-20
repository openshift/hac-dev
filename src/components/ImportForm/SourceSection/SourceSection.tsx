import * as React from 'react';
import {
  Button,
  ButtonVariant,
  Flex,
  FlexItem,
  FormGroup,
  FormSection,
  HelperText,
  HelperTextItem,
  Text,
  TextContent,
  ValidatedOptions,
} from '@patternfly/react-core';
import { OpenDrawerRightIcon } from '@patternfly/react-icons/dist/esm/icons/open-drawer-right-icon';
import { useField, useFormikContext } from 'formik';
import gitUrlParse from 'git-url-parse';
import { FULL_APPLICATION_TITLE } from '../../../consts/labels';
import { useOnMount } from '../../../hooks/useOnMount';
import { getFieldId, InputField } from '../../../shared';
import { useDebounceCallback } from '../../../shared/hooks/useDebounceCallback';
import { ServiceProviderType, SPIAccessCheckAccessibilityStatus } from '../../../types';
import { HeadTitle } from '../../HeadTitle';
import { HelpTopicLink } from '../../HelpTopicLink/HelpTopicLink';
import SamplesInfoAlert from '../SampleSection/SampleInfoAlert';
import { useAccessCheck, useAccessTokenBinding } from '../utils/auth-utils';
import { ImportFormValues, ImportStrategy } from '../utils/types';
import { gitUrlRegex } from '../utils/validation-utils';
import AuthOptions from './AuthOptions';
import GitOptions from './GitOptions';

enum AccessHelpText {
  default = '',
  checking = 'Checking access...',
  validated = 'Access validated',
}

type SourceSectionProps = {
  onStrategyChange?: (strategy: ImportStrategy) => void;
};

export const SourceSection: React.FC<SourceSectionProps> = ({ onStrategyChange }) => {
  const [, { value: source, touched, error }] = useField<string>({
    name: 'source.git.url',
    type: 'input',
  });
  const [, { value: isValidated }] = useField<boolean>('source.isValidated');
  const {
    values: { secret: authSecret },
    setFieldValue,
    setFieldTouched,
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
  const label = 'Git repo URL';

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
        if (
          serviceProvider === ServiceProviderType.GitHub ||
          serviceProvider === ServiceProviderType.Quay
        ) {
          setValidated(ValidatedOptions.error);
          setHelpTextInvalid('Unable to access repository');
          setShowAuthOptions(true);
        } else if (!serviceProvider) {
          setValidated(ValidatedOptions.error);
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

  const isPrivateAuthorized =
    accessCheckLoaded &&
    isRepoAccessible &&
    !showAuthOptions &&
    accessibility === SPIAccessCheckAccessibilityStatus.private;

  useAccessTokenBinding(isPrivateAuthorized && source);

  React.useEffect(() => {
    if (isPrivateAuthorized) {
      if (authSecret) {
        setFormValidated();
      } else {
        setFormValidating();
      }
    }
  }, [authSecret, isPrivateAuthorized, setFormValidated, setFormValidating]);

  useOnMount(() => {
    source && !isValidated && handleSourceChange();
  });

  const handleStrategyChange = React.useCallback(() => {
    setFieldValue('source.git.url', '');
    setFieldTouched('source.git.url', false);
    onStrategyChange(ImportStrategy.SAMPLE);
  }, [onStrategyChange, setFieldValue, setFieldTouched]);

  const description =
    'To add components to your application, provide a link to your GitHub repo or start with a code sample.';

  return (
    <>
      <HeadTitle>Import - Add components | {FULL_APPLICATION_TITLE}</HeadTitle>
      <TextContent>
        <Text component="h2">Add components to your application</Text>
        <HelperText>
          <HelperTextItem>
            {description}{' '}
            <HelpTopicLink topicId="stonesoup-import-add-component" isInline>
              Learn more <span className="pf-u-screen-reader">about adding components</span>{' '}
              <OpenDrawerRightIcon />
            </HelpTopicLink>
          </HelperTextItem>
        </HelperText>
      </TextContent>
      {onStrategyChange && (
        <SamplesInfoAlert>
          <p>
            If you select a sample, be sure to fork it to your own repository. That way, you can
            edit the sample and choose to customize your pipeline and rebuilds whenever changes are
            made.{' '}
            <Button variant={ButtonVariant.link} onClick={handleStrategyChange} isInline>
              Start with a sample.
            </Button>
          </p>
        </SamplesInfoAlert>
      )}
      <FormSection>
        <FormGroup
          fieldId={fieldId}
          label={label}
          validated={!isValid && ValidatedOptions.error}
          isRequired
        >
          <Flex>
            <FlexItem style={{ flexBasis: '750px' }}>
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
            </FlexItem>

            {onStrategyChange ? (
              <FlexItem>
                No code?{' '}
                <Button
                  data-testid="start-with-sample-button"
                  variant={ButtonVariant.link}
                  onClick={handleStrategyChange}
                  isInline
                >
                  Start with a sample.
                </Button>
              </FlexItem>
            ) : null}
          </Flex>
        </FormGroup>
        {showAuthOptions && <AuthOptions />}
        {showGitOptions && <GitOptions />}
      </FormSection>
    </>
  );
};
