import * as React from 'react';
import { RowFunctionArgs, TableData } from '../../../shared';
import ActionMenu from '../../../shared/components/action-menu/ActionMenu';
import { ReleaseStrategyKind } from '../../../types/release-strategy';
import { useReleaseStrategyActions } from './releasestrategy-actions';
import { releasesStrategyTableColumnClasses } from './ReleaseStrategyListHeader';

const ReleaseStrategyListRow: React.FC<
  React.PropsWithChildren<RowFunctionArgs<ReleaseStrategyKind>>
> = ({ obj }) => {
  const actions = useReleaseStrategyActions(obj);
  return (
    <>
      <TableData className={releasesStrategyTableColumnClasses.name}>{obj.metadata.name}</TableData>
      <TableData className={releasesStrategyTableColumnClasses.pipeline}>
        {obj.spec.pipeline}
      </TableData>
      <TableData className={releasesStrategyTableColumnClasses.policy}>{obj.spec.policy}</TableData>
      <TableData className={releasesStrategyTableColumnClasses.bundle}>{obj.spec.bundle}</TableData>
      <TableData className={releasesStrategyTableColumnClasses.kebab}>
        <ActionMenu actions={actions} />
      </TableData>
    </>
  );
};

export default ReleaseStrategyListRow;
