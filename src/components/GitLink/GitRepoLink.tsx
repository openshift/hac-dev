import * as React from 'react';
import { Tooltip, TooltipPosition } from '@patternfly/react-core';
import gitUrlParse from 'git-url-parse';
import ExternalLink from '../../shared/components/links/ExternalLink';
import { getGitIcon } from '../../utils/git-utils';

type Props = {
  url: string;
};

const GitRepoLink: React.FC<Props> = ({ url }) => {
  const parsed = gitUrlParse(url);
  const icon = getGitIcon(parsed.source);
  return (
    <Tooltip content={url} position={TooltipPosition.bottom}>
      <ExternalLink href={url} icon={icon}>
        {parsed.owner}/{parsed.name}
      </ExternalLink>
    </Tooltip>
  );
};

export default GitRepoLink;
