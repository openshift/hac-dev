import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  CardHeader,
  Card,
  CardTitle,
  CardActions,
  CardBody,
  Text,
  TextContent,
  TextVariants,
  Label,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  pluralize,
  CardFooter,
} from '@patternfly/react-core';
import { useEnvironmentActions } from '../../components/Environment/environment-actions';
import { useLatestApplicationRouteURL } from '../../hooks';
import { EnvironmentKindWithHealthStatus } from '../../hooks/useAllApplicationEnvironmentsWithHealthStatus';
import { useApplications } from '../../hooks/useApplications';
import ActionMenu from '../../shared/components/action-menu/ActionMenu';
import ExternalLink from '../../shared/components/links/ExternalLink';
import { Timestamp } from '../../shared/components/timestamp/Timestamp';
import { EnvironmentKind } from '../../types';
import { getEnvironmentDeploymentStrategyLabel } from '../../utils/environment-utils';
import { getGitOpsDeploymentHealthStatusIcon } from '../../utils/gitops-utils';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';
import { EnvConnectionStatus } from './EnvConnectionStatus';
import {
  ClusterType,
  EnvironmentType,
  getEnvironmentType,
  getEnvironmentTypeLabel,
} from './environment-utils';

const ApplicationEnvironmentStatus: React.FC<{
  environment: EnvironmentKindWithHealthStatus;
}> = ({ environment }) => {
  if (!environment.healthStatus) return null;

  return (
    <>
      <DescriptionListGroup>
        <DescriptionListTerm>Application status</DescriptionListTerm>
        <DescriptionListDescription>
          <Text component={TextVariants.small} style={{ color: 'var(--pf-global--Color--200)' }}>
            {getGitOpsDeploymentHealthStatusIcon(environment.healthStatus)}{' '}
            {environment.healthStatus}
          </Text>
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Last deploy</DescriptionListTerm>
        <DescriptionListDescription>
          <Text component={TextVariants.small} style={{ color: 'var(--pf-global--Color--200)' }}>
            <Timestamp timestamp={environment.lastDeploy} simple />
          </Text>
        </DescriptionListDescription>
      </DescriptionListGroup>
    </>
  );
};

type EnvironmentCardProps = {
  environment: EnvironmentKind;
  readOnly?: boolean;
  applicationName?: string;
};

const EnvironmentCard: React.FC<EnvironmentCardProps> = ({
  environment,
  readOnly,
  applicationName,
}) => {
  const actions = useEnvironmentActions(environment);
  const type = getEnvironmentType(environment);
  const { namespace, workspace } = useWorkspaceInfo();
  const [applications, appsLoaded] = useApplications(namespace);
  const applicationRoute = useLatestApplicationRouteURL(applicationName);

  return (
    <Card isFlat>
      <CardHeader>
        <CardTitle>
          <TextContent>
            <Text component={TextVariants.h3}>
              {environment.spec?.displayName ?? environment.metadata.name}
            </Text>
          </TextContent>
          <EnvConnectionStatus environment={environment} />
        </CardTitle>
        {!readOnly && actions?.length ? (
          <CardActions>
            <ActionMenu actions={actions} />
          </CardActions>
        ) : null}
      </CardHeader>

      <CardBody>
        <DescriptionList>
          <DescriptionListGroup>
            <DescriptionListTerm className="pf-u-default-color-300">Type</DescriptionListTerm>
            <DescriptionListDescription>
              <Label
                color={
                  type === EnvironmentType.managed
                    ? 'green'
                    : type === EnvironmentType.static
                    ? 'gold'
                    : 'cyan'
                }
              >
                {getEnvironmentTypeLabel(type)}
              </Label>
            </DescriptionListDescription>
          </DescriptionListGroup>

          <DescriptionListGroup>
            <DescriptionListTerm>Deployment strategy</DescriptionListTerm>
            <DescriptionListDescription>
              {getEnvironmentDeploymentStrategyLabel(environment)}
            </DescriptionListDescription>
          </DescriptionListGroup>

          <DescriptionListGroup>
            <DescriptionListTerm>Cluster type</DescriptionListTerm>
            <DescriptionListDescription>
              {environment.spec.unstableConfigurationFields?.clusterType || ClusterType.openshift}
            </DescriptionListDescription>
          </DescriptionListGroup>

          <ApplicationEnvironmentStatus
            environment={environment as EnvironmentKindWithHealthStatus}
          />

          {!applicationName && appsLoaded && applications?.length > 0 && (
            <DescriptionListGroup>
              <DescriptionListTerm>Applications deployed</DescriptionListTerm>
              <DescriptionListDescription>
                <Link to={`/application-pipeline/workspaces/${workspace}/applications`}>
                  {pluralize(applications.length, 'application')}
                </Link>
              </DescriptionListDescription>
            </DescriptionListGroup>
          )}
        </DescriptionList>
      </CardBody>

      {applicationName && applicationRoute && (
        <CardFooter>
          <DescriptionList columnModifier={{ default: '2Col' }}>
            <DescriptionListGroup>
              <DescriptionListDescription>
                <ExternalLink href={applicationRoute}>View URL</ExternalLink>
              </DescriptionListDescription>
            </DescriptionListGroup>
          </DescriptionList>
        </CardFooter>
      )}
    </Card>
  );
};

export default EnvironmentCard;
