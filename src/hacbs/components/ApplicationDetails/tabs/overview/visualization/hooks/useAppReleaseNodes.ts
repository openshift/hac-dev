import * as React from 'react';
import { pipelineRunStatus } from '../../../../../../../shared';
import { useReleasePlans } from '../../../../../../hooks/useReleasePlans';
import { useReleases } from '../../../../../../hooks/useReleases';
import { ReleaseKind, ReleasePlanKind } from '../../../../../../types/coreBuildService';
import { WorkflowNodeModel, WorkflowNodeModelData, WorkflowNodeType } from '../types';
import {
  emptyPipelineNode,
  groupToPipelineNode,
  resourceToPipelineNode,
  worstWorkflowStatus,
} from '../utils/node-utils';
import { updateParallelNodeWidths } from '../utils/visualization-utils';

const getPlaceholderReleaseNodes = (
  releases: ReleaseKind[],
  releasePlans: ReleasePlanKind[],
  previousTasks: string[],
): WorkflowNodeModel<WorkflowNodeModelData>[] => {
  const placeholdersNeeded = releasePlans.filter(
    (releasePlan) =>
      !releases.find((release) => release.spec.releasePlan === releasePlan.metadata.name),
  );
  if (placeholdersNeeded.length === 0) {
    return [];
  }
  return placeholdersNeeded.map((releasePlan) =>
    emptyPipelineNode(
      `no-release-${releasePlan.metadata.name}`,
      'No release yet',
      WorkflowNodeType.RELEASE,
      previousTasks,
    ),
  );
};

export const useAppReleaseNodes = (
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
  const [releases, releasesLoaded] = useReleases(namespace);
  const [releasePlans, releasePlansLoaded] = useReleasePlans(namespace);
  const allLoaded = releasesLoaded && releasePlansLoaded;

  const groupedReleases = React.useMemo(() => {
    if (!allLoaded) {
      return [];
    }
    const groups: { [key: string]: ReleaseKind[] } = {};
    releases.forEach((release) => {
      const groupId = `release-for-${release.spec.releasePlan}`;
      if (!groups[groupId]) {
        groups[groupId] = [];
      }
      groups[groupId].push(release);
    });
    return groups;
  }, [releases, allLoaded]);

  const releaseNodes = React.useMemo(() => {
    if (!allLoaded) {
      return [];
    }
    let nodes: WorkflowNodeModel<WorkflowNodeModelData>[];
    if (Object.keys(groupedReleases).length) {
      nodes = Object.keys(groupedReleases).map((key) => {
        if (groupedReleases[key].length === 1) {
          return resourceToPipelineNode(
            groupedReleases[key][0],
            WorkflowNodeType.RELEASE,
            previousTasks,
            pipelineRunStatus(groupedReleases[key][0]),
          );
        }
        const groupedNodes = groupedReleases[key]
          .sort((a, b) => (a.status.startTime > b.status.startTime ? -1 : 1))
          .map((release) =>
            resourceToPipelineNode(
              release,
              WorkflowNodeType.RELEASE,
              previousTasks,
              pipelineRunStatus(release),
            ),
          );
        const latestRelease = groupedReleases[key].reduce(
          (latest: ReleaseKind, release: ReleaseKind) => {
            if (!latest || release.status.startTime > latest.status.startTime) {
              return release;
            }
            return latest;
          },
          null,
        );

        return groupToPipelineNode(
          latestRelease.metadata.uid,
          key,
          WorkflowNodeType.RELEASE,
          previousTasks,
          false,
          undefined,
          groupedNodes,
          groupedReleases[key],
          pipelineRunStatus(latestRelease),
        );
      });
      nodes.push(...getPlaceholderReleaseNodes(releases, releasePlans, previousTasks));
    } else if (releasePlans?.length) {
      nodes = getPlaceholderReleaseNodes(releases, releasePlans, previousTasks);
    } else {
      nodes = [
        emptyPipelineNode(
          'no-releases',
          'No releases yet',
          WorkflowNodeType.RELEASE,
          previousTasks,
        ),
      ];
    }
    updateParallelNodeWidths(nodes);
    return nodes;
  }, [allLoaded, groupedReleases, releasePlans, releases, previousTasks]);

  const releaseGroup = React.useMemo(
    () =>
      allLoaded
        ? groupToPipelineNode(
            'release-plans',
            releases?.length ? 'Releases' : 'No releases set',
            WorkflowNodeType.RELEASE,
            previousTasks,
            expanded,
            expanded ? releaseNodes?.map((c) => c.id) : undefined,
            releaseNodes,
            releases,
            worstWorkflowStatus(releaseNodes),
          )
        : undefined,
    [allLoaded, expanded, previousTasks, releaseNodes, releases],
  );

  const releaseTasks = React.useMemo(
    () =>
      expanded && releaseNodes?.length ? releaseNodes.map((c) => c.id) : [releaseGroup?.id ?? ''],
    [releaseGroup?.id, releaseNodes, expanded],
  );

  return [releaseNodes, releaseGroup, releaseTasks, allLoaded];
};
