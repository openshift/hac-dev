import * as React from 'react';
import { BitbucketIcon } from '@patternfly/react-icons/dist/js/icons/bitbucket-icon';
import { GitAltIcon } from '@patternfly/react-icons/dist/js/icons/git-alt-icon';
import { GithubIcon } from '@patternfly/react-icons/dist/js/icons/github-icon';
import { GitlabIcon } from '@patternfly/react-icons/dist/js/icons/gitlab-icon';

export const getGitIcon = (gitSource: string): React.ReactElement => {
  switch (gitSource) {
    case 'github.com':
      return <GithubIcon alt="GitHub" />;
    case 'bitbucket.org':
      return <BitbucketIcon alt="Bitbucket" />;
    case 'gitlab.com':
      return <GitlabIcon alt="Gitlab" />;
    default:
      return <GitAltIcon alt="Git" />;
  }
};
