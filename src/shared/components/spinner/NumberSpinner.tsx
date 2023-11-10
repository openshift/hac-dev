import React from 'react';
import { useTranslation } from 'react-i18next';
import { NumberInput } from '@patternfly/react-core';

type NumberSpinnerProps = {
  value: number;
  className?: string;
  changeValueBy: (operation: number) => void;
  min?: number;
} & React.HTMLProps<HTMLInputElement>;

const NumberSpinner: React.FC<React.PropsWithChildren<NumberSpinnerProps>> = ({
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
        inputName={inputProps.name}
        className={className}
        minusBtnAriaLabel={t('public~Decrement')}
        plusBtnAriaLabel={t('public~Increment')}
        isDisabled={inputProps.disabled}
      />
    </div>
  );
};

export default NumberSpinner;
