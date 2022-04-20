import { reviewValidationSchema } from '../validation-utils';

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
    };
    await expect(reviewValidationSchema.validate(values)).rejects.toThrow(
      'Value must be greater than 0',
    );
  });
});
