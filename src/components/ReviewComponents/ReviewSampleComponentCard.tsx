import * as React from 'react';
import {
  Card,
  CardExpandableContent,
  CardHeader,
  Text,
  TextVariants,
  Flex,
  FlexItem,
} from '@patternfly/react-core';
import './ReviewSampleComponentCard.scss';
import { CatalogItem } from '../../shared/components/catalog/utils/types';

type ReviewSampleComponentCardProps = {
  component: CatalogItem;
};

export const ReviewSampleComponentCard: React.FC<ReviewSampleComponentCardProps> = ({
  component,
}) => {
  const [isExpanded, setIsExpanded] = React.useState<boolean>(false);
  const {
    name,
    description,
    icon: { url },
  } = component;
  const origin = component.attributes.git.remotes.origin;

  return (
    <Card className="review-component" isExpanded={isExpanded}>
      <CardHeader
        onExpand={() => setIsExpanded((prevExpanded) => !prevExpanded)}
        toggleButtonProps={{
          'aria-label': `${name}`,
          'aria-expanded': isExpanded,
        }}
      >
        <img className="review-component__image" src={url} alt={name} />
        <span className="review-component__name">{name}</span>
      </CardHeader>
      <CardExpandableContent>
        <Flex className="review-component__content" direction={{ default: 'column' }}>
          <FlexItem>
            <Text component={TextVariants.p}>{description}</Text>
          </FlexItem>
          <FlexItem>
            <b>Git Repo: </b>
            <a href={origin} target="_blank" rel="noreferrer">
              {origin}
            </a>
          </FlexItem>
        </Flex>
      </CardExpandableContent>
    </Card>
  );
};
