import * as React from 'react';
import {
  DataListAction,
  DataListCell,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  Flex,
  FlexItem,
  Tooltip,
} from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons/dist/esm/icons/external-link-alt-icon';
import ActionMenu from '../../shared/components/action-menu/ActionMenu';
import ExternalLink from '../../shared/components/links/ExternalLink';
import { ComponentKind, RouteKind } from '../../types';
import { getComponentRouteWebURL } from '../../utils/route-utils';
import { useComponentActions } from '../ApplicationDetailsView/component-actions';
import ApplicationEnvironmentRevisionLink from './ApplicationEnvironmentRevisionLink';

import './ApplicationEnvironmentListItem.scss';

type ApplicationEnvironmentListViewPageProps = {
  component: ComponentKind;
  routes?: RouteKind[];
};

export const ApplicationEnvironmentListItem: React.FC<ApplicationEnvironmentListViewPageProps> = ({
  component,
  routes,
}) => {
  const { name, uid } = component.metadata;
  const actions = useComponentActions(component, name);
  const componentRouteWebURL = routes?.length > 0 && getComponentRouteWebURL(routes, name);
  const containerImage = component.spec?.containerImage;

  const imageNameParts = containerImage?.split('/');
  const imageName = imageNameParts?.[imageNameParts.length - 1];

  return (
    <DataListItem id={uid} aria-label={name} data-testid="application-environment-list-item">
      <DataListItemRow>
        <DataListItemCells
          dataListCells={[
            <DataListCell key="name" width={1}>
              <Flex spaceItems={{ default: 'spaceItemsSm' }}>
                <FlexItem>
                  <b>{name}</b>
                </FlexItem>
                <FlexItem>
                  <Tooltip content="Route">
                    <ExternalLink
                      href={componentRouteWebURL}
                      text={<ExternalLinkAltIcon />}
                      stopPropagation
                    />
                  </Tooltip>
                </FlexItem>
              </Flex>
            </DataListCell>,
            <DataListCell key="revision" width={2}>
              <ApplicationEnvironmentRevisionLink component={component} />
            </DataListCell>,
            <DataListCell key="image" width={2}>
              <Flex spaceItems={{ default: 'spaceItemsSm' }}>
                <FlexItem>Image:</FlexItem>
                <FlexItem>
                  <ExternalLink
                    href={`https://${containerImage}`}
                    text={imageName}
                    stopPropagation
                  />
                </FlexItem>
              </Flex>
            </DataListCell>,
          ]}
        />
        <DataListAction
          aria-labelledby={`${name.toLowerCase()}-actions`}
          data-testid={`${name.toLowerCase()}-actions`}
          id={`${name.toLowerCase()}-actions`}
          aria-label={`${name.toLowerCase()}-actions`}
          isPlainButtonAction
        >
          <ActionMenu actions={actions} />
        </DataListAction>
      </DataListItemRow>
    </DataListItem>
  );
};
