import {
  containerImageRegex,
  RESOURCE_NAME_REGEX_MSG,
  resourceNameRegex,
  reviewValidationSchema,
} from '../validation-utils';

describe('Review form validation schema', () => {
  it('should fail when component name is missing', async () => {
    await expect(
      reviewValidationSchema.validate({
        application: 'my-app',
        components: [
          {
            componentStub: {
              targetPort: 8000,
            },
          },
        ],
        isDetected: true,
      }),
    ).rejects.toThrow('Required');
  });

  it('should fail when component name is invalid', async () => {
    const values = {
      application: 'my-app',
      components: [
        {
          componentStub: {
            componentName: 'test comp',
            targetPort: 8000,
          },
        },
      ],
      isDetected: true,
    };
    await expect(reviewValidationSchema.validate(values)).rejects.toThrow(RESOURCE_NAME_REGEX_MSG);
    values.components[0].componentStub.componentName = 'Test-';
    await expect(reviewValidationSchema.validate(values)).rejects.toThrow(RESOURCE_NAME_REGEX_MSG);
    values.components[0].componentStub.componentName = 'test-@!';
    await expect(reviewValidationSchema.validate(values)).rejects.toThrow(RESOURCE_NAME_REGEX_MSG);
    values.components[0].componentStub.componentName = '-test';
    await expect(reviewValidationSchema.validate(values)).rejects.toThrow(RESOURCE_NAME_REGEX_MSG);
    values.components[0].componentStub.componentName = '1-test';
    await expect(reviewValidationSchema.validate(values)).rejects.toThrow(RESOURCE_NAME_REGEX_MSG);
  });

  it('should pass when target port is not provided', async () => {
    const values = {
      application: 'my-app',
      components: [
        {
          componentStub: {
            componentName: 'test-comp',
            resources: {
              cpu: 1,
              memory: 255,
            },
            source: {
              git: {
                dockerfileUrl: './Dockerfile',
              },
            },
          },
        },
      ],
      isDetected: true,
    };
    await expect(reviewValidationSchema.validate(values)).resolves.toBe(values);
  });

  it('should fail when target port is invalid', async () => {
    const values = {
      application: 'my-app',
      components: [
        {
          componentStub: {
            componentName: 'test-comp',
            targetPort: 'test',
          },
        },
      ],
      isDetected: true,
    };
    await expect(reviewValidationSchema.validate(values)).rejects.toThrow('Must be an integer');
  });

  it('should fail when target port is in invalid range', async () => {
    const values = {
      application: 'my-app',
      components: [
        {
          componentStub: {
            componentName: 'test-comp',
            targetPort: '0',
          },
        },
      ],
      isDetected: true,
    };
    await expect(reviewValidationSchema.validate(values)).rejects.toThrow(
      'Port must be between 1 and 65535.',
    );
  });

  it('should fail when target port is in invalid range', async () => {
    const values = {
      application: 'my-app',
      components: [
        {
          componentStub: {
            componentName: 'test-comp',
            targetPort: '65536',
          },
        },
      ],
      isDetected: true,
    };
    await expect(reviewValidationSchema.validate(values)).rejects.toThrow(
      'Port must be between 1 and 65535.',
    );
  });

  it('should fail when resource unit is negative', async () => {
    const values = {
      application: 'my-app',
      components: [
        {
          componentStub: {
            componentName: 'test-comp',
            resources: {
              cpu: -1,
              memory: 256,
            },
          },
        },
      ],
      isDetected: true,
    };
    await expect(reviewValidationSchema.validate(values)).rejects.toThrow(
      'Value must be greater than 0',
    );
  });
  it('should pass when dockerfileUrl is not provided', async () => {
    const values = {
      application: 'my-app',
      components: [
        {
          componentStub: {
            componentName: 'test-comp',
            resources: {
              cpu: 1,
              memory: 255,
            },
            source: {
              git: {
                dockerfileUrl: undefined,
              },
            },
          },
        },
      ],
      isDetected: true,
    };
    await expect(reviewValidationSchema.validate(values)).resolves.toBe(values);
  });
  it('should pass when dockerfileUrl is a url', async () => {
    const values = {
      application: 'my-app',
      components: [
        {
          componentStub: {
            componentName: 'test-comp',
            resources: {
              cpu: 1,
              memory: 255,
            },
            source: {
              git: {
                dockerfileUrl: 'https://www.someurl.com/test',
              },
            },
          },
        },
      ],
      isDetected: true,
    };
    await expect(reviewValidationSchema.validate(values)).resolves.toBe(values);

    values.components[0].componentStub.source.git.dockerfileUrl = 'http://www.someurl.com/test';
    await expect(reviewValidationSchema.validate(values)).resolves.toBe(values);

    values.components[0].componentStub.source.git.dockerfileUrl =
      'http://www.someurl.com:9000/test';
    await expect(reviewValidationSchema.validate(values)).resolves.toBe(values);

    values.components[0].componentStub.source.git.dockerfileUrl = 'htp://test';
    await expect(reviewValidationSchema.validate(values)).rejects.toThrow(
      'Must be a valid relative file path or URL.',
    );
  });
  it('should pass when dockerfileUrl is a relative path', async () => {
    const values = {
      application: 'my-app',
      components: [
        {
          componentStub: {
            componentName: 'test-comp',
            resources: {
              cpu: 1,
              memory: 255,
            },
            source: {
              git: {
                dockerfileUrl: './Dockerfile',
              },
            },
          },
        },
      ],
      isDetected: true,
    };
    await expect(reviewValidationSchema.validate(values)).resolves.toBe(values);

    values.components[0].componentStub.source.git.dockerfileUrl = 'Dockerfile';
    await expect(reviewValidationSchema.validate(values)).resolves.toBe(values);

    values.components[0].componentStub.source.git.dockerfileUrl = '../Dockerfile';
    await expect(reviewValidationSchema.validate(values)).resolves.toBe(values);

    values.components[0].componentStub.source.git.dockerfileUrl = 'directory/Dockerfile';
    await expect(reviewValidationSchema.validate(values)).resolves.toBe(values);

    values.components[0].componentStub.source.git.dockerfileUrl = 'directory/Dockerfile.prod';
    await expect(reviewValidationSchema.validate(values)).resolves.toBe(values);

    values.components[0].componentStub.source.git.dockerfileUrl = '.hidden/Dockerfile.prod';
    await expect(reviewValidationSchema.validate(values)).resolves.toBe(values);

    values.components[0].componentStub.source.git.dockerfileUrl = '.Dockerfile.prod';
    await expect(reviewValidationSchema.validate(values)).resolves.toBe(values);

    values.components[0].componentStub.source.git.dockerfileUrl = 'Dockerfile.something.prod';
    await expect(reviewValidationSchema.validate(values)).resolves.toBe(values);

    values.components[0].componentStub.source.git.dockerfileUrl = 'Dockerfile.something.else.prod';
    await expect(reviewValidationSchema.validate(values)).resolves.toBe(values);

    values.components[0].componentStub.source.git.dockerfileUrl = 'Dockerfile.bad.';
    await expect(reviewValidationSchema.validate(values)).rejects.toThrow(
      'Must be a valid relative file path or URL.',
    );

    values.components[0].componentStub.source.git.dockerfileUrl = '/Dockerfile';
    await expect(reviewValidationSchema.validate(values)).rejects.toThrow(
      'Must be a valid relative file path or URL.',
    );
  });

  it('should pass when dockerfileUrl is a URL', async () => {
    const values = {
      application: 'my-app',
      components: [
        {
          componentStub: {
            componentName: 'test-comp',
            resources: {
              cpu: 1,
              memory: 255,
            },
            source: {
              git: {
                dockerfileUrl: 'https://www.test.com/Dockerfile',
              },
            },
          },
        },
      ],
      isDetected: true,
    };
    await expect(reviewValidationSchema.validate(values)).resolves.toBe(values);

    values.components[0].componentStub.source.git.dockerfileUrl =
      'https://www.test.com/directory/Dockerfile';
    await expect(reviewValidationSchema.validate(values)).resolves.toBe(values);

    values.components[0].componentStub.source.git.dockerfileUrl =
      'https://www.test.com/directory/Dockerfile.prod';
    await expect(reviewValidationSchema.validate(values)).resolves.toBe(values);

    values.components[0].componentStub.source.git.dockerfileUrl =
      'https://www.test.com:4000/Dockerfile';
    await expect(reviewValidationSchema.validate(values)).resolves.toBe(values);

    values.components[0].componentStub.source.git.dockerfileUrl = 'http://www.test.com/Dockerfile';
    await expect(reviewValidationSchema.validate(values)).resolves.toBe(values);

    values.components[0].componentStub.source.git.dockerfileUrl = 'www.test.com/Dockerfile';
    await expect(reviewValidationSchema.validate(values)).resolves.toBe(values);
  });
  it('should pass if memory is between 0 and 256Mi/2Gi', async () => {
    const values = {
      application: 'my-app',
      components: [
        {
          componentStub: {
            componentName: 'test-comp',
            resources: {
              cpu: 1,
              cpuUnit: 'cores',
              memory: 255,
              memoryUnit: 'Mi',
            },
            source: {
              git: {
                dockerfileUrl: 'https://www.test.com/Dockerfile',
              },
            },
          },
        },
      ],
      isDetected: true,
    };
    await expect(reviewValidationSchema.validate(values)).resolves.toBe(values);
    values.components[0].componentStub.resources.memory = 300;
    await expect(reviewValidationSchema.validate(values)).rejects.toThrow(
      'Value must not be greater than 256Mi',
    );
    values.components[0].componentStub.resources.memoryUnit = 'Gi';
    await expect(reviewValidationSchema.validate(values)).rejects.toThrow(
      'Value must not be greater than 2Gi',
    );
    values.components[0].componentStub.resources.memory = 1;
    await expect(reviewValidationSchema.validate(values)).resolves.toBe(values);
    values.components[0].componentStub.resources.cpu = 10;
    await expect(reviewValidationSchema.validate(values)).rejects.toThrow(
      'Value must not be greater than 2 cores',
    );
    values.components[0].componentStub.resources.cpu = 100;
    values.components[0].componentStub.resources.cpuUnit = 'millicores';
    await expect(reviewValidationSchema.validate(values)).rejects.toThrow(
      'Value must not be greater than 10 millicores',
    );
    values.components[0].componentStub.resources.cpu = 10;
    await expect(reviewValidationSchema.validate(values)).resolves.toBe(values);
  });
});

describe('containerImageRegex', () => {
  it('should validate a container image url starting with https:// or quay.io/', () => {
    expect('https://quay.io/example/repo').toMatch(containerImageRegex);
    expect('quay.io/example/repo').toMatch(containerImageRegex);
  });

  it('should not validate a non-quay container image url', () => {
    expect('https://docker.io/example/repo').not.toMatch(containerImageRegex);
    expect('quay.com/example/repo').not.toMatch(containerImageRegex);
  });
});

describe('resourceNameRegex', () => {
  it('should not allow names starting with number', () => {
    ['1test-name', '123resource'].forEach((str) => {
      expect(str).not.toMatch(resourceNameRegex);
    });
  });

  it('should not allow special characters', () => {
    ['resource-@$*-name', 'test-namé'].forEach((str) => {
      expect(str).not.toMatch(resourceNameRegex);
    });
  });
});
