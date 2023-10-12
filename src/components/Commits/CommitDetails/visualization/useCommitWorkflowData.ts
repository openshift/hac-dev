import * as React from 'react';
import { useFeatureFlag } from '@openshift/dynamic-plugin-sdk';
import {
  PipelineRunEventType,
  PipelineRunLabel,
  PipelineRunType,
} from '../../../../consts/pipelinerun';
import { useComponents } from '../../../../hooks/useComponents';
import { useEnvironments } from '../../../../hooks/useEnvironments';
import { useIntegrationTestScenarios } from '../../../../hooks/useIntegrationTestScenarios';
import { usePipelineRunsForCommit } from '../../../../hooks/usePipelineRuns';
import { useReleasePlans } from '../../../../hooks/useReleasePlans';
import { useReleases } from '../../../../hooks/useReleases';
import { useSnapshots } from '../../../../hooks/useSnapshots';
import { useSnapshotsEnvironmentBindings } from '../../../../hooks/useSnapshotsEnvironmentBindings';
import { Commit, ComponentKind, EnvironmentKind, PipelineRunKind } from '../../../../types';
import {
  ReleaseKind,
  ReleasePlanKind,
  SnapshotEnvironmentBinding,
} from '../../../../types/coreBuildService';
import { GitOpsDeploymentHealthStatus } from '../../../../types/gitops-deployment';
import { MVP_FLAG } from '../../../../utils/flag-utils';
import {
  conditionsRunStatus,
  pipelineRunStatus,
  pipelineRunStatusToGitOpsStatus,
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
  const [environments, environmentsLoaded, environmentsError] = useEnvironments();
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

  const [snapshotsEB, snapshotsEBLoaded, snapshotsEBError] = useSnapshotsEnvironmentBindings(
    namespace,
    applicationName,
  );

  const [snapshots, sloaded, serror] = useSnapshots(namespace, commit.sha);

  const allResourcesLoaded: boolean =
    componentsLoaded &&
    integrationTestsLoaded &&
    pipelinesLoaded &&
    environmentsLoaded &&
    snapshotsEBLoaded &&
    releasesLoaded &&
    sloaded &&
    releasePlansLoaded;
  const allErrors = [
    environmentsError,
    releasePlansError,
    releasesError,
    pipelinesError,
    snapshotsEBError,
    serror,
  ].filter((e) => !!e);

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

      const integrationTestPipelines: PipelineRunKind[] = testPipelines.filter(
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
      const appNodeIds = appTestNodes.length ? appTestNodes.map((n) => n.id) : [buildNode.id];

      const currentSnapshotName = getLatestResource(
        snapshots.filter(
          (s) =>
            s.metadata.labels[PipelineRunLabel.COMPONENT] === compName &&
            s.metadata.labels[PipelineRunLabel.TEST_SERVICE_EVENT_TYPE_LABEL] ===
              PipelineRunEventType.PUSH,
        ),
      )?.metadata?.name;

      const compSnapshots: SnapshotEnvironmentBinding[] = snapshotsEB.filter(
        (as) => as.spec.snapshot === currentSnapshotName,
      );

      const environmentStatus: (env: EnvironmentKind) => runStatus = (
        environment: EnvironmentKind,
      ): runStatus => {
        return compSnapshots.find((as) => as.spec.environment === environment.metadata.name)
          ? runStatus.Succeeded
          : runStatus.Pending;
      };

      const staticEnvNodes: CommitWorkflowNodeModel[] = environments.length
        ? environments.map((environment) => {
            const environmentName = environment.metadata.name;
            const runAfterTasks = environment.spec.parentEnvironment
              ? [environment.spec.parentEnvironment]
              : appNodeIds;
            const latestRelease = releases
              .filter((release) => release.spec.releasePlan === environment.metadata.name)
              .sort((a, b) => (a.status.startTime > b.status.startTime ? -1 : 1))[0];

            const envNode: CommitWorkflowNodeModel = {
              id: addPrefixToResourceName(compName, environmentName),
              label: environmentName,
              type: NodeType.WORKFLOW_NODE,
              width: getLabelWidth(environmentName),
              height: DEFAULT_NODE_HEIGHT,
              runAfterTasks,
              data: {
                status: environmentStatus(environment),
                workflowType: CommitWorkflowNodeType.STATIC_ENVIRONMENT,
                resource: {
                  ...environment,
                  healthStatus: latestRelease
                    ? pipelineRunStatusToGitOpsStatus(
                        conditionsRunStatus(latestRelease.status?.conditions),
                      )
                    : GitOpsDeploymentHealthStatus.Missing,
                  lastDeploy: latestRelease?.status.completionTime,
                },
                application: commit.application,
              },
            };
            return envNode;
          })
        : [
            {
              id: `${name}-static-env`,
              label: 'No static environments set',
              type: NodeType.WORKFLOW_NODE,
              width: getLabelWidth('No static environments set'),
              height: DEFAULT_NODE_HEIGHT,
              runAfterTasks: appNodeIds,
              data: {
                status: runStatus.Pending,
                workflowType: CommitWorkflowNodeType.STATIC_ENVIRONMENT,
                application: commit.application,
              },
            },
          ];

      nodes.push(...staticEnvNodes);
      const staticEnvNodesWidth = staticEnvNodes.reduce(
        (max, node) => Math.max(max, node.width),
        0,
      );
      staticEnvNodes.forEach((n) => (n.width = staticEnvNodesWidth));

      if (!mvpFeature) {
        const lastStaticEnvNodeIds = environments.length
          ? staticEnvNodes.reduce((acc, env) => {
              if (!staticEnvNodes.find((node) => node.runAfterTasks?.includes(env.id))) {
                acc.push(env.id);
              }
              return acc;
            }, [])
          : [`${name}-static-env`];
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
                runAfterTasks: lastStaticEnvNodeIds,
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
                runAfterTasks: lastStaticEnvNodeIds,
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
    snapshotsEB,
    environments,
    mvpFeature,
    releases,
    releasePlans,
  ]);

  if (!allResourcesLoaded || workflowNodes.length === 0 || allErrors.length > 0) {
    return [[], allResourcesLoaded, allErrors];
  }

  return [workflowNodes, allResourcesLoaded, allErrors];
};
