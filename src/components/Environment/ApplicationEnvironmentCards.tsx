import * as React from 'react';
import {
  Card,
  CardBody,
  CardExpandableContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Flex,
  FlexItem,
  Label,
  Text,
  TextVariants,
} from '@patternfly/react-core';
import CheckCircleIcon from '@patternfly/react-icons/dist/js/icons/check-circle-icon';
import { global_palette_green_400 as greenColor } from '@patternfly/react-tokens/dist/js/global_palette_green_400';
import { useEnvironments } from '../../hooks/useEnvironments';
import { getEnvironmentDeploymentStrategyLabel } from '../../utils/environment-utils';

type ApplicationEnvironmentCardProps = {
  environment: any;
  isExpanded: boolean;
};

const ApplicationEnvironmentCard: React.FC<ApplicationEnvironmentCardProps> = ({
  environment,
  isExpanded,
}) => {
  const strategy = getEnvironmentDeploymentStrategyLabel(environment);
  return (
    <Card isCompact isExpanded={isExpanded}>
      <CardHeader>
        <Flex>
          <CardTitle>{environment.spec.displayName}</CardTitle>
          <FlexItem align={{ default: 'alignRight' }}>
            {!isExpanded ? (
              <span>
                {' '}
                <CheckCircleIcon color={greenColor.value} /> Healthy
              </span>
            ) : (
              <Label>{strategy}</Label>
            )}
          </FlexItem>
        </Flex>
      </CardHeader>
      <CardExpandableContent>
        <CardBody>Environment Status</CardBody>
        <CardFooter>
          <small>Last Deployment:</small> {'  '}
          <Text component={TextVariants.small} style={{ color: 'var(--pf-global--Color--200)' }}>
            Nov 11, 2021 11:47 AM
          </Text>
        </CardFooter>
      </CardExpandableContent>
    </Card>
  );
};

type ApplicationEnvironmentCardsProps = {
  isExpanded: boolean;
};

export const ApplicationEnvironmentCards: React.FC<ApplicationEnvironmentCardsProps> = ({
  isExpanded,
}) => {
  const [environments, loaded] = useEnvironments();
  return (
    <>
      {loaded && environments?.length > 0
        ? environments.slice(0, 2).map((env) => (
            <FlexItem key={env.metadata.uid}>
              <ApplicationEnvironmentCard environment={env} isExpanded={isExpanded} />
            </FlexItem>
          ))
        : null}
    </>
  );
};
