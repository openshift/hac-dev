import * as React from 'react';

export const useOnMount = (callback: () => void) => {
  React.useEffect(() => {
    callback?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
