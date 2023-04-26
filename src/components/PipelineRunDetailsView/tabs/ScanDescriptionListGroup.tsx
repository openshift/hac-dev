import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  ButtonVariant,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Popover,
} from '@patternfly/react-core';
import { PipelineRunLabel } from '../../../consts/pipelinerun';
import { getScanResults } from '../../../hooks/useScanResults';
import { TaskRunKind, TektonResourceLabel } from '../../../types';
import { useWorkspaceInfo } from '../../../utils/workspace-context-utils';
import { ScanDetailStatus } from './ScanDetailStatus';

import './ScanDescriptionListGroup.scss';

type Props = {
  taskRuns: TaskRunKind[];
  showLogsLink?: boolean;
  hideIfNotFound?: boolean;
  popoverAppendTo?: boolean;
};

const ScanDescriptionListGroup: React.FC<Props> = ({
  taskRuns,
  hideIfNotFound,
  showLogsLink,
  popoverAppendTo = true,
}) => {
  const { workspace } = useWorkspaceInfo();
  const [scanResults, scanTaskRuns] = getScanResults(taskRuns);

  if (!scanTaskRuns?.length && hideIfNotFound) {
    return null;
  }

  const renderLogsLink = () => {
    if (!showLogsLink) {
      return null;
    }
    if (scanTaskRuns.length === 1) {
      return (
        <Link
          to={`/application-pipeline/workspaces/${workspace}/applications/${
            scanTaskRuns[0].metadata.labels[PipelineRunLabel.APPLICATION]
          }/taskruns/${scanTaskRuns[0].metadata.name}/logs`}
          className="pf-u-font-weight-normal"
        >
          View logs
        </Link>
      );
    }

    return (
      <Popover
        appendTo={
          popoverAppendTo ? () => document.querySelector('#hacDev-modal-container') : undefined
        }
        className="scan-description-list__popover"
        data-testid="scan-description-list-popover-test-id"
        bodyContent={
          <div className="scan-description-list__tooltip">
            <div className="scan-description-list__tooltip-title">View logs</div>
            <div className="scan-description-list__tooltip-description">
              View logs for each task run individually
            </div>
            {scanTaskRuns.map((scanTaskRun) => (
              <div key={scanTaskRun.metadata.uid} className="scan-description-list__tooltip-task">
                {scanTaskRun.metadata?.labels?.[TektonResourceLabel.pipelineTask] ||
                  scanTaskRun.metadata.name}
                <Link
                  to={`/application-pipeline/workspaces/${workspace}/applications/${
                    scanTaskRun.metadata.labels[PipelineRunLabel.APPLICATION]
                  }/taskruns/${scanTaskRun.metadata.name}/logs`}
                  className="pf-u-font-weight-normal scan-description-list__tooltip-link"
                >
                  <span
                    data-testid={`${
                      scanTaskRun.metadata?.labels?.[TektonResourceLabel.pipelineTask] ||
                      scanTaskRun.metadata.name
                    }-link-test-id`}
                  >
                    View logs
                  </span>
                </Link>
              </div>
            ))}
          </div>
        }
      >
        <Button
          variant={ButtonVariant.link}
          className="pf-u-px-0"
          data-testid="view-logs-popover-trigger-test-id"
        >
          View logs
        </Button>
      </Popover>
    );
  };

  return (
    <DescriptionListGroup>
      <DescriptionListTerm>Vulnerabilities scan</DescriptionListTerm>
      <DescriptionListDescription>
        {scanResults?.vulnerabilities ? <ScanDetailStatus scanResults={scanResults} /> : '-'}
        {renderLogsLink()}
      </DescriptionListDescription>
    </DescriptionListGroup>
  );
};

export default ScanDescriptionListGroup;
