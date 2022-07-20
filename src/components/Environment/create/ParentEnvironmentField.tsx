import * as React from 'react';
import { useFormikContext } from 'formik';
import { useEnvironments } from '../../../hooks/useEnvironments';
import { DropdownField } from '../../../shared';

export const ParentEnvironmentField: React.FC = () => {
  const [environments, loaded] = useEnvironments();
  const { setFieldValue } = useFormikContext();

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
    (value: string) => {
      const env = dropdownItems.find((item) => item.value === value);
      setFieldValue('parentEnvironment', env?.key);
    },
    [dropdownItems, setFieldValue],
  );

  return dropdownItems?.length > 0 ? (
    <DropdownField
      label="Parent Environment"
      name="parentEnvironment"
      placeholder="Select environment..."
      items={dropdownItems}
      onChange={handleChange}
      helpText="Set the default continuous delivery order for your application"
    />
  ) : null;
};
