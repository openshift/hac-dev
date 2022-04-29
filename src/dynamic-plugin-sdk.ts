/* eslint-disable */
import * as React from 'react';
import isEqual from 'lodash/isEqual';
import { useDeepCompareMemoize } from './shared';
import {
  k8sListResourceItems,
  k8sGetResource,
  K8sResourceCommon,
} from '@openshift/dynamic-plugin-sdk-utils';

const HOOK_POLL_DELAY = 10000; // change this if you want the useHook to go faster / slower on polls

/* ---------------- *
 *  Internal Types  *
 * ---------------- */
enum Operator {
  Exists = 'Exists',
  DoesNotExist = 'DoesNotExist',
  In = 'In',
  NotIn = 'NotIn',
  Equals = 'Equals',
  NotEqual = 'NotEqual',
  GreaterThan = 'GreaterThan',
  LessThan = 'LessThan',
  NotEquals = 'NotEquals',
}
type MatchExpression = {
  key: string;
  operator: Operator | string;
  values?: string[];
  value?: string;
};
type MatchLabels = {
  [key: string]: string;
};
type Selector = {
  matchLabels?: MatchLabels;
  matchExpressions?: MatchExpression[];
};


/* ---------------- *
 *  External Types  *
 * ---------------- */
export type K8sGroupVersionKind = { group?: string; version: string; kind: string };
export type WatchK8sResource = {
  groupVersionKind?: K8sGroupVersionKind;
  name?: string;
  namespace?: string;
  isList?: boolean;
  selector?: Selector;
  namespaced?: boolean;
  limit?: number;
  fieldSelector?: string;
  optional?: boolean;
};
export type WatchK8sResult<R extends K8sResourceCommon | K8sResourceCommon[]> = [R, boolean, any];

/* ------------------ *
 *  Internal Methods  *
 * ------------------ */

/**
* Temporary workaround to use the correct plural form for kinds
*/
const getPlural = (kind: string) => {
  const kindsLookupTable = { ComponentDetectionQuery: 'ComponentDetectionQueries' };
  const pluralKind = kindsLookupTable[kind] || kind + 's';
  return pluralKind.toLowerCase();
}

/**
 * This makes an assumption that the model will have a plural of `${kind}s` -- which is obv not ideal.
 * Without apiDiscovery & the hook interface being sorta fixed, our options are limited.
 */
const makeGetCall = (resourceData: WatchK8sResource) => (
  resourceData.groupVersionKind &&
    k8sGetResource({
      model: {
        apiVersion: resourceData.groupVersionKind.version,
        apiGroup: resourceData.groupVersionKind.group,
        kind: resourceData.groupVersionKind.kind,
        // TODO: no dictionary... solution?
        plural: getPlural(resourceData.groupVersionKind.kind),
      },
      queryOptions: {
        name: resourceData.name,
        ns: resourceData.namespace,
      }
    })
);
/**
 * This makes an assumption that the model will have a plural of `${kind}s` -- which is obv not ideal.
 * Without apiDiscovery & the hook interface being sorta fixed, our options are limited.
 */
const makeListCall = (resourceData: WatchK8sResource) => (
  resourceData.groupVersionKind &&
  k8sListResourceItems({
      model: {
        apiVersion: resourceData.groupVersionKind.version,
        apiGroup: resourceData.groupVersionKind.group,
        kind: resourceData.groupVersionKind.kind,
        // TODO: no dictionary... solution?
        plural: getPlural(resourceData.groupVersionKind.kind),
      },
      queryOptions: {
        ns: resourceData.namespace,
      },
  })
);

const useForceRender = () => React.useReducer((s: boolean) => !s, false)[1] as VoidFunction;

/* ------------------ *
 *  External Methods  *
 * ------------------ */


/**
 * Watch a resource -- works on a fixed delay poll today.
 */
export const useK8sWatchResource = <R extends K8sResourceCommon | K8sResourceCommon[]>(initResource: WatchK8sResource): WatchK8sResult<R> => {
  const resource = useDeepCompareMemoize(initResource, true);
  const resourceRef = React.useRef<R | null>(null);
  const [fetched, setFetched] = React.useState<boolean>(false);
  const [error, setError] = React.useState<Error | null>(null);
  const reRender = useForceRender();

  React.useEffect(() => {
    const addPromiseFollowups = (promise) => {
      promise
        ?.then((data) => {
          if (data.kind === 'Status') {
            if (resourceRef.current !== null) {
              resourceRef.current = null;
              reRender();
            }
          } else if (!isEqual(resourceRef.current, data)) {
            resourceRef.current = data;
            reRender();
          }
          setFetched(true);
        })
        .catch((err) => {
          setError(err);
          setFetched(false);
        });
    };
    const makeTheCall = (r) => r.isList ? makeListCall(r) : makeGetCall(r);

    addPromiseFollowups(makeTheCall(resource));
    const intervalId = setInterval(() => {
      addPromiseFollowups(makeTheCall(resource));
    }, HOOK_POLL_DELAY);
    return () => {
      clearInterval(intervalId);
    }
  }, [resource, setFetched]);

  return [resourceRef.current, fetched, error];
};
