import * as React from 'react';
import { PipelineRunEventType, PipelineRunLabel, PipelineRunType } from '../consts/pipelinerun';
import { ComponentKind } from '../types';
import {
  BUILD_REQUEST_ANNOTATION,
  BuildRequest,
  ComponentBuildState,
  getComponentBuildStatus,
  getPACProvision,
  SAMPLE_ANNOTATION,
} from '../utils/component-utils';
import { useApplicationPipelineGitHubApp } from './useApplicationPipelineGitHubApp';
import { PACState } from './usePACState';
import { usePipelineRuns } from './usePipelineRuns';

export type PacStatesForComponents = {
  [componentName: string]: PACState;
};

const getInitialPacStates = (components: ComponentKind[]): PacStatesForComponents =>
  components.reduce((acc, component) => {
    const isSample = component.metadata?.annotations?.[SAMPLE_ANNOTATION] === 'true';
    const pacProvision = getPACProvision(component);
    const isConfigureRequested =
      component.metadata?.annotations?.[BUILD_REQUEST_ANNOTATION] === BuildRequest.configurePac;
    const isUnconfigureRequested =
      component.metadata?.annotations?.[BUILD_REQUEST_ANNOTATION] === BuildRequest.unconfigurePac;

    if (isSample) {
      acc[component.metadata.name] = PACState.sample;
      return acc;
    }
    if (isConfigureRequested) {
      acc[component.metadata.name] = PACState.configureRequested;
      return acc;
    }
    if (isUnconfigureRequested) {
      acc[component.metadata.name] = PACState.unconfigureRequested;
      return acc;
    }
    if (pacProvision !== ComponentBuildState.enabled) {
      if (!pacProvision || pacProvision === ComponentBuildState.disabled) {
        acc[component.metadata.name] = PACState.disabled;
      } else {
        acc[component.metadata.name] = PACState.error;
      }
      return acc;
    }
    acc[component.metadata.name] = PACState.loading;
    return acc;
  }, {} as PacStatesForComponents);

const usePACStatesForComponents = (components: ComponentKind[]): PacStatesForComponents => {
  const [componentPacStates, setComponentPacStates] = React.useState<PacStatesForComponents>(
    getInitialPacStates(components),
  );
  const { name: prBotName } = useApplicationPipelineGitHubApp();
  const namespace = components?.[0]?.metadata.namespace;
  const application = components?.[0]?.spec.application;

  React.useEffect(() => {
    setComponentPacStates(() => getInitialPacStates(components));
  }, [components]);

  const neededNames = React.useMemo(
    () =>
      components?.length
        ? components
            .filter((component) => componentPacStates[component.metadata.name] === PACState.loading)
            .map((c) => c.metadata.name)
        : [],
    [componentPacStates, components],
  );

  const [pipelineBuildRuns, pipelineBuildRunsLoaded, , getNextPage] = usePipelineRuns(
    neededNames.length ? namespace : null,
    React.useMemo(
      () => ({
        selector: {
          matchLabels: {
            [PipelineRunLabel.PIPELINE_TYPE]: PipelineRunType.BUILD,
            [PipelineRunLabel.APPLICATION]: application,
            [PipelineRunLabel.COMMIT_EVENT_TYPE_LABEL]: PipelineRunEventType.PUSH,
          },
          matchExpressions: [
            {
              key: PipelineRunLabel.COMPONENT,
              operator: 'In',
              values: neededNames,
            },
            { key: PipelineRunLabel.PULL_REQUEST_NUMBER_LABEL, operator: 'DoesNotExist' },
          ],
        },
      }),
      [application, neededNames],
    ),
  );

  React.useEffect(() => {
    if (pipelineBuildRunsLoaded && pipelineBuildRuns) {
      const updates = {};
      let update = false;
      let allLoaded = true;

      neededNames.forEach((componentName) => {
        const buildStatus = getComponentBuildStatus(
          components.find((c) => c.metadata.name === componentName),
        );
        const configurationTime = buildStatus?.pac?.['configuration-time'];

        const runsForComponent = pipelineBuildRuns?.filter(
          (p) =>
            p.metadata.labels?.[PipelineRunLabel.COMPONENT] === componentName &&
            (configurationTime
              ? new Date(p.metadata.creationTimestamp) > new Date(configurationTime)
              : true),
        );
        const prMerged = runsForComponent.find(
          (r) =>
            !r.metadata?.annotations?.[PipelineRunLabel.COMMIT_USER_LABEL]?.includes(prBotName),
        );
        if (prMerged) {
          updates[componentName] = PACState.ready;
          update = true;
        } else if (!getNextPage) {
          updates[componentName] = PACState.pending;
          update = true;
        } else {
          allLoaded = false;
        }
      });

      if (update) {
        setComponentPacStates((prev) => ({ ...prev, ...updates }));
      }

      if (!update && !allLoaded && getNextPage) {
        getNextPage();
      }
    }
  }, [components, getNextPage, neededNames, pipelineBuildRuns, pipelineBuildRunsLoaded, prBotName]);

  return componentPacStates;
};

export default usePACStatesForComponents;
