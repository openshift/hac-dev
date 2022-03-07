import { createResourceData } from './../utils';

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
});
