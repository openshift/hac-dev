import React from 'react';
import { Bullseye, Spinner } from '@patternfly/react-core';
import { useActiveNamespace } from '../../hooks';
import { UserSignupStatus, useSignupStatus } from '../../hooks/useSignupStatus';
import AppBanner from '../AppBanner/AppBanner';
import { ErrorBoundary } from '../ErrorBoundary/ErrorBoundary';
import SignupView from '../Signup/SignupView';

import './NamespacedPage.scss';

type NamespaceContextData = {
  namespace: string;
};

export const NamespaceContext = React.createContext<NamespaceContextData>({
  namespace: '',
});

type NamespacedPageProps = {
  children: React.ReactNode;
};

const NamespacedPage: React.FunctionComponent<NamespacedPageProps> = ({ children }) => {
  const [status, setStatus, statusLoaded] = useSignupStatus();
  const [activeNamepace, namespaceLoaded] = useActiveNamespace();

  if (
    statusLoaded &&
    (status === UserSignupStatus.NOT_SIGNEDUP || status === UserSignupStatus.PENDING_APPROVAL)
  ) {
    return <SignupView status={status} onStatusChange={setStatus} />;
  }

  if (!namespaceLoaded) {
    return (
      <Bullseye>
        <Spinner />
      </Bullseye>
    );
  }

  return (
    <NamespaceContext.Provider value={{ namespace: activeNamepace }}>
      <AppBanner />
      <ErrorBoundary>{children}</ErrorBoundary>
    </NamespaceContext.Provider>
  );
};

export default NamespacedPage;
