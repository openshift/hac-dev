import * as React from 'react';
import { NumberInput } from '@patternfly/react-core';

export const NumberSpinner: React.FC<NumberSpinnerProps> = ({
  className,
  changeValueBy,
  min,
  value,
  ...inputProps
}) => {
  return (
    <NumberInput
      min={min}
      value={value}
      allowEmptyInput
      onMinus={() => changeValueBy(-1)}
      onChange={inputProps.onChange}
      onPlus={() => changeValueBy(1)}
      inputProps={{ ...inputProps }}
      inputName={inputProps.name}
      className={className}
      minusBtnAriaLabel={'Decrement'}
      plusBtnAriaLabel={'Increment'}
      isDisabled={inputProps.disabled}
    />
  );
};

type NumberSpinnerProps = {
  value: number;
  className?: string;
  changeValueBy: (operation: number) => void;
  min?: number;
} & React.HTMLProps<HTMLInputElement>;
