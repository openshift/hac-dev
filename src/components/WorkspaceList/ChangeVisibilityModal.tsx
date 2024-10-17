import React from 'react';
import {
  Modal,
  Stack,
  StackItem,
  TextContent,
  Text,
  Alert,
  AlertVariant,
  Button,
  ButtonVariant,
  ModalVariant,
  Switch,
  FlexItem,
  Flex,
} from '@patternfly/react-core';
import { KonfluxWorkspace } from '../../types';
import { WorkspaceContext } from '../../utils/workspace-context-utils';
import { ItemVisibility } from '../ContextSwitcher/context-switcher-utils';
import { RawComponentProps } from '../modal/createModalLauncher';

type Props = RawComponentProps & {
  workspace: KonfluxWorkspace;
};

export const ChangeVisibilityModal: React.FC<React.PropsWithChildren<Props>> = ({
  workspace,
  onClose,
  modalProps,
}) => {
  const [error, setError] = React.useState<string>();
  const { updateVisibility } = React.useContext(WorkspaceContext);
  const [isChecked, setChecked] = React.useState<boolean>(
    workspace.spec?.visibility === ItemVisibility.COMMUNITY,
  );
  const [isSubmitting, setSubmitting] = React.useState<boolean>(false);

  const isSubmitDisabled =
    (isChecked && workspace.spec?.visibility === ItemVisibility.COMMUNITY) ||
    (!isChecked && workspace.spec?.visibility !== ItemVisibility.COMMUNITY);

  const submitChange = async () => {
    setSubmitting(true);
    setError(null);
    const newVisibility = isChecked ? ItemVisibility.COMMUNITY : ItemVisibility.PRIVATE;
    try {
      await updateVisibility(workspace, newVisibility);
      setChecked(!isChecked);
      setSubmitting(false);
      onClose && onClose(null, { submitClicked: true });
    } catch (err) {
      setSubmitting(false);
      setError(err.message || err.toString());
    }
  };

  return (
    <Modal {...modalProps} variant={ModalVariant.small} data-testid="change-visibility-modal">
      <Stack hasGutter>
        <StackItem>
          <TextContent>
            <Text data-testid="description">
              The current workspace visibility is set to {workspace.spec?.visibility}.
            </Text>
            <div>
              <Flex>
                <FlexItem>
                  <Text>
                    <TextContent>Private</TextContent>
                  </Text>
                </FlexItem>
                <FlexItem alignSelf={{ default: 'alignSelfCenter' }}>
                  <Switch
                    aria-label="visibility-switch"
                    data-testid="visibility-switch"
                    hasCheckIcon={false}
                    isChecked={isChecked}
                    onChange={() => setChecked((checked) => !checked)}
                  />
                </FlexItem>
                <FlexItem>
                  <Text>
                    <TextContent>Community</TextContent>
                  </Text>
                </FlexItem>
              </Flex>
            </div>
          </TextContent>
        </StackItem>
        <StackItem>
          {error && (
            <Alert isInline variant={AlertVariant.danger} title="An error occurred">
              {error}
            </Alert>
          )}
          <Button
            variant={ButtonVariant.primary}
            onClick={submitChange}
            isDisabled={isSubmitDisabled}
            isLoading={isSubmitting}
          >
            Update
          </Button>
          <Button
            variant={ButtonVariant.link}
            onClick={() => onClose(null, { submitClicked: false })}
          >
            Close
          </Button>
        </StackItem>
      </Stack>
    </Modal>
  );
};
