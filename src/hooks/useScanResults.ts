import * as React from 'react';
import { TektonResourceLabel, TaskRunKind } from '../types';
import { useWorkspaceInfo } from '../utils/workspace-context-utils';
import { useTaskRuns } from './useTaskRuns';

export const SCAN_RESULT = 'CLAIR_SCAN_RESULT';
export const SCAN_RESULTS = 'CLAIR_SCAN_RESULTS';
export const CVE_SCAN_RESULT = 'CVE_SCAN_RESULT';
export const TEKTON_SCAN_RESULTS = 'TEKTON_SCAN_RESULTS';

export type ScanResults = {
  vulnerabilities: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
};

export const getScanResults = (taskRuns: TaskRunKind[]): [ScanResults, TaskRunKind[]] => {
  const scanResults = taskRuns.reduce(
    (acc, scanTaskRun) => {
      const taskScanResult = scanTaskRun?.status?.taskResults?.find(
        (result) =>
          result.name === SCAN_RESULT ||
          result.name === SCAN_RESULTS ||
          result.name === CVE_SCAN_RESULT ||
          result.name === TEKTON_SCAN_RESULTS,
      );
      if (taskScanResult) {
        acc[1].push(scanTaskRun);
        try {
          const resultObj: ScanResults = JSON.parse(taskScanResult.value);
          acc[0].vulnerabilities.critical += resultObj.vulnerabilities?.critical ?? 0;
          acc[0].vulnerabilities.high += resultObj.vulnerabilities?.high ?? 0;
          acc[0].vulnerabilities.medium += resultObj.vulnerabilities?.medium ?? 0;
          acc[0].vulnerabilities.low += resultObj.vulnerabilities?.low ?? 0;
        } catch (e) {
          // ignore
        }
      }
      return acc;
    },
    [
      {
        vulnerabilities: {
          critical: 0,
          high: 0,
          medium: 0,
          low: 0,
        },
      },
      [],
    ] as [ScanResults, TaskRunKind[]],
  );

  if (scanResults[1].length) {
    return scanResults;
  }
  return [null, []];
};

export const useScanResults = (pipelineRun: string): [ScanResults, boolean] => {
  const { namespace } = useWorkspaceInfo();
  // not passing pipelinerun name here to avoid extra network calls
  const [taskRuns, loaded] = useTaskRuns(namespace, pipelineRun);

  return React.useMemo(() => {
    if (!loaded || !pipelineRun) {
      return [null, loaded];
    }

    const taskRunsForPR = taskRuns.filter(
      (taskRun) => taskRun.metadata?.labels?.[TektonResourceLabel.pipelinerun] === pipelineRun,
    );

    const [resultObj] = getScanResults(taskRunsForPR);
    return [resultObj, loaded];
  }, [loaded, pipelineRun, taskRuns]);
};
