import * as React from 'react';
import { Label, Tooltip } from '@patternfly/react-core';
import { BitbucketIcon } from '@patternfly/react-icons/dist/js/icons/bitbucket-icon';
import { GithubIcon } from '@patternfly/react-icons/dist/js/icons/github-icon';
import { GitlabIcon } from '@patternfly/react-icons/dist/js/icons/gitlab-icon';
import { getCommitShortName } from '../../../utils/commits-utils';
import { GitProvider } from '../../utils/git-utils';

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
const CommitLabel: React.FC<CommitLabelProps> = ({ gitProvider, sha, shaURL }) => {
  const commitShortName = getCommitShortName(sha);
  const label = (
    <Label
      className="commit-label"
      color="blue"
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
