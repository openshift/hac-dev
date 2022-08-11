import * as React from 'react';
import { k8sPatchResource } from '@openshift/dynamic-plugin-sdk-utils';
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
} from '@patternfly/react-core';
import { Formik, FormikValues } from 'formik';
import { EnvironmentModel } from '../../models';
import { CheckboxField, DropdownField } from '../../shared';
import { EnvironmentKind } from '../../types';
import { ComponentProps, createModalLauncher } from '../modal/createModalLauncher';
import { EnvironmentDeploymentStrategy } from './environment-utils';

const dropdownItems = Object.entries(EnvironmentDeploymentStrategy).map(([value, key]) => ({
  key,
  value,
}));

type DeleteResourceModalProps = ComponentProps & {
  obj: EnvironmentKind;
};

export const EditStrategyModal: React.FC<DeleteResourceModalProps> = ({ obj, onClose }) => {
  const [error, setError] = React.useState();
  const initialStrategy = dropdownItems.find((i) => i.key === obj.spec.deploymentStrategy).value;

  const updateEnvironment = async (values: FormikValues) => {
    const selectedStrategy = dropdownItems.find((i) => i.value === values.strategy);
    try {
      await k8sPatchResource({
        model: EnvironmentModel,
        queryOptions: {
          name: obj.metadata.name,
          ns: obj.metadata.namespace,
        },
        patches: [{ op: 'replace', path: '/spec/deploymentStrategy', value: selectedStrategy.key }],
      });
      onClose({ submitClicked: true });
    } catch (e) {
      setError(e);
    }
  };

  const onReset = () => {
    onClose({ submitClicked: false });
  };

  return (
    <Formik
      onSubmit={updateEnvironment}
      initialValues={{ strategy: initialStrategy, confirm: false }}
      onReset={onReset}
    >
      {({ handleSubmit, handleReset, isSubmitting, values }) => {
        const isChanged = values.strategy !== initialStrategy;
        const showConfirmation = isChanged && values.strategy === 'Automatic';
        const isValid = isChanged && (showConfirmation ? values.confirm : true);

        return (
          <Form>
            <Stack hasGutter>
              <StackItem>
                <TextContent>
                  <Text component={TextVariants.h3}>{obj.spec.displayName}</Text>
                </TextContent>
              </StackItem>
              <StackItem>
                <DropdownField
                  name="strategy"
                  label="Deployment strategy"
                  items={dropdownItems}
                  helpText="Set whether application component updates will need to be
                  manually or automatically promoted to this environment, and
                  if changes will be manually or automatically deployed."
                  required
                />
              </StackItem>
              {showConfirmation && (
                <StackItem>
                  <CheckboxField
                    name="confirm"
                    label={
                      <>
                        I understand that application component updates will be automatically
                        deployed and promoted to <strong>{obj.spec.displayName}</strong>{' '}
                        environment.
                      </>
                    }
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
                  isLoading={isSubmitting}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                  isDisabled={!isValid || isSubmitting}
                  data-testid="update-resource"
                >
                  Save
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

export const createEditStrategyModal = createModalLauncher(EditStrategyModal, {
  'data-testid': `edit-environment-strategy`,
  variant: ModalVariant.small,
  title: `Edit deployment strategy`,
});
