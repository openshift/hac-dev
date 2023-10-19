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
import { WorkspaceBinding } from '../../types';
import { WorkspaceContext } from '../../utils/workspace-context-utils';
import { RawComponentProps } from '../modal/createModalLauncher';

type Props = RawComponentProps & {
  sbr: WorkspaceBinding['bindingRequest'];
  username: string;
};

export const RevokeAccessModal: React.FC<React.PropsWithChildren<Props>> = ({
  sbr,
  username,
  onClose,
  modalProps,
}) => {
  const { updateWorkspace } = React.useContext(WorkspaceContext);
  const [error, setError] = React.useState<string>();
  const [submitting, setSubmitting] = React.useState(false);
  const handleSubmit = React.useCallback(
    async (e: any) => {
      e.preventDefault();
      setSubmitting(false);
      setError(null);
      try {
        await k8sDeleteResource({
          model: SpaceBindingRequestModel,
          queryOptions: {
            name: sbr.name,
            ns: sbr.namespace,
          },
        });
        updateWorkspace();
        onClose(null, { submitClicked: true });
      } catch (err) {
        setError(err.message || err.toString());
      }
    },
    [onClose, sbr, updateWorkspace],
  );

  return (
    <Modal {...modalProps} variant={ModalVariant.small}>
      <Stack hasGutter>
        <StackItem>
          <TextContent>
            <Text data-testid="description">
              The user <strong>{username}</strong> will lose access to this workspace and all of its
              applications, environments, and any other dependent items.
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
