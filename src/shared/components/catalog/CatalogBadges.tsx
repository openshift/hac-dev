import * as React from 'react';
import { Label } from '@patternfly/react-core';
import { CatalogItemBadge } from './utils/types';
import './CatalogBadges.scss';

type CatalogBadgesProps = {
  badges: CatalogItemBadge[];
};

const CatalogBadges: React.FC<CatalogBadgesProps> = ({ badges }) => (
  <div className="hac-catalog-badges" data-test="catalog-badges">
    {badges?.map((badge, index) => (
      <Label
        className="hac-catalog-badges__label"
        color={badge.color}
        icon={badge.icon}
        variant={badge.variant}
        key={index}
      >
        {badge.text}
      </Label>
    ))}
  </div>
);

export default CatalogBadges;
