import { gridItemSpanValueShape } from '@patternfly/react-core';
import fill from 'lodash/fill';

export const getSpans = (totalFieldCount: gridItemSpanValueShape): gridItemSpanValueShape[] => {
  const spans: gridItemSpanValueShape[] = fill(
    Array(totalFieldCount),
    Math.trunc(12 / totalFieldCount),
  ) as gridItemSpanValueShape[];

  let remainder = 12 % totalFieldCount;

  while (remainder--) {
    spans[remainder]++;
  }

  return spans;
};
