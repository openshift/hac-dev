import React from 'react';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { WorkspaceRole } from '../../../types';

import './PermissionsTable.scss';

enum Permission {
  Create = 'Create',
  Read = 'Read',
  Update = 'Update',
  Delete = 'Delete',
  Everything = 'Everything',
}

// roles and permissions ADR: https://github.com/redhat-appstudio/book/blob/main/ADR/0011-roles-and-permissions.md
const permissions: Record<WorkspaceRole, Record<string, Permission[]>> = {
  contributor: {
    Application: [Permission.Read],
    Component: [Permission.Read],
    Environment: [Permission.Read],
    'Deployment Target': [Permission.Read],
    'Deployment Target Claim': [Permission.Read],
    GitOps: [Permission.Read],
    'Pipeline run': [Permission.Read],
    'Pipeline Results': [Permission.Read],
    'Integration Test Scenario': [Permission.Read],
    'Enterprise Contract': [Permission.Read],
    'Release Service': [Permission.Read],
    'JVM Build Service': [Permission.Read],
    'Service Access': [Permission.Read],
    'Build Service': [Permission.Read],
    Configs: [Permission.Read],
  },
  maintainer: {
    Application: [Permission.Create, Permission.Read, Permission.Update],
    Component: [Permission.Create, Permission.Read, Permission.Update],
    Environment: [Permission.Read],
    'Deployment Target': [Permission.Read],
    'Deployment Target Claim': [Permission.Read],
    GitOps: [Permission.Read],
    'Pipeline run': [Permission.Read],
    'Pipeline Results': [Permission.Read],
    'Integration Test Scenario': [
      Permission.Create,
      Permission.Read,
      Permission.Update,
      Permission.Delete,
    ],
    'Enterprise Contract': [Permission.Read],
    'Release Service': [Permission.Create, Permission.Read, Permission.Update, Permission.Delete],
    'JVM Build Service': [Permission.Create, Permission.Read, Permission.Update],
    'Service Access': [Permission.Create, Permission.Read, Permission.Update],
    'Build Service': [Permission.Create, Permission.Read],
    Configs: [Permission.Read],
  },
  admin: {
    Application: [Permission.Everything],
    Component: [Permission.Everything],
    Environment: [Permission.Everything],
    'Deployment Target': [Permission.Everything],
    'Deployment Target Claim': [Permission.Everything],
    GitOps: [Permission.Read],
    'Pipeline run': [Permission.Everything],
    'Pipeline Results': [Permission.Read],
    'Integration Test Scenario': [Permission.Everything],
    'Enterprise Contract': [Permission.Everything],
    'Release Service': [Permission.Everything],
    'JVM Build Service': [Permission.Everything],
    'Service Access': [Permission.Everything],
    'Build Service': [Permission.Everything],
    Configs: [Permission.Everything],
    Secrets: [Permission.Everything],
    'Exec to pods': [Permission.Create],
    'Space Binding Request': [Permission.Everything],
  },
};

export const PermissionsTable = React.memo<{ role: WorkspaceRole }>(({ role }) => {
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
