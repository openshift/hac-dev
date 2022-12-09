import { BaseGraph } from '@patternfly/react-topology';
import { layoutFactory, PipelineLayout } from '../layoutFactory';

jest.mock('@patternfly/react-topology', () => {
  const originalModule = jest.requireActual('@patternfly/react-topology');
  return {
    ...originalModule,
    PipelineDagreLayout: jest.fn(),
  };
});

describe('layoutFactory', () => {
  const graph = new BaseGraph();

  test('should return null for invalid values', () => {
    expect(layoutFactory(null, graph)).toBeNull();
    expect(layoutFactory(undefined, graph)).toBeNull();
    expect(layoutFactory('invalid-layout', graph)).toBeNull();
  });

  test('should return layout for valid layouts options', () => {
    expect(layoutFactory(PipelineLayout.PIPELINERUN_VISUALIZATION, graph)).toBeDefined();
    expect(layoutFactory(PipelineLayout.EXPANDED_WORKFLOW_VISUALIZATION, graph)).toBeDefined();
    expect(layoutFactory(PipelineLayout.COMMIT_VISUALIZATION, graph)).toBeDefined();
    expect(layoutFactory(PipelineLayout.WORKFLOW_VISUALIZATION, graph)).toBeDefined();
  });
});
