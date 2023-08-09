import * as React from 'react';
import { PipelineRunLabel, PipelineRunType } from '../consts/pipelinerun';
import { PipelineRunKind } from '../types';
import { useComponents } from './useComponents';
import { usePipelineRuns } from './usePipelineRuns';

// TODO this request can be inefficient
export const useTestPipelines = (
  namespace: string,
  applicationName: string,
  includeComponents?: boolean,
): [PipelineRunKind[], boolean, unknown] => {
  const [components, componentsLoaded] = useComponents(namespace, applicationName);

  return usePipelineRuns(
    includeComponents ? (componentsLoaded ? namespace : null) : namespace,
    React.useMemo(
      () => ({
        selector: {
          matchLabels: {
            [PipelineRunLabel.APPLICATION]: applicationName,
            [PipelineRunLabel.PIPELINE_TYPE]: PipelineRunType.TEST,
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
        // arbitrary limit since this query is unbounded
        limit: includeComponents ? components.length : 50,
      }),
      [applicationName, includeComponents, components, componentsLoaded],
    ),
  ) as unknown as [PipelineRunKind[], boolean, unknown];
};
