import { RunStatus } from '@patternfly/react-topology';
import { EnvironmentKind } from '../../../../../../../types';
import { DAG } from '../../../../../../topology/dag';
import { NodeType } from '../../const';
import {
  sampleBuildPipelines,
  sampleComponents,
  sampleEnvironments,
  sampleEnvironmentsWithInvalidParentEnvironment,
} from '../../hooks/__data__/workflow-data';
import { Workflow, WorkflowNodeType } from '../../types';
import {
  addPrefixFromResourceName,
  appendPrefixToResources,
  dagtoNodes,
  getLastEnvironments,
  getLastEnvironmentsNames,
  getLatestResource,
  getMaxName,
  getNodeWidth,
  getTextWidth,
  getTopologyNodesEdges,
  getWorkflowNodes,
  removePrefixFromResourceName,
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
            measureText: (t) => ({ width: t.length }),
          }),
        };
      }
      return createElement(tagName);
    };
  });

  afterEach(jest.resetAllMocks);

  test('expect to return empty array', () => {
    const nodes = getWorkflowNodes([]);
    expect(nodes).toHaveLength(0);
  });

  test('expect to return same number of workload nodes for linear workflows', () => {
    const nodes = getWorkflowNodes(dagtoNodes(sampleWorkflowDag));
    expect(nodes).toHaveLength(sampleWorkflowDag.vertices.size);
    expect(nodes.filter((n) => n.type === NodeType.WORKFLOW_NODE)).toHaveLength(
      sampleWorkflowDag.vertices.size,
    );
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
    expect(nodes.filter((n) => n.type === NodeType.WORKFLOW_NODE)).toHaveLength(4);
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

  test('should return nodes for the workflow ', () => {
    const sampleWorkflow: Workflow = {
      step1: {
        id: 'step-1',
        isAbstractNode: true,
        data: {
          label: 'Step 1',
          workflowType: WorkflowNodeType.PIPELINE,
          isDisabled: false,
          resources: [sampleComponents[0]],
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
          resources: [sampleBuildPipelines[0]],
        },
        runBefore: [],
        runAfter: ['step-1'],
      },
      step3: {
        id: 'step-3',
        isAbstractNode: false,
        runAfterResourceKey: 'spec.parentEnvironment',
        data: {
          status: () => RunStatus.Succeeded,
          label: 'Step 2',
          workflowType: WorkflowNodeType.STATIC_ENVIRONMENT,
          isDisabled: false,
          resources: sampleEnvironments,
        },
        runBefore: [],
        runAfter: ['step-1', 'step-2'],
      },
    };

    expect(workflowToNodes(sampleWorkflow)).toHaveLength(6);
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

describe('getLastEnvironments', () => {
  test('should return default environment for invalid values', () => {
    expect(getLastEnvironments([])).toEqual(['no-static-environments']);
    expect(getLastEnvironments(null)).toEqual(['no-static-environments']);
    expect(getLastEnvironments(undefined)).toEqual(['no-static-environments']);
  });

  test('should return the last environments in the list', () => {
    expect(getLastEnvironments(sampleEnvironments)).toEqual([
      sampleEnvironments.find((e) => e.metadata.name === 'production-environment').metadata.uid,
    ]);
  });

  test('should contain the environments with non existing parent name', () => {
    expect(getLastEnvironments(sampleEnvironmentsWithInvalidParentEnvironment)).toEqual([
      sampleEnvironmentsWithInvalidParentEnvironment.find(
        (e) => e.metadata.name === 'production-environment',
      ).metadata.uid,
      sampleEnvironmentsWithInvalidParentEnvironment.find(
        (e) => e.metadata.name === 'testing-environment',
      ).metadata.uid,
    ]);
  });
});

describe('getNodeWidth', () => {
  test('should return the max length resources', () => {
    const plainWidth = getNodeWidth('test');
    const statusWidth = getNodeWidth('test', 'danger');
    const badgedWidth = getNodeWidth('test', 'danger', ['1', '2']);
    expect(plainWidth).toBeGreaterThan(0);
    expect(statusWidth).toBeGreaterThan(plainWidth);
    expect(badgedWidth).toBeGreaterThan(statusWidth);
  });
});

describe('getTextWidth', () => {
  test('should return the default value if the text is empty or null', () => {
    expect(getTextWidth('')).toBe(0);
    expect(getTextWidth(null)).toBe(0);
  });

  test('should return the default value if the text is empty or null', () => {
    expect(getTextWidth('text')).toBe(4);
  });
});

describe('getLatestResource', () => {
  test('should return default value for invalid resources', () => {
    expect(getLatestResource(null)).toBeUndefined();
    expect(getLatestResource([])).toBeUndefined();
  });

  test('should return the latest resource', () => {
    expect(getLatestResource(sampleBuildPipelines)).toBe(sampleBuildPipelines[0]);
  });
});

describe('addPrefixFromResourceName', () => {
  test('should return the name with give prefix ', () => {
    expect(addPrefixFromResourceName('test', 'resource-one')).toBe('test#resource-one');
    expect(addPrefixFromResourceName('test-prefix', 'resource-two')).toBe(
      'test-prefix#resource-two',
    );
  });
});

describe('appendPrefixToResources', () => {
  test('should modify all the resources with given prefix ', () => {
    const resources = appendPrefixToResources(sampleBuildPipelines, 'test');
    expect(resources[0].metadata.name).toBe(`test#${sampleBuildPipelines[0].metadata.name}`);
    expect(resources[1].metadata.name).toBe(`test#${sampleBuildPipelines[1].metadata.name}`);
  });

  test('should modify all the resources and its additional path with given prefix ', () => {
    const resources = appendPrefixToResources(
      sampleEnvironments,
      'envprefix',
      'spec.parentEnvironment',
    ) as EnvironmentKind[];
    expect(resources[2].metadata.name).toBe(`envprefix#${sampleEnvironments[2].metadata.name}`);
    expect(resources[2].spec.parentEnvironment).toBe(
      `envprefix#${sampleEnvironments[2].spec.parentEnvironment}`,
    );
  });

  test('should not update the additional path with given prefix when the path is invalid or not defined', () => {
    const resources = appendPrefixToResources(
      sampleEnvironments,
      'envprefix',
      'spec.parentEnvironment',
    ) as EnvironmentKind[];

    const envWithoutParent = resources.find((env) => env.spec.parentEnvironment === undefined);
    expect(envWithoutParent.metadata.name).toBe(`envprefix#${sampleEnvironments[0].metadata.name}`);
    expect(envWithoutParent.spec.parentEnvironment).toBeUndefined;
  });
});

describe('removePrefixFromResourceName', () => {
  test('should return the name without prefix', () => {
    expect(removePrefixFromResourceName('prefix#resource-one')).toBe('resource-one');
  });

  test('should remove multiple prefix', () => {
    expect(removePrefixFromResourceName('test#prefix#resource-two')).toBe('resource-two');
  });
  test('should return the input if it does not contain prefix', () => {
    expect(removePrefixFromResourceName('text')).toBe('text');
  });
});

describe('getLastEnvironmentsNames', () => {
  test('should return default environment for invalid values', () => {
    expect(getLastEnvironmentsNames([])).toEqual(['no-static-environments']);
    expect(getLastEnvironmentsNames(null)).toEqual(['no-static-environments']);
    expect(getLastEnvironmentsNames(undefined)).toEqual(['no-static-environments']);
  });

  test('should return the last environments names in the list', () => {
    expect(getLastEnvironmentsNames(sampleEnvironments)).toEqual([
      sampleEnvironments.find((e) => e.metadata.name === 'production-environment').metadata.name,
    ]);
  });

  test('should contain the environments with non existing parent name', () => {
    expect(getLastEnvironmentsNames(sampleEnvironmentsWithInvalidParentEnvironment)).toEqual([
      sampleEnvironmentsWithInvalidParentEnvironment.find(
        (e) => e.metadata.name === 'production-environment',
      ).metadata.name,
      sampleEnvironmentsWithInvalidParentEnvironment.find(
        (e) => e.metadata.name === 'testing-environment',
      ).metadata.name,
    ]);
  });
});
