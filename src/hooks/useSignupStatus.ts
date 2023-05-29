import * as React from 'react';
import { useFeatureFlag } from '@openshift/dynamic-plugin-sdk';
import { SIGNUP_FLAG, SIGNUP_PENDING_FLAG } from '../utils/flag-utils';
import { fetchSignupStatus, SignupStatus } from '../utils/signup-utils';

const POLL_INTERVAL = 5000;

export const useSignupStatus = () => {
  const [signupFlag, setSignupFlag] = useFeatureFlag(SIGNUP_FLAG);
  const [signupPendingFlag, setSignupPendingFlag] = useFeatureFlag(SIGNUP_PENDING_FLAG);

  React.useEffect(() => {
    if (signupPendingFlag) {
      const handle = setInterval(async () => {
        const response = await fetchSignupStatus();
        if (response === SignupStatus.SignedUp) {
          setSignupFlag(true);
          setSignupPendingFlag(false);
        }
      }, POLL_INTERVAL);

      return () => clearInterval(handle);
    }
  }, [setSignupFlag, setSignupPendingFlag, signupFlag, signupPendingFlag]);

  const status = signupFlag
    ? SignupStatus.SignedUp
    : signupPendingFlag
    ? SignupStatus.PendingApproval
    : SignupStatus.NotSignedUp;

  return status;
};
