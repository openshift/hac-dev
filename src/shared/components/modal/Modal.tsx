import * as React from 'react';
import { Modal as PfModal, ModalProps as PfModalProps } from '@patternfly/react-core';
import cx from 'classnames';
import './Modal.scss';

type ModalProps = {
  isFullScreen?: boolean;
  ref?: React.LegacyRef<PfModal>;
} & PfModalProps;

const Modal: React.FC<React.PropsWithChildren<ModalProps>> = ({
  isFullScreen = false,
  className,
  ...props
}) => (
  <PfModal
    {...props}
    className={cx('modal', className)}
    appendTo={() => (isFullScreen ? document.body : document.querySelector('#modal-container'))}
  />
);

export default Modal;
