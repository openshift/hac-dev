import * as React from 'react';
import {
  Button,
  ButtonVariant,
  HelperText,
  HelperTextItem,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';
import { CheckIcon } from '@patternfly/react-icons/dist/js/icons/check-icon';
import { useField } from 'formik';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { useAccessTokenBindingAuth } from './utils';

export const GitAuthorization: React.FC = () => {
  const [, { value: url }] = useField<string>('source');
  const [, { value: authSecret }] = useField<string>('git.authSecret');
  const {
    auth: { getToken },
  } = useChrome();

  const [authUrl, loaded] = useAccessTokenBindingAuth(url);

  const startAuthorization = React.useCallback(async () => {
    if (authUrl) {
      const token = await getToken();
      window.open(`${authUrl}&k8s_token=${token}`, '_blank');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUrl]);

  return (
    <TextContent>
      <Text component={TextVariants.small}>To connect to a private repository, sign in.</Text>
      {authSecret ? (
        <HelperText>
          <HelperTextItem variant="success" icon={<CheckIcon />}>
            Authorized access
          </HelperTextItem>
        </HelperText>
      ) : (
        <Button
          variant={ButtonVariant.link}
          onClick={startAuthorization}
          isDisabled={!loaded}
          isLoading={!loaded}
        >
          Sign In
        </Button>
      )}
    </TextContent>
  );
};
