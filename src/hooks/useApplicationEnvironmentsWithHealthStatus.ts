import * as React from 'react';
import { EnvironmentKind } from '../types';
import { GitOpsDeploymentHealthStatus } from '../types/gitops-deployment';
import { useNamespace } from '../utils/namespace-context-utils';
import { useSortedEnvironments } from './useEnvironments';
import { useGitOpsDeploymentCR } from './useGitOpsDeploymentCR';

export type EnvironmentKindWithHealthStatus = EnvironmentKind & {
  healthStatus: GitOpsDeploymentHealthStatus;
};

export const useApplicationEnvironmentsWithHealthStatus = (
  applicationName: string,
): [EnvironmentKindWithHealthStatus[], boolean] => {
  const namespace = useNamespace();
  const [environments, environmentsLoaded] = useSortedEnvironments();

  // TODO: Change from gitOpsDeployment to environment based query
  const [gitOpsDeployment, gitOpsDeploymentLoaded] = useGitOpsDeploymentCR(
    applicationName,
    namespace,
  );

  const gitOpsDeploymentHealthStatus = gitOpsDeploymentLoaded
    ? gitOpsDeployment?.status?.health?.status
    : null;

  const envsWithStatus: EnvironmentKindWithHealthStatus[] = React.useMemo(
    () =>
      environmentsLoaded
        ? environments.map((env) => ({ ...env, healthStatus: gitOpsDeploymentHealthStatus }))
        : [],
    [environments, environmentsLoaded, gitOpsDeploymentHealthStatus],
  );

  return [envsWithStatus, gitOpsDeploymentLoaded];
};
