import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@patternfly/react-core';
import { CloseIcon } from '@patternfly/react-icons/dist/js/icons/close-icon';
import classNames from 'classnames';
import './CloseButton.scss';

type CloseButtonProps = {
  additionalClassName?: string;
  ariaLabel?: string;
  dataTestID?: string;
  onClick: (e: any) => void;
};

const CloseButton: React.FC<React.PropsWithChildren<CloseButtonProps>> = ({
  additionalClassName,
  ariaLabel,
  dataTestID,
  onClick,
}) => {
  const { t } = useTranslation();
  return (
    <Button
      aria-label={ariaLabel || t('hac-shared~Close')}
      className={classNames('close-button', additionalClassName)}
      data-test={dataTestID}
      onClick={onClick}
      variant="plain"
    >
      <CloseIcon />
    </Button>
  );
};

export default CloseButton;
