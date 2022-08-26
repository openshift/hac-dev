import { useMemo } from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { GitOpsDeploymentGroupVersionKind } from './../models/gitops-deployment';
import { GitOpsDeploymentKind } from './../types/gitops-deployment';

export const useGitOpsDeploymentCR = (
  application: string,
  namespace: string,
): [GitOpsDeploymentKind, boolean, string] => {
  const [gitOpsDeployments, loaded, error] = useK8sWatchResource<GitOpsDeploymentKind[]>({
    groupVersionKind: GitOpsDeploymentGroupVersionKind,
    namespace,
    isList: true,
  });

  const gitOpsDeployment = useMemo(() => {
    if (!gitOpsDeployments?.length) {
      return undefined;
    }
    return gitOpsDeployments.find(
      (deployment) => deployment.metadata?.labels?.['appstudio.application.name'] === application,
    );
  }, [application, gitOpsDeployments]);

  return [gitOpsDeployment, loaded, `${error}`];
};
