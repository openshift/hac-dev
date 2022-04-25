import React from 'react';
import { Bullseye, Spinner } from '@patternfly/react-core';
import { useActiveNamespace } from '../../hooks';
import { UserSignupStatus, useSignupStatus } from '../../hooks/useSignupStatus';
import AppBanner from '../AppBanner/AppBanner';
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
  const [activeNamepace, loaded] = useActiveNamespace();
  const [statusLoaded, status, setStatus] = useSignupStatus();

  if (status === UserSignupStatus.NOT_SIGNEDUP || status === UserSignupStatus.PENDING_APPROVAL) {
    return <SignupView loaded={statusLoaded} status={status} onStatusChange={setStatus} />;
  }

  if (!loaded) {
    return (
      <Bullseye>
        <Spinner />
      </Bullseye>
    );
  }

  return (
    <NamespaceContext.Provider value={{ namespace: activeNamepace }}>
      <AppBanner />
      {children}
    </NamespaceContext.Provider>
  );
};

export default NamespacedPage;
