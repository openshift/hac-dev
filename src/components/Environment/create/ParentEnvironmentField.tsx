import * as React from 'react';
import { useFormikContext } from 'formik';
import { useSortedEnvironments } from '../../../hooks/useEnvironments';
import { DropdownField } from '../../../shared';
import { CreateEnvironmentFormValues } from './CreateEnvironmentForm';

export const ParentEnvironmentField: React.FC = () => {
  const [environments, loaded] = useSortedEnvironments();
  const { values, setFieldValue } = useFormikContext<CreateEnvironmentFormValues>();

  const dropdownItems = React.useMemo(() => {
    if (loaded) {
      const envNames = environments?.map((env) => env.spec.displayName);
      return environments?.map((env, index) => {
        const envOrder = [...envNames.slice(0, index + 1), '[new]', ...envNames.slice(index + 1)];
        const envOrderValue = `#${index + 2} ${envOrder.join(' \u2192 ')}`;
        return {
          key: env.metadata.name,
          value: envOrderValue,
        };
      });
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
      label="Order in continuous delivery"
      name="parentEnvironment"
      placeholder="Select order"
      items={dropdownItems}
      value={value}
      onChange={handleChange}
      helpText="The order of this environment in the continuous delivery of your application"
      required
    />
  ) : null;
};
