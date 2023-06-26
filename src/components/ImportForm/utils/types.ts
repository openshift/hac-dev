import { ComponentSpecs } from '../../../types';

export const enum ImportStrategy {
  GIT = 'git',
  SAMPLE = 'sample',
  CONTAINER = 'container',
}

export enum CPUUnits {
  millicores = 'millicores',
  cores = 'cores',
}

export enum MemoryUnits {
  Mi = 'Mi',
  Gi = 'Gi',
}

export type FormResources = {
  cpu: string;
  cpuUnit: CPUUnits;
  memory: string;
  memoryUnit: MemoryUnits;
};

export type DetectedFormComponent = {
  componentStub: Omit<ComponentSpecs, 'resources'> & {
    resources?: FormResources;
  };
  nameModified?: boolean;
  language?: string;
  projectType?: string;
  devfileFound?: boolean;
  defaultBuildPipeline?: boolean;
  targetPortDetected?: boolean;
  selectedRuntime?: string;
};
export type ImportSecret = {
  secretName: string;
  type: string;
  keyValues: {
    key: string;
    value: string;
    readOnlyKey?: boolean;
  }[];
};

export type ImportFormValues = {
  application: string;
  inAppContext?: boolean;
  detectedComponents?: DetectedFormComponent[];
  components?: DetectedFormComponent[];
  pipelinesascode?: 'manual' | 'automatic';
  source: {
    git: {
      url: string;
      context?: string;
      revision?: string;
    };
    isValidated?: boolean;
  };
  namespace: string;
  secret?: string;
  isDetected?: boolean;
  detectionFailed?: boolean;
  initialDetectionLoaded?: boolean;
  runtime?: string;
  sample?: string;
  importSecrets?: ImportSecret[];
  newSecrets?: string[];
  partnerTaskSecrets?: string[];
};
