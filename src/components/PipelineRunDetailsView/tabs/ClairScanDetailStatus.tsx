import React from 'react';
import { Link } from 'react-router-dom';
import { Spinner } from '@patternfly/react-core';
import { useClairScanResults } from '../../../hooks/useClairScanResults';
import { useWorkspaceInfo } from '../../../utils/workspace-context-utils';
import {
  CriticalIcon,
  HighIcon,
  LowIcon,
  MediumIcon,
} from '../../PipelineRunListView/ClairScanStatus';

export const ClairScanDetailStatus: React.FC<{ pipelineRunName: string }> = ({
  pipelineRunName,
}) => {
  const [scanResults, loaded] = useClairScanResults(pipelineRunName);
  const { workspace, namespace } = useWorkspaceInfo();

  if (!loaded) {
    return <Spinner isSVG size="lg" aria-label="Loading Vulnerability Scan details" />;
  }

  if (!scanResults?.vulnerabilities) {
    return <>-</>;
  }

  return (
    <>
      <CriticalIcon />
      Critical{' '}
      <span className="pf-u-font-weight-bold pf-u-ml-sm pf-u-mr-md">
        {scanResults.vulnerabilities.critical}
      </span>
      <HighIcon />
      High{' '}
      <span className="pf-u-font-weight-bold pf-u-ml-sm pf-u-mr-md">
        {scanResults.vulnerabilities.high}
      </span>
      <MediumIcon />
      Medium{' '}
      <span className="pf-u-font-weight-bold pf-u-ml-sm pf-u-mr-md">
        {scanResults.vulnerabilities.medium}
      </span>
      <LowIcon />
      Low{' '}
      <span className="pf-u-font-weight-bold pf-u-ml-sm pf-u-mr-md">
        {scanResults.vulnerabilities.low}
      </span>
      <div>
        <Link
          to={`/stonesoup/workspaces/${workspace}/applications/${namespace}/pipelineruns/${pipelineRunName}/logs`}
        >
          View logs
        </Link>
      </div>
    </>
  );
};
