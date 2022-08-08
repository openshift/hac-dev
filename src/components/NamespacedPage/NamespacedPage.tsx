import React from 'react';
import { Bullseye, Spinner } from '@patternfly/react-core';
import { NamespaceContext } from '../../utils/namespace-context-utils';
import AppBanner from '../AppBanner/AppBanner';
import { ErrorBoundary } from '../ErrorBoundary/ErrorBoundary';
import { ModalProvider } from '../modal/ModalProvider';

import './NamespacedPage.scss';

type NamespacedPageProps = {
  children: React.ReactNode;
};

const NamespacedPage: React.FunctionComponent<NamespacedPageProps> = ({ children }) => {
  const { namespaceLoaded } = React.useContext(NamespaceContext);

  if (!namespaceLoaded) {
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
