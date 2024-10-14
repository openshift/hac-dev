import React from 'react';
import {
  useK8sWatchResources,
  WatchK8sResource,
  Selector,
  MatchExpression,
  WatchK8sResult,
  K8sResourceCommon,
} from '@openshift/dynamic-plugin-sdk-utils';
import { chunk, isEqual } from 'lodash-es';

export const chunkMatchExpressions = (selector: Selector, key: string, maxChunkSize = 25) => {
  if (!selector?.matchExpressions) {
    return [selector];
  }

  if (!selector.matchExpressions.some((expr) => expr.key === key)) {
    return [selector];
  }

  const expressionToChunk = selector.matchExpressions.find((expr) => expr.key === key);
  if (expressionToChunk.values?.length < maxChunkSize) {
    return [selector];
  }

  return chunk(expressionToChunk.values, maxChunkSize).map((values) => {
    const chunkedMatchExpressions: MatchExpression[] = selector.matchExpressions.map((expr) =>
      expr === expressionToChunk ? { ...expr, values } : expr,
    );

    return {
      ...selector,
      matchExpressions: chunkedMatchExpressions,
    };
  });
};

export const useChunkedK8SWatchResources = <R extends K8sResourceCommon>(
  resources: Record<string, WatchK8sResource>,
): WatchK8sResult<R | R[]> => {
  const watchedResources = useK8sWatchResources(resources);

  const [allValues, setAllValues] = React.useState<R[]>([]);
  const [allLoaded, setAllLoaded] = React.useState<boolean>(false);
  const [allErrors, setAllErrors] = React.useState<Error[]>([]);

  React.useEffect(() => {
    const values: R[] = [];
    const loadedArray = [];
    const errors = [];

    Object.keys(watchedResources).forEach((key) => {
      const resource = watchedResources[key];
      if (resource) {
        const { data, loaded, loadError } = resource;

        if (loadError) {
          errors.push(loadError);
        }

        if (loaded) {
          Array.isArray(data) ? values.concat(data as R[]) : values.push(data as R);
        }

        loadedArray.push(loaded);
      }
    });

    const isLoaded = loadedArray.every((loaded) => loaded);

    // Update when state changes
    if (!isEqual([allValues, allLoaded, allErrors], [values, isLoaded, errors])) {
      setAllValues(values);
      setAllLoaded(isLoaded);
      setAllErrors(errors);
    }
  }, [watchedResources, allValues, allLoaded, allErrors]);

  return [allValues, allLoaded, allErrors?.[0]];
};
