import { SetFeatureFlag } from '@openshift/dynamic-plugin-sdk';
//import { commonFetch } from '@openshift/dynamic-plugin-sdk-utils';

export const SIGNUP_FLAG = 'SIGNUP';
export const SIGNUP_PENDING_FLAG = 'SIGNUP_PENDING';

export const setSignupFeatureFlags = async (setFlag: SetFeatureFlag) => {
  setFlag(SIGNUP_FLAG, true);
  // eslint-disable-next-line no-console
  console.warn('KCP Change: Set the SIGNUP_FLAG to "true"');

  // try {
  //   const response = await commonFetch('/registration/api/v1/signup');
  //   if (response.status === 200) {
  //     try {
  //       const data = await response.json();
  //       if (data.status.ready) {
  //         setFlag(SIGNUP_FLAG, true);
  //       } else if (data.status.reason === 'PendingApproval') {
  //         setFlag(SIGNUP_FLAG, false);
  //         setFlag(SIGNUP_PENDING_FLAG, true);
  //       }
  //     } catch (e) {
  //       // eslint-disable-next-line no-console
  //       console.error('Error when fetching signup status: ', e);
  //     }
  //   }
  // } catch (error) {
  //   if (error.code === 404) setFlag(SIGNUP_FLAG, false);
  // }
};
