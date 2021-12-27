const getResourceData = (res: string) => {
  const resourcesRegEx = /^[0-9]*|[a-zA-Z]*/g;
  return res.match(resourcesRegEx);
};

const CPUResourceMap = {
  m: 'millicores',
  '': 'cores',
};

export const createResourceData = ({ memory, cpu }: { memory: string; cpu: string }) => {
  const [memoryResource, memoryUnit] = getResourceData(memory);
  const [cpuResource, cpuUnit] = getResourceData(cpu);

  return {
    cpu: cpuResource || '',
    cpuUnit: CPUResourceMap[cpuUnit] || '',
    memory: memoryResource || '',
    memoryUnit: memoryUnit || 'Mi',
  };
};
