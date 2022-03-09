import * as React from 'react';
import {
  DataListAction,
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
} from '@patternfly/react-core';
import ActionMenu from '../../shared/components/action-menu/ActionMenu';
import ExternalLink from '../../shared/components/links/ExternalLink';
import { ComponentKind, RouteKind } from '../../types';
import { deleteComponent } from '../../utils/delete-utils';
import { getComponentRouteWebURL } from '../../utils/route-utils';

import './ComponentListItem.scss';

type ComponentListViewPageProps = {
  component: ComponentKind;
  routes: RouteKind[];
};

export const ComponentListItem: React.FC<ComponentListViewPageProps> = ({ component, routes }) => {
  const [expanded, setExpanded] = React.useState(false);
  const { replicas, targetPort, resources } = component.spec;
  const name = component.metadata.name;
  const resourceRequests = resources?.requests;
  const containerImage = component.status?.containerImage;
  const componentRouteWebURL = routes?.length > 0 && getComponentRouteWebURL(routes, name);

  return (
    <DataListItem aria-label={name} isExpanded={expanded} data-testid="component-list-item">
      <DataListItemRow>
        <DataListToggle id={name} onClick={() => setExpanded((x) => !x)} isExpanded={expanded} />
        <DataListItemCells
          dataListCells={[
            <DescriptionList key="name">
              <DescriptionListGroup>
                <DescriptionListTerm className="hacDev-component-list-item__name">
                  {name}
                </DescriptionListTerm>
                <DescriptionListDescription>
                  Code Repo:{' '}
                  <ExternalLink
                    href={component.spec.source.git.url}
                    text={component.spec.source.git.url}
                  />
                </DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>,
          ]}
        />
        <DataListAction
          aria-labelledby={`${name.toLowerCase()}-actions`}
          data-testid={`${name.toLowerCase()}-actions`}
          id={`${name.toLowerCase()}-actions`}
          aria-label={`${name.toLowerCase()}-actions`}
          isPlainButtonAction
        >
          <ActionMenu
            actions={[
              {
                cta: () => {
                  deleteComponent(name, component.metadata.namespace);
                },
                id: `delete-${name.toLowerCase()}`,
                label: 'Delete',
              },
            ]}
          />
        </DataListAction>
      </DataListItemRow>
      <DataListContent
        className="hacDev-component-list-item__details"
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
