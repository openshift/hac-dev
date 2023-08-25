import React from 'react';
import { useApplications } from '../../../hooks/useApplications';
import { DropdownField } from '../../../shared';
import { LoadingBox } from '../../../shared/components/status-box/StatusBox';
import { useWorkspaceInfo } from '../../../utils/workspace-context-utils';

type ApplicationDropdownProps = Omit<
  React.ComponentProps<typeof DropdownField>,
  'items' | 'label' | 'placeholder'
>;

export const ApplicationDropdown: React.FC<ApplicationDropdownProps> = (props) => {
  const { namespace } = useWorkspaceInfo();
  const [applications, loaded] = useApplications(namespace);

  const dropdownItems = React.useMemo(
    () => applications.map((a) => ({ key: a.metadata.name, value: a.metadata.name })),
    [applications],
  );

  if (!loaded) {
    return <LoadingBox />;
  }

  return (
    <DropdownField
      {...props}
      label="Select application"
      placeholder="Select application"
      items={dropdownItems}
    />
  );
};
