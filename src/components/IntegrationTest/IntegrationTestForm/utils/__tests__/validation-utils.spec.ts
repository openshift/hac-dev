import { integrationTestValidationSchema } from '../validation-utils';

describe('validation-utils', () => {
  it('should validate', async () => {
    await expect(() =>
      integrationTestValidationSchema.validate({
        integrationTest: {
          name: 'test-name',
          pipeline: 'pipeline',
          bundle: 'quay.io/foo/bar',
        },
      }),
    ).not.toThrow();
  });

  it('should fail when component name is missing', async () => {
    await expect(
      integrationTestValidationSchema.validate({
        integrationTest: {
          pipeline: 'pipeline',
          bundle: 'quay.io/foo/bar',
        },
      }),
    ).rejects.toThrow('Required');
  });

  it('should fail when component name is invalid', async () => {
    await expect(
      integrationTestValidationSchema.validate({
        integrationTest: {
          name: '$symbol-first',
          pipeline: 'pipeline',
          bundle: 'quay.io/foo/bar',
        },
      }),
    ).rejects.toThrow(
      'Must start with a letter or number and end with a letter or number. Valid characters include lowercase letters from a to z, numbers from 0 to 9, and hyphens ( - ).',
    );
  });

  it('should fail when pipeline is missing', async () => {
    await expect(
      integrationTestValidationSchema.validate({
        integrationTest: {
          name: 'test-name',
          bundle: 'quay.io/foo/bar',
        },
      }),
    ).rejects.toThrow('Required');
  });

  it('should fail when bundle is missing', async () => {
    await expect(
      integrationTestValidationSchema.validate({
        integrationTest: {
          name: 'test-name',
          pipeline: 'pipeline',
        },
      }),
    ).rejects.toThrow('Required');
  });
});
