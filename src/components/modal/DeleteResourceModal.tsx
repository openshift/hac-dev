import * as React from 'react';
import {
  k8sDeleteResource,
  K8sModelCommon,
  K8sResourceCommon,
} from '@openshift/dynamic-plugin-sdk-utils';
import {
  Alert,
  AlertVariant,
  Button,
  ButtonType,
  ButtonVariant,
  Form,
  ModalVariant,
  Stack,
  StackItem,
  Text,
  TextContent,
  TextVariants,
  ValidatedOptions,
} from '@patternfly/react-core';
import { Formik } from 'formik';
import { InputField } from '../../shared';
import { ComponentProps, createModalLauncher } from './createModalLauncher';

type DeleteResourceModalProps = ComponentProps & {
  obj: K8sResourceCommon;
  model: K8sModelCommon;
  displayName?: string;
  isEntryNotRequired?: boolean;
  description?: React.ReactNode;
};

export const DeleteResourceModal: React.FC<DeleteResourceModalProps> = ({
  obj,
  model,
  onClose,
  displayName,
  isEntryNotRequired = false,
  description,
}) => {
  const [error, setError] = React.useState();
  const resourceName = displayName || obj.metadata.name;
  const deleteResource = async () => {
    try {
      await k8sDeleteResource({
        model,
        queryOptions: {
          name: obj.metadata.name,
          ns: obj.metadata.namespace,
        },
      });
    } catch (e) {
      setError(e);
    }
    onClose({ submitClicked: true });
  };

  const onReset = () => {
    onClose({ submitClicked: false });
  };

  return (
    <Formik onSubmit={deleteResource} initialValues={{ resourceName: '' }} onReset={onReset}>
      {({
        handleSubmit,
        handleReset,
        values,
        isSubmitting,
        touched: { resourceName: touched },
      }) => {
        const input = values.resourceName;
        const isValid = input === resourceName;
        const helpText = touched && !input ? `${obj.kind} name missing` : undefined;
        const validatedState = touched
          ? !input
            ? ValidatedOptions.warning
            : isValid
            ? ValidatedOptions.success
            : ValidatedOptions.error
          : undefined;

        return (
          <Form>
            <Stack hasGutter>
              <StackItem>
                <TextContent>
                  <Text component={TextVariants.p}>
                    {description ? (
                      description
                    ) : (
                      <>
                        The {obj.kind} <strong>{resourceName}</strong> will be deleted.
                      </>
                    )}
                  </Text>
                </TextContent>
              </StackItem>
              {!isEntryNotRequired && (
                <StackItem>
                  <InputField
                    name="resourceName"
                    label={`Type "${resourceName}" to confirm deletion`}
                    helpTextInvalid={`${obj.kind} name does not match`}
                    helpText={helpText}
                    validated={validatedState}
                    required
                  />
                </StackItem>
              )}
              <StackItem>
                {error && (
                  <Alert isInline variant={AlertVariant.danger} title="An error occurred">
                    {error}
                  </Alert>
                )}
                <Button
                  type={ButtonType.submit}
                  variant={ButtonVariant.danger}
                  isLoading={isSubmitting}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                  isDisabled={!isEntryNotRequired && (!isValid || isSubmitting)}
                  data-testid="delete-resource"
                >
                  Delete
                </Button>
                <Button variant={ButtonVariant.link} onClick={handleReset}>
                  Cancel
                </Button>
              </StackItem>
            </Stack>
          </Form>
        );
      }}
    </Formik>
  );
};

export const createDeleteModalLauncher = (kind: string) =>
  createModalLauncher(DeleteResourceModal, {
    'data-testid': `delete-${kind}-modal`,
    variant: ModalVariant.small,
    title: `Delete ${kind}?`,
    titleIconVariant: 'warning',
  });
