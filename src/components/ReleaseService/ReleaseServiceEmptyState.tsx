import * as React from 'react';
import emptyStateImgUrl from '../../imgs/Commit.svg';
import AppEmptyState from '../../shared/components/empty-state/AppEmptyState';
import ExternalLink from '../../shared/components/links/ExternalLink';

type ReleaseServiceEmptyStateProps = {
  title: string;
};

export const ReleaseServiceEmptyState: React.FC<
  React.PropsWithChildren<ReleaseServiceEmptyStateProps>
> = ({ title }) => {
  return (
    <AppEmptyState emptyStateImg={emptyStateImgUrl} title={title}>
      <ExternalLink href="https://redhat-appstudio.github.io/docs.appstudio.io/Documentation/main/how-to-guides/proc_release_application/">
        Learn more about setting up release services
      </ExternalLink>
    </AppEmptyState>
  );
};
