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
import { useFormValues } from '../form-context';
import { AddComponentValues } from './AddComponentForm';
import { GitAuthorization } from './GitAuthorization';
import { GitOptions } from './GitOptions';
import { useComponentDetection } from './utils';
import { gitUrlRegex, containerImageRegex } from './validation-utils';

type SourceSectionProps = {
  onSamplesClick: React.MouseEventHandler<HTMLButtonElement>;
};

export const SourceSection: React.FC<SourceSectionProps> = ({ onSamplesClick }) => {
  const [authorizationExpanded, setAuthorizationExpanded] = React.useState<boolean>(true);
  const [showAuthorization, setShowAuthorization] = React.useState<boolean>(false);
  const [showGitOptions, setShowGitOptions] = React.useState<boolean>(false);
  const [, { value: source, touched, error }] = useField<string>({
    name: 'source',
    type: 'input',
  });
  const [, { value: gitOptions = {} as AddComponentValues['git'] }] =
    useField<AddComponentValues['git']>('git');
  const { setFieldValue } = useFormikContext();
  const [sourceUrl, setSourceUrl] = React.useState('');
  const [validated, setValidated] = React.useState(ValidatedOptions.default);
  const [helpText, setHelpText] = React.useState('');
  const [helpTextInvalid, setHelpTextInvalid] = React.useState('');
  const [formState] = useFormValues();
  const fieldId = getFieldId('source', 'input');
  const isValid = !(touched && error);
  const label = 'Git repo URL or container image';

  const [detectedComponents, loadError] = useComponentDetection(
    sourceUrl,
    formState.application,
    gitOptions,
  );

  const handleSourceChange = React.useCallback(() => {
    const searchTerm = source;
    const isGitUrlValid = gitUrlRegex.test(searchTerm);
    const isContainerImageValid = containerImageRegex.test(searchTerm);
    if (!searchTerm || (!isGitUrlValid && !isContainerImageValid)) {
      setValidated(ValidatedOptions.error);
      setShowAuthorization(false);
      setShowGitOptions(false);
      setSourceUrl(null);
      return;
    }
    if (isContainerImageValid) {
      setValidated(ValidatedOptions.success);
      setHelpText('Validated');
      setShowAuthorization(true);
      const name = searchTerm.split('/')?.[2];
      setFieldValue('detectedComponents', [
        { source: { image: { containerImage: searchTerm } }, name },
      ]);
    } else if (isGitUrlValid) {
      setValidated(ValidatedOptions.default);
      setFieldValue('detectedComponents', undefined);
      setHelpText('Validating...');
      setHelpTextInvalid('');
      setShowAuthorization(false);
      setSourceUrl(source);
    }
  }, [source, setFieldValue]);

  const debouncedHandleSourceChange = useDebounceCallback(handleSourceChange);

  React.useEffect(() => {
    if (detectedComponents) {
      setValidated(ValidatedOptions.success);
      setHelpText('Validated');
      setShowGitOptions(true);
      setFieldValue(
        'detectedComponents',
        Object.values(detectedComponents).map(({ componentStub }) => ({
          ...componentStub,
          name: componentStub.componentName,
        })),
      );
    } else if (loadError) {
      setValidated(ValidatedOptions.error);
      setHelpTextInvalid('Unable to detect components');
      setFieldValue('detectedComponents', undefined);
      setShowAuthorization(true);
      setShowGitOptions(true);
      // eslint-disable-next-line no-console
      console.error('Unable to detect component: ', loadError);
    }
  }, [detectedComponents, loadError, setFieldValue]);

  React.useEffect(() => {
    source && gitOptions && debouncedHandleSourceChange();
    // Run detection on mount if initial value exists
    // or if git options are changed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gitOptions]);

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
