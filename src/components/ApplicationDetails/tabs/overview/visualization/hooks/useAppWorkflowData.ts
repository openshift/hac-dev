import * as React from 'react';
import { useFeatureFlag } from '@openshift/dynamic-plugin-sdk';
import {
  getEdgesFromNodes,
  getSpacerNodes,
  Model,
  PipelineNodeModel,
} from '@patternfly/react-topology';
import { MVP_FLAG } from '../../../../../../utils/flag-utils';
import { useWorkspaceInfo } from '../../../../../../utils/workspace-context-utils';
import { NodeType } from '../const';
import { WorkflowNodeType } from '../types';
import { groupToPipelineNode, worstWorkflowStatus } from '../utils/node-utils';
import { useAppApplicationTestNodes } from './useAppApplicationTestNodes';
import { useAppBuildNodes } from './useAppBuildNodes';
import { useAppComponentsNodes } from './useAppComponentsNodes';
import { useAppReleaseNodes } from './useAppReleaseNodes';
import { useAppReleasePlanNodes } from './useAppReleasePlanNodes';
import { useAppStaticEnvironmentNodes } from './useAppStaticEnvironmentNodes';

export const useAppWorkflowData = (
  applicationName: string,
  expanded: boolean,
): [model: Model, loaded: boolean, errors: unknown[]] => {
  const { namespace } = useWorkspaceInfo();
  const [mvpFeature] = useFeatureFlag(MVP_FLAG);
  const [componentNodes, componentGroup, componentTasks, componentsLoaded, componentsErrors] =
    useAppComponentsNodes(namespace, applicationName, [], expanded);
  const [buildNodes, buildGroup, buildTasks, buildsLoaded, buildsErrors] = useAppBuildNodes(
    namespace,
    applicationName,
    componentTasks,
    expanded,
  );

  const [
    applicationIntegrationTestNodes,
    applicationIntegrationTestTasks,
    applicationIntegrationTests,
    applicationTestsLoaded,
    applicationErrors,
  ] = useAppApplicationTestNodes(namespace, applicationName, buildTasks, expanded);
  const testsGroup = React.useMemo(() => {
    const testsExist = applicationIntegrationTests?.length || applicationIntegrationTests.length;
    return applicationTestsLoaded
      ? groupToPipelineNode(
          'tests',
          applicationName,
          testsExist ? 'Tests' : 'No tests set',
          WorkflowNodeType.TESTS,
          buildTasks,
          expanded,
          expanded ? applicationIntegrationTestTasks : undefined,
          testsExist ? applicationIntegrationTestNodes : [],
          applicationIntegrationTests,
          worstWorkflowStatus(applicationIntegrationTestNodes),
        )
      : undefined;
  }, [
    applicationTestsLoaded,
    applicationName,
    applicationIntegrationTests,
    buildTasks,
    expanded,
    applicationIntegrationTestTasks,
    applicationIntegrationTestNodes,
  ]);

  const [
    staticEnvironmentNodes,
    staticEnvironmentGroup,
    lastStaticEnv,
    staticEnvironmentsLoaded,
    staticEnvironmentsErrors,
  ] = useAppStaticEnvironmentNodes(
    namespace,
    applicationName,
    expanded ? applicationIntegrationTestTasks : [testsGroup?.id ?? ''],
    expanded,
  );

  const [releaseNodes, releaseGroup, releaseTasks, releasesLoaded, releasesError] =
    useAppReleaseNodes(
      namespace,
      applicationName,
      expanded ? lastStaticEnv : [staticEnvironmentGroup?.id ?? ''],
      expanded,
    );

  const [
    managedEnvironmentNodes,
    managedEnvironmentGroup,
    managedEnvironmentsLoaded,
    managedEnvironmentsError,
  ] = useAppReleasePlanNodes(namespace, applicationName, releaseTasks, expanded);
  const allResourcesLoaded: boolean =
    componentsLoaded &&
    buildsLoaded &&
    applicationTestsLoaded &&
    staticEnvironmentsLoaded &&
    releasesLoaded &&
    managedEnvironmentsLoaded;

  const errors = [
    ...componentsErrors,
    ...buildsErrors,
    ...applicationErrors,
    ...staticEnvironmentsErrors,
    ...releasesError,
    ...managedEnvironmentsError,
  ];

  if (!allResourcesLoaded || errors.length > 0) {
    return [{ nodes: [], edges: [] }, allResourcesLoaded, errors];
  }

  if (expanded) {
    const resourceNodes: PipelineNodeModel[] = [
      ...(componentNodes?.length ? componentNodes : [componentGroup]),
      ...(buildNodes?.length ? buildNodes : [buildGroup]),
      ...applicationIntegrationTestNodes,
      ...(staticEnvironmentNodes?.length ? staticEnvironmentNodes : [staticEnvironmentGroup]),
      ...(mvpFeature ? [] : releaseNodes?.length ? releaseNodes : [releaseGroup]),
      ...(mvpFeature
        ? []
        : managedEnvironmentNodes?.length
        ? managedEnvironmentNodes
        : [managedEnvironmentGroup]),
    ];
    const spacerNodes = getSpacerNodes(resourceNodes, NodeType.SPACER_NODE);
    const nodes = [
      ...resourceNodes,
      ...spacerNodes,
      componentGroup,
      buildGroup,
      testsGroup,
      staticEnvironmentGroup,
      ...(mvpFeature ? [] : [releaseGroup]),
      ...(mvpFeature ? [] : [managedEnvironmentGroup]),
    ];
    const edges = getEdgesFromNodes(nodes, NodeType.SPACER_NODE);

    return [{ nodes, edges }, true, errors];
  }
  const nodes = [
    componentGroup,
    buildGroup,
    testsGroup,
    staticEnvironmentGroup,
    ...(mvpFeature ? [] : [releaseGroup]),
    ...(mvpFeature ? [] : [managedEnvironmentGroup]),
  ];
  const edges = getEdgesFromNodes(nodes, NodeType.SPACER_NODE);

  return [{ nodes, edges }, true, errors];
};
