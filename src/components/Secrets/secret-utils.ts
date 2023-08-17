import { k8sCreateResource } from '@openshift/dynamic-plugin-sdk-utils';
import { PIPELINE_SERVICE_ACCOUNT } from '../../consts/pipeline';
import { SecretModel } from '../../models';
import { RemoteSecretModel } from '../../models/remotesecret';
import {
  Condition,
  RemoteSecretKind,
  RemoteSecretStatusReason,
  RemoteSecretStatusType,
  SecretByUILabel,
  SecretFor,
  SecretKind,
  SecretTypeDisplayLabel,
  typeToLabel,
} from '../../types';

export type PartnerTask = {
  name: string;
  providerUrl: string;
  tokenKeyName: string;
  keyValuePairs: {
    key: string;
    value: string;
    readOnlyKey?: boolean;
  }[];
};
export const supportedPartnerTasksSecrets: { [key: string]: PartnerTask } = {
  snyk: {
    name: 'snyk-secret',
    providerUrl: 'https://snyk.io/',
    tokenKeyName: 'snyk_token',
    keyValuePairs: [{ key: 'snyk_token', value: '', readOnlyKey: true }],
  },
};

export const getSupportedPartnerTaskSecrets = () => {
  return Object.values(supportedPartnerTasksSecrets).map((secret) => ({
    label: secret.name,
    value: secret.name,
    disabled: false,
  }));
};

export const isPartnerTask = (secretName: string) => {
  return !!Object.values(supportedPartnerTasksSecrets).find((secret) => secret.name === secretName);
};

export const getSupportedPartnerTaskKeyValuePairs = (secretName?: string) => {
  const partnerTask = Object.values(supportedPartnerTasksSecrets).find(
    (secret) => secret.name === secretName,
  );
  return partnerTask ? partnerTask.keyValuePairs : [];
};

export const statusFromConditions = (
  conditions: Condition[],
): RemoteSecretStatusReason | string => {
  if (!conditions?.length) {
    return RemoteSecretStatusReason.Unknown;
  }
  const deployedCondition = conditions.find((c) => c.type === RemoteSecretStatusType.Deployed);
  if (deployedCondition) {
    return deployedCondition.reason;
  }
  return conditions[conditions.length - 1]?.reason || RemoteSecretStatusReason.Unknown;
};

export const getSecretRowData = (obj: RemoteSecretKind, environmentNames: string[]): any => {
  const type = typeToLabel(obj?.spec?.secret?.type);
  const secretName = obj?.spec?.secret?.name || '';
  const secretFor = obj?.metadata?.labels?.[SecretByUILabel] ?? SecretFor.deployment;
  const secretTarget =
    obj?.metadata?.labels?.['appstudio.redhat.com/environment'] ?? environmentNames.join(',');
  const secretLabels = obj
    ? Object.keys(obj?.spec?.secret?.labels || {})
        .map((k) => `${k}=${obj.spec?.secret?.labels[k]}`)
        .join(', ') || '-'
    : '-';
  const secretType =
    type === SecretTypeDisplayLabel.keyValue
      ? `${type} (${obj?.status.secret?.keys?.length})`
      : type || '';
  const secretStatus = statusFromConditions(obj?.status?.conditions);

  return {
    secretName,
    secretFor,
    secretTarget,
    secretLabels,
    secretType,
    secretStatus,
  };
};

export const createSecretResource = async (
  secretResource: SecretKind,
  namespace: string,
  dryRun: boolean,
): Promise<SecretKind> =>
  k8sCreateResource({
    model: SecretModel,
    queryOptions: {
      ns: namespace,
      ...(dryRun && { queryParams: { dryRun: 'All' } }),
    },
    resource: secretResource,
  });

export const createRemoteSecretResource = (
  secret: SecretKind,
  namespace: string,
  linkServiceAccount: boolean,
  dryRun: boolean,
): Promise<RemoteSecretKind> => {
  const remoteSecretResource: RemoteSecretKind = {
    apiVersion: `${RemoteSecretModel.apiGroup}/${RemoteSecretModel.apiVersion}`,
    kind: RemoteSecretModel.kind,
    metadata: {
      name: `${secret.metadata.name}-remote-secret`,
      namespace,
      labels: {
        [SecretByUILabel]: SecretFor.build,
      },
    },
    spec: {
      secret: {
        ...(linkServiceAccount && {
          linkedTo: [
            {
              serviceAccount: {
                reference: {
                  name: PIPELINE_SERVICE_ACCOUNT,
                },
              },
            },
          ],
        }),
        name: secret.metadata.name,
        type: secret.type,
      },
      targets: [
        {
          namespace,
        },
      ],
    },
  };

  return k8sCreateResource({
    model: RemoteSecretModel,
    queryOptions: {
      name: `${secret.metadata.name}-remote-secret`,
      ns: namespace,
      ...(dryRun && { queryParams: { dryRun: 'All' } }),
    },
    resource: remoteSecretResource,
  });
};
