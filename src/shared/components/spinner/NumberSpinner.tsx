import React from 'react';
import { NumberInput } from '@patternfly/react-core';
import { useTranslation } from 'react-i18next';

type NumberSpinnerProps = {
  value: number;
  className?: string;
  changeValueBy: (operation: number) => void;
  min?: number;
} & React.HTMLProps<HTMLInputElement>;

const NumberSpinner: React.FC<NumberSpinnerProps> = ({
  className,
  changeValueBy,
  min,
  value,
  ...inputProps
}) => {
  const { t } = useTranslation();

  return (
    <div className="hacDev-m-number-spinner">
      <NumberInput
        min={min}
        value={value}
        onMinus={() => changeValueBy(-1)}
        onChange={inputProps.onChange}
        onPlus={() => changeValueBy(1)}
        inputProps={{ ...inputProps }}
        className={className}
        minusBtnAriaLabel={t('public~Decrement')}
        plusBtnAriaLabel={t('public~Increment')}
        isDisabled={inputProps.disabled}
      />
    </div>
  );
};

export default NumberSpinner;
