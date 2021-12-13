import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@patternfly/react-core';
import { PlusCircleIcon } from '@patternfly/react-icons/dist/js/icons/plus-circle-icon';

export interface MultiColumnFieldHeader {
  addLabel?: string;
  onAdd: () => void;
  disableAddRow?: boolean;
}

const MultiColumnFieldFooter: React.FC<MultiColumnFieldHeader> = ({
  addLabel,
  onAdd,
  disableAddRow = false,
}) => {
  const { t } = useTranslation();
  return (
    <Button
      data-test={'add-action'}
      variant="link"
      isDisabled={disableAddRow}
      onClick={onAdd}
      icon={<PlusCircleIcon />}
      isInline
    >
      {addLabel || t('console-shared~Add values')}
    </Button>
  );
};

export default MultiColumnFieldFooter;
