import * as React from 'react';
import { PipelineRunLabel, PipelineRunType } from '../consts/pipelinerun';
import { PipelineRunKind } from '../types';
import { usePipelineRuns } from './usePipelineRuns';

export const useBuildPipelines = (
  namespace: string,
  applicationName: string,
  // TODO inefficient to get all builds without a commit
  commit?: string,
): [PipelineRunKind[], boolean, unknown] =>
  usePipelineRuns(
    namespace,
    React.useMemo(
      () => ({
        selector: {
          matchLabels: {
            [PipelineRunLabel.APPLICATION]: applicationName,
            [PipelineRunLabel.PIPELINE_TYPE]: PipelineRunType.BUILD,
            ...(commit && { [PipelineRunLabel.COMMIT_LABEL]: commit }),
          },
        },
        limit: 100,
      }),
      [applicationName, commit],
    ),
    // TODO better way to do this?
  ) as unknown as [PipelineRunKind[], boolean, unknown];
