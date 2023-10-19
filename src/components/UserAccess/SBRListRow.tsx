import * as React from 'react';
import { RowFunctionArgs, TableData } from '../../shared';
import ActionMenu from '../../shared/components/action-menu/ActionMenu';
import { WorkspaceBinding } from '../../types';
import { sbrTableColumnClasses } from './SBRListHeader';
import { SBRStatusLabel } from './SBRStatusLabel';
import { useSBRActions } from './user-access-actions';

export const SBRListRow: React.FC<React.PropsWithChildren<RowFunctionArgs<WorkspaceBinding>>> = ({
  obj,
}) => {
  const actions = useSBRActions(obj);

  return (
    <>
      <TableData className={sbrTableColumnClasses.username}>{obj.masterUserRecord}</TableData>
      <TableData className={sbrTableColumnClasses.role}>{obj.role}</TableData>
      <TableData className={sbrTableColumnClasses.status}>
        <SBRStatusLabel sbr={obj.bindingRequest} />
      </TableData>
      <TableData className={sbrTableColumnClasses.kebab}>
        <ActionMenu actions={actions} />
      </TableData>
    </>
  );
};
