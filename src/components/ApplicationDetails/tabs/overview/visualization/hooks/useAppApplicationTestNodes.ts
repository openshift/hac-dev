import * as React from 'react';
import { PipelineRunLabel } from '../../../../../../consts/pipelinerun';
import { useIntegrationTestScenarios } from '../../../../../../hooks/useIntegrationTestScenarios';
import { useLatestIntegrationTestPipelines } from '../../../../../../hooks/useLatestIntegrationTestPipelines';
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

  const integrationTestNames = React.useMemo(
    () => (testsLoaded && !testsError ? integrationTests.map((test) => test.metadata.name) : []),
    [integrationTests, testsError, testsLoaded],
  );

  const [testPipelines, testPipelinesLoaded, testPipelinesError] =
    useLatestIntegrationTestPipelines(namespace, applicationName, integrationTestNames);

  const allLoaded = testsLoaded && testPipelinesLoaded;
  const allErrors = [testsError, testPipelinesError].filter((e) => !!e);

  const applicationTestNodes = React.useMemo(() => {
    if (!allLoaded || allErrors.length > 0) {
      return [];
    }
    const nodes = integrationTests?.length
      ? integrationTests.map((test) => {
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
            undefined,
            testPipeline,
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
    integrationTests,
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
    integrationTests,
    allLoaded,
    allErrors,
  ];
};
