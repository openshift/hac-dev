import * as React from 'react';
import { useFeatureFlag } from '@openshift/dynamic-plugin-sdk';
import {
  getEdgesFromNodes,
  getSpacerNodes,
  Model,
  PipelineNodeModel,
} from '@patternfly/react-topology';
import { MVP_FLAG } from '../../../../../../utils/flag-utils';
import { useNamespace } from '../../../../../../utils/namespace-context-utils';
import { NodeType } from '../const';
import { WorkflowNodeType } from '../types';
import { groupToPipelineNode, worstWorkflowStatus } from '../utils/node-utils';
import { useAppApplicationTestNodes } from './useAppApplicationTestNodes';
import { useAppBuildNodes } from './useAppBuildNodes';
import { useAppComponentsNodes } from './useAppComponentsNodes';
import { useAppIntegrationTestNodes } from './useAppIntegrationTestNodes';
import { useAppReleaseNodes } from './useAppReleaseNodes';
import { useAppReleasePlanNodes } from './useAppReleasePlanNodes';
import { useAppStaticEnvironmentNodes } from './useAppStaticEnvironmentNodes';

export const useAppWorkflowData = (
  applicationName: string,
  expanded: boolean,
): [model: Model, loaded: boolean, errors: unknown[]] => {
  const namespace = useNamespace();
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
    componentIntegrationTestNodes,
    componentIntegrationTestTasks,
    componentIntegrationTests,
    integrationTestsLoaded,
    integrationTestsErrors,
  ] = useAppIntegrationTestNodes(namespace, applicationName, buildTasks, expanded);

  const [
    applicationIntegrationTestNodes,
    applicationIntegrationTestTasks,
    applicationIntegrationTests,
    applicationTestsLoaded,
    applicationErrors,
  ] = useAppApplicationTestNodes(
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
            applicationName,
            !applicationIntegrationTests?.length && !applicationIntegrationTests.length
              ? 'No tests set'
              : 'Tests',
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
      applicationName,
      applicationIntegrationTests,
      buildTasks,
      expanded,
      componentIntegrationTestTasks,
      applicationIntegrationTestTasks,
      componentIntegrationTestNodes,
      applicationIntegrationTestNodes,
      componentIntegrationTests,
    ],
  );

  const [
    staticEnvironmentNodes,
    staticEnvironmentGroup,
    lastStaticEnv,
    staticEnvironmentsLoaded,
    staticEnvironmentsErrors,
  ] = useAppStaticEnvironmentNodes(
    namespace,
    applicationName,
    mvpFeature ? buildTasks : expanded ? applicationIntegrationTestTasks : [testsGroup?.id ?? ''],
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
    integrationTestsLoaded &&
    applicationTestsLoaded &&
    staticEnvironmentsLoaded &&
    releasesLoaded &&
    managedEnvironmentsLoaded;

  const errors = [
    ...componentsErrors,
    ...buildsErrors,
    ...integrationTestsErrors,
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
      ...(mvpFeature ? [] : componentIntegrationTestNodes),
      ...(mvpFeature ? [] : applicationIntegrationTestNodes),
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
      ...(mvpFeature ? [] : [testsGroup]),
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
    ...(mvpFeature ? [] : [testsGroup]),
    staticEnvironmentGroup,
    ...(mvpFeature ? [] : [releaseGroup]),
    ...(mvpFeature ? [] : [managedEnvironmentGroup]),
  ];
  const edges = getEdgesFromNodes(nodes, NodeType.SPACER_NODE);

  return [{ nodes, edges }, true, errors];
};
