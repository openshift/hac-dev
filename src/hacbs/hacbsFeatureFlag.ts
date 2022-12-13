import { SetFeatureFlag } from '@openshift/dynamic-plugin-sdk-extensions';

export const HACBS_FLAG = 'HACBS';

export const enableHACBSFlagFromQueryParam = (setFlag: SetFeatureFlag): void => {
  let enabled = true;
  const hacbsParam = new URLSearchParams(window.location.search).get('hacbs');
  if (['true', 'false'].includes(hacbsParam)) {
    enabled = hacbsParam !== 'false';
  } else {
    enabled = localStorage.getItem('hacbs') !== 'false';
  }
  if (enabled) {
    /* eslint-disable-next-line no-console */
    console.log('HACBS Flag enabled');
  }
  setFlag(HACBS_FLAG, enabled);
};
