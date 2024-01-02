import * as React from 'react';
import { Label, Tooltip } from '@patternfly/react-core';
import { BitbucketIcon } from '@patternfly/react-icons/dist/js/icons/bitbucket-icon';
import { GithubIcon } from '@patternfly/react-icons/dist/js/icons/github-icon';
import { GitlabIcon } from '@patternfly/react-icons/dist/js/icons/gitlab-icon';
import { css } from '@patternfly/react-styles';
import { getCommitShortName } from '../../../utils/commits-utils';
import { GitProvider } from '../../utils/git-utils';
import './CommitLabel.scss';

const tipText = {
  [GitProvider.GITHUB]: 'Open in GitHub',
  [GitProvider.GITLAB]: 'Open in GitLab',
  [GitProvider.BITBUCKET]: 'Open in BitBucket',
};
const providerIcon = {
  [GitProvider.GITHUB]: <GithubIcon data-test-id="git-hub-icon" />,
  [GitProvider.GITLAB]: <GitlabIcon data-test-id="git-lab-icon" />,
  [GitProvider.BITBUCKET]: <BitbucketIcon data-test-id="bit-bucket-icon" />,
};

type CommitLabelProps = {
  gitProvider: GitProvider | string;
  sha: string;
  shaURL: string;
};
const CommitLabel: React.FC<React.PropsWithChildren<CommitLabelProps>> = ({
  gitProvider,
  sha,
  shaURL,
}) => {
  const commitShortName = getCommitShortName(sha);
  const label = (
    <Label
      color="blue"
      className={css('commit-label', gitProvider === GitProvider.GITHUB && 'black-icon')}
      icon={providerIcon[gitProvider]}
      isCompact
      render={({ className, content }) => (
        <a
          href={shaURL}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
          data-test-id={`commit-label-${commitShortName}`}
        >
          {content}
        </a>
      )}
    >
      {commitShortName}
    </Label>
  );
  const tooltip = tipText[gitProvider];
  if (tooltip) {
    return <Tooltip content={tooltip}>{label}</Tooltip>;
  }
  return label;
};

export default CommitLabel;
