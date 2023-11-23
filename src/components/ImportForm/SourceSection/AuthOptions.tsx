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
import { useAccessTokenBinding } from '../utils/auth-utils';
import { ImportFormValues } from '../utils/types';
import { createAuthTokenModal } from './AuthTokenModal';

const AuthOptions: React.FC = () => {
  const [token, setToken] = React.useState<string>(null);
  const {
    values: { secret, source },
  } = useFormikContext<ImportFormValues>();

  const {
    auth: { getToken },
  } = useChrome();
  const showModal = useModalLauncher();

  const [{ oAuthUrl, uploadUrl }, loaded] = useAccessTokenBinding(source.git.url);

  React.useEffect(() => {
    const resolveToken = async () => {
      const tkn = await getToken();
      setToken(tkn);
    };
    resolveToken();
  }, [getToken]);

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
          {token ? (
            <form style={{ display: 'inline' }} action={oAuthUrl} target="_blank" method="POST">
              <input style={{ display: 'none' }} name="k8s_token" value={token} />
              <Button type="submit" variant={ButtonVariant.primary} isDisabled={!loaded} isInline>
                Sign in
              </Button>
            </form>
          ) : null}
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
