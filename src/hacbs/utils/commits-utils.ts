import { PipelineRunLabel } from '../consts/pipelinerun';
import { PipelineRunKind, Commit } from '../types';

export const getCommitsFromPLRs = (plrList: PipelineRunKind[], limit?: number): Commit[] => {
  const commits: Commit[] = [];
  plrList.map((plr) => {
    const commitSHA = plr.metadata.labels?.[PipelineRunLabel.COMMIT_LABEL];
    const commitBranch =
      plr.metadata.annotations?.[PipelineRunLabel.COMMIT_BRANCH_ANNOTATION]
        ?.slice(1, -1)
        .split(',') ?? [];
    const commitUser = plr.metadata.labels?.[PipelineRunLabel.COMMIT_USER_LABEL];
    const shaURL = plr.metadata.annotations?.[PipelineRunLabel.COMMIT_URL_ANNOTATION];
    const creationTime = plr.metadata.creationTimestamp;
    const components =
      plr.metadata.labels[PipelineRunLabel.COMMIT_COMPONENT_LABEL]?.split(',') ?? [];
    const repoURL = plr.metadata.labels[PipelineRunLabel.COMMIT_REPO_URL_LABEL];
    const repoOrg = plr.metadata.labels[PipelineRunLabel.COMMIT_REPO_ORG_LABEL];
    const gitProvider = plr.metadata.labels[PipelineRunLabel.COMMIT_PROVIDER_LABEL];

    if (commitSHA) {
      const existingCommitIndex = commits.findIndex((commit) => commit.sha === commitSHA);
      if (existingCommitIndex > -1) {
        if (commits[existingCommitIndex].creationTime < creationTime) {
          commits[existingCommitIndex].creationTime = creationTime;
        }
        if (!commits[existingCommitIndex].components) {
          commits[existingCommitIndex].components = components;
        }
        if (!commits[existingCommitIndex].repoURL) {
          commits[existingCommitIndex].repoURL = repoURL;
        }
        if (!commits[existingCommitIndex].shaURL) {
          commits[existingCommitIndex].shaURL = shaURL;
        }
        if (!commits[existingCommitIndex].user) {
          commits[existingCommitIndex].user = commitUser;
        }
        commits[existingCommitIndex].pipelineRuns.push(plr);
      } else {
        commits.push({
          metadata: {
            uid: commitSHA,
            name: commitSHA,
          },
          components,
          user: commitUser,
          sha: commitSHA,
          shaURL,
          repoURL,
          repoOrg,
          gitProvider,
          branch: commitBranch,
          creationTime,
          pipelineRuns: [plr],
        });
      }
    }
  });
  const sortedCommits = commits.sort(
    (a, b) => parseInt(a.creationTime, 10) - parseInt(b.creationTime, 10),
  );
  return limit && limit < sortedCommits.length ? sortedCommits.slice(0, limit) : sortedCommits;
};
