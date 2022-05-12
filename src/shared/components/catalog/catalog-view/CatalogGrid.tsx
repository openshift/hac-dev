import * as React from 'react';
import { Title } from '@patternfly/react-core';
import size from 'lodash/size';
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
    <Title className="hacDev-catalog-page__group-title" headingLevel="h2" size="lg">
      {heading} ({size(items[heading])})
    </Title>
  );

  return (
    <div className="hacDev-catalog-page__grid">
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
