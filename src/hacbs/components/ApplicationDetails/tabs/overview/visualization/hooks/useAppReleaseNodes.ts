import * as React from 'react';
import { pipelineRunStatus } from '../../../../../../../shared';
import { useReleases } from '../../../../../../hooks';
import { ReleaseKind } from '../../../../../../types/coreBuildService';
import { WorkflowNodeModel, WorkflowNodeModelData, WorkflowNodeType } from '../types';
import {
  emptyPipelineNode,
  groupToPipelineNode,
  resourceToPipelineNode,
  worstWorkflowStatus,
} from '../utils/node-utils';
import { updateParallelNodeWidths } from '../utils/visualization-utils';

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

  const groupedReleases = React.useMemo(() => {
    if (!releasesLoaded) {
      return [];
    }
    const groups: { [key: string]: ReleaseKind[] } = {};
    releases.forEach((release) => {
      if (!groups[release.spec.releasePlan]) {
        groups[release.spec.releasePlan] = [];
      }
      groups[release.spec.releasePlan].push(release);
    });
    return groups;
  }, [releases, releasesLoaded]);

  const releaseNodes = React.useMemo(() => {
    if (!releasesLoaded) {
      return [];
    }
    const nodes = Object.keys(groupedReleases).length
      ? Object.keys(groupedReleases).map((key) => {
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
            key,
            key,
            WorkflowNodeType.RELEASE,
            previousTasks,
            false,
            undefined,
            groupedNodes,
            groupedReleases[key],
            pipelineRunStatus(latestRelease),
          );
        })
      : [
          emptyPipelineNode(
            'no-release-plans',
            'Release plans',
            WorkflowNodeType.RELEASE,
            previousTasks,
          ),
        ];
    updateParallelNodeWidths(nodes);
    return nodes;
  }, [groupedReleases, previousTasks, releasesLoaded]);

  const releaseGroup = React.useMemo(
    () =>
      releasesLoaded
        ? groupToPipelineNode(
            'release-plans',
            'Releases',
            WorkflowNodeType.RELEASE,
            previousTasks,
            expanded,
            expanded ? releaseNodes?.map((c) => c.id) : undefined,
            releaseNodes,
            releases,
            worstWorkflowStatus(releaseNodes),
          )
        : undefined,
    [releasesLoaded, expanded, previousTasks, releaseNodes, releases],
  );

  const releaseTasks = React.useMemo(
    () =>
      expanded && releaseNodes?.length ? releaseNodes.map((c) => c.id) : [releaseGroup?.id ?? ''],
    [releaseGroup?.id, releaseNodes, expanded],
  );

  return [releaseNodes, releaseGroup, releaseTasks, releasesLoaded];
};
