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
    <Title className="pf-v5-u-text-align-center" headingLevel="h2">
      Getting started with Commit view
    </Title>
  );

  const body = (
    <>
      <div className="pf-v5-u-display-flex pf-v5-u-justify-content-center pf-v5-u-flex-fill">
        <img src={imageUrl} alt="getting started with commits" />
      </div>
      <Text className="pf-v5-u-text-align-left pf-v5-u-mt-md">
        View Commit activity, triggered pipelines and environment deployment in a single view.
        <br />
        Each node represents a github action, pipeline or an environment.
        <br />
        Click on nodes to view more details.
      </Text>
    </>
  );
  const footer = (
    <div className="pf-v5-u-display-flex pf-v5-u-justify-content-center pf-v5-u-flex-fill">
      <Button data-testid="getting-started-modal-dismiss" aria-label="get started" onClick={onHide}>
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
      data-testid="getting-started-modal"
    >
      <div className="pf-v5-u-text-align-center">{body}</div>
    </Modal>
  );
};

export default CommitsGettingStartedModal;
