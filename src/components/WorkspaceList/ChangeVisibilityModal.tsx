import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [isChecked, setChecked] = React.useState<boolean>(
    workspace.spec?.visibility === ItemVisibility.COMMUNITY,
  );
  const [isSubmitting, setSubmitting] = React.useState<boolean>(false);

  const isSubmitDisabled =
    (isChecked && workspace.spec?.visibility === ItemVisibility.COMMUNITY) ||
    (!isChecked && workspace.spec?.visibility !== ItemVisibility.COMMUNITY);

  const submitChange = async () => {
    setSubmitting(true);
    const newVisibility = isChecked ? ItemVisibility.COMMUNITY : ItemVisibility.PRIVATE;
    try {
      await updateVisibility(workspace, newVisibility);
      setChecked(!isChecked);
    } catch (err) {
      setError(err.message || err.toString());
    }
    setSubmitting(false);
    onClose(null, { submitClicked: true });
    navigate(`/application-pipeline/workspaces/${workspace.status?.space?.name}/applications`);
  };

  return (
    <Modal {...modalProps} variant={ModalVariant.small}>
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
