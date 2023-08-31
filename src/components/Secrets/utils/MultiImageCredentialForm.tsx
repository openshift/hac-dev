import React from 'react';
import {
  Button,
  FormFieldGroupExpandable,
  FormFieldGroupHeader,
  TextInputTypes,
} from '@patternfly/react-core';
import { MinusCircleIcon } from '@patternfly/react-icons/dist/js/icons/minus-circle-icon';
import { PlusCircleIcon } from '@patternfly/react-icons/dist/js/icons/plus-circle-icon';
import { FieldArray, useField } from 'formik';
import uniqueId from 'lodash-es/uniqueId';
import { InputField } from '../../../shared';

type MultiImageCredentialFormProps = {
  name: string;
};

type Entry = {
  registry: string;
  username: string;
  password: string;
  email: string;
};

export const MultiImageCredentialForm: React.FC<MultiImageCredentialFormProps> = ({ name }) => {
  const [{ value: fieldValues }] = useField<Entry[]>(name);
  const [uniqId, setUniqId] = React.useState(uniqueId());

  return (
    <FieldArray
      key={`${name}-${uniqId}`}
      name={name}
      render={(arrayHelpers) => (
        <>
          {fieldValues?.map((_v, idx) => (
            <FormFieldGroupExpandable
              key={`${idx.toString()}-${uniqId}`}
              toggleAriaLabel="Details"
              isExpanded
              header={
                <FormFieldGroupHeader
                  titleText={{ text: `Credentials ${idx + 1}`, id: `${idx.toString()}-${uniqId}` }}
                  actions={
                    fieldValues.length > 1 && (
                      <Button
                        type="button"
                        data-test="remove-credentials-button"
                        onClick={() => {
                          setUniqId(uniqueId());
                          arrayHelpers.remove(idx);
                        }}
                        variant="link"
                        icon={<MinusCircleIcon />}
                      >
                        {`Remove credentials ${idx + 1}`}
                      </Button>
                    )
                  }
                />
              }
            >
              <InputField
                name={`${name}.${idx.toString()}.registry`}
                label="Registry server address"
                helpText="For example quay.io or docker.io"
                required
              />
              <InputField
                name={`${name}.${idx.toString()}.username`}
                label="Username"
                helpText="For image registry authentication"
                required
              />
              <InputField
                name={`${name}.${idx.toString()}.password`}
                label="Password"
                type={TextInputTypes.password}
                helpText="For image registry authentication"
                required
              />
              <InputField
                name={`${name}.${idx.toString()}.email`}
                label="Email"
                type={TextInputTypes.email}
              />
            </FormFieldGroupExpandable>
          ))}
          <Button
            className="pf-v5-u-text-align-left"
            onClick={() =>
              arrayHelpers.push({ registry: '', username: '', password: '', email: '' })
            }
            type="button"
            data-test="add-credentials-button"
            variant="link"
            icon={<PlusCircleIcon />}
          >
            Add another credentials
          </Button>
        </>
      )}
    />
  );
};
