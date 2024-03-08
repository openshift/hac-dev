import { k8sCreateResource } from '@openshift/dynamic-plugin-sdk-utils';
import * as yup from 'yup';
import {
  gitUrlRegex,
  MAX_RESOURCE_NAME_LENGTH,
  resourceNameRegex,
  RESOURCE_NAME_LENGTH_ERROR_MSG,
  RESOURCE_NAME_REGEX_MSG,
} from '../../../../components/ImportForm/utils/validation-utils';
import { ResolverRefParams } from '../../../../components/IntegrationTest/IntegrationTestForm/utils/create-utils';
import { ReleasePlanGroupVersionKind, ReleasePlanModel } from '../../../../models';
import { Param } from '../../../../types';
import {
  ReleasePlanKind,
  ReleasePlanLabel,
  ResolverType,
} from '../../../../types/coreBuildService';

export enum ReleasePipelineLocation {
  current,
  target,
}

export type ReleaseFormValues = {
  name: string;
  application: string;
  autoRelease?: boolean;
  standingAttribution?: boolean;
  releasePipelineLocation: ReleasePipelineLocation;
  git: {
    url: string;
    revision: string;
    path: string;
  };
  serviceAccount?: string;
  target?: string;
  labels?: { key: string; value: string }[];
  params?: Param[];
  data?: string;
};

export const releaseFormSchema = yup.object({
  name: yup
    .string()
    .matches(resourceNameRegex, RESOURCE_NAME_REGEX_MSG)
    .max(MAX_RESOURCE_NAME_LENGTH, RESOURCE_NAME_LENGTH_ERROR_MSG)
    .required('Required'),
  application: yup.string().required('Required'),
  git: yup.object({
    url: yup.string().matches(gitUrlRegex).required('Required'),
    revision: yup.string().required('Required'),
    path: yup.string().required('Required'),
  }),
  serviceAccount: yup.string().when('releasePipelineLocation', {
    is: ReleasePipelineLocation.current,
    then: yup.string().required('Required'),
  }),
  target: yup.string().when('releasePipelineLocation', {
    is: ReleasePipelineLocation.target,
    then: yup.string().required('Required'),
  }),
});

export const releaseFormParams = (releasePlan: ReleasePlanKind) =>
  (releasePlan?.spec?.pipelineRef?.params?.filter(
    (p) =>
      p.name !== ResolverRefParams.URL &&
      p.name !== ResolverRefParams.REVISION &&
      p.name !== ResolverRefParams.PATH,
  ) ?? []) as Param[];

export const createRelease = async (
  values: ReleaseFormValues,
  namespace: string,
  workspace: string,
  dryRun?: boolean,
) => {
  const {
    name,
    application,
    serviceAccount,
    target,
    labels: labelPairs,
    releasePipelineLocation,
    git,
    data,
    params,
    autoRelease,
    standingAttribution,
  } = values;
  const targetWs = releasePipelineLocation === ReleasePipelineLocation.current ? workspace : target;
  const labels = labelPairs
    .filter((l) => !!l.key)
    .reduce((acc, o) => ({ ...acc, [o.key]: o.value }), {} as Record<string, string>);
  const resource: ReleasePlanKind = {
    apiVersion: `${ReleasePlanGroupVersionKind.group}/${ReleasePlanGroupVersionKind.version}`,
    kind: ReleasePlanGroupVersionKind.kind,
    metadata: {
      name,
      namespace,
      labels: {
        ...labels,
        ...(autoRelease ? { [ReleasePlanLabel.AUTO_RELEASE]: 'true' } : {}),
        ...(standingAttribution ? { [ReleasePlanLabel.STANDING_ATTRIBUTION]: 'true' } : {}),
      },
    },
    spec: {
      application,
      ...(data ? { data } : {}),
      serviceAccount,
      target: targetWs,
      pipelineRef: {
        resolver: ResolverType.GIT,
        params: [
          ...params,
          { name: ResolverRefParams.URL, value: git.url },
          { name: ResolverRefParams.REVISION, value: git.revision },
          { name: ResolverRefParams.PATH, value: git.path },
        ],
      },
    },
  };
  return k8sCreateResource({
    model: ReleasePlanModel,
    queryOptions: {
      name,
      ns: namespace,
      ...(dryRun && { queryParams: { dryRun: 'All' } }),
    },
    resource,
  });
};
