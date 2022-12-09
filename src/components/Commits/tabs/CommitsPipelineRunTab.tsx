import * as React from 'react';
import { Title } from '@patternfly/react-core';
import { Table } from '../../../shared';
import { PipelineRunKind } from '../../../types';
import PipelineRunEmptyState from '../../PipelineRunDetailsView/PipelineRunEmptyState';
import { PipelineRunListHeader } from '../../PipelineRunListView/PipelineRunListHeader';
import PipelineRunListRow from '../../PipelineRunListView/PipelineRunListRow';

type CommitsPipelineRunTabProps = {
  commit?: string;
  pipelineRuns: PipelineRunKind[];
  applicationName: string;
};
const CommitsPipelineRunTab: React.FC<CommitsPipelineRunTabProps> = ({
  pipelineRuns,
  applicationName,
}) => {
  if (!pipelineRuns || pipelineRuns.length === 0) {
    return <PipelineRunEmptyState applicationName={applicationName} />;
  }

  pipelineRuns?.sort(
    (app1, app2) =>
      +new Date(app2.metadata.creationTimestamp) - +new Date(app1.metadata.creationTimestamp),
  );

  return (
    <>
      <Title headingLevel="h4" className="pf-c-title pf-u-mt-lg pf-u-mb-lg">
        Pipeline runs
      </Title>
      <Table
        data={pipelineRuns}
        aria-label="Pipelinerun List"
        Header={PipelineRunListHeader}
        loaded
        Row={PipelineRunListRow}
        getRowProps={(obj: PipelineRunKind) => ({
          id: obj.metadata.name,
        })}
      />
    </>
  );
};

export default CommitsPipelineRunTab;
