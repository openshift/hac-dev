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
} from '@patternfly/react-core';
import ActionMenu from '../../shared/components/action-menu/ActionMenu';
import { EnvironmentKind } from '../../types';
import { getEnvironmentDeploymentStrategyLabel } from '../../utils/environment-utils';
import { useEnvironmentActions } from './environment-actions';

type EnvironmentCardProps = {
  environment: EnvironmentKind;
};
const EnvironmentCard: React.FC<EnvironmentCardProps> = ({ environment }) => {
  const actions = useEnvironmentActions(environment);

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
        <CardActions>
          <ActionMenu actions={actions} />
        </CardActions>
      </CardHeader>
      <CardBody>
        <TextContent>
          <Text>
            <b>Deployment strategy:</b>
          </Text>
        </TextContent>
        <Label>{getEnvironmentDeploymentStrategyLabel(environment)}</Label>
      </CardBody>
      <CardBody>
        <TextContent>
          <Text>
            <b>Applications: 4</b>
          </Text>
        </TextContent>
      </CardBody>
    </Card>
  );
};

export default EnvironmentCard;
