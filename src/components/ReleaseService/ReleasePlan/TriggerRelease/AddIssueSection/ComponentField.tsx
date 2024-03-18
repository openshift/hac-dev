import * as React from 'react';
import {
  Button,
  ButtonVariant,
  FormGroup,
  InputGroup,
  Stack,
  StackItem,
} from '@patternfly/react-core';
import { MinusCircleIcon } from '@patternfly/react-icons/dist/js/icons/minus-circle-icon';
import { PlusCircleIcon } from '@patternfly/react-icons/dist/js/icons/plus-circle-icon';
import { FieldArray, useField } from 'formik';
import { InputField } from '../../../../../shared';

type ComponentFieldProps = {
  name: string;
};

const ComponentField: React.FC<React.PropsWithChildren<ComponentFieldProps>> = ({ name }) => {
  const [{ value: components }, ,] = useField<string[]>(name);

  return (
    <FieldArray
      name={name}
      render={({ push, remove }) => {
        return (
          <FormGroup label="Which component affects this CVE?" data-test="component-field">
            <Stack>
              {Array.isArray(components) &&
                components.length > 0 &&
                components.map((val, i) => {
                  return (
                    <StackItem key={`${name}[${i}]`}>
                      <InputGroup className="pf-v5-u-mb-sm">
                        <InputField name={`${name}[${i}]`} data-test={`component-${i}`} />

                        <Button
                          variant={ButtonVariant.plain}
                          onClick={() => remove(i)}
                          data-test={`remove-component-${i}`}
                          isDisabled={components.length === 1}
                        >
                          <MinusCircleIcon />
                        </Button>
                      </InputGroup>
                    </StackItem>
                  );
                })}
              <StackItem>
                <Button
                  onClick={() => {
                    push('');
                  }}
                  variant={ButtonVariant.link}
                  icon={<PlusCircleIcon />}
                  data-test="add-component-button"
                >
                  Add another component
                </Button>
              </StackItem>
            </Stack>
          </FormGroup>
        );
      }}
    />
  );
};

export default ComponentField;
