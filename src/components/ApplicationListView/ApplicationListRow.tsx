import * as React from 'react';
import { Link } from 'react-router-dom';
import { pluralize, Skeleton } from '@patternfly/react-core';
import { useComponents } from '../../hooks/useComponents';
import { useSnapshotsEnvironmentBindings } from '../../hooks/useSnapshotsEnvironmentBindings';
import ActionMenu from '../../shared/components/action-menu/ActionMenu';
import { RowFunctionArgs, TableData } from '../../shared/components/table';
import { Timestamp } from '../../shared/components/timestamp/Timestamp';
import { ApplicationKind } from '../../types';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';
import { useApplicationActions } from './application-actions';
import { applicationTableColumnClasses } from './ApplicationListHeader';

const ApplicationListRow: React.FC<React.PropsWithChildren<RowFunctionArgs<ApplicationKind>>> = ({
  obj,
}) => {
  const [components, loaded] = useComponents(obj.metadata.namespace, obj.metadata.name);
  const { namespace } = useWorkspaceInfo();

  const [snapshotsEnvironmentBindings, snapshotsLoaded] = useSnapshotsEnvironmentBindings(
    namespace,
    obj.metadata.name,
  );
  const lastDeployedTimestamp = React.useMemo(() => {
    const snapshotsEnvironmentBinding = snapshotsEnvironmentBindings?.sort(
      (a, b) =>
        Date.parse(b?.status?.componentDeploymentConditions?.[0]?.lastTransitionTime) -
        Date.parse(a?.status?.componentDeploymentConditions?.[0]?.lastTransitionTime),
    )?.[0];
    return snapshotsEnvironmentBinding?.status?.componentDeploymentConditions?.[0]
      ?.lastTransitionTime;
  }, [snapshotsEnvironmentBindings]);

  const actions = useApplicationActions(obj);
  const { workspace } = useWorkspaceInfo();

  const displayName = obj.spec.displayName || obj.metadata.name;

  return (
    <>
      <TableData className={applicationTableColumnClasses.name} data-testid="app-row-test-id">
        <Link
          to={`/application-pipeline/workspaces/${workspace}/applications/${obj.metadata.name}`}
          title={displayName}
        >
          {displayName}
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
        {snapshotsLoaded ? (
          <Timestamp timestamp={lastDeployedTimestamp} />
        ) : (
          <Skeleton width="50%" screenreaderText="Loading deploy time" />
        )}
      </TableData>
      <TableData className={applicationTableColumnClasses.kebab}>
        <ActionMenu actions={actions} />
      </TableData>
    </>
  );
};

export default ApplicationListRow;
