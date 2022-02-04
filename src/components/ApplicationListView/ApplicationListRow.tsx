import * as React from 'react';
import { Link } from 'react-router-dom';
import { pluralize } from '@patternfly/react-core';
import { EllipsisVIcon } from '@patternfly/react-icons/dist/js/icons';
import { useK8sWatchResource } from '../../dynamic-plugin-sdk';
import { ComponentGroupVersionKind } from '../../models';
import { RowFunctionArgs, TableData } from '../../shared/components/table/Table';
import { Timestamp } from '../../shared/components/timestamp/Timestamp';
import { ApplicationKind, ComponentKind } from '../../types';
import { applicationTableColumnClasses } from './ApplicationListHeader';

const ApplicationListRow: React.FC<RowFunctionArgs<ApplicationKind>> = ({ obj }) => {
  const [allComponents] = useK8sWatchResource<ComponentKind[]>({
    groupVersionKind: ComponentGroupVersionKind,
    namespace: obj.metadata.namespace,
    isList: true,
  });

  const components = allComponents?.filter((c) => c.spec.application === obj.metadata.name) ?? [];

  return (
    <>
      <TableData className={applicationTableColumnClasses.name}>
        <Link to={`/components?application=${obj.metadata.name}`} title={obj.metadata.name}>
          {obj.metadata.name}
        </Link>
      </TableData>
      <TableData className={applicationTableColumnClasses.components}>
        {pluralize(components.length, 'Component', 'Components')}
      </TableData>
      <TableData className={applicationTableColumnClasses.environments}>-</TableData>
      <TableData className={applicationTableColumnClasses.lastDeploy}>
        <Timestamp timestamp={obj.metadata.creationTimestamp} />
      </TableData>
      <TableData className={applicationTableColumnClasses.kebab}>
        <EllipsisVIcon />
      </TableData>
    </>
  );
};

export default ApplicationListRow;
