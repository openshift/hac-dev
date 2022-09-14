import {
  pipelineWithoutCommits,
  pipelineWithCommits,
  mockCommits,
} from '../../components/Commits/__data__/pipeline-with-commits';
import {
  createCommitObjectFromPLR,
  getCommitDisplayName,
  getCommitsFromPLRs,
  getCommitShortName,
} from '../commits-utils';

describe('commit-utils', () => {
  it('Should return 7 commits with correct details', () => {
    const result = getCommitsFromPLRs(pipelineWithCommits);
    expect(result.length).toBe(7);
    expect(result[0].sha).toBe('commit123');
    expect(result[0].branch).toBe('branch_1');
    expect(result[0].components[0]).toBe('sample-component');
    expect(result[0].user).toBe('abhi');
    expect(result[0].pipelineRuns).toHaveLength(5);
    expect(result[result.length - 1].sha).toBe('commitabc');
    expect(result[result.length - 1].branch).toBe('branch_x');
    expect(result[result.length - 1].components.length).toBe(2);
    expect(result[result.length - 1].user).toBe('abhi');
    expect(result[result.length - 1].pipelineRuns).toHaveLength(2);
  });

  it('Should return 2 commits with correct details', () => {
    const result = getCommitsFromPLRs(pipelineWithCommits.slice(0, 4));
    expect(result.length).toBe(2);
    expect(result[0].sha).toBe('commit123');
    expect(result[0].branch).toBe('branch_1');
    expect(result[0].components[0]).toBe('sample-component');
    expect(result[0].user).toBe('abhi');
    expect(result[0].pipelineRuns).toHaveLength(1);
    expect(result[result.length - 1].sha).toBe('commit14rt');
    expect(result[result.length - 1].branch).toBe('branch_b');
    expect(result[result.length - 1].components[0]).toBe('go-3');
    expect(result[result.length - 1].user).toBe('abhi');
    expect(result[result.length - 1].pipelineRuns).toHaveLength(3);
  });

  it('Should return 0 commits', () => {
    const result = getCommitsFromPLRs(pipelineWithoutCommits);
    expect(result.length).toBe(0);
  });
});

describe('commit-utils create from plr', () => {
  it('Should return correct commit', () => {
    const result = createCommitObjectFromPLR(pipelineWithCommits[0]);
    expect(result).not.toBe(null);
    expect(result.sha).toBe('commit123');
    expect(result.branch).toBe('branch_1');
    expect(result.components[0]).toBe('sample-component');
    expect(result.user).toBe('abhi');
  });

  it('Should return no commit', () => {
    const result = createCommitObjectFromPLR(pipelineWithoutCommits[0]);
    expect(result).toBe(null);
  });
});

describe('commit short name', () => {
  it('Should return correct displayName', () => {
    const displayName = getCommitDisplayName(mockCommits[0]);
    expect(displayName).toBe('comm012');
  });

  it('Should return correct short name', () => {
    const shortName = getCommitShortName(mockCommits[0].sha);
    expect(shortName).toBe('comm012');
  });
});
