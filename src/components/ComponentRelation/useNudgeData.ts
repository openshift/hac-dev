import * as React from 'react';
import { useComponents } from '../../hooks/useComponents';
import { ComponentKind, NudgeStats } from '../../types';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';
import { ComponentRelationNudgeType, ComponentRelationValue } from './type';

export const useNudgeData = (application: string): [ComponentRelationValue[], boolean, any] => {
  const { namespace } = useWorkspaceInfo();
  const [components, loaded, error] = useComponents(namespace, application);
  const nudgeData: ComponentRelationValue[] = React.useMemo(() => {
    return loaded && !error
      ? components.reduce((acc, val: ComponentKind) => {
          if (val.spec?.[NudgeStats.NUDGES]) {
            const data: ComponentRelationValue = {
              source: val.metadata.name,
              nudgeType: ComponentRelationNudgeType.NUDGES,
              target: val.spec[NudgeStats.NUDGES],
            };
            return [...acc, data];
          }
          if (val.status?.[NudgeStats.NUDGED_BY]) {
            const data: ComponentRelationValue = {
              source: val.metadata.name,
              nudgeType: ComponentRelationNudgeType.NUDGED_BY,
              target: val.status?.[NudgeStats.NUDGED_BY],
            };
            return [...acc, data];
          }
          return acc;
        }, [])
      : [];
  }, [components, error, loaded]);

  return [nudgeData, loaded, error];
};
