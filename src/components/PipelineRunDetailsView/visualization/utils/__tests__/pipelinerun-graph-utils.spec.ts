import omit from 'lodash/omit';
import { DataState, testPipelineRuns } from '../../../../../__data__/pipelinerun-data';
import { PipelineRunKind } from '../../../../../types';
import { runStatus, SucceedConditionReason } from '../../../../../utils/pipeline-utils';
import { NodeType } from '../../../../ApplicationDetails/tabs/overview/visualization/const';
import { testPipeline, testPipelineRun } from '../../../../topology/__data__/pipeline-test-data';
import {
  appendStatus,
  extractDepsFromContextVariables,
  getPipelineDataModel,
  getPipelineFromPipelineRun,
  getPipelineRunDataModel,
  nodesHasWhenExpression,
  taskHasWhenExpression,
} from '../pipelinerun-graph-utils';

describe('pipelinerun-graph-utils: ', () => {
  beforeEach(() => {
    const createElement = document.createElement.bind(document);
    document.createElement = (tagName) => {
      if (tagName === 'canvas') {
        return {
          getContext: () => ({
            measureText: () => ({}),
          }),
        };
      }
      return createElement(tagName);
    };
  });

  describe('extractDepsFromContextVariables: ', () => {
    it('should return emtpy array for invalid values', () => {
      expect(extractDepsFromContextVariables('')).toEqual([]);
      expect(extractDepsFromContextVariables(null)).toEqual([]);
      expect(extractDepsFromContextVariables(undefined)).toEqual([]);
    });

    it('should return empty array if the context variable string does not contain results', () => {
      expect(extractDepsFromContextVariables('$(context.pipeline.name)')).toEqual([]);
      expect(extractDepsFromContextVariables('$(context.pipelinerun.name)')).toEqual([]);
    });

    it('should return a task name if the context variable string contains results', () => {
      const contextVariable = '$(tasks.task1.results.sum)';
      expect(extractDepsFromContextVariables(contextVariable)).toEqual(['task1']);
    });

    it('should return a list of task names if the context variable string contains multiple results', () => {
      const contextVariable = '$(tasks.task1.results.sum)  $(tasks.task2.results.sum)';

      expect(extractDepsFromContextVariables(contextVariable)).toEqual(['task1', 'task2']);
    });
  });

  describe('getPipelineFromPipelineRun', () => {
    it('should return null, if pipelinerun does not have a pipelineSpec field in status or spec', () => {
      const plrWithoutPipelineSpec = omit(testPipelineRun, ['status']);
      const pipeline = getPipelineFromPipelineRun(plrWithoutPipelineSpec);
      expect(pipeline).toEqual(null);
    });

    it('should return null, if pipelinerun does not have pipeline labels or name in the metadata field', () => {
      const pipeline = getPipelineFromPipelineRun(
        omit(testPipelineRun, 'metadata.labels', 'metadata.name'),
      );
      expect(pipeline).toBe(null);
    });

    it('should return the pipeline, if pipelinerun has pipelineSpec in status field', () => {
      const executedPipeline = getPipelineFromPipelineRun(testPipelineRun);
      expect(executedPipeline).not.toBe(null);
      expect(executedPipeline.kind).toBe('Pipeline');
    });
  });

  describe('getPipelineDataModel:', () => {
    it('should return null for invalid values ', () => {
      expect(getPipelineDataModel(null)).toBe(null);
      expect(getPipelineDataModel(undefined)).toBe(null);
    });

    it('should return graph, nodes and edges for a given pipeline ', () => {
      const { graph, nodes, edges } = getPipelineDataModel(testPipeline);
      expect(graph).toBeDefined();
      expect(nodes).toHaveLength(7);
      expect(edges).toHaveLength(6);
    });

    it('should return a spacer node ', () => {
      const { nodes } = getPipelineDataModel(testPipeline);
      expect(nodes.filter((n) => n.type === NodeType.SPACER_NODE)).toHaveLength(1);
    });
  });

  describe('getPipelineRunDataModel:', () => {
    it('should return null for invalid values ', () => {
      expect(getPipelineRunDataModel(null)).toBe(null);
      expect(getPipelineRunDataModel(undefined)).toBe(null);
    });

    it('should return null if the pipelinerun does not contain status ', () => {
      expect(getPipelineRunDataModel(omit(testPipelineRun, 'status'))).toBe(null);
    });

    it('should return graph, nodes and edges for a given pipeline ', () => {
      const { graph, nodes, edges } = getPipelineRunDataModel(testPipelineRun);
      expect(graph).toBeDefined();
      expect(nodes).toHaveLength(7);
      expect(edges).toHaveLength(6);
    });

    it('should return a spacer node ', () => {
      const { nodes } = getPipelineRunDataModel(testPipelineRun);
      expect(nodes.filter((n) => n.type === NodeType.SPACER_NODE)).toHaveLength(1);
    });

    it('should set test status counts on nodes', () => {
      const { nodes } = getPipelineRunDataModel(testPipelineRun);
      const failedTestNode = nodes.find((n) => n.id === 'task1');
      expect(failedTestNode.data.testFailCount).toEqual(2);
      expect(failedTestNode.data.testWarnCount).toEqual(0);
      const warningTestNode = nodes.find((n) => n.id === 'task2');
      expect(warningTestNode.data.testFailCount).toEqual(0);
      expect(warningTestNode.data.testWarnCount).toEqual(1);
      const successTestNode = nodes.find((n) => n.id === 'task3');
      expect(successTestNode.data.testFailCount).toEqual(0);
      expect(successTestNode.data.testWarnCount).toEqual(0);
    });
  });

  describe('appendStatus', () => {
    it('should append Idle status if a taskrun status reason is missing', () => {
      const taskList = appendStatus(getPipelineFromPipelineRun(testPipelineRun), testPipelineRun);
      expect(taskList.filter((t) => t.status.reason === runStatus.Idle)).toHaveLength(1);
    });

    it('should append Skipped status for the skipped tasks', () => {
      const taskList = appendStatus(getPipelineFromPipelineRun(testPipelineRun), testPipelineRun);
      expect(taskList.filter((t) => t.status.reason === runStatus.Skipped)).toHaveLength(2);
    });

    it('should append Skipped status for the tasks without status/reason but marked as skipped in pipelinerun status', () => {
      const plrwithoutSkippedStatus = testPipelineRuns[DataState.SKIPPED];
      const taskList = appendStatus(
        getPipelineFromPipelineRun(plrwithoutSkippedStatus),
        plrwithoutSkippedStatus,
      );
      expect(taskList.filter((t) => t.status.reason === runStatus.Skipped)).toHaveLength(1);
    });

    it('should append Idle status if the taskruns are missing and overall pipelinerun status is PipelineRunPending', () => {
      const pendingPipelineRun: PipelineRunKind = {
        ...testPipelineRun,
        status: {
          ...testPipelineRun.status,
          taskRuns: undefined,
          conditions: [
            {
              reason: SucceedConditionReason.PipelineRunPending,
              status: 'False',
              type: 'Succeeded',
            },
          ],
        },
      };
      const taskList = appendStatus(
        getPipelineFromPipelineRun(pendingPipelineRun),
        pendingPipelineRun,
      );
      expect(taskList.filter((t) => t.status.reason === runStatus.Pending)).toHaveLength(6);
    });

    it('should append Cancelled status if the taskruns are missing and overall pipelinerun status is Cancelled', () => {
      const cancelledPipelineRun: PipelineRunKind = {
        ...testPipelineRun,
        status: {
          ...testPipelineRun.status,
          taskRuns: undefined,
          conditions: [
            {
              reason: 'Cancelled',
              status: 'False',
              type: 'Succeeded',
            },
          ],
        },
      };
      const taskList = appendStatus(
        getPipelineFromPipelineRun(cancelledPipelineRun),
        cancelledPipelineRun,
      );
      expect(taskList.filter((t) => t.status.reason === runStatus.Cancelled)).toHaveLength(6);
    });

    it('should append Idle status if the status is missing in pipelinerun and taskrun', () => {
      const idlePipelineRun: PipelineRunKind = {
        ...testPipelineRun,
        status: {
          ...testPipelineRun.status,
          taskRuns: {
            'sum-and-multiply-pipeline-ybpufp-task1': {
              pipelineTaskName: 'task1',
              status: undefined,
            },
          },
          conditions: [],
          pipelineSpec: {
            tasks: [
              {
                name: 'task1',
                taskRef: {
                  kind: 'Task',
                  name: 'sum',
                },
              },
            ],
          },
        },
      };
      const taskList = appendStatus(getPipelineFromPipelineRun(idlePipelineRun), idlePipelineRun);
      expect(taskList.filter((t) => t.status.reason === runStatus.Idle)).toHaveLength(1);
    });
  });

  describe('taskHasWhenExpression', () => {
    const conditionalPipelineRun = testPipelineRuns[DataState.SKIPPED];

    it('should return false if the task does not contain when expressions', () => {
      const taskWithoutWhenExpression = conditionalPipelineRun.status.pipelineSpec.tasks[0];
      expect(taskHasWhenExpression(taskWithoutWhenExpression)).toBe(false);
    });

    it('should return true if the task contains when expressions', () => {
      const taskWithWhenExpression = conditionalPipelineRun.status.pipelineSpec.tasks[1];
      expect(taskHasWhenExpression(taskWithWhenExpression)).toBe(true);
    });
  });

  describe('nodesHasWhenExpression', () => {
    it('should return false if the nodes does not contain when expressions', () => {
      const pipelineRunWithoutWhenexpression = testPipelineRuns[DataState.RUNNING];

      const { nodes } = getPipelineRunDataModel(pipelineRunWithoutWhenexpression);
      expect(nodesHasWhenExpression(nodes)).toBe(false);
    });

    it('should return true if the node contains when expressions', () => {
      const conditionalPipelineRun = testPipelineRuns[DataState.SKIPPED];
      const { nodes } = getPipelineRunDataModel(conditionalPipelineRun);

      expect(nodesHasWhenExpression(nodes)).toBe(true);
    });
  });
});
