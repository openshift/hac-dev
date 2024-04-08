import * as React from 'react';
import { useFeatureFlag } from '@openshift/dynamic-plugin-sdk';
import {
  PipelineRunEventType,
  PipelineRunLabel,
  PipelineRunType,
} from '../../../../consts/pipelinerun';
import { useComponents } from '../../../../hooks/useComponents';
import { useIntegrationTestScenarios } from '../../../../hooks/useIntegrationTestScenarios';
import { usePipelineRunsForCommit } from '../../../../hooks/usePipelineRuns';
import { useReleasePlans } from '../../../../hooks/useReleasePlans';
import { useReleases } from '../../../../hooks/useReleases';
import { useSnapshots } from '../../../../hooks/useSnapshots';
import { Commit, ComponentKind, PipelineRunKind } from '../../../../types';
import { ReleaseKind, ReleasePlanKind } from '../../../../types/coreBuildService';
import { MVP_FLAG } from '../../../../utils/flag-utils';
import {
  conditionsRunStatus,
  pipelineRunStatus,
  runStatus,
} from '../../../../utils/pipeline-utils';
import { useWorkspaceInfo } from '../../../../utils/workspace-context-utils';
import {
  getLabelWidth,
  getLatestResource,
} from '../../../ApplicationDetails/tabs/overview/visualization/utils/visualization-utils';
import { DEFAULT_NODE_HEIGHT } from '../../../topology/const';
import {
  CommitWorkflowNodeModel,
  CommitWorkflowNodeType,
  NodeType,
} from './commit-visualization-types';
import { addPrefixToResourceName } from './commit-visualization-utils';

export const useCommitWorkflowData = (
  commit: Commit,
): [nodes: CommitWorkflowNodeModel[], loaded: boolean, errors: unknown[]] => {
  const { namespace } = useWorkspaceInfo();
  const [mvpFeature] = useFeatureFlag(MVP_FLAG);

  const applicationName = commit?.application || '';
  const [components, componentsLoaded] = useComponents(namespace, applicationName);
  const [integrationTests, integrationTestsLoaded] = useIntegrationTestScenarios(
    namespace,
    applicationName,
  );
  const [releasePlans, releasePlansLoaded, releasePlansError] = useReleasePlans(namespace);
  const [releases, releasesLoaded, releasesError] = useReleases(namespace);
  const [pipelines, pipelinesLoaded, pipelinesError] = usePipelineRunsForCommit(
    namespace,
    applicationName,
    commit.sha,
  );

  const buildPipelines = React.useMemo(
    () =>
      pipelinesLoaded
        ? pipelines.filter(
            (plr) => plr.metadata?.labels[PipelineRunLabel.PIPELINE_TYPE] === PipelineRunType.BUILD,
          )
        : [],
    [pipelines, pipelinesLoaded],
  );
  const testPipelines = React.useMemo(
    () =>
      pipelinesLoaded
        ? pipelines.filter(
            (plr) => plr.metadata?.labels[PipelineRunLabel.PIPELINE_TYPE] === PipelineRunType.TEST,
          )
        : [],
    [pipelines, pipelinesLoaded],
  );

  const [snapshots, sloaded, serror] = useSnapshots(namespace, commit.sha);

  const allResourcesLoaded: boolean =
    componentsLoaded &&
    integrationTestsLoaded &&
    pipelinesLoaded &&
    releasesLoaded &&
    sloaded &&
    releasePlansLoaded;
  const allErrors = [releasePlansError, releasesError, pipelinesError, serror].filter((e) => !!e);

  const commitComponents = React.useMemo(
    () =>
      buildPipelines.map((bp) => bp.metadata.labels[PipelineRunLabel.COMPONENT]).filter((n) => n),
    [buildPipelines],
  );

  const workflowNodes: CommitWorkflowNodeModel[] = React.useMemo(() => {
    const nodes: CommitWorkflowNodeModel[] = [];
    const commitNode: CommitWorkflowNodeModel = {
      id: 'commit',
      label: 'commit',
      type: NodeType.WORKFLOW_NODE,
      width: getLabelWidth('commit'),
      height: DEFAULT_NODE_HEIGHT,
      runAfterTasks: [],
      data: {
        status: runStatus.Succeeded,
        label: 'commit',
        workflowType: CommitWorkflowNodeType.COMMIT,
        isDisabled: false,
        resource: commit,
        application: commit.application,
      },
    };
    nodes.push(commitNode);

    components.forEach((component: ComponentKind) => {
      const {
        metadata: { name: compName },
      } = component;

      if (!commitComponents.includes(compName) || !allResourcesLoaded || allErrors.length > 0) {
        return;
      }

      const latestBuildPipeline: PipelineRunKind = getLatestResource(
        buildPipelines.filter(
          (bp: PipelineRunKind) => bp.metadata?.labels[PipelineRunLabel.COMPONENT] === compName,
        ),
      );

      const name = component.metadata.name;

      const buildName = `${name}-build`;
      const buildNode: CommitWorkflowNodeModel = {
        id: buildName,
        label: buildName,
        type: NodeType.WORKFLOW_NODE,
        width: getLabelWidth(buildName),
        height: DEFAULT_NODE_HEIGHT,
        runAfterTasks: [commitNode.id],
        data: {
          status: pipelineRunStatus(latestBuildPipeline),
          workflowType: CommitWorkflowNodeType.BUILD,
          resource: latestBuildPipeline,
          application: commit.application,
        },
      };
      nodes.push(buildNode);

      const integrationTestPipelines = testPipelines.filter(
        (tp) => tp.metadata?.labels[PipelineRunLabel.COMPONENT] === compName,
      );

      const appTestNodes: CommitWorkflowNodeModel[] = integrationTests.length
        ? integrationTests.map((test) => {
            const testName = test.metadata.name;
            const matchedTest = getLatestResource(
              integrationTestPipelines.filter(
                (tp) =>
                  tp.metadata.labels?.[PipelineRunLabel.TEST_SERVICE_SCENARIO] ===
                  test.metadata.name,
              ),
            );

            const testNode: CommitWorkflowNodeModel = {
              id: addPrefixToResourceName(compName, testName),
              label: testName,
              type: NodeType.WORKFLOW_NODE,
              width: getLabelWidth(testName),
              height: DEFAULT_NODE_HEIGHT,
              runAfterTasks: [buildNode.id],
              data: {
                status: matchedTest ? pipelineRunStatus(matchedTest) : runStatus.Pending,
                workflowType: CommitWorkflowNodeType.APPLICATION_TEST,
                resource: matchedTest,
                application: commit.application,
              },
            };
            return testNode;
          })
        : [
            {
              id: `${name}-application-integration-test`,
              label: 'No app integration test set',
              type: NodeType.WORKFLOW_NODE,
              width: getLabelWidth('No app integration test set'),
              height: DEFAULT_NODE_HEIGHT,
              runAfterTasks: [buildNode.id],
              data: {
                status: runStatus.Pending,
                workflowType: CommitWorkflowNodeType.APPLICATION_TEST,
                application: commit.application,
              },
            },
          ];
      nodes.push(...appTestNodes);
      const appTestNodesWidth = appTestNodes.reduce((max, node) => Math.max(max, node.width), 0);
      appTestNodes.forEach((n) => (n.width = appTestNodesWidth));

      const currentSnapshotName = getLatestResource(
        snapshots.filter(
          (s) =>
            s.metadata.labels[PipelineRunLabel.COMPONENT] === compName &&
            s.metadata.labels[PipelineRunLabel.TEST_SERVICE_EVENT_TYPE_LABEL] ===
              PipelineRunEventType.PUSH,
        ),
      )?.metadata?.name;

      if (!mvpFeature) {
        const latestRelease: ReleaseKind = getLatestResource(
          releases.filter((r) => r.spec.snapshot === currentSnapshotName),
        );

        const releaseStatus: runStatus =
          releases.length === 0
            ? undefined
            : latestRelease && latestRelease?.status
            ? conditionsRunStatus(latestRelease.status.conditions)
            : runStatus.Succeeded;

        const releaseNodes: CommitWorkflowNodeModel[] = releases.length
          ? releases.map((release) => {
              const releaseName = release.metadata.name;

              const releaseNode: CommitWorkflowNodeModel = {
                id: addPrefixToResourceName(compName, releaseName),
                label: releaseName,
                type: NodeType.WORKFLOW_NODE,
                width: getLabelWidth(releaseName),
                height: DEFAULT_NODE_HEIGHT,
                data: {
                  status: releaseStatus,
                  workflowType: CommitWorkflowNodeType.RELEASE,
                  resource: release,
                  application: commit.application,
                },
              };
              return releaseNode;
            })
          : [
              {
                id: `${name}-release`,
                label: 'No releases set',
                type: NodeType.WORKFLOW_NODE,
                width: getLabelWidth('No releases set'),
                height: DEFAULT_NODE_HEIGHT,
                data: {
                  status: runStatus.Pending,
                  workflowType: CommitWorkflowNodeType.RELEASE,
                  application: commit.application,
                },
              },
            ];
        nodes.push(...releaseNodes);
        const releaseNodesWidth = releaseNodes.reduce((max, node) => Math.max(max, node.width), 0);
        releaseNodes.forEach((n) => (n.width = releaseNodesWidth));
        const releaseNodeIds = releaseNodes.map((n) => n.id);

        const releasePlanStatus: (rp: ReleasePlanKind) => runStatus =
          releasePlans.length === 0
            ? undefined
            : (rp) => {
                const matchedRelease = getLatestResource(
                  releases.filter((r) => r.spec.releasePlan === rp.metadata.name),
                );
                return matchedRelease ? pipelineRunStatus(matchedRelease) : runStatus.Pending;
              };

        const managedEnvNodes: CommitWorkflowNodeModel[] = releasePlans.length
          ? releasePlans.map((managedEnv) => {
              const managedEnvName = managedEnv.metadata.name;

              const managedEnvNode: CommitWorkflowNodeModel = {
                id: addPrefixToResourceName(compName, managedEnvName),
                label: managedEnvName,
                type: NodeType.WORKFLOW_NODE,
                width: getLabelWidth(managedEnvName),
                height: DEFAULT_NODE_HEIGHT,
                runAfterTasks: releaseNodeIds,
                data: {
                  status: releasePlanStatus(managedEnv),
                  workflowType: CommitWorkflowNodeType.MANAGED_ENVIRONMENT,
                  resource: managedEnv,
                  application: commit.application,
                },
              };
              return managedEnvNode;
            })
          : [
              {
                id: `${name}-managed-environments`,
                label: 'No managed environments set',
                type: NodeType.WORKFLOW_NODE,
                width: getLabelWidth('No managed environments set'),
                height: DEFAULT_NODE_HEIGHT,
                runAfterTasks: releaseNodeIds,
                data: {
                  status: runStatus.Pending,
                  workflowType: CommitWorkflowNodeType.MANAGED_ENVIRONMENT,
                  application: commit.application,
                },
              },
            ];
        nodes.push(...managedEnvNodes);
        const managedEnvNodesWidth = managedEnvNodes.reduce(
          (max, node) => Math.max(max, node.width),
          0,
        );
        managedEnvNodes.forEach((n) => (n.width = managedEnvNodesWidth));
      }
    });

    return nodes;
  }, [
    commit,
    components,
    commitComponents,
    allResourcesLoaded,
    allErrors.length,
    buildPipelines,
    testPipelines,
    integrationTests,
    snapshots,
    mvpFeature,
    releases,
    releasePlans,
  ]);

  if (!allResourcesLoaded || workflowNodes.length === 0 || allErrors.length > 0) {
    return [[], allResourcesLoaded, allErrors];
  }

  return [workflowNodes, allResourcesLoaded, allErrors];
};
