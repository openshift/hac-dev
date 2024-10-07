import React from 'react';
import { useField } from 'formik';
import { useSnapshots } from '../../../../hooks/useSnapshots';
import { DropdownField } from '../../../../shared';
import { useWorkspaceInfo } from '../../../../utils/workspace-context-utils';

type SnapshotDropdownProps = Omit<
  React.ComponentProps<typeof DropdownField>,
  'items' | 'label' | 'placeholder'
> & { applicationName: string };

export const SnapshotDropdown: React.FC<React.PropsWithChildren<SnapshotDropdownProps>> = (
  props,
) => {
  const { namespace } = useWorkspaceInfo();
  const [snapshots, loaded] = useSnapshots(namespace);
  const [, , { setValue }] = useField<string>(props.name);

  const filteredSnapshots = React.useMemo(
    () =>
      loaded && props.applicationName
        ? snapshots.filter((sn) => sn.spec?.application === props.applicationName)
        : snapshots,
    [loaded, props.applicationName, snapshots],
  );

  const dropdownItems = React.useMemo(
    () => filteredSnapshots.map((a) => ({ key: a.metadata.name, value: a.metadata.name })),
    [filteredSnapshots],
  );

  React.useEffect(() => {
    // Reset snapshot dropdown value when applicationName changes
    setValue('');
  }, [loaded, props.applicationName, setValue]);

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
