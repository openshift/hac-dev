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
import { useAccessTokenBinding } from '../utils/auth-utils';
import { ImportFormValues } from '../utils/types';

const AuthOptions: React.FC = () => {
  const [expanded, setExpanded] = React.useState<boolean>(true);
  const {
    values: { secret, source },
  } = useFormikContext<ImportFormValues>();

  const {
    auth: { getToken },
  } = useChrome();

  const [authUrl, loaded] = useAccessTokenBinding(source);

  const startAuthorization = React.useCallback(async () => {
    if (authUrl) {
      const token = await getToken();
      window.open(`${authUrl}&k8s_token=${token}`, '_blank');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUrl]);

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
        ) : (
          <Button
            variant={ButtonVariant.link}
            onClick={startAuthorization}
            isDisabled={!loaded}
            isInline
          >
            {!loaded ? (
              <Spinner size="lg" aria-label="Creating access token binding" isSVG />
            ) : (
              'Sign in'
            )}
          </Button>
        )}
      </TextContent>
    </ExpandableSection>
  );
};

export default AuthOptions;
