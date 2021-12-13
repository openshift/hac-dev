import * as _ from 'lodash-es';
import * as catalogImg from '../../../../imgs/catalog-icon.svg';
import { history, keywordFilter } from '../../../utils';
import { CatalogType, CatalogTypeCounts, CatalogItem } from './types';

export const normalizeIconClass = (iconClass: string): string => {
  return _.startsWith(iconClass, 'icon-') ? `font-icon ${iconClass}` : iconClass;
};

const catalogItemCompare = (keyword: string, item: CatalogItem): boolean => {
  if (!item) {
    return false;
  }
  return (
    item.name.toLowerCase().includes(keyword) ||
    (typeof item.description === 'string' && item.description.toLowerCase().includes(keyword)) ||
    item.type.toLowerCase().includes(keyword) ||
    item.tags?.some((tag) => tag.includes(keyword)) ||
    item.cta?.label.toLowerCase().includes(keyword)
  );
};

export const keywordCompare = (filterString: string, items: CatalogItem[]): CatalogItem[] => {
  return keywordFilter(filterString, items, catalogItemCompare);
};

export const getIconProps = (item: CatalogItem) => {
  const { icon } = item;
  if (icon.url) {
    return { iconImg: icon.url, iconClass: null };
  }
  if (icon.class) {
    return { iconImg: null, iconClass: normalizeIconClass(icon.class) };
  }
  return { iconImg: catalogImg, iconClass: null };
};

export const setURLParams = (params: URLSearchParams) => {
  const url = new URL(window.location.href);
  const searchParams = `?${params.toString()}${url.hash}`;

  history.replace(`${url.pathname}${searchParams}`);
};

export const updateURLParams = (paramName: string, value: string | string[]) => {
  const params = new URLSearchParams(window.location.search);

  if (value) {
    params.set(paramName, Array.isArray(value) ? JSON.stringify(value) : value);
  } else {
    params.delete(paramName);
  }
  setURLParams(params);
};

export const getURLWithParams = (paramName: string, value: string | string[]): string => {
  const params = new URLSearchParams(window.location.search);
  const url = new URL(window.location.href);

  if (value) {
    params.set(paramName, Array.isArray(value) ? JSON.stringify(value) : value);
  } else {
    params.delete(paramName);
  }

  const searchParams = `?${params.toString()}${url.hash}`;
  return `${url.pathname}${searchParams}`;
};

export const getCatalogTypeCounts = (
  items: CatalogItem[],
  catalogTypes: CatalogType[],
): CatalogTypeCounts => {
  const catalogTypeCounts = {};

  catalogTypes.forEach((catalogType) => {
    const matchedItems = items.filter((item) => item.type === catalogType.value);
    catalogTypeCounts[catalogType.value] = matchedItems.length;
  });

  return catalogTypeCounts;
};

export const searchCatalog = (items: CatalogItem[], query: string) => {
  return keywordCompare(query, items);
};
