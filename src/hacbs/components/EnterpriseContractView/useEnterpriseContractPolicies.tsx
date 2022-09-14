import React from 'react';
import { EnterpriseContractPolicies } from './types';

export const useEnterpriseContractPolicies = (fileName: string) => {
  const [contractPolicies, setContractPolicies] = React.useState<EnterpriseContractPolicies>();

  React.useEffect(() => {
    let canceled = false;

    fetch(fileName).then(async (response) => {
      const contractInfo: EnterpriseContractPolicies = await response.json();
      if (!canceled) {
        setContractPolicies(contractInfo);
      }
    });
    return () => {
      canceled = true;
    };
  }, [fileName]);

  return contractPolicies;
};
