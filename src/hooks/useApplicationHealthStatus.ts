import { useMemo } from 'react';
import { getApplicationGitopsStatus } from '../utils/environment-utils';
import { useNamespace } from '../utils/namespace-context-utils';
import { useGitOpsDeploymentCR } from './useGitOpsDeploymentCR';
import { useSnapshotsEnvironmentBindings } from './useSnapshotsEnvironmentBindings';

const SNAPSHOT_BINDING_ENV_LABEL = 'appstudio.environment';

export const useApplicationHealthStatus = (
  applicationName: string,
  envName?: string,
): [{ status: string; envName: string }, boolean, unknown] => {
  const namespace = useNamespace();
  const [snapshotEBs, loaded, error] = useSnapshotsEnvironmentBindings(namespace, applicationName);
  const [gitOps, goLoaded, goError] = useGitOpsDeploymentCR(applicationName, namespace);
  const healthStatus = useMemo(() => {
    if (loaded && !error && goLoaded && !goError) {
      if (envName) {
        const seb = snapshotEBs.filter(
          (as) => as.metadata?.labels[SNAPSHOT_BINDING_ENV_LABEL] === envName,
        );
        return seb ? { status: getApplicationGitopsStatus(seb[0], gitOps), envName } : null;
      }
      const seb = snapshotEBs.sort(
        (a, b) =>
          new Date(b.metadata.creationTimestamp).getTime() -
          new Date(a.metadata?.creationTimestamp).getTime(),
      )[0];

      return seb
        ? {
            status: getApplicationGitopsStatus(seb, gitOps),
            envName: seb.metadata.labels[SNAPSHOT_BINDING_ENV_LABEL],
          }
        : null;
    }
    return null;
  }, [envName, error, gitOps, goError, goLoaded, loaded, snapshotEBs]);

  return [healthStatus, loaded, error];
};
