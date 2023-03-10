import React from 'react';
import { Skeleton } from '@patternfly/react-core';
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
import { useClairScanResults } from '../../hooks/useClairScanResults';

export const CriticalIcon = () => (
  <CriticalRiskIcon className="pf-u-mr-xs" title="Critical" color={redColor.value} />
);

export const HighIcon = () => (
  <AngleDoubleUpIcon className="pf-u-ml-sm pf-u-mr-xs" title="High" color={orangeColor.value} />
);

export const MediumIcon = () => (
  <EqualsIcon className="pf-u-ml-sm pf-u-mr-xs" title="Medium" color={goldColor.value} />
);

export const LowIcon = () => (
  <AngleDoubleDownIcon className="pf-u-ml-sm pf-u-mr-xs" title="Low" color={blueColor.value} />
);

export const ClairScanStatus: React.FC<{ pipelineRunName: string }> = ({ pipelineRunName }) => {
  const [scanResults, loaded] = useClairScanResults(pipelineRunName);

  if (!loaded) {
    return <Skeleton screenreaderText="Loading Vulnerability Scan status" />;
  }

  if (!scanResults?.vulnerabilities) {
    return <>-</>;
  }

  return (
    <>
      <CriticalIcon /> {scanResults.vulnerabilities.critical}
      <HighIcon /> {scanResults.vulnerabilities.high}
      <MediumIcon /> {scanResults.vulnerabilities.medium}
      <LowIcon /> {scanResults.vulnerabilities.low}
    </>
  );
};
