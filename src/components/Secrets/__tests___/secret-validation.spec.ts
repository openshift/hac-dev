import { ImagePullSecretType, SecretTypeDropdownLabel, SourceSecretType } from '../../../types';
import { secretFormValidationSchema } from '../utils/secret-validation';

describe('validation-utils', () => {
  it('should validate name field', async () => {
    await expect(() =>
      secretFormValidationSchema.validate({
        name: '123',
      }),
    ).rejects.toThrow(
      'Must start with a letter and end with a letter or number. Valid characters include lowercase letters from a to z, numbers from 0 to 9, and hyphens ( - ).',
    );

    await expect(() =>
      secretFormValidationSchema.validate({
        name: 'very-very-very-very-very-long-resource-name-which-is-invalid-name',
      }),
    ).rejects.toThrow('Must be no more than 63 characters.');
  });

  it('should validate opaque field', async () => {
    await expect(() =>
      secretFormValidationSchema.validate({
        name: 'test-resource',
        type: SecretTypeDropdownLabel.opaque,
        opaque: {
          keyValues: [{ key: 'test-key', value: '' }],
        },
      }),
    ).rejects.toThrow('Required');
  });

  it('should validate image field', async () => {
    await expect(() =>
      secretFormValidationSchema.validate({
        name: 'test-resource',
        type: SecretTypeDropdownLabel.image,
        image: {
          authType: ImagePullSecretType.ImageRegistryCreds,
          registryCreds: [{ registry: 'test-registry', username: '', password: '' }],
        },
      }),
    ).rejects.toThrow('Required');

    await expect(() =>
      secretFormValidationSchema.validate({
        name: 'test-resource',
        type: SecretTypeDropdownLabel.image,
        image: {
          authType: ImagePullSecretType.UploadConfigFile,
          dockerconfig: 'invalid-string',
        },
      }),
    ).rejects.toThrow('Configuration file should be in JSON format.');
  });

  it('should validate source field', async () => {
    await expect(() =>
      secretFormValidationSchema.validate({
        name: 'test-resource',
        type: SecretTypeDropdownLabel.source,
        source: {
          authType: SourceSecretType.basic,
          username: 'username',
          password: '',
        },
      }),
    ).rejects.toThrow('Required');

    await expect(() =>
      secretFormValidationSchema.validate({
        name: 'test-resource',
        type: SecretTypeDropdownLabel.source,
        source: {
          authType: SourceSecretType.ssh,
          ['ssh-privatekey']: '',
        },
      }),
    ).rejects.toThrow('Required');
  });
});
