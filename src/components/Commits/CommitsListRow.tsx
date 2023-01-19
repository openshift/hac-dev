import * as React from 'react';
import { Link } from 'react-router-dom';
import { GithubIcon } from '@patternfly/react-icons/dist/js/icons/github-icon';
import codeCommitImg from '../../imgs/code-commit.svg';
import codePullRequestImg from '../../imgs/code-pull-request.svg';
import { pipelineRunFilterReducer } from '../../shared';
import ActionMenu from '../../shared/components/action-menu/ActionMenu';
import ExternalLink from '../../shared/components/links/ExternalLink';
import { RowFunctionArgs, TableData } from '../../shared/components/table';
import { Timestamp } from '../../shared/components/timestamp/Timestamp';
import { Commit } from '../../types';
import { statuses } from '../../utils/commits-utils';
import { useCommitActions } from './commit-actions';
import { commitsTableColumnClasses } from './CommitsListHeader';

import './CommitsListRow.scss';

const CommitsListRow: React.FC<RowFunctionArgs<Commit>> = ({ obj }) => {
  const actions = useCommitActions(obj);

  const status = pipelineRunFilterReducer(obj.pipelineRuns[0]);

  const prNumber = obj.isPullRequest ? `#${obj.pullRequestNumber}` : '';
  return (
    <>
      <TableData className={commitsTableColumnClasses.name}>
        {obj.isPullRequest ? (
          <img className="sha-title-icon" src={codePullRequestImg} alt="Pull request icon" />
        ) : (
          <img className="sha-title-icon" src={codeCommitImg} alt="Commit icon" />
        )}

        <Link to={`/stonesoup/${obj.application}/commit/${obj.sha}`}>
          {prNumber} {obj.shaTitle}
        </Link>

        {obj.shaURL && (
          <ExternalLink href={obj.shaURL}>
            {' '}
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
      <TableData className={commitsTableColumnClasses.status}>
        {statuses.includes(status) ? status : '-'}
      </TableData>
      <TableData className={commitsTableColumnClasses.kebab}>
        <ActionMenu actions={actions} />
      </TableData>
    </>
  );
};

export default CommitsListRow;
