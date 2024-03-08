import React from 'react';
import { useField } from 'formik';
import { useReleasePlans } from '../../../../hooks/useReleasePlans';
import { DropdownField } from '../../../../shared';
import { useWorkspaceInfo } from '../../../../utils/workspace-context-utils';

type ReleasePlanDropdownProps = Omit<
  React.ComponentProps<typeof DropdownField>,
  'items' | 'label' | 'placeholder'
>;

export const ReleasePlanDropdown: React.FC<React.PropsWithChildren<ReleasePlanDropdownProps>> = (
  props,
) => {
  const { namespace } = useWorkspaceInfo();
  const [applications, loaded] = useReleasePlans(namespace);
  const [, , { setValue }] = useField<string>(props.name);

  const dropdownItems = React.useMemo(
    () => applications.map((a) => ({ key: a.metadata.name, value: a.metadata.name })),
    [applications],
  );

  return (
    <DropdownField
      {...props}
      label="Release plan"
      placeholder={!loaded ? 'Loading releases...' : 'Select release'}
      isDisabled={props.isDisabled || !loaded}
      items={dropdownItems}
      onChange={(app: string) => setValue(app)}
    />
  );
};
