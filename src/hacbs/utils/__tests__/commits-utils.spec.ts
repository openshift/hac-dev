import {
  pipelineWithoutCommits,
  pipelineWithCommits,
} from '../../components/Commits/__data__/pipeline-with-commits';
import { getCommitsFromPLRs } from '../commits-utils';

describe('commit-utils', () => {
  it('Should return 7 commits with correct details', () => {
    const result = getCommitsFromPLRs(pipelineWithCommits);
    expect(result.length).toBe(7);
    expect(result[0].sha).toBe('commit123');
    expect(result[0].branch[0]).toBe('branch_1');
    expect(result[0].components[0]).toBe('sample-component');
    expect(result[0].user).toBe('abhi');
    expect(result[0].pipelineRuns).toHaveLength(5);
    expect(result[result.length - 1].sha).toBe('commitabc');
    expect(result[result.length - 1].branch[0]).toBe('branch_x');
    expect(result[result.length - 1].components.length).toBe(2);
    expect(result[result.length - 1].user).toBe('abhi');
    expect(result[result.length - 1].pipelineRuns).toHaveLength(2);
  });

  it('Should return 2 commits with correct details', () => {
    const result = getCommitsFromPLRs(pipelineWithCommits.slice(0, 4));
    expect(result.length).toBe(2);
    expect(result[0].sha).toBe('commit123');
    expect(result[0].branch[0]).toBe('branch_1');
    expect(result[0].components[0]).toBe('sample-component');
    expect(result[0].user).toBe('abhi');
    expect(result[0].pipelineRuns).toHaveLength(1);
    expect(result[result.length - 1].sha).toBe('commit14rt');
    expect(result[result.length - 1].branch[0]).toBe('branch_b');
    expect(result[result.length - 1].components[0]).toBe('go-3');
    expect(result[result.length - 1].user).toBe('abhi');
    expect(result[result.length - 1].pipelineRuns).toHaveLength(3);
  });

  it('Should return 0 commits', () => {
    const result = getCommitsFromPLRs(pipelineWithoutCommits);
    expect(result.length).toBe(0);
  });
});
