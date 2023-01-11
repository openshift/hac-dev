import { mockDetectedComponent } from '../__data__/mock-cdq';
import {
  createResourceData,
  sampleComponentValues,
  transformComponentValues,
} from '../transform-utils';

const mockResourceLimits = {
  limits: {
    cpu: '48m',
    memory: '516Mi',
  },
};

describe('Transform Utils', () => {
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
    const transformedComponentValues = transformComponentValues(mockDetectedComponent);
    expect(transformedComponentValues).toEqual([
      {
        componentStub: {
          application: 'insert-application-name',
          componentName: 'nodejs',
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
        devfileFound: true,
        language: 'nodejs',
        projectType: 'nodejs',
      },
    ]);
  });
});

describe('sampleComponentValues', () => {
  it('should prefix application to sample name', () => {
    const mockDetectedComponents = {
      node: { componentStub: { componentName: 'node', application: 'my-app' } },
    };
    const values = sampleComponentValues('my-app', mockDetectedComponents);
    expect(values[0].componentStub).toHaveProperty('componentName', 'my-app-node-sample');
  });

  it('should sanitize application prefix', () => {
    const mockDetectedComponents = {
      node: { componentStub: { componentName: 'node', application: 'My Application' } },
    };
    const values = sampleComponentValues('My Application', mockDetectedComponents);
    expect(values[0].componentStub).toHaveProperty('componentName', 'my-application-node-sample');
  });
});
