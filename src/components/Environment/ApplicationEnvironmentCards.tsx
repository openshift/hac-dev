import * as React from 'react';
import {
  Button,
  Card,
  CardBody,
  CardExpandableContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Flex,
  FlexItem,
  Label,
  Spinner,
  Text,
  TextVariants,
} from '@patternfly/react-core';
import CheckCircleIcon from '@patternfly/react-icons/dist/js/icons/check-circle-icon';
import { global_palette_green_400 as greenColor } from '@patternfly/react-tokens/dist/js/global_palette_green_400';
import { useEnvironments } from '../../hooks/useEnvironments';
import { EnvironmentKind } from '../../types';
import { getEnvironmentDeploymentStrategyLabel } from '../../utils/environment-utils';
import { OutlinedHelpPopperIcon } from '../OutlinedHelpTooltipIcon';

type ApplicationEnvironmentCardProps = {
  environment: EnvironmentKind;
  isExpanded: boolean;
  onSelect?: () => void;
};

const ApplicationEnvironmentCardsEmptyState: React.FC = () => (
  <Card isCompact isExpanded={false}>
    <CardHeader>
      <CardTitle>No environments available</CardTitle>
    </CardHeader>
  </Card>
);

const ApplicationEnvironmentCard: React.FC<ApplicationEnvironmentCardProps> = ({
  environment,
  isExpanded,
  onSelect,
}) => {
  const strategy = getEnvironmentDeploymentStrategyLabel(environment);
  return (
    <Card isCompact isExpanded={isExpanded} isSelectable={!!onSelect} onClick={onSelect}>
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
        <CardBody>
          <CheckCircleIcon color={greenColor.value} /> Healthy
        </CardBody>
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
  onSelect?: (selectedId: string) => void;
};

export const ApplicationEnvironmentCards: React.FC<ApplicationEnvironmentCardsProps> = ({
  onSelect,
}) => {
  const [cardsExpanded, setCardExpanded] = React.useState<boolean>(true);
  const [environments, loaded] = useEnvironments();

  return (
    <Flex direction={{ default: 'column' }} grow={{ default: 'grow' }}>
      <Flex>
        <FlexItem>
          <b>Environments:</b>
          {'  '}
          <OutlinedHelpPopperIcon
            heading="Application environments"
            content="View components and their settings as deployed to environments. Component updates can be promoted between environments. Additional environments can be added via the workspace."
          />
        </FlexItem>
        {loaded && environments.length ? (
          <FlexItem align={{ default: 'alignRight' }}>
            <Button
              onClick={() => setCardExpanded((e) => !e)}
              variant="link"
              isInline
              style={{ textDecoration: 'none' }}
            >
              {cardsExpanded ? 'Collapse' : 'Expand'}
            </Button>
          </FlexItem>
        ) : null}
      </Flex>
      <Flex alignItems={{ default: 'alignItemsCenter' }}>
        {loaded ? (
          environments?.length ? (
            environments.map((env) => (
              <FlexItem key={env.metadata.uid}>
                <ApplicationEnvironmentCard
                  environment={env}
                  isExpanded={cardsExpanded}
                  onSelect={() => onSelect && onSelect(env.metadata.name)}
                />
              </FlexItem>
            ))
          ) : (
            <ApplicationEnvironmentCardsEmptyState />
          )
        ) : (
          <Spinner isSVG size="md" />
        )}
      </Flex>
    </Flex>
  );
};
