import * as React from 'react';
import { pipelineRunStatus } from '../../../../../../../shared';
import { PipelineRunLabel } from '../../../../../../consts/pipelinerun';
import { useIntegrationTestScenarios, useTestPipelines } from '../../../../../../hooks';
import { IntegrationTestScenarioKind } from '../../../../../../types/coreBuildService';
import { WorkflowNodeModel, WorkflowNodeModelData, WorkflowNodeType } from '../types';
import { emptyPipelineNode, resourceToPipelineNode } from '../utils/node-utils';
import { updateParallelNodeWidths } from '../utils/visualization-utils';

export const useAppApplictionTestNodes = (
  namespace: string,
  applicationName: string,
  previousTasks: string[],
  expanded: boolean,
): [
  nodes: WorkflowNodeModel<WorkflowNodeModelData>[],
  tasks: string[],
  resources: IntegrationTestScenarioKind[],
  loaded: boolean,
] => {
  const [integrationTests, testsLoaded] = useIntegrationTestScenarios(namespace, applicationName);
  const [testPipelines, testPipelinesLoaded] = useTestPipelines(namespace, applicationName);
  const allLoaded = testsLoaded && testPipelinesLoaded;

  const applicationIntegrationTests = React.useMemo(() => {
    if (!allLoaded) {
      return [];
    }
    return integrationTests?.filter((test) => {
      const contexts = test?.spec?.contexts;
      return !contexts || contexts?.some((c) => c.name === 'application');
    });
  }, [allLoaded, integrationTests]);

  const applicationTestNodes = React.useMemo(() => {
    if (!allLoaded) {
      return [];
    }
    const nodes = applicationIntegrationTests?.length
      ? applicationIntegrationTests.map((test) => {
          const testPipeline = testPipelines?.find(
            (pipeline) =>
              pipeline.metadata.labels[PipelineRunLabel.TEST_SERVICE_SCENARIO] ===
              test.metadata.name,
          );
          return resourceToPipelineNode(
            test,
            WorkflowNodeType.APPLICATION_TEST,
            previousTasks,
            testPipeline ? pipelineRunStatus(testPipeline) : 'Pending',
          );
        })
      : [
          emptyPipelineNode(
            'no-application-tests',
            'Application tests',
            WorkflowNodeType.APPLICATION_TEST,
            previousTasks,
          ),
        ];
    updateParallelNodeWidths(nodes);
    return nodes;
  }, [allLoaded, applicationIntegrationTests, previousTasks, testPipelines]);

  const applicationIntegrationTestTasks = React.useMemo(
    () => (expanded ? applicationTestNodes.map((c) => c.id) : []),
    [applicationTestNodes, expanded],
  );

  return [
    applicationTestNodes,
    applicationIntegrationTestTasks,
    applicationIntegrationTests,
    allLoaded,
  ];
};
