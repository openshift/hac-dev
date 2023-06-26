import { k8sCreateResource } from '@openshift/dynamic-plugin-sdk-utils';
import { PIPELINE_SERVICE_ACCOUNT } from '../../../consts/pipeline';
import { RemoteSecretModel } from '../../../models/remotesecret';
import {
  createRemoteSecretResource,
  createSecretResource,
  getSupportedPartnerTaskKeyValuePairs,
  getSupportedPartnerTaskSecrets,
  isPartnerTask,
  supportedPartnerTasksSecrets,
} from '../secret-utils';
import { sampleImagePullSecret, sampleOpaqueSecret } from './secret-data';

jest.mock('@openshift/dynamic-plugin-sdk-utils');

const createResourceMock = k8sCreateResource as jest.Mock;

describe('getSupportedPartnerTaskKeyValuePairs', () => {
  it('should return empty array ', () => {
    expect(getSupportedPartnerTaskKeyValuePairs()).toEqual([]);
    expect(getSupportedPartnerTaskKeyValuePairs(null)).toEqual([]);
  });

  it('should return snyk secret values ', () => {
    expect(getSupportedPartnerTaskKeyValuePairs('snyk-secret')).toEqual([
      { key: 'snyk_token', readOnlyKey: true, value: '' },
    ]);
  });
});

describe('isPartnerTask', () => {
  it('should return true if supported partner task name is provided ', () => {
    Object.values(supportedPartnerTasksSecrets).map(({ name }) => {
      expect(isPartnerTask(name)).toBe(true);
    });
  });

  it('should return false if unsupport task name is provided ', () => {
    expect(isPartnerTask(null)).toBe(false);
    expect(isPartnerTask(undefined)).toBe(false);
    expect(isPartnerTask('invalid-partner-task')).toBe(false);
  });
});

describe('getSupportedPartnerTaskSecrets', () => {
  it('should return supported partener tasks', () => {
    expect(getSupportedPartnerTaskSecrets()).toHaveLength(1);
  });
});

describe('createSecretResource', () => {
  it('should create Opaque secret resource', () => {
    createSecretResource(sampleOpaqueSecret, 'test-ns', false);

    expect(createResourceMock).toHaveBeenCalledWith(
      expect.objectContaining({
        resource: expect.objectContaining({
          kind: 'Secret',
          type: 'Opaque',
        }),
      }),
    );
  });
  it('should create Image pull secret resource', () => {
    createSecretResource(sampleImagePullSecret, 'test-ns', false);

    expect(createResourceMock).toHaveBeenCalledWith(
      expect.objectContaining({
        resource: expect.objectContaining({
          kind: 'Secret',
          type: 'kubernetes.io/dockerconfigjson',
        }),
      }),
    );
  });
});

describe('createRemoteSecretResource', () => {
  it('should create Remote secret resource', () => {
    createRemoteSecretResource(sampleOpaqueSecret, 'test-ns', false, false);

    expect(createResourceMock).toHaveBeenCalledWith(
      expect.objectContaining({
        resource: expect.objectContaining({
          kind: RemoteSecretModel.kind,
        }),
      }),
    );
  });

  it('should link the secret resource to pipeline service account', () => {
    createResourceMock.mockClear();
    createRemoteSecretResource(sampleOpaqueSecret, 'test-ns', true, false);

    expect(createResourceMock.mock.calls[0][0].resource.spec.secret).toEqual(
      expect.objectContaining({
        linkedTo: expect.arrayContaining([
          expect.objectContaining({
            serviceAccount: expect.objectContaining({
              reference: expect.objectContaining({
                name: PIPELINE_SERVICE_ACCOUNT,
              }),
            }),
          }),
        ]),
      }),
    );
  });
});
