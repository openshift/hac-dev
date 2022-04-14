import React from 'react';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';

export const useQuickstartCloseOnUnmount = () => {
  const {
    helpTopics: { closeHelpTopic },
  } = useChrome();

  React.useEffect(
    () => () => closeHelpTopic(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
};
