import * as React from 'react';
import { ClairScanResult } from '../../../hooks/useClairScanResults';
import {
  CriticalIcon,
  HighIcon,
  LowIcon,
  MediumIcon,
} from '../../PipelineRunListView/ClairScanStatus';

export const ClairScanDetailStatus: React.FC<{ scanResults: ClairScanResult }> = ({
  scanResults,
}) => (
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
  </>
);
