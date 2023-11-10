import * as React from 'react';
import { useAllApplicationEnvironmentsWithHealthStatus } from '../../hooks/useAllApplicationEnvironmentsWithHealthStatus';
import { useAllEnvironments } from '../../hooks/useAllEnvironments';
import { useSearchParam } from '../../hooks/useSearchParam';
import { EnvironmentKind } from '../../types';
import { GitOpsDeploymentHealthStatus } from '../../types/gitops-deployment';
import { EnvironmentType, getEnvironmentType } from './environment-utils';
import EnvironmentList from './EnvironmentList';
import EnvironmentToolbarGroups from './EnvironmentToolbarGroups';

type EnvironmentListViewProps = {
  applicationName?: string;
  validTypes?: EnvironmentType[];
  preFilter?: (environment: EnvironmentKind) => boolean;
  filter?: (environment: EnvironmentKind) => boolean;
  typesFilter: EnvironmentType[];
  setTypesFilter: (types: string[] | null) => void;
  unsetTypesFilter: () => void;
};

const DEFAULT_VALID_TYPES = Object.keys(EnvironmentType).map((t) => EnvironmentType[t]);

const ApplicationEnvironmentListView: React.FC<
  React.PropsWithChildren<EnvironmentListViewProps>
> = ({ applicationName, preFilter, validTypes, typesFilter, setTypesFilter, unsetTypesFilter }) => {
  const [allEnvironments, environmentsLoaded] =
    useAllApplicationEnvironmentsWithHealthStatus(applicationName);
  const environments = React.useMemo(
    () => (preFilter ? allEnvironments.filter(preFilter) : allEnvironments),
    [preFilter, allEnvironments],
  );
  const [statusFilterParam, setStatusFilterParam, unsetStatusFilter] = useSearchParam(
    'envStatus',
    '',
  );
  const statusFilter = React.useMemo(
    () =>
      statusFilterParam.length
        ? statusFilterParam.split(',').map((s) => GitOpsDeploymentHealthStatus[s])
        : [],
    [statusFilterParam],
  );

  const setStatusFilter = React.useCallback(
    (value: string[]) => setStatusFilterParam(value.join(',')),
    [setStatusFilterParam],
  );

  const envStatusCounts = React.useMemo(() => {
    const counts: { [key: string]: number } = {};
    if (applicationName && environmentsLoaded) {
      allEnvironments?.forEach((env) => {
        if (!counts[env.healthStatus]) {
          counts[env.healthStatus] = 0;
        }
        counts[env.healthStatus] += 1;
      });
    }
    return counts;
  }, [applicationName, allEnvironments, environmentsLoaded]);

  const filter = (env: EnvironmentKind) => {
    const type = getEnvironmentType(env);
    const envWithStatus = allEnvironments
      ? allEnvironments.find((e) => e.metadata.name === env.metadata.name)
      : undefined;
    return (
      (typesFilter.length ? typesFilter.includes(type) : true) &&
      (!environmentsLoaded ||
        !statusFilter.length ||
        statusFilter.includes(envWithStatus.healthStatus))
    );
  };

  return (
    <EnvironmentList
      environments={environments}
      environmentsLoaded={environmentsLoaded}
      ToolbarGroups={
        <EnvironmentToolbarGroups
          environments={environments}
          showStatusFilter
          envStatusCounts={envStatusCounts}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          unsetStatusFilter={unsetStatusFilter}
          validTypes={validTypes}
          typesFilter={typesFilter}
          setTypesFilter={setTypesFilter}
          unsetTypesFilter={unsetTypesFilter}
        />
      }
      filter={filter}
      onClearAllFilters={() => {
        setStatusFilter([]);
        setTypesFilter([]);
      }}
      readOnly={true}
      applicationName={applicationName}
    />
  );
};

const AllEnvironmentsListView: React.FC<React.PropsWithChildren<EnvironmentListViewProps>> = ({
  validTypes,
  preFilter,
  typesFilter,
  setTypesFilter,
  unsetTypesFilter,
}) => {
  const [allEnvironments, environmentsLoaded] = useAllEnvironments();
  const filter = (env: EnvironmentKind) => {
    const type = getEnvironmentType(env);
    return typesFilter.length ? typesFilter.includes(type) : true;
  };

  const environments = React.useMemo(
    () => (preFilter ? allEnvironments.filter(preFilter) : allEnvironments),
    [preFilter, allEnvironments],
  );

  const ToolbarGroups = React.useMemo(
    () => (
      <EnvironmentToolbarGroups
        environments={environments}
        validTypes={validTypes}
        typesFilter={typesFilter}
        setTypesFilter={setTypesFilter}
        unsetTypesFilter={unsetTypesFilter}
      />
    ),
    [environments, setTypesFilter, typesFilter, unsetTypesFilter, validTypes],
  );

  return (
    <EnvironmentList
      environments={environments}
      environmentsLoaded={environmentsLoaded}
      ToolbarGroups={ToolbarGroups}
      filter={filter}
      onClearAllFilters={() => setTypesFilter([])}
    />
  );
};

type Props = {
  applicationName?: string;
  validTypes?: EnvironmentType[];
};

const EnvironmentListView: React.FC<React.PropsWithChildren<Props>> = ({
  applicationName,
  validTypes = DEFAULT_VALID_TYPES,
}) => {
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

  const preFilter = React.useCallback(
    (env: EnvironmentKind) => validTypes.includes(getEnvironmentType(env)),
    [validTypes],
  );

  if (applicationName) {
    return (
      <ApplicationEnvironmentListView
        applicationName={applicationName}
        preFilter={preFilter}
        validTypes={validTypes}
        typesFilter={typesFilter}
        setTypesFilter={setTypesFilter}
        unsetTypesFilter={unsetTypesFilter}
      />
    );
  }
  return (
    <AllEnvironmentsListView
      preFilter={preFilter}
      validTypes={validTypes}
      typesFilter={typesFilter}
      setTypesFilter={setTypesFilter}
      unsetTypesFilter={unsetTypesFilter}
    />
  );
};

export default EnvironmentListView;
