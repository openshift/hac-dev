import * as React from 'react';
import {
  Button,
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
  DescriptionListTermHelpText,
  DescriptionListTermHelpTextButton,
  Flex,
  FlexItem,
  Tooltip,
} from '@patternfly/react-core';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/js/icons/exclamation-circle-icon';
import { global_palette_red_100 as redColor } from '@patternfly/react-tokens/dist/js/global_palette_red_100';
import { useLatestPipelineRunForComponent } from '../../hooks/usePipelineRunsForApplication';
import { pipelineRunFilterReducer } from '../../shared';
import ActionMenu from '../../shared/components/action-menu/ActionMenu';
import ExternalLink from '../../shared/components/links/ExternalLink';
import { ComponentKind, RouteKind, ResourceStatusCondition } from '../../types';
import { getConditionForResource } from '../../utils/common-utils';
import { getBuildStatusIcon } from '../../utils/gitops-utils';
import { getComponentRouteWebURL } from '../../utils/route-utils';
import './ComponentListItem.scss';
import { useBuildLogViewerModal } from '../LogViewer/BuildLogViewer';
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
  }
  return null;
};

export const ComponentListItem: React.FC<ComponentListViewPageProps> = ({ component, routes }) => {
  const [expanded, setExpanded] = React.useState(false);
  const { replicas, targetPort, resources } = component.spec;
  const name = component.metadata.name;
  const buildLogsModal = useBuildLogViewerModal(component);
  const actions = useComponentActions(component, name);
  const pipelineRun = useLatestPipelineRunForComponent(component);
  const status = pipelineRunFilterReducer(pipelineRun);
  const resourceRequests = resources?.requests;
  const containerImage = component.status?.containerImage;
  const componentRouteWebURL = routes?.length > 0 && getComponentRouteWebURL(routes, name);
  const condition = getConditionForResource<ComponentKind>(component);

  const isContainerImage = !component.spec.source?.git?.url;

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
            <DataListCell key="name">
              <Flex direction={{ default: 'column' }}>
                <FlexItem data-testid="component-list-item">
                  <b>{name}</b>
                </FlexItem>
                <FlexItem>
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
            <DataListCell key="build" alignRight>
              <Flex direction={{ default: 'column' }}>
                {pipelineRun && (
                  <FlexItem align={{ default: 'alignRight' }}>
                    {getBuildStatusIcon(status)} Build {status}
                  </FlexItem>
                )}
                {!isContainerImage && (
                  <FlexItem align={{ default: 'alignRight' }}>
                    <Button
                      onClick={buildLogsModal}
                      variant="link"
                      data-testid={`view-build-logs-${component.metadata.name}`}
                      isInline
                    >
                      View logs
                    </Button>
                  </FlexItem>
                )}
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
                <DescriptionListTermHelpTextButton>Instances</DescriptionListTermHelpTextButton>
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
