import * as React from 'react';
import { Link } from 'react-router-dom';
import { GithubIcon } from '@patternfly/react-icons/dist/js/icons/github-icon';
import ActionMenu from '../../shared/components/action-menu/ActionMenu';
import ExternalLink from '../../shared/components/links/ExternalLink';
import { RowFunctionArgs, TableData } from '../../shared/components/table';
import { Timestamp } from '../../shared/components/timestamp/Timestamp';
import { Commit } from '../../types';
import { useCommitActions } from './commit-actions';
import { commitsTableColumnClasses } from './CommitsListHeader';

const CommitsListRow: React.FC<RowFunctionArgs<Commit>> = ({ obj }) => {
  const actions = useCommitActions(obj);
  return (
    <>
      <TableData className={commitsTableColumnClasses.name}>
        <Link to={`/stonesoup/${obj.application}/commit/${obj.sha}`}>{`${obj.sha.slice(
          0,
          7,
        )} `}</Link>
        {obj.shaURL && (
          <ExternalLink href={obj.shaURL}>
            <GithubIcon />
          </ExternalLink>
        )}
      </TableData>
      <TableData className={commitsTableColumnClasses.branch}>
        {obj.gitProvider === 'github' && obj.repoOrg ? (
          <ExternalLink
            href={`https://github.com/${obj.repoOrg}/${obj.repoURL}/tree/${obj.branch}`}
            text={`${obj.branch}`}
          />
        ) : (
          `${obj.branch}`
        )}
      </TableData>
      <TableData className={commitsTableColumnClasses.component}>
        {obj.components.length > 0 ? obj.components.map((c) => c.trim()).join(', ') : '-'}
      </TableData>
      <TableData className={commitsTableColumnClasses.byUser}>{obj.user ?? '-'}</TableData>
      <TableData className={commitsTableColumnClasses.committedAt}>
        <Timestamp timestamp={obj.creationTime} />
      </TableData>
      <TableData className={commitsTableColumnClasses.status}>-</TableData>
      <TableData className={commitsTableColumnClasses.kebab}>
        <ActionMenu actions={actions} />
      </TableData>
    </>
  );
};

export default CommitsListRow;
