import * as React from 'react';
import { DataList } from '@patternfly/react-core';
import { useApplicationRoutes } from '../../hooks';
import { ComponentKind } from '../../types';
import { useNamespace } from '../../utils/namespace-context-utils';
import { ApplicationEnvironmentListItem } from './ApplicationEnvironmentListItem';

type ApplicationEnvironmentListViewProps = {
  applicationName: string;
  components: ComponentKind[];
  selectedId: string | null;
  onSelect?: (selected: string | null) => void;
};

const ApplicationEnvironmentListView: React.FC<ApplicationEnvironmentListViewProps> = ({
  applicationName,
  components,
  selectedId,
  onSelect,
}) => {
  const namespace = useNamespace();
  const [routes] = useApplicationRoutes(applicationName, namespace);

  return (
    <DataList
      className="application-environment-details__list-view"
      aria-label="Components"
      data-testid="application-environment-list"
      selectedDataListItemId={selectedId}
      onSelectDataListItem={onSelect}
    >
      {components?.map((component) => (
        <ApplicationEnvironmentListItem
          key={component.metadata.uid}
          component={component}
          routes={routes}
        />
      ))}
    </DataList>
  );
};

export default ApplicationEnvironmentListView;
