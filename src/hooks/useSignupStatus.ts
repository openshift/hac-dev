import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { commonFetch } from '@openshift/dynamic-plugin-sdk-utils';

export enum UserSignupStatus {
  NOT_SIGNEDUP = 'NotSignedup',
  PENDING_APPROVAL = 'PendingApproval',
  PROVISIONED = 'Provisioned',
}

export const useSignupStatus = (): [boolean, string, Dispatch<SetStateAction<string>>] => {
  const [status, setStatus] = useState<string>(null);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    let unmounted = false;
    const getSignupData = async () => {
      setLoaded(false);
      try {
        const response = await commonFetch('/api/v1/signup');
        if (unmounted) return;
        if (response.status === 200) {
          try {
            const data = await response.json();
            if (data.status.ready) {
              setStatus(UserSignupStatus.PROVISIONED);
            } else if (data.status.reason === 'PendingApproval') {
              setStatus(UserSignupStatus.PENDING_APPROVAL);
            }
            // eslint-disable-next-line no-empty
          } catch {}
        }
      } catch (error) {
        if (error.status === 404) setStatus(UserSignupStatus.NOT_SIGNEDUP);
      }
    };

    getSignupData();
    setLoaded(true);

    return () => {
      unmounted = true;
    };
  }, []);

  return [loaded, status, setStatus];
};
