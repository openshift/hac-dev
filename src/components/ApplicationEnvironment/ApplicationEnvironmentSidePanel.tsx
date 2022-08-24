import * as React from 'react';
import {
  Bullseye,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  DrawerActions,
  DrawerCloseButton,
  DrawerPanelBody,
  Flex,
  FlexItem,
  Spinner,
} from '@patternfly/react-core';
import { TopologySideBar } from '@patternfly/react-topology';
import { useApplicationRoutes } from '../../hooks';
import { ApplicationGroupVersionKind } from '../../models';
import ExternalLink from '../../shared/components/links/ExternalLink';
import { ComponentKind } from '../../types';
import { useNamespace } from '../../utils/namespace-context-utils';
import { getComponentRouteWebURL } from '../../utils/route-utils';
import ApplicationEnvironmentRevisionLink from './ApplicationEnvironmentRevisionLink';
import SidePanelActionMenu from './SidePanelActionMenu';

import './ApplicationEnvironmentSidePanel.scss';

type EnvironmentSidePanelProps = {
  component: ComponentKind;
  onClose: () => void;
};

const ApplicationEnvironmentSidePanel: React.FC<EnvironmentSidePanelProps> = ({
  component,
  onClose,
}) => {
  const { resources, replicas } = component.spec;
  const namespace = useNamespace();
  const applicationName = component.metadata?.ownerReferences?.find(
    (ref) => ref.kind === ApplicationGroupVersionKind.kind,
  )?.name;
  const name = component.metadata.name;
  const resourceRequests = resources?.requests;
  const containerImage = component.status?.containerImage;
  const [routes, routesLoaded] = useApplicationRoutes(applicationName, namespace);
  const componentRouteWebURL = routes?.length > 0 && getComponentRouteWebURL(routes, name);

  return (
    <TopologySideBar
      resizable
      className="application-environment-details__component-side-panel pf-topology-side-bar-resizable"
    >
      <DrawerActions>
        <DrawerCloseButton onClick={onClose} />
      </DrawerActions>
      <div className="application-environment-details__component-side-panel__header">
        <h1 className="application-environment-details__component-side-panel__header-heading">
          <div className="application-environment-details__component-side-panel__name">{name}</div>
          <div className="application-environment-details__component-side-panel__actions">
            <SidePanelActionMenu component={component} />
          </div>
        </h1>
      </div>
      <DrawerPanelBody>
        <DescriptionList
          columnModifier={{
            default: '1Col',
          }}
        >
          {routesLoaded ? (
            <>
              {componentRouteWebURL && (
                <DescriptionListGroup>
                  <DescriptionListTerm>Route</DescriptionListTerm>
                  <DescriptionListDescription>
                    <ExternalLink href={componentRouteWebURL} text={componentRouteWebURL} />
                  </DescriptionListDescription>
                </DescriptionListGroup>
              )}
            </>
          ) : (
            <DescriptionListGroup>
              <DescriptionListTerm>Route</DescriptionListTerm>
              <DescriptionListDescription>
                <Bullseye>
                  <Spinner size="md" />
                </Bullseye>
              </DescriptionListDescription>
            </DescriptionListGroup>
          )}
          <DescriptionListGroup>
            <DescriptionListTerm>Revision</DescriptionListTerm>
            <DescriptionListDescription>
              <ApplicationEnvironmentRevisionLink component={component} />
            </DescriptionListDescription>
          </DescriptionListGroup>
          {containerImage && (
            <DescriptionListGroup>
              <DescriptionListTerm>Image</DescriptionListTerm>
              <DescriptionListDescription>
                <ExternalLink href={`https://${containerImage}`} text={containerImage} />
              </DescriptionListDescription>
            </DescriptionListGroup>
          )}
          {resourceRequests && (
            <DescriptionListGroup>
              <Flex spaceItems={{ default: 'spaceItems4xl' }}>
                <FlexItem>
                  <DescriptionListTerm>CPU</DescriptionListTerm>
                  <DescriptionListDescription>{resourceRequests.cpu}</DescriptionListDescription>
                </FlexItem>
                <FlexItem>
                  <DescriptionListTerm>Memory</DescriptionListTerm>
                  <DescriptionListDescription>{resourceRequests.memory}</DescriptionListDescription>
                </FlexItem>
              </Flex>
            </DescriptionListGroup>
          )}
          {replicas !== undefined && (
            <DescriptionListGroup>
              <DescriptionListTerm>Instances</DescriptionListTerm>
              <DescriptionListDescription>{replicas}</DescriptionListDescription>
            </DescriptionListGroup>
          )}
          {resourceRequests && (
            <DescriptionListGroup>
              <DescriptionListTerm>Code repository</DescriptionListTerm>
              <DescriptionListDescription>
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
          )}
        </DescriptionList>
      </DrawerPanelBody>
    </TopologySideBar>
  );
};

export default ApplicationEnvironmentSidePanel;
