import * as React from 'react';
import ExternalLink from '../shared/components/links/ExternalLink';

const URL_REGEXP =
  /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)/;
export const GROUP_MATCH_REGEXP = new RegExp(`^(.*\\s)?(${URL_REGEXP.source})(\\s.*)?$`, 'i');

export const handleURLs = (value: string): React.ReactNode => {
  if (typeof value !== 'string') return value;

  const matches = value.match(GROUP_MATCH_REGEXP);
  const [, prefix, link, suffix] = matches || [];

  if (link) {
    return (
      <>
        {handleURLs(prefix)}
        <ExternalLink href={link}>{link}</ExternalLink>
        {handleURLs(suffix)}
      </>
    );
  }

  return value;
};
