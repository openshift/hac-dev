import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { PipelineRunLabel } from '../consts/pipelinerun';
import { SnapshotEnvironmentBindingGroupVersionKind } from '../models';
import { SnapshotEnvironmentBinding } from '../types/coreBuildService';

export const useSnapshotsEnvironmentBindings = (
  namespace: string,
  applicationName: string,
): [SnapshotEnvironmentBinding[], boolean, unknown] =>
  useK8sWatchResource<SnapshotEnvironmentBinding[]>({
    groupVersionKind: SnapshotEnvironmentBindingGroupVersionKind,
    namespace,
    selector: {
      matchLabels: {
        [PipelineRunLabel.ASEB_APPLICATION]: applicationName,
      },
    },
    isList: true,
  });
