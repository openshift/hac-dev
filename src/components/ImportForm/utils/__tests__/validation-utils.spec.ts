import {
  containerImageRegex,
  resourceNameRegex,
  reviewValidationSchema,
} from '../validation-utils';

describe('Review form validation schema', () => {
  it('should fail when component name is missing', async () => {
    await expect(
      reviewValidationSchema.validate({
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
    await expect(reviewValidationSchema.validate(values)).rejects.toThrow('Invalid component name');
    values.components[0].componentStub.componentName = 'Test-';
    await expect(reviewValidationSchema.validate(values)).rejects.toThrow('Invalid component name');
    values.components[0].componentStub.componentName = 'test-@!';
    await expect(reviewValidationSchema.validate(values)).rejects.toThrow('Invalid component name');
  });

  it('should pass when target port is not provided', async () => {
    const values = {
      components: [
        {
          componentStub: {
            componentName: 'test-comp',
            resources: {
              cpu: 1,
              memory: 512,
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

  it('should fail when resource unit is negative', async () => {
    const values = {
      components: [
        {
          componentStub: {
            componentName: 'test-comp',
            resources: {
              cpu: -1,
              memory: 512,
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
