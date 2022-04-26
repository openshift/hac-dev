import { ResourceRequirements } from '../../types';
import { ComponentValues } from './types';

const getResourceData = (res: string) => {
  const resourcesRegEx = /^[0-9]*|[a-zA-Z]*/g;
  return res.match(resourcesRegEx);
};

const CPUResourceMap = {
  m: 'millicores',
  '': 'cores',
};

type ResourceData = {
  limits?: { cpu?: string; memory?: string };
  requests?: { cpu?: string; memory?: string };
};

export const createResourceData = (resources: ResourceData) => {
  const memory = (resources?.limits?.memory || resources?.requests?.memory) ?? '512Mi';
  const cpu = (resources?.limits?.cpu || resources?.requests?.cpu) ?? '1';
  const [memoryResource, memoryUnit] = getResourceData(memory);
  const [cpuResource, cpuUnit] = getResourceData(cpu);

  return {
    cpu: cpuResource || '',
    cpuUnit: CPUResourceMap[cpuUnit] || CPUResourceMap[''],
    memory: memoryResource || '',
    memoryUnit: memoryUnit || 'Gi',
  };
};

type FormResources = ComponentValues['resources'];

export const transformResources = (formResources: FormResources): ResourceRequirements => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const cpuUnit = Object.entries(CPUResourceMap).find(([_, v]) => v === formResources.cpuUnit)[0];
  return {
    requests: {
      cpu: `${formResources.cpu}${cpuUnit}`,
      memory: `${formResources.memory}${formResources.memoryUnit}`,
    },
  };
};
