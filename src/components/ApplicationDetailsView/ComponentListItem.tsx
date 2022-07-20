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
  DescriptionListTermHelpText,
  DescriptionListTermHelpTextButton,
  Tooltip,
} from '@patternfly/react-core';
import CheckCircleIcon from '@patternfly/react-icons/dist/js/icons/check-circle-icon';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/js/icons/exclamation-circle-icon';
import { global_palette_green_400 as greenColor } from '@patternfly/react-tokens/dist/js/global_palette_green_400';
import { global_palette_red_100 as redColor } from '@patternfly/react-tokens/dist/js/global_palette_red_100';
import ActionMenu from '../../shared/components/action-menu/ActionMenu';
import ExternalLink from '../../shared/components/links/ExternalLink';
import { ComponentKind, ResourceStatusCondition, RouteKind } from '../../types';
import { getConditionForResource } from '../../utils/common-utils';
import { getComponentRouteWebURL } from '../../utils/route-utils';
import './ComponentListItem.scss';
import { useComponentActions } from './component-actions';

type ComponentListViewPageProps = {
  component: ComponentKind;
  routes: RouteKind[];
};

const getConditionStatus = (condition: ResourceStatusCondition) => {
  if (condition.reason === 'Error') {
    return (
      <>
        <ExclamationCircleIcon color={redColor.value} /> Component {condition.type}
      </>
    );
  } else if (condition.reason === 'OK') {
    return (
      <>
        <CheckCircleIcon color={greenColor.value} /> Component {condition.type}
      </>
    );
  }
  return condition.type;
};

export const ComponentListItem: React.FC<ComponentListViewPageProps> = ({ component, routes }) => {
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
      <DataListItemRow>
        <DataListToggle
          id={name}
          data-testId={`${name}-toggle`}
          onClick={() => setExpanded((x) => !x)}
          isExpanded={expanded}
        />
        <DataListItemCells
          dataListCells={[
            <DataListCell key={`${name}-list-name`}>
              <DescriptionList key="name">
                <DescriptionListGroup>
                  <DescriptionListTerm className="component-list-item__name">
                    {name}
                  </DescriptionListTerm>
                  <DescriptionListDescription>
                    Source:{' '}
                    <ExternalLink
                      href={
                        component.spec.source?.git?.url ||
                        (component.spec.containerImage.includes('http')
                          ? component.spec.containerImage
                          : `https://${component.spec.containerImage}`)
                      }
                      text={component.spec.source?.git?.url || component.spec.containerImage}
                    />
                  </DescriptionListDescription>
                </DescriptionListGroup>
              </DescriptionList>
            </DataListCell>,
            condition ? (
              <DataListCell key={`${name}-component-status`} alignRight>
                <Tooltip content={condition.message}>
                  <span>{getConditionStatus(condition)}</span>
                </Tooltip>
              </DataListCell>
            ) : null,
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
              <DescriptionListTermHelpText>
                <DescriptionListTermHelpTextButton>
                  CPU/Mem Requests
                </DescriptionListTermHelpTextButton>
              </DescriptionListTermHelpText>
              <DescriptionListDescription>
                {`${resourceRequests.cpu}, ${resourceRequests.memory}`}
              </DescriptionListDescription>
            </DescriptionListGroup>
          )}
          {replicas && (
            <DescriptionListGroup>
              <DescriptionListTermHelpText>
                <DescriptionListTermHelpTextButton>Replicas</DescriptionListTermHelpTextButton>
              </DescriptionListTermHelpText>
              <DescriptionListDescription>{replicas}</DescriptionListDescription>
            </DescriptionListGroup>
          )}
          {targetPort && (
            <DescriptionListGroup>
              <DescriptionListTermHelpText>
                <DescriptionListTermHelpTextButton>Target Port</DescriptionListTermHelpTextButton>
              </DescriptionListTermHelpText>
              <DescriptionListDescription>{targetPort}</DescriptionListDescription>
            </DescriptionListGroup>
          )}
          {componentRouteWebURL && (
            <DescriptionListGroup>
              <DescriptionListTermHelpText>
                <DescriptionListTermHelpTextButton>Route</DescriptionListTermHelpTextButton>
              </DescriptionListTermHelpText>
              <DescriptionListDescription>
                <ExternalLink href={componentRouteWebURL} text={componentRouteWebURL} />
              </DescriptionListDescription>
            </DescriptionListGroup>
          )}
          {containerImage && (
            <DescriptionListGroup>
              <DescriptionListTermHelpText>
                <DescriptionListTermHelpTextButton>
                  Built container image
                </DescriptionListTermHelpTextButton>
              </DescriptionListTermHelpText>
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
