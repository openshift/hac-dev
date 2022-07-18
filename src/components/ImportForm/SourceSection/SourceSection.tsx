import * as React from 'react';
import {
  Button,
  ButtonVariant,
  Form,
  FormGroup,
  Grid,
  GridItem,
  ValidatedOptions,
} from '@patternfly/react-core';
import { useField, useFormikContext } from 'formik';
import { useOnMount } from '../../../hooks/useOnMount';
import { getFieldId, HelpTooltipIcon, InputField } from '../../../shared';
import { useDebounceCallback } from '../../../shared/hooks/useDebounceCallback';
import {
  ServiceProviderType,
  SPIAccessCheckAccessibilityStatus,
  SPIAccessTokenBindingPhase,
} from '../../../types';
import { initiateAccessTokenBinding } from '../../../utils/create-utils';
import { useNamespace } from '../../NamespacedPage/NamespacedPage';
import { useAccessCheck } from '../utils/auth-utils';
import { ImportFormValues, ImportStrategy } from '../utils/types';
import { gitUrlRegex, containerImageRegex } from '../utils/validation-utils';
import AuthOptions from './AuthOptions';
import GitOptions from './GitOptions';

type SourceSectionProps = {
  onStrategyChange: (strategy: ImportStrategy) => void;
};

export const SourceSection: React.FC<SourceSectionProps> = ({ onStrategyChange }) => {
  const { namespace } = useNamespace();
  const [showAuthOptions, setShowAuthOptions] = React.useState<boolean>(false);
  const [showGitOptions, setShowGitOptions] = React.useState<boolean>(false);

  const [, { value: source, touched, error }] = useField<string>({
    name: 'source',
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

  const fieldId = getFieldId('source', 'input');
  const isValid = !(touched && error);
  const label = 'Git repo URL or container image';
  const isContainerImage = containerImageRegex.test(source);

  const [{ isGit, isRepoAccessible, serviceProvider, accessibility }, accessCheckLoaded] =
    useAccessCheck(!isContainerImage ? sourceUrl : null, authSecret);

  const setFormValidating = React.useCallback(() => {
    setValidated(ValidatedOptions.default);
    setHelpText('Validating...');
    setFieldValue('isValidated', false);
  }, [setFieldValue]);

  const setFormValidated = React.useCallback(() => {
    setValidated(ValidatedOptions.success);
    setHelpText('Validated');
    setFieldValue('isValidated', true);
  }, [setFieldValue]);

  const handleSourceChange = React.useCallback(() => {
    const searchTerm = source;
    const isGitUrlValid = gitUrlRegex.test(searchTerm);
    const isContainerImageValid = containerImageRegex.test(searchTerm);
    setShowAuthOptions(false);
    setShowGitOptions(false);
    setFieldValue('secret', '');
    if (!searchTerm || (!isGitUrlValid && !isContainerImageValid)) {
      setValidated(ValidatedOptions.error);
      setHelpTextInvalid('Invalid URL');
      setSourceUrl(null);
      return;
    }
    if (isGitUrlValid) {
      setFormValidating();
      setHelpTextInvalid('');
      setShowAuthOptions(false);
      setSourceUrl(searchTerm);
    }
    //[TODO] remove this condition once SPIAccessCheck for Quay is implemented
    if (isContainerImageValid) {
      setFormValidated();
      setHelpTextInvalid('');
      setShowAuthOptions(true);
      setShowGitOptions(false);
      setSourceUrl(searchTerm);
    }
  }, [source, setFieldValue, setFormValidating, setFormValidated]);

  const debouncedHandleSourceChange = useDebounceCallback(handleSourceChange);

  React.useEffect(() => {
    if (accessCheckLoaded && !isContainerImage) {
      if (isRepoAccessible) {
        setFormValidated();
        isGit && setShowGitOptions(true);
      } else if (
        serviceProvider === ServiceProviderType.GitHub ||
        serviceProvider === ServiceProviderType.Quay
      ) {
        setValidated(ValidatedOptions.error);
        setHelpTextInvalid('Unable to access repository');
        setShowAuthOptions(true);
      }
    }
  }, [
    accessCheckLoaded,
    isRepoAccessible,
    isGit,
    serviceProvider,
    isContainerImage,
    setFieldValue,
    setFormValidated,
  ]);

  // only run this effect to set the authSecret if a repo is already authenticated
  React.useEffect(() => {
    (async () => {
      if (
        accessCheckLoaded &&
        isRepoAccessible &&
        !showAuthOptions &&
        accessibility === SPIAccessCheckAccessibilityStatus.private
      ) {
        setFormValidating();
        const binding = await initiateAccessTokenBinding(source, namespace);
        if (binding.status?.phase === SPIAccessTokenBindingPhase.Injected) {
          setFieldValue('git.secret', binding.status.syncedObjectRef.name);
          setFormValidated();
        }
      }
    })();
  }, [
    accessCheckLoaded,
    accessibility,
    isRepoAccessible,
    namespace,
    setFieldValue,
    setFormValidated,
    setFormValidating,
    showAuthOptions,
    source,
  ]);

  useOnMount(() => {
    source && handleSourceChange();
  });

  const handleStrategyChange = React.useCallback(() => {
    setFieldValue('source', '');
    onStrategyChange(ImportStrategy.SAMPLE);
  }, [onStrategyChange, setFieldValue]);

  return (
    <Form isWidthLimited>
      <FormGroup
        fieldId={fieldId}
        label={label}
        labelIcon={
          <HelpTooltipIcon content="Provide a link to your Git repository or container registry, or start with a code sample." />
        }
        validated={!isValid && ValidatedOptions.error}
        isRequired
      >
        <Grid hasGutter>
          <GridItem span={8}>
            <InputField
              name="source"
              placeholder="Enter your source"
              onChange={debouncedHandleSourceChange}
              validated={validated}
              helpText={helpText}
              helpTextInvalid={helpTextInvalid}
              required
              data-test="enter-source"
            />
          </GridItem>
          <GridItem span={4}>
            No code?{' '}
            <Button variant={ButtonVariant.link} onClick={handleStrategyChange} isInline>
              Start with a sample.
            </Button>
          </GridItem>
        </Grid>
      </FormGroup>
      {showAuthOptions && <AuthOptions />}
      {showGitOptions && <GitOptions />}
    </Form>
  );
};
