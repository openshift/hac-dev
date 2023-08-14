import * as React from 'react';
import { Flex, FlexItem } from '@patternfly/react-core';
import { ComponentKind } from '../../types';
import PodLogsButton from './PodLogsButton';

type PodLogsColumnProps = {
  component: ComponentKind;
  podSelector: any;
};

const PodLogsColumn: React.FC<PodLogsColumnProps> = ({ component, podSelector }) => (
  <Flex direction={{ default: 'column' }}>
    <FlexItem align={{ default: 'alignRight' }}>
      <PodLogsButton component={component} podSelector={podSelector} />
    </FlexItem>
  </Flex>
);

export default PodLogsColumn;
