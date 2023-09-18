import React from 'react';
import { useField } from 'formik';
import { useComponents } from '../../../hooks/useComponents';
import { DropdownField } from '../../../shared';
import { useWorkspaceInfo } from '../../../utils/workspace-context-utils';

type ComponentDropdownProps = Omit<React.ComponentProps<typeof DropdownField>, 'items' | 'label'>;

export const ComponentDropdown: React.FC<ComponentDropdownProps> = (props) => {
  const { namespace } = useWorkspaceInfo();
  const [{ value: application }] = useField<string>('targets.application');
  const [, , { setValue, setTouched }] = useField<string>(props.name);
  const [components, loaded] = useComponents(namespace, application);

  const dropdownItems = React.useMemo(
    () => [
      { key: 'all-components', value: 'All components' },
      { key: 'separator', value: 'separator', separator: true },
      ...components.map((a) => ({ key: a.metadata.name, value: a.metadata.name })),
    ],
    [components],
  );

  return (
    <DropdownField
      {...props}
      label="Select component"
      placeholder={!loaded ? 'Loading components...' : 'All components'}
      onChange={(component: string) => {
        setValue(component, true);
        setTouched(true);
      }}
      items={dropdownItems}
      isDisabled={!application}
    />
  );
};
