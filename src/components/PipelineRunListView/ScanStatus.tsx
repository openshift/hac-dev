import React from 'react';
import { Skeleton } from '@patternfly/react-core';
import { useScanResults } from '../../hooks/useScanResults';
import { ScanDetailStatus } from '../PipelineRunDetailsView/tabs/ScanDetailStatus';

export const ScanStatus: React.FC<{ pipelineRunName: string }> = ({ pipelineRunName }) => {
  const [scanResults, loaded] = useScanResults(pipelineRunName);

  if (!loaded) {
    return <Skeleton screenreaderText="Loading Vulnerability Scan status" />;
  }

  if (!scanResults?.vulnerabilities) {
    return <>-</>;
  }

  return <ScanDetailStatus scanResults={scanResults} />;
};
