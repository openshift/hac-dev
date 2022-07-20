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
  cpu: number;
  cpuUnit: CPUUnits;
  memory: number;
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
  git?: {
    context?: string;
    ref?: string;
  };
  namespace: string;
  secret?: string;
  source: string;
};
