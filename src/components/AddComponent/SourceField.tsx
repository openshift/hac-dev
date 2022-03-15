import * as React from 'react';
import {
  Button,
  ButtonVariant,
  FormGroup,
  Grid,
  GridItem,
  ValidatedOptions,
} from '@patternfly/react-core';
import { useField } from 'formik';
import { getFieldId, HelpTooltipIcon, InputField } from '../../shared';
import { useDebounceCallback } from '../../shared/hooks/useDebounceCallback';
import { createComponentDetectionQuery } from '../../utils/create-utils';
import { useFormValues } from '../form-context';
import { AddComponentValues } from './AddComponentForm';
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
  const [, , { setValue: setDetectedComponents }] =
    useField<AddComponentValues['detectedComponents']>('detectedComponents');
  const [validated, setValidated] = React.useState(ValidatedOptions.default);
  const [helpText, setHelpText] = React.useState('');
  const [helpTextInvalid, setHelpTextInvalid] = React.useState('');
  const [formState] = useFormValues();
  const fieldId = getFieldId('source', 'input');
  const isValid = !(touched && error);
  const label = 'Git repo URL or container image';

  const debouncedHandleSourceChange = useDebounceCallback(
    React.useCallback(() => {
      if (!gitUrlRegex.test(source)) {
        setValidated(ValidatedOptions.error);
        return;
      }
      setValidated(ValidatedOptions.default);
      setDetectedComponents(undefined);
      setHelpText('Validating...');
      setHelpTextInvalid('');
      createComponentDetectionQuery(
        formState.application,
        source,
        formState.namespace,
        gitOptions.isMultiComponent,
        gitOptions.authSecret,
      )
        .then((result) => {
          setValidated(ValidatedOptions.success);
          setHelpText('Validated');

          setDetectedComponents(
            Object.values(result).map(({ componentStub }) => ({
              ...componentStub,
              name: componentStub.componentName,
            })),
          );
        })
        .catch((e) => {
          setValidated(ValidatedOptions.error);
          setHelpTextInvalid('Unable to detect components');
          // eslint-disable-next-line no-console
          console.error('Unable to detect component: ', e);
        });
    }, [
      source,
      setDetectedComponents,
      formState.application,
      formState.namespace,
      gitOptions.isMultiComponent,
      gitOptions.authSecret,
    ]),
  );

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
