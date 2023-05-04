import { ResourceRequirements, DetectedComponents } from './../../../types';
import { CPUUnits, DetectedFormComponent, FormResources, MemoryUnits } from './types';

const getResourceData = (res?: string) => {
  const resourcesRegEx = /^[0-9]*|[a-zA-Z]*/g;
  return res ? res.match(resourcesRegEx) : [];
};

const CPUResourceMap = {
  m: CPUUnits.millicores,
  '': CPUUnits.cores,
};

type ResourceData = {
  limits?: { cpu?: string; memory?: string };
  requests?: { cpu?: string; memory?: string };
};

export const createResourceData = (resources: ResourceData): FormResources => {
  const memory = resources?.requests?.memory || resources?.limits?.memory;
  const cpu = resources?.requests?.cpu || resources?.limits?.cpu;
  const [memoryResource, memoryUnit] = getResourceData(memory);
  const [cpuResource, cpuUnit] = getResourceData(cpu);

  return {
    cpu: cpuResource || '10',
    cpuUnit: CPUResourceMap[cpuUnit] || CPUUnits.millicores,
    memory: memoryResource || '50',
    memoryUnit: MemoryUnits[memoryUnit] || MemoryUnits.Mi,
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
  originalComponent?: DetectedFormComponent,
): DetectedFormComponent[] => {
  return Object.values(detectedComponents).map((detectedComponent) => {
    const component = detectedComponent.componentStub;
    return {
      ...detectedComponent,
      defaultBuildPipeline: true,
      componentStub: {
        ...component,
        ...(originalComponent && {
          componentName: originalComponent?.nameModified
            ? originalComponent.componentStub.componentName
            : component.componentName,
        }),
        resources: createResourceData(component?.resources || {}),
        replicas: component?.replicas || 1,
        targetPort: component?.targetPort || 8080,
      },
    };
  }, []);
};
