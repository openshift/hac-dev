import {
  Button,
  ButtonVariant,
  FormGroup,
  Grid,
  GridItem,
  TextInput,
  ValidatedOptions,
} from '@patternfly/react-core';
import { useField } from 'formik';
import * as React from 'react';
import { getFieldId } from '../../shared';

export const SourceField = ({ onSamplesClick }) => {
  const [field, { touched, error }] = useField({ name: 'source', type: 'input' });
  const fieldId = getFieldId('source', 'input');
  const isValid = !(touched && error);
  const errorMessage = !isValid ? error : '';
  const label = 'Component Source';
  return (
    <FormGroup
      fieldId={fieldId}
      label={label}
      helperTextInvalid={errorMessage}
      validated={!isValid && ValidatedOptions.error}
      isRequired={true}
    >
      <Grid hasGutter>
        <GridItem span={6}>
          <TextInput
            {...field}
            id={fieldId}
            label={label}
            isReadOnly
            placeholder="Enter your source..."
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
