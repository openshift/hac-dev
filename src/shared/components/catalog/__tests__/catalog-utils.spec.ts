import * as catalogImg from '../../../../imgs/catalog-icon.svg';
import { catalogItems } from '../catalog-data';
import {
  getCatalogTypeCounts,
  getIconProps,
  getURLWithParams,
  normalizeIconClass,
} from '../utils/catalog-utils';

describe('catalog-utils', () => {
  it('normalizeIconClass should return normalized class', () => {
    const normalizedClass = normalizeIconClass('icon-signOut');
    expect(normalizedClass).toBe('font-icon icon-signOut');
  });

  it('normalizeIconClass should return class as it is', () => {
    const normalizedClass = normalizeIconClass('fork');
    expect(normalizedClass).toBe('fork');
  });

  it('getIconProps should return icon props with icon url', () => {
    const iconProps = getIconProps(catalogItems[0]);
    expect(iconProps).toStrictEqual({ iconImg: catalogItems[0].icon.url, iconClass: null });
  });

  it('getIconProps should return icon props with icon class', () => {
    const iconProps = getIconProps(catalogItems[1]);
    expect(iconProps).toStrictEqual({ iconImg: null, iconClass: 'font-icon icon-python' });
  });

  it('getIconProps should return default icon props', () => {
    const iconProps = getIconProps(catalogItems[2]);
    expect(iconProps).toStrictEqual({ iconImg: catalogImg, iconClass: null });
  });

  it('getURLWithParams should return url with params', () => {
    const url = getURLWithParams('catalog', 'node');
    expect(url).toBe('/?catalog=node');
  });

  it('params should get deleted if value is undefined', () => {
    const url = getURLWithParams('catalog', undefined);
    expect(url).toBe('/?');
  });

  it('should return catalog type counts', () => {
    const catalogTypeCounts = getCatalogTypeCounts(catalogItems, [
      { label: '', value: 'Sample', description: '' },
    ]);
    expect(catalogTypeCounts).toStrictEqual({ Sample: 3 });
  });
});
