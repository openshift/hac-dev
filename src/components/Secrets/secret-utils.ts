import { k8sCreateResource } from '@openshift/dynamic-plugin-sdk-utils';
import { SecretModel } from '../../models';
import { SecretKind } from '../../types';

export const SNYK_SPI_TOKEN_ACCESS_BINDING = 'spi-access-token-binding-for-snyk-secret';

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

const defaultValues = [{ key: '', value: '', readOnlyKey: false }];
export const getSupportedPartnerTaskKeyValuePairs = (secretName?: string) => {
  const partnerTask = Object.values(supportedPartnerTasksSecrets).find(
    (secret) => secret.name === secretName,
  );
  return partnerTask ? partnerTask.keyValuePairs : defaultValues;
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
