import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Level, LevelItem } from '@patternfly/react-core';
import { ContextMenuItem, ContextSwitcher } from '../ContextSwitcher';

// temporary mock data
// https://docs.google.com/document/d/1aosYWMnUf45McWPLWWfqce_To4amRZA35mYzEPHq51w/edit
// https://redhat-internal.slack.com/archives/C02EQERSV3N/p1675373086126109
const WS_DATA = {
  apiVersion: 'toolchain.dev.openshift.com/v1alpha1',
  kind: 'WorkspaceList',
  metadata: {
    resourceVersion: '',
  },
  items: [
    {
      apiVersion: 'toolchain.dev.openshift.com/v1alpha1',
      kind: 'Workspace',
      metadata: {
        name: 'myworkspace',
        namespace: 'toolchain-host-operator',
      },
      status: {
        namespaces: [
          {
            name: 'myworkspace-tenant',
          },
          {
            name: 'myworkspace-extra',
          },
        ],
        owner: 'john',
        role: 'admin',
      },
    },
  ],
};

export const WorkspaceSwitcher: React.FC<{ selectedWorkspace?: string }> = ({
  selectedWorkspace,
}) => {
  const navigate = useNavigate();
  const workspaces = WS_DATA.items;

  const menuItems = React.useMemo(
    () => workspaces?.map((app) => ({ key: app.metadata.name, name: app.metadata.name })) || [],
    [workspaces],
  );
  const selectedItem = workspaces.find((item) => item.metadata.name === selectedWorkspace);

  const onSelect = (item: ContextMenuItem) => {
    // todo
    selectedItem.metadata.name !== item.key && navigate('#');
  };

  return workspaces.length > 0 ? (
    <ContextSwitcher
      resourceType="workspace"
      menuItems={menuItems}
      selectedItem={{ key: selectedItem.metadata.name, name: selectedItem.metadata.name }}
      onSelect={onSelect}
      footer={
        <Level>
          <LevelItem>
            <Link to="#">View workspaces list</Link>
          </LevelItem>
        </Level>
      }
    />
  ) : null;
};
