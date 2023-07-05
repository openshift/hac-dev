import * as React from 'react';
import { PipelineRunLabel, PipelineRunType } from '../consts/pipelinerun';
import { ComponentKind } from '../types';
import { getPACProvision, SAMPLE_ANNOTATION, PACProvision } from '../utils/component-utils';
import { useApplicationPipelineGitHubApp } from './useApplicationPipelineGitHubApp';
import { usePipelineRuns } from './usePipelineRuns';

export enum PACState {
  sample,
  disabled,
  requested,
  error,
  pending,
  ready,
  loading,
}

const usePACState = (component: ComponentKind) => {
  const isSample = component.metadata?.annotations?.[SAMPLE_ANNOTATION] === 'true';
  const pacProvision = getPACProvision(component);

  const { name: prBotName } = useApplicationPipelineGitHubApp();

  // TODO need a better way to identify if the PR has merged on the main branch
  const [pipelineBuildRuns, pipelineBuildRunsLoaded] = usePipelineRuns(
    !isSample && pacProvision ? component.metadata.namespace : null,
    React.useMemo(
      () => ({
        selector: {
          matchLabels: {
            [PipelineRunLabel.PIPELINE_TYPE]: PipelineRunType.BUILD,
            [PipelineRunLabel.APPLICATION]: component.spec.application,
            [PipelineRunLabel.COMPONENT]: component.metadata.name,
          },
          matchExpressions: [
            { key: PipelineRunLabel.PULL_REQUEST_NUMBER_LABEL, operator: 'DoesNotExist' },
            {
              key: PipelineRunLabel.COMMIT_USER_LABEL,
              values: [prBotName],
              operator: 'NotEquals',
            },
            {
              key: PipelineRunLabel.COMMIT_USER_LABEL,
              operator: 'Exists',
            },
          ],
          limit: 1,
        },
      }),
      [component.metadata.name, component.spec.application, prBotName],
    ),
  );

  return isSample
    ? PACState.sample
    : pacProvision === PACProvision.done
    ? !pipelineBuildRunsLoaded
      ? PACState.loading
      : pipelineBuildRuns?.length > 0
      ? PACState.ready
      : PACState.pending
    : pacProvision === PACProvision.request
    ? PACState.requested
    : pacProvision === PACProvision.error
    ? PACState.error
    : PACState.disabled;
};

export default usePACState;
