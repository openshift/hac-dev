import React from 'react';
import { Bullseye, Spinner } from '@patternfly/react-core';
import { UserSignupStatus, useSignupStatus } from '../../hooks/useSignupStatus';
import { NamespaceContext } from '../../utils/namespace-context-utils';
import AppBanner from '../AppBanner/AppBanner';
import { ErrorBoundary } from '../ErrorBoundary/ErrorBoundary';
import { ModalProvider } from '../modal/ModalProvider';
import SignupView from '../Signup/SignupView';

import './NamespacedPage.scss';

type NamespacedPageProps = {
  children: React.ReactNode;
};

const NamespacedPage: React.FunctionComponent<NamespacedPageProps> = ({ children }) => {
  const [status, setStatus, statusLoaded] = useSignupStatus();
  const { namespaceLoaded } = React.useContext(NamespaceContext);

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
    <ModalProvider>
      <AppBanner />
      <ErrorBoundary>{children}</ErrorBoundary>
    </ModalProvider>
  );
};

export default NamespacedPage;
