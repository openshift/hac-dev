import { SnapshotLabels } from '../../../consts/pipelinerun';
import { Snapshot } from '../../../types/coreBuildService';

export interface ErrorStatus {
  scenario: string;
  status: string;
  details: string;
  lastUpdateTime: string;
}

export const getEnvironmentProvisionError = (snapshot: Snapshot): ErrorStatus[] => {
  const ENV_PROVISION_ERR = 'EnvironmentProvisionError';
  const itsStatus =
    snapshot.metadata?.annotations &&
    snapshot.metadata?.annotations[SnapshotLabels.ITS_STATUS_ANNOTATION];

  if (!itsStatus) {
    return null;
  }

  let errorStatus = null;

  try {
    const formattedItsStatus = JSON.parse(itsStatus);
    if (Array.isArray(formattedItsStatus) && formattedItsStatus.length > 0) {
      errorStatus = formattedItsStatus?.filter((status) => status.status === ENV_PROVISION_ERR);
    } else if (formattedItsStatus?.Status === ENV_PROVISION_ERR) {
      errorStatus = [formattedItsStatus];
    }
    return errorStatus.sort(
      (a, b) => new Date(b.lastUpdateTime).getTime() - new Date(a.lastUpdateTime).getTime(),
    );
  } catch (e) {
    return null;
  }
};
