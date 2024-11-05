import * as React from 'react';
import { ReleaseCondition, ReleaseKind } from '../types';
import { runStatus } from '../utils/pipeline-utils';

export const useReleaseStatus = (release: ReleaseKind) => {
  return React.useMemo(() => {
    if (!release?.status?.conditions) {
      return runStatus.Unknown;
    }

    const releasedCondition = release.status.conditions.find(
      (c) => c.type === ReleaseCondition.Released,
    );

    const succeeded =
      releasedCondition.status === 'True' && releasedCondition.reason === 'Succeeded';
    if (succeeded) {
      return runStatus.Succeeded;
    }

    const progressing = releasedCondition.reason === 'Progressing';
    if (progressing) {
      return runStatus['In Progress'];
    }

    const failed = releasedCondition.reason === 'Failed' && releasedCondition.status === 'False';
    if (failed) {
      return runStatus.Failed;
    }

    return runStatus.Pending;
  }, [release?.status?.conditions]);
};
