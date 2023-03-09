import * as React from 'react';
import { useFeatureFlag } from '@openshift/dynamic-plugin-sdk';
import { RunStatus } from '@patternfly/react-topology';
import { PipelineRunEventType, PipelineRunLabel } from '../../../../../../consts/pipelinerun';
import { useBuildPipelines } from '../../../../../../hooks/useBuildPipelines';
import { useComponents } from '../../../../../../hooks/useComponents';
import { useEnvironments } from '../../../../../../hooks/useEnvironments';
import { useIntegrationTestScenarios } from '../../../../../../hooks/useIntegrationTestScenarios';
import { useReleasePlans } from '../../../../../../hooks/useReleasePlans';
import { useReleases } from '../../../../../../hooks/useReleases';
import { useSnapshots } from '../../../../../../hooks/useSnapshots';
import { useSnapshotsEnvironmentBindings } from '../../../../../../hooks/useSnapshotsEnvironmentBindings';
import { useTestPipelines } from '../../../../../../hooks/useTestPipelines';
import { pipelineRunStatus } from '../../../../../../shared';
import { ComponentKind, Commit, PipelineRunKind } from '../../../../../../types';
import {
  EnvironmentKind,
  IntegrationTestScenarioKind,
  ReleaseKind,
  ReleasePlanKind,
  SnapshotEnvironmentBinding,
} from '../../../../../../types/coreBuildService';
import { MVP_FLAG } from '../../../../../../utils/flag-utils';
import { useWorkspaceInfo } from '../../../../../../utils/workspace-context-utils';
import {
  CommitComponentResource,
  Workflow,
  WorkflowNodeModel,
  WorkflowNodeModelData,
  WorkflowNodeType,
} from '../types';
import {
  appendPrefixToResources,
  getLastEnvironmentsNames,
  getLatestResource,
  removePrefixFromResourceName,
  workflowToNodes,
} from '../utils/visualization-utils';

export const useCommitWorkflowData = (
  commit: Commit,
): [nodes: WorkflowNodeModel<WorkflowNodeModelData>[], loaded: boolean, errros: unknown[]] => {
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
  const [buildPipelines, buildPipelinesLoaded, buildPipelinesError] = useBuildPipelines(
    namespace,
    applicationName,
    commit.sha,
  );
  const [testPipelines, testPipelinesLoaded, testPipelinesError] = useTestPipelines(
    namespace,
    applicationName,
    commit.sha,
  );

  const [snapshotsEB, snapshotsEBLoaded, snapshotsEBError] = useSnapshotsEnvironmentBindings(
    namespace,
    applicationName,
  );

  const [snapshots, sloaded, serror] = useSnapshots(namespace, commit.sha);

  const allResourcesLoaded: boolean =
    componentsLoaded &&
    integrationTestsLoaded &&
    buildPipelinesLoaded &&
    testPipelinesLoaded &&
    environmentsLoaded &&
    snapshotsEBLoaded &&
    releasesLoaded &&
    sloaded &&
    releasePlansLoaded;
  const allErrors = [
    environmentsError,
    releasePlansError,
    releasesError,
    buildPipelinesError,
    testPipelinesError,
    snapshotsEBError,
    serror,
  ].filter((e) => !!e);

  const commitComponents = React.useMemo(
    () =>
      buildPipelines.map((bp) => bp.metadata.labels[PipelineRunLabel.COMPONENT]).filter((n) => n),
    [buildPipelines],
  );

  const commitWorkflowData: { [key: string]: any } = React.useMemo(
    () =>
      components.reduce((acc, component: ComponentKind) => {
        const {
          metadata: { name: compName },
        } = component;

        if (!commitComponents.includes(compName) || !allResourcesLoaded || allErrors.length > 0) {
          return acc;
        }

        const latestBuildPipeline: PipelineRunKind = getLatestResource(
          buildPipelines.filter(
            (bp: PipelineRunKind) => bp.metadata?.labels[PipelineRunLabel.COMPONENT] === compName,
          ),
        );

        const buildPipelinestatus: RunStatus = pipelineRunStatus(latestBuildPipeline) as RunStatus;

        const integrationTestPipelines: PipelineRunKind[] = testPipelines.filter(
          (tp) => tp.metadata?.labels[PipelineRunLabel.COMPONENT] === compName,
        );

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

        const latestRelease: ReleaseKind = getLatestResource(
          releases.filter((r) => r.spec.snapshot === currentSnapshotName),
        );

        const integrationTestStatus: (test: IntegrationTestScenarioKind) => RunStatus = (
          its: IntegrationTestScenarioKind,
        ): RunStatus => {
          const matchedTest = getLatestResource(
            integrationTestPipelines.filter(
              (tp) =>
                tp.metadata.labels?.[PipelineRunLabel.TEST_SERVICE_SCENARIO] ===
                removePrefixFromResourceName(its.metadata.name),
            ),
          );
          return matchedTest ? (pipelineRunStatus(matchedTest) as RunStatus) : RunStatus.Pending;
        };

        const environmentStatus: (env: EnvironmentKind) => RunStatus = (
          environment: EnvironmentKind,
        ): RunStatus => {
          return compSnapshots.find(
            (as) => as.spec.environment === removePrefixFromResourceName(environment.metadata.name),
          )
            ? RunStatus.Succeeded
            : RunStatus.Pending;
        };

        const releasePlanStatus: (rp: ReleasePlanKind) => RunStatus =
          releasePlans.length === 0
            ? undefined
            : (rp) => {
                const matchedRelease = getLatestResource(
                  releases.filter(
                    (r) => r.spec.releasePlan === removePrefixFromResourceName(rp.metadata.name),
                  ),
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
          compIntegrationTestScenarios: appendPrefixToResources(integrationTests, compName),
          compReleases: appendPrefixToResources(releases, compName),
          compReleasePlans: appendPrefixToResources(releasePlans, compName),
          compEnvironments: appendPrefixToResources(
            environments,
            compName,
            'spec.parentEnvironment',
          ),
        };
        return acc;
      }, {}),
    [
      snapshots,
      snapshotsEB,
      buildPipelines,
      commitComponents,
      components,
      environments,
      integrationTests,
      releasePlans,
      releases,
      testPipelines,
      allResourcesLoaded,
      allErrors,
    ],
  );

  if (!allResourcesLoaded || Object.keys(commitWorkflowData).length === 0 || allErrors.length > 0) {
    return [[], allResourcesLoaded, allErrors];
  }

  const getNodeNames = (resources): string[] => resources?.map((r) => r?.metadata?.name);
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
          return !contexts || contexts?.some((c) => c.name === 'application');
        });

        workflow = {
          ...workflow,
          [`${name}-builds`]: {
            id: `${name}-build`,
            isAbstractNode: true,
            data: {
              label: `build-${name}`,
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
                label: 'component integration test',
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
              label: 'app integration test',
              workflowType: WorkflowNodeType.PIPELINE,
              status: integrationTestStatus,
              isDisabled: applicationIntegrationTests.length === 0,
              resources: applicationIntegrationTests,
            },
            runBefore: [],
            runAfter: isResourcesAvailable(componentIntegrationTests)
              ? getNodeNames(componentIntegrationTests)
              : [`${name}-build`],
          },
          [`${name}-staticEnv`]: {
            id: `${name}-static-env`,
            data: {
              label: 'static environments',
              workflowType: WorkflowNodeType.STATIC_ENVIRONMENT,
              status: environmentStatus,
              isDisabled: compEnvironments.length === 0,
              resources: compEnvironments,
            },
            runBefore: [],
            runAfterResourceKey: 'spec.parentEnvironment',
            runAfter: isResourcesAvailable(applicationIntegrationTests)
              ? getNodeNames(applicationIntegrationTests)
              : [`${name}-application-integration-test`],
          },
          ...(mvpFeature
            ? {}
            : {
                [`${name}-release`]: {
                  id: `${name}-release`,
                  isAbstractNode: true,
                  data: {
                    label: 'release',
                    workflowType: WorkflowNodeType.PIPELINE,
                    status: releaseStatus,
                    isDisabled: compReleases.length === 0,
                    resources: compReleases,
                  },
                  runBefore: [],
                  runAfter: isResourcesAvailable(compEnvironments)
                    ? getLastEnvironmentsNames(compEnvironments)
                    : [`${name}-static-env`],
                },
                [`${name}-releasePlan`]: {
                  id: `${name}-release-plans`,
                  data: {
                    label: 'managed environments',
                    workflowType: WorkflowNodeType.MANAGED_ENVIRONMENT,
                    status: releasePlanStatus,
                    isDisabled: compReleasePlans.length === 0,
                    resources: compReleasePlans,
                  },
                  runBefore: [],
                  runAfter: [`${name}-release`],
                },
              }),
        };
      }
    }
    return workflow;
  };

  const nodes: WorkflowNodeModel<WorkflowNodeModelData>[] = workflowToNodes(
    getCommitWorkflow(commitWorkflowData),
  );

  return [nodes, allResourcesLoaded, allErrors];
};
