import { k8sCreateResource } from '@openshift/dynamic-plugin-sdk-utils';
import * as yup from 'yup';
import { ReleaseGroupVersionKind, ReleaseModel } from '../../../../models';
import { ReleaseKind } from '../../../../types/coreBuildService';
import { resourceNameYupValidation } from '../../../../utils/validation-utils';

export enum ReleasePipelineLocation {
  current,
  target,
}

const getIssues = (issues): { id: string; source: string }[] => {
  return issues?.map((issue) => {
    return { id: issue.id, source: issue.url };
  });
};

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
  releasePlan: resourceNameYupValidation,
  snapshot: resourceNameYupValidation,
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
          fixed: getIssues(issues),
          cves,
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
