import * as React from 'react';
import { Flex, FlexItem, Label, LabelGroup, Truncate } from '@patternfly/react-core';

interface MetadataListProps {
  metadata: Record<string, string>;
}

const MetadataList: React.FC<React.PropsWithChildren<MetadataListProps>> = ({ metadata }) => {
  if (!metadata) return <>-</>;
  const labelArray = Object.entries(metadata);

  return (
    <Flex>
      <LabelGroup>
        {labelArray.map((label, index) => (
          <FlexItem key={index}>
            <Label color="blue">
              <Truncate content={label.toString().replace(',', '=')} />{' '}
            </Label>
          </FlexItem>
        ))}
      </LabelGroup>
    </Flex>
  );
};

export default MetadataList;
