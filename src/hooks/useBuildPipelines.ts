import * as React from 'react';
import { PipelineRunLabel, PipelineRunType } from '../consts/pipelinerun';
import { PipelineRunKind } from '../types';
import { getCommitSha } from '../utils/commits-utils';
import { usePipelineRuns } from './usePipelineRuns';

export const useBuildPipelines = (
  namespace: string,
  applicationName: string,
  // TODO inefficient to get all builds without a commit
  commit?: string,
): [PipelineRunKind[], boolean, unknown] => {
  const [pipelines, loaded, error] = usePipelineRuns(
    namespace,
    React.useMemo(
      () => ({
        selector: {
          matchLabels: {
            [PipelineRunLabel.APPLICATION]: applicationName,
            [PipelineRunLabel.PIPELINE_TYPE]: PipelineRunType.BUILD,
          },
        },
        limit: 100,
      }),
      [applicationName],
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
