import * as React from 'react';
import { Link } from 'react-router-dom';
import ExternalLink from '../../../shared/components/links/ExternalLink';
import { RowFunctionArgs, TableData } from '../../../shared/components/table';
import { useWorkspaceInfo } from '../../../utils/workspace-context-utils';
import { commitsTableColumnClasses } from './SnapshotComponentsListHeader';

export type SnapshotComponentTableData = {
  metadata: { uid: string };
  name: string;
  containerImage: string;
  application: string;
  source?: { git?: { url: string; revision: string } };
};

const SnapshotComponentsListRow: React.FC<RowFunctionArgs<SnapshotComponentTableData>> = ({
  obj,
}) => {
  const { workspace } = useWorkspaceInfo();
  return (
    <>
      <TableData className={commitsTableColumnClasses.name}>
        <Link
          to={`/application-pipeline/workspaces/${workspace}/applications/${obj.application}/component/${obj.name}`}
        >
          {obj.name}
        </Link>
      </TableData>
      <TableData className={commitsTableColumnClasses.image}>{obj.containerImage}</TableData>
      <TableData className={commitsTableColumnClasses.url}>
        <ExternalLink href={obj.source?.git?.url}>{obj.source?.git?.url}</ExternalLink>
      </TableData>
      <TableData className={commitsTableColumnClasses.revision}>
        {obj.source?.git?.revision}
      </TableData>
    </>
  );
};

export default SnapshotComponentsListRow;
