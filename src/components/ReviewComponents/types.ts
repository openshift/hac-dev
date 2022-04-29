import { ComponentSource } from '../../types';

export enum CPUUnits {
  millicores = 'millicores',
  cores = 'cores',
}

export enum MemoryUnits {
  Mi = 'Mi',
  Gi = 'Gi',
}

export type ComponentValues = {
  name: string;
  source: ComponentSource;
  replicas?: number;
  targetPort?: number;
  resources?: {
    cpu: number;
    cpuUnit: CPUUnits;
    memory: number;
    memoryUnit: MemoryUnits;
  };
  env?: { name: string; value: string }[];
};

export type ReviewComponentsFormValues = {
  components: { [name: string]: ComponentValues };
};
