import { mockMappedComponents } from './../../AddComponent/__data__/mock-cdq';
import { createResourceData, transformComponentValues } from './../utils';

const mockResourceLimits = {
  limits: {
    cpu: '48m',
    memory: '516Mi',
  },
};

describe('Utils', () => {
  it('Should create resource data from resource limits', () => {
    const result = createResourceData(mockResourceLimits);
    expect(result).toEqual({
      cpu: '48',
      cpuUnit: 'millicores',
      memory: '516',
      memoryUnit: 'Mi',
    });
  });

  it('should transform component values for submit utils', () => {
    const transformedComponentValues = transformComponentValues(mockMappedComponents);
    expect(transformedComponentValues).toEqual({
      nodejs: {
        name: 'nodejs',
        source: {
          git: {
            context: './',
            url: 'https://github.com/nodeshift-starters/devfile-sample.git',
          },
        },
        resources: { cpu: '1', cpuUnit: 'cores', memory: '512', memoryUnit: 'Mi' },
        replicas: 1,
        targetPort: 8080,
        route: undefined,
        env: undefined,
      },
    });
  });
});
