import * as React from 'react';
import { DropdownField } from '../components';
import { NumberSpinner } from './number-spinner';

export const RequestSizeInput: React.FC<RequestSizeInputProps> = ({
  children,
  defaultRequestSizeUnit,
  defaultRequestSizeValue,
  describedBy,
  dropdownUnits,
  inputID,
  isInputDisabled,
  minValue,
  maxValue,
  name,
  onChange,
  placeholder,
  required,
  testID,
}) => {
  const parsedRequestSizeValue = parseInt(defaultRequestSizeValue, 10);
  const defaultValue = Number.isFinite(parsedRequestSizeValue) ? parsedRequestSizeValue : null;
  const [unit, setUnit] = React.useState<string>(defaultRequestSizeUnit);
  const [value, setValue] = React.useState<number>(defaultValue);
  const items = React.useMemo(
    () => Object.entries(dropdownUnits).map(([k, v]) => ({ key: k, value: v })),
    [dropdownUnits],
  );

  const onValueChange: React.ReactEventHandler<HTMLInputElement> = (event) => {
    const val = parseInt(event.currentTarget.value, 10);
    setValue(val);
    onChange({ value: val, unit });
  };

  const changeValueBy = (changeBy: number) => {
    // When default defaultRequestSizeValue is not set, value becomes NaN and increment decrement buttons of NumberSpinner don't work.
    const newValue = Number.isFinite(value) ? value + changeBy : 0 + changeBy;
    setValue(newValue);
    onChange({ value: newValue, unit });
  };

  const onUnitChange = (newUnit: string) => {
    setUnit(newUnit);
    onChange({ value, unit: newUnit });
  };

  React.useEffect(() => {
    setUnit(defaultRequestSizeUnit);
    setValue(defaultValue);
  }, [defaultRequestSizeUnit, defaultValue]);

  const inputName = `${name}Value`;
  const dropdownName = `${name}Unit`;
  return (
    <div>
      <div className="pf-c-input-group">
        <NumberSpinner
          onChange={onValueChange}
          changeValueBy={changeValueBy}
          placeholder={placeholder}
          aria-describedby={describedBy}
          name={inputName}
          id={inputID}
          data-test={testID}
          required={required}
          value={value}
          min={minValue}
          max={maxValue}
          disabled={isInputDisabled}
        />
        <DropdownField
          title={dropdownUnits[defaultRequestSizeUnit]}
          selectedKey={defaultRequestSizeUnit}
          name={dropdownName}
          items={items}
          onChange={onUnitChange}
          disabled={isInputDisabled}
          required={required}
        />
      </div>
      {children}
    </div>
  );
};

export type RequestSizeInputProps = {
  placeholder?: string;
  name: string;
  onChange: (item: { value: number; unit: string }) => void;
  required?: boolean;
  dropdownUnits: object;
  defaultRequestSizeUnit: string;
  defaultRequestSizeValue: string;
  describedBy?: string;
  step?: number;
  minValue?: number;
  maxValue?: number;
  inputID?: string;
  testID?: string;
  isInputDisabled?: boolean;
};
