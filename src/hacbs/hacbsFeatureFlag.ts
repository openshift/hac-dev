import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SetFeatureFlag, useFeatureFlag } from '@openshift/dynamic-plugin-sdk';

export const HACBS_FLAG = 'HACBS';

export const EnableHACBSFlagRoute: React.FC = () => {
  const navigate = useNavigate();
  const [, setFlag] = useFeatureFlag(HACBS_FLAG);
  React.useEffect(() => {
    setFlag(true);
    /* eslint-disable-next-line no-console */
    console.log('HACBS Flag enabled');
    navigate('/app-studio', { replace: true });
    // No deps because setting the flag only needs to run once.
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);
  return null;
};

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
