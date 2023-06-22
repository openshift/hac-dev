import * as React from 'react';
import {
  Button,
  ButtonType,
  ButtonVariant,
  ModalVariant,
  Stack,
  StackItem,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';
import { ComponentProps, createModalLauncher } from '../modal/createModalLauncher';

export const CloseImportFormModal: React.FC<ComponentProps & {}> = ({ onClose }) => {
  return (
    <Stack hasGutter>
      <StackItem>
        <TextContent>
          <Text component={TextVariants.p}>Your changes will be lost.</Text>
        </TextContent>
      </StackItem>
      <StackItem>
        <Button
          type={ButtonType.button}
          onClick={() => onClose({ leave: true })}
          data-testid="leave-review-section"
        >
          Leave
        </Button>
        <Button variant={ButtonVariant.link} onClick={() => onClose({})}>
          Cancel
        </Button>
      </StackItem>
    </Stack>
  );
};

export const createCloseImportFormModal = createModalLauncher(CloseImportFormModal, {
  'data-testid': `close-import-form-modal`,
  variant: ModalVariant.small,
  title: `Leave creation flow?`,
});
