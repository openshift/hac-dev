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
  Skeleton,
} from '@patternfly/react-core';
import { useEnvironmentActions } from '../../../components/Environment/environment-actions';
import { useApplicationHealthStatus } from '../../../hooks/useApplicationHealthStatus';
import { useLastApplicationDeployTime } from '../../../hooks/useLastApplicationDeployTime';
import ActionMenu from '../../../shared/components/action-menu/ActionMenu';
import { Timestamp } from '../../../shared/components/timestamp/Timestamp';
import { EnvironmentKind } from '../../../types';
import { getEnvironmentDeploymentStrategyLabel } from '../../../utils/environment-utils';
import { useNamespace } from '../../../utils/namespace-context-utils';
import { EnvironmentType, getEnvironmentType, getEnvironmentTypeLabel } from './utils';

const ApplicationStatus: React.FC<{
  environment: EnvironmentKind;
  applicationName: string;
}> = ({ applicationName }) => {
  const namespace = useNamespace();
  const [healthStatus, healthStatusIcon, healthStatusLoaded] = useApplicationHealthStatus(
    namespace,
    applicationName,
  );
  const [lastDeployTime, deployTimeLoaded] = useLastApplicationDeployTime(
    namespace,
    applicationName,
  );

  return (
    <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsMd' }}>
      <FlexItem>
        <Text component={TextVariants.small} style={{ color: 'var(--pf-global--Color--200)' }}>
          {healthStatusLoaded ? (
            <>
              {healthStatusIcon} Application {healthStatus}
            </>
          ) : (
            <Skeleton width="50%" screenreaderText="Loading application health" />
          )}
        </Text>
      </FlexItem>
      <FlexItem>
        <Flex spaceItems={{ default: 'spaceItemsSm' }}>
          <Text component={TextVariants.small}>
            <b>Last Deploy:</b>
          </Text>
          <Text component={TextVariants.small} style={{ color: 'var(--pf-global--Color--200)' }}>
            {deployTimeLoaded ? (
              <Timestamp timestamp={lastDeployTime} simple />
            ) : (
              <Skeleton width="50%" screenreaderText="Loading last deploy time" />
            )}
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
              <ApplicationStatus environment={environment} applicationName={applicationName} />
            </FlexItem>
          ) : null}
        </Flex>
      </CardBody>
    </Card>
  );
};

export default EnvironmentCard;
