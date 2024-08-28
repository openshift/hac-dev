import * as React from 'react';
import ActionMenu from '../../shared/components/action-menu/ActionMenu';
import { RowFunctionArgs, TableData } from '../../shared/components/table';
import { KonfluxWorkspace } from '../../types';
import { useWorkspaceActions } from './workspace-actions';
import { workspaceTableColumnClasses } from './WorkspaceListHeader';

const WorkspaceListRow: React.FC<React.PropsWithChildren<RowFunctionArgs<KonfluxWorkspace>>> = ({
  obj,
}) => {
  const owner = obj?.status?.owner as { email: string };
  const actions = useWorkspaceActions(obj);

  return (
    <>
      <TableData className={workspaceTableColumnClasses.name}>{obj.metadata?.namespace}</TableData>
      <TableData className={workspaceTableColumnClasses.owner}>{owner?.email}</TableData>
      <TableData className={workspaceTableColumnClasses.visibility}>
        {obj.spec?.visibility}
      </TableData>
      <TableData className={workspaceTableColumnClasses.kebab}>
        <ActionMenu actions={actions} />
      </TableData>
    </>
  );
};

export default WorkspaceListRow;
