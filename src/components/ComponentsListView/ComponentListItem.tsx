import * as React from 'react';
import {
  DataListAction,
  DataListCell,
  DataListContent,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  DataListToggle,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Flex,
  FlexItem,
  Tooltip,
} from '@patternfly/react-core';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/js/icons/exclamation-circle-icon';
import ExternalLinkAltIcon from '@patternfly/react-icons/dist/js/icons/external-link-alt-icon';
import { global_palette_red_100 as redColor } from '@patternfly/react-tokens/dist/js/global_palette_red_100';
import ActionMenu from '../../shared/components/action-menu/ActionMenu';
import ExternalLink from '../../shared/components/links/ExternalLink';
import { ComponentKind, RouteKind, ResourceStatusCondition } from '../../types';
import { getConditionForResource } from '../../utils/common-utils';
import { getComponentRouteWebURL } from '../../utils/route-utils';
import { useComponentActions } from '../ApplicationDetailsView/component-actions';
import BuildStatusColumn from './BuildStatusColumn';

import './ComponentListItem.scss';

export type ComponentListViewItemProps = {
  component: ComponentKind;
  routes: RouteKind[];
  allComponents?: ComponentKind[];
  BuildStatusComponent?: React.ComponentType<{
    component: ComponentKind;
    allComponents?: ComponentKind[];
  }>;
};

const getConditionStatus = (condition: ResourceStatusCondition) => {
  if (condition.reason === 'Error') {
    return (
      <>
        <ExclamationCircleIcon color={redColor.value} /> Component {condition.type}
      </>
    );
  }
  return null;
};

export const ComponentListItem: React.FC<ComponentListViewItemProps> = ({
  component,
  routes,
  allComponents,
  BuildStatusComponent = BuildStatusColumn,
}) => {
  const [expanded, setExpanded] = React.useState(false);
  const { replicas, targetPort, resources } = component.spec;
  const name = component.metadata.name;
  const actions = useComponentActions(component, name);
  const resourceRequests = resources?.requests;
  const containerImage = component.status?.containerImage;
  const componentRouteWebURL = routes?.length > 0 && getComponentRouteWebURL(routes, name);
  const condition = getConditionForResource<ComponentKind>(component);

  return (
    <DataListItem aria-label={name} isExpanded={expanded} data-testid="component-list-item">
      <DataListItemRow data-test={`${name}-component-list-item`}>
        <DataListToggle
          id={name}
          data-testid={`${name}-toggle`}
          onClick={() => setExpanded((x) => !x)}
          isExpanded={expanded}
        />
        <DataListItemCells
          dataListCells={[
            <DataListCell key="name">
              <Flex direction={{ default: 'column' }}>
                <FlexItem data-testid="component-list-item-name">
                  <b>{name}</b>
                </FlexItem>
                <FlexItem>
                  <ExternalLink href={component.spec.source?.git?.url}>
                    Git repository <ExternalLinkAltIcon />
                  </ExternalLink>
                </FlexItem>
                <FlexItem>
                  {componentRouteWebURL && (
                    <ExternalLink href={componentRouteWebURL}>
                      Route <ExternalLinkAltIcon />
                    </ExternalLink>
                  )}
                </FlexItem>
              </Flex>
            </DataListCell>,
            condition && getConditionStatus(condition) ? (
              <DataListCell key={`${name}-component-status`} alignRight>
                <Tooltip content={condition.message}>
                  <span>{getConditionStatus(condition)}</span>
                </Tooltip>
              </DataListCell>
            ) : null,
            <BuildStatusComponent
              key="status"
              component={component}
              allComponents={allComponents}
            />,
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
      <DataListContent
        className="component-list-item__details"
        aria-label={`${name} details`}
        isHidden={!expanded}
      >
        <DescriptionList
          columnModifier={{
            default: '2Col',
          }}
        >
          {resourceRequests && (
            <DescriptionListGroup>
              <DescriptionListTerm>CPU / Memory</DescriptionListTerm>
              <DescriptionListDescription>
                {`${resourceRequests.cpu}, ${resourceRequests.memory}`}
              </DescriptionListDescription>
            </DescriptionListGroup>
          )}
          {replicas && (
            <DescriptionListGroup>
              <DescriptionListTerm>Instances</DescriptionListTerm>
              <DescriptionListDescription>{replicas}</DescriptionListDescription>
            </DescriptionListGroup>
          )}
          {targetPort && (
            <DescriptionListGroup>
              <DescriptionListTerm>Target Port</DescriptionListTerm>
              <DescriptionListDescription>{targetPort}</DescriptionListDescription>
            </DescriptionListGroup>
          )}
          {componentRouteWebURL && (
            <DescriptionListGroup>
              <DescriptionListTerm>Route</DescriptionListTerm>
              <DescriptionListDescription>
                <ExternalLink href={componentRouteWebURL} text={componentRouteWebURL} />
              </DescriptionListDescription>
            </DescriptionListGroup>
          )}
          {containerImage && (
            <DescriptionListGroup>
              <DescriptionListTerm>Built container image</DescriptionListTerm>
              <DescriptionListDescription>
                <ExternalLink href={`https://${containerImage}`} text={containerImage} />
              </DescriptionListDescription>
            </DescriptionListGroup>
          )}
        </DescriptionList>
      </DataListContent>
    </DataListItem>
  );
};
