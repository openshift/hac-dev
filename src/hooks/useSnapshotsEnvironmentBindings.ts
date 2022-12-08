import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { PipelineRunLabel } from '../hacbs/consts/pipelinerun';
import { SnapshotEnvironmentBindingGroupVersionKind } from '../hacbs/models';
import { SnapshotEnvironmentBinding } from '../hacbs/types/coreBuildService';

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
