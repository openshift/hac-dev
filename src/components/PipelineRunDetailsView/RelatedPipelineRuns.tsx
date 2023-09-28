import * as React from 'react';
import { Link } from 'react-router-dom';
import { Button, Popover, Skeleton } from '@patternfly/react-core';
import { PipelineRunLabel } from '../../consts/pipelinerun';
import { usePipelineRunsForCommit } from '../../hooks/usePipelineRuns';
import { PipelineRunGroupVersionKind } from '../../models';
import { PipelineRunKind } from '../../types';
import { getCommitSha } from '../../utils/commits-utils';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';

const RelatedPipelineRuns = ({ pipelineRun }) => {
  const { namespace, workspace } = useWorkspaceInfo();

  const sha = getCommitSha(pipelineRun);
  const applicationName = pipelineRun.metadata?.labels[PipelineRunLabel.APPLICATION];

  const [pipelineRuns, relatedPipelineRunsLoaded] = usePipelineRunsForCommit(
    namespace,
    applicationName,
    sha,
  );

  const relatedPipelineRuns = React.useMemo(
    () =>
      pipelineRuns
        ?.filter((plr) => plr.metadata.name !== pipelineRun.metadata.name)
        .filter((plr) => plr.kind === PipelineRunGroupVersionKind.kind),
    [pipelineRun.metadata.name, pipelineRuns],
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
