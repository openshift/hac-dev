import * as React from 'react';
import {
  Button,
  ButtonVariant,
  ExpandableSection,
  FormGroup,
  Grid,
  GridItem,
  ValidatedOptions,
} from '@patternfly/react-core';
import { useField, useFormikContext } from 'formik';
import { getFieldId, HelpTooltipIcon, InputField } from '../../shared';
import { useDebounceCallback } from '../../shared/hooks/useDebounceCallback';
import { ServiceProviderType } from '../../types';
import { GitAuthorization } from './GitAuthorization';
import { GitOptions } from './GitOptions';
import { useAccessCheck } from './utils';
import { gitUrlRegex, containerImageRegex } from './validation-utils';

type SourceSectionProps = {
  onSamplesClick: React.MouseEventHandler<HTMLButtonElement>;
};

export const SourceSection: React.FC<SourceSectionProps> = ({ onSamplesClick }) => {
  const [authorizationExpanded, setAuthorizationExpanded] = React.useState<boolean>(true);
  const [showAuthorization, setShowAuthorization] = React.useState<boolean>(true);
  const [showGitOptions, setShowGitOptions] = React.useState<boolean>(false);
  const [, { value: source, touched, error }] = useField<string>({
    name: 'source',
    type: 'input',
  });
  const [, { value: authSecret }] = useField<string>('git.authSecret');
  const { setFieldValue } = useFormikContext();
  const [sourceUrl, setSourceUrl] = React.useState('');
  const [validated, setValidated] = React.useState(ValidatedOptions.default);
  const [helpText, setHelpText] = React.useState('');
  const [helpTextInvalid, setHelpTextInvalid] = React.useState('');
  const fieldId = getFieldId('source', 'input');
  const isValid = !(touched && error);
  const label = 'Git repo URL or container image';

  const [{ isGit, isRepoAccessible, serviceProvider }, accessCheckLoaded] = useAccessCheck(
    sourceUrl,
    authSecret,
  );

  const handleSourceChange = React.useCallback(() => {
    const searchTerm = source;
    const isGitUrlValid = gitUrlRegex.test(searchTerm);
    const isContainerImageValid = containerImageRegex.test(searchTerm);
    setShowAuthorization(false);
    setShowGitOptions(false);
    setFieldValue('git.authSecret', '');
    if (!searchTerm || (!isGitUrlValid && !isContainerImageValid)) {
      setValidated(ValidatedOptions.error);
      setHelpTextInvalid('Invalid URL');
      setSourceUrl(null);
      return;
    }
    if (isContainerImageValid || isGitUrlValid) {
      setValidated(ValidatedOptions.default);
      setHelpText('Validating...');
      setHelpTextInvalid('');
      setShowAuthorization(false);
      setSourceUrl(source);
    }
  }, [source, setFieldValue]);

  const debouncedHandleSourceChange = useDebounceCallback(handleSourceChange);

  React.useEffect(() => {
    if (accessCheckLoaded) {
      if (isRepoAccessible) {
        setValidated(ValidatedOptions.success);
        setHelpText('Validated');
        isGit && setShowGitOptions(true);
      } else if (
        serviceProvider === ServiceProviderType.GitHub ||
        serviceProvider === ServiceProviderType.Quay
      ) {
        setValidated(ValidatedOptions.error);
        setHelpTextInvalid('Unable to access repository');
        setShowAuthorization(true);
      }
    }
  }, [accessCheckLoaded, isRepoAccessible, isGit, serviceProvider]);

  return (
    <>
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
          <GridItem span={6}>
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
            <Button
              variant={ButtonVariant.link}
              onClick={onSamplesClick}
              style={{ paddingLeft: 0 }}
            >
              Start with a sample.
            </Button>
          </GridItem>
        </Grid>
      </FormGroup>
      {showAuthorization && (
        <ExpandableSection
          isExpanded={authorizationExpanded}
          onToggle={setAuthorizationExpanded}
          isIndented
          toggleText="Authorization"
        >
          <GitAuthorization />
        </ExpandableSection>
      )}
      {showGitOptions && <GitOptions />}
    </>
  );
};
