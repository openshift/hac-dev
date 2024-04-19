import * as React from 'react';
import { Flex, FlexItem, Text } from '@patternfly/react-core';
import { ApplicationKind } from '../../types';
import { ApplicationThumbnail } from './ApplicationThumbnail';

export const ApplicationHeader: React.FC<
  React.PropsWithChildren<{ application: ApplicationKind }>
> = ({ application }) => {
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
        </Flex>
      </FlexItem>
    </Flex>
  );
};
