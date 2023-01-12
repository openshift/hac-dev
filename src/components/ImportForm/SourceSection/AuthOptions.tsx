import * as React from 'react';
import {
  Button,
  ButtonVariant,
  ExpandableSection,
  HelperText,
  HelperTextItem,
  Spinner,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';
import { CheckIcon } from '@patternfly/react-icons/dist/js/icons/check-icon';
import { useFormikContext } from 'formik';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { useModalLauncher } from '../../modal/ModalProvider';
import { useAccessTokenBinding } from '../utils/auth-utils';
import { ImportFormValues } from '../utils/types';
import { createAuthTokenModal } from './AuthTokenModal';

const AuthOptions: React.FC = () => {
  const [expanded, setExpanded] = React.useState<boolean>(true);
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
      window.open(`${oAuthUrl}&k8s_token=${token}`, '_blank');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oAuthUrl]);

  return (
    <ExpandableSection
      isExpanded={expanded}
      onToggle={setExpanded}
      isIndented
      toggleText="Authorization"
    >
      <TextContent>
        <Text component={TextVariants.small}>To connect to a private repository, sign in.</Text>
        {secret ? (
          <HelperText>
            <HelperTextItem variant="success" icon={<CheckIcon />}>
              Authorized access
            </HelperTextItem>
          </HelperText>
        ) : !loaded ? (
          <Spinner size="lg" aria-label="Creating access token binding" isSVG />
        ) : (
          <>
            <Button
              variant={ButtonVariant.link}
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
      </TextContent>
    </ExpandableSection>
  );
};

export default AuthOptions;
