import React from 'react';
import { k8sDeleteResource } from '@openshift/dynamic-plugin-sdk-utils';
import {
  Modal,
  Stack,
  StackItem,
  TextContent,
  Text,
  Alert,
  AlertVariant,
  Button,
  ButtonType,
  ButtonVariant,
  ModalVariant,
} from '@patternfly/react-core';
import { SpaceBindingRequestModel } from '../../models';
import { SpaceBindingRequest } from '../../types';
import { RawComponentProps } from '../modal/createModalLauncher';

type Props = RawComponentProps & {
  sbr: SpaceBindingRequest;
};

export const RevokeAccessModal: React.FC<Props> = ({ sbr, onClose, modalProps }) => {
  const [error, setError] = React.useState<string>();
  const [submitting, setSubmitting] = React.useState(false);
  const handleSubmit = React.useCallback(
    async (e) => {
      e.preventDefault();
      setSubmitting(false);
      setError(null);
      try {
        await k8sDeleteResource({
          model: SpaceBindingRequestModel,
          queryOptions: {
            name: sbr.metadata.name,
            ns: sbr.metadata.namespace,
          },
        });
        onClose(null, { submitClicked: true });
      } catch (err) {
        setError(err.message || err.toString());
      }
    },
    [onClose, sbr],
  );

  return (
    <Modal {...modalProps} variant={ModalVariant.small}>
      <Stack hasGutter>
        <StackItem>
          <TextContent>
            <Text data-testid="description">
              The user <strong>{sbr.spec.masterUserRecord}</strong> will lose access to this
              workspace and all of its applications, environments, and any other dependent items.
            </Text>
            <Text>You can always grant the user access later.</Text>
          </TextContent>
        </StackItem>
        <StackItem>
          {error && (
            <Alert isInline variant={AlertVariant.danger} title="An error occurred">
              {error}
            </Alert>
          )}
          <Button
            type={ButtonType.submit}
            variant={ButtonVariant.danger}
            isLoading={submitting}
            onClick={handleSubmit}
            isDisabled={submitting}
            data-testid="revoke-access"
          >
            Revoke
          </Button>
          <Button
            variant={ButtonVariant.link}
            onClick={() => onClose(null, { submitClicked: false })}
          >
            Cancel
          </Button>
        </StackItem>
      </Stack>
    </Modal>
  );
};
