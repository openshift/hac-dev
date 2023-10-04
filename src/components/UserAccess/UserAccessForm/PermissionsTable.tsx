import React from 'react';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { Role } from './form-utils';

import './PermissionsTable.scss';

enum Permission {
  Create = 'Create',
  Read = 'Read',
  Update = 'Update',
  Delete = 'Delete',
  Everything = 'Everything',
}

// roles and permissions ADR: https://github.com/redhat-appstudio/book/blob/main/ADR/0011-roles-and-permissions.md
const permissions: Record<Role, Record<string, Permission[]>> = {
  contributor: {
    Workspace: [Permission.Read],
    Application: [Permission.Read],
    Component: [Permission.Read],
    Environment: [Permission.Read],
    'Pipeline run': [Permission.Create, Permission.Read],
    'Integration Test Scenario': [Permission.Read],
    'Enterprise Contract': [Permission.Read],
    'Release Strategy': [Permission.Read],
    'Release Plan Admission': [Permission.Read],
    'User (Add user to workspace)': [Permission.Read],
    'Update user group (Including SSO)': [Permission.Read],
  },
  maintainer: {
    Workspace: [Permission.Update],
    Application: [Permission.Update],
    Component: [Permission.Update],
    Environment: [Permission.Create, Permission.Update, Permission.Delete],
    'Pipeline run': [Permission.Create, Permission.Update, Permission.Delete],
    'Integration Test Scenario': [Permission.Create, Permission.Update, Permission.Delete],
    'Enterprise Contract': [Permission.Read],
    'Release Strategy': [Permission.Create, Permission.Update, Permission.Delete],
    'Release Plan Admission': [Permission.Create, Permission.Update, Permission.Delete],
    'User (Add user to workspace)': [Permission.Create, Permission.Update, Permission.Delete],
    'Update user group (Including SSO)': [Permission.Update, Permission.Delete],
  },
  owner: {
    Workspace: [Permission.Everything],
    Application: [Permission.Everything],
    Component: [Permission.Everything],
    Environment: [Permission.Everything],
    'Pipeline run': [Permission.Everything],
    'Integration Test Scenario': [Permission.Everything],
    'Enterprise Contract': [Permission.Read],
    'Release Strategy': [Permission.Everything],
    'Release Plan Admission': [Permission.Everything],
    'User (Add user to workspace)': [Permission.Everything],
    'Update user group (Including SSO)': [Permission.Everything],
  },
};

export const PermissionsTable = React.memo<{ role: Role }>(({ role }) => {
  const rolePermissions = permissions[role];

  return (
    <Table aria-label="List of permissions" variant="compact" className="permissions-table">
      <Thead>
        <Tr>
          <Th>Permissions for</Th>
          <Th>Access type</Th>
        </Tr>
      </Thead>
      <Tbody>
        {Object.keys(rolePermissions).map((key) => {
          const perms = rolePermissions[key];
          return (
            <Tr key={key}>
              <Td>{key}</Td>
              {perms.length === 1 ? (
                <Td>{perms[0]}</Td>
              ) : (
                <Td>{`${perms.slice(0, perms.length - 1).join(', ')} and ${
                  perms[perms.length - 1]
                }`}</Td>
              )}
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
});
