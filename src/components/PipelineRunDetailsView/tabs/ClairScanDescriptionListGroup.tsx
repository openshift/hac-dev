import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
} from '@patternfly/react-core';
import { PipelineRunLabel } from '../../../consts/pipelinerun';
import { getClairScanResults } from '../../../hooks/useClairScanResults';
import ExternalLink from '../../../shared/components/links/ExternalLink';
import { TaskRunKind } from '../../../types';
import { useWorkspaceInfo } from '../../../utils/workspace-context-utils';
import HelpPopover from '../../HelpPopover';
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
        <HelpPopover
          bodyContent={
            <>
              Clair-scan is a task in a pipeline run that scans your components for potential
              vulnerabilities.{' '}
              <ExternalLink
                href="https://www.redhat.com/en/topics/containers/what-is-clair"
                showIcon
              >
                Read more about Clair
              </ExternalLink>
            </>
          }
        />
      </DescriptionListTerm>
      <DescriptionListDescription>
        {scanResults?.vulnerabilities ? <ClairScanDetailStatus scanResults={scanResults} /> : '-'}
        {scanTaskRun && showLogsLink ? (
          <div>
            <Link
              to={`/application-pipeline/workspaces/${workspace}/applications/${
                scanTaskRun.metadata.labels[PipelineRunLabel.APPLICATION]
              }/taskruns/${scanTaskRun.metadata.name}/logs`}
              className="pf-u-font-weight-normal"
            >
              View logs
            </Link>
          </div>
        ) : null}
      </DescriptionListDescription>
    </DescriptionListGroup>
  );
};

export default ClairScanDescriptionListGroup;
