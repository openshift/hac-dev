import * as React from 'react';
import { useFormikContext } from 'formik';
import { DropdownField } from '../../shared';
import { DropdownItemObject } from '../../shared/components/dropdown/BasicDropdown';
import { SecretFormValues, SecretTypeDropdownLabel } from '../../types';

type SecretTypeSelectorProps = {
  onChange: (type: string) => void;
  isDisabled?: boolean;
  dropdownItems: DropdownItemObject[];
};

const SecretTypeSelector: React.FC<SecretTypeSelectorProps> = ({
  onChange,
  isDisabled,
  dropdownItems,
}) => {
  const { values, setFieldValue, setFieldTouched } = useFormikContext<SecretFormValues>();

  const setValues = React.useCallback(
    (type: SecretTypeDropdownLabel) => {
      setFieldValue('type', type);
      setFieldTouched('type', true);
      onChange && onChange(type);
    },
    [onChange, setFieldValue, setFieldTouched],
  );
  const title =
    dropdownItems.find(({ value }) => value === values.type)?.value || dropdownItems[0]?.value;

  return (
    <DropdownField
      name="type"
      label="Secret type"
      data-testid="secret-type-selector"
      helpText="Tell us the secret type you want to add"
      items={dropdownItems}
      title={title}
      onChange={(type: SecretTypeDropdownLabel) => setValues(type)}
      isDisabled={isDisabled}
      fullWidth
      required
    />
  );
};
export default SecretTypeSelector;
