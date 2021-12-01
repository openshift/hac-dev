import * as React from 'react';

export enum CatalogQueryParams {
  TYPE = 'catalogType',
  CATEGORY = 'category',
  KEYWORD = 'keyword',
  SORT_ORDER = 'sortOrder',
  GROUPING = 'grouping',
  SELECTED_ID = 'selectedId',
}

export enum CatalogSortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export type CatalogFilterItem = {
  label?: string;
  value: string;
  active: boolean;
};

export type CatalogFilter = { [key: string]: CatalogFilterItem };

export type CatalogFilters = Record<string, CatalogFilter>;

export type CatalogFilterCounts = Record<string, { [key: string]: number }>;

export type CatalogTypeCounts = Record<string, number>;

export type CatalogStringMap = Record<string, string>;

export type CatalogType = {
  label: string;
  value: string;
  description: string;
};

export type CatalogCategory = {
  id: string;
  label: string;
  tags?: string[];
  subcategories?: CatalogSubcategory[];
};

export type CatalogSubcategory = {
  id: string;
  label: string;
  tags?: string[];
};

export type CatalogItem<T extends any = any> = {
  uid: string;
  type: string;
  name: string;
  /** Optional title to render a custom title using ReactNode.
   * Rendered in catalog tile and side panel
   *  */
  title?: React.ReactNode;
  // Used as the second label next to the provider label in the list result.
  secondaryLabel?: React.ReactNode;
  provider?: string;
  // Used as the tile description. If provided as a string, the description is truncated to 3 lines.
  // If provided as a ReactNode, the contents will not be truncated.
  // This description will also be shown in the side panel if there are no `details.descriptions`.
  description?: string | React.ReactNode;
  tags?: string[];
  creationTimestamp?: string;
  supportUrl?: string;
  documentationUrl?: string;
  attributes?: {
    [key: string]: any;
  };
  cta?: {
    label: string;
    href?: string;
    callback?: (props?: any) => void;
  };
  icon?: {
    url?: string;
    class?: string;
    node?: React.ReactNode;
  };
  details?: {
    properties?: CatalogItemDetailsProperty[];
    descriptions?: CatalogItemDetailsDescription[];
  };
  // Optional text only badges for the catalog item which will be rendered on the tile and details panel.
  badges?: CatalogItemBadge[];
  // Optional data attached by the provider.
  // May be consumed by filters.
  // `data` for each `type` of CatalogItem should implement the same interface.
  data?: T;
};

export type CatalogItemDetailsProperty = {
  label: string;
  value: string | React.ReactNode;
};

export type CatalogItemDetailsDescription = {
  label?: string;
  value: string | React.ReactNode;
};

export type CatalogItemAttribute = {
  label: string;
  attribute: string;
};

export type CatalogItemBadge = {
  text: string;
  color?: 'blue' | 'cyan' | 'green' | 'orange' | 'purple' | 'red' | 'grey';
  icon?: React.ReactNode;
  variant?: 'outline' | 'filled';
};

export type CatalogService = {
  type: string;
  items: CatalogItem[];
  itemsMap: { [type: string]: CatalogItem[] };
  loaded: boolean;
  loadError: any;
  searchCatalog: (query: string) => CatalogItem[];
  catalogExtensions: any[];
};
