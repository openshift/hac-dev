import * as React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { Button, Popover, Skeleton } from '@patternfly/react-core';
import { PipelineRunLabel } from '../../consts/pipelinerun';
import { PipelineRunGroupVersionKind } from '../../shared';
import { PipelineRunKind } from '../../types';
import { useNamespace } from '../../utils/namespace-context-utils';

const RelatedPipelineRuns = ({ pipelineRun }) => {
  const namespace = useNamespace();

  const [relatedPipelineRuns, relatedPipelineRunsLoaded] = useK8sWatchResource<PipelineRunKind[]>({
    groupVersionKind: PipelineRunGroupVersionKind,
    namespace,
    isList: true,
    selector: {
      matchLabels: {
        [PipelineRunLabel.COMMIT_LABEL]:
          pipelineRun.metadata?.labels[PipelineRunLabel.COMMIT_LABEL],
      },
    },
  });

  return relatedPipelineRunsLoaded ? (
    <Popover
      aria-label="Related pipelines"
      headerContent="Related pipelines"
      bodyContent={
        relatedPipelineRuns.entries.length === 0
          ? 'No related pipelines'
          : relatedPipelineRuns?.map((relatedPipelineRun: PipelineRunKind) => (
              <div key={relatedPipelineRun?.metadata?.uid}>
                {relatedPipelineRun?.metadata?.name}
              </div>
            ))
      }
    >
      <Button variant="link" isInline>
        {`${relatedPipelineRuns?.entries.length} ${
          relatedPipelineRuns?.entries.length === 1 ? 'pipeline' : 'pipelines'
        }`}
      </Button>
    </Popover>
  ) : (
    <Skeleton width="50%" screenreaderText="Loading related pipelines" />
  );
};

export default RelatedPipelineRuns;
