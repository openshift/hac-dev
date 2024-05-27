import { k8sCreateResource } from '@openshift/dynamic-plugin-sdk-utils';
import { Base64 } from 'js-base64';
import { pick } from 'lodash-es';
import { SecretModel } from '../../../models';
import {
  AddSecretFormValues,
  ImagePullSecretType,
  K8sSecretType,
  RemoteSecretStatusReason,
  RemoteSecretStatusType,
  SecretByUILabel,
  SecretCondition,
  SecretKind,
  SecretLabels,
  SecretType,
  SecretTypeDisplayLabel,
  SecretTypeDropdownLabel,
  SourceSecretType,
} from '../../../types';

export type PartnerTask = {
  type: SecretType;
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
    type: SecretType.opaque,
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
  }));
};
export const isPartnerTaskAvailable = (type: string) =>
  !!Object.values(supportedPartnerTasksSecrets).find(
    (secret) => secret.type === K8sSecretType[type],
  );

export const isPartnerTask = (secretName: string) => {
  return !!Object.values(supportedPartnerTasksSecrets).find((secret) => secret.name === secretName);
};

export const getSupportedPartnerTaskKeyValuePairs = (secretName?: string) => {
  const partnerTask = Object.values(supportedPartnerTasksSecrets).find(
    (secret) => secret.name === secretName,
  );
  return partnerTask ? partnerTask.keyValuePairs : [];
};

export const typeToLabel = (type: string) => {
  switch (type) {
    case SecretType.dockerconfigjson:
    case SecretType.dockercfg:
      return SecretTypeDisplayLabel.imagePull;
    case SecretType.basicAuth:
    case SecretType.sshAuth:
    case SecretType.opaque:
      return SecretTypeDisplayLabel.keyValue;

    default:
      return type;
  }
};
export const typeToDropdownLabel = (type: string) => {
  switch (type) {
    case SecretType.dockerconfigjson:
    case SecretType.dockercfg:
      return SecretTypeDropdownLabel.image;
    case SecretType.basicAuth:
    case SecretType.sshAuth:
      return SecretTypeDropdownLabel.source;
    case SecretType.opaque:
      return SecretTypeDropdownLabel.opaque;

    default:
      return type;
  }
};
export const getKubernetesSecretType = (values: AddSecretFormValues) => {
  let type = values.type;
  if (values.type === SecretTypeDropdownLabel.image) {
    type = values.image.authType;
  } else if (values.type === SecretTypeDropdownLabel.source) {
    type = values.source.authType;
  }
  return K8sSecretType[type];
};
export const getSecretFormData = (values: AddSecretFormValues, namespace: string): SecretKind => {
  let data = {};
  if (values.type === SecretTypeDropdownLabel.opaque) {
    data = values.opaque.keyValues.reduce((acc, s) => {
      acc[s.key] = s.value ? s.value : '';
      return acc;
    }, {});
  } else if (values.type === SecretTypeDropdownLabel.image) {
    if (values.image.authType === ImagePullSecretType.ImageRegistryCreds) {
      const dockerconfigjson = values.image.registryCreds.reduce(
        (acc, cred) => {
          acc.auths[cred.registry] = {
            ...pick(cred, ['username', 'password', 'email']),
            auth: Base64.encode(`${cred.username}:${cred.password}`),
          };
          return acc;
        },
        { auths: {} },
      );

      data = dockerconfigjson
        ? { ['.dockerconfigjson']: Base64.btoa(JSON.stringify(dockerconfigjson)) }
        : '';
    } else {
      data = values.image.dockerconfig
        ? {
            ['.dockercfg']: Base64.encode(
              JSON.stringify(JSON.parse(Base64.decode(values.image.dockerconfig))),
            ),
          }
        : '';
    }
  } else if (values.type === SecretTypeDropdownLabel.source) {
    if (values.source.authType === SourceSecretType.basic) {
      const authObj = pick(values.source, ['username', 'password']);
      data = Object.entries(authObj).reduce((acc, [key, value]) => {
        acc[key] = Base64.encode(value);
        return acc;
      }, {});
    } else {
      const SSH_KEY = 'ssh-privatekey';
      data[SSH_KEY] = values.source[SSH_KEY];
    }
  }
  const secretResource: SecretKind = {
    apiVersion: SecretModel.apiVersion,
    kind: SecretModel.kind,
    metadata: {
      name: values.name,
      namespace,
    },
    type: getKubernetesSecretType(values),
    data,
  };

  return secretResource;
};

export const getTargetLabelsForRemoteSecret = (
  values: AddSecretFormValues,
): { [key: string]: string } => {
  const { secretFor } = values;
  const labels = {
    [SecretByUILabel]: secretFor,
  };
  return labels;
};

export const getLabelsForSecret = (values: AddSecretFormValues): { [key: string]: string } => {
  if (!values.source?.host && (!values.labels || values.labels.length === 0)) {
    // if no labels quit early
    return null;
  }

  const labels = {};
  if (values.labels && values.labels.length > 0) {
    // get user defined labels
    values.labels.map(({ key, value }) => {
      if (key && value) {
        labels[key] = value;
      }
    });
  }

  if (values?.source?.host) {
    // get scm labels for host
    labels[SecretLabels.CREDENTIAL_LABEL] = SecretLabels.CREDENTIAL_VALUE;
    labels[SecretLabels.HOST_LABEL] = values.source.host;
  }
  return labels;
};

export const getAnnotationForSecret = (values: AddSecretFormValues): { [key: string]: string } => {
  if (!values.source?.repo) {
    // get scm annotation for repository
    return null;
  }
  return { [SecretLabels.REPO_ANNOTATION]: values.source.repo };
};

export const statusFromConditions = (
  conditions: SecretCondition[],
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

export const getSecretRowLabels = (obj: SecretKind): any => {
  const secretLabels = obj
    ? Object.keys(obj?.metadata?.labels || {})
        .map((k) => `${k}=${obj.metadata?.labels[k]}`)
        .join(', ') || '-'
    : '-';
  return {
    secretLabels,
  };
};

export const getSecretTypetoLabel = (obj: SecretKind) => {
  if (!obj) {
    return;
  }
  const type = typeToLabel(obj.type);

  const secretType =
    type === SecretTypeDisplayLabel.keyValue && obj.data
      ? `${type} (${Object.keys(obj.data).length})`
      : type || '-';
  return secretType;
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

export const getAddSecretBreadcrumbs = () => {
  return [
    { path: '/application-pipeline/secrets', name: 'Secrets' },
    { path: '#', name: 'Add secret' },
  ];
};
