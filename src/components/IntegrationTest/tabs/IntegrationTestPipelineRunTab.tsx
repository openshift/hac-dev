import * as React from 'react';
import { Bullseye, Spinner, Title } from '@patternfly/react-core';
import { usePipelineRunsWithStatus } from '../../../hooks';
import { Table } from '../../../shared';
import { PipelineRunKind } from '../../../types';
import { useWorkspaceInfo } from '../../../utils/workspace-context-utils';
import PipelineRunEmptyState from '../../PipelineRunDetailsView/PipelineRunEmptyState';
import { PipelineRunListHeader } from '../../PipelineRunListView/PipelineRunListHeader';
import PipelineRunListRow from '../../PipelineRunListView/PipelineRunListRow';
import { IntegrationTestLabels } from '../IntegrationTestForm/types';

type IntegrationTestPipelineRunTabProps = { applicationName: string; testName: string };
const IntegrationTestPipelineRunTab: React.FC<IntegrationTestPipelineRunTabProps> = ({
  applicationName,
  testName,
}) => {
  const { namespace } = useWorkspaceInfo();

  const [pipelineRunsWithStatus, loaded] = usePipelineRunsWithStatus(namespace, applicationName, {
    [IntegrationTestLabels.SCENARIO]: testName,
  });

  if (!loaded) {
    return (
      <Bullseye>
        <Spinner />
      </Bullseye>
    );
  }

  if (!pipelineRunsWithStatus || pipelineRunsWithStatus.length === 0) {
    return <PipelineRunEmptyState applicationName={applicationName} />;
  }

  pipelineRunsWithStatus?.sort(
    (app1, app2) =>
      +new Date(app2.metadata.creationTimestamp) - +new Date(app1.metadata.creationTimestamp),
  );

  return (
    <>
      <Title headingLevel="h3" className="pf-c-title pf-u-mt-lg pf-u-mb-lg">
        Pipeline runs
      </Title>
      <Table
        data={pipelineRunsWithStatus}
        aria-label="Pipeline run List"
        Header={PipelineRunListHeader}
        Row={PipelineRunListRow}
        loaded={loaded}
        getRowProps={(obj: PipelineRunKind) => ({
          id: obj.metadata.name,
        })}
      />
    </>
  );
};

export default IntegrationTestPipelineRunTab;
