import * as React from 'react';
import { Title, EmptyStateBody } from '@patternfly/react-core';
import EnvironmentListViewBase from '../../../components/Environment/EnvironmentListView';
import { useSearchParam } from '../../../hooks/useSearchParam';
import { EnvironmentKind } from '../../../types';
import EnvironmentCard from './EnvironmentCard';
import EnvironmentToolbarGroups from './EnvironmentToolbarGroups';
import { EnvironmentType, getEnvironmentType } from './utils';

type Props = {
  validTypes?: EnvironmentType[];
};

const DEFAULT_VALID_TYPES = Object.keys(EnvironmentType).map((t) => EnvironmentType[t]);

const EnvironmentListView: React.FC<Props> = ({ validTypes = DEFAULT_VALID_TYPES }) => {
  const [typesFilterParam, setTypesFilterParam, unsetTypesFilter] = useSearchParam('envType', '');
  const typesFilter = React.useMemo(
    () =>
      typesFilterParam.length
        ? typesFilterParam
            .split(',')
            .filter((v) => !validTypes.includes[v])
            .map((t) => EnvironmentType[t])
        : [],
    [typesFilterParam, validTypes],
  );

  const setTypesFilter = React.useCallback(
    (value: string[]) => setTypesFilterParam(value.join(',')),
    [setTypesFilterParam],
  );
  const preFilter = (env: EnvironmentKind) => validTypes.includes(getEnvironmentType(env));

  const filter = (env: EnvironmentKind) => {
    const type = getEnvironmentType(env);
    return typesFilter.length ? typesFilter.includes(type) : true;
  };

  const renderToolbarGroups = React.useCallback(
    (environments) => (
      <EnvironmentToolbarGroups
        environments={environments}
        validTypes={validTypes}
        typesFilter={typesFilter}
        setTypesFilter={setTypesFilter}
        unsetTypesFilter={unsetTypesFilter}
      />
    ),
    [setTypesFilter, typesFilter, unsetTypesFilter, validTypes],
  );

  return (
    <EnvironmentListViewBase
      preFilter={preFilter}
      renderToolbarGroups={renderToolbarGroups}
      filter={filter}
      CardComponent={EnvironmentCard}
      onClearAllFilters={() => setTypesFilter([])}
      emptyStateContent={
        <>
          <Title headingLevel="h4" size="lg">
            Add static environments or link to external, managed environments as your release
            destination
          </Title>
          <EmptyStateBody>
            No environments found yet.
            <br />
            To get started, create an environment or connect to a release environment.
          </EmptyStateBody>
        </>
      }
    />
  );
};

export default EnvironmentListView;
