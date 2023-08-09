import * as React from 'react';
import { PipelineRunLabel, PipelineRunType } from '../consts/pipelinerun';
import { PipelineRunKind } from '../types';
import { getCommitSha } from '../utils/commits-utils';
import { useComponents } from './useComponents';
import { usePipelineRuns } from './usePipelineRuns';

export const useBuildPipelines = (
  namespace: string,
  applicationName: string,
  // TODO inefficient to get all builds without a commit
  commit?: string,
  includeComponents?: boolean,
): [PipelineRunKind[], boolean, unknown] => {
  const [components, componentsLoaded] = useComponents(namespace, applicationName);

  const [pipelines, loaded, error] = usePipelineRuns(
    includeComponents ? (componentsLoaded ? namespace : null) : namespace,
    React.useMemo(
      () => ({
        selector: {
          matchLabels: {
            [PipelineRunLabel.APPLICATION]: applicationName,
            [PipelineRunLabel.PIPELINE_TYPE]: PipelineRunType.BUILD,
          },
          ...(includeComponents &&
            componentsLoaded && {
              matchExpressions: [
                {
                  key: `${PipelineRunLabel.COMPONENT}`,
                  operator: 'In',
                  values: components?.map((c) => c.metadata?.name),
                },
              ],
            }),
        },

        limit: includeComponents ? components.length : 50,
      }),
      [applicationName, includeComponents, components, componentsLoaded],
    ),
  );

  return React.useMemo(() => {
    if (!commit) {
      return [pipelines, loaded, error];
    }
    return [
      loaded ? pipelines.filter((pipeline) => getCommitSha(pipeline) === commit) : [],
      loaded,
      error,
    ];
  }, [commit, error, loaded, pipelines]);
};
