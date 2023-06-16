import * as React from 'react';
import { Link } from 'react-router-dom';
import { Button, Popover, Skeleton } from '@patternfly/react-core';
import { PipelineRunLabel } from '../../consts/pipelinerun';
import { usePipelineRunsForCommit } from '../../hooks/usePipelineRuns';
import { PipelineRunKind } from '../../types';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';

const RelatedPipelineRuns = ({ pipelineRun }) => {
  const { namespace, workspace } = useWorkspaceInfo();

  const sha =
    pipelineRun?.metadata?.labels[PipelineRunLabel.COMMIT_LABEL] ||
    pipelineRun?.metadata?.labels[PipelineRunLabel.TEST_SERVICE_COMMIT];
  const applicationName = pipelineRun.metadata?.labels[PipelineRunLabel.APPLICATION];

  const [pipelineRuns, relatedPipelineRunsLoaded] = usePipelineRunsForCommit(
    namespace,
    applicationName,
    sha,
  );

  const relatedPipelineRuns = React.useMemo(
    () => pipelineRuns?.filter((plr) => plr.metadata.name !== pipelineRun.metadata.name),
    [pipelineRuns, pipelineRun.metadata.name],
  );

  return relatedPipelineRunsLoaded || !sha ? (
    <Popover
      data-testid="related-pipelines-popover"
      aria-label="Related pipelines"
      headerContent="Related pipelines"
      bodyContent={
        relatedPipelineRuns.length === 0
          ? 'No related pipelines'
          : relatedPipelineRuns?.map((relatedPipelineRun: PipelineRunKind) => (
              <div key={relatedPipelineRun?.metadata?.uid}>
                <Link
                  to={`/application-pipeline/workspaces/${workspace}/applications/${applicationName}/pipelineruns/${relatedPipelineRun.metadata?.name}`}
                  title={relatedPipelineRun.metadata?.name}
                >
                  {relatedPipelineRun.metadata?.name}
                </Link>
              </div>
            ))
      }
    >
      <Button variant="link" isInline>
        {`${relatedPipelineRuns?.length} ${
          relatedPipelineRuns?.length === 1 ? 'pipeline' : 'pipelines'
        }`}
      </Button>
    </Popover>
  ) : (
    <Skeleton width="50%" screenreaderText="Loading related pipelines" />
  );
};

export default RelatedPipelineRuns;
