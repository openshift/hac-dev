import { integrationTestValidationSchema } from '../validation-utils';

describe('validation-utils', () => {
  it('should validate', async () => {
    await expect(() =>
      integrationTestValidationSchema.validate({
        integrationTest: {
          name: 'test-name',
          url: 'test-url',
          path: 'test-path',
          revision: 'revision',
        },
      }),
    ).not.toThrow();
  });

  it('should fail when component name is missing', async () => {
    await expect(
      integrationTestValidationSchema.validate({
        integrationTest: {
          url: 'test-url',
          path: 'test-path',
          revision: 'revision',
        },
      }),
    ).rejects.toThrow('Required');
  });

  it('should fail when component name is invalid', async () => {
    await expect(
      integrationTestValidationSchema.validate({
        integrationTest: {
          name: '$symbol-first',
          url: 'test-url',
          path: 'test-path',
          revision: 'revision',
        },
      }),
    ).rejects.toThrow(
      'Must start with a letter and end with a letter or number. Valid characters include lowercase letters from a to z, numbers from 0 to 9, and hyphens ( - ).',
    );
  });

  it('should fail when component name has extra spaces', async () => {
    await expect(
      integrationTestValidationSchema.validate({
        integrationTest: {
          name: ' test-first  ',
          url: 'test-url',
          path: 'test-path',
          revision: 'revision',
        },
      }),
    ).rejects.toThrow(
      'Must start with a letter and end with a letter or number. Valid characters include lowercase letters from a to z, numbers from 0 to 9, and hyphens ( - ).',
    );
  });

  it('should fail when url is missing', async () => {
    await expect(
      integrationTestValidationSchema.validate({
        integrationTest: {
          name: 'test-name',
          path: 'test-path',
          revision: 'revision',
        },
      }),
    ).rejects.toThrow('Required');
  });

  it('should fail when path is missing', async () => {
    await expect(
      integrationTestValidationSchema.validate({
        integrationTest: {
          url: 'test-url',
          path: 'test-path',
        },
      }),
    ).rejects.toThrow('Required');
  });
});
