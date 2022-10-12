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
  Spinner,
  Text,
  TextVariants,
} from '@patternfly/react-core';
import ArrowRightIcon from '@patternfly/react-icons/dist/js/icons/arrow-right-icon';
import CheckCircleIcon from '@patternfly/react-icons/dist/js/icons/check-circle-icon';
import { global_palette_green_400 as greenColor } from '@patternfly/react-tokens/dist/js/global_palette_green_400';
import { useSortedEnvironments } from '../../hooks/useEnvironments';
import { EnvironmentKind } from '../../types';
import {
  getEnvironmentDeploymentStrategyLabel,
  isPositionedEnvironment,
} from '../../utils/environment-utils';

import './ApplicationEnviromentCards.scss';

type ApplicationEnvironmentCardProps = {
  environment: EnvironmentKind;
  isExpanded: boolean;
  isSelected: boolean;
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
  isSelected,
  onSelect,
}) => {
  const strategy = getEnvironmentDeploymentStrategyLabel(environment);
  return (
    <Card
      className="application-environment-cards__card"
      data-test={`env-card-${environment.metadata.name}`}
      isSelectable
      isSelectableRaised
      isCompact
      isSelected={isSelected}
      isExpanded={isExpanded}
      onClick={onSelect}
    >
      <CardHeader className="pf-u-pt-sm">
        <Flex>
          <CardTitle>{environment.spec.displayName}</CardTitle>
          <FlexItem align={{ default: 'alignRight' }}>
            {!isExpanded ? (
              <span>
                {' '}
                <CheckCircleIcon color={greenColor.value} /> Healthy
              </span>
            ) : (
              <Label isCompact>{strategy}</Label>
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
  onSelect?: (environmentId: string) => void;
  selectedEnvironment?: string;
  cardsExpanded: boolean;
};

export const ApplicationEnvironmentCards: React.FC<ApplicationEnvironmentCardsProps> = ({
  selectedEnvironment,
  onSelect,
  cardsExpanded,
}) => {
  const [environments, loaded] = useSortedEnvironments();

  return (
    <Flex alignItems={{ default: 'alignItemsCenter' }} flexWrap={{ default: 'nowrap' }}>
      {loaded ? (
        environments?.length ? (
          environments.map((env, index) => (
            <React.Fragment key={env.metadata.uid}>
              {isPositionedEnvironment(env, environments.slice(0, index)) ? (
                <div className="application-environment-cards__env-arrow">
                  <ArrowRightIcon />
                </div>
              ) : null}
              <ApplicationEnvironmentCard
                environment={env}
                isExpanded={cardsExpanded}
                isSelected={env.metadata.name === selectedEnvironment}
                onSelect={() => onSelect && onSelect(env.metadata.name)}
              />
            </React.Fragment>
          ))
        ) : (
          <ApplicationEnvironmentCardsEmptyState />
        )
      ) : (
        <Spinner isSVG size="md" />
      )}
    </Flex>
  );
};
