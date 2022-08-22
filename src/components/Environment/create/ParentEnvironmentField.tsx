import * as React from 'react';
import { useFormikContext } from 'formik';
import { useEnvironments } from '../../../hooks/useEnvironments';
import { DropdownField } from '../../../shared';
import { CreateEnvironmentFormValues } from './CreateEnvironmentForm';

export const ParentEnvironmentField: React.FC = () => {
  const [environments, loaded] = useEnvironments();
  const { values, setFieldValue } = useFormikContext<CreateEnvironmentFormValues>();

  const dropdownItems = React.useMemo(() => {
    if (loaded) {
      return environments?.map((env) => ({
        key: env.metadata.name,
        value: env.spec.displayName,
      }));
    }
    return [];
  }, [environments, loaded]);

  const handleChange = React.useCallback(
    (val: string) => {
      const env = dropdownItems.find((item) => item.value === val);
      setFieldValue('parentEnvironment', env?.key);
    },
    [dropdownItems, setFieldValue],
  );

  const value = dropdownItems.find((i) => i.key === values?.parentEnvironment)?.value;

  return dropdownItems?.length > 0 ? (
    <DropdownField
      label="Parent Environment"
      name="parentEnvironment"
      placeholder="Select environment..."
      items={dropdownItems}
      value={value}
      onChange={handleChange}
      helpText="Set the default continuous delivery order for your application"
      required
    />
  ) : null;
};
