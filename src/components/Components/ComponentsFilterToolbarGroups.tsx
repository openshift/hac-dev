import * as React from 'react';
import { PipelineRunLabel } from '../../consts/pipelinerun';
import {
  default as BaseComponentsFilterToolbarGroups,
  ComponentsFilterToolbarProps,
  getStatusFilterIdForComponent,
  RunStatusFilters as BaseRunStatusFilters,
  BUILDING_STATUS_FILTER_ID,
  FAILED_STATUS_FILTER_ID,
  SUCCESS_STATUS_FILTER_ID,
} from '../ComponentsListView/ComponentsFilterToolbarGroups';

export const NEEDS_MERGE_FILTER_ID = 'needs-merge';

export const RunStatusFilters = [
  {
    id: NEEDS_MERGE_FILTER_ID,
    label: 'Merge build PR',
  },
  ...BaseRunStatusFilters,
];

const ComponentsFilterToolbarGroups: React.FC<ComponentsFilterToolbarProps> = ({
  components,
  pipelineRuns,
  ...rest
}) => {
  const getMergedStatusFilterIdForComponent = React.useCallback(
    (component) => {
      const unMerged = !pipelineRuns?.find(
        ({ metadata: { labels } }) =>
          labels?.[PipelineRunLabel.COMPONENT] === component.metadata.name,
      );
      if (unMerged) {
        return NEEDS_MERGE_FILTER_ID;
      }
      return getStatusFilterIdForComponent(component, pipelineRuns);
    },
    [pipelineRuns],
  );

  const filterCounts = React.useMemo(() => {
    const counts = {
      [NEEDS_MERGE_FILTER_ID]: 0,
      [FAILED_STATUS_FILTER_ID]: 0,
      [SUCCESS_STATUS_FILTER_ID]: 0,
      [BUILDING_STATUS_FILTER_ID]: 0,
    };
    components.forEach((component) => {
      const statusId = getMergedStatusFilterIdForComponent(component);
      if (statusId) {
        counts[statusId]++;
      }
    });
    return counts;
  }, [components, getMergedStatusFilterIdForComponent]);

  return (
    <BaseComponentsFilterToolbarGroups
      {...rest}
      components={components}
      pipelineRuns={pipelineRuns}
      runStatusOptions={RunStatusFilters}
      customFilterCounts={filterCounts}
    />
  );
};

export default ComponentsFilterToolbarGroups;
