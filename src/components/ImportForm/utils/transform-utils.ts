import { sanitizeName } from '../../../utils/create-utils';
import { ResourceRequirements, DetectedComponents } from './../../../types';
import { DetectedFormComponent, FormResources, MemoryUnits } from './types';

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

export const createResourceData = (resources: ResourceData): FormResources => {
  const memory = (resources?.requests?.memory || resources?.limits?.memory) ?? '512Mi';
  const cpu = (resources?.requests?.cpu || resources?.limits?.cpu) ?? '1';
  const [memoryResource, memoryUnit] = getResourceData(memory);
  const [cpuResource, cpuUnit] = getResourceData(cpu);

  return {
    cpu: cpuResource || '',
    cpuUnit: CPUResourceMap[cpuUnit] || CPUResourceMap[''],
    memory: memoryResource || '',
    memoryUnit: (memoryUnit as MemoryUnits) || MemoryUnits.Gi,
  };
};

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

export const transformComponentValues = (
  detectedComponents: DetectedComponents,
): DetectedFormComponent[] => {
  return Object.values(detectedComponents).map((detectedComponent) => {
    const component = detectedComponent.componentStub;
    return {
      ...detectedComponent,
      componentStub: {
        ...component,
        resources: createResourceData(component?.resources || {}),
        replicas: component?.replicas || 1,
        targetPort: component?.targetPort || 8080,
      },
    };
  }, []);
};

export const sampleComponentValues = (
  application: string,
  detectedComponents: DetectedComponents,
): DetectedFormComponent[] => {
  return transformComponentValues(detectedComponents).map((component) => ({
    ...component,
    componentStub: {
      ...component.componentStub,
      componentName: `${sanitizeName(application)}-${component.componentStub.componentName}-sample`,
    },
  }));
};
