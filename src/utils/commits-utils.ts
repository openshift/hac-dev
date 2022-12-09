import { PipelineRunLabel, PipelineRunType } from '../consts/pipelinerun';
import { runStatus } from '../shared';
import { PipelineRunKind, Commit } from '../types';

export const statuses = [
  runStatus.Running,
  runStatus.Cancelled,
  runStatus.Failed,
  runStatus.Pending,
  runStatus.Succeeded,
];

export const createCommitObjectFromPLR = (plr: PipelineRunKind): Commit => {
  if (!plr || !plr?.metadata.labels?.[PipelineRunLabel.COMMIT_LABEL]) {
    return null;
  }
  const commitSHA = plr.metadata.labels?.[PipelineRunLabel.COMMIT_LABEL];
  const commitBranch = plr.metadata.annotations?.[PipelineRunLabel.COMMIT_BRANCH_ANNOTATION] ?? '';
  const commitUser = plr.metadata.labels?.[PipelineRunLabel.COMMIT_USER_LABEL];
  const shaURL = plr.metadata.annotations?.[PipelineRunLabel.COMMIT_URL_ANNOTATION];
  const shaTitle = plr.metadata.annotations?.[PipelineRunLabel.COMMIT_SHA_TITLE_ANNOTATION];
  const creationTime = plr.metadata.creationTimestamp;
  const application = plr.metadata.labels[PipelineRunLabel.APPLICATION];
  const component = plr.metadata.labels[PipelineRunLabel.COMPONENT] ?? '';
  const repoURL = plr.metadata.labels[PipelineRunLabel.COMMIT_REPO_URL_LABEL];
  const repoOrg = plr.metadata.labels[PipelineRunLabel.COMMIT_REPO_ORG_LABEL];
  const gitProvider = plr.metadata.labels[PipelineRunLabel.COMMIT_PROVIDER_LABEL];

  return {
    metadata: {
      uid: commitSHA,
      name: commitSHA,
    },
    components: [component],
    user: commitUser,
    sha: commitSHA,
    shaURL,
    repoURL,
    repoOrg,
    gitProvider,
    branch: commitBranch,
    creationTime,
    pipelineRuns: [plr],
    application,
    shaTitle,
  };
};

const updateCommitObject = (plr: PipelineRunKind, commit: Commit): Commit => {
  const newCommit = commit;
  const creationTime = plr.metadata.creationTimestamp;
  const component = plr.metadata.labels[PipelineRunLabel.COMPONENT] ?? '';

  if (newCommit.creationTime < creationTime) {
    newCommit.creationTime = creationTime;
  }
  if (!newCommit.components) {
    newCommit.components = [component];
  } else {
    const compIndex = newCommit.components.findIndex((comp) => comp === component);
    if (compIndex < 0) newCommit.components.push(component);
  }
  newCommit.pipelineRuns.push(plr);
  return newCommit;
};

export const getCommitsFromPLRs = (plrList: PipelineRunKind[], limit?: number): Commit[] => {
  const commits: Commit[] = [];
  plrList.map((plr) => {
    const commitSHA = plr.metadata.labels?.[PipelineRunLabel.COMMIT_LABEL];
    if (commitSHA) {
      const existingCommitIndex = commits.findIndex((commit) => commit.sha === commitSHA);
      if (existingCommitIndex > -1) {
        commits[existingCommitIndex] = updateCommitObject(plr, commits[existingCommitIndex]);
      } else {
        commits.push(createCommitObjectFromPLR(plr));
      }
    }
  });
  const sortedCommits = commits.sort(
    (a, b) => parseInt(a.creationTime, 10) - parseInt(b.creationTime, 10),
  );
  return limit && limit < sortedCommits.length ? sortedCommits.slice(0, limit) : sortedCommits;
};

export const getCommitDisplayName = (commit: Commit): string => commit.sha.slice(0, 7);

export const getCommitShortName = (commitName: string): string => commitName.slice(0, 7);

export const showPLRType = (plr: PipelineRunKind): string => {
  if (!plr) {
    return null;
  }
  const runType = plr?.metadata.labels[PipelineRunLabel.COMMIT_TYPE_LABEL];
  if (!runType) {
    return null;
  }
  if (runType === PipelineRunType.BUILD) {
    return 'Build';
  }
  if (runType === PipelineRunType.TEST) {
    return 'Integration test';
  }
  if (runType === PipelineRunType.RELEASE) {
    return 'Release';
  }
};

export const showPLRMessage = (plr: PipelineRunKind): string => {
  const runType = plr?.metadata.labels[PipelineRunLabel.COMMIT_TYPE_LABEL];
  if (!runType) {
    return null;
  }
  if (runType === PipelineRunType.BUILD) {
    return 'Build deploying';
  }
  if (runType === PipelineRunType.TEST) {
    return 'Testing';
  }
  if (runType === PipelineRunType.RELEASE) {
    return 'Releasing';
  }
};
