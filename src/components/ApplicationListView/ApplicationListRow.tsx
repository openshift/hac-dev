import * as React from 'react';
import { Link } from 'react-router-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { pluralize, Skeleton } from '@patternfly/react-core';
import { ComponentGroupVersionKind } from '../../models';
import ActionMenu from '../../shared/components/action-menu/ActionMenu';
import { RowFunctionArgs, TableData } from '../../shared/components/table';
import { Timestamp } from '../../shared/components/timestamp/Timestamp';
import { ApplicationKind, ComponentKind } from '../../types';
import { useApplicationActions } from './application-actions';
import { applicationTableColumnClasses } from './ApplicationListHeader';

const ApplicationListRow: React.FC<RowFunctionArgs<ApplicationKind>> = ({ obj }) => {
  const [allComponents, loaded] = useK8sWatchResource<ComponentKind[]>({
    groupVersionKind: ComponentGroupVersionKind,
    namespace: obj.metadata.namespace,
    isList: true,
  });
  const actions = useApplicationActions(obj);

  const components = allComponents?.filter((c) => c.spec.application === obj.metadata.name) ?? [];

  return (
    <>
      <TableData className={applicationTableColumnClasses.name}>
        <Link to={`/stonesoup/applications/${obj.metadata.name}`} title={obj.spec.displayName}>
          {obj.spec.displayName}
        </Link>
      </TableData>
      <TableData className={applicationTableColumnClasses.components}>
        {loaded ? (
          pluralize(components.length, 'Component')
        ) : (
          <Skeleton width="50%" screenreaderText="Loading component count" />
        )}
      </TableData>
      <TableData className={applicationTableColumnClasses.lastDeploy}>
        <Timestamp timestamp={obj.metadata.creationTimestamp} />
      </TableData>
      <TableData className={applicationTableColumnClasses.kebab}>
        <ActionMenu actions={actions} />
      </TableData>
    </>
  );
};

export default ApplicationListRow;
