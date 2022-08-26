import * as React from 'react';
import { ExternalLinkAltIcon } from '@patternfly/react-icons/dist/esm/icons/external-link-alt-icon';
import {
  Decorator,
  DEFAULT_LAYER,
  DefaultNode,
  getDefaultShapeDecoratorCenter,
  Layer,
  Node,
  observer,
  ScaleDetailsLevel,
  TOP_LAYER,
  TopologyQuadrant,
  useHover,
  WithContextMenuProps,
  WithDragNodeProps,
  WithSelectionProps,
} from '@patternfly/react-topology';
import { useApplicationRoutes } from '../../../../hooks';
import catalogIcon from '../../../../imgs/catalog-icon.svg';
import { ApplicationGroupVersionKind } from '../../../../models';
import ExternalLink from '../../../../shared/components/links/ExternalLink';
import { routeDecoratorIcon } from '../../../../shared/utils/git-utils';
import { useNamespace } from '../../../../utils/namespace-context-utils';
import { getComponentRouteWebURL } from '../../../../utils/route-utils';

const SHOW_SOURCE_DECORATOR = false;
const DEFAULT_DECORATOR_RADIUS = 12;

type ComponentNodeProps = {
  element: Node;
} & Partial<WithSelectionProps> &
  Partial<WithDragNodeProps> &
  Partial<WithContextMenuProps>;

const ComponentNode: React.FC<ComponentNodeProps> = ({ element, contextMenuOpen, ...rest }) => {
  const namespace = useNamespace();
  const component = element.getData()?.component;
  const name = component.metadata.name;
  const applicationName = component.metadata?.ownerReferences?.find(
    (ref) => ref.kind === ApplicationGroupVersionKind.kind,
  )?.name;
  const [hover, hoverRef] = useHover();
  const icon = catalogIcon;
  const detailsLevel = element.getController().getGraph().getDetailsLevel();
  const showDetails = contextMenuOpen || detailsLevel !== ScaleDetailsLevel.low;
  const { width, height } = element.getDimensions();
  const [routes] = useApplicationRoutes(applicationName, namespace);

  const cx = width / 2;
  const cy = height / 2;
  const innerRadius = cx - 10;
  const iconRadius = innerRadius - 10;

  const sourceDecorator = React.useMemo(() => {
    if (!SHOW_SOURCE_DECORATOR) {
      return null;
    }

    const { x, y } = getDefaultShapeDecoratorCenter(TopologyQuadrant.lowerRight, element);
    const url =
      component.spec.source?.git?.url ||
      (component.spec.containerImage.includes('http')
        ? component.spec.containerImage
        : `https://${component.spec.containerImage}`);

    if (!url) {
      return null;
    }

    const sourceIcon = routeDecoratorIcon(url);
    return (
      <Decorator
        x={x}
        y={y}
        radius={DEFAULT_DECORATOR_RADIUS}
        showBackground
        icon={<ExternalLink href={url} text={sourceIcon} />}
      />
    );
  }, [component.spec.containerImage, component.spec.source?.git?.url, element]);

  const routeDecorator = React.useMemo(() => {
    const componentRouteWebURL = routes?.length > 0 && getComponentRouteWebURL(routes, name);

    if (!componentRouteWebURL) {
      return null;
    }

    const { x, y } = getDefaultShapeDecoratorCenter(TopologyQuadrant.upperRight, element);

    return (
      <Decorator
        x={x}
        y={y}
        radius={DEFAULT_DECORATOR_RADIUS}
        showBackground
        icon={
          <ExternalLink href={componentRouteWebURL} text={<ExternalLinkAltIcon title="Route" />} />
        }
      />
    );
  }, [element, name, routes]);

  return (
    <Layer id={hover || contextMenuOpen ? TOP_LAYER : DEFAULT_LAYER}>
      <g
        ref={hoverRef}
        data-test-id={element.getLabel()}
        data-testid="application-environment-component-node"
      >
        <DefaultNode
          element={element}
          scaleNode={(hover || contextMenuOpen) && detailsLevel !== ScaleDetailsLevel.high}
          contextMenuOpen={contextMenuOpen}
          showStatusBackground={!showDetails}
          attachments={
            <>
              {routeDecorator}
              {sourceDecorator}
            </>
          }
          {...rest}
        >
          <g data-test-id="base-node-handler">
            {icon && showDetails && (
              <>
                <circle
                  fill="var(--pf-global--palette--white)"
                  cx={cx}
                  cy={cy}
                  r={innerRadius + 6}
                />
                <image
                  x={cx - iconRadius}
                  y={cy - iconRadius}
                  width={iconRadius * 2}
                  height={iconRadius * 2}
                  xlinkHref={icon}
                />
              </>
            )}
          </g>
        </DefaultNode>
      </g>
    </Layer>
  );
};

export default observer(ComponentNode);
