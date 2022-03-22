import * as React from 'react';
import { Modal, ModalVariant } from '@patternfly/react-core';
import { ComponentKind } from '../../types';
import { BuildLogViewer } from './BuildLogViewer';

import './ComponentLogViewerModal.scss';

type ComponentLogViewerModalProps = {
  component: ComponentKind;
  isOpen: boolean;
  onClose: () => void;
};

export const ComponentLogViewerModal: React.FC<ComponentLogViewerModalProps> = ({
  component,
  isOpen,
  onClose,
}) => {
  return (
    <Modal
      data-testId="component-log-viewer-modal"
      className="hacDev hacDev-log-viewer-modal"
      isOpen={!!isOpen}
      variant={ModalVariant.large}
      onClose={onClose}
      title="View build logs"
    >
      {component && <BuildLogViewer component={component} />}
    </Modal>
  );
};
