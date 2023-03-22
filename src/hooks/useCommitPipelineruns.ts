import * as React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { PipelineRunLabel } from '../consts/pipelinerun';
import { PipelineRunGroupVersionKind } from '../models';
import { PipelineRunKind } from '../types';

export const useCommitPipelineruns = (
  applicationName: string,
  namespace: string,
  commitName: string,
): [PipelineRunKind[], boolean, unknown] => {
  const [pipelineruns, loaded, loadErr] = useK8sWatchResource<PipelineRunKind[]>({
    groupVersionKind: PipelineRunGroupVersionKind,
    isList: true,
    name: applicationName,
    namespace,
    selector: {
      matchLabels: {
        [PipelineRunLabel.APPLICATION]: applicationName,
      },
    },
  });

  const commitPipelineRuns = React.useMemo(
    () =>
      pipelineruns?.filter(
        (plr) =>
          plr?.metadata?.labels[PipelineRunLabel.COMMIT_LABEL] === commitName ||
          plr?.metadata?.labels[PipelineRunLabel.TEST_SERVICE_COMMIT] === commitName,
      ) || [],
    [pipelineruns, commitName],
  );

  return [commitPipelineRuns, loaded, loadErr];
};
