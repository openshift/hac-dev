import { DAG } from '../../../../../../topology/dag';
import {
  sampleEnvironments,
  sampleEnvironmentsWithInvalidParentEnvironment,
} from '../../hooks/__data__/workflow-data';
import { getLastEnvironments, getNodeWidth } from '../visualization-utils';

const sampleWorkflowDag = new DAG();
sampleWorkflowDag.addVertex('task1');
sampleWorkflowDag.addVertex('task2');
sampleWorkflowDag.addVertex('task3');
sampleWorkflowDag.addVertex('task4');

sampleWorkflowDag.addEdge('task1', 'task2');
sampleWorkflowDag.addEdge('task2', 'task3');
sampleWorkflowDag.addEdge('task3', 'task4');

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
