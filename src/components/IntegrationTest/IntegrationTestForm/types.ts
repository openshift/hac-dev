import { K8sResourceCommon } from '@openshift/dynamic-plugin-sdk-utils';
import { ImportFormValues } from '../../../components/ImportForm/utils/types';

export type IntegrationTestFormValues = {
  name: string;
  url: string;
  revision?: string;
  path?: string;
  optional: boolean;
  secret?: string;
};

export enum IntegrationTestAnnotations {
  DISPLAY_NAME = 'app.kubernetes.io/display-name',
}

export enum IntegrationTestLabels {
  OPTIONAL = 'test.appstudio.openshift.io/optional',
  SCENARIO = 'test.appstudio.openshift.io/scenario',
}

export type FormValues = ImportFormValues & {
  applicationData?: K8sResourceCommon;
  integrationTest: IntegrationTestFormValues;
};
