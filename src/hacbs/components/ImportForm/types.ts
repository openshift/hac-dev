import { K8sResourceCommon } from '@openshift/dynamic-plugin-sdk-utils';
import { ImportFormValues } from '../../../components/ImportForm/utils/types';

export type FormValues = ImportFormValues & {
  applicationData?: K8sResourceCommon;
};
