import React from 'react';
import { TextVariants, Text, Button, Modal, TextContent } from '@patternfly/react-core';
import imageUrl from '../../imgs/application-overview.svg';
import { getModalContainer } from '../Modals/modal-utils';

export const HACBS_APPLICATION_MODAL_HIDE_KEY = 'showApplicationModal';

interface ApplicationModalProps {
  showApplicationModal: boolean;
  onClose: () => void;
}

const ApplicationModal: React.FC<ApplicationModalProps> = ({ showApplicationModal, onClose }) => {
  const footer = (
    <div className="pf-u-display-flex pf-u-justify-content-center pf-u-flex-fill">
      <Button data-test="application-modal-dismiss-btn" aria-label="get started" onClick={onClose}>
        Got it, thanks
      </Button>
    </div>
  );

  return (
    <Modal
      aria-label="application overview modal"
      width="fit-content"
      appendTo={getModalContainer()}
      footer={footer}
      isOpen={showApplicationModal}
      showClose={false}
    >
      <div className="pf-u-display-flex pf-u-justify-content-center pf-u-flex-fill">
        <img src={imageUrl} alt="application overview" />
      </div>
      <div
        className="pf-u-display-flex pf-u-justify-content-center pf-u-flex-fill pf-u-mt-md"
        data-test="application-modal-content"
      >
        <TextContent>
          <Text className="pf-u-text-align-center" component={TextVariants.h2}>
            Configure your application pipeline
          </Text>
          <div>Configure a pipeline in your app by adding these pieces.</div>
          <div>Click on a node to view details and to add more items.</div>
        </TextContent>
      </div>
    </Modal>
  );
};

export default ApplicationModal;
