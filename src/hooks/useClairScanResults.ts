import * as React from 'react';
import { TektonResourceLabel, TaskRunKind } from '../types';
import { useWorkspaceInfo } from '../utils/workspace-context-utils';
import { useTaskRuns } from './useTaskRuns';

export const SCAN_TASK = 'clair-scan';
export const SCAN_RESULT = 'CLAIR_SCAN_RESULT';

export type ClairScanResult = {
  vulnerabilities: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
};

export const getClairScanResults = (taskRuns: TaskRunKind[]): [ClairScanResult, TaskRunKind] => {
  const scanTaskRun = taskRuns?.find(
    (tr) => tr?.metadata?.labels?.[TektonResourceLabel.pipelineTask] === SCAN_TASK,
  );
  const scanResult = scanTaskRun?.status?.taskResults?.find(
    (result) => result.name === SCAN_RESULT,
  );

  if (scanResult) {
    try {
      const resultObj: ClairScanResult = JSON.parse(scanResult.value);
      return [resultObj, scanTaskRun];
    } catch (e) {
      // ignore
    }
  }
  return [null, scanTaskRun];
};

export const useClairScanResults = (pipelineRun: string): [ClairScanResult, boolean] => {
  const { namespace } = useWorkspaceInfo();
  // not passing pipelinerun name here to avoid extra network calls
  const [clairScanRuns, loaded] = useTaskRuns(namespace, null, SCAN_TASK);

  return React.useMemo(() => {
    if (!loaded || !pipelineRun) {
      return [null, loaded];
    }

    const taskRunForPR = clairScanRuns.find(
      (taskRun) => taskRun.metadata?.labels?.[TektonResourceLabel.pipelinerun] === pipelineRun,
    );

    const [resultObj] = getClairScanResults([taskRunForPR]);
    return [resultObj, loaded];
  }, [loaded, pipelineRun, clairScanRuns]);
};
