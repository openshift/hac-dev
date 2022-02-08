import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  DataList,
  DataListCell,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
} from '@patternfly/react-core';
import { useK8sWatchResource } from '../../dynamic-plugin-sdk';
import { useActiveNamespace } from '../../hooks/useActiveNamespace';
import { ComponentGroupVersionKind } from '../../models';
import { StatusBox } from '../../shared/components/status-box/StatusBox';
import { ComponentKind } from '../../types';
import { ComponentListItem } from './ComponentListItem';

type ComponentListViewPageProps = {
  application: string;
};

export const ComponentListViewPage: React.FC<ComponentListViewPageProps> = ({ application }) => {
  const namespace = useActiveNamespace();
  const [allComponents, componentsLoaded] = useK8sWatchResource<ComponentKind[]>({
    groupVersionKind: ComponentGroupVersionKind,
    namespace,
    isList: true,
  });
  const loaded = namespace && componentsLoaded;

  // TODO: handle empty state / components not found
  const components = React.useMemo(
    () => (loaded ? allComponents?.filter((c) => c.spec.application === application) : []),
    [allComponents, application, loaded],
  );

  return (
    <StatusBox data={allComponents} loaded={loaded}>
      <DataList aria-label="Components">
        <DataListItem>
          <DataListItemRow>
            <DataListItemCells
              dataListCells={[
                <DataListCell key="add component">
                  <Link
                    className="pf-c-button pf-m-primary"
                    to={`/create-application?application=${application}`}
                  >
                    Add Component
                  </Link>
                </DataListCell>,
              ]}
            />
          </DataListItemRow>
        </DataListItem>
        {components?.map((component) => (
          <ComponentListItem key={component.metadata.uid} component={component} />
        ))}
      </DataList>
    </StatusBox>
  );
};
