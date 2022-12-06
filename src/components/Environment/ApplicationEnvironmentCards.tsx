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
  Skeleton,
  Spinner,
  Text,
  TextVariants,
} from '@patternfly/react-core';
import ArrowRightIcon from '@patternfly/react-icons/dist/js/icons/arrow-right-icon';
import { useSortedEnvironments } from '../../hooks/useEnvironments';
import { Timestamp } from '../../shared/components/timestamp/Timestamp';
import { useApplicationEnvironmentStatus } from '../../shared/hooks/useApplicationEnvironmentStatus';
import { EnvironmentKind } from '../../types';
import {
  getEnvironmentDeploymentStrategyLabel,
  isPositionedEnvironment,
} from '../../utils/environment-utils';

import './ApplicationEnviromentCards.scss';

type ApplicationEnvironmentCardProps = {
  environment: EnvironmentKind;
  applicationName: string;
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
  applicationName,
  isExpanded,
  isSelected,
  onSelect,
}) => {
  const strategy = getEnvironmentDeploymentStrategyLabel(environment);
  const [healthStatus, healthStatusIcon, lastDeploy, statusLoaded] =
    useApplicationEnvironmentStatus(applicationName, environment.metadata.name);

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
                {healthStatusIcon} {healthStatus}
              </span>
            ) : (
              <Label isCompact>{strategy}</Label>
            )}
          </FlexItem>
        </Flex>
      </CardHeader>
      <CardExpandableContent>
        <CardBody>
          {statusLoaded ? (
            <>
              {healthStatusIcon} Application {healthStatus}
            </>
          ) : (
            <Skeleton width="50%" screenreaderText="Loading application health" />
          )}
        </CardBody>
        <CardFooter>
          <small>Last Deployment:</small> {'  '}
          <Text component={TextVariants.small} style={{ color: 'var(--pf-global--Color--200)' }}>
            {statusLoaded ? (
              <Timestamp timestamp={lastDeploy} simple />
            ) : (
              <Skeleton width="50%" screenreaderText="Loading last deployment time" />
            )}
          </Text>
        </CardFooter>
      </CardExpandableContent>
    </Card>
  );
};

type ApplicationEnvironmentCardsProps = {
  applicationName: string;
  onSelect?: (environmentId: string) => void;
  selectedEnvironment?: string;
  cardsExpanded: boolean;
};

export const ApplicationEnvironmentCards: React.FC<ApplicationEnvironmentCardsProps> = ({
  applicationName,
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
                applicationName={applicationName}
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
