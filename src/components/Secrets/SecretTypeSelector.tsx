import * as React from 'react';
import { useFormikContext } from 'formik';
import { DropdownField } from '../../shared';
import { DropdownItemObject } from '../../shared/components/dropdown/BasicDropdown';
import { SecretFormValues, SecretType } from '../../types';

type SecretTypeSelectorProps = {
  onChange: (type: string) => void;
};

const dropdownItems: DropdownItemObject[] = Object.entries(SecretType).map(([key, value]) => {
  return { key, value };
});

const SecretTypeSelector: React.FC<SecretTypeSelectorProps> = ({ onChange }) => {
  const { values, setFieldValue } = useFormikContext<SecretFormValues>();

  const setValues = React.useCallback(
    (type: SecretType) => {
      setFieldValue('type', type);
      onChange && onChange(type);
    },
    [onChange, setFieldValue],
  );

  return (
    <DropdownField
      name="type"
      label="Secret type"
      items={dropdownItems}
      title={dropdownItems.find(({ value }) => value === values.type).value}
      onChange={(type: SecretType) => setValues(type)}
      fullWidth
      required
    />
  );
};
export default SecretTypeSelector;
