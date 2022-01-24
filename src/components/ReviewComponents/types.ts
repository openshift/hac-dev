export enum CPUUnits {
  millicores = 'millicores',
  cores = 'cores',
}

export enum MemoryUnits {
  Mi = 'Mi',
  Gi = 'Gi',
}

export enum Resources {
  OpenShift = 'openshift',
  Kubernetes = 'kubernetes',
  KnativeService = 'knative',
}

export type ComponentValues = {
  name: string;
  runtime: Resources;
  source: string;
  replicas?: number;
  targetPort?: number;
  resources?: {
    cpu: number;
    cpuUnit: CPUUnits;
    memory: number;
    memoryUnit: MemoryUnits;
  };
  buildCommand?: string;
  runCommand?: string;
};

export enum DeployMethod {
  AutomaticDeploy,
  ManualDeploy,
}

export type ReviewComponentsFormValues = {
  components: { [name: string]: ComponentValues };
  deployMethod: DeployMethod;
};
