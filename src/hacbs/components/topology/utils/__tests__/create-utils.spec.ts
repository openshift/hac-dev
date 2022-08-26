import { createGenericNode } from '../create-utils';

const sampleTest = {
  type: 'sample-type',
  width: 500,
  height: 100,
};

describe('create-utils', () => {
  test('should return default values if extra data is not passed', () => {
    const nodeCreator = createGenericNode(sampleTest.type, sampleTest.width, sampleTest.height);
    const node = nodeCreator('test-node');
    expect(node).toEqual({
      id: 'test-node',
      label: 'test-node',
      runAfterTasks: [],
      height: 100,
      width: 500,
      type: 'sample-type',
    });
  });

  test('should return a node data', () => {
    const nodeCreator = createGenericNode(sampleTest.type, sampleTest.width, sampleTest.height);
    const node = nodeCreator('task-3', {
      label: 'Custom Label',
      runAfterTasks: ['task1', 'task2'],
    });
    expect(node).toEqual({
      id: 'task-3',
      label: 'Custom Label',
      runAfterTasks: ['task1', 'task2'],
      data: {
        label: 'Custom Label',
        runAfterTasks: ['task1', 'task2'],
      },
      height: 100,
      width: 500,
      type: 'sample-type',
    });
  });
});
