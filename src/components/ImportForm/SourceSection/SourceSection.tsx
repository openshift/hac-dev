import * as React from 'react';
import {
  Button,
  ButtonVariant,
  FormGroup,
  FormSection,
  Grid,
  GridItem,
  HelperText,
  HelperTextItem,
  Text,
  TextContent,
  ValidatedOptions,
} from '@patternfly/react-core';
import { OpenDrawerRightIcon } from '@patternfly/react-icons/dist/esm/icons/open-drawer-right-icon';
import { useField, useFormikContext } from 'formik';
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

type SourceSectionProps = {
  onStrategyChange?: (strategy: ImportStrategy) => void;
};

export const SourceSection: React.FC<SourceSectionProps> = ({ onStrategyChange }) => {
  const [showAuthOptions, setShowAuthOptions] = React.useState<boolean>(false);
  const [showGitOptions, setShowGitOptions] = React.useState<boolean>(false);

  const [, { value: source, touched, error }] = useField<string>({
    name: 'source.git.url',
    type: 'input',
  });
  const {
    values: { secret: authSecret },
    setFieldValue,
  } = useFormikContext<ImportFormValues>();

  const [sourceUrl, setSourceUrl] = React.useState('');
  const [validated, setValidated] = React.useState(ValidatedOptions.default);
  const [helpText, setHelpText] = React.useState('');
  const [helpTextInvalid, setHelpTextInvalid] = React.useState('');

  const fieldId = getFieldId('source.git.url', 'input');
  const isValid = !(touched && error);
  const label = 'Git repo URL';

  const [{ isGit, isRepoAccessible, serviceProvider, accessibility }, accessCheckLoaded] =
    useAccessCheck(sourceUrl, authSecret);

  const setFormValidating = React.useCallback(() => {
    setValidated(ValidatedOptions.default);
    setHelpText('Checking access...');
    setFieldValue('isValidated', false);
  }, [setFieldValue]);

  const setFormValidated = React.useCallback(() => {
    setValidated(ValidatedOptions.success);
    setHelpText('Access validated');
    setFieldValue('isValidated', true);
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
    source && handleSourceChange();
  });

  const handleStrategyChange = React.useCallback(() => {
    setFieldValue('source.git.url', '');
    onStrategyChange(ImportStrategy.SAMPLE);
  }, [onStrategyChange, setFieldValue]);

  const description = 'Provide a link to your GitHub repo or start with a code sample.';

  return (
    <>
      <HeadTitle>Import - Add components | Stonesoup</HeadTitle>
      <TextContent>
        <Text component="h2">Add components to your application</Text>
        <HelperText>
          <HelperTextItem>
            {description}{' '}
            <HelpTopicLink topicId="add-component">
              Learn more <OpenDrawerRightIcon />
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
          <Grid hasGutter>
            <GridItem span={onStrategyChange ? 8 : 12}>
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
            </GridItem>
            {onStrategyChange ? (
              <GridItem span={4}>
                No code?{' '}
                <Button
                  data-testid="start-with-sample-button"
                  variant={ButtonVariant.link}
                  onClick={handleStrategyChange}
                  isInline
                >
                  Start with a sample.
                </Button>
              </GridItem>
            ) : null}
          </Grid>
        </FormGroup>
        {showAuthOptions && <AuthOptions />}
        {showGitOptions && <GitOptions />}
      </FormSection>
    </>
  );
};
