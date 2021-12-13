import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import * as _ from 'lodash-es';
import { useQueryParams } from '../../hooks';
import { setQueryArgument } from '../../utils';
import PageHeading from '../headings/PageHeading';
import { StatusBox } from '../status-box/StatusBox';
import { RenderCell } from '../virtualized-grid/types';
import CatalogView from './catalog-view/CatalogView';
import CatalogTile from './CatalogTile';
// import CatalogDetailsModal from './details/CatalogDetailsModal';
import { getURLWithParams } from './utils/catalog-utils';
import { determineAvailableFilters } from './utils/filter-utils';
import { skeletonCatalog } from './utils/skeleton-catalog';
import {
  CatalogCategory,
  CatalogFilters,
  CatalogQueryParams,
  CatalogStringMap,
  CatalogType,
  CatalogItem,
  CatalogItemAttribute,
  CatalogService,
} from './utils/types';

type CatalogControllerProps = CatalogService & {
  enableDetailsPanel?: boolean;
  hideSidebar?: boolean;
  title: string;
  description: string;
  categories?: CatalogCategory[];
};

const CatalogController: React.FC<CatalogControllerProps> = ({
  type,
  items,
  itemsMap,
  loaded,
  loadError,
  catalogExtensions,
  enableDetailsPanel,
  title: defaultTitle,
  description: defaultDescription,
  hideSidebar,
  categories,
}) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const queryParams = useQueryParams();

  const typeExtension = React.useMemo(
    () => catalogExtensions?.find((extension) => extension.properties.type === type),
    [catalogExtensions, type],
  );

  const title = typeExtension?.properties.title ?? defaultTitle;
  const description = typeExtension?.properties.catalogDescription ?? defaultDescription;

  const filterGroups: string[] = React.useMemo(() => {
    return (
      typeExtension?.properties.filters?.map((filter: CatalogItemAttribute) => filter.attribute) ??
      []
    );
  }, [typeExtension]);

  const filterGroupNameMap: CatalogStringMap = React.useMemo(() => {
    return (
      typeExtension?.properties.filters?.reduce((map, filter: CatalogItemAttribute) => {
        map[filter.attribute] = filter.label;
        return map;
      }, {}) ?? {}
    );
  }, [typeExtension]);

  const groupings: CatalogStringMap = React.useMemo(() => {
    return (
      typeExtension?.properties.groupings?.reduce((map, group: CatalogItemAttribute) => {
        map[group.attribute] = group.label;
        return map;
      }, {}) ?? {}
    );
  }, [typeExtension]);

  const breadcrumbs = React.useMemo(() => {
    const categoryParam = queryParams.get(CatalogQueryParams.CATEGORY);
    const keywordParam = queryParams.get(CatalogQueryParams.KEYWORD);
    const sortParam = queryParams.get(CatalogQueryParams.SORT_ORDER);
    const params = new URLSearchParams({
      ...(categoryParam ? { [CatalogQueryParams.CATEGORY]: categoryParam } : {}),
      ...(keywordParam ? { [CatalogQueryParams.KEYWORD]: keywordParam } : {}),
      ...(sortParam ? { [CatalogQueryParams.SORT_ORDER]: sortParam } : {}),
    });
    const crumbs = [
      {
        name: t('appstudio~Samples Catalog'),
        path: `${pathname}?${params.toString()}`,
      },
    ];

    if (type) {
      crumbs.push({
        name: title,
        path: `${pathname}?${CatalogQueryParams.TYPE}=${type}`,
      });
    }

    return crumbs;
  }, [pathname, t, queryParams, title, type]);

  // const selectedItem = React.useMemo(() => {
  //   const selectedId = queryParams.get(CatalogQueryParams.SELECTED_ID);
  //   return items.find((it) => selectedId === it.uid);
  // }, [items, queryParams]);

  const catalogTypes: CatalogType[] = React.useMemo(() => {
    const types = catalogExtensions.map((extension) => ({
      label: extension.properties.title,
      value: extension.properties.type,
      description: extension.properties.typeDescription,
    }));

    return _.sortBy(types, ({ label }) => label.toLowerCase());
  }, [catalogExtensions]);

  const catalogItems = React.useMemo(
    () => (type ? itemsMap[type] : items),
    [items, itemsMap, type],
  );

  const availableFilters: CatalogFilters = React.useMemo(
    () => determineAvailableFilters({}, catalogItems, filterGroups),
    [catalogItems, filterGroups],
  );

  const openDetailsPanel = React.useCallback((item: CatalogItem): void => {
    setQueryArgument(CatalogQueryParams.SELECTED_ID, item.uid);
  }, []);

  // const closeDetailsPanel = React.useCallback((): void => {
  //   removeQueryArgument(CatalogQueryParams.SELECTED_ID);
  // }, []);

  const renderTile = React.useCallback(
    (item: CatalogItem) => (
      <CatalogTile
        item={item}
        catalogTypes={catalogTypes}
        onClick={
          enableDetailsPanel
            ? openDetailsPanel
            : item.cta?.callback
            ? () => item.cta.callback()
            : null
        }
        href={
          !enableDetailsPanel
            ? item.cta?.href
            : getURLWithParams(CatalogQueryParams.SELECTED_ID, item.uid)
        }
      />
    ),
    [catalogTypes, openDetailsPanel, enableDetailsPanel],
  ) as RenderCell;

  return (
    <>
      <div className="co-catalog">
        <PageHeading
          title={title}
          breadcrumbs={type ? breadcrumbs : null}
          description={description}
        />
        <div className="co-catalog__body">
          <StatusBox
            skeleton={skeletonCatalog}
            data={items}
            loaded={loaded}
            loadError={loadError}
            label={t('devconsole~Catalog items')}
          >
            <CatalogView
              catalogType={type}
              catalogTypes={catalogTypes}
              items={catalogItems}
              categories={categories}
              filters={availableFilters}
              filterGroups={filterGroups}
              filterGroupNameMap={filterGroupNameMap}
              groupings={groupings}
              renderTile={renderTile}
              hideSidebar={hideSidebar}
            />
            {/* <CatalogDetailsModal item={selectedItem} onClose={closeDetailsPanel} /> */}
          </StatusBox>
        </div>
      </div>
    </>
  );
};

export default CatalogController;
