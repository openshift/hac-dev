import * as React from 'react';
import { ReleaseKind } from '../types';
import { runStatus } from '../utils/pipeline-utils';

export const useReleaseStatus = (release: ReleaseKind) => {
  return React.useMemo(() => {
    if (!release?.status?.conditions) {
      return runStatus.Unknown;
    }

    const progressing = release.status.conditions.some((c) => c.reason === 'Progressing');
    if (progressing) {
      return runStatus['In Progress'];
    }

    const succeeded = release.status.conditions.every(
      (c) => c.reason === 'Succeeded' && c.status === 'True',
    );
    if (succeeded) {
      return runStatus.Succeeded;
    }

    const failed = release.status.conditions.some(
      (c) => c.reason === 'Failed' && c.status === 'False',
    );
    if (failed) {
      return runStatus.Failed;
    }

    return runStatus.Pending;
  }, [release?.status?.conditions]);
};
