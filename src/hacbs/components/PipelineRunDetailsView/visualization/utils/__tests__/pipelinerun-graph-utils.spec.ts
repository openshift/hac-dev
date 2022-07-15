import omit from 'lodash/omit';
import { NodeType } from '../../../../ApplicationDetails/tabs/overview/visualization/const';
import { testPipeline, testPipelineRun } from '../../../../topology/__data__/pipeline-test-data';
import {
  extractDepsFromContextVariables,
  getPipelineDataModel,
  getPipelineFromPipelineRun,
  getPipelineRunDataModel,
} from '../pipelinerun-graph-utils';

describe('pipelinerun-graph-utils: ', () => {
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
  });
});
