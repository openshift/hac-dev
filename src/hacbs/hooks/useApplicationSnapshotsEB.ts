import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { PipelineRunLabel } from '../consts/pipelinerun';
import { ApplicationSnapshotEnvironmentBindingGroupVersionKind } from '../models';
import { SnapshotEnvironmentBinding } from '../types/coreBuildService';

export const useApplicationSnapshotsEB = (
  namespace: string,
  applicationName: string,
): [SnapshotEnvironmentBinding[], boolean, unknown] =>
  useK8sWatchResource<SnapshotEnvironmentBinding[]>({
    groupVersionKind: ApplicationSnapshotEnvironmentBindingGroupVersionKind,
    namespace,
    selector: {
      matchLabels: {
        [PipelineRunLabel.ASEB_APPLICATION]: applicationName,
      },
    },
    isList: true,
  });
