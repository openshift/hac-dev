import * as React from 'react';
import { PipelineRunLabel, PipelineRunType } from '../consts/pipelinerun';
import { PipelineRunKind } from '../types';
import { usePipelineRuns } from './usePipelineRuns';

// TODO this request can be inefficient
export const useTestPipelines = (
  namespace: string,
  applicationName: string,
): [PipelineRunKind[], boolean, unknown] =>
  usePipelineRuns(
    namespace,
    React.useMemo(
      () => ({
        selector: {
          matchLabels: {
            [PipelineRunLabel.APPLICATION]: applicationName,
            [PipelineRunLabel.PIPELINE_TYPE]: PipelineRunType.TEST,
          },
        },
        // arbitrary limit since this query is unbounded
        limit: 100,
      }),
      [applicationName],
    ),
  ) as unknown as [PipelineRunKind[], boolean, unknown];
