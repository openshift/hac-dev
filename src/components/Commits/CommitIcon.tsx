import * as React from 'react';
import codeCommitImg from '../../imgs/code-commit.svg';
import codePullRequestImg from '../../imgs/code-pull-request.svg';

import './CommitIcon.scss';

export const CommitIcon: React.FC<
  React.PropsWithChildren<{ isPR: boolean; className?: string }>
> = ({ isPR, className }) =>
  isPR ? (
    <img className={`commit-icon ${className}`} src={codePullRequestImg} alt="Pull request icon" />
  ) : (
    <img className={`commit-icon ${className}`} src={codeCommitImg} alt="Commit icon" />
  );
