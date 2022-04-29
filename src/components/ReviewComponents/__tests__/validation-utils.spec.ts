import { reviewFormSchema } from '../validation-utils';

describe('Review form validation schema', () => {
  it('should fail when component name is missing', async () => {
    await expect(
      reviewFormSchema.validate({
        deployMethod: 1,
        components: {
          comp1: {
            targetPort: 8000,
          },
        },
      }),
    ).rejects.toThrow('Required');
  });

  it('should fail when component name is invalid', async () => {
    const values = {
      deployMethod: 1,
      components: {
        comp1: {
          name: 'test comp',
          targetPort: 8000,
        },
      },
    };
    await expect(reviewFormSchema.validate(values)).rejects.toThrow('Invalid component name');
    values.components.comp1.name = 'Test-';
    await expect(reviewFormSchema.validate(values)).rejects.toThrow('Invalid component name');
    values.components.comp1.name = 'test-@!';
    await expect(reviewFormSchema.validate(values)).rejects.toThrow('Invalid component name');
  });

  it('should pass when target port is not provided', async () => {
    const values = {
      deployMethod: 1,
      components: {
        comp1: {
          name: 'test-comp',
        },
      },
    };
    await expect(reviewFormSchema.validate(values)).resolves.toBe(values);
  });

  it('should fail when target port is invalid', async () => {
    const values = {
      deployMethod: 1,
      components: {
        comp1: {
          name: 'test comp',
          targetPort: 'test',
        },
      },
    };
    await expect(reviewFormSchema.validate(values)).rejects.toThrow('Must be an integer');
  });
});
