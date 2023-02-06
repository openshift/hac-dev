import {
  pipelineWithoutCommits,
  pipelineWithCommits,
  mockCommits,
} from '../../components/Commits/__data__/pipeline-with-commits';
import { Commit } from '../../types';
import {
  createCommitObjectFromPLR,
  createRepoBranchURL,
  createRepoPullRequestURL,
  getCommitDisplayName,
  getCommitsFromPLRs,
  getCommitShortName,
  showPLRMessage,
  showPLRType,
} from '../commits-utils';

describe('commit-utils', () => {
  describe('getCommitsFromPLRs', () => {
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
      expect(result[1].isPullRequest).toBe(true);
      expect(result[1].pullRequestNumber).toBe('11');
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

  describe('createCommitObjectFromPLR: create commit from plr', () => {
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

    it('Should return isPullRequest true for pac based pipelinerun', () => {
      const result = createCommitObjectFromPLR(pipelineWithCommits[1]);
      expect(result.isPullRequest).toBe(true);
    });

    it('Should return pullRequestNumber true for pac based pipelinerun', () => {
      const result = createCommitObjectFromPLR(pipelineWithCommits[1]);
      expect(result.pullRequestNumber).toBe('11');
    });

    it('Should return isPullRequest false if the labels are missing', () => {
      const result = createCommitObjectFromPLR(pipelineWithCommits[2]);
      expect(result.isPullRequest).toBe(false);
      expect(result.pullRequestNumber).toBe('');
    });

    it('Should not return undefined value in the pullRequestNumber', () => {
      const missingPRnumberLabel = {
        ...pipelineWithCommits[1],
        metadata: {
          ...pipelineWithCommits[1].metadata,
          labels: {
            ...pipelineWithCommits[1].metadata.labels,
            'pipelinesascode.tekton.dev/pull-request': undefined,
          },
        },
      };
      const result = createCommitObjectFromPLR(missingPRnumberLabel);
      expect(result.isPullRequest).toBe(true);
      expect(result.pullRequestNumber).toBe('');
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

  describe('showPLRType and Message', () => {
    it('Should return correct type for build', () => {
      const type = showPLRType(pipelineWithCommits[0]);
      expect(type).toBe('Build');
    });

    it('Should return correct type for release', () => {
      const type = showPLRType(pipelineWithCommits[1]);
      expect(type).toBe('Release');
    });

    it('Should return correct type for test', () => {
      const type = showPLRType(pipelineWithCommits[3]);
      expect(type).toBe('Integration test');
    });

    it('Should return correct message for build', () => {
      const message = showPLRMessage(pipelineWithCommits[0]);
      expect(message).toBe('Build deploying');
    });

    it('Should return correct message for release', () => {
      const message = showPLRMessage(pipelineWithCommits[1]);
      expect(message).toBe('Releasing');
    });

    it('Should return correct message for test', () => {
      const message = showPLRMessage(pipelineWithCommits[3]);
      expect(message).toBe('Testing');
    });
  });

  describe('create github branch/pull request link', () => {
    it('should return valid github url or null based on commit object', () => {
      expect(
        createRepoPullRequestURL({
          repoURL: 'https://github.com/a/b',
          pullRequestNumber: '23',
          gitProvider: 'github',
        } as Commit),
      ).toEqual('https://github.com/a/b/pull/23');
      expect(
        createRepoPullRequestURL({
          repoURL: 'https://github.com/a/b',
          pullRequestNumber: '23',
        } as Commit),
      ).toEqual(null);
      expect(
        createRepoPullRequestURL({
          gitProvider: 'github',
          pullRequestNumber: '23',
          repoName: 'b',
          repoOrg: 'a',
        } as Commit),
      ).toEqual('https://github.com/a/b/pull/23');

      expect(
        createRepoPullRequestURL({
          gitProvider: 'github',
          repoName: 'b',
          repoOrg: 'a',
        } as Commit),
      ).toEqual(null);
    });

    it('should return valid github url or null based on commit object', () => {
      expect(
        createRepoBranchURL({
          repoURL: 'https://github.com/a/b',
          branch: 'main',
          gitProvider: 'github',
        } as Commit),
      ).toEqual('https://github.com/a/b/tree/main');
      expect(
        createRepoBranchURL({
          repoURL: 'https://github.com/a/b',
          branch: 'main',
        } as Commit),
      ).toEqual(null);
      expect(
        createRepoBranchURL({
          gitProvider: 'github',
          branch: 'main',
          repoName: 'b',
          repoOrg: 'a',
        } as Commit),
      ).toEqual('https://github.com/a/b/tree/main');

      expect(
        createRepoBranchURL({
          gitProvider: 'github',
          repoName: 'b',
          repoOrg: 'a',
        } as Commit),
      ).toEqual(null);
    });
  });
});
