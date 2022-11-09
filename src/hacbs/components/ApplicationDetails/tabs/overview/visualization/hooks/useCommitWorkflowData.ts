import { RunStatus } from '@patternfly/react-topology';
import { pipelineRunStatus } from '../../../../../../../shared';
import { ComponentKind } from '../../../../../../../types';
import { useNamespace } from '../../../../../../../utils/namespace-context-utils';
import { PipelineRunLabel } from '../../../../../../consts/pipelinerun';
import {
  useComponents,
  useEnvironments,
  useIntegrationTestScenarios,
  useReleasePlans,
  useBuildPipelines,
  useReleases,
  useTestPipelines,
  useApplicationSnapshotsEB,
} from '../../../../../../hooks';
import { Commit, PipelineRunKind } from '../../../../../../types';
import {
  EnvironmentKind,
  IntegrationTestScenarioKind,
  ReleaseKind,
  ReleasePlanKind,
  SnapshotEnvironmentBinding,
} from '../../../../../../types/coreBuildService';
import { CommitComponentResource, Workflow, WorkflowNode, WorkflowNodeType } from '../types';
import {
  getLastEnvironments,
  getLatestResource,
  workflowToNodes,
} from '../utils/visualization-utils';

export const useCommitWorkflowData = (commit: Commit): [nodes: WorkflowNode[], loaded: boolean] => {
  const namespace = useNamespace();
  const applicationName = commit.application;
  const [components, componentsLoaded] = useComponents(namespace, applicationName);
  const [integrationTests, integrationTestsLoaded] = useIntegrationTestScenarios(
    namespace,
    applicationName,
  );
  const [environments, environmentsLoaded] = useEnvironments(namespace);
  const [releasePlans, releasePlansLoaded] = useReleasePlans(namespace);
  const [releases, releasesLoaded] = useReleases(namespace);
  const [buildPipelines, buildPipelinesLoaded] = useBuildPipelines(
    namespace,
    applicationName,
    commit.sha,
  );
  const [testPipelines, testPipelinesLoaded] = useTestPipelines(
    namespace,
    applicationName,
    commit.sha,
  );

  const [applicationSnapshotsEB, applicationSnapshotsLoaded] = useApplicationSnapshotsEB(
    namespace,
    applicationName,
  );

  const allResourcesLoaded: boolean =
    componentsLoaded &&
    integrationTestsLoaded &&
    buildPipelinesLoaded &&
    testPipelinesLoaded &&
    environmentsLoaded &&
    applicationSnapshotsLoaded &&
    releasesLoaded &&
    releasePlansLoaded;

  if (!allResourcesLoaded) {
    return [[], allResourcesLoaded];
  }

  const commitComponents = buildPipelines.map(
    (bp) => bp.metadata.labels[PipelineRunLabel.COMMIT_COMPONENT_LABEL],
  );

  const commitWorkflowData: { [key: string]: any } = components.reduce(
    (acc, component: ComponentKind) => {
      const {
        metadata: { name: compName },
      } = component;

      if (!commitComponents.includes(compName)) {
        return acc;
      }
      const latestBuildPipeline: PipelineRunKind = getLatestResource(
        buildPipelines.filter(
          (bp: PipelineRunKind) => bp.metadata?.labels[PipelineRunLabel.COMPONENT] === compName,
        ),
      );

      const buildPipelinestatus: RunStatus = pipelineRunStatus(latestBuildPipeline) as RunStatus;

      const integrationTestPipelines: PipelineRunKind[] = testPipelines.filter(
        (tp) => tp.metadata?.labels[PipelineRunLabel.TEST_SERVICE_COMPONENT] === compName,
      );

      const latestTestPipeline: PipelineRunKind =
        buildPipelinestatus !== RunStatus.Running
          ? getLatestResource(integrationTestPipelines)
          : undefined;

      const latestApplicationSnapshot: string =
        latestTestPipeline?.metadata?.labels[PipelineRunLabel.TEST_SERVICE_SNAPSHOT];

      const compApplicationSnapshots: SnapshotEnvironmentBinding[] = applicationSnapshotsEB.filter(
        (as) => as.spec.snapshot === latestApplicationSnapshot,
      );

      const latestRelease: ReleaseKind = getLatestResource(
        releases.filter((r) => r.spec.applicationSnapshot === latestApplicationSnapshot),
      );

      const integrationTestStatus: (test: IntegrationTestScenarioKind) => RunStatus = (
        its: IntegrationTestScenarioKind,
      ): RunStatus => {
        const matchedTest = getLatestResource(
          integrationTestPipelines.filter(
            (tp) =>
              tp.metadata.labels?.[PipelineRunLabel.TEST_SERVICE_SCENARIO] === its.metadata.name,
          ),
        );
        return matchedTest ? (pipelineRunStatus(matchedTest) as RunStatus) : RunStatus.Pending;
      };

      const environmentStatus: (env: EnvironmentKind) => RunStatus = (
        environment: EnvironmentKind,
      ): RunStatus => {
        return compApplicationSnapshots.find(
          (as) => as.spec.environment === environment.metadata.name,
        )
          ? RunStatus.Succeeded
          : RunStatus.Pending;
      };

      const releasePlanStatus: (rp: ReleasePlanKind) => RunStatus =
        releasePlans.length === 0
          ? undefined
          : (rp) => {
              const matchedRelease = getLatestResource(
                releases.filter((r) => r.spec.releasePlan === rp.metadata.name),
              );
              return matchedRelease
                ? (pipelineRunStatus(matchedRelease) as RunStatus)
                : RunStatus.Pending;
            };

      const releaseStatus: RunStatus =
        releases.length === 0
          ? undefined
          : latestRelease && latestRelease?.status
          ? (pipelineRunStatus(latestRelease) as RunStatus)
          : RunStatus.Succeeded;

      acc[compName] = {
        component,
        releaseStatus,
        releasePlanStatus,
        environmentStatus,
        buildPipelinestatus,
        integrationTestStatus,
        compIntegrationTestScenarios: integrationTests,
        compReleases: releases,
        compReleasePlans: releasePlans,
        compEnvironments: environments,
      };
      return acc;
    },
    {},
  );

  const getNodeIds = (resources): string[] => resources?.map((r) => r?.metadata?.uid);
  const isResourcesAvailable = (resources): boolean => resources?.length > 0;

  const getCommitWorkflow = (commitComponentsResources: {
    [componentName: string]: CommitComponentResource;
  }) => {
    let workflow: Workflow = {
      commit: {
        id: 'commit',
        isAbstractNode: true,
        data: {
          status: RunStatus.Succeeded,
          label: 'commit',
          workflowType: WorkflowNodeType.COMMIT,
          isDisabled: false,
          resources: [commit],
        },
        runBefore: [],
        runAfter: [],
      },
    };

    if (commitComponentsResources) {
      for (const [, value] of Object.entries(commitComponentsResources)) {
        const {
          component,
          releaseStatus,
          releasePlanStatus,
          buildPipelinestatus,
          integrationTestStatus,
          environmentStatus,
          compReleases,
          compReleasePlans,
          compEnvironments,
          compIntegrationTestScenarios,
        }: CommitComponentResource = value;

        const name = component.metadata.name;

        const componentIntegrationTests = compIntegrationTestScenarios?.filter((test) => {
          const contexts = test?.spec?.contexts;
          return contexts?.some((c) => c.name === 'component') ?? false;
        });

        const applicationIntegrationTests = compIntegrationTestScenarios?.filter((test) => {
          const contexts = test?.spec?.contexts;
          return (!contexts || contexts?.some((c) => c.name === 'application')) ?? false;
        });

        workflow = {
          ...workflow,
          [`${name}-builds`]: {
            id: `${name}-build`,
            isAbstractNode: true,
            data: {
              label: `Build-${name}`,
              workflowType: WorkflowNodeType.PIPELINE,
              status: buildPipelinestatus,
              isDisabled: buildPipelines.length === 0,
              resources: buildPipelines,
            },
            runBefore: [],
            runAfter: ['commit'],
          },
          ...(componentIntegrationTests.length && {
            [`${name}-componentTests`]: {
              id: `${name}-component-integration-test`,
              data: {
                label: `component integration test`,
                workflowType: WorkflowNodeType.PIPELINE,
                status: integrationTestStatus,
                isDisabled: componentIntegrationTests.length === 0,
                resources: componentIntegrationTests,
              },
              runBefore: [],
              runAfter: [`${name}-build`],
            },
          }),
          [`${name}-applicationTests`]: {
            id: `${name}-application-integration-test`,
            data: {
              label: `app integration test`,
              workflowType: WorkflowNodeType.PIPELINE,
              status: integrationTestStatus,
              isDisabled: applicationIntegrationTests.length === 0,
              resources: applicationIntegrationTests,
            },
            runBefore: [],
            runAfter: isResourcesAvailable(componentIntegrationTests)
              ? getNodeIds(componentIntegrationTests)
              : [`${name}-build`],
          },
          [`${name}-staticEnv`]: {
            id: `${name}-static-env`,
            data: {
              label: `${name}-environment`,
              workflowType: WorkflowNodeType.STATIC_ENVIRONMENT,
              status: environmentStatus,
              isDisabled: compEnvironments.length === 0,
              resources: compEnvironments,
            },
            runBefore: [],
            runAfterResourceKey: 'spec.parentEnvironment',
            runAfter: isResourcesAvailable(applicationIntegrationTests)
              ? getNodeIds(applicationIntegrationTests)
              : [`${name}-application-integration-test`],
          },
          [`${name}-release`]: {
            id: `${name}-release`,
            isAbstractNode: true,
            data: {
              label: `release`,
              workflowType: WorkflowNodeType.PIPELINE,
              status: releaseStatus,
              isDisabled: compReleases.length === 0,
              resources: compReleases,
            },
            runBefore: [],
            runAfter: isResourcesAvailable(compEnvironments)
              ? getLastEnvironments(compEnvironments)
              : [`${name}-static-env`],
          },
          [`${name}-releasePlan`]: {
            id: `${name}-release-plans`,
            data: {
              label: `managed environment`,
              workflowType: WorkflowNodeType.MANAGED_ENVIRONMENT,
              status: releasePlanStatus,
              isDisabled: compReleasePlans.length === 0,
              resources: compReleasePlans,
            },
            runBefore: [],
            runAfter: [`${name}-release`],
          },
        };
      }
    }
    return workflow;
  };

  const nodes: WorkflowNode[] = workflowToNodes(getCommitWorkflow(commitWorkflowData));

  return [nodes, allResourcesLoaded];
};
