import { k8sCreateResource } from '@openshift/dynamic-plugin-sdk-utils';
import * as yup from 'yup';
import {
  MAX_RESOURCE_NAME_LENGTH,
  resourceNameRegex,
  RESOURCE_NAME_LENGTH_ERROR_MSG,
  RESOURCE_NAME_REGEX_MSG,
} from '../../../../components/ImportForm/utils/validation-utils';
import { ReleaseModel, ReleasePlanGroupVersionKind } from '../../../../models';
import { ReleaseKind, ReleasePlanKind } from '../../../../types/coreBuildService';

export enum ReleasePipelineLocation {
  current,
  target,
}

export type TriggerReleaseFormValues = {
  releasePlan: string;
  snapshot: string;
  synopsis: string;
  topic: string;
  description?: string;
  solution?: string;
  references: string;
  issues?: string[];
  labels?: { key: string; value: string }[];
};

export const triggerReleaseFormSchema = yup.object({
  releasePlan: yup
    .string()
    .matches(resourceNameRegex, RESOURCE_NAME_REGEX_MSG)
    .max(MAX_RESOURCE_NAME_LENGTH, RESOURCE_NAME_LENGTH_ERROR_MSG)
    .required('Required'),
  snapshot: yup
    .string()
    .matches(resourceNameRegex, RESOURCE_NAME_REGEX_MSG)
    .max(MAX_RESOURCE_NAME_LENGTH, RESOURCE_NAME_LENGTH_ERROR_MSG)
    .required('Required'),
});

export const createRelease = async (
  values: TriggerReleaseFormValues,
  namespace: string,
  releasePlan: ReleasePlanKind,
) => {
  const {
    releasePlan: rp,
    snapshot,
    topic,
    labels: labelPairs,
    description,
    solution,
    issues,
    synopsis,
  } = values;

  const labels = labelPairs
    .filter((l) => !!l.key)
    .reduce((acc, o) => ({ ...acc, [o.key]: o.value }), {} as Record<string, string>);
  const resource: ReleaseKind = {
    apiVersion: `${ReleasePlanGroupVersionKind.group}/${ReleasePlanGroupVersionKind.version}`,
    kind: ReleasePlanGroupVersionKind.kind,
    metadata: {
      generateName: rp,
      namespace,
      labels: {
        ...releasePlan?.metadata?.labels,
        ...labels,
      },
      annotations: { ...releasePlan?.metadata?.annotations },
    },
    spec: {
      releasePlan: rp,
      snapshot,
      data: {
        advisory: {
          issues,
          synopsis,
          topic,
          description,
          solution,
        },
      },
    },
  };
  return k8sCreateResource({
    model: ReleaseModel,
    queryOptions: {
      ns: namespace,
    },
    resource,
  });
};
