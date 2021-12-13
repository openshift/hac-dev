import * as React from 'react';
import { Title } from '@patternfly/react-core';
import * as _ from 'lodash-es';
import { VirtualizedGrid } from '../../virtualized-grid';
import { RenderCell } from '../../virtualized-grid/types';
import { CatalogItem } from '../utils/types';

type CatalogGridProps = {
  items: CatalogItem[] | { [key: string]: CatalogItem[] };
  renderTile: RenderCell;
  isGrouped: boolean;
};

const CatalogGrid: React.FC<CatalogGridProps> = ({ items, renderTile, isGrouped }) => {
  const renderGroupHeader = (heading) => (
    <Title className="co-catalog-page__group-title" headingLevel="h2" size="lg">
      {heading} ({_.size(items[heading])})
    </Title>
  );

  return (
    <div className="co-catalog-page__grid">
      <VirtualizedGrid
        items={items}
        renderCell={renderTile}
        renderHeader={renderGroupHeader}
        isItemsGrouped={isGrouped}
      />
    </div>
  );
};

export default CatalogGrid;
