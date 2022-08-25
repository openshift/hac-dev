import { DAG } from '../../../../../../topology/dag';
import { NodeType } from '../../const';
import {
  sampleEnvironments,
  sampleEnvironmentsWithInvalidParentEnvironment,
} from '../../hooks/__data__/workflow-data';
import { Workflow, WorkflowNodeType } from '../../types';
import {
  dagtoNodes,
  getLastEnvironments,
  getMaxName,
  getTopologyNodesEdges,
  getWorkflowNodes,
  workflowToNodes,
} from '../visualization-utils';

const sampleWorkflowDag = new DAG();
sampleWorkflowDag.addVertex('task1');
sampleWorkflowDag.addVertex('task2');
sampleWorkflowDag.addVertex('task3');
sampleWorkflowDag.addVertex('task4');

sampleWorkflowDag.addEdge('task1', 'task2');
sampleWorkflowDag.addEdge('task2', 'task3');
sampleWorkflowDag.addEdge('task3', 'task4');

describe('getWorkflowNodes', () => {
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

  test('expect to return empty array', () => {
    const nodes = getWorkflowNodes([]);
    expect(nodes).toHaveLength(0);
  });

  test('expect to return same number of nodes for linear workflows', () => {
    const nodes = getWorkflowNodes(dagtoNodes(sampleWorkflowDag));
    expect(nodes).toHaveLength(sampleWorkflowDag.vertices.size);
  });

  test('expect to contain a spacer node for parallel to parallel workflows', () => {
    const sampleParallelWorkflowDag = new DAG();
    sampleParallelWorkflowDag.addEdges('task1', {}, [], []);
    sampleParallelWorkflowDag.addEdges('task2', {}, [], []);
    sampleParallelWorkflowDag.addEdges('task3', {}, [], ['task1', 'task2']);
    sampleParallelWorkflowDag.addEdges('task4', {}, [], ['task1', 'task2']);
    const nodes = getWorkflowNodes(dagtoNodes(sampleParallelWorkflowDag));
    expect(nodes).toHaveLength(5);
    expect(nodes.filter((n) => n.type === NodeType.SPACER_NODE)).toHaveLength(1);
  });
});

describe('getTopologyNodesEdges', () => {
  test('expect to return nodes and edges empty array', () => {
    const { nodes, edges } = getTopologyNodesEdges([]);
    expect(nodes).toHaveLength(0);
    expect(edges).toHaveLength(0);
  });

  test('expect to return nodes and edges for a workflow', () => {
    const { nodes, edges } = getTopologyNodesEdges(dagtoNodes(sampleWorkflowDag));
    expect(nodes).toHaveLength(4);
    expect(edges).toHaveLength(3);
  });
});

describe('dagtoNodes', () => {
  test('should return empty for invalid values', () => {
    expect(dagtoNodes(null)).toHaveLength(0);
    expect(dagtoNodes(undefined)).toHaveLength(0);
  });

  test('should return empty array if dag instance does not have vertices', () => {
    const dag = new DAG();
    expect(dagtoNodes(dag)).toHaveLength(0);
  });

  test('should return nodes if dag instance with vertices', () => {
    expect(dagtoNodes(sampleWorkflowDag)).toHaveLength(4);
  });
});

describe('workflowToNodes', () => {
  const spyFunc = jest.fn();
  Object.defineProperty(global.document, 'create', { value: spyFunc });

  test('should return empty array for workflow with no steps', () => {
    const sampleWorkflow: Workflow = {};
    expect(workflowToNodes(sampleWorkflow)).toHaveLength(0);
  });

  test('should return empty for invalid values', () => {
    const sampleWorkflow: Workflow = {
      step1: {
        id: 'step-1',
        isAbstractNode: false,
        data: {
          label: 'Step 1',
          workflowType: WorkflowNodeType.PIPELINE,
          isDisabled: false,
          resources: [],
        },
        runBefore: [],
        runAfter: [],
      },
      step2: {
        id: 'step-2',
        isAbstractNode: false,
        data: {
          label: 'Step 2',
          workflowType: WorkflowNodeType.PIPELINE,
          isDisabled: false,
          resources: [],
        },
        runBefore: [],
        runAfter: ['step-1'],
      },
    };

    expect(workflowToNodes(sampleWorkflow)).toHaveLength(2);
  });
});

describe('getLastEnvironments', () => {
  test('should return default environment for invalid values', () => {
    expect(getLastEnvironments([])).toEqual(['static-env']);
    expect(getLastEnvironments(null)).toEqual(['static-env']);
    expect(getLastEnvironments(undefined)).toEqual(['static-env']);
  });

  test('should return the last environments in the list', () => {
    expect(getLastEnvironments(sampleEnvironments)).toEqual(['production-environment']);
  });

  test('should contain the environments with non existing parent name', () => {
    expect(getLastEnvironments(sampleEnvironmentsWithInvalidParentEnvironment)).toEqual([
      'production-environment',
      'testing-environment',
    ]);
  });
});

describe('getMaxName', () => {
  test('should return the max length resources', () => {
    expect(getMaxName([])).toBe(null);
    expect(getMaxName(undefined)).toBe(null);
    expect(getMaxName(null)).toBe(null);

    const comp1 = {
      ...sampleEnvironments[0],
      metadata: {
        name: 'one',
      },
    };
    const comp2 = {
      ...sampleEnvironments[0],
      metadata: {
        name: 'two',
      },
    };
    const comp3 = {
      ...sampleEnvironments[0],
      metadata: {
        name: 'three',
      },
    };
    expect(getMaxName([comp1, comp2, comp3])).toBe('three');
  });
});
