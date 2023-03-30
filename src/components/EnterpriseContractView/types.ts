export type ReleasePackageInfo = {
  description: string;
  fullName: string;
  shortName: string;
  title: string;
};

export type ReleaseAnnotation = {
  description: string;
  failureMsg: string;
  file: string;
  fullPath: string;
  packageInfo: ReleasePackageInfo;
  packagePath: string;
  row: number;
  shortName: string;
  title: string;
  warningOrFailure: 'warning' | 'failure';
};

export type EnterpriseContractPolicies = {
  releaseAnnotations: {
    [key: string]: ReleaseAnnotation[];
  };
  releasePackages: {
    [key: string]: ReleasePackageInfo;
  };
};

export type EnterpriseContractResultType = 'violations' | 'successes' | 'warnings';

export enum ENTERPRISE_CONTRACT_STATUS {
  violations = 'Failed',
  successes = 'Success',
  warnings = 'Warning',
}

export type EnterpriseContractRule = {
  metadata: {
    title: string;
    description: string;
    collections: string[];
    code: string;
    // eslint-disable-next-line camelcase
    effective_on?: string;
  };
  msg: string;
};

export type ComponentEnterpriseContractResult = {
  containerImage: string;
  name: string;
  success: boolean;
  violations?: EnterpriseContractRule[];
  successes?: EnterpriseContractRule[];
  warnings?: EnterpriseContractRule[];
};

export type EnterpriseContractResult = {
  components: ComponentEnterpriseContractResult[];
};

export type UIEnterpriseContractData = {
  title: string;
  description: string;
  status: ENTERPRISE_CONTRACT_STATUS;
  timestamp?: string;
  component: string;
  msg?: string;
};
