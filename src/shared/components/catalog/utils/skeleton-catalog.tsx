import * as React from 'react';

import './skeleton-screen.scss';

// 12 works well because it divides evenly for 2, 3, and 4 column layouts
const skeletonTiles = (length: number) =>
  Array.from({ length }, (_, k: number) => <div key={k} className="skeleton-catalog--tile" />);

export const skeletonCatalog = (
  <div role="progressbar" className="loading-skeleton--catalog">
    <div className="skeleton-catalog--list" />
    <div className="skeleton-catalog--grid">{skeletonTiles(12)}</div>
  </div>
);

export const skeletonTileSelector = (
  <div role="progressbar" className="loading-skeleton--catalog">
    <div className="skeleton-catalog--grid__tiles">{skeletonTiles(6)}</div>
  </div>
);
