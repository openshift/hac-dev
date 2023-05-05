import { DetectedComponents } from '../../../../types';
import { mockDetectedComponent } from '../__data__/mock-cdq';
import { createResourceData, transformComponentValues } from '../transform-utils';
import { CPUUnits, DetectedFormComponent, MemoryUnits } from '../types';

const mockResourceRequests = {
  requests: {
    cpu: '2',
    memory: '1Gi',
  },
};

const mockResourceLimits = {
  limits: {
    cpu: '48m',
    memory: '516Mi',
  },
};

const mockComponent: DetectedFormComponent = {
  componentStub: {
    application: 'insert-application-name',
    componentName: 'nodejs',
    source: {
      git: {
        context: './',
        url: 'https://github.com/nodeshift-starters/devfile-sample.git',
      },
    },
    resources: {
      cpu: '10',
      cpuUnit: CPUUnits.millicores,
      memory: '50',
      memoryUnit: MemoryUnits.Mi,
    },
    replicas: 1,
    targetPort: 8080,
    route: undefined,
    env: undefined,
  },
  devfileFound: true,
  language: 'nodejs',
  projectType: 'nodejs',
  defaultBuildPipeline: true,
  targetPortDetected: true,
};

describe('Transform Utils', () => {
  it('should create resource data from resource requests', () => {
    const result = createResourceData(mockResourceRequests);
    expect(result).toEqual({
      cpu: '2',
      cpuUnit: 'cores',
      memory: '1',
      memoryUnit: 'Gi',
    });
  });

  it('should create resource data from resource limits', () => {
    const result = createResourceData(mockResourceLimits);
    expect(result).toEqual({
      cpu: '48',
      cpuUnit: 'millicores',
      memory: '516',
      memoryUnit: 'Mi',
    });
  });

  it('should create default resource data', () => {
    const result = createResourceData({});
    expect(result).toEqual({
      cpu: '10',
      cpuUnit: 'millicores',
      memory: '50',
      memoryUnit: 'Mi',
    });
  });

  it('should transform component values for submit utils', () => {
    const transformedComponentValues = transformComponentValues(mockDetectedComponent);
    expect(transformedComponentValues).toEqual([mockComponent]);
  });

  it('should modify the component name if the user has not modified the name', () => {
    const userModifiedComponent: DetectedFormComponent = {
      ...mockComponent,
      componentStub: {
        ...mockComponent.componentStub,
        componentName: 'my-component-name',
      },
    };

    const transformedComponentValues = transformComponentValues(
      mockDetectedComponent,
      userModifiedComponent,
    );
    expect(transformedComponentValues[0].componentStub.componentName).toBe('nodejs');
  });

  it('should not modify the component name if the user has modified the name', () => {
    const userModifiedComponent: DetectedFormComponent = {
      ...mockComponent,
      componentStub: {
        ...mockComponent.componentStub,
        componentName: 'my-component-name',
      },
      nameModified: true,
    };

    const transformedComponentValues = transformComponentValues(
      mockDetectedComponent,
      userModifiedComponent,
    );
    expect(transformedComponentValues[0].componentStub.componentName).toBe('my-component-name');
  });

  it('should allow for 0 instances', () => {
    const detectedFormComponent: DetectedComponents = {
      ...mockDetectedComponent,
      nodejs: {
        ...mockDetectedComponent.nodejs,
        componentStub: {
          ...mockDetectedComponent.nodejs.componentStub,
          replicas: 0,
        },
      },
    };

    const transformedComponentValues = transformComponentValues(
      detectedFormComponent,
      mockComponent,
    );
    expect(transformedComponentValues[0].componentStub.replicas).toBe(0);
  });
});
