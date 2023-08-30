import * as React from 'react';
import { Link } from 'react-router-dom';
import ActionMenu from '../../shared/components/action-menu/ActionMenu';
import CommitLabel from '../../shared/components/commit-label/CommitLabel';
import ExternalLink from '../../shared/components/links/ExternalLink';
import { RowFunctionArgs, TableData } from '../../shared/components/table';
import { Timestamp } from '../../shared/components/timestamp/Timestamp';
import { Commit } from '../../types';
import { createRepoBranchURL, statuses } from '../../utils/commits-utils';
import { pipelineRunStatus } from '../../utils/pipeline-utils';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';
import { StatusIconWithText } from '../topology/StatusIcon';
import { useCommitActions } from './commit-actions';
import { CommitIcon } from './CommitIcon';
import { commitsTableColumnClasses } from './CommitsListHeader';

import './CommitsListRow.scss';

const CommitsListRow: React.FC<RowFunctionArgs<Commit>> = ({ obj }) => {
  const actions = useCommitActions(obj);
  const { workspace } = useWorkspaceInfo();
  const status = pipelineRunStatus(obj.pipelineRuns[0]);

  const prNumber = obj.isPullRequest ? `#${obj.pullRequestNumber}` : '';
  return (
    <>
      <TableData className={commitsTableColumnClasses.name}>
        <CommitIcon isPR={obj.isPullRequest} className="sha-title-icon" />
        <Link
          to={`/application-pipeline/workspaces/${workspace}/applications/${obj.application}/commit/${obj.sha}`}
        >
          {prNumber} {obj.shaTitle}
        </Link>
        {obj.shaURL && (
          <>
            {' '}
            <CommitLabel gitProvider={obj.gitProvider} sha={obj.sha} shaURL={obj.shaURL} />
          </>
        )}
      </TableData>
      <TableData className={commitsTableColumnClasses.branch}>
        {createRepoBranchURL(obj) ? (
          <ExternalLink href={createRepoBranchURL(obj)} text={`${obj.branch}`} />
        ) : (
          `${obj.branch || '-'}`
        )}
      </TableData>
      <TableData className={commitsTableColumnClasses.component}>
        <div className="commits-component-list">
          {obj.components.length > 0
            ? obj.components.map((c) => (
                <Link
                  key={c}
                  to={`/application-pipeline/workspaces/${workspace}/applications/${
                    obj.application
                  }/components/${c.trim()}`}
                >
                  {c.trim()}
                </Link>
              ))
            : '-'}
        </div>
      </TableData>
      <TableData className={commitsTableColumnClasses.byUser}>{obj.user ?? '-'}</TableData>
      <TableData className={commitsTableColumnClasses.committedAt}>
        <Timestamp timestamp={obj.creationTime} />
      </TableData>
      <TableData className={commitsTableColumnClasses.status}>
        {statuses.includes(status) ? <StatusIconWithText status={status} /> : '-'}
      </TableData>
      <TableData className={commitsTableColumnClasses.kebab}>
        <ActionMenu actions={actions} />
      </TableData>
    </>
  );
};

export default CommitsListRow;
