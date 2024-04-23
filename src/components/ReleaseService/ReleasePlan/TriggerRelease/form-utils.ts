import { k8sCreateResource } from '@openshift/dynamic-plugin-sdk-utils';
import * as yup from 'yup';
import {
  MAX_RESOURCE_NAME_LENGTH,
  resourceNameRegex,
  RESOURCE_NAME_LENGTH_ERROR_MSG,
  RESOURCE_NAME_REGEX_MSG,
} from '../../../../components/ImportForm/utils/validation-utils';
import { ReleaseGroupVersionKind, ReleaseModel } from '../../../../models';
import { ReleaseKind } from '../../../../types/coreBuildService';

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
  references?: string;
  issues?: any[];
  cves?: any[];
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

export const createRelease = async (values: TriggerReleaseFormValues, namespace: string) => {
  const {
    releasePlan: rp,
    snapshot,
    cves,
    topic,
    labels: labelPairs,
    description,
    solution,
    issues,
    references,
    synopsis,
  } = values;

  const labels = labelPairs
    .filter((l) => !!l.key)
    .reduce((acc, o) => ({ ...acc, [o.key]: o.value }), {} as Record<string, string>);

  const resource: ReleaseKind = {
    apiVersion: `${ReleaseGroupVersionKind.group}/${ReleaseGroupVersionKind.version}`,
    kind: ReleaseGroupVersionKind.kind,
    metadata: {
      generateName: rp,
      namespace,
      labels: {
        ...labels,
      },
    },
    spec: {
      releasePlan: rp,
      snapshot,
      data: {
        releaseNotes: {
          cves,
          issues,
          references,
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
