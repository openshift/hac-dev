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
import { useApplications } from '../../hacbs/hooks/useApplications';
import ActionMenu from '../../shared/components/action-menu/ActionMenu';
import { EnvironmentKind } from '../../types';
import { getEnvironmentDeploymentStrategyLabel } from '../../utils/environment-utils';
import { useNamespace } from '../../utils/namespace-context-utils';
import { useEnvironmentActions } from './environment-actions';

type EnvironmentCardProps = {
  environment: EnvironmentKind;
};
const EnvironmentCard: React.FC<EnvironmentCardProps> = ({ environment }) => {
  const actions = useEnvironmentActions(environment);
  const namespace = useNamespace();
  const [applications, applicationsLoaded] = useApplications(namespace);

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
            <b>Applications: {applicationsLoaded ? applications.length : '-'}</b>
          </Text>
        </TextContent>
      </CardBody>
    </Card>
  );
};

export default EnvironmentCard;
