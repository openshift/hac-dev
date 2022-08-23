import { Action } from '../../../shared/components/action-menu/types';
import { Commit } from '../../types';

export const useCommitActions = (commit: Commit): Action[] => {
  return [
    {
      cta: () => (commit.shaURL ? window.open(commit.shaURL) : null),
      id: `source-${commit.metadata.name.toLowerCase()}`,
      label: 'Go to source',
    },
  ];
};
