import * as React from 'react';
import { Button, Modal, ModalVariant, Title } from '@patternfly/react-core';
import classnames from 'classnames';
import { useLocalStorage } from '../../hooks';

type GettingStartedModalProps = {
  imgClassName?: string;
  localStorageKey: string;
  title: string;
  imgSrc?: string;
  imgAlt?: string;
};

const LOCAL_STORAGE_KEY = 'getting-started-modal';

export const GettingStartedModal: React.FC<GettingStartedModalProps> = ({
  imgClassName,
  localStorageKey,
  title,
  imgSrc,
  imgAlt,
  children,
}) => {
  const [storageKeys, setStorageKeys] =
    useLocalStorage<{ [key: string]: boolean }>(LOCAL_STORAGE_KEY);

  const keys = storageKeys && typeof storageKeys === 'object' ? storageKeys : {};
  const isDismissed = keys[localStorageKey];

  const header = (
    <>
      {imgSrc && (
        <div
          className={classnames(
            'pf-u-display-flex pf-u-justify-content-center pf-u-flex-fill',
            imgClassName,
          )}
        >
          <img src={imgSrc} alt={imgAlt} />
        </div>
      )}
      <Title className="pf-u-text-align-center" headingLevel="h3">
        {title}
      </Title>
    </>
  );

  const footer = (
    <div className="pf-u-display-flex pf-u-justify-content-center pf-u-flex-fill">
      <Button
        aria-label="get started"
        onClick={() => setStorageKeys({ ...keys, [localStorageKey]: true })}
      >
        Get started
      </Button>
    </div>
  );

  return (
    <Modal
      aria-label="getting-started-modal"
      variant={ModalVariant.small}
      appendTo={document.querySelector('#hacDev-modal-container') as HTMLElement}
      header={header}
      footer={footer}
      isOpen={!isDismissed}
      showClose={false}
    >
      <div className="pf-u-text-align-center">{children}</div>
    </Modal>
  );
};
