import * as React from 'react';
import { Button, Modal, Text, Title } from '@patternfly/react-core';
import imageUrl from '../../imgs/commit-getting-started.svg';

type CommitsGettingStartedModalProps = {
  shown: boolean;
  onHide: () => void;
};

const CommitsGettingStartedModal: React.FC<CommitsGettingStartedModalProps> = ({
  shown,
  onHide,
}) => {
  const header = (
    <Title className="pf-u-text-align-center" headingLevel="h2">
      Getting started with Commit view
    </Title>
  );

  const body = (
    <>
      <div className="pf-u-display-flex pf-u-justify-content-center pf-u-flex-fill">
        <img src={imageUrl} alt="getting started with commits" />
      </div>
      <Text className="pf-u-text-align-left pf-u-mt-md">
        View Commit activity, triggered pipelines and environment deployment in a single view.
        <br />
        Each node represents a github action, pipeline or an environment.
        <br />
        Click on nodes to view more details.
      </Text>
    </>
  );
  const footer = (
    <div className="pf-u-display-flex pf-u-justify-content-center pf-u-flex-fill">
      <Button
        data-testid="hacbs-getting-started-modal-dismiss"
        aria-label="get started"
        onClick={onHide}
      >
        Got it, thanks
      </Button>
    </div>
  );

  return (
    <Modal
      aria-label="commits-getting-started-modal"
      width="fit-content"
      appendTo={document.querySelector('#hacDev-modal-container') as HTMLElement}
      header={header}
      footer={footer}
      isOpen={shown}
      showClose={false}
      data-testid="hacbs-getting-started-modal"
    >
      <div className="pf-u-text-align-center">{body}</div>
    </Modal>
  );
};

export default CommitsGettingStartedModal;
