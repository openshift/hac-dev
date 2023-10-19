import React from 'react';
import { Drawer, DrawerContent, DrawerPanelContent } from '@patternfly/react-core';
import SidePanelContext, { SidePanelProps } from './SidePanelContext';

const SidePanelHost: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  const [props, setProps] = React.useState<SidePanelProps>({ isExpanded: false, isInline: true });
  const propsRef = React.useRef(props);
  propsRef.current = props;

  const close = React.useCallback(() => {
    setProps({ ...propsRef.current, isExpanded: false, minSize: 300 });
  }, []);

  const panelContent = (
    <DrawerPanelContent
      isResizable
      defaultSize={
        typeof props.defaultSize === 'number' ? `${props.defaultSize}px` : props.defaultSize
      }
      minSize={typeof props.minSize === 'number' ? `${props.minSize}px` : props.minSize}
    >
      {props.children}
    </DrawerPanelContent>
  );

  return (
    <SidePanelContext.Provider value={{ setProps, close }}>
      <Drawer isExpanded={props.isExpanded} isInline={props.isInline} onExpand={props.onExpand}>
        <DrawerContent panelContent={panelContent}>{children}</DrawerContent>
      </Drawer>
    </SidePanelContext.Provider>
  );
};

export default SidePanelHost;
