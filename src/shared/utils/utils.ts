import * as React from 'react';

// Check for a modified mouse event. For example - Ctrl + Click
export const isModifiedEvent = (event: React.MouseEvent<HTMLElement>) => {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
};
