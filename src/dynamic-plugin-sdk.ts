/* eslint-disable */
import * as React from 'react';
import * as _ from 'lodash';

/* throw away fetch methods */
const k8sBasePath = `/api/k8s`; // webpack proxy path

const commonFetch = async (url, method, options, timeout): Promise<any> => {
  // Grab the token out of the cookie for ConsoleDot | if not proxying to prod, token will be invalid even if it is there
  const cookieToken = document.cookie.split('; ').find((val) => val.startsWith('cs_jwt='));
  if (!cookieToken) {
    return Promise.reject('Could not make k8s call. Unable to find token.');
  }
  const [,token] = cookieToken.split('=');

  const allOptions = _.defaultsDeep({ method }, options, { headers: { Accept: 'application/json' } });
  allOptions.headers.Authorization = `Bearer ${token}`;
  try {
    const response = await fetch(url, allOptions);
    if (response.status === 401) {
      return Promise.reject('Invalid token. Are you working with Prod SSO token?');
    }
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

const coFetchJSON = (...args) => commonFetch.apply(undefined, args);
coFetchJSON.post = (url, json) => consoleFetchSendJSON(url, 'POST', json, undefined, undefined);
coFetchJSON.put = (url, json) => consoleFetchSendJSON(url, 'PUT', json, undefined, undefined);
coFetchJSON.patch = (url, json) => consoleFetchSendJSON(url, 'PATCH', json, undefined, undefined);
coFetchJSON.delete = (url, json, options) => consoleFetchSendJSON(url, 'DELETE', json, options, undefined);

/* ---------------- *
 *  Internal Types  *
 * ---------------- */
type Patch = {
  op: string;
  path: string;
  value?: any;
};
type QueryParams = {
  watch?: string;
  labelSelector?: string;
  fieldSelector?: string;
  resourceVersion?: string;
  [key: string]: string;
};
type Options = {
  ns?: string;
  name?: string;
  path?: string;
  queryParams?: QueryParams;
};
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
type OwnerReference = {
  name: string;
  kind: string;
  uid: string;
  apiVersion: string;
  controller?: boolean;
  blockOwnerDeletion?: boolean;
};
type ObjectMetadata = {
  annotations?: { [key: string]: string };
  clusterName?: string;
  creationTimestamp?: string;
  deletionGracePeriodSeconds?: number;
  deletionTimestamp?: string;
  finalizers?: string[];
  generateName?: string;
  generation?: number;
  labels?: { [key: string]: string };
  managedFields?: any[];
  name?: string;
  namespace?: string;
  ownerReferences?: OwnerReference[];
  resourceVersion?: string;
  uid?: string;
};


/* ---------------- *
 *  External Types  *
 * ---------------- */
export type K8sResourceCommon = {
  apiVersion?: string;
  kind?: string;
  metadata?: ObjectMetadata;
};
export type K8sModel = {
  abbr: string;
  kind: string;
  label: string;
  labelKey?: string;
  labelPlural: string;
  labelPluralKey?: string;
  plural: string;
  propagationPolicy?: 'Foreground' | 'Background';

  id?: string;
  crd?: boolean;
  apiVersion: string;
  apiGroup?: string;
  namespaced?: boolean;
  selector?: Selector;
  labels?: { [key: string]: string };
  annotations?: { [key: string]: string };
  // verbs?: K8sVerb[];
  shortNames?: string[];
  // badge?: BadgeType;
  color?: string;

  // Legacy option for supporing plural names in URL paths when `crd: true`.
  // This should not be set for new models, but is needed to avoid breaking
  // existing links as we transition to using the API group in URL paths.
  legacyPluralURL?: boolean;
};
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
const getK8sResourcePath = (model: K8sModel, options: Options): string => {
  let u = getK8sAPIPath(model);

  if (options.ns) {
    u += `/namespaces/${options.ns}`;
  }
  u += `/${model.plural}`;
  if (options.name) {
    // Some resources like Users can have special characters in the name.
    u += `/${encodeURIComponent(options.name)}`;
  }
  if (options.path) {
    u += `/${options.path}`;
  }
  if (!_.isEmpty(options.queryParams)) {
    const q = _.map(options.queryParams, function(v, k) {
      return `${k}=${v}`;
    });
    u += `?${q.join('&')}`;
  }

  return u;
};
const getK8sAPIPath = ({ apiGroup = 'core', apiVersion }: K8sModel): string => {
  const isLegacy = apiGroup === 'core' && apiVersion === 'v1';
  let p = isLegacy ? '/api/' : '/apis/';

  if (!isLegacy && apiGroup) {
    p += `${apiGroup}/`;
  }

  p += apiVersion;
  return p;
};
const resourceURL = (model: K8sModel, options: Options): string =>
  `${k8sBasePath}${getK8sResourcePath(model, options)}`;
const adapterFunc = (func: Function, knownArgs: string[]) => {
  return (options: Record<string, any>) => {
    const args = knownArgs.map((arg) => {
      // forming opts to match underlying API signature if it's there in knownArgs
      if (arg === 'opts') {
        const { name, ns, path, queryParams } = options || {};
        return {
          ...(name && { name }),
          ...(ns && { ns }),
          ...(path && { path }),
          ...(queryParams && { queryParams }),
        };
      }
      return options[arg];
    });
    return func(...args);
  };
};
const toArray = (value) => (Array.isArray(value) ? value : [value]);
const requirementToString = (requirement: MatchExpression): string => {
  if (requirement.operator === 'Equals') {
    return `${requirement.key}=${requirement.values[0]}`;
  }

  if (requirement.operator === 'NotEquals') {
    return `${requirement.key}!=${requirement.values[0]}`;
  }

  if (requirement.operator === 'Exists') {
    return requirement.key;
  }

  if (requirement.operator === 'DoesNotExist') {
    return `!${requirement.key}`;
  }

  if (requirement.operator === 'In') {
    return `${requirement.key} in (${toArray(requirement.values).join(',')})`;
  }

  if (requirement.operator === 'NotIn') {
    return `${requirement.key} notin (${toArray(requirement.values).join(',')})`;
  }

  if (requirement.operator === 'GreaterThan') {
    return `${requirement.key} > ${requirement.values[0]}`;
  }

  if (requirement.operator === 'LessThan') {
    return `${requirement.key} < ${requirement.values[0]}`;
  }

  return '';
};
const createEquals = (key: string, value: string): MatchExpression => ({
  key,
  operator: 'Equals',
  values: [value],
});
const isOldFormat = (selector: Selector | MatchLabels) =>
  !selector.matchLabels && !selector.matchExpressions;
const toRequirements = (selector: Selector = {}): MatchExpression[] => {
  const requirements = [];
  const matchLabels = isOldFormat(selector) ? selector : selector.matchLabels;
  const { matchExpressions } = selector;

  Object.keys(matchLabels || {})
    .sort()
    .forEach(function(k) {
      requirements.push(createEquals(k, matchLabels[k]));
    });

  (matchExpressions || []).forEach(function(me) {
    requirements.push(me);
  });

  return requirements;
};
const selectorToString = (selector: Selector): string => {
  const requirements = toRequirements(selector);
  return requirements.map(requirementToString).join(',');
};

const k8sGet = (
  model: K8sModel,
  name: string,
  ns?: string,
  opts?: Options,
  requestInit?: RequestInit,
) => coFetchJSON(resourceURL(model, Object.assign({ ns, name }, opts)), 'GET', requestInit);
const k8sCreate = <R extends K8sResourceCommon>(
  model: K8sModel,
  data: R,
  opts: Options = {},
) => {
  return coFetchJSON.post(
    resourceURL(model, Object.assign({ ns: data?.metadata?.namespace }, opts)),
    data,
  );
};
const k8sUpdate = <R extends K8sResourceCommon>(
  model: K8sModel,
  data: R,
  ns?: string,
  name?: string,
  opts?: Options,
): Promise<R> =>
  coFetchJSON.put(
    resourceURL(model, {
      ns: ns || data.metadata.namespace,
      name: name || data.metadata.name,
      ...opts,
    }),
    data,
  );
const k8sPatch = <R extends K8sResourceCommon>(
  model: K8sModel,
  resource: R,
  data: Patch[],
  opts: Options = {},
) => {
  const patches = _.compact(data);

  if (_.isEmpty(patches)) {
    return Promise.resolve(resource);
  }

  return coFetchJSON.patch(
    resourceURL(
      model,
      Object.assign(
        {
          ns: resource.metadata.namespace,
          name: resource.metadata.name,
        },
        opts,
      ),
    ),
    patches,
  );
};
const k8sKill = <R extends K8sResourceCommon>(
  model: K8sModel,
  resource: R,
  opts: Options = {},
  requestInit: RequestInit = {},
  json: Record<string, any> = null,
) => {
  const { propagationPolicy } = model;
  const jsonData =
    json ?? (propagationPolicy && { kind: 'DeleteOptions', apiVersion: 'v1', propagationPolicy });
  return coFetchJSON.delete(
    resourceURL(
      model,
      Object.assign({ ns: resource.metadata.namespace, name: resource.metadata.name }, opts),
    ),
    jsonData,
    requestInit,
  );
};
const k8sList = (
  model: K8sModel,
  queryParams: { [key: string]: any } = {},
  raw = false,
  requestInit: RequestInit = {},
) => {
  const query = _.map(_.omit(queryParams, 'ns'), (v, k) => {
    let newVal;
    if (k === 'labelSelector') {
      newVal = selectorToString(v);
    }
    return `${encodeURIComponent(k)}=${encodeURIComponent(newVal ?? v)}`;
  }).join('&');

  const listURL = resourceURL(model, { ns: queryParams.ns });
  return coFetchJSON(`${listURL}?${query}`, 'GET', requestInit).then((result) => {
    const typedItems = result.items?.map((i) => ({
      kind: model.kind,
      apiVersion: result.apiVersion,
      ...i,
    }));
    return raw ? { ...result, items: typedItems } : typedItems;
  });
};

/**
 * This makes an assumption that the model will have a plural of `${kind}s` -- which is obv not ideal.
 * Without apiDiscovery & the hook interface being sorta fixed, our options are limited.
 */
const makeGetCall = (initResource: WatchK8sResource) => (
  k8sGetResource({
    model: {
      apiVersion: initResource.groupVersionKind.version,
      apiGroup: initResource.groupVersionKind.group,
      kind: initResource.groupVersionKind.kind,
      // TODO: no dictionary... solution?
      plural: initResource.groupVersionKind.kind.toLowerCase() + 's',
    },
    name: initResource.name,
    ns: initResource.namespace,
  })
);

/* ------------------ *
 *  External Methods  *
 * ------------------ */

/**
 * It fetches a resource from the cluster, based on the provided options.
 * If the name is provided it returns one resource else it returns all the resources matching the model.
 * @param options Which are passed as key-value pairs in the map
 * @param options.model k8s model
 * @param options.name The name of the resource, if not provided then it'll look for all the resources matching the model.
 * @param options.ns The namespace to look into, should not be specified for cluster-scoped resources.
 * @param options.path Appends as subpath if provided
 * @param options.queryParams The query parameters to be included in the URL.
 * @param options.requestInit The fetch init object to use. This can have request headers, method, redirect, etc.
 * See more {@link https://microsoft.github.io/PowerBI-JavaScript/interfaces/_node_modules_typedoc_node_modules_typescript_lib_lib_dom_d_.requestinit.html}
 * @return A promise that resolves to the response as JSON object with a resource if the name is provided
 * else it returns all the resources matching the model. In case of failure, the promise gets rejected with HTTP error response.
 * * */
export const k8sGetResource = adapterFunc(k8sGet, ['model', 'name', 'ns', 'opts', 'requestInit']);

/**
 * It creates a resource in the cluster, based on the provided options.
 * @param options Which are passed as key-value pairs in the map
 * @param options.model k8s model
 * @param options.data payload for the resource to be created
 * @param options.path Appends as subpath if provided
 * @param options.queryParams The query parameters to be included in the URL.
 * @return A promise that resolves to the response of the resource created.
 * In case of failure promise gets rejected with HTTP error response.
 * * */
export const k8sCreateResource = adapterFunc(k8sCreate, ['model', 'data', 'opts']);

/**
 * It updates the entire resource in the cluster, based on provided options.
 * When a client needs to replace an existing resource entirely, they can use k8sUpdate.
 * Alternatively can use k8sPatch to perform the partial update.
 * @param options which are passed as key-value pair in the map
 * @param options.model k8s model
 * @param options.data payload for the resource to be updated
 * @param options.path Appends as subpath if provided
 * @param options.queryParams The query parameters to be included in the URL.
 * @return A promise that resolves to the response of the resource updated.
 * In case of failure promise gets rejected with HTTP error response.
 * * */
export const k8sUpdateResource = adapterFunc(k8sUpdate, ['model', 'data', 'ns', 'name', 'opts']);

/**
 * It patches any resource in the cluster, based on provided options.
 * When a client needs to perform the partial update, they can use k8sPatch.
 * Alternatively can use k8sUpdate to replace an existing resource entirely.
 * See more {@link https://datatracker.ietf.org/doc/html/rfc6902}
 * @param options Which are passed as key-value pairs in the map.
 * @param options.model k8s model
 * @param options.resource The resource to be patched.
 * @param options.data Only the data to be patched on existing resource with the operation, path, and value.
 * @param options.path Appends as subpath if provided.
 * @param options.queryParams The query parameters to be included in the URL.
 * @return A promise that resolves to the response of the resource patched.
 * In case of failure promise gets rejected with HTTP error response.
 * * */
export const k8sPatchResource = adapterFunc(k8sPatch, ['model', 'resource', 'data', 'opts']);

/**
 * It deletes resources from the cluster, based on the provided model, resource.
 * The garbage collection works based on 'Foreground' | 'Background', can be configured with propagationPolicy property in provided model or passed in json.
 * @param options which are passed as key-value pair in the map.
 * @param options.model k8s model
 * @param options.resource The resource to be deleted.
 * @param options.path Appends as subpath if provided
 * @param options.queryParams The query parameters to be included in the URL.
 * @param options.requestInit The fetch init object to use. This can have request headers, method, redirect, etc.
 * See more {@link https://microsoft.github.io/PowerBI-JavaScript/interfaces/_node_modules_typedoc_node_modules_typescript_lib_lib_dom_d_.requestinit.html}
 * @param options.json Can control garbage collection of resources explicitly if provided else will default to model's "propagationPolicy".
 * @example
 * { kind: 'DeleteOptions', apiVersion: 'v1', propagationPolicy }
 * @return A promise that resolves to the response of kind Status.
 * In case of failure promise gets rejected with HTTP error response.
 * * */
export const k8sDeleteResource = adapterFunc(k8sKill, [
  'model',
  'resource',
  'opts',
  'requestInit',
  'json',
]);

/**
 * It lists the resources as an array in the cluster, based on provided options.
 * @param options Which are passed as key-value pairs in the map
 * @param options.model k8s model
 * @param options.queryParams The query parameters to be included in the URL and can pass label selector's as well with key "labelSelector".
 * @param options.requestInit The fetch init object to use. This can have request headers, method, redirect, etc.
 * See more {@link https://microsoft.github.io/PowerBI-JavaScript/interfaces/_node_modules_typedoc_node_modules_typescript_lib_lib_dom_d_.requestinit.html}
 * @return A promise that resolves to the response
 * * */
export const k8sListResource = adapterFunc(k8sList, ['model', 'queryParams', 'raw', 'requestInit']);

const POLL_DELAY = 2000; // change this if you want it faster / slower
/**
 * Watch a resource -- works on a fixed delay poll today.
 */
export const useK8sWatchResource = <R extends K8sResourceCommon | K8sResourceCommon[]>(initResource: WatchK8sResource): WatchK8sResult<R> => {
  const [resource, setResource] = React.useState<R | null>(null);
  const [fetched, setFetched] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const addPromiseFollowups = (promise) => {
      promise
        .then((data) => {
          if (data.kind === 'Status') {
            setResource(null);
          } else if (!_.isEqual(resource, data)) {
            setResource(data);
          }
          setFetched(true);
        })
        .catch((err) => {
          setError(err);
          setFetched(true);
        });
    };

    addPromiseFollowups(makeGetCall(initResource));
    const intervalId = setInterval(() => {
      addPromiseFollowups(makeGetCall(initResource));
    }, POLL_DELAY);
    return () => {
      clearInterval(intervalId);
    }
  }, [initResource]);

  return [resource, fetched, error];
};
