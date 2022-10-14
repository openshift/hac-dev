import * as React from 'react';
import { getGitOpsDeploymentHealthStatusIcon } from '../utils/gitops-utils';
import { useGitOpsDeploymentCR } from './useGitOpsDeploymentCR';

export const useApplicationHealthStatus = (
  namespace: string,
  applicationName: string,
): [string, React.ReactNode, boolean] => {
  // TODO: Change from gitOpsDeployment to environment based query
  const [gitOpsDeployment, gitOpsDeploymentLoaded] = useGitOpsDeploymentCR(
    applicationName,
    namespace,
  );

  const gitOpsDeploymentHealthStatus = gitOpsDeploymentLoaded
    ? gitOpsDeployment?.status?.health?.status
    : null;

  const gitOpsDeploymentHealthStatusIcon = getGitOpsDeploymentHealthStatusIcon(
    gitOpsDeploymentHealthStatus,
  );

  return [gitOpsDeploymentHealthStatus, gitOpsDeploymentHealthStatusIcon, gitOpsDeploymentLoaded];
};
