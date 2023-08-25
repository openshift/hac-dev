import React from 'react';
import { useField } from 'formik';
import { useComponents } from '../../../hooks/useComponents';
import { DropdownField } from '../../../shared';
import { LoadingBox } from '../../../shared/components/status-box/StatusBox';
import { useWorkspaceInfo } from '../../../utils/workspace-context-utils';

type ComponentDropdownProps = Omit<React.ComponentProps<typeof DropdownField>, 'items' | 'label'>;

export const ComponentDropdown: React.FC<ComponentDropdownProps> = (props) => {
  const { namespace } = useWorkspaceInfo();
  const [{ value: application }] = useField<string>('application');
  const [components, loaded] = useComponents(namespace, application);

  const dropdownItems = React.useMemo(
    () => [
      { key: 'all-components', value: 'All components' },
      { key: 'separator', value: 'separator', separator: true },
      ...components.map((a) => ({ key: a.metadata.name, value: a.metadata.name })),
    ],
    [components],
  );

  if (!loaded) {
    return <LoadingBox />;
  }

  return (
    <DropdownField
      {...props}
      label="Select component"
      items={dropdownItems}
      isDisabled={!application}
    />
  );
};
