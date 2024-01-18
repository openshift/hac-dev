import React from 'react';
import { useField } from 'formik';
import { useApplications } from '../../../hooks/useApplications';
import { DropdownField } from '../../../shared';
import { useWorkspaceInfo } from '../../../utils/workspace-context-utils';

type ApplicationDropdownProps = Omit<
  React.ComponentProps<typeof DropdownField>,
  'items' | 'label' | 'placeholder'
>;

export const ApplicationDropdown: React.FC<React.PropsWithChildren<ApplicationDropdownProps>> = (
  props,
) => {
  const { namespace } = useWorkspaceInfo();
  const [applications, loaded] = useApplications(namespace);
  const [, , { setValue }] = useField<string>(props.name);

  const dropdownItems = React.useMemo(
    () => applications.map((a) => ({ key: a.metadata.name, value: a.metadata.name })),
    [applications],
  );

  return (
    <DropdownField
      {...props}
      label="Select application"
      placeholder={!loaded ? 'Loading applications...' : 'Select application'}
      isDisabled={props.isDisabled || !loaded}
      items={dropdownItems}
      onChange={(app: string) => setValue(app)}
    />
  );
};
