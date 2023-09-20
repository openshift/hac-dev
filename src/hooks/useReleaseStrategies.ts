import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { ReleaseStrategyGroupVersionKind } from '../models';
import { ReleaseStrategyKind } from '../types/release-strategy';

export const useReleaseStrategies = (
  namespace: string,
): [ReleaseStrategyKind[], boolean, unknown] =>
  useK8sWatchResource<ReleaseStrategyKind[]>({
    groupVersionKind: ReleaseStrategyGroupVersionKind,
    namespace,
    isList: true,
  });
