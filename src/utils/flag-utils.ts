import { SetFeatureFlag } from '@openshift/dynamic-plugin-sdk-extensions';
import { fetchSignupStatus, SignupStatus } from './signup-utils';

export const SIGNUP_FLAG = 'SIGNUP';
export const SIGNUP_PENDING_FLAG = 'SIGNUP_PENDING';

export const setSignupFeatureFlags = async (setFlag: SetFeatureFlag) => {
  const response = await fetchSignupStatus();
  switch (response) {
    case SignupStatus.SignedUp:
      setFlag(SIGNUP_FLAG, true);
      break;
    case SignupStatus.PendingApproval:
      setFlag(SIGNUP_FLAG, false);
      setFlag(SIGNUP_PENDING_FLAG, true);
      break;
    case SignupStatus.NotSignedUp:
      setFlag(SIGNUP_FLAG, false);
      break;
    default:
      // let's disable the signup if something breaks
      setFlag(SIGNUP_FLAG, false);
      // eslint-disable-next-line no-console
      console.error('Unable to determine signup status.');
  }
};

export const MVP_FLAG = 'MVP';

export const setMvpFeatureFlag = (setFlag: SetFeatureFlag): void => {
  let enabled = true;
  const param = new URLSearchParams(window.location.search).get(MVP_FLAG.toLowerCase());
  if (['true', 'false'].includes(param)) {
    enabled = param !== `${!enabled}`;
  } else {
    enabled = localStorage.getItem(MVP_FLAG.toLowerCase()) !== `${!enabled}`;
  }
  setFlag(MVP_FLAG, enabled);
};
