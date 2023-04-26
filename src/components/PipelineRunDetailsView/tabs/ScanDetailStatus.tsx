import * as React from 'react';
import {
  CriticalRiskIcon,
  AngleDoubleDownIcon,
  AngleDoubleUpIcon,
  EqualsIcon,
} from '@patternfly/react-icons/dist/js/icons';
import { global_palette_blue_300 as blueColor } from '@patternfly/react-tokens/dist/js/global_palette_blue_300';
import { global_palette_gold_400 as goldColor } from '@patternfly/react-tokens/dist/js/global_palette_gold_400';
import { global_palette_orange_300 as orangeColor } from '@patternfly/react-tokens/dist/js/global_palette_orange_300';
import { global_palette_red_200 as redColor } from '@patternfly/react-tokens/dist/js/global_palette_red_200';
import { ScanResults } from '../../../hooks/useScanResults';

import './ScanDetailStatus.scss';

export const CriticalIcon = () => <CriticalRiskIcon title="Critical" color={redColor.value} />;

export const HighIcon = () => <AngleDoubleUpIcon title="High" color={orangeColor.value} />;

export const MediumIcon = () => <EqualsIcon title="Medium" color={goldColor.value} />;

export const LowIcon = () => <AngleDoubleDownIcon title="Low" color={blueColor.value} />;

export const ScanDetailStatus: React.FC<{ scanResults: ScanResults }> = ({ scanResults }) => (
  <div className="scan-detail-status">
    <div className="scan-detail-status__severity" data-testid="scan-status-critical-test-id">
      <span className="scan-detail-status__severity-status">
        <CriticalIcon />
        Critical
      </span>
      <span className="scan-detail-status__severity-count">
        {scanResults.vulnerabilities.critical}
      </span>
    </div>
    <div className="scan-detail-status__severity" data-testid="scan-status-high-test-id">
      <span className="scan-detail-status__severity-status">
        <HighIcon />
        High
      </span>
      <span className="scan-detail-status__severity-count">{scanResults.vulnerabilities.high}</span>
    </div>
    <div className="scan-detail-status__severity" data-testid="scan-status-medium-test-id">
      <span className="scan-detail-status__severity-status">
        <MediumIcon />
        Medium
      </span>
      <span className="scan-detail-status__severity-count">
        {scanResults.vulnerabilities.medium}
      </span>
    </div>
    <div className="scan-detail-status__severity" data-testid="scan-status-low-test-id">
      <span className="scan-detail-status__severity-status">
        <LowIcon />
        Low
      </span>
      <span className="scan-detail-status__severity-count">{scanResults.vulnerabilities.low}</span>
    </div>
  </div>
);
