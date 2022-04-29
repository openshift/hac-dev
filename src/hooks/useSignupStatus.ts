import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { commonFetch } from '@openshift/dynamic-plugin-sdk-utils';

export enum UserSignupStatus {
  NOT_SIGNEDUP = 'NotSignedup',
  PENDING_APPROVAL = 'PendingApproval',
  PROVISIONED = 'Provisioned',
}

export const useSignupStatus = (): [
  UserSignupStatus,
  Dispatch<SetStateAction<string>>,
  boolean,
] => {
  const [status, setStatus] = useState<UserSignupStatus>(null);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    let unmounted = false;
    const getSignupData = async () => {
      setLoaded(false);
      try {
        const response = await commonFetch('/registration/api/v1/signup');
        if (unmounted) return;
        if (response.status === 200) {
          try {
            const data = await response.json();
            if (data.status.ready) {
              setStatus(UserSignupStatus.PROVISIONED);
            } else if (data.status.reason === 'PendingApproval') {
              setStatus(UserSignupStatus.PENDING_APPROVAL);
            }
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
          }
        }
      } catch (error) {
        if (error.code === 404) setStatus(UserSignupStatus.NOT_SIGNEDUP);
      }
    };

    getSignupData();
    setLoaded(true);

    return () => {
      unmounted = true;
    };
  }, []);

  return [status, setStatus, loaded];
};
