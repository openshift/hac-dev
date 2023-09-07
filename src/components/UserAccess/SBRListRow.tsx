import * as React from 'react';
import { RowFunctionArgs, TableData } from '../../shared';
import ActionMenu from '../../shared/components/action-menu/ActionMenu';
import { SpaceBindingRequest } from '../../types';
import { sbrTableColumnClasses } from './SBRListHeader';
import { SBRStatusLabel } from './SBRStatusLabel';
import { useSBRActions } from './user-access-actions';

export const SBRListRow: React.FC<RowFunctionArgs<SpaceBindingRequest>> = ({ obj }) => {
  const actions = useSBRActions(obj);

  return (
    <>
      <TableData className={sbrTableColumnClasses.username}>{obj.spec.masterUserRecord}</TableData>
      <TableData className={sbrTableColumnClasses.role}>{obj.spec.spaceRole}</TableData>
      <TableData className={sbrTableColumnClasses.status}>
        <SBRStatusLabel sbr={obj} />
      </TableData>
      <TableData className={sbrTableColumnClasses.kebab}>
        <ActionMenu actions={actions} />
      </TableData>
    </>
  );
};
