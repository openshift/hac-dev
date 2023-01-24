import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { PipelineRunLabel } from '../consts/pipelinerun';
import { SnapshotGroupVersionKind } from '../models';
import { Snapshot } from '../types/coreBuildService';

export const useSnapshots = (namespace: string, commit?: string): [Snapshot[], boolean, unknown] =>
  useK8sWatchResource<Snapshot[]>({
    groupVersionKind: SnapshotGroupVersionKind,
    namespace,
    selector: {
      matchLabels: {
        ...(commit && { [PipelineRunLabel.TEST_SERVICE_COMMIT]: commit }),
      },
    },
    isList: true,
  });
