import * as React from 'react';
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
} from '@patternfly/react-core';
import { useEnvironmentActions } from '../../components/Environment/environment-actions';
import { EnvironmentKindWithHealthStatus } from '../../hooks/useAllApplicationEnvironmentsWithHealthStatus';
import ActionMenu from '../../shared/components/action-menu/ActionMenu';
import { Timestamp } from '../../shared/components/timestamp/Timestamp';
import { EnvironmentKind } from '../../types';
import { getEnvironmentDeploymentStrategyLabel } from '../../utils/environment-utils';
import { getGitOpsDeploymentHealthStatusIcon } from '../../utils/gitops-utils';
import { EnvironmentType, getEnvironmentType, getEnvironmentTypeLabel } from './environment-utils';

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
};

const EnvironmentCard: React.FC<EnvironmentCardProps> = ({ environment, readOnly }) => {
  const actions = useEnvironmentActions(environment);
  const type = getEnvironmentType(environment);

  return (
    <Card isFlat>
      <CardHeader>
        <CardTitle>
          <TextContent>
            <Text component={TextVariants.h3}>
              {environment.spec?.displayName ?? environment.metadata.name}
            </Text>
          </TextContent>
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
            <DescriptionListTerm>Type</DescriptionListTerm>
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
              <Label>{getEnvironmentDeploymentStrategyLabel(environment)}</Label>
            </DescriptionListDescription>
          </DescriptionListGroup>
          <ApplicationEnvironmentStatus
            environment={environment as EnvironmentKindWithHealthStatus}
          />
        </DescriptionList>
      </CardBody>
    </Card>
  );
};

export default EnvironmentCard;
