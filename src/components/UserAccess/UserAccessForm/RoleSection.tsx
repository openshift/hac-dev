import React from 'react';
import { ExpandableSection, FormSection } from '@patternfly/react-core';
import { useField } from 'formik';
import HelpPopover from '../../../components/HelpPopover';
import { DropdownField } from '../../../shared';
import { WorkspaceRole } from '../../../types';
import { PermissionsTable } from './PermissionsTable';

import './RoleSection.scss';

const dropdownItems = [
  { key: 'contributor', value: 'contributor' },
  { key: 'maintainer', value: 'maintainer' },
  { key: 'admin', value: 'admin' },
];

export const RoleSection: React.FC = () => {
  const [{ value: role }] = useField<WorkspaceRole>('role');

  return (
    <>
      <FormSection title="Assign role">
        <DropdownField
          className="role-section"
          name="role"
          placeholder="Select role"
          label="Select a role to assign to all of the users you added."
          helpText="Provides access to all permissions except the ability to add or delete certain resources. To view a full list of permissions, refer to the following table."
          data-testid="role-input"
          labelIcon={
            <HelpPopover
              aria-label="Usernames in RHTAP"
              headerContent="About default roles and permissions"
              bodyContent="At this time we do not offer custom roles. You can only assign the default roles."
            />
          }
          items={dropdownItems}
          validateOnChange
          required
        />
      </FormSection>

      {role && (
        <ExpandableSection toggleText={`Show list of permissions for the ${role}`}>
          <PermissionsTable role={role} />
        </ExpandableSection>
      )}
    </>
  );
};
