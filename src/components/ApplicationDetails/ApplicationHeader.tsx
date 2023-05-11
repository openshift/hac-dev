import * as React from 'react';
import { Button, Flex, FlexItem, Text, Tooltip } from '@patternfly/react-core';
import { OutlinedCopyIcon } from '@patternfly/react-icons/dist/esm/icons/outlined-copy-icon';
import { global_palette_blue_400 as linkColor } from '@patternfly/react-tokens/dist/js/global_palette_blue_400';
import { useApplicationHealthStatus, useLatestApplicationRouteURL } from '../../hooks';
import ExternalLink from '../../shared/components/links/ExternalLink';
import { ApplicationKind } from '../../types';
import { runStatus } from '../../utils/pipeline-utils';
import { StatusIconWithTextLabel } from '../topology/StatusIcon';
import { ApplicationThumbnail } from './ApplicationThumbnail';

export const ApplicationHeader: React.FC<{ application: ApplicationKind }> = ({ application }) => {
  const [urlCopied, setUrlCopied] = React.useState<boolean>(false);

  const selectedComponentRoute = useLatestApplicationRouteURL(application.metadata.name);
  const [healthStatus, healthStatusloaded] = useApplicationHealthStatus(application.metadata.name);

  const onCopyButtonClick = React.useCallback(() => {
    navigator.clipboard.writeText(selectedComponentRoute);
    setUrlCopied(true);
    setTimeout(() => {
      setUrlCopied(false);
    }, 3000);
  }, [selectedComponentRoute]);

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
            <>
              <ExternalLink href={selectedComponentRoute}>
                {selectedComponentRoute.length > 40
                  ? `${selectedComponentRoute.slice(0, 40)}...`
                  : selectedComponentRoute}
              </ExternalLink>{' '}
              <Tooltip content={urlCopied ? 'URL Copied' : 'Copy URL'}>
                <Button
                  variant="plain"
                  data-testid="route-copy-icon"
                  isInline
                  onClick={onCopyButtonClick}
                >
                  <OutlinedCopyIcon color={linkColor.value} />
                </Button>
              </Tooltip>
            </>
          )}
        </FlexItem>
      </FlexItem>
    </Flex>
  );
};
