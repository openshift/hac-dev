import * as React from 'react';
import { Title } from '@patternfly/react-core';
import { usePLRVulnerabilities } from '../../../hooks/useScanResults';
import { Table } from '../../../shared';
import { PipelineRunKind } from '../../../types';
import PipelineRunEmptyState from '../../PipelineRunDetailsView/PipelineRunEmptyState';
import { PipelineRunListHeaderWithVulnerabilities } from '../../PipelineRunListView/PipelineRunListHeader';
import { PipelineRunListRowWithVulnerabilities } from '../../PipelineRunListView/PipelineRunListRow';

type CommitsPipelineRunTabProps = {
  commit?: string;
  pipelineRuns: PipelineRunKind[];
  applicationName: string;
};
const CommitsPipelineRunTab: React.FC<CommitsPipelineRunTabProps> = ({
  pipelineRuns,
  applicationName,
}) => {
  const vulnerabilities = usePLRVulnerabilities(pipelineRuns);

  if (!pipelineRuns || pipelineRuns.length === 0) {
    return <PipelineRunEmptyState applicationName={applicationName} />;
  }

  pipelineRuns?.sort(
    (app1, app2) =>
      +new Date(app2.metadata.creationTimestamp) - +new Date(app1.metadata.creationTimestamp),
  );

  return (
    <>
      <Title headingLevel="h4" className="pf-v5-c-title pf-v5-u-mt-lg pf-v5-u-mb-lg">
        Pipeline runs
      </Title>
      <Table
        data={pipelineRuns}
        aria-label="Pipelinerun List"
        Header={PipelineRunListHeaderWithVulnerabilities}
        loaded
        customData={vulnerabilities}
        Row={PipelineRunListRowWithVulnerabilities}
        getRowProps={(obj: PipelineRunKind) => ({
          id: obj.metadata.name,
        })}
      />
    </>
  );
};

export default CommitsPipelineRunTab;
