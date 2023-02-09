import React from 'react';
import { Bullseye, Spinner } from '@patternfly/react-core';
import { WorkspaceContext } from '../../utils/workspace-context-utils';
import AppBanner from '../AppBanner/AppBanner';
import { ErrorBoundary } from '../ErrorBoundary/ErrorBoundary';
import { ModalProvider } from '../modal/ModalProvider';

import './NamespacedPage.scss';

type NamespacedPageProps = {
  children: React.ReactNode;
};

const NamespacedPage: React.FunctionComponent<NamespacedPageProps> = ({ children }) => {
  const { workspacesLoaded } = React.useContext(WorkspaceContext);

  if (!workspacesLoaded) {
    return (
      <Bullseye>
        <Spinner />
      </Bullseye>
    );
  }

  return (
    <ModalProvider>
      <AppBanner />
      <ErrorBoundary>{children}</ErrorBoundary>
    </ModalProvider>
  );
};

export default NamespacedPage;
