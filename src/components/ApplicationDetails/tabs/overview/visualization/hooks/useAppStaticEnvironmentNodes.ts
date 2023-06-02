import * as React from 'react';
import {
  EnvironmentType,
  getEnvironmentType,
} from '../../../../../../components/Environment/environment-utils';
import { useEnvironments } from '../../../../../../hooks/useEnvironments';
import { useSnapshotsEnvironmentBindings } from '../../../../../../hooks/useSnapshotsEnvironmentBindings';
import { getComponentDeploymentRunStatus } from '../../../../../../utils/environment-utils';
import { WorkflowNodeModel, WorkflowNodeModelData, WorkflowNodeType } from '../types';
import {
  emptyPipelineNode,
  groupToPipelineNode,
  resourceToPipelineNode,
  worstWorkflowStatus,
} from '../utils/node-utils';
import { getLatestResource, updateParallelNodeWidths } from '../utils/visualization-utils';

export const useAppStaticEnvironmentNodes = (
  namespace: string,
  applicationName: string,
  previousTasks: string[],
  expanded: boolean,
): [
  nodes: WorkflowNodeModel<WorkflowNodeModelData>[],
  group: WorkflowNodeModel<WorkflowNodeModelData>,
  lastEnvs: string[],
  loaded: boolean,
  errors: unknown[],
] => {
  const [environments, environmentsLoaded, environmentsError] = useEnvironments();
  const [snapshotsEnvironmentBindings, snapshotsLoaded, snapshotsError] =
    useSnapshotsEnvironmentBindings(namespace, applicationName);
  const allLoaded = environmentsLoaded && snapshotsLoaded;

  const staticEnvironments = React.useMemo(
    () =>
      allLoaded
        ? environments.filter((e) =>
            [EnvironmentType.default, EnvironmentType.static].includes(getEnvironmentType(e)),
          )
        : [],
    [allLoaded, environments],
  );
  const allErrors = [environmentsError, snapshotsError].filter((e) => !!e);

  const staticEnvironmentNodes = React.useMemo(() => {
    if (!allLoaded || allErrors.length > 0) {
      return [];
    }
    const nodes = staticEnvironments.length
      ? staticEnvironments.map((staticEnvironment) => {
          const prevEnv = staticEnvironments.find(
            (e) => e.metadata.name === staticEnvironment.spec.parentEnvironment,
          );
          const snapshotEB = getLatestResource(
            snapshotsEnvironmentBindings.filter(
              (as) => as.spec.environment === staticEnvironment.metadata.name,
            ),
          );

          return resourceToPipelineNode(
            staticEnvironment,
            applicationName,
            WorkflowNodeType.STATIC_ENVIRONMENT,
            prevEnv ? [prevEnv.metadata.uid] : previousTasks,
            getComponentDeploymentRunStatus(snapshotEB),
          );
        })
      : [
          emptyPipelineNode(
            'no-static-environments',
            applicationName,
            'No static environments set',
            WorkflowNodeType.STATIC_ENVIRONMENT,
            previousTasks,
          ),
        ];
    updateParallelNodeWidths(nodes);
    return nodes;
  }, [
    allLoaded,
    applicationName,
    staticEnvironments,
    previousTasks,
    snapshotsEnvironmentBindings,
    allErrors,
  ]);

  const staticEnvironmentGroup = React.useMemo(
    () =>
      allLoaded && previousTasks?.length && allErrors.length === 0
        ? groupToPipelineNode(
            'static-environments',
            applicationName,
            staticEnvironments?.length ? 'Static environments' : 'No static environments set',
            WorkflowNodeType.STATIC_ENVIRONMENT,
            previousTasks,
            expanded,
            expanded ? staticEnvironmentNodes?.map((c) => c.id) : undefined,
            staticEnvironments?.length ? staticEnvironmentNodes : [],
            staticEnvironments,
            worstWorkflowStatus(staticEnvironmentNodes),
          )
        : undefined,
    [
      allLoaded,
      previousTasks,
      allErrors.length,
      applicationName,
      staticEnvironments,
      expanded,
      staticEnvironmentNodes,
    ],
  );

  const lastStaticEnvs = React.useMemo(
    () =>
      staticEnvironmentNodes.reduce((acc, env) => {
        if (!staticEnvironmentNodes.find((node) => node.runAfterTasks?.includes(env.id))) {
          acc.push(env.id);
        }
        return acc;
      }, []),
    [staticEnvironmentNodes],
  );

  return [staticEnvironmentNodes, staticEnvironmentGroup, lastStaticEnvs, allLoaded, allErrors];
};
