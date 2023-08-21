import * as React from 'react';
import { Flex, FlexItem, Icon, Text, Truncate } from '@patternfly/react-core';
import ExternalLinkAltIcon from '@patternfly/react-icons/dist/js/icons/external-link-alt-icon';
import { useApplicationHealthStatus } from '../../hooks/useApplicationHealthStatus';
import { useLatestApplicationRouteURL } from '../../hooks/useLatestApplicationRouteURL';
import ExternalLink from '../../shared/components/links/ExternalLink';
import { ApplicationKind } from '../../types';
import { runStatus } from '../../utils/pipeline-utils';
import { StatusIconWithTextLabel } from '../topology/StatusIcon';
import { ApplicationThumbnail } from './ApplicationThumbnail';

export const ApplicationHeader: React.FC<{ application: ApplicationKind }> = ({ application }) => {
  const selectedComponentRoute = useLatestApplicationRouteURL(application.metadata.name);
  const [healthStatus, healthStatusloaded] = useApplicationHealthStatus(application.metadata.name);

  return (
    <Flex>
      <FlexItem>
        <ApplicationThumbnail application={application} />
      </FlexItem>
      <FlexItem alignSelf={{ default: 'alignSelfCenter' }}>
        <Flex>
          <FlexItem>
            <Text component="h1" data-test="details__title">
              {application?.spec?.displayName || ''}
            </Text>
          </FlexItem>
          {healthStatusloaded && healthStatus ? (
            <FlexItem>
              <StatusIconWithTextLabel status={healthStatus.status as runStatus} />
            </FlexItem>
          ) : null}
        </Flex>
        <FlexItem>
          {selectedComponentRoute && (
            <ExternalLink href={selectedComponentRoute} dataTestID="component-route-link" hideIcon>
              <Flex>
                <FlexItem flex={{ default: 'flex_3' }}>
                  <Truncate
                    position="middle"
                    content={selectedComponentRoute}
                    trailingNumChars={Math.min(selectedComponentRoute.length / 2, 30)}
                  />
                </FlexItem>
                <FlexItem>
                  <Icon iconSize="sm">
                    <ExternalLinkAltIcon />
                  </Icon>
                </FlexItem>
              </Flex>
            </ExternalLink>
          )}
        </FlexItem>
      </FlexItem>
    </Flex>
  );
};
