import * as React from 'react';
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
  TextInputTypes,
  TextVariants,
} from '@patternfly/react-core';
import { Formik, FormikValues } from 'formik';
import { InputField } from '../../../shared';
import { ComponentProps, createModalLauncher } from '../../modal/createModalLauncher';
import { useSpiAPI } from '../utils/auth-utils';

type AuthTokenModalProps = ComponentProps & {
  uploadUrl: string;
};

export const AuthTokenModal: React.FC<AuthTokenModalProps> = ({ onClose, uploadUrl }) => {
  const [error, setError] = React.useState();
  const { uploadToken } = useSpiAPI();

  const submitToken = React.useCallback(
    async (values: FormikValues) => {
      try {
        await uploadToken(uploadUrl, values.username, values.token);
        onClose();
      } catch (e) {
        setError(e);
      }
    },
    [uploadUrl, onClose, uploadToken],
  );

  return (
    <Formik onSubmit={submitToken} initialValues={{ username: '', token: '' }} onReset={onClose}>
      {({ handleSubmit, values, handleReset, isSubmitting }) => {
        const isValid = values.username && values.token;

        return (
          <Form>
            <Stack hasGutter>
              <StackItem>
                <TextContent>
                  <Text component={TextVariants.small}>
                    Enter the API token to pull in source code.
                  </Text>
                </TextContent>
              </StackItem>
              <StackItem>
                <InputField name="username" label="Username" required data-testid="auth-username" />
                <InputField
                  name="token"
                  label="API Token"
                  type={TextInputTypes.password}
                  data-testid="auth-token"
                  required
                />
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
                  data-testid="authenticate-token"
                >
                  Connect
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

export const createAuthTokenModal = createModalLauncher(AuthTokenModal, {
  'data-testid': 'auth-token-modal',
  variant: ModalVariant.small,
  title: 'Authenticate with API token',
});
