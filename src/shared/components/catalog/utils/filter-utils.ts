import cloneDeep from 'lodash/cloneDeep';
import filter from 'lodash/filter';
import forOwn from 'lodash/forOwn';
import isEmpty from 'lodash/isEmpty';
import reduce from 'lodash/reduce';
import set from 'lodash/set';
import size from 'lodash/size';
import { keywordCompare } from './catalog-utils';
import { CatalogFilter, CatalogFilterCounts, CatalogFilters, CatalogItem } from './types';

export const filterByGroup = (
  items: CatalogItem[],
  filters: CatalogFilters,
): Record<string, CatalogItem[]> => {
  // Filter items by each filter group
  return reduce(
    filters,
    (filtered, group, key) => {
      // Only apply active filters
      const activeFilters = filter(group, 'active');
      if (activeFilters.length) {
        const values = reduce(
          activeFilters,
          (filterValues, { value }) => {
            filterValues.push(value);
            return filterValues;
          },
          [],
        );

        filtered[key] = filter(items, (item) => {
          const filterValue = item[key] || item.attributes?.[key];
          if (Array.isArray(filterValue)) {
            return filterValue.some((f) => values.includes(f));
          }
          return values.includes(filterValue);
        });
      }

      return filtered;
    },
    {},
  );
};

export const filterByAttributes = (
  items: CatalogItem[],
  filters: CatalogFilters,
): CatalogItem[] => {
  if (isEmpty(filters)) {
    return items;
  }

  // Apply each filter property individually. Example:
  //  filteredByGroup = {
  //    provider: [/*array of items filtered by provider*/],
  //    healthIndex: [/*array of items filtered by healthIndex*/],
  //  };
  const filteredByGroup = filterByGroup(items, filters);

  // Intersection of individually applied filters is all filters
  // In the case no filters are active, returns items filteredByKeyword
  return [...Object.values(filteredByGroup), items].reduce((a, b) =>
    a.filter((c) => b.includes(c)),
  );
};

export const filterBySearchKeyword = (
  items: CatalogItem[],
  searchKeyword: string,
): CatalogItem[] => {
  return keywordCompare(searchKeyword, items);
};

export const filterByCategory = (
  items: CatalogItem[],
  categoryId: string,
  categorizedIds: Record<string, string[]>,
): CatalogItem[] => {
  return categoryId !== 'all'
    ? items.filter((item) => categorizedIds[categoryId]?.includes(item.uid))
    : items;
};

export const determineAvailableFilters = (
  initialFilters: CatalogFilters,
  items: CatalogItem[],
  filterGroups: string[],
): CatalogFilters => {
  const filters = cloneDeep(initialFilters);

  filterGroups.forEach((field) => {
    items.forEach((item) => {
      const value = item[field] || item.attributes?.[field];
      if (value) {
        set(filters, [field, value], {
          label: value,
          value,
          active: false,
        });
      }
    });
  });

  return filters;
};

export const getActiveFilters = (attributeFilters, activeFilters): CatalogFilters => {
  forOwn(attributeFilters, (filterValues, filterType) => {
    // removing default and localstore filters if Filters are present over URL
    Object.keys(activeFilters[filterType]).forEach((key) =>
      set(activeFilters, [filterType, key, 'active'], false),
    );
    filterValues.forEach(filterValues, (filterValue) => {
      set(activeFilters, [filterType, filterValue, 'active'], true);
    });
  });

  return activeFilters;
};

export const getFilterGroupCounts = (
  items: CatalogItem[],
  activeFilters: CatalogFilters,
  filterGroups: string[],
): CatalogFilterCounts => {
  const newFilterCounts = {};

  if (isEmpty(activeFilters)) {
    return newFilterCounts;
  }

  filterGroups.forEach((filterGroup) => {
    Object.keys(activeFilters[filterGroup]).forEach((key) => {
      const filterValues = [activeFilters[filterGroup]?.[key]?.value];

      const matchedItems = filter(items, (item) => {
        const filterValue = item[filterGroup] || item.attributes?.[filterGroup];
        if (Array.isArray(filterValue)) {
          return filterValue.some((f) => filterValues.includes(f));
        }

        return filterValues.includes(filterValue);
      });

      set(newFilterCounts, [filterGroup, key], size(matchedItems));
    });
  });

  return newFilterCounts;
};

export const getFilterSearchParam = (groupFilter: CatalogFilter): string => {
  const activeValues = reduce(
    Object.keys(groupFilter),
    (result, typeKey) => {
      return groupFilter[typeKey].active ? result.concat(typeKey) : result;
    },
    [],
  );

  return isEmpty(activeValues) ? '' : JSON.stringify(activeValues);
};
