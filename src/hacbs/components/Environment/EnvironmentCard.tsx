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
import {
  EnvironmentType,
  getEnvironmentType,
  getEnvironmentTypeLabel,
} from '../../../components/Environment/environment-utils';
import { EnvironmentKindWithHealthStatus } from '../../../hooks/useAllApplicationEnvironmentsWithHealthStatus';
import ActionMenu from '../../../shared/components/action-menu/ActionMenu';
import { EnvironmentKind } from '../../../types';
import {
  ApplicationEnvironmentStatus,
  getEnvironmentDeploymentStrategyLabel,
} from '../../../utils/environment-utils';

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
        {actions?.length ? (
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
