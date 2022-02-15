import * as React from 'react';
import { configure, render, screen } from '@testing-library/react';
import CatalogView from '../catalog-view/CatalogView';
import CatalogTile from '../CatalogTile';
import { CatalogCategory } from '../utils/types';
import { catalogItems } from './catalog-data';

configure({ testIdAttribute: 'data-test' });

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({ t: (x) => x })),
}));

jest.mock('../../../hooks/useQueryParams', () => ({
  useQueryParams: () => new Map(),
}));

const renderTile = () => <CatalogTile item={catalogItems[0]} />;

describe('CatalogView', () => {
  it('should not render Catalog categories', () => {
    render(<CatalogView items={catalogItems} renderTile={renderTile} />);
    expect(screen.queryByTestId('catalog-categories')).toBeNull();
  });

  it('should render Catalog categories', () => {
    const catalogCategories: CatalogCategory[] = [
      {
        id: 'nodejs-basic',
        label: 'NodeJS',
        tags: ['NodeJS', 'Express'],
      },
    ];
    render(
      <CatalogView items={catalogItems} renderTile={renderTile} categories={catalogCategories} />,
    );
    expect(screen.queryByTestId('catalog-categories')).not.toBeNull();
  });

  it('should not render Catalog filters', () => {
    render(<CatalogView items={catalogItems} renderTile={renderTile} />);
    expect(screen.queryByTestId('catalog-filters')).toBeNull();
  });

  it('should not render Catalog grid', () => {
    render(<CatalogView items={[]} renderTile={renderTile} />);
    expect(screen.queryByTestId('catalog-grid')).toBeNull();
    expect(screen.getByText('devconsole~No results found')).not.toBeNull();
  });
});
