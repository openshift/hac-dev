import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { PipelineRunKind } from '../../shared/components/pipeline-run-logs/types';
import { PipelineRunLabel } from '../consts/pipelinerun';
import { ApplicationSnapshotEnvironmentBindingGroupVersionKind } from '../models';

export const useApplicationSnapshotsEB = (
  namespace: string,
  applicationName: string,
): [PipelineRunKind[], boolean, unknown] =>
  useK8sWatchResource<any[]>({
    // todo: add ApplicationSnapshot type
    groupVersionKind: ApplicationSnapshotEnvironmentBindingGroupVersionKind,
    namespace,
    selector: {
      matchLabels: {
        [PipelineRunLabel.ASEB_APPLICATION]: applicationName,
      },
    },
    isList: true,
  });
