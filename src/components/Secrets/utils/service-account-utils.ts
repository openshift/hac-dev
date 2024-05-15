import { k8sGetResource, k8sPatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { PIPELINE_SERVICE_ACCOUNT } from '../../../consts/pipeline';
import { ServiceAccountModel } from '../../../models/service-account';
import { SecretKind, ServiceAccountKind } from '../../../types';

export const linkSecretToServiceAccount = async (secret: SecretKind, namespace: string) => {
  if (!secret || (!namespace && !secret.metadata?.namespace)) {
    return;
  }
  const serviceAccount = await k8sGetResource<ServiceAccountKind>({
    model: ServiceAccountModel,
    queryOptions: { name: PIPELINE_SERVICE_ACCOUNT, ns: namespace },
  });
  const existingSecrets = serviceAccount?.imagePullSecrets as SecretKind[];
  const secretList = existingSecrets
    ? [...existingSecrets, { name: secret.metadata.name }]
    : [{ name: secret.metadata.name }];
  k8sPatchResource({
    model: ServiceAccountModel,
    queryOptions: {
      name: PIPELINE_SERVICE_ACCOUNT,
      ns: namespace,
    },
    patches: [
      {
        op: 'replace',
        path: `/imagePullSecrets`,
        value: secretList,
      },
    ],
  });
};

export const unLinkSecretFromServiceAccount = async (secret: SecretKind, namespace: string) => {
  if (!secret || (!namespace && !secret.metadata?.namespace)) {
    return;
  }
  const serviceAccount = await k8sGetResource<ServiceAccountKind>({
    model: ServiceAccountModel,
    queryOptions: { name: PIPELINE_SERVICE_ACCOUNT, ns: namespace ?? secret.metadata?.namespace },
  });

  const existingSecrets = serviceAccount?.imagePullSecrets;
  if (!Array.isArray(existingSecrets) || existingSecrets.length === 0) {
    return;
  }

  const secretList = (existingSecrets as { [key: string]: string }[]).filter(
    (s) => s.name !== secret.metadata?.name,
  );

  k8sPatchResource({
    model: ServiceAccountModel,
    queryOptions: {
      name: PIPELINE_SERVICE_ACCOUNT,
      ns: namespace,
    },
    patches: [
      {
        op: 'replace',
        path: `/imagePullSecrets`,
        value: secretList,
      },
    ],
  });
};
