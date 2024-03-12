import * as React from 'react';
import { useField } from 'formik';
import { DropdownField } from '../../../../../shared';

const dropdownItems = [
  { key: 'inProgress', value: 'In progress' },
  { key: 'closed', value: 'Closed' },
  { key: 'resolved', value: 'Resolved' },
];

type StatusDropdownProps = Omit<
  React.ComponentProps<typeof DropdownField>,
  'items' | 'label' | 'placeholder'
>;

const StatusDropdown: React.FC<React.PropsWithChildren<StatusDropdownProps>> = (props) => {
  const [, , { setValue }] = useField<string>(props.name);

  return (
    <DropdownField
      {...props}
      label="Release plan"
      placeholder="Select status of bug"
      items={dropdownItems}
      onChange={(app: string) => setValue(app)}
    />
  );
};

export default StatusDropdown;
