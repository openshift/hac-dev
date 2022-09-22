import { SetFeatureFlag } from '@openshift/dynamic-plugin-sdk';

export const HACBS_FLAG = 'HACBS';

export const enableHACBSFlagFromQueryParam = (setFlag: SetFeatureFlag): void => {
  let enabled = false;
  const hacbsParam = new URLSearchParams(window.location.search).get('hacbs');
  if (['true', 'false'].includes(hacbsParam)) {
    enabled = hacbsParam === 'true';
  } else {
    enabled = localStorage.getItem('hacbs') === 'true';
  }
  if (enabled) {
    /* eslint-disable-next-line no-console */
    console.log('HACBS Flag enabled');
  }
  setFlag(HACBS_FLAG, enabled);
};
