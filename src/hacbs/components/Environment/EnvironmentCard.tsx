import * as React from 'react';
import {
  CardHeader,
  Card,
  CardTitle,
  CardActions,
  CardBody,
  Flex,
  FlexItem,
  Text,
  TextContent,
  TextVariants,
  Label,
} from '@patternfly/react-core';
import { useEnvironmentActions } from '../../../components/Environment/environment-actions';
import { EnvironmentKindWithHealthStatus } from '../../../hooks/useAllApplicationEnvironmentsWithHealthStatus';
import ActionMenu from '../../../shared/components/action-menu/ActionMenu';
import { Timestamp } from '../../../shared/components/timestamp/Timestamp';
import { EnvironmentKind } from '../../../types';
import { getEnvironmentDeploymentStrategyLabel } from '../../../utils/environment-utils';
import { getGitOpsDeploymentHealthStatusIcon } from '../../../utils/gitops-utils';
import { EnvironmentType, getEnvironmentType, getEnvironmentTypeLabel } from './utils';

const ApplicationEnvironmentStatus: React.FC<{
  environment: EnvironmentKindWithHealthStatus;
}> = ({ environment }) => {
  return (
    <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsMd' }}>
      <FlexItem>
        <Text component={TextVariants.small} style={{ color: 'var(--pf-global--Color--200)' }}>
          {getGitOpsDeploymentHealthStatusIcon(environment.healthStatus)} Application{' '}
          {environment.healthStatus}
        </Text>
      </FlexItem>
      <FlexItem>
        <Flex spaceItems={{ default: 'spaceItemsSm' }}>
          <Text component={TextVariants.small}>
            <b>Last Deploy:</b>
          </Text>
          <Text component={TextVariants.small} style={{ color: 'var(--pf-global--Color--200)' }}>
            <Timestamp timestamp={environment.lastDeploy} simple />
          </Text>
        </Flex>
      </FlexItem>
    </Flex>
  );
};

type EnvironmentCardProps = {
  environment: EnvironmentKind;
  applicationName?: string;
};

const EnvironmentCard: React.FC<EnvironmentCardProps> = ({ environment, applicationName }) => {
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
            <Label
              color={
                type === EnvironmentType.managed
                  ? 'green'
                  : type === EnvironmentType.ephemeral
                  ? 'gold'
                  : 'cyan'
              }
            >
              {getEnvironmentTypeLabel(type)}
            </Label>
          </TextContent>
        </CardTitle>
        {type === EnvironmentType.static ? (
          <CardActions>
            <ActionMenu actions={actions} />
          </CardActions>
        ) : null}
      </CardHeader>
      <CardBody>
        <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsMd' }}>
          <FlexItem>
            <TextContent>
              <Text className="pf-u-mb-sm">
                <b>Deployment strategy:</b>
              </Text>
            </TextContent>
            <Label>{getEnvironmentDeploymentStrategyLabel(environment)}</Label>
          </FlexItem>
          {applicationName ? (
            <FlexItem>
              <ApplicationEnvironmentStatus
                environment={environment as EnvironmentKindWithHealthStatus}
              />
            </FlexItem>
          ) : null}
        </Flex>
      </CardBody>
    </Card>
  );
};

export default EnvironmentCard;
