import React from 'react';
import SidePanelContext, { SidePanelProps } from './SidePanelContext';

const SidePanel: React.FC<SidePanelProps> = ({
  isExpanded,
  isInline,
  onExpand,
  defaultSize,
  children,
}) => {
  const { close, setProps } = React.useContext(SidePanelContext);

  React.useEffect(
    () => () => close(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  React.useEffect(() => {
    setProps({ isExpanded, isInline, onExpand, defaultSize, children });
  }, [setProps, isExpanded, isInline, onExpand, defaultSize, children]);

  return null;
};

export default SidePanel;
