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
  const [releasePlans, loaded] = useReleasePlans(namespace);
  const [, , { setValue }] = useField<string>(props.name);

  const dropdownItems = React.useMemo(
    () => releasePlans.map((a) => ({ key: a.metadata.name, value: a.metadata.name })),
    [releasePlans],
  );

  return (
    <DropdownField
      {...props}
      label="Release plan"
      placeholder={!loaded ? 'Loading release plans...' : 'Select release plan'}
      isDisabled={props.isDisabled || !loaded}
      items={dropdownItems}
      onChange={(app: string) => setValue(app)}
    />
  );
};
