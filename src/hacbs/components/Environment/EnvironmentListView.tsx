import * as React from 'react';
import { Title, EmptyStateBody, Text } from '@patternfly/react-core';
import EnvironmentListViewBase from '../../../components/Environment/EnvironmentListView';
import { useApplicationEnvironmentsWithHealthStatus } from '../../../hooks/useApplicationEnvironmentsWithHealthStatus';
import { useSearchParam } from '../../../hooks/useSearchParam';
import { EnvironmentKind } from '../../../types';
import { GitOpsDeploymentHealthStatus } from '../../../types/gitops-deployment';
import EnvironmentCard from './EnvironmentCard';
import EnvironmentToolbarGroups from './EnvironmentToolbarGroups';
import { EnvironmentType, getEnvironmentType } from './utils';

type HacbsEnvironmentListViewProps = {
  applicationName?: string;
  validTypes?: EnvironmentType[];
  description?: React.ReactNode;
  preFilter?: (environment: EnvironmentKind) => boolean;
  filter?: (environment: EnvironmentKind) => boolean;
  typesFilter: EnvironmentType[];
  setTypesFilter: (types: string[] | null) => void;
  unsetTypesFilter: () => void;
  CardComponent?: React.ComponentType<{ environment: EnvironmentKind }>;
  emptyStateContent?: React.ReactNode;
};

const DEFAULT_VALID_TYPES = Object.keys(EnvironmentType).map((t) => EnvironmentType[t]);

const HacbsApplicationEnvironmentListView: React.FC<HacbsEnvironmentListViewProps> = ({
  applicationName,
  description,
  emptyStateContent,
  preFilter,
  validTypes,
  typesFilter,
  setTypesFilter,
  unsetTypesFilter,
  CardComponent,
}) => {
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

  const [environmentsWithStatus, statusLoaded] =
    useApplicationEnvironmentsWithHealthStatus(applicationName);

  const envStatusCounts = React.useMemo(() => {
    const counts: { [key: string]: number } = {};
    if (applicationName && statusLoaded) {
      environmentsWithStatus?.forEach((env) => {
        if (!counts[env.healthStatus]) {
          counts[env.healthStatus] = 0;
        }
        counts[env.healthStatus] += 1;
      });
    }
    return counts;
  }, [applicationName, environmentsWithStatus, statusLoaded]);

  const filter = (env: EnvironmentKind) => {
    const type = getEnvironmentType(env);
    const envWithStatus = statusLoaded
      ? environmentsWithStatus.find((e) => e.metadata.name === env.metadata.name)
      : undefined;
    return (
      (typesFilter.length ? typesFilter.includes(type) : true) &&
      (!statusLoaded || !statusFilter.length || statusFilter.includes(envWithStatus.healthStatus))
    );
  };

  const renderToolbarGroups = React.useCallback(
    (environments) => (
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
    ),
    [
      envStatusCounts,
      setStatusFilter,
      setTypesFilter,
      statusFilter,
      typesFilter,
      unsetStatusFilter,
      unsetTypesFilter,
      validTypes,
    ],
  );

  return (
    <EnvironmentListViewBase
      description={description}
      preFilter={preFilter}
      renderToolbarGroups={renderToolbarGroups}
      filter={filter}
      CardComponent={CardComponent}
      onClearAllFilters={() => {
        setStatusFilter([]);
        setTypesFilter([]);
      }}
      emptyStateContent={emptyStateContent}
    />
  );
};

const HacbsEnvironmentListView: React.FC<HacbsEnvironmentListViewProps> = ({
  description,
  emptyStateContent,
  preFilter,
  validTypes,
  typesFilter,
  setTypesFilter,
  unsetTypesFilter,
  CardComponent,
}) => {
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
      description={description}
      emptyStateContent={emptyStateContent}
      preFilter={preFilter}
      renderToolbarGroups={renderToolbarGroups}
      filter={filter}
      CardComponent={CardComponent}
      onClearAllFilters={() => setTypesFilter([])}
    />
  );
};

type Props = {
  applicationName?: string;
  validTypes?: EnvironmentType[];
};

const EnvironmentListView: React.FC<Props> = ({
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
  const preFilter = (env: EnvironmentKind) => validTypes.includes(getEnvironmentType(env));

  const CardComponent: React.ComponentType<{ environment: EnvironmentKind }> = ({
    environment,
  }) => <EnvironmentCard environment={environment} applicationName={applicationName} />;

  const emptyStateContent = (
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
  );

  const description = (
    <>
      <Title size="lg" headingLevel="h3" className="pf-c-title pf-u-mt-lg pf-u-mb-sm">
        Environments
      </Title>
      <Text className="pf-u-mb-lg">
        Add static environments or link to external, managed environments as your release
        destination.
      </Text>
    </>
  );

  if (applicationName) {
    return (
      <HacbsApplicationEnvironmentListView
        applicationName={applicationName}
        description={description}
        preFilter={preFilter}
        validTypes={validTypes}
        typesFilter={typesFilter}
        setTypesFilter={setTypesFilter}
        unsetTypesFilter={unsetTypesFilter}
        CardComponent={CardComponent}
        emptyStateContent={emptyStateContent}
      />
    );
  }
  return (
    <HacbsEnvironmentListView
      description={description}
      preFilter={preFilter}
      validTypes={validTypes}
      typesFilter={typesFilter}
      setTypesFilter={setTypesFilter}
      unsetTypesFilter={unsetTypesFilter}
      CardComponent={CardComponent}
      emptyStateContent={emptyStateContent}
    />
  );
};

export default EnvironmentListView;
