import React from 'react';
import { EmptyStateBody, Text, TextVariants } from '@patternfly/react-core';
import emptyStateImgUrl from '../../imgs/Release.svg';
import AppEmptyState from '../../shared/components/empty-state/AppEmptyState';
import ExternalLink from '../../shared/components/links/ExternalLink';

const ReleasesEmptyState: React.FC<React.PropsWithChildren<unknown>> = () => (
  <AppEmptyState emptyStateImg={emptyStateImgUrl} title="Check out all of your releases ">
    <EmptyStateBody>
      <Text component={TextVariants.p}>
        A release object represents a deployed snapshot of your application components. To view your
        releases, set up a release plan for your application.
      </Text>
      <ExternalLink href="https://konflux-ci.dev/docs/advanced-how-tos/releasing/">
        Learn more about setting up release plans
      </ExternalLink>
    </EmptyStateBody>
  </AppEmptyState>
);

export default ReleasesEmptyState;
