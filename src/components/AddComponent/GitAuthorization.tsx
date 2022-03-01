import * as React from 'react';
import {
  Button,
  ButtonVariant,
  HelperText,
  HelperTextItem,
  Popover,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';
import { CheckIcon } from '@patternfly/react-icons/dist/js/icons/check-icon';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons/dist/js/icons/outlined-question-circle-icon';
import { useField } from 'formik';
import { useActiveNamespace } from '../../hooks/useActiveNamespace';
import { LoadingInline } from '../../shared/components/status-box/StatusBox';
import { initiateAccessTokenBinding } from '../../utils/create-utils';
import { useAccessTokenBindingAuth } from './utils';

export const GitAuthorization: React.FC = () => {
  const namespace = useActiveNamespace();
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
      <Text component={TextVariants.h3}>
        Authorize Git repository{' '}
        <Popover bodyContent="Authorizing private Git repositories allows App Studio to access your source code.">
          <OutlinedQuestionCircleIcon />
        </Popover>
      </Text>
      <Text component={TextVariants.small}>
        To connect to a private repository, authorize access to pull in source code.
      </Text>
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
