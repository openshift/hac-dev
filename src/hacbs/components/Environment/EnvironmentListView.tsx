import * as React from 'react';
import { Link } from 'react-router-dom';
import { useFeatureFlag } from '@openshift/dynamic-plugin-sdk';
import { Button, EmptyStateBody, Flex, Text, Title, Tooltip } from '@patternfly/react-core';
import AppEmptyState from '../../../components/EmptyState/AppEmptyState';
import {
  EnvironmentType,
  getEnvironmentType,
} from '../../../components/Environment/environment-utils';
import EnvironmentListViewBase from '../../../components/Environment/EnvironmentListView';
import { useAllApplicationEnvironmentsWithHealthStatus } from '../../../hooks/useAllApplicationEnvironmentsWithHealthStatus';
import { useAllEnvironments } from '../../../hooks/useAllEnvironments';
import { useSearchParam } from '../../../hooks/useSearchParam';
import emptyStateImgUrl from '../../../imgs/Environment.svg';
import { EnvironmentKind } from '../../../types';
import { GitOpsDeploymentHealthStatus } from '../../../types/gitops-deployment';
import { MVP_FLAG } from '../../../utils/flag-utils';
import { useWorkspaceInfo } from '../../../utils/workspace-context-utils';
import EnvironmentCard from './EnvironmentCard';
import EnvironmentToolbarGroups from './EnvironmentToolbarGroups';

type EnvironmentListViewProps = {
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

const ApplicationEnvironmentListView: React.FC<EnvironmentListViewProps> = ({
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
    <EnvironmentListViewBase
      environments={environments}
      environmentsLoaded={environmentsLoaded}
      description={description}
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
      CardComponent={CardComponent}
      onClearAllFilters={() => {
        setStatusFilter([]);
        setTypesFilter([]);
      }}
      emptyStateContent={emptyStateContent}
    />
  );
};

const AllEnvironmentsListView: React.FC<EnvironmentListViewProps> = ({
  description,
  emptyStateContent,
  validTypes,
  preFilter,
  typesFilter,
  setTypesFilter,
  unsetTypesFilter,
  CardComponent,
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
    <EnvironmentListViewBase
      environments={environments}
      environmentsLoaded={environmentsLoaded}
      description={description}
      emptyStateContent={emptyStateContent}
      ToolbarGroups={ToolbarGroups}
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
  const [mvpFeature] = useFeatureFlag(MVP_FLAG);
  const { workspace } = useWorkspaceInfo();
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

  const CardComponent: React.ComponentType<{ environment: EnvironmentKind }> = ({
    environment,
  }) => <EnvironmentCard environment={environment} applicationName={applicationName} />;

  const EnvironmentSubtext =
    'An environment is a set of compute resources that you can use to develop, test, and stage your applications. You can share static environments across all applications in the workspace.';

  const createEnvironmentButton = React.useMemo(() => {
    const envButton = (
      <Button
        variant="secondary"
        isDisabled={mvpFeature}
        component={(props) => (
          <Link
            {...props}
            to={`/stonesoup/workspaces/${workspace}/workspace-settings/environment/create`}
          />
        )}
      >
        Create environment
      </Button>
    );
    if (mvpFeature) {
      return (
        <Flex justifyContent={{ default: 'justifyContentCenter' }} data-test="disabled-create-env">
          <Tooltip content="In a future release, you'll be able to add more environments and configure version promotion.">
            <div>{envButton}</div>
          </Tooltip>
        </Flex>
      );
    }
    return envButton;
  }, [mvpFeature, workspace]);

  const emptyState = (
    <AppEmptyState emptyStateImg={emptyStateImgUrl} title="Manage your deployments">
      <EmptyStateBody>
        An environment is a set of compute resources that you can use to develop, test, and stage
        your applications.
        <br />
        To get started, create an environment.
      </EmptyStateBody>
      <div className="pf-u-mt-xl">{createEnvironmentButton}</div>
    </AppEmptyState>
  );

  const description = (
    <>
      <Title size="lg" headingLevel="h3" className="pf-c-title pf-u-mt-lg pf-u-mb-sm">
        Environments
      </Title>
      <Text className="pf-u-mb-lg">{EnvironmentSubtext}</Text>
    </>
  );

  if (applicationName) {
    return (
      <ApplicationEnvironmentListView
        applicationName={applicationName}
        description={description}
        preFilter={preFilter}
        validTypes={validTypes}
        typesFilter={typesFilter}
        setTypesFilter={setTypesFilter}
        unsetTypesFilter={unsetTypesFilter}
        CardComponent={CardComponent}
        emptyStateContent={emptyState}
      />
    );
  }
  return (
    <AllEnvironmentsListView
      description={description}
      preFilter={preFilter}
      validTypes={validTypes}
      typesFilter={typesFilter}
      setTypesFilter={setTypesFilter}
      unsetTypesFilter={unsetTypesFilter}
      CardComponent={CardComponent}
      emptyStateContent={emptyState}
    />
  );
};

export default EnvironmentListView;
