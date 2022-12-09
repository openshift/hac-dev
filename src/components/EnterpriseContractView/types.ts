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
