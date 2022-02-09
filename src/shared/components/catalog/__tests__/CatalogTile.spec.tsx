import * as React from 'react';
import { configure, render, screen } from '@testing-library/react';
import CatalogTile from '../CatalogTile';
import { CatalogType } from '../utils/types';
import { catalogItems } from './catalog-data';

configure({ testIdAttribute: 'data-test' });

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({ t: (x) => x })),
}));

const catalogTypes: CatalogType[] = [
  {
    label: 'Sample',
    value: 'Sample',
    description: '',
  },
];

describe('CatalogTile', () => {
  it('should show tag badges on catalog tile', () => {
    render(<CatalogTile item={catalogItems[0]} />);
    expect(screen.queryByTestId('tag-badges')).not.toBeNull();
  });

  it('should not show tag badges on catalog tile', () => {
    render(<CatalogTile item={catalogItems[1]} />);
    expect(screen.queryByTestId('tag-badges')).toBeNull();
  });

  it('should show catalog badges on catalog tile', () => {
    render(<CatalogTile item={catalogItems[0]} />);
    expect(screen.queryByTestId('catalog-badges')).not.toBeNull();
  });

  it('should not show catalog badges on catalog tile', () => {
    render(<CatalogTile item={catalogItems[1]} />);
    expect(screen.queryByTestId('catalog-badges')).toBeNull();
  });

  it('should show catalog tile badge', () => {
    render(<CatalogTile item={catalogItems[1]} catalogTypes={catalogTypes} />);
    expect(screen.queryByTestId('catalog-tile-badge')).not.toBeNull();
  });

  it('should not show catalog tile badge if tags present in catalog', () => {
    render(<CatalogTile item={catalogItems[0]} catalogTypes={catalogTypes} />);
    expect(screen.queryByTestId('catalog-tile-badge')).toBeNull();
  });
});
