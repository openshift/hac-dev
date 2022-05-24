import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  DataList,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  TextInput,
  Bullseye,
  Spinner,
} from '@patternfly/react-core';
import { FilterIcon } from '@patternfly/react-icons/dist/js/icons';
import { useApplicationRoutes } from '../../hooks/useApplicationRoutes';
import { ComponentKind } from '../../types';
import { ComponentLogViewerModal } from '../LogViewer/ComponentLogViewerModal';
import { NamespaceContext } from '../NamespacedPage/NamespacedPage';
import { ComponentListItem } from './ComponentListItem';

type ComponentListViewProps = {
  applicationName: string;
  components: ComponentKind[];
};

const ComponentListView: React.FC<ComponentListViewProps> = ({ applicationName, components }) => {
  const { namespace } = React.useContext(NamespaceContext);

  const [logsComponent, setLogsComponent] = React.useState<ComponentKind | undefined>(undefined);

  const [routes, loaded] = useApplicationRoutes(applicationName, namespace);

  const [nameFilter, setNameFilter] = React.useState<string>('');

  const filteredComponents = React.useMemo(
    () =>
      nameFilter
        ? components.filter((component) => component.metadata.name.indexOf(nameFilter) !== -1)
        : components,
    [nameFilter, components],
  );

  const onClearFilters = () => setNameFilter('');
  const onNameInput = (name: string) => setNameFilter(name);
  if (!loaded) {
    return (
      <Bullseye>
        <Spinner />
      </Bullseye>
    );
  }

  return (
    <>
      <Toolbar data-testid="component-list-toolbar" clearAllFilters={onClearFilters}>
        <ToolbarContent>
          <ToolbarItem>
            <Button variant="control">
              <FilterIcon /> {'Name'}
            </Button>
          </ToolbarItem>
          <ToolbarItem>
            <TextInput
              name="nameInput"
              data-testid="name-input-filter"
              type="search"
              aria-label="name filter"
              placeholder="Filter by name..."
              onChange={(name) => onNameInput(name)}
            />
          </ToolbarItem>
          <ToolbarItem>
            <Link
              data-test="add-component"
              className="pf-c-button pf-m-primary"
              to={`/app-studio/import?application=${applicationName}`}
            >
              Add Component
            </Link>
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>
      <DataList aria-label="Components" data-testid="component-list">
        {filteredComponents?.map((component) => (
          <ComponentListItem
            key={component.metadata.uid}
            component={component}
            routes={routes}
            showLogsForComponent={setLogsComponent}
          />
        ))}
      </DataList>
      <ComponentLogViewerModal
        component={logsComponent}
        isOpen={!!logsComponent}
        onClose={() => setLogsComponent(undefined)}
      />
    </>
  );
};

export default ComponentListView;
