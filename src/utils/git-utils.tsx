import * as React from 'react';
import { BitbucketIcon } from '@patternfly/react-icons/dist/js/icons/bitbucket-icon';
import { GitAltIcon } from '@patternfly/react-icons/dist/js/icons/git-alt-icon';
import { GithubIcon } from '@patternfly/react-icons/dist/js/icons/github-icon';
import { GitlabIcon } from '@patternfly/react-icons/dist/js/icons/gitlab-icon';

export const getGitPath = (
  gitSource: string,
  revision: string,
  path?: string,
  domain?: string,
): string => {
  if (!revision) {
    // main or master branch but we cannot construct the url
    return '';
  }
  let prefix: string;
  switch (gitSource) {
    case 'github.com':
      prefix = '/tree';
      break;
    case 'bitbucket.org':
      prefix = '/branch';
      break;
    case 'gitlab.com':
      prefix = '/-/tree';
      break;
    default:
      if (domain === 'gitlab.cee.redhat.com') {
        prefix = '/-/tree';
        break;
      }
      // omit path for unknown source
      return '';
  }
  return `${prefix}/${revision}${path ? `/${path}` : ''}`;
};

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
