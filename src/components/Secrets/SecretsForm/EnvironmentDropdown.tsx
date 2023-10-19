import React from 'react';
import { useField } from 'formik';
import { useEnvironments } from '../../../hooks/useEnvironments';
import { DropdownField } from '../../../shared';

type EnvironmentDropdownTypes = Omit<React.ComponentProps<typeof DropdownField>, 'items' | 'label'>;

export const EnvironmentDropdown: React.FC<React.PropsWithChildren<EnvironmentDropdownTypes>> = (
  props,
) => {
  const [environments, loaded] = useEnvironments();
  const [, , { setValue }] = useField<string>(props.name);

  const dropdownItems = React.useMemo(
    () => [
      { key: 'all-environments', value: 'All environments' },
      { key: 'separator', value: 'separator', separator: true },
      ...environments.map((a) => ({ key: a.metadata.name, value: a.metadata.name })),
    ],
    [environments],
  );

  return (
    <DropdownField
      {...props}
      label="Select environment"
      placeholder={!loaded ? 'Loading environments...' : 'All environments'}
      onChange={(environment: string) => setValue(environment)}
      items={dropdownItems}
    />
  );
};
