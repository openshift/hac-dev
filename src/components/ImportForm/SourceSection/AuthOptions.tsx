import * as React from 'react';
import {
  Button,
  ButtonVariant,
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
  Spinner,
} from '@patternfly/react-core';
import { CheckIcon } from '@patternfly/react-icons/dist/js/icons/check-icon';
import { useFormikContext } from 'formik';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { useModalLauncher } from '../../modal/ModalProvider';
import { initiateSpiAuthSession, useAccessTokenBinding } from '../utils/auth-utils';
import { ImportFormValues } from '../utils/types';
import { createAuthTokenModal } from './AuthTokenModal';

const AuthOptions: React.FC = () => {
  const {
    values: { secret, source },
  } = useFormikContext<ImportFormValues>();

  const {
    auth: { getToken },
  } = useChrome();
  const showModal = useModalLauncher();

  const [{ oAuthUrl, uploadUrl }, loaded] = useAccessTokenBinding(source.git.url);

  const startAuthorization = React.useCallback(async () => {
    if (oAuthUrl) {
      const token = await getToken();
      await initiateSpiAuthSession(oAuthUrl, token);
      window.open(oAuthUrl, '_blank');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oAuthUrl]);

  return (
    <FormGroup label="Authorization">
      <FormHelperText>
        <HelperText>
          <HelperTextItem>To connect to a private repository, sign in.</HelperTextItem>
        </HelperText>
      </FormHelperText>
      {secret ? (
        <HelperText>
          <HelperTextItem variant="success" icon={<CheckIcon />}>
            Authorized access
          </HelperTextItem>
        </HelperText>
      ) : !loaded ? (
        <Spinner size="lg" aria-label="Creating access token binding" />
      ) : (
        <>
          <br />
          <Button
            variant={ButtonVariant.primary}
            onClick={startAuthorization}
            isDisabled={!loaded}
            isInline
          >
            Sign in
          </Button>
          <Button
            variant={ButtonVariant.link}
            onClick={() => showModal(createAuthTokenModal({ uploadUrl }))}
            isDisabled={!loaded}
          >
            Use a token instead
          </Button>
        </>
      )}
    </FormGroup>
  );
};

export default AuthOptions;
