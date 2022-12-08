import * as React from 'react';
import { useReleasePlans } from '../../../../../../../hooks/useReleasePlans';
import { useReleases } from '../../../../../../../hooks/useReleases';
import { pipelineRunStatus } from '../../../../../../../shared';
import { WorkflowNodeModel, WorkflowNodeModelData, WorkflowNodeType } from '../types';
import {
  emptyPipelineNode,
  groupToPipelineNode,
  resourceToPipelineNode,
  worstWorkflowStatus,
} from '../utils/node-utils';
import { updateParallelNodeWidths } from '../utils/visualization-utils';

export const useAppReleasePlanNodes = (
  namespace: string,
  applicationName: string,
  previousTasks: string[],
  expanded: boolean,
): [
  nodes: WorkflowNodeModel<WorkflowNodeModelData>[],
  group: WorkflowNodeModel<WorkflowNodeModelData>,
  loaded: boolean,
  errors: unknown[],
] => {
  const [releasePlans, releasePlansLoaded, releasePlansError] = useReleasePlans(namespace);
  const [releases, releasesLoaded, releasesError] = useReleases(namespace);
  const allLoaded = releasePlansLoaded && releasesLoaded;
  const allErrors = [releasesError, releasePlansError].filter((e) => !!e);

  const releasePlanNodes = React.useMemo(() => {
    const nodes =
      allLoaded && releasePlans.length && allErrors.length === 0
        ? releasePlans.map((releasePlan) => {
            const latestRelease = releases
              .filter((release) => release.spec.releasePlan === releasePlan.metadata.name)
              .sort((a, b) => (a.status.startTime > b.status.startTime ? -1 : 1))[0];

            const notFoundPrevTask = previousTasks.includes(
              `no-release-${releasePlan.metadata.name}`,
            )
              ? `no-release-${releasePlan.metadata.name}`
              : 'no-releases';
            return resourceToPipelineNode(
              releasePlan,
              WorkflowNodeType.MANAGED_ENVIRONMENT,
              latestRelease ? [latestRelease.metadata.uid] : [notFoundPrevTask],
              latestRelease ? pipelineRunStatus(latestRelease) : 'Pending',
            );
          })
        : [
            emptyPipelineNode(
              'no-managed-environments',
              'No managed environments set',
              WorkflowNodeType.MANAGED_ENVIRONMENT,
              previousTasks,
            ),
          ];
    updateParallelNodeWidths(nodes);
    return nodes;
  }, [allLoaded, releasePlans, previousTasks, releases, allErrors]);

  const releasePlanGroup = React.useMemo(
    () =>
      allLoaded && allErrors.length === 0
        ? groupToPipelineNode(
            'managed-environments',
            releasePlans?.length ? 'Managed environments' : 'No managed environments yet',
            WorkflowNodeType.MANAGED_ENVIRONMENT,
            previousTasks,
            expanded,
            expanded ? releasePlanNodes?.map((c) => c.id) : undefined,
            releasePlanNodes,
            releasePlans,
            worstWorkflowStatus(releasePlanNodes),
          )
        : undefined,
    [allLoaded, expanded, releasePlanNodes, releasePlans, previousTasks, allErrors],
  );

  return [releasePlanNodes, releasePlanGroup, allLoaded, allErrors];
};
