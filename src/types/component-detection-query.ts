import { K8sResourceCommon } from '@openshift/dynamic-plugin-sdk-utils';
import { ComponentSpecs } from './component';

export type DetectedComponents = {
  [key: string]: {
    componentStub: ComponentSpecs;
    language?: string;
    projectType?: string;
    devfileFound?: boolean;
  };
};

export type ComponentDetectionQueryKind = K8sResourceCommon & {
  spec: {
    git: {
      url: string;
    };
  };
  isMultiComponent?: boolean;
  status?: {
    componentDetected?: DetectedComponents;
    conditions?: any[];
  };
};
