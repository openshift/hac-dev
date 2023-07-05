import * as React from 'react';
import { TektonResourceLabel, TaskRunKind, TektonResultsRun } from '../types';
import { OR } from '../utils/tekton-results';
import { useWorkspaceInfo } from '../utils/workspace-context-utils';
import { useTRTaskRuns } from './useTektonResults';

export const SCAN_RESULT = 'CLAIR_SCAN_RESULT';
export const SCAN_RESULTS = 'CLAIR_SCAN_RESULTS';
export const CVE_SCAN_RESULT = 'CVE_SCAN_RESULT';
export const TEKTON_SCAN_RESULTS = 'TEKTON_SCAN_RESULTS';

export const CVE_SCAN_RESULT_FIELDS = [
  SCAN_RESULT,
  SCAN_RESULTS,
  CVE_SCAN_RESULT,
  TEKTON_SCAN_RESULTS,
];

export const isCVEScanResult = (taskRunResults: TektonResultsRun) =>
  CVE_SCAN_RESULT_FIELDS.includes(taskRunResults?.name);

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
      const taskScanResult = scanTaskRun?.status?.taskResults?.find((result) =>
        isCVEScanResult(result),
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

export const useScanResults = (
  pipelineRunName: string,
  // enable cache only if the pipeline run has completed
  cache?: boolean,
): [ScanResults, boolean] => {
  const { namespace } = useWorkspaceInfo();
  // Fetch directly from tekton-results because a task result is only present on completed tasks runs.
  const [taskRuns, loaded] = useTRTaskRuns(
    pipelineRunName ? namespace : null,
    React.useMemo(
      () => ({
        filter: OR(
          ...CVE_SCAN_RESULT_FIELDS.map((field) => `data.status.taskResults.contains("${field}")`),
        ),
        selector: {
          matchLabels: {
            [TektonResourceLabel.pipelinerun]: pipelineRunName,
          },
        },
      }),
      [pipelineRunName],
    ),
    cache ? `useScaneResults-${pipelineRunName}` : undefined,
  );

  return React.useMemo(() => {
    if (!loaded || !pipelineRunName) {
      return [null, loaded];
    }

    const [resultObj] = getScanResults(taskRuns);
    return [resultObj, loaded];
  }, [loaded, pipelineRunName, taskRuns]);
};
