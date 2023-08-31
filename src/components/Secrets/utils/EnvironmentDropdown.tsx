import React from 'react';
import { useEnvironments } from '../../../hooks/useEnvironments';
import { DropdownField } from '../../../shared';
import { LoadingBox } from '../../../shared/components/status-box/StatusBox';

type EnvironmentDropdownTypes = Omit<React.ComponentProps<typeof DropdownField>, 'items' | 'label'>;

export const EnvironmentDropdown: React.FC<EnvironmentDropdownTypes> = (props) => {
  const [environments, loaded] = useEnvironments();

  const dropdownItems = React.useMemo(
    () => [
      { key: 'all-environments', value: 'All environments' },
      { key: 'separator', value: 'separator', separator: true },
      ...environments.map((a) => ({ key: a.metadata.name, value: a.metadata.name })),
    ],
    [environments],
  );

  if (!loaded) {
    return <LoadingBox />;
  }

  return <DropdownField {...props} label="Select environemnt" items={dropdownItems} />;
};
