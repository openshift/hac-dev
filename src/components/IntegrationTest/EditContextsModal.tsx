import * as React from 'react';
import { k8sPatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import {
  Alert,
  AlertVariant,
  Button,
  ButtonType,
  ButtonVariant,
  ModalVariant,
  Stack,
  StackItem,
} from '@patternfly/react-core';
import { Formik, FormikValues } from 'formik';
import { IntegrationTestScenarioModel } from '../../models';
import { IntegrationTestScenarioKind, Context } from '../../types/coreBuildService';
import { ComponentProps, createModalLauncher } from '../modal/createModalLauncher';
import ContextsField from './ContextsField';
import { formatContexts } from './IntegrationTestForm/utils/create-utils';

type EditContextsModalProps = ComponentProps & {
  intTest: IntegrationTestScenarioKind;
};

export const EditContextsModal: React.FC<React.PropsWithChildren<EditContextsModalProps>> = ({
  intTest,
  onClose,
}) => {
  const [error, setError] = React.useState<string>();

  const getFormContextValues = (contexts: Context[] = []) => {
    return contexts.map(({ name, description }) => ({ name, description }));
  };

  const updateIntegrationTest = async (values: FormikValues) => {
    try {
      await k8sPatchResource({
        model: IntegrationTestScenarioModel,
        queryOptions: {
          name: intTest.metadata.name,
          ns: intTest.metadata.namespace,
        },
        patches: [
          { op: 'replace', path: '/spec/contexts', value: formatContexts(values.contexts) },
        ],
      });
      onClose(null, { submitClicked: true });
    } catch (e) {
      setError(e.message || e.toString());
    }
  };

  const onReset = () => {
    onClose(null, { submitClicked: false });
  };

  const initialContexts = getFormContextValues(intTest?.spec?.contexts);

  // When a user presses enter, make sure the form doesn't submit.
  // Enter should be used to select values from the drop down,
  // when using the keyboard, not submit the form.
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission on Enter key
    }
  };

  return (
    <Formik
      onSubmit={updateIntegrationTest}
      initialValues={{ contexts: initialContexts, confirm: false }}
      onReset={onReset}
    >
      {({ handleSubmit, handleReset, isSubmitting, values }) => {
        const isChanged = values.contexts !== initialContexts;
        const showConfirmation = isChanged && values.strategy === 'Automatic';
        const isValid = isChanged && (showConfirmation ? values.confirm : true);

        return (
          <div data-testid={'edit-contexts-modal'} onKeyDown={handleKeyDown}>
            <Stack hasGutter>
              <StackItem>
                <ContextsField fieldName="contexts" editing={true} />
              </StackItem>
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
                  data-testid={'update-contexts'}
                >
                  Save
                </Button>
                <Button
                  variant={ButtonVariant.link}
                  onClick={handleReset}
                  data-testid={'cancel-update-contexts'}
                >
                  Cancel
                </Button>
              </StackItem>
            </Stack>
          </div>
        );
      }}
    </Formik>
  );
};

export const createEditContextsModal = createModalLauncher(EditContextsModal, {
  'data-testid': `edit-its-contexts`,
  variant: ModalVariant.medium,
  title: `Edit contexts`,
});
