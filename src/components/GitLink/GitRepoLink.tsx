import * as React from 'react';
import { Tooltip, TooltipPosition } from '@patternfly/react-core';
import { CodeBranchIcon } from '@patternfly/react-icons/dist/js/icons/code-branch-icon';
import gitUrlParse from 'git-url-parse';
import ExternalLink from '../../shared/components/links/ExternalLink';
import { getGitIcon, getGitPath } from '../../utils/git-utils';

type Props = {
  url: string;
  revision?: string;
  context?: string;
  dataTestID?: string;
};

const GitRepoLink: React.FC<React.PropsWithChildren<Props>> = ({
  url,
  revision,
  context,
  dataTestID,
}) => {
  let parsed: gitUrlParse.GitUrl;
  try {
    parsed = gitUrlParse(url);
  } catch {
    return null;
  }
  const icon = getGitIcon(parsed.source);
  const path = context?.replace(/^(\.?\/)?/g, '');
  const fullUrl = `https://${parsed.resource}/${parsed.owner}/${parsed.name}${getGitPath(
    parsed.source,
    revision,
    path,
    parsed.resource,
  )}`;

  return (
    <Tooltip content={fullUrl} position={TooltipPosition.bottom}>
      <ExternalLink href={fullUrl} icon={icon} hideIcon dataTestID={dataTestID}>
        {parsed.owner}/{parsed.name}
        {revision ? (
          <>
            {' '}
            (<CodeBranchIcon />
            {revision}
            {path ? ` / ${path}` : ''})
          </>
        ) : path ? (
          ` (${path})`
        ) : (
          ''
        )}
      </ExternalLink>
    </Tooltip>
  );
};

export default GitRepoLink;
