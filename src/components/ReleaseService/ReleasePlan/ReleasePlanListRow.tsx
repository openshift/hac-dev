import * as React from 'react';
import { Link } from 'react-router-dom';
import { Label, capitalize } from '@patternfly/react-core';
import { CheckCircleIcon } from '@patternfly/react-icons/dist/esm/icons/check-circle-icon';
import { ExclamationCircleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
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
      <TableData className={releasesPlanTableColumnClasses.status}>
        {obj.status?.releasePlanAdmission ? (
          <Label variant="outline" color="green" icon={<CheckCircleIcon />}>
            Matched
          </Label>
        ) : (
          <Label variant="outline" color="red" icon={<ExclamationCircleIcon />}>
            Not Matched
          </Label>
        )}
      </TableData>
      <TableData className={releasesPlanTableColumnClasses.rpa}>
        {obj.status?.releasePlanAdmission?.name ?? '-'}
      </TableData>
      <TableData className={releasesPlanTableColumnClasses.kebab}>
        <ActionMenu actions={actions} />
      </TableData>
    </>
  );
};

export default ReleasePlanListRow;
