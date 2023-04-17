import * as React from 'react';
import { Nav, NavExpandable, NavItem, NavList } from '@patternfly/react-core';

export type PodContainerData = {
  image: string;
  name: string;
};

export type ContainerNavListProps = {
  initContainers: PodContainerData[];
  containers: PodContainerData[];
  selectedContainer: PodContainerData;
  onChange: () => void;
};

export const ContainerNavList = ({ initContainers, containers, selectedContainer, onChange }) => {
  const navGroups = { initContainers: 'initContainers', containers: 'containers' };
  const [selected, setSelected] = React.useState(selectedContainer.name);
  const [activeGroup, setActiveGroup] = React.useState(navGroups.containers);

  const setActiveItem = (container, group) => {
    if (selected !== container.name) {
      setSelected(container.name);
    }
    if (selectedContainer.name !== container.name) {
      onChange(container);
    }
    if (activeGroup !== group) {
      setActiveGroup(group);
    }
  };

  const isContainerPresent = containers && Array.isArray(containers) && containers.length > 0;

  const isInitContainerPresent =
    initContainers && Array.isArray(initContainers) && initContainers.length > 0;

  if (!isContainerPresent && isContainerPresent && activeGroup === navGroups.containers) {
    setActiveGroup(navGroups.initContainers);
  }

  return (
    <div className="pod-logs__containerlist" data-testid="logs-containerlist">
      {isInitContainerPresent || isContainerPresent ? (
        <Nav theme="light">
          <NavList className="pod-logs__nav">
            {isInitContainerPresent && (
              <NavExpandable
                title={navGroups.initContainers}
                groupId={`grp-${navGroups.initContainers}`}
                isActive={activeGroup === navGroups.initContainers}
                isExpanded
              >
                {initContainers.map((container) => (
                  <NavItem
                    preventDefault
                    key={`initcontainer-${container.name}`}
                    isActive={selected === container.name}
                    onClick={() => setActiveItem(container, navGroups.initContainers)}
                  >
                    {container.name}
                  </NavItem>
                ))}
              </NavExpandable>
            )}
            {isContainerPresent && (
              <NavExpandable
                title={navGroups.containers}
                groupId={`grp-${navGroups.containers}`}
                isActive={activeGroup === navGroups.containers}
                isExpanded
              >
                {containers.map((container) => (
                  <NavItem
                    preventDefault
                    key={`container-${container.name}`}
                    isActive={selected === container.name}
                    onClick={() => setActiveItem(container, navGroups.containers)}
                  >
                    {container.name}
                  </NavItem>
                ))}
              </NavExpandable>
            )}
          </NavList>
        </Nav>
      ) : (
        <div className="pod-logs__nav">{'No containers found'}</div>
      )}
    </div>
  );
};
