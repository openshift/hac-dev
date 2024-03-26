import * as React from 'react';
import { Bullseye, Spinner, Title } from '@patternfly/react-core';
import { PipelineRunLabel } from '../../../consts/pipelinerun';
import { usePipelineRuns } from '../../../hooks/usePipelineRuns';
import { Table } from '../../../shared';
import ErrorEmptyState from '../../../shared/components/empty-state/ErrorEmptyState';
import { HttpError } from '../../../shared/utils/error/http-error';
import { PipelineRunKind } from '../../../types';
import { useWorkspaceInfo } from '../../../utils/workspace-context-utils';
import PipelineRunEmptyState from '../../PipelineRunDetailsView/PipelineRunEmptyState';
import { PipelineRunListHeader } from '../../PipelineRunListView/PipelineRunListHeader';
import { PipelineRunListRow } from '../../PipelineRunListView/PipelineRunListRow';
import { IntegrationTestLabels } from '../IntegrationTestForm/types';

type IntegrationTestPipelineRunTabProps = { applicationName: string; testName: string };
const IntegrationTestPipelineRunTab: React.FC<
  React.PropsWithChildren<IntegrationTestPipelineRunTabProps>
> = ({ applicationName, testName }) => {
  const { namespace } = useWorkspaceInfo();

  // Todo add errors here
  const [pipelineRuns, loaded, error, getNextPage] = usePipelineRuns(
    namespace,
    React.useMemo(
      () => ({
        selector: {
          matchLabels: {
            [PipelineRunLabel.APPLICATION]: applicationName,
            [IntegrationTestLabels.SCENARIO]: testName,
          },
        },
      }),
      [applicationName, testName],
    ),
  );

  if (error) {
    const httpError = HttpError.fromCode(error ? (error as any).code : 404);
    return (
      <ErrorEmptyState
        httpError={httpError}
        title="Unable to load pipeline runs"
        body={httpError?.message.length ? httpError?.message : 'Something went wrong'}
      />
    );
  }

  if (!loaded) {
    return (
      <Bullseye>
        <Spinner />
      </Bullseye>
    );
  }

  if (!pipelineRuns || pipelineRuns.length === 0) {
    return <PipelineRunEmptyState applicationName={applicationName} />;
  }

  return (
    <>
      <Title headingLevel="h3" className="pf-v5-c-title pf-v5-u-mt-lg pf-v5-u-mb-lg">
        Pipeline runs
      </Title>
      <Table
        data={pipelineRuns}
        aria-label="Pipeline run List"
        Header={PipelineRunListHeader}
        Row={PipelineRunListRow}
        loaded={loaded}
        getRowProps={(obj: PipelineRunKind) => ({
          id: obj.metadata.name,
        })}
        onRowsRendered={({ stopIndex }) => {
          if (loaded && stopIndex === pipelineRuns.length - 1) {
            getNextPage?.();
          }
        }}
      />
    </>
  );
};

export default IntegrationTestPipelineRunTab;
