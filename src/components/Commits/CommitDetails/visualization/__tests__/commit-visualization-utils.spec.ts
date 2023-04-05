import { addPrefixToResourceName, getTopologyNodesEdges } from '../commit-visualization-utils';

describe('getTopologyNodesEdges', () => {
  test('expect to return nodes and edges empty array', () => {
    const { nodes, edges } = getTopologyNodesEdges([]);
    expect(nodes).toHaveLength(0);
    expect(edges).toHaveLength(0);
  });
});

describe('addPrefixToResourceName', () => {
  test('should return the name with give prefix ', () => {
    expect(addPrefixToResourceName('test', 'resource-one')).toBe('test--resource-one');
    expect(addPrefixToResourceName('test-prefix', 'resource-two')).toBe(
      'test-prefix--resource-two',
    );
  });
});
