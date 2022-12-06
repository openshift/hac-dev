import * as React from 'react';
import { pipelineRunStatus } from '../../../../../../../shared';
import { PipelineRunKind } from '../../../../../../../shared/components/pipeline-run-logs/types';
import { PipelineRunLabel } from '../../../../../../consts/pipelinerun';
import { useIntegrationTestScenarios } from '../../../../../../hooks/useIntegrationTestScenarios';
import { useTestPipelines } from '../../../../../../hooks/useTestPipelines';
import { IntegrationTestScenarioKind } from '../../../../../../types/coreBuildService';
import { WorkflowNodeModel, WorkflowNodeModelData, WorkflowNodeType } from '../types';
import { emptyPipelineNode, resourceToPipelineNode } from '../utils/node-utils';
import { updateParallelNodeWidths } from '../utils/visualization-utils';

const matchPipelineRunToTest = (
  pipeline: PipelineRunKind,
  test: IntegrationTestScenarioKind,
): boolean => {
  const pipelineRunComponent = pipeline.metadata.labels[PipelineRunLabel.TEST_SERVICE_COMPONENT];
  if (!pipelineRunComponent || !test.spec.contexts?.length) {
    return false;
  }
  return !!test.spec.contexts.find((c) => c.name === pipelineRunComponent);
};

export const useAppIntegrationTestNodes = (
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

  const componentIntegrationTests = React.useMemo(() => {
    if (!allLoaded) {
      return [];
    }
    return integrationTests?.filter((test) => {
      const contexts = test?.spec?.contexts;
      return contexts?.some((c) => c.name === 'component') ?? false;
    });
  }, [allLoaded, integrationTests]);

  const componentTestNodes = React.useMemo(() => {
    if (!allLoaded) {
      return [];
    }
    const nodes = componentIntegrationTests?.length
      ? componentIntegrationTests.map((test) => {
          const testPipeline = testPipelines?.find((pipeline) =>
            matchPipelineRunToTest(pipeline, test),
          );
          return resourceToPipelineNode(
            test,
            WorkflowNodeType.COMPONENT_TEST,
            previousTasks,
            testPipeline ? pipelineRunStatus(testPipeline) : 'Pending',
          );
        })
      : [
          emptyPipelineNode(
            'no-component-tests',
            'No component tests set',
            WorkflowNodeType.COMPONENT_TEST,
            previousTasks,
          ),
        ];
    updateParallelNodeWidths(nodes);
    return nodes;
  }, [allLoaded, componentIntegrationTests, previousTasks, testPipelines]);

  const componentIntegrationTestTasks = React.useMemo(
    () => (expanded ? componentTestNodes.map((c) => c.id) : []),
    [componentTestNodes, expanded],
  );

  return [componentTestNodes, componentIntegrationTestTasks, componentIntegrationTests, allLoaded];
};
