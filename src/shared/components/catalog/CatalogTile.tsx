import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  CatalogTileBadge,
  CatalogTile as PfCatalogTile,
} from '@patternfly/react-catalog-view-extension';
import { Badge, LabelGroup } from '@patternfly/react-core';
import find from 'lodash/find';
import { history } from '../../utils/router';
import { isModifiedEvent } from '../../utils/utils';
import CatalogBadges from './CatalogBadges';
import { getIconProps } from './utils/catalog-utils';
import { CatalogItem, CatalogType } from './utils/types';

import './CatalogTile.scss';

type CatalogTileProps = {
  item: CatalogItem;
  featured?: boolean;
  catalogTypes?: CatalogType[];
  onClick?: (item: CatalogItem) => void;
  href?: string;
};

const CatalogTile: React.FC<CatalogTileProps> = ({
  item,
  catalogTypes,
  featured,
  onClick,
  href,
}) => {
  const { t } = useTranslation();
  const { name, title, provider, description, type, badges, tags } = item;

  const vendor = provider ? t(`Provided by ${provider}`) : null;
  const catalogType = find(catalogTypes, ['value', type]);
  const tagsBadge = tags
    ? [
        <LabelGroup key="tag-badges" data-test="tag-badges">
          {tags.map((label) => (
            <Badge key={label} isRead>
              {label}
            </Badge>
          ))}
        </LabelGroup>,
      ]
    : undefined;
  const typeBadges = catalogType
    ? [
        // eslint-disable-next-line react/jsx-key
        <CatalogTileBadge data-test="catalog-tile-badge">
          <Badge isRead>{catalogType?.label}</Badge>
        </CatalogTileBadge>,
      ]
    : [];

  const isDescriptionReactElement = React.isValidElement(description);
  return (
    <PfCatalogTile
      featured={featured}
      className="catalog-tile"
      onClick={(e: React.SyntheticEvent<HTMLElement>) => {
        if (isModifiedEvent(e as React.MouseEvent<HTMLElement>)) return;
        e.preventDefault();
        if (onClick) {
          onClick(item);
        } else if (href) {
          history.push(href);
        }
      }}
      href={href}
      title={title || name}
      badges={tagsBadge ?? typeBadges}
      vendor={vendor}
      description={isDescriptionReactElement ? undefined : description}
      data-test={`${type}-${name}`}
      {...getIconProps(item)}
    >
      {isDescriptionReactElement ? description : undefined}
      {badges?.length > 0 ? <CatalogBadges badges={badges} /> : undefined}
    </PfCatalogTile>
  );
};

export default React.memo(CatalogTile);
