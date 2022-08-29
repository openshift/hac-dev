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
import { useEnvironmentActions } from '../../../components/Environment/environment-actions';
import ActionMenu from '../../../shared/components/action-menu/ActionMenu';
import { EnvironmentKind } from '../../../types';
import { getEnvironmentDeploymentStrategyLabel } from '../../../utils/environment-utils';
import { EnvironmentType, getEnvironmentType, getEnvironmentTypeLabel } from './utils';

type EnvironmentCardProps = {
  environment: EnvironmentKind;
};

const EnvironmentCard: React.FC<EnvironmentCardProps> = ({ environment }) => {
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
                  ? 'orange' // TODO 'gold' is not a valid color in the current PF version?
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
        <TextContent>
          <Text>
            <b>Deployment strategy:</b>
          </Text>
        </TextContent>
        <Label>{getEnvironmentDeploymentStrategyLabel(environment)}</Label>
      </CardBody>
    </Card>
  );
};

export default EnvironmentCard;
