import * as React from 'react';
import { Link } from 'react-router-dom';
import { capitalize } from '@patternfly/react-core';
import { RowFunctionArgs, TableData } from '../../../shared';
import ActionMenu from '../../../shared/components/action-menu/ActionMenu';
import { ReleasePlanKind, ReleasePlanLabel } from '../../../types/coreBuildService';
import { useWorkspaceInfo } from '../../../utils/workspace-context-utils';
import { useReleasePlanActions } from './releaseplan-actions';
import { releasesPlanTableColumnClasses } from './ReleasePlanListHeader';

const ReleasePlanListRow: React.FC<React.PropsWithChildren<RowFunctionArgs<ReleasePlanKind>>> = ({
  obj,
}) => {
  const actions = useReleasePlanActions(obj);
  const { workspace } = useWorkspaceInfo();
  return (
    <>
      <TableData className={releasesPlanTableColumnClasses.name}>{obj.metadata.name}</TableData>
      <TableData className={releasesPlanTableColumnClasses.application}>
        <Link
          to={`/application-pipeline/workspaces/${workspace}/applications/${obj.spec.application}`}
          title={obj.spec.application}
        >
          {obj.spec.application}
        </Link>
      </TableData>
      <TableData className={releasesPlanTableColumnClasses.target}>{obj.spec.target}</TableData>
      <TableData className={releasesPlanTableColumnClasses.autoRelease}>
        {capitalize(obj.metadata.labels?.[ReleasePlanLabel.AUTO_RELEASE] ?? 'false')}
      </TableData>
      <TableData className={releasesPlanTableColumnClasses.standingAttribution}>
        {capitalize(obj.metadata.labels?.[ReleasePlanLabel.STANDING_ATTRIBUTION] ?? 'false')}
      </TableData>
      <TableData className={releasesPlanTableColumnClasses.kebab}>
        <ActionMenu actions={actions} />
      </TableData>
    </>
  );
};

export default ReleasePlanListRow;
