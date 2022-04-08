import * as React from 'react';
import {
  Button,
  ButtonVariant,
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
import { useComponentDetection } from './utils';
import { gitUrlRegex } from './validation-utils';

type SourceFieldProps = {
  onSamplesClick: React.MouseEventHandler<HTMLButtonElement>;
};

export const SourceField: React.FC<SourceFieldProps> = ({ onSamplesClick }) => {
  const [, { value: source, touched, error }] = useField<string>({
    name: 'source',
    type: 'input',
  });
  const [, { value: gitOptions }] = useField<AddComponentValues['git']>('git');
  const { setFieldValue } = useFormikContext();
  const [validated, setValidated] = React.useState(ValidatedOptions.default);
  const [helpText, setHelpText] = React.useState('');
  const [helpTextInvalid, setHelpTextInvalid] = React.useState('');
  const [sourceUrl, setSourceUrl] = React.useState('');
  const [formState] = useFormValues();
  const fieldId = getFieldId('source', 'input');
  const isValid = !(touched && error);
  const label = 'Git repo URL or container image';

  const [detectedComponents, loadError] = useComponentDetection(
    sourceUrl,
    formState.application,
    formState.namespace,
    gitOptions.isMultiComponent,
    gitOptions.authSecret,
  );

  const debouncedHandleSourceChange = useDebounceCallback(
    React.useCallback(() => {
      if (!gitUrlRegex.test(source)) {
        setValidated(ValidatedOptions.error);
        return;
      }
      setValidated(ValidatedOptions.default);
      setFieldValue('detectedComponents', undefined);
      setHelpText('Validating...');
      setHelpTextInvalid('');
      setSourceUrl(source);
    }, [source, setFieldValue]),
  );

  React.useEffect(() => {
    if (detectedComponents) {
      setValidated(ValidatedOptions.success);
      setHelpText('Validated');

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
          <Button variant={ButtonVariant.link} onClick={onSamplesClick} style={{ paddingLeft: 0 }}>
            Start with a sample.
          </Button>
        </GridItem>
      </Grid>
    </FormGroup>
  );
};
