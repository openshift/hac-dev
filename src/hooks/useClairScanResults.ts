import * as React from 'react';
import { TektonResourceLabel } from '../types';
import { useWorkspaceInfo } from '../utils/workspace-context-utils';
import { useTaskRuns } from './useTaskRuns';

const SCAN_TASK = 'clair-scan';
const SCAN_RESULT = 'CLAIR_SCAN_RESULT';

export type ClairScanResult = {
  vulnerabilities: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
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
    const scanResult = taskRunForPR?.status?.taskResults?.find(
      (result) => result.name === SCAN_RESULT,
    );
    if (!scanResult) {
      return [null, loaded];
    }

    try {
      const resultObj: ClairScanResult = JSON.parse(scanResult.value);
      return [resultObj, loaded];
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Error while extracting clair scan result: ', e);
      return [null, loaded];
    }
  }, [loaded, pipelineRun, clairScanRuns]);
};
