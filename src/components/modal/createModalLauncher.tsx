import * as React from 'react';
import { Modal, ModalProps as PFModalProps } from '@patternfly/react-core';

export type ModalProps = Omit<PFModalProps, 'children' | 'ref'>;

type ModalComponentProps = Omit<ModalProps, 'isOpen' | 'appendTo'> & {
  'data-testid': string;
};

type OnModalClose<D = unknown> = (obj?: D) => void;

export type ComponentProps<D = unknown> = {
  onClose?: (event?: KeyboardEvent | React.MouseEvent, obj?: D) => void;
};

export type RawComponentProps<D = unknown> = ComponentProps<D> & { modalProps?: ModalProps };

export type ModalLauncher<Result = {}> = (onClose: OnModalClose<Result>) => React.ReactElement;

export const createRawModalLauncher =
  <D extends unknown, P extends ComponentProps<D>>(
    Component: React.ComponentType<P & { modalProps?: ModalProps }>,
    modalProps: ModalComponentProps,
  ) =>
  (componentProps?: P): ModalLauncher<D> =>
  (onModalClose) => {
    const { onClose, ...restModalProps } = modalProps;
    const handleClose = (event: KeyboardEvent | React.MouseEvent, obj?: any) => {
      onClose?.(event);
      onModalClose(obj);
    };

    return (
      <Component
        {...componentProps}
        modalProps={{
          'aria-label': 'modal',
          ...restModalProps,
          isOpen: true,
          onClose: handleClose,
          appendTo: () => document.querySelector('#hacDev-modal-container'),
        }}
        onClose={handleClose}
      />
    );
  };

export const createModalLauncher = <D extends unknown, P extends ComponentProps<D>>(
  Component: React.ComponentType<P>,
  inModalProps: ModalComponentProps,
) =>
  createRawModalLauncher(
    ({ modalProps, ...props }: P & { modalProps?: ModalProps }) => (
      <Modal {...modalProps}>
        <Component {...(props as any)} />
      </Modal>
    ),
    inModalProps,
  );
