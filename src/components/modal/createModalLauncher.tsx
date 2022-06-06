import * as React from 'react';
import { Modal, ModalProps } from '@patternfly/react-core';

type ModalComponentProps = Omit<ModalProps, 'children' | 'isOpen' | 'appendTo'> & {
  ref?: React.LegacyRef<Modal>;
};

export type ComponentProps = {
  onClose?: () => void;
};

export type ModalLauncher = (onClose: () => void) => React.ReactElement;

export type CreateModalLauncher = <P extends ComponentProps>(
  Component: React.ComponentType<P>,
  modalProps?: ModalComponentProps & {
    'data-testid': string;
  },
) => (componentProps?: P) => ModalLauncher;

export const createModalLauncher: CreateModalLauncher =
  (Component, modalProps) => (componentProps) => (onClose) => {
    const handleClose = () => {
      componentProps?.onClose && componentProps.onClose();
      onClose();
    };

    return (
      <Modal
        aria-label="modal"
        {...modalProps}
        isOpen
        onClose={handleClose}
        appendTo={() => document.querySelector('#hacDev-modal-container')}
      >
        <Component {...componentProps} onClose={handleClose} />
      </Modal>
    );
  };
