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
import { LoadingInline } from '../../shared/components/status-box/StatusBox';
import { initiateAccessTokenBinding } from '../../utils/create-utils';
import { NamespaceContext } from '../NamespacedPage/NamespacedPage';
import { useAccessTokenBindingAuth } from './utils';

export const GitAuthorization: React.FC = () => {
  const { namespace } = React.useContext(NamespaceContext);
  const [isCreating, setIsCreating] = React.useState(false);
  const [bindingName, setBindingName] = React.useState('');
  const [, { value: url, error, touched }] = useField<string>('source');
  const [, { value: authSecret }] = useField<string>('git.authSecret');

  useAccessTokenBindingAuth(bindingName);

  const startAuthorization = React.useCallback(() => {
    setIsCreating(true);
    initiateAccessTokenBinding(url, namespace)
      .then((resource) => {
        setBindingName(resource.metadata.name);
      })
      .finally(() => {
        setIsCreating(false);
      });
  }, [namespace, url]);

  return (
    <TextContent>
      <Text component={TextVariants.small}>To connect to a private repository, sign in.</Text>
      {authSecret ? (
        <HelperText>
          <HelperTextItem variant="success" icon={<CheckIcon />}>
            Authorized access
          </HelperTextItem>
        </HelperText>
      ) : isCreating ? (
        <LoadingInline />
      ) : (
        <Button
          variant={ButtonVariant.link}
          onClick={startAuthorization}
          isDisabled={!touched || !!error}
          style={{ paddingLeft: 0 }}
        >
          Sign In
        </Button>
      )}
    </TextContent>
  );
};
