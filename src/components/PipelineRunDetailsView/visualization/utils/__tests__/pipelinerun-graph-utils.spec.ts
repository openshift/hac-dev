import { GraphElement, Node } from '@patternfly/react-topology';
import omit from 'lodash/omit';
import { DataState, testPipelineRuns } from '../../../../../__data__/pipelinerun-data';
import { PipelineRunKind, TaskRunKind, TektonResourceLabel } from '../../../../../types';
import { runStatus, SucceedConditionReason } from '../../../../../utils/pipeline-utils';
import { NodeType } from '../../../../ApplicationDetails/tabs/overview/visualization/const';
import { testPipelineRun } from '../../../../topology/__data__/pipeline-test-data';
import { PipelineRunNodeData, PipelineRunNodeType, PipelineTaskStatus } from '../../types';
import {
  appendStatus,
  createStepStatus,
  extractDepsFromContextVariables,
  getPipelineFromPipelineRun,
  getPipelineRunDataModel,
  getTaskBadgeCount,
  isTaskNode,
  nodesHasWhenExpression,
  scrollNodeIntoView,
  taskHasWhenExpression,
} from '../pipelinerun-graph-utils';

describe('pipelinerun-graph-utils: ', () => {
  const getTaskRunsFromPLR = (plr: PipelineRunKind): TaskRunKind[] =>
    Object.keys(plr.status.taskRuns).map((trName) => ({
      apiVersion: 'v1alpha1',
      kind: 'TaskRun',
      metadata: {
        labels: {
          [TektonResourceLabel.pipelineTask]: plr.status.taskRuns[trName].pipelineTaskName,
        },
        name: trName,
      },
      spec: {},
      status: plr.status.taskRuns[trName].status,
    }));

  const taskRuns = getTaskRunsFromPLR(testPipelineRun);

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

  describe('getPipelineRunDataModel:', () => {
    it('should return null for invalid values ', () => {
      expect(getPipelineRunDataModel(null, [])).toBe(null);
      expect(getPipelineRunDataModel(undefined, [])).toBe(null);
    });

    it('should return null if the pipelinerun does not contain status ', () => {
      expect(getPipelineRunDataModel(omit(testPipelineRun, 'status'), [])).toBe(null);
    });

    it('should return graph, nodes and edges for a given pipeline ', () => {
      const { graph, nodes, edges } = getPipelineRunDataModel(testPipelineRun, []);
      expect(graph).toBeDefined();
      expect(nodes).toHaveLength(7);
      expect(edges).toHaveLength(6);
    });

    it('should return a spacer node ', () => {
      const { nodes } = getPipelineRunDataModel(testPipelineRun, []);
      expect(nodes.filter((n) => n.type === NodeType.SPACER_NODE)).toHaveLength(1);
    });

    it('should set test status counts on nodes', () => {
      const { nodes } = getPipelineRunDataModel(testPipelineRun, taskRuns);

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

  describe('getTaskBadgeCount', () => {
    it('should return the correct badge count for tasks', () => {
      const data: PipelineRunNodeData = {
        namespace: 'test-ns',
        task: null,
      };
      expect(getTaskBadgeCount(data)).toBe(0);

      data.testWarnCount = 1;
      data.testFailCount = 0;
      expect(getTaskBadgeCount(data)).toBe(1);

      data.testFailCount = 3;
      expect(getTaskBadgeCount(data)).toBe(4);

      data.scanResults = {
        vulnerabilities: {
          critical: 1,
          high: 3,
          medium: 1,
          low: 1,
        },
      };
      expect(getTaskBadgeCount(data)).toBe(4);

      data.testWarnCount = 0;
      data.testFailCount = 0;
      expect(getTaskBadgeCount(data)).toBe(6);
    });
  });

  describe('appendStatus', () => {
    it('should append Idle status if a taskrun status reason is missing', () => {
      const taskl = appendStatus(
        getPipelineFromPipelineRun({ ...testPipelineRun }),
        { ...testPipelineRun },
        getTaskRunsFromPLR({ ...testPipelineRun }),
      );

      expect(taskl.filter((t) => t.status.reason === runStatus.Idle)).toHaveLength(1);
    });

    it('should use taskruns argument to form the task status', () => {
      const plrWithoutTaskruns: PipelineRunKind = {
        ...testPipelineRun,
        status: {
          ...testPipelineRun.status,
          taskRuns: undefined,
        },
      };

      const taskList = appendStatus(
        getPipelineFromPipelineRun(testPipelineRun),
        plrWithoutTaskruns,
        getTaskRunsFromPLR(testPipelineRun),
      );

      expect(taskList.filter((t) => t.status.reason === runStatus.Skipped)).toHaveLength(2);
    });

    it('should append Skipped status for the skipped tasks', () => {
      const taskList = appendStatus(
        getPipelineFromPipelineRun(testPipelineRun),
        testPipelineRun,
        taskRuns,
      );
      expect(taskList.filter((t) => t.status.reason === runStatus.Skipped)).toHaveLength(2);
    });

    it('should append Skipped status for the tasks without status/reason but marked as skipped in pipelinerun status', () => {
      const plrwithoutSkippedStatus = testPipelineRuns[DataState.SKIPPED];
      const taskList = appendStatus(
        getPipelineFromPipelineRun(plrwithoutSkippedStatus),
        plrwithoutSkippedStatus,
        getTaskRunsFromPLR(plrwithoutSkippedStatus),
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
        [],
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
        [],
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
      const taskList = appendStatus(
        getPipelineFromPipelineRun(idlePipelineRun),
        idlePipelineRun,
        getTaskRunsFromPLR(idlePipelineRun),
      );
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

      const { nodes } = getPipelineRunDataModel(pipelineRunWithoutWhenexpression, []);
      expect(nodesHasWhenExpression(nodes)).toBe(false);
    });

    it('should return true if the node contains when expressions', () => {
      const conditionalPipelineRun = testPipelineRuns[DataState.SKIPPED];
      const { nodes } = getPipelineRunDataModel(conditionalPipelineRun, []);

      expect(nodesHasWhenExpression(nodes)).toBe(true);
    });
  });

  describe('isTaskNode', () => {
    it('should identify task run nodes', () => {
      const createNode = (type: PipelineRunNodeType) =>
        ({
          getType: () => type,
        } as GraphElement);

      expect(isTaskNode(createNode(PipelineRunNodeType.TASK_NODE))).toBe(true);
      expect(isTaskNode(createNode(PipelineRunNodeType.FINALLY_NODE))).toBe(true);
      expect(isTaskNode(createNode(PipelineRunNodeType.FINALLY_GROUP))).toBe(false);
      expect(isTaskNode(createNode(PipelineRunNodeType.EDGE))).toBe(false);
      expect(isTaskNode(createNode(PipelineRunNodeType.SPACER_NODE))).toBe(false);
      expect(isTaskNode(createNode(PipelineRunNodeType.EDGE))).toBe(false);
    });
  });

  describe('scrollNodeIntoView', () => {
    const scrollIntoViewFn = jest.fn();
    const mockNode = {
      getId: () => 'test',
      getBounds: jest.fn(() => ({ width: 10, height: 10, x: 200, y: 0 })),
    } as unknown as Node;
    const mockDOMNode = {
      scrollIntoView: scrollIntoViewFn,
    };

    const mockScrollPane = {
      querySelector: () => mockDOMNode,
      scrollLeft: 0,
      offsetWidth: 100,
      ownerDocument: {
        defaultView: {
          navigator: {
            userAgent: 'test',
          },
        },
      },
      scrollTo: jest.fn(),
    } as unknown as HTMLElement;

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should scroll dom node into view', () => {
      scrollNodeIntoView(mockNode, mockScrollPane);
      expect(scrollIntoViewFn).toHaveBeenCalled();
    });

    it('should scrollTo for Firefox when target is to the right', () => {
      // cast to any because to change the read only type
      (mockScrollPane.ownerDocument.defaultView.navigator as any).userAgent = 'Firefox';

      scrollNodeIntoView(mockNode, mockScrollPane);
      expect(mockScrollPane.scrollTo).toHaveBeenCalledWith({ left: 110, behavior: 'smooth' });
    });

    it('should scrollTo for Firefox when target is to the left', () => {
      // cast to any because to change the read only type
      (mockScrollPane.ownerDocument.defaultView.navigator as any).userAgent = 'Firefox';

      mockScrollPane.scrollLeft = 400;
      scrollNodeIntoView(mockNode, mockScrollPane);
      expect(mockScrollPane.scrollTo).toHaveBeenCalledWith({ left: 200, behavior: 'smooth' });
    });
  });

  describe('createStepStatus', () => {
    it('should return Cancelled status', () => {
      expect(createStepStatus('step1', null)).toEqual({
        name: 'step1',
        status: runStatus.Cancelled,
      });
      expect(createStepStatus('step1', null)).toEqual({
        name: 'step1',
        status: runStatus.Cancelled,
      });
    });

    it('should return Pending status', () => {
      expect(
        createStepStatus('step1', {
          reason: 'test',
          steps: [{ name: 'step1', waiting: {} }],
        } as any as PipelineTaskStatus),
      ).toEqual({
        name: 'step1',
        status: runStatus.Pending,
      });

      expect(
        createStepStatus('step2', {
          reason: 'test',
          steps: [{ name: 'step1', running: {} }],
        } as any as PipelineTaskStatus),
      ).toEqual({
        name: 'step2',
        status: runStatus.Pending,
      });

      expect(
        createStepStatus('step2', {
          reason: 'test',
          steps: [
            { name: 'step1', running: { startedAt: 0 } },
            { name: 'step2', running: { startedAt: 2 } },
          ],
        } as any as PipelineTaskStatus),
      ).toEqual({
        name: 'step2',
        status: runStatus.Pending,
      });
    });

    it('should return Succeeded status', () => {
      expect(
        createStepStatus('step1', {
          reason: 'test',
          steps: [
            { name: 'step1', terminated: { reason: 'Completed', startedAt: 0, finishedAt: 2 } },
          ],
        } as any as PipelineTaskStatus),
      ).toEqual({
        name: 'step1',
        status: runStatus.Succeeded,
        startTime: 0,
        endTime: 2,
      });
    });

    it('should return Failed status', () => {
      expect(
        createStepStatus('step1', {
          reason: 'test',
          steps: [{ name: 'step1', terminated: { startedAt: 0, finishedAt: 2 } }],
        } as any as PipelineTaskStatus),
      ).toEqual({
        name: 'step1',
        status: runStatus.Failed,
        startTime: 0,
        endTime: 2,
      });
    });

    it('should return Test Failure status for the last step in a task', () => {
      expect(
        createStepStatus(
          'step1',
          {
            reason: runStatus.TestFailed,
            steps: [
              { name: 'step1', terminated: { reason: 'Completed', startedAt: 0, finishedAt: 1 } },
              { name: 'step2', terminated: { reason: 'Completed', startedAt: 1, finishedAt: 2 } },
            ],
          } as any as PipelineTaskStatus,
          true, // last step
        ),
      ).toEqual({
        name: 'step1',
        status: runStatus.TestFailed,
        startTime: 0,
        endTime: 1,
      });
    });

    it('should return actual step status if its not the last step in a task', () => {
      expect(
        createStepStatus(
          'step1',
          {
            reason: runStatus.TestFailed,
            steps: [
              { name: 'step1', terminated: { reason: 'Completed', startedAt: 0, finishedAt: 1 } },
              { name: 'step2', terminated: { reason: 'Completed', startedAt: 1, finishedAt: 2 } },
            ],
          } as any as PipelineTaskStatus,
          false, // not a final step
        ),
      ).toEqual({
        name: 'step1',
        status: runStatus.Succeeded,
        startTime: 0,
        endTime: 1,
      });
    });

    it('should return Running status', () => {
      expect(
        createStepStatus('step1', {
          reason: 'test',
          steps: [{ name: 'step1', running: { startedAt: 0 } }],
        } as any as PipelineTaskStatus),
      ).toEqual({
        name: 'step1',
        status: runStatus.Running,
        startTime: 0,
      });

      expect(
        createStepStatus('step2', {
          reason: 'test',
          steps: [
            { name: 'step1', terminated: { startedAt: 0, finishedAt: 2 } },
            { name: 'step2', running: { startedAt: 0 } },
          ],
        } as any as PipelineTaskStatus),
      ).toEqual({
        name: 'step2',
        status: runStatus.Running,
        startTime: 2,
      });
    });
  });
});
