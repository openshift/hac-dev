import * as React from 'react';
import { Commit } from '../../../types';
import { getCommitDisplayName } from '../../../utils/commits-utils';

type CommitPipelineRunTabProps = {
  commit: Commit;
};

const CommitPipelineRunTab: React.FC<CommitPipelineRunTabProps> = ({ commit }) => {
  return <>PipelineRun of {getCommitDisplayName(commit)}</>;
};

export default CommitPipelineRunTab;
