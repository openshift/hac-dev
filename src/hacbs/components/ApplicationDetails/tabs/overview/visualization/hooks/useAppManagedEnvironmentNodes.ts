import * as React from 'react';
import { pipelineRunStatus } from '../../../../../../../shared';
import { useReleasePlans, useReleases } from '../../../../../../hooks';
import { WorkflowNodeModel, WorkflowNodeModelData, WorkflowNodeType } from '../types';
import {
  emptyPipelineNode,
  groupToPipelineNode,
  resourceToPipelineNode,
  worstWorkflowStatus,
} from '../utils/node-utils';
import { updateParallelNodeWidths } from '../utils/visualization-utils';

export const useAppManagedEnvironmentNodes = (
  namespace: string,
  applicationName: string,
  previousTasks: string[],
  expanded: boolean,
): [
  nodes: WorkflowNodeModel<WorkflowNodeModelData>[],
  group: WorkflowNodeModel<WorkflowNodeModelData>,
  loaded: boolean,
] => {
  const [releasePlans, releasePlansLoaded] = useReleasePlans(namespace);
  const [releases, releasesLoaded] = useReleases(namespace);
  const allLoaded = releasePlansLoaded && releasesLoaded;

  const managedEnvironmentNodes = React.useMemo(() => {
    const nodes =
      allLoaded && releasePlans.length
        ? releasePlans.map((managedEnvironment) => {
            const latestRelease = releases
              .filter((release) => release.spec.releasePlan === managedEnvironment.metadata.name)
              .sort((a, b) => (a.status.startTime > b.status.startTime ? -1 : 1))[0];

            return resourceToPipelineNode(
              managedEnvironment,
              WorkflowNodeType.MANAGED_ENVIRONMENT,
              [managedEnvironment.metadata.name],
              latestRelease ? pipelineRunStatus(latestRelease) : 'Pending',
            );
          })
        : [
            emptyPipelineNode(
              'no-managed-environments',
              'Managed environments',
              WorkflowNodeType.MANAGED_ENVIRONMENT,
              previousTasks,
            ),
          ];
    updateParallelNodeWidths(nodes);
    return nodes;
  }, [allLoaded, releasePlans, previousTasks, releases]);

  const managedEnvironmentGroup = React.useMemo(
    () =>
      allLoaded
        ? groupToPipelineNode(
            'managed-environments',
            'Managed environments',
            WorkflowNodeType.MANAGED_ENVIRONMENT,
            previousTasks,
            expanded,
            expanded ? managedEnvironmentNodes?.map((c) => c.id) : undefined,
            managedEnvironmentNodes,
            releasePlans,
            worstWorkflowStatus(managedEnvironmentNodes),
          )
        : undefined,
    [allLoaded, expanded, managedEnvironmentNodes, releasePlans, previousTasks],
  );

  return [managedEnvironmentNodes, managedEnvironmentGroup, allLoaded];
};
