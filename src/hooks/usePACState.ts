import * as React from 'react';
import { PipelineRunEventType, PipelineRunLabel, PipelineRunType } from '../consts/pipelinerun';
import { ComponentKind } from '../types';
import {
  SAMPLE_ANNOTATION,
  getPACProvision,
  ComponentBuildState,
  BUILD_REQUEST_ANNOTATION,
  BuildRequest,
  useComponentBuildStatus,
} from '../utils/component-utils';
import { useApplicationPipelineGitHubApp } from './useApplicationPipelineGitHubApp';
import { usePipelineRuns } from './usePipelineRuns';

export enum PACState {
  sample,
  disabled,
  configureRequested,
  unconfigureRequested,
  error,
  pending,
  ready,
  loading,
}

const usePACState = (component: ComponentKind) => {
  const isSample = component.metadata?.annotations?.[SAMPLE_ANNOTATION] === 'true';
  const pacProvision = getPACProvision(component);
  const isConfigureRequested =
    component.metadata?.annotations?.[BUILD_REQUEST_ANNOTATION] === BuildRequest.configurePac;
  const isUnconfigureRequested =
    component.metadata?.annotations?.[BUILD_REQUEST_ANNOTATION] === BuildRequest.unconfigurePac;

  const { name: prBotName } = useApplicationPipelineGitHubApp();

  const buildStatus = useComponentBuildStatus(component);
  const configurationTime = buildStatus?.pac?.['configuration-time'];

  const [pipelineBuildRuns, pipelineBuildRunsLoaded] = usePipelineRuns(
    !isSample && pacProvision ? component.metadata.namespace : null,
    React.useMemo(
      () => ({
        selector: {
          matchLabels: {
            [PipelineRunLabel.PIPELINE_TYPE]: PipelineRunType.BUILD,
            [PipelineRunLabel.APPLICATION]: component.spec.application,
            [PipelineRunLabel.COMPONENT]: component.metadata.name,
            [PipelineRunLabel.COMMIT_EVENT_TYPE_LABEL]: PipelineRunEventType.PUSH,
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

  // filter out runs that were created if the component previously had pac configured
  const runsForComponent = React.useMemo(
    () =>
      pipelineBuildRuns?.filter((p) =>
        configurationTime
          ? new Date(p.metadata.creationTimestamp) > new Date(configurationTime)
          : true,
      ),
    [configurationTime, pipelineBuildRuns],
  );

  return isSample
    ? PACState.sample
    : isConfigureRequested
    ? PACState.configureRequested
    : isUnconfigureRequested
    ? PACState.unconfigureRequested
    : pacProvision === ComponentBuildState.enabled
    ? !pipelineBuildRunsLoaded
      ? PACState.loading
      : runsForComponent?.length > 0
      ? PACState.ready
      : PACState.pending
    : !pacProvision || pacProvision === ComponentBuildState.disabled
    ? PACState.disabled
    : PACState.error;
};

export default usePACState;
