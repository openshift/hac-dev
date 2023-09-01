import * as React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { GitOpsDeploymentGroupVersionKind } from '../models';
import { DeploymentGroupVersionKind } from '../models/deployment';
import { GitOpsDeploymentKind } from '../types';
import { SnapshotEnvironmentBinding } from '../types/coreBuildService';
import { DeploymentKind } from '../types/deployment';

export const useComponentDeployment = (
  namespace: string,
  componentName: string,
  snapshotEB: SnapshotEnvironmentBinding,
) => {
  const gitOpsDeploymentData = snapshotEB?.status?.gitopsDeployments?.find(
    (data) => data.componentName === componentName,
  );
  const [gitOpsDeployment, gitOpsDeploymentLoaded] = useK8sWatchResource<GitOpsDeploymentKind>({
    groupVersionKind: GitOpsDeploymentGroupVersionKind,
    name: gitOpsDeploymentData?.gitopsDeployment,
    namespace,
    isList: false,
  });

  const deploymentResource =
    gitOpsDeploymentLoaded &&
    gitOpsDeployment?.status?.resources?.find((resource) => resource.kind === 'Deployment');

  return useK8sWatchResource<DeploymentKind>(
    React.useMemo(
      () => ({
        groupVersionKind: DeploymentGroupVersionKind,
        isList: false,
        name: deploymentResource?.name,
        namespace: deploymentResource?.namespace,
      }),
      [deploymentResource?.name, deploymentResource?.namespace],
    ),
  );
};
