import React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { useField } from 'formik';
import { ComponentGroupVersionKind } from '../../../../../models';
import { DropdownField } from '../../../../../shared';
import { ComponentKind, TargetDropdownDefaults } from '../../../../../types';
import { useWorkspaceInfo } from '../../../../../utils/workspace-context-utils';

type CVEComponentDropDownProps = Omit<
  React.ComponentProps<typeof DropdownField>,
  'items' | 'label'
>;

export const CVEComponentDropDown: React.FC<React.PropsWithChildren<CVEComponentDropDownProps>> = ({
  name,
}) => {
  const { namespace } = useWorkspaceInfo();
  const [, , { setValue, setTouched }] = useField<string>(name);
  const [components, componentsLoaded] = useK8sWatchResource<ComponentKind[]>(
    namespace
      ? {
          groupVersionKind: ComponentGroupVersionKind,
          namespace,
          isList: true,
        }
      : null,
  );

  const dropdownItems = React.useMemo(
    () => [
      { key: 'all-components', value: TargetDropdownDefaults.ALL_COMPONENTS },
      { key: 'separator', value: 'separator', separator: true },
      ...components.map((a) => ({ key: a.metadata.name, value: a.metadata.name })),
    ],
    [components],
  );

  return (
    <DropdownField
      name={name}
      label="Select component"
      placeholder={
        !componentsLoaded ? 'Loading components...' : TargetDropdownDefaults.ALL_COMPONENTS
      }
      onChange={(component: string) => {
        setValue(component, true);
        setTouched(true);
      }}
      items={dropdownItems}
    />
  );
};
