import * as React from 'react';
import { pipelineRunStatus } from '../../../../../../../shared';
import { PipelineRunLabel } from '../../../../../../consts/pipelinerun';
import { useEnvironments } from '../../../../../../hooks/useEnvironments';
import { useSnapshotsEnvironmentBindings } from '../../../../../../hooks/useSnapshotsEnvironmentBindings';
import { useTestPipelines } from '../../../../../../hooks/useTestPipelines';
import { EnvironmentType, getEnvironmentType } from '../../../../../Environment/utils';
import { WorkflowNodeModel, WorkflowNodeModelData, WorkflowNodeType } from '../types';
import {
  emptyPipelineNode,
  groupToPipelineNode,
  resourceToPipelineNode,
  worstWorkflowStatus,
} from '../utils/node-utils';
import {
  getLastEnvironments,
  getLatestResource,
  updateParallelNodeWidths,
} from '../utils/visualization-utils';

export const useAppStaticEnvironmentNodes = (
  namespace: string,
  applicationName: string,
  previousTasks: string[],
  expanded: boolean,
): [
  nodes: WorkflowNodeModel<WorkflowNodeModelData>[],
  group: WorkflowNodeModel<WorkflowNodeModelData>,
  tasks: string[],
  loaded: boolean,
] => {
  const [environments, environmentsLoaded] = useEnvironments(namespace);
  const [snapshotsEnvironmentBindings, snapshotsLoaded] = useSnapshotsEnvironmentBindings(
    namespace,
    applicationName,
  );
  const [testPipelines, testPipelinesLoaded] = useTestPipelines(namespace, applicationName);
  const allLoaded = environmentsLoaded && testPipelinesLoaded && snapshotsLoaded;

  const staticEnvironments = React.useMemo(
    () =>
      allLoaded ? environments.filter((e) => getEnvironmentType(e) === EnvironmentType.static) : [],
    [allLoaded, environments],
  );

  const staticEnvironmentNodes = React.useMemo(() => {
    if (!allLoaded) {
      return [];
    }
    const nodes = staticEnvironments.length
      ? staticEnvironments.map((staticEnvironment) => {
          const prevEnv = staticEnvironments.find(
            (e) => e.metadata.name === staticEnvironment.spec.parentEnvironment,
          );
          const snapshot = getLatestResource(
            snapshotsEnvironmentBindings.filter(
              (as) => as.spec.environment === staticEnvironment.metadata.name,
            ),
          );
          const testPipeline = snapshot
            ? testPipelines.find(
                (pipeline) =>
                  pipeline?.metadata?.labels[PipelineRunLabel.TEST_SERVICE_SNAPSHOT] ===
                  snapshot.spec.snapshot,
              )
            : undefined;

          return resourceToPipelineNode(
            staticEnvironment,
            WorkflowNodeType.STATIC_ENVIRONMENT,
            prevEnv ? [prevEnv.metadata.uid] : previousTasks,
            testPipeline ? pipelineRunStatus(testPipeline) : 'Pending',
          );
        })
      : [
          emptyPipelineNode(
            'no-static-environments',
            'No static environments set',
            WorkflowNodeType.STATIC_ENVIRONMENT,
            previousTasks,
          ),
        ];
    updateParallelNodeWidths(nodes);
    return nodes;
  }, [allLoaded, staticEnvironments, previousTasks, snapshotsEnvironmentBindings, testPipelines]);

  const staticEnvironmentGroup = React.useMemo(
    () =>
      allLoaded && previousTasks?.length
        ? groupToPipelineNode(
            'static-environments',
            staticEnvironments?.length ? 'Static environments' : 'No static environments set',
            WorkflowNodeType.STATIC_ENVIRONMENT,
            previousTasks,
            expanded,
            expanded ? staticEnvironmentNodes?.map((c) => c.id) : undefined,
            staticEnvironmentNodes,
            staticEnvironments,
            worstWorkflowStatus(staticEnvironmentNodes),
          )
        : undefined,
    [allLoaded, previousTasks, expanded, staticEnvironmentNodes, staticEnvironments],
  );

  const lastStaticEnv = React.useMemo(
    () => getLastEnvironments(staticEnvironments),
    [staticEnvironments],
  );

  return [staticEnvironmentNodes, staticEnvironmentGroup, lastStaticEnv, allLoaded];
};
