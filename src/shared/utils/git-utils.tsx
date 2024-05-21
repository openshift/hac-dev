import * as React from 'react';
import { BitbucketIcon } from '@patternfly/react-icons/dist/js/icons/bitbucket-icon';
import { GitAltIcon } from '@patternfly/react-icons/dist/js/icons/git-alt-icon';
import { GithubIcon } from '@patternfly/react-icons/dist/js/icons/github-icon';
import { GitlabIcon } from '@patternfly/react-icons/dist/js/icons/gitlab-icon';
import { GIT_URL_REGEX } from '../../utils/validation-utils';

export enum GitProvider {
  GITHUB = 'github',
  BITBUCKET = 'bitbucket',
  GITLAB = 'gitlab',
  UNSURE = 'other',
  INVALID = '',
}

const hasDomain = (url: string, domain: string): boolean => {
  return (
    url.startsWith(`https://${domain}/`) ||
    url.startsWith(`https://www.${domain}/`) ||
    url.includes(`@${domain}:`)
  );
};

export const detectGitType = (url: string): GitProvider => {
  if (!GIT_URL_REGEX.test(url)) {
    // Not a URL
    return GitProvider.INVALID;
  }
  if (hasDomain(url, 'github.com')) {
    return GitProvider.GITHUB;
  }
  if (hasDomain(url, 'bitbucket.org')) {
    return GitProvider.BITBUCKET;
  }
  if (hasDomain(url, 'gitlab.com')) {
    return GitProvider.GITLAB;
  }
  // Not a known URL
  return GitProvider.UNSURE;
};

export const routeDecoratorIcon = (routeURL: string): React.ReactElement => {
  switch (detectGitType(routeURL)) {
    case GitProvider.INVALID:
      // Not a valid url and thus not safe to use
      return null;
    case GitProvider.GITHUB:
      return <GithubIcon title="Source code" />;
    case GitProvider.BITBUCKET:
      return <BitbucketIcon title="Source code" />;
    case GitProvider.GITLAB:
      return <GitlabIcon title="Source code" />;
    default:
      return <GitAltIcon title="Source code" />;
  }
};
