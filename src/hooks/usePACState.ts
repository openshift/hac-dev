import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { PipelineRunLabel, PipelineRunType } from '../consts/pipelinerun';
import { PipelineRunGroupVersionKind } from '../models';
import { ComponentKind } from '../types';
import { PipelineRunKind } from '../types/pipeline-run';
import { isPACEnabled, SAMPLE_ANNOTATION } from '../utils/component-utils';

export enum PACState {
  sample,
  disabled,
  requested,
  pending,
  ready,
  loading,
}

const usePACState = (component: ComponentKind) => {
  const pacEnabled = isPACEnabled(component);
  const pacDone = isPACEnabled(component, true);

  // TODO need a better way to identify if the PR has merged on the main branch
  const [pipelineBuildRuns, pipelineBuildRunsLoaded] = useK8sWatchResource<PipelineRunKind[]>(
    pacEnabled
      ? {
          groupVersionKind: PipelineRunGroupVersionKind,
          isList: true,
          namespace: component.metadata.namespace,
          selector: {
            matchLabels: {
              [PipelineRunLabel.PIPELINE_TYPE]: PipelineRunType.BUILD,
              [PipelineRunLabel.COMPONENT]: component.metadata.name,
            },
            matchExpressions: [
              { key: PipelineRunLabel.PULL_REQUEST_NUMBER_LABEL, operator: 'DoesNotExist' },
              {
                key: PipelineRunLabel.COMMIT_USER_LABEL,
                value: 'appstudio-staging-ci__bot',
                operator: 'NotEquals',
              },
              {
                key: PipelineRunLabel.COMMIT_USER_LABEL,
                operator: 'Exists',
              },
            ],
          },
          limit: 1,
        }
      : null,
  );

  return component.metadata?.annotations?.[SAMPLE_ANNOTATION] === 'true'
    ? PACState.sample
    : pacDone && !pipelineBuildRunsLoaded
    ? PACState.loading
    : pacDone && pipelineBuildRuns?.length > 0
    ? PACState.ready
    : pacDone
    ? PACState.pending
    : pacEnabled
    ? PACState.requested
    : PACState.disabled;
};

export default usePACState;
