import * as React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { PipelineRunLabel } from '../consts/pipelinerun';
import { WatchK8sResource } from '../dynamic-plugin-sdk';
import { PipelineRunGroupVersionKind } from '../shared';
import { PipelineRunKind } from '../types';

export const useComponentPipelineRun = (
  name: string,
  application: string,
  namespace: string,
  type?: string,
): { pipelineRun: PipelineRunKind; loaded: boolean } => {
  const watchResource: WatchK8sResource = React.useMemo(() => {
    const matchLabels = {
      [PipelineRunLabel.COMPONENT]: name,
      [PipelineRunLabel.APPLICATION]: application,
      ...(type && { [PipelineRunLabel.PIPELINE_TYPE]: type }),
    };

    return {
      groupVersionKind: PipelineRunGroupVersionKind,
      namespace,
      selector: { matchLabels },
      isList: true,
    };
  }, [name, application, namespace, type]);

  const [pipelineRuns, loaded, error] = useK8sWatchResource(watchResource);

  const pipelineRun = React.useMemo(() => {
    if (loaded && !error) {
      return (pipelineRuns as PipelineRunKind[])?.sort?.(
        (a, b) =>
          new Date(b.metadata.creationTimestamp).getTime() -
          new Date(a.metadata.creationTimestamp).getTime(),
      )?.[0];
    }
    return undefined;
  }, [pipelineRuns, loaded, error]);

  return { loaded, pipelineRun };
};
