import React from 'react';
import { useField } from 'formik';
import { useSnapshots } from '../../../../hooks/useSnapshots';
import { DropdownField } from '../../../../shared';
import { useWorkspaceInfo } from '../../../../utils/workspace-context-utils';

type SnapshotDropdownProps = Omit<
  React.ComponentProps<typeof DropdownField>,
  'items' | 'label' | 'placeholder'
>;

export const SnapshotDropdown: React.FC<React.PropsWithChildren<SnapshotDropdownProps>> = (
  props,
) => {
  const { namespace } = useWorkspaceInfo();
  const [applications, loaded] = useSnapshots(namespace);
  const [, , { setValue }] = useField<string>(props.name);

  const dropdownItems = React.useMemo(
    () => applications.map((a) => ({ key: a.metadata.name, value: a.metadata.name })),
    [applications],
  );

  return (
    <DropdownField
      {...props}
      label="Snapshot"
      placeholder={!loaded ? 'Loading snapshots...' : 'Select snapshot'}
      isDisabled={props.isDisabled || !loaded}
      items={dropdownItems}
      onChange={(app: string) => setValue(app)}
    />
  );
};
