/* eslint-disable */
import * as React from 'react';
import * as _ from 'lodash';
import { HttpError } from './shared/utils/error/http-error';
import { useDeepCompareMemoize } from './shared';
import {
  k8sListResourceItems,
  k8sGetResource,
  K8sResourceCommon,
} from '@openshift/dynamic-plugin-sdk-utils';

const HOOK_POLL_DELAY = 10000; // change this if you want the useHook to go faster / slower on polls

/* throw away fetch methods */

export const validateStatus = async (
  response: Response
) => {
  if (response.ok) {
    return response;
  }

  if (response.status === 401) {
    throw new HttpError('Invalid token. Are you working with Prod SSO token?', response.status, response);
  }

  const contentType = response.headers.get('content-type');
  if (!contentType || contentType.indexOf('json') === -1) {
    throw new HttpError(response.statusText, response.status, response);
  }

  if (response.status === 403) {
    return response.json().then((json) => {
      throw new HttpError(
        json.message || 'Access denied due to cluster policy.',
        response.status,
        response,
        json,
      );
    });
  }

  return response.json().then((json) => {
    const cause = json.details?.causes?.[0];
    let reason;
    if (cause) {
      reason = `Error "${cause.message}" for field "${cause.field}".`;
    }
    if (!reason) {
      reason = json.message;
    }
    if (!reason) {
      reason = json.error;
    }
    if (!reason) {
      reason = response.statusText;
    }

    throw new HttpError(reason, response.status, response, json);
  });
};

export const consoleFetchText = async (url: string, options: RequestInit = {}, timeout?: number) => {
  const response = await innerFetch(url, 'GET', options);
  const text = await response.text();
  const isPlainText = response.headers.get('Content-Type') === 'text/plain';
  if (!text) {
    return isPlainText ? '' : {};
  }
  return isPlainText || !response.ok ? text : JSON.parse(text);
};

const innerFetch = async (url, method, options) => {
    // Grab the token out of the cookie for ConsoleDot | if not proxying to prod, token will be invalid even if it is there
    const cookieToken = document.cookie.split('; ').find((val) => val.startsWith('cs_jwt='));
    if (!cookieToken) {
      return Promise.reject('Could not make k8s call. Unable to find token.');
    }
    const [,token] = cookieToken.split('=');
  
    const allOptions = _.defaultsDeep({}, { method, headers: {} }, options);
    allOptions.headers.Authorization = `Bearer ${token}`;
    return fetch(url, allOptions);
};

const commonFetch = async (url, method, options, timeout): Promise<any> => {
  const allOptions = _.defaultsDeep({}, options, { headers: { Accept: 'application/json' } });
  try {
    const response = await innerFetch(url, method, allOptions).then(validateStatus);
    const json = await response.json();
    return Promise.resolve(json);
  } catch(e) {
    return Promise.reject(e);
  }
};

const consoleFetchSendJSON = (
  url: string,
  method: string,
  json = null,
  options: RequestInit = {},
  timeout: number,
) => {
  const allOptions: Record<string, any> = {
    headers: {
      Accept: 'application/json',
      'Content-Type': `application/${
        method === 'PATCH' ? 'json-patch+json' : 'json'
      };charset=UTF-8`,
    },
  };
  if (json) {
    allOptions.body = JSON.stringify(json);
  }
  return commonFetch(url, method, _.defaultsDeep(allOptions, options), timeout);
};

export const coFetchJSON = (...args) => commonFetch.apply(undefined, args);
coFetchJSON.post = (url, json) => consoleFetchSendJSON(url, 'POST', json, undefined, undefined);
coFetchJSON.put = (url, json) => consoleFetchSendJSON(url, 'PUT', json, undefined, undefined);
coFetchJSON.patch = (url, json) => consoleFetchSendJSON(url, 'PATCH', json, undefined, undefined);
coFetchJSON.delete = (url, json, options) => consoleFetchSendJSON(url, 'DELETE', json, options, undefined);

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
        plural: resourceData.groupVersionKind.kind.toLowerCase() + 's',
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
        plural: resourceData.groupVersionKind.kind.toLowerCase() + 's',
      },
      ...resourceData.namespace
        ? {
            queryParams: {
              ns: resourceData.namespace,
            }
          }
        : {},
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
          } else if (!_.isEqual(resourceRef.current, data)) {
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
