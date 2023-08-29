import * as React from 'react';
import { Link } from 'react-router-dom';
import { ClipboardCopy } from '@patternfly/react-core';
import { RowFunctionArgs, TableData } from '../../../shared/components/table';
import { useWorkspaceInfo } from '../../../utils/workspace-context-utils';
import GitRepoLink from '../../GitLink/GitRepoLink';
import { commitsTableColumnClasses } from './SnapshotComponentsListHeader';

export type SnapshotComponentTableData = {
  metadata: { uid: string; name: string };
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
      <TableData data-test="snapshot-component-list-row" className={commitsTableColumnClasses.name}>
        <Link
          to={`/application-pipeline/workspaces/${workspace}/applications/${obj.application}/components/`}
        >
          {obj.name}
        </Link>
      </TableData>
      <TableData className={commitsTableColumnClasses.image}>
        <ClipboardCopy isReadOnly hoverTip="Copy" clickTip="Copied">
          {obj.containerImage}
        </ClipboardCopy>
      </TableData>
      <TableData className={commitsTableColumnClasses.url}>
        <GitRepoLink dataTestID="snapshot-component-git-url" url={obj.source?.git?.url} />
      </TableData>
      <TableData className={commitsTableColumnClasses.revision}>
        <span data-test="snapshot-component-revision">{obj.source?.git?.revision}</span>
      </TableData>
    </>
  );
};

export default SnapshotComponentsListRow;
