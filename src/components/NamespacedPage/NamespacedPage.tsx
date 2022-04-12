import React from 'react';
import { Bullseye, Spinner } from '@patternfly/react-core';
import { useActiveNamespace } from '../../hooks';
import AppBanner from '../AppBanner/AppBanner';

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
