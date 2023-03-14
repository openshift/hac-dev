import React from 'react';

export type SidePanelProps = {
  isExpanded?: boolean;
  children?: React.ReactNode;
  isInline?: boolean;
  onExpand?: () => void;
};

export type SidePanelContextValue = {
  setProps: (props: SidePanelProps) => void;
  close: () => void;
};

export default React.createContext<SidePanelContextValue>({
  setProps: () => {},
  close: () => {},
});
