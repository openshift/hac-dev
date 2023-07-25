import { useFeatureFlag } from '@openshift/dynamic-plugin-sdk';
import { useFlag } from '@unleash/proxy-client-react';
import { DEV_FLAG } from '../../../utils/flag-utils';

const PROD_AUTH_FLAG = 'rhtap-ui-prod.private.auth.flow';
const STAGE_AUTH_FLAG = 'rhtap-ui.private.auth.flow';

export const useEnablePrivateAuthFlowFlag = () => {
  const prodFlag = useFlag(PROD_AUTH_FLAG);
  const stageFlag = useFlag(STAGE_AUTH_FLAG);
  const [devFlag] = useFeatureFlag(DEV_FLAG);

  return devFlag || stageFlag || prodFlag;
};
