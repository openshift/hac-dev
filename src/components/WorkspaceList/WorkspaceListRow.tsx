import * as React from 'react';
import { css } from '@patternfly/react-styles';
import { RowFunctionArgs, TableData } from '../../shared/components/table';
import { Workspace } from '../../types';
import { workspaceTableColumnClasses } from './WorkspaceListHeader';

const ReleasesListRow: React.FC<
  React.PropsWithChildren<RowFunctionArgs<Workspace, { applicationName: string }>>
> = ({ obj }) => {
  // const fullWS = React.useMemo(
  //   async () =>
  //     await fetch(
  //       `/api/k8s/workspace/apis/workspaces.konflux-ci.dev/v1alpha1/namespaces/${obj?.metadata.namespace}/workspaces/${obj?.metadata.name}`,
  //     ).then((data) => data.json()),
  //   [obj.metadata],
  // );

  return (
    <>
      <TableData className={workspaceTableColumnClasses.name}>{obj.metadata.namespace}</TableData>
      <TableData className={workspaceTableColumnClasses.owner}>
        {obj?.status?.owner?.email}
      </TableData>
      <TableData className={workspaceTableColumnClasses.visibility}>
        {obj.spec.visibility}
      </TableData>

      <TableData className={css(workspaceTableColumnClasses.kebab, 'm-no-actions')}> </TableData>
    </>
  );
};

export default ReleasesListRow;
