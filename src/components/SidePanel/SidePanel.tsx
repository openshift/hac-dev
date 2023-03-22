import React from 'react';
import SidePanelContext, { SidePanelProps } from './SidePanelContext';

const SidePanel: React.FC<SidePanelProps> = ({
  isExpanded,
  isInline,
  onExpand,
  defaultSize,
  minSize,
  children,
}) => {
  const { close, setProps } = React.useContext(SidePanelContext);

  React.useEffect(
    () => () => close(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  React.useEffect(() => {
    setProps({ isExpanded, isInline, onExpand, defaultSize, children, minSize });
  }, [setProps, isExpanded, isInline, onExpand, defaultSize, children, minSize]);

  return null;
};

export default SidePanel;
