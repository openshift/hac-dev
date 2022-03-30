/* eslint-disable */
import * as React from 'react';
import isEqual from 'lodash/isEqual';
import { useDeepCompareMemoize } from './shared';
import {
  k8sListResourceItems,
  k8sGetResource,
  K8sResourceCommon,
  WebSocketFactory
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

type WSCallbacks = {
  onError?: (data: unknown) => void;
  onOpen?: (topic?: string) => void;
  onMessage?: (response: { type: string, object: unknown }, rawResponse?: string) => void;
  onClose?: (topic?: string) => void;
}
export type GetWsTopic = (path: string, callbacks: WSCallbacks, topic?: string) => void;


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
      queryOptions: {
        ns: resourceData.namespace,
      },
  })
);

const useForceRender = () => React.useReducer((s: boolean) => !s, false)[1] as VoidFunction;

const wsTopics = {};

export const getWsTopic: GetWsTopic = (path, { onError, onOpen, onMessage, onClose }, topic = 'default') => {
  let currWs = wsTopics[topic];
  if (!currWs) {
    let safePath = path;
    if (/^\/\//.test(path)) {
      // https://github.com/openshift/dynamic-plugin-sdk/pull/55
      safePath = path.slice(1);
    }
    currWs = new WebSocketFactory(topic, {
      path: safePath,
    });

    wsTopics[topic] = currWs;
  }

  currWs.onOpen(() => {
    if (!wsTopics[topic]) {
      wsTopics[topic] = currWs;
    }
    onOpen(topic)
  });
  currWs.onError(onError);
  currWs.onMessage((rawResponse) => {
    let data;
    try {
      if (typeof rawResponse === 'string') {
        data = JSON.parse(rawResponse);
      } else {
        data = rawResponse;
      }
    } catch (e) {
      throw new Error(`Websocket bad data. Name: ${e.name}, message: ${e.message}`);
    }
    onMessage(data, rawResponse);
  });
  currWs.onClose(() => {
    delete wsTopics[topic];
    onClose(topic)
  });
}

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
