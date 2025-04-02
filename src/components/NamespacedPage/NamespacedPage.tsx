import React from 'react';
import { Bullseye, Spinner } from '@patternfly/react-core';
import { WorkspaceContext } from '../../utils/workspace-context-utils';
import AppBanner from '../AppBanner/AppBanner';
import { ErrorBoundary } from '../ErrorBoundary/ErrorBoundary';
import { ModalProvider } from '../modal/ModalProvider';

// PF 5 CSS
// TODO: Remove when console is at PF 5
import '@patternfly/patternfly/patternfly.css';
import '@patternfly/patternfly/patternfly-addons.css';

import './NamespacedPage.scss';

type NamespacedPageProps = {
  children: React.ReactNode;
  hideAppBanner?: boolean;
  skipWorkspaceCheck?: boolean;
};

const NamespacedPage: React.FunctionComponent<React.PropsWithChildren<NamespacedPageProps>> = ({
  children,
  skipWorkspaceCheck = false,
}) => {
  const { workspacesLoaded } = React.useContext(WorkspaceContext);

  // TODO work around to https://issues.redhat.com/browse/RHCLOUD-24606
  React.useEffect(() => {
    const main =
      document.querySelector<HTMLElement>('main.pf-v5-c-page__main') ||
      document.querySelector<HTMLElement>('main.pf-c-page__main');
    if (main) {
      main.style.position = 'relative';
    }
  }, []);

  if (!skipWorkspaceCheck && !workspacesLoaded) {
    return (
      <Bullseye>
        <Spinner />
      </Bullseye>
    );
  }

  return (
    <ErrorBoundary>
      <ModalProvider>
        <AppBanner />
        <div className="main-layout-container">{children}</div>
      </ModalProvider>
    </ErrorBoundary>
  );
};

export default NamespacedPage;
