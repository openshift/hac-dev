import * as React from 'react';
import { Link } from 'react-router-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { Button, Popover, Skeleton } from '@patternfly/react-core';
import { PipelineRunLabel } from '../../consts/pipelinerun';
import { PipelineRunGroupVersionKind } from '../../shared';
import { PipelineRunKind } from '../../types';
import { useNamespace } from '../../utils/namespace-context-utils';

const RelatedPipelineRuns = ({ pipelineRun }) => {
  const namespace = useNamespace();
  const sha =
    pipelineRun.metadata?.labels[PipelineRunLabel.COMMIT_LABEL] ||
    pipelineRun.metadata?.labels[PipelineRunLabel.TEST_SERVICE_COMMIT];

  const [relatedPipelineRuns, relatedPipelineRunsLoaded] = useK8sWatchResource<PipelineRunKind[]>({
    groupVersionKind: PipelineRunGroupVersionKind,
    namespace,
    isList: true,
    selector: {
      matchLabels: {
        [PipelineRunLabel.COMPONENT]: pipelineRun.metadata?.labels[PipelineRunLabel.COMPONENT],
      },
    },
  });

  const filteredRelatedPipelineruns = React.useMemo(() => {
    return relatedPipelineRuns.filter(
      (plr: PipelineRunKind) =>
        (plr.metadata?.labels[PipelineRunLabel.COMMIT_LABEL] === sha ||
          plr.metadata?.labels[PipelineRunLabel.TEST_SERVICE_COMMIT] === sha) &&
        plr.metadata.uid !== pipelineRun.metadata.uid,
    );
  }, [relatedPipelineRuns, sha, pipelineRun]);

  return relatedPipelineRunsLoaded ? (
    <Popover
      aria-label="Related pipelines"
      headerContent="Related pipelines"
      bodyContent={
        filteredRelatedPipelineruns.length === 0
          ? 'No related pipelines'
          : filteredRelatedPipelineruns?.map((relatedPipelineRun: PipelineRunKind) => (
              <div key={relatedPipelineRun?.metadata?.uid}>
                <Link
                  to={`/stonesoup/pipelineruns/${relatedPipelineRun.metadata?.name}`}
                  title={relatedPipelineRun.metadata?.name}
                >
                  {relatedPipelineRun.metadata?.name}
                </Link>
              </div>
            ))
      }
    >
      <Button variant="link" isInline>
        {`${filteredRelatedPipelineruns?.length} ${
          filteredRelatedPipelineruns?.length === 1 ? 'pipeline' : 'pipelines'
        }`}
      </Button>
    </Popover>
  ) : (
    <Skeleton width="50%" screenreaderText="Loading related pipelines" />
  );
};

export default RelatedPipelineRuns;
