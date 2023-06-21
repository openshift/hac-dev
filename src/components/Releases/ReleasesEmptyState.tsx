import React from 'react';
import { EmptyStateBody } from '@patternfly/react-core';
import emptyStateImgUrl from '../../imgs/Commit.svg';
import AppEmptyState from '../EmptyState/AppEmptyState';

const ReleasesEmptyState: React.FC = () => (
  <AppEmptyState emptyStateImg={emptyStateImgUrl} title="View your releases in one place">
    <EmptyStateBody>
      Set up a release plan for your application to view releases here.
    </EmptyStateBody>
  </AppEmptyState>
);

export default ReleasesEmptyState;
