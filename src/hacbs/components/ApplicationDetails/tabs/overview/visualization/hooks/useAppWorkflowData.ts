import * as React from 'react';
import { K8sResourceCommon } from '@openshift/dynamic-plugin-sdk-utils';
import {
  getEdgesFromNodes,
  getSpacerNodes,
  Model,
  PipelineNodeModel,
} from '@patternfly/react-topology';
import { useApplicationHealthStatus } from '../../../../../../../hooks';
import {
  pipelineRunFilterReducer,
  pipelineRunStatus,
  runStatus,
} from '../../../../../../../shared';
import { PipelineRunKind } from '../../../../../../../shared/components/pipeline-run-logs/types';
import { ComponentKind } from '../../../../../../../types';
import { BUILD_COMPONENT_LABEL } from '../../../../../../../utils/const';
import { useNamespace } from '../../../../../../../utils/namespace-context-utils';
import {
  useBuildPipelines,
  useComponents,
  useEnvironments,
  useIntegrationTestScenarios,
  useReleasePlans,
} from '../../../../../../hooks';
import { EnvironmentType, getEnvironmentType } from '../../../../../Environment/utils';
import { DEFAULT_NODE_HEIGHT } from '../../../../../topology/const';
import { NodeType } from '../const';
import { WorkflowNodeModel, WorkflowNodeModelData, WorkflowNodeType } from '../types';
import { getLastEnvironments, getNodeWidth } from '../utils/visualization-utils';

const UNKNOWN_STATUS = 'unknown';
const NEEDS_MERGE_STATUS = 'PR needs merge';

const RUN_STATUS_SEVERITIES = [
  UNKNOWN_STATUS,
  runStatus.Succeeded,
  runStatus.Idle,
  runStatus.Skipped,
  runStatus.Pending,
  runStatus['In Progress'],
  runStatus.PipelineNotStarted,
  runStatus.Running,
  NEEDS_MERGE_STATUS,
  runStatus.Cancelled,
  runStatus.FailedToStart,
  runStatus.Failed,
];

const getRunStatusComponent = (component, pipelineRuns: PipelineRunKind[]) => {
  const latestPipelineRun = pipelineRuns
    .filter((pr) => pr.metadata.labels?.[BUILD_COMPONENT_LABEL] === component.metadata.name)
    .sort(
      (a, b) =>
        new Date(b.metadata.creationTimestamp).getTime() -
        new Date(a.metadata.creationTimestamp).getTime(),
    )?.[0];
  return latestPipelineRun ? pipelineRunFilterReducer(latestPipelineRun) : NEEDS_MERGE_STATUS;
};

const worstWorkflowStatus = (workFlows: PipelineNodeModel[]) =>
  workFlows.reduce((worstStatus, c) => {
    const statusSeverity = RUN_STATUS_SEVERITIES.indexOf(c.data.status) || 0;
    if (statusSeverity > RUN_STATUS_SEVERITIES.indexOf(worstStatus)) {
      return c.data.status;
    }
    return worstStatus;
  }, '');

const resourceToPipelineNode = (
  resource: K8sResourceCommon,
  workflowType: WorkflowNodeType,
  runAfterTasks: string[] = [],
  status?: runStatus | string,
  label?: string,
): WorkflowNodeModel<WorkflowNodeModelData> => ({
  id: resource.metadata.uid,
  label: label || resource.metadata.name,
  type: NodeType.WORKFLOW_NODE,
  height: DEFAULT_NODE_HEIGHT,
  width: getNodeWidth(resource.metadata.name, status),
  runAfterTasks,
  data: {
    label: label || resource.metadata.name,
    workflowType,
    status,
    resources: [resource],
  },
});

const emptyPipelineNode = (
  id: string,
  label: string,
  workflowType: WorkflowNodeType,
  runAfterTasks: string[] = [],
): WorkflowNodeModel<WorkflowNodeModelData> => ({
  id,
  label: `No ${label.toLowerCase()} set`,
  type: NodeType.WORKFLOW_NODE,
  height: DEFAULT_NODE_HEIGHT,
  width: getNodeWidth(`No ${label.toLowerCase()} set`),
  runAfterTasks,
  data: {
    label,
    isDisabled: true,
    workflowType,
  },
});

const groupToPipelineNode = (
  id: string,
  label: string,
  workflowType: WorkflowNodeType,
  runAfterTasks: string[] = [],
  group: boolean,
  children?: string[],
  childNodes?: WorkflowNodeModel<WorkflowNodeModelData>[],
  resources?: K8sResourceCommon[],
  status?: runStatus | string,
): WorkflowNodeModel<WorkflowNodeModelData> => {
  const isDisabled = !resources?.length;
  return {
    id,
    label: isDisabled && !group ? `No ${label.toLowerCase()} set` : label,
    height: DEFAULT_NODE_HEIGHT,
    type: group ? NodeType.WORKFLOW_GROUP : NodeType.WORKFLOW_NODE,
    width: getNodeWidth(label, status, group ? undefined : children),
    group,
    children,
    runAfterTasks: group ? [] : runAfterTasks,
    style: { padding: [35] },
    data: {
      label,
      workflowType,
      isDisabled,
      groupNode: !group,
      status,
      resources,
      children: !isDisabled ? childNodes : undefined,
    },
  };
};

const getBuildNodeForComponent = (
  component: ComponentKind,
  latestBuilds: PipelineRunKind[],
): WorkflowNodeModel<WorkflowNodeModelData> => {
  const latestbuild = latestBuilds.find(
    (build) => component.metadata.name === build.metadata.labels?.[BUILD_COMPONENT_LABEL],
  );
  if (latestbuild) {
    return resourceToPipelineNode(
      latestbuild,
      WorkflowNodeType.BUILD,
      [component.metadata.uid],
      pipelineRunStatus(latestbuild),
      `Build for ${component.metadata.name}`,
    );
  }
  return {
    id: `${component.metadata.uid}-missing`,
    label: '',
    type: NodeType.WORKFLOW_NODE,
    height: 0,
    width: 0,
    runAfterTasks: [component.metadata.uid],
    data: {
      label: '',
      workflowType: WorkflowNodeType.BUILD,
      hidden: true,
    },
  };
};

export const useAppWorkflowData = (
  applicationName: string,
  expanded: boolean,
): [model: Model, loaded: boolean] => {
  const namespace = useNamespace();
  const [healthStatus] = useApplicationHealthStatus(namespace, applicationName);
  const [components, componentsLoaded] = useComponents(namespace, applicationName);
  const [integrationTestScenario, integrationTestsLoaded] = useIntegrationTestScenarios(
    namespace,
    applicationName,
  );
  const [environments, environmentsLoaded] = useEnvironments(namespace);
  const [releasePlans, releasePlansLoaded] = useReleasePlans(namespace);
  const [buildPipelines, buildPipelinesLoaded] = useBuildPipelines(namespace, applicationName);
  const allResourcesLoaded: boolean =
    componentsLoaded &&
    integrationTestsLoaded &&
    environmentsLoaded &&
    releasePlansLoaded &&
    buildPipelinesLoaded;

  const componentNodes: WorkflowNodeModel<WorkflowNodeModelData>[] = React.useMemo(() => {
    const nodes = components.length
      ? components.map((component) =>
          resourceToPipelineNode(
            component,
            WorkflowNodeType.COMPONENT,
            [],
            getRunStatusComponent(component, buildPipelines),
          ),
        )
      : [emptyPipelineNode('no-components', 'Components', WorkflowNodeType.COMPONENT, [])];
    const maxWidth = nodes.reduce((max, node) => Math.max(max, node.width), 0);
    nodes.forEach((n) => (n.width = maxWidth));
    return nodes;
  }, [buildPipelines, components]);

  const componentGroup: PipelineNodeModel = React.useMemo(
    () =>
      allResourcesLoaded
        ? groupToPipelineNode(
            'components',
            'Components',
            WorkflowNodeType.COMPONENT,
            [],
            expanded,
            expanded ? componentNodes?.map((c) => c.id) : undefined,
            componentNodes,
            components,
            worstWorkflowStatus(componentNodes),
          )
        : undefined,
    [allResourcesLoaded, componentNodes, components, expanded],
  );

  const componentTasks = React.useMemo(
    () =>
      expanded && componentNodes?.length
        ? componentNodes.map((c) => c.id)
        : [componentGroup?.id ?? ''],
    [componentGroup?.id, componentNodes, expanded],
  );

  const latestBuilds = React.useMemo(() => {
    if (!buildPipelinesLoaded || !componentsLoaded) {
      return [];
    }
    return components.reduce((acc, component) => {
      const latestBuild = buildPipelines
        .filter((p) => p.metadata.labels?.[BUILD_COMPONENT_LABEL] === component.metadata.name)
        ?.sort?.(
          (a, b) =>
            new Date(b.metadata.creationTimestamp).getTime() -
            new Date(a.metadata.creationTimestamp).getTime(),
        )?.[0];
      if (latestBuild) {
        acc.push(latestBuild);
      }
      return acc;
    }, [] as PipelineRunKind[]);
  }, [buildPipelines, buildPipelinesLoaded, components, componentsLoaded]);

  const buildNodes: WorkflowNodeModel<WorkflowNodeModelData>[] = React.useMemo(() => {
    const nodes =
      components.length && latestBuilds.length
        ? components.map((component) => getBuildNodeForComponent(component, latestBuilds))
        : [emptyPipelineNode('no-builds', 'Builds', WorkflowNodeType.BUILD, componentTasks)];
    const maxWidth = nodes.reduce((max, node) => Math.max(max, node.width), 0);
    nodes.forEach((n) => (n.width = maxWidth));
    return nodes;
  }, [componentTasks, components, latestBuilds]);

  const buildGroup = React.useMemo(
    () =>
      allResourcesLoaded
        ? groupToPipelineNode(
            'builds',
            'Builds',
            WorkflowNodeType.BUILD,
            componentTasks,
            expanded,
            expanded ? buildNodes?.map((c) => c.id) : undefined,
            buildNodes,
            latestBuilds,
            worstWorkflowStatus(buildNodes),
          )
        : undefined,
    [allResourcesLoaded, buildNodes, componentTasks, latestBuilds, expanded],
  );

  const buildTasks = React.useMemo(
    () => (expanded && buildNodes?.length ? buildNodes.map((c) => c.id) : [buildGroup?.id ?? '']),
    [buildGroup?.id, buildNodes, expanded],
  );

  const componentIntegrationTests = integrationTestScenario?.filter((test) => {
    const contexts = test?.spec?.contexts;
    return contexts?.some((c) => c.name === 'component') ?? false;
  });

  const componentTestNodes = React.useMemo(() => {
    if (!allResourcesLoaded) {
      return [];
    }
    const nodes = componentIntegrationTests?.length
      ? componentIntegrationTests.map((test) =>
          resourceToPipelineNode(test, WorkflowNodeType.COMPONENT_TEST, buildTasks),
        )
      : [
          emptyPipelineNode(
            'no-component-tests',
            'Component tests',
            WorkflowNodeType.COMPONENT_TEST,
            buildTasks,
          ),
        ];
    const maxWidth = nodes.reduce((max, node) => Math.max(max, node.width), 0);
    nodes.forEach((n) => (n.width = maxWidth));
    return nodes;
  }, [allResourcesLoaded, buildTasks, componentIntegrationTests]);

  const componentIntegrationTestTasks = React.useMemo(
    () => (expanded ? componentTestNodes.map((c) => c.id) : []),
    [componentTestNodes, expanded],
  );

  const applicationIntegrationTests = integrationTestScenario?.filter((test) => {
    const contexts = test?.spec?.contexts;
    return contexts?.some((c) => c.name === 'application') ?? false;
  });

  const applicationTestNodes = React.useMemo(() => {
    if (!allResourcesLoaded) {
      return [];
    }
    const nodes = applicationIntegrationTests?.length
      ? applicationIntegrationTests.map((test) =>
          resourceToPipelineNode(
            test,
            WorkflowNodeType.APPLICATION_TEST,
            componentIntegrationTestTasks,
          ),
        )
      : [
          emptyPipelineNode(
            'no-application-tests',
            'Application tests',
            WorkflowNodeType.APPLICATION_TEST,
            componentIntegrationTestTasks,
          ),
        ];
    const maxWidth = nodes.reduce((max, node) => Math.max(max, node.width), 0);
    nodes.forEach((n) => (n.width = maxWidth));
    return nodes;
  }, [allResourcesLoaded, applicationIntegrationTests, componentIntegrationTestTasks]);

  const applicationIntegrationTestTasks = React.useMemo(
    () => (expanded ? applicationTestNodes.map((c) => c.id) : []),
    [applicationTestNodes, expanded],
  );

  const testsGroup = React.useMemo(
    () =>
      allResourcesLoaded
        ? groupToPipelineNode(
            'tests',
            'Tests',
            WorkflowNodeType.TESTS,
            buildTasks,
            expanded,
            expanded
              ? [...componentIntegrationTestTasks, ...applicationIntegrationTestTasks]
              : undefined,
            [...componentTestNodes, ...applicationTestNodes],
            [...componentIntegrationTests, ...applicationIntegrationTests],
          )
        : undefined,
    [
      allResourcesLoaded,
      applicationIntegrationTestTasks,
      applicationIntegrationTests,
      applicationTestNodes,
      buildTasks,
      componentIntegrationTestTasks,
      componentIntegrationTests,
      componentTestNodes,
      expanded,
    ],
  );

  const staticEnvironments = environments.filter(
    (e) => getEnvironmentType(e) === EnvironmentType.static,
  );

  const staticEnvironmentNodes = React.useMemo(() => {
    const nodes = staticEnvironments.length
      ? staticEnvironments.map((staticEnvironment) => {
          const prevEnv = staticEnvironments.find(
            (e) => e.metadata.name === staticEnvironment.spec.parentEnvironment,
          );
          return resourceToPipelineNode(
            staticEnvironment,
            WorkflowNodeType.STATIC_ENVIRONMENT,
            prevEnv ? [prevEnv.metadata.uid] : applicationIntegrationTestTasks,
            healthStatus,
          );
        })
      : [
          emptyPipelineNode(
            'no-static-environments',
            'Static environments',
            WorkflowNodeType.STATIC_ENVIRONMENT,
            applicationIntegrationTestTasks,
          ),
        ];
    const maxWidth = nodes.reduce((max, node) => Math.max(max, node.width), 0);
    nodes.forEach((n) => (n.width = maxWidth));
    return nodes;
  }, [applicationIntegrationTestTasks, healthStatus, staticEnvironments]);

  const staticEnvironmentGroup = React.useMemo(
    () =>
      allResourcesLoaded && testsGroup?.id
        ? groupToPipelineNode(
            'static-environments',
            'Static environments',
            WorkflowNodeType.STATIC_ENVIRONMENT,
            expanded ? applicationIntegrationTestTasks : [testsGroup.id],
            expanded,
            expanded ? staticEnvironmentNodes?.map((c) => c.id) : undefined,
            staticEnvironmentNodes,
            staticEnvironments,
            healthStatus,
          )
        : undefined,
    [
      allResourcesLoaded,
      applicationIntegrationTestTasks,
      expanded,
      healthStatus,
      staticEnvironmentNodes,
      staticEnvironments,
      testsGroup?.id,
    ],
  );

  const lastStaticEnv = getLastEnvironments(staticEnvironments);

  const releasePlanNodes = React.useMemo(() => {
    const nodes = releasePlans.length
      ? releasePlans.map((releasePlan) =>
          resourceToPipelineNode(
            releasePlan,
            WorkflowNodeType.RELEASE,
            lastStaticEnv,
            pipelineRunStatus(releasePlan),
          ),
        )
      : [
          emptyPipelineNode(
            'no-release-plans',
            'Release plans',
            WorkflowNodeType.RELEASE,
            lastStaticEnv,
          ),
        ];
    const maxWidth = nodes.reduce((max, node) => Math.max(max, node.width), 0);
    nodes.forEach((n) => (n.width = maxWidth));
    return nodes;
  }, [lastStaticEnv, releasePlans]);

  const releasePlanGroup = React.useMemo(
    () =>
      allResourcesLoaded
        ? groupToPipelineNode(
            'release-plans',
            'Releases',
            WorkflowNodeType.RELEASE,
            expanded ? lastStaticEnv : [staticEnvironmentGroup?.id ?? ''],
            expanded,
            expanded ? releasePlanNodes?.map((c) => c.id) : undefined,
            releasePlanNodes,
            releasePlans,
          )
        : undefined,
    [
      allResourcesLoaded,
      expanded,
      lastStaticEnv,
      staticEnvironmentGroup?.id,
      releasePlanNodes,
      releasePlans,
    ],
  );

  const releasePlanTasks = React.useMemo(
    () =>
      expanded && releasePlanNodes?.length
        ? releasePlanNodes.map((c) => c.id)
        : [releasePlanGroup?.id ?? ''],
    [releasePlanGroup?.id, releasePlanNodes, expanded],
  );

  const managedEnvironments = environments.filter(
    (e) => getEnvironmentType(e) === EnvironmentType.managed,
  );

  const managedEnvironmentNodes = React.useMemo(() => {
    const nodes = managedEnvironments.length
      ? managedEnvironments.map((managedEnvironment) =>
          resourceToPipelineNode(
            managedEnvironment,
            WorkflowNodeType.MANAGED_ENVIRONMENT,
            releasePlanTasks,
            pipelineRunStatus(managedEnvironment),
          ),
        )
      : [
          emptyPipelineNode(
            'no-managed-environments',
            'Managed environments',
            WorkflowNodeType.MANAGED_ENVIRONMENT,
            releasePlanTasks,
          ),
        ];
    const maxWidth = nodes.reduce((max, node) => Math.max(max, node.width), 0);
    nodes.forEach((n) => (n.width = maxWidth));
    return nodes;
  }, [managedEnvironments, releasePlanTasks]);

  const managedEnvironmentGroup = React.useMemo(
    () =>
      allResourcesLoaded
        ? groupToPipelineNode(
            'managed-environments',
            'Managed environments',
            WorkflowNodeType.MANAGED_ENVIRONMENT,
            releasePlanTasks,
            expanded,
            expanded ? managedEnvironmentNodes?.map((c) => c.id) : undefined,
            managedEnvironmentNodes,
            managedEnvironments,
          )
        : undefined,
    [allResourcesLoaded, expanded, managedEnvironmentNodes, managedEnvironments, releasePlanTasks],
  );

  if (!allResourcesLoaded) {
    return [{ nodes: [], edges: [] }, allResourcesLoaded];
  }

  if (expanded) {
    const resourceNodes: PipelineNodeModel[] = [
      ...(componentNodes?.length ? componentNodes : [componentGroup]),
      ...(buildNodes?.length ? buildNodes : [buildGroup]),
      ...componentTestNodes,
      ...applicationTestNodes,
      ...(staticEnvironmentNodes?.length ? staticEnvironmentNodes : [staticEnvironmentGroup]),
      ...(releasePlanNodes?.length ? releasePlanNodes : [releasePlanGroup]),
      ...(managedEnvironmentNodes?.length ? managedEnvironmentNodes : [managedEnvironmentGroup]),
    ];
    const spacerNodes = getSpacerNodes(resourceNodes, NodeType.SPACER_NODE);
    const nodes = [
      ...resourceNodes,
      ...spacerNodes,
      componentGroup,
      buildGroup,
      testsGroup,
      staticEnvironmentGroup,
      releasePlanGroup,
      managedEnvironmentGroup,
    ];
    const edges = getEdgesFromNodes(nodes, NodeType.SPACER_NODE);

    return [{ nodes, edges }, true];
  }
  const nodes = [
    componentGroup,
    buildGroup,
    testsGroup,
    staticEnvironmentGroup,
    releasePlanGroup,
    managedEnvironmentGroup,
  ];
  const edges = getEdgesFromNodes(nodes, NodeType.SPACER_NODE);

  return [{ nodes, edges }, true];
};
