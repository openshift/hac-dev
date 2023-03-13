import * as React from 'react';
import { PipelineRunLabel } from '../../../../../../consts/pipelinerun';
import { useIntegrationTestScenarios } from '../../../../../../hooks/useIntegrationTestScenarios';
import { useTestPipelines } from '../../../../../../hooks/useTestPipelines';
import { IntegrationTestScenarioKind } from '../../../../../../types/coreBuildService';
import { pipelineRunStatus, runStatus } from '../../../../../../utils/pipeline-utils';
import { WorkflowNodeModel, WorkflowNodeModelData, WorkflowNodeType } from '../types';
import { emptyPipelineNode, resourceToPipelineNode } from '../utils/node-utils';
import { updateParallelNodeWidths } from '../utils/visualization-utils';

export const useAppApplicationTestNodes = (
  namespace: string,
  applicationName: string,
  previousTasks: string[],
  expanded: boolean,
): [
  nodes: WorkflowNodeModel<WorkflowNodeModelData>[],
  tasks: string[],
  resources: IntegrationTestScenarioKind[],
  loaded: boolean,
  errors: unknown[],
] => {
  const [integrationTests, testsLoaded, testsError] = useIntegrationTestScenarios(
    namespace,
    applicationName,
  );
  const [testPipelines, testPipelinesLoaded, testPipelinesError] = useTestPipelines(
    namespace,
    applicationName,
  );
  const allLoaded = testsLoaded && testPipelinesLoaded;
  const allErrors = [testsError, testPipelinesError].filter((e) => !!e);

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
    if (!allLoaded || allErrors.length > 0) {
      return [];
    }
    const nodes = applicationIntegrationTests?.length
      ? applicationIntegrationTests.map((test: IntegrationTestScenarioKind) => {
          const testPipeline = testPipelines?.find(
            (pipeline) =>
              pipeline.metadata.labels[PipelineRunLabel.TEST_SERVICE_SCENARIO] ===
              test.metadata.name,
          );
          return resourceToPipelineNode(
            test,
            applicationName,
            WorkflowNodeType.APPLICATION_TEST,
            previousTasks,
            testPipeline ? pipelineRunStatus(testPipeline) : runStatus.Pending,
          );
        })
      : [
          emptyPipelineNode(
            'no-application-tests',
            applicationName,
            'No application tests set',
            WorkflowNodeType.APPLICATION_TEST,
            previousTasks,
          ),
        ];
    updateParallelNodeWidths(nodes);
    return nodes;
  }, [
    allLoaded,
    allErrors.length,
    applicationIntegrationTests,
    applicationName,
    previousTasks,
    testPipelines,
  ]);

  const applicationIntegrationTestTasks = React.useMemo(
    () => (expanded ? applicationTestNodes.map((c) => c.id) : []),
    [applicationTestNodes, expanded],
  );

  return [
    applicationTestNodes,
    applicationIntegrationTestTasks,
    applicationIntegrationTests,
    allLoaded,
    allErrors,
  ];
};
