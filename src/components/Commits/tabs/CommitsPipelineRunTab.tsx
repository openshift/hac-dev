import * as React from 'react';
import { Title } from '@patternfly/react-core';
import { usePipelineRunsForCommit } from '../../../hooks/usePipelineRuns';
import { usePLRVulnerabilities } from '../../../hooks/useScanResults';
import { Table } from '../../../shared';
import ErrorEmptyState from '../../../shared/components/empty-state/ErrorEmptyState';
import { HttpError } from '../../../shared/utils/error/http-error';
import { PipelineRunKind } from '../../../types';
import { useWorkspaceInfo } from '../../../utils/workspace-context-utils';
import PipelineRunEmptyState from '../../PipelineRunDetailsView/PipelineRunEmptyState';
import { PipelineRunListHeaderWithVulnerabilities } from '../../PipelineRunListView/PipelineRunListHeader';
import { PipelineRunListRowWithVulnerabilities } from '../../PipelineRunListView/PipelineRunListRow';

type CommitsPipelineRunTabProps = {
  commitName: string;
  applicationName: string;
};
const CommitsPipelineRunTab: React.FC<React.PropsWithChildren<CommitsPipelineRunTabProps>> = ({
  commitName,
  applicationName,
}) => {
  const { namespace } = useWorkspaceInfo();
  const requestQueue = React.useRef<Function[]>([]);
  const [pipelineRuns, loaded, error, getNextPage] = usePipelineRunsForCommit(
    namespace,
    applicationName,
    commitName,
  );

  const vulnerabilities = usePLRVulnerabilities(pipelineRuns);

  React.useEffect(() => {
    if (
      vulnerabilities.fetchedPipelineRuns.length === pipelineRuns.length &&
      requestQueue.current.length &&
      !vulnerabilities.error
    ) {
      const [nextPage] = requestQueue.current;
      nextPage?.();
      requestQueue.current = [];
    }
  }, [vulnerabilities, pipelineRuns.length]);

  if (error) {
    const httpError = HttpError.fromCode(error ? (error as any).code : 404);
    return (
      <ErrorEmptyState
        httpError={httpError}
        title="Unable to load pipeline runs"
        body={httpError?.message.length > 0 ? httpError?.message : 'Something went wrong'}
      />
    );
  }

  if (loaded && (!pipelineRuns || pipelineRuns.length === 0)) {
    return <PipelineRunEmptyState applicationName={applicationName} />;
  }

  return (
    <>
      <Title headingLevel="h4" className="pf-v5-c-title pf-v5-u-mt-lg pf-v5-u-mb-lg">
        Pipeline runs
      </Title>
      <Table
        data={pipelineRuns}
        aria-label="Pipelinerun List"
        Header={PipelineRunListHeaderWithVulnerabilities}
        loaded={loaded}
        customData={vulnerabilities}
        Row={PipelineRunListRowWithVulnerabilities}
        getRowProps={(obj: PipelineRunKind) => ({
          id: obj.metadata.name,
        })}
        onRowsRendered={({ stopIndex }) => {
          if (loaded && stopIndex === pipelineRuns.length - 1) {
            if (vulnerabilities.fetchedPipelineRuns.length === pipelineRuns.length) {
              getNextPage?.();
            } else {
              if (requestQueue.current.length === 0) {
                getNextPage && requestQueue.current.push(getNextPage);
              }
            }
          }
        }}
      />
    </>
  );
};

export default CommitsPipelineRunTab;
