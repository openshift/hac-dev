import * as React from 'react';
import { useField } from 'formik';
import { DropdownField } from '../../../../../shared';

const dropdownItems = [
  { key: 'unresolved', value: 'Unresolved' },
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
      label="Status"
      placeholder="Select status of isssue"
      items={dropdownItems}
      onChange={(app: string) => setValue(app)}
    />
  );
};

export default StatusDropdown;
