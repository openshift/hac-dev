import * as React from 'react';
import { DropdownField } from '../../shared';

export const WorkspaceField = () => {
  /**
   * TODO: make api call to fetch all the workspaces and populate the dropdown
   */
  return (
    <DropdownField
      name="workspace"
      label="Workspace"
      items={[
        { key: 'Purple_workspace', value: 'Purple_workspace' },
        { key: 'red_workspace', value: 'red_workspace' },
        { key: 'green_workspace', value: 'green_workspace' },
        { key: 'white_workspace', value: 'white_workspace' },
      ]}
      required
    />
  );
};
