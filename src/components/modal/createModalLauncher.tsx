import * as React from 'react';
import { Modal, ModalProps } from '@patternfly/react-core';

type ModalComponentProps = Omit<ModalProps, 'children' | 'isOpen' | 'appendTo'> & {
  ref?: React.LegacyRef<Modal>;
};

type OnModalClose<D = {}> = (obj?: D) => void;

export type ComponentProps = {
  onClose?: (obj?: object) => void;
};

export type ModalLauncher<OBJ = {}> = (onClose: OnModalClose<OBJ>) => React.ReactElement;

export const createModalLauncher =
  <P extends ComponentProps, OBJ extends {}>(
    Component: React.ComponentType<P>,
    modalProps: ModalComponentProps & {
      'data-testid': string;
    },
  ) =>
  (componentProps?: P): ModalLauncher<OBJ> =>
  (onClose) => {
    const handleClose = (obj?: OBJ) => {
      componentProps?.onClose && componentProps.onClose();
      onClose(obj);
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
