import * as React from 'react';
import {
  getEdgesFromNodes,
  getSpacerNodes,
  Model,
  PipelineNodeModel,
} from '@patternfly/react-topology';
import { useNamespace } from '../../../../../../../utils/namespace-context-utils';
import { NodeType } from '../const';
import { WorkflowNodeType } from '../types';
import { groupToPipelineNode, worstWorkflowStatus } from '../utils/node-utils';
import { useAppApplictionTestNodes } from './useAppApplictionTestNodes';
import { useAppBuildNodes } from './useAppBuildNodes';
import { useAppComponentsNodes } from './useAppComponentsNodes';
import { useAppIntegrationTestNodes } from './useAppIntegrationTestNodes';
import { useAppManagedEnvironmentNodes } from './useAppManagedEnvironmentNodes';
import { useAppReleaseNodes } from './useAppReleaseNodes';
import { useAppStaticEnvironmentNodes } from './useAppStaticEnvironmentNodes';

export const useAppWorkflowData = (
  applicationName: string,
  expanded: boolean,
): [model: Model, loaded: boolean] => {
  const namespace = useNamespace();
  const [componentNodes, componentGroup, componentTasks, componentsLoaded] = useAppComponentsNodes(
    namespace,
    applicationName,
    [],
    expanded,
  );
  const [buildNodes, buildGroup, buildTasks, buildsLoaded] = useAppBuildNodes(
    namespace,
    applicationName,
    componentTasks,
    expanded,
  );
  const [
    componentIntegrationTestNodes,
    componentIntegrationTestTasks,
    componentIntegrationTests,
    integrationTestsLoaded,
  ] = useAppIntegrationTestNodes(namespace, applicationName, buildTasks, expanded);

  const [
    applicationIntegrationTestNodes,
    applicationIntegrationTestTasks,
    applicationIntegrationTests,
    applicationTestsLoaded,
  ] = useAppApplictionTestNodes(
    namespace,
    applicationName,
    componentIntegrationTestTasks,
    expanded,
  );
  const testsGroup = React.useMemo(
    () =>
      integrationTestsLoaded && applicationTestsLoaded
        ? groupToPipelineNode(
            'tests',
            'Tests',
            WorkflowNodeType.TESTS,
            buildTasks,
            expanded,
            expanded
              ? [...componentIntegrationTestTasks, ...applicationIntegrationTestTasks]
              : undefined,
            [...componentIntegrationTestNodes, ...applicationIntegrationTestNodes],
            [...componentIntegrationTests, ...applicationIntegrationTests],
            worstWorkflowStatus([
              ...componentIntegrationTestNodes,
              ...applicationIntegrationTestNodes,
            ]),
          )
        : undefined,
    [
      integrationTestsLoaded,
      applicationTestsLoaded,
      applicationIntegrationTestTasks,
      applicationIntegrationTests,
      applicationIntegrationTestNodes,
      buildTasks,
      componentIntegrationTestTasks,
      componentIntegrationTests,
      componentIntegrationTestNodes,
      expanded,
    ],
  );

  const [staticEnvironmentNodes, staticEnvironmentGroup, lastStaticEnv, staticEnvironmentsLoaded] =
    useAppStaticEnvironmentNodes(
      namespace,
      applicationName,
      expanded ? applicationIntegrationTestTasks : [testsGroup?.id ?? ''],
      expanded,
    );

  const [releaseNodes, releaseGroup, releaseTasks, releasesLoaded] = useAppReleaseNodes(
    namespace,
    applicationName,
    expanded ? lastStaticEnv : [staticEnvironmentGroup?.id ?? ''],
    expanded,
  );

  const [managedEnvironmentNodes, managedEnvironmentGroup, managedEnvironmentsLoaded] =
    useAppManagedEnvironmentNodes(namespace, applicationName, releaseTasks, expanded);
  const allResourcesLoaded: boolean =
    componentsLoaded &&
    buildsLoaded &&
    integrationTestsLoaded &&
    applicationTestsLoaded &&
    staticEnvironmentsLoaded &&
    releasesLoaded &&
    managedEnvironmentsLoaded;

  if (!allResourcesLoaded) {
    return [{ nodes: [], edges: [] }, allResourcesLoaded];
  }

  if (expanded) {
    const resourceNodes: PipelineNodeModel[] = [
      ...(componentNodes?.length ? componentNodes : [componentGroup]),
      ...(buildNodes?.length ? buildNodes : [buildGroup]),
      ...componentIntegrationTestNodes,
      ...applicationIntegrationTestNodes,
      ...(staticEnvironmentNodes?.length ? staticEnvironmentNodes : [staticEnvironmentGroup]),
      ...(releaseNodes?.length ? releaseNodes : [releaseGroup]),
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
      releaseGroup,
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
    releaseGroup,
    managedEnvironmentGroup,
  ];
  const edges = getEdgesFromNodes(nodes, NodeType.SPACER_NODE);

  return [{ nodes, edges }, true];
};
