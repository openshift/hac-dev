import * as React from 'react';
import { MatchLabels, useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { PipelineRunLabel } from '../consts/pipelinerun';
import { PipelineRunGroupVersionKind } from '../models';
import { PipelineRunKind, TektonResourceLabel } from '../types';
import { getScanResults, ScanResults } from './useScanResults';
import { useTaskRuns } from './useTaskRuns';

type PipelineRunWithStatus = PipelineRunKind & { scanResults: ScanResults };

export const usePipelineRunsWithStatus = (
  namespace: string,
  applicationName: string,
  pipelineRunLabels?: MatchLabels,
): [PipelineRunWithStatus[], boolean, unknown] => {
  const [taskRuns, taskRunsLoaded] = useTaskRuns(namespace);
  const [pipelineRuns, pipelineRunsLoaded, loadErr] = useK8sWatchResource<PipelineRunKind[]>({
    groupVersionKind: PipelineRunGroupVersionKind,
    namespace,
    isList: true,
    selector: {
      matchLabels: {
        [PipelineRunLabel.APPLICATION]: applicationName,
        ...pipelineRunLabels,
      },
    },
  });

  return React.useMemo(() => {
    if (pipelineRunsLoaded && taskRunsLoaded) {
      return [
        pipelineRuns.map((pipelineRun) => {
          const taskRunsForPR = taskRuns.filter(
            (taskRun) =>
              taskRun.metadata?.labels?.[TektonResourceLabel.pipelinerun] ===
              pipelineRun.metadata.name,
          );

          const scanResults = getScanResults(taskRunsForPR)[0];
          return {
            ...pipelineRun,
            scanResults,
          };
        }),
        true,
        loadErr,
      ];
    }
    if (pipelineRunsLoaded) {
      return [
        pipelineRuns.map((pipelineRun) => {
          return {
            ...pipelineRun,
            scanResults: undefined,
          };
        }),
        true,
        loadErr,
      ];
    }
    return [[], false, loadErr];
  }, [loadErr, pipelineRuns, pipelineRunsLoaded, taskRuns, taskRunsLoaded]);
};
