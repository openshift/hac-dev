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
  language?: string;
  projectType?: string;
  devfileFound?: boolean;
};

export type ImportFormValues = {
  application: string;
  inAppContext?: boolean;
  components?: DetectedFormComponent[];
  pipelinesascode?: boolean;
  git?: {
    context?: string;
    ref?: string;
  };
  namespace: string;
  secret?: string;
  source: string;
  isDetected?: boolean;
  runtime?: string;
};
