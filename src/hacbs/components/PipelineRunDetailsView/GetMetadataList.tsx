import * as React from 'react';
import { Flex, FlexItem, Label, LabelGroup } from '@patternfly/react-core';

interface GetMetadataListProps {
  metadata: Record<string, string>;
}

const GetMetadataList: React.FC<GetMetadataListProps> = ({ metadata }) => {
  if (!metadata) return <>-</>;
  const labelArray = Object.entries(metadata);

  return (
    <Flex>
      <LabelGroup>
        {labelArray.map((label, index) => (
          <FlexItem key={index}>
            <Label color="blue" isTruncated={label.toString().length > 100}>
              {label.toString().replace(',', '=')}{' '}
            </Label>
          </FlexItem>
        ))}
      </LabelGroup>
    </Flex>
  );
};

export default GetMetadataList;
