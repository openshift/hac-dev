import * as React from 'react';

// Check for a modified mouse event. For example - Ctrl + Click
export const isModifiedEvent = (event: React.MouseEvent<HTMLElement>) => {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
};

export const toTitleCase = (title: string): string =>
  title.charAt(0).toUpperCase() + title.substr(1);

export const pluralize = (
  count: number,
  singular: string,
  plural: string = `${singular}s`,
  titleCase: boolean = false,
): string => {
  const str = count > 1 ? plural : singular;
  return titleCase ? toTitleCase(str) : str;
};
