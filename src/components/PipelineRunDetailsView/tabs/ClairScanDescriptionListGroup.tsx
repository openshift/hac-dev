import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Popover,
} from '@patternfly/react-core';
import { QuestionCircleIcon } from '@patternfly/react-icons/dist/js/icons/question-circle-icon';
import { PipelineRunLabel } from '../../../consts/pipelinerun';
import { getClairScanResults } from '../../../hooks/useClairScanResults';
import { TaskRunKind } from '../../../types';
import { useWorkspaceInfo } from '../../../utils/workspace-context-utils';
import { ClairScanDetailStatus } from './ClairScanDetailStatus';

type Props = {
  taskRuns: TaskRunKind[];
  showLogsLink?: boolean;
  hideIfNotFound?: boolean;
};

const ClairScanDescriptionListGroup: React.FC<Props> = ({
  taskRuns,
  hideIfNotFound,
  showLogsLink,
}) => {
  const { workspace } = useWorkspaceInfo();
  const [scanResults, scanTaskRun] = getClairScanResults(taskRuns);

  if (!scanTaskRun && hideIfNotFound) {
    return null;
  }

  return (
    <DescriptionListGroup>
      <DescriptionListTerm>
        Vulnerabilities scan{' '}
        <Popover
          aria-label="Vulnerability scan"
          headerContent="Vulnerability scan"
          bodyContent="Clair-scan is a task in a pipeline run that scans your components for potential vulnerabilities."
        >
          <QuestionCircleIcon />
        </Popover>{' '}
        {scanTaskRun && showLogsLink ? (
          <Link
            to={`/stonesoup/workspaces/${workspace}/applications/${
              scanTaskRun.metadata.labels[PipelineRunLabel.APPLICATION]
            }/taskruns/${scanTaskRun.metadata.name}/logs`}
            className="pf-u-font-weight-normal"
          >
            See logs
          </Link>
        ) : null}
      </DescriptionListTerm>
      <DescriptionListDescription>
        {scanResults?.vulnerabilities ? <ClairScanDetailStatus scanResults={scanResults} /> : '-'}
      </DescriptionListDescription>
    </DescriptionListGroup>
  );
};

export default ClairScanDescriptionListGroup;
