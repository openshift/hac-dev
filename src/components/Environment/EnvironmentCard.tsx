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
  Badge,
} from '@patternfly/react-core';
import ActionMenu from '../../shared/components/action-menu/ActionMenu';
import ExternalLink from '../../shared/components/links/ExternalLink';
import { EnvironmentKind } from '../../types';
import { useEnvironmentActions } from './environment-actions';

type EnvironmentCardProps = {
  environment: EnvironmentKind;
};
const EnvironmentCard: React.FC<EnvironmentCardProps> = ({ environment }) => {
  const actions = useEnvironmentActions(environment);
  const dummyLink = 'www.example.com/cluster-link';
  const apiServerURL = environment.spec?.clusterCredentials?.apiServerURL;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <TextContent>
            <Text component={TextVariants.h4}>
              {environment.spec?.displayName ?? environment.metadata.name}
            </Text>
          </TextContent>
        </CardTitle>
        <CardActions>
          <ActionMenu actions={actions} />
        </CardActions>
      </CardHeader>
      {(apiServerURL || dummyLink) && (
        <CardBody>
          <TextContent>
            <Text component={TextVariants.h6}>Environment Link:</Text>
          </TextContent>
          <ExternalLink
            href={environment.spec?.clusterCredentials?.apiServerURL || dummyLink}
            text={environment.spec?.clusterCredentials?.apiServerURL || dummyLink}
          />
        </CardBody>
      )}
      <CardBody>
        <TextContent>
          <Text component={TextVariants.h6}>Deployment Strategy:</Text>
        </TextContent>
        <Badge isRead>{environment.spec.deploymentStrategy}</Badge>
      </CardBody>
    </Card>
  );
};

export default EnvironmentCard;
