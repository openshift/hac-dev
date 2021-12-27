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

type SourceFieldProps = {
  onSamplesClick: React.MouseEventHandler<HTMLButtonElement>;
};

export const SourceField: React.FC<SourceFieldProps> = ({ onSamplesClick }) => {
  const [, { value: source, touched, error }] = useField<string>({
    name: 'source',
    type: 'input',
  });
  const [, , { setValue: setDetectedComponents }] = useField('detectedComponents');
  const [validated, setValidated] = React.useState(ValidatedOptions.default);
  const [helpText, setHelpText] = React.useState('');
  const [formState] = useFormValues();
  const fieldId = getFieldId('source', 'input');
  const isValid = !(touched && error);
  const label = 'Component Source';

  const debouncedHandleSourceChange = useDebounceCallback(
    React.useCallback(() => {
      if (error) {
        setValidated(ValidatedOptions.error);
        return;
      }
      setValidated(ValidatedOptions.default);
      createComponentDetectionQuery(formState.application, source)
        .then((result) => {
          setValidated(ValidatedOptions.success);
          setHelpText('Validated');

          setDetectedComponents(
            Object.keys(result.data).map((name) => {
              const { componentResourceStub } = result.data[name];

              return {
                name,
                resources: componentResourceStub.spec.resources,
                git: {
                  url: componentResourceStub.spec.source.git.url,
                  path: componentResourceStub.spec.source.git.path,
                },
                ...result.data[name],
              };
            }),
          );
        })
        .catch(() => {
          setValidated(ValidatedOptions.error);
          setHelpText('');
        });
    }, [source, error, formState.application, setDetectedComponents]),
  );

  React.useEffect(() => {
    source && debouncedHandleSourceChange();
    // Run detection on mount if initial value exists
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            required
          />
        </GridItem>
        <GridItem span={4}>
          No code?{' '}
          <Button variant={ButtonVariant.link} onClick={onSamplesClick}>
            Start with a sample
          </Button>
        </GridItem>
      </Grid>
    </FormGroup>
  );
};
