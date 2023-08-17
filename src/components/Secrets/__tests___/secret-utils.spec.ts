import { k8sCreateResource } from '@openshift/dynamic-plugin-sdk-utils';
import { PIPELINE_SERVICE_ACCOUNT } from '../../../consts/pipeline';
import { RemoteSecretModel } from '../../../models/remotesecret';
import { RemoteSecretStatusReason } from '../../../types';
import {
  createRemoteSecretResource,
  createSecretResource,
  getSecretRowData,
  getSupportedPartnerTaskKeyValuePairs,
  getSupportedPartnerTaskSecrets,
  isPartnerTask,
  statusFromConditions,
  supportedPartnerTasksSecrets,
} from '../secret-utils';
import { sampleImagePullSecret, sampleOpaqueSecret, sampleRemoteSecrets } from './secret-data';

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

describe('statusFromConditions', () => {
  it('should return the default value', () => {
    expect(statusFromConditions(null)).toBe('-');
    expect(statusFromConditions(undefined)).toBe('-');
    expect(statusFromConditions([])).toBe('-');
  });
  it('should return the correct status from the conditions', () => {
    const awaitingSecret = sampleRemoteSecrets[RemoteSecretStatusReason.AwaitingData];
    const injectedSecret = sampleRemoteSecrets[RemoteSecretStatusReason.Injected];

    expect(statusFromConditions(awaitingSecret.status.conditions)).toBe('AwaitingData');
    expect(statusFromConditions(injectedSecret.status.conditions)).toBe('Injected');
  });
});

describe('getSecretRowData', () => {
  it('should return the default value', () => {
    expect(getSecretRowData(null, []).secretName).toBe('');
  });

  it('should return all the row data for a given secret', () => {
    const injectedSecret = sampleRemoteSecrets[RemoteSecretStatusReason.Injected];
    expect(getSecretRowData(injectedSecret, ['development'])).toEqual({
      secretFor: 'Build',
      secretLabels: '-',
      secretName: 'test-secret-two',
      secretStatus: 'Injected',
      secretTarget: 'development',
      secretType: 'Key/value (1)',
    });
  });

  it('should return the labels data for the given secret', () => {
    const injectedSecret = sampleRemoteSecrets[RemoteSecretStatusReason.Injected];

    const secretWithLabels = {
      ...injectedSecret,
      spec: {
        ...injectedSecret.spec,
        secret: {
          ...injectedSecret.spec.secret,
          labels: {
            label1: 'test-label-1',
            label2: 'test-label-2',
          },
        },
      },
    };
    expect(getSecretRowData(secretWithLabels, ['development']).secretLabels).toEqual(
      'label1=test-label-1, label2=test-label-2',
    );
  });
});
