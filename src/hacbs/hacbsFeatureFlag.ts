import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFeatureFlag } from '@openshift/dynamic-plugin-sdk';

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
