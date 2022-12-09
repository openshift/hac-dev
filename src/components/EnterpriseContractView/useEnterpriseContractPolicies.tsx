import React from 'react';
import { EnterpriseContractPolicies } from './types';

export const useEnterpriseContractPolicies = (
  fileName: string,
): [EnterpriseContractPolicies, boolean, unknown] => {
  const [fetchState, setFetchState] = React.useState<
    [EnterpriseContractPolicies, boolean, unknown]
  >([undefined, false, null]);

  React.useEffect(() => {
    let canceled = false;

    fetch(fileName)
      .then(async (response) => {
        const contractInfo: EnterpriseContractPolicies = await response.json();
        if (!canceled) {
          setFetchState([contractInfo, true, null]);
        }
      })
      .catch((error) => {
        if (!canceled) {
          setFetchState([undefined, true, error]);
        }
      });
    return () => {
      canceled = true;
    };
  }, [fileName]);

  return fetchState;
};
