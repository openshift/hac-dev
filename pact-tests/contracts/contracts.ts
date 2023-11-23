jest.mock('@openshift/dynamic-plugin-sdk-utils');

import {
  K8sGroupVersionKind,
  K8sModelCommon,
  K8sResourceCommon,
  k8sCreateResource,
  useK8sWatchResource,
} from '@openshift/dynamic-plugin-sdk-utils';
import { V3MockServer, V3Request, V3Response } from '@pact-foundation/pact';
import 'whatwg-fetch';

/* eslint-disable */
/**
 * PactContract contains necessary information to create a pact test case from a single object.
 * This interface is generic to specify what type of k8s resource is being tested in the given contract.
 *
 * Contains the following:
 * resourceName - name of the k8s resource that needs to be tested
 * namespace - name of the k8s namespace the resource should reside in (simulated)
 * request - request to simulate according to the pact API
 * response - expected response according to the pact API
 * groupVersionKind - object specifying group+version+kind for the given k8s resource
 * model - model of the given k8s resource, not necessary for GET requests
 */
export interface PactContract<T extends K8sResourceCommon> {
  resourceName: string;
  namespace: string;
  request: V3Request;
  response: V3Response;
  groupVersionKind: K8sGroupVersionKind;
  model?: K8sModelCommon;
}
/* eslint-enable */

/**
 * Get a URL segment for a k8s resource with given name and namespace.
 *
 * @param model k8s model for the resource, e.g. ApplicationModel
 * @param namespace namespace of the k8s resource
 * @param resourceName name of the k8s resource
 * @returns URL path to the given resource within k8s API
 */
export function getUrlPath(model: K8sModelCommon, namespace: string, resourceName?: string) {
  const sufix = resourceName ? `/${resourceName}` : '';
  return `/apis/${model.apiGroup}/${model.apiVersion}/namespaces/${namespace}/${model.plural}${sufix}`;
}

/**
 * Mock and call the k8sWatchResource hook. Use this to simulate HAC sending GET requests for resources.
 *
 * @param contract PactContract instance identifying the resource
 * @param mockserver mockserver instance, get this from pact execute function
 * @returns k8s resource specified by the pact contract's expected response
 */
export async function mockK8sWatchResource<T extends K8sResourceCommon>(
  contract: PactContract<T>,
  mockserver: V3MockServer,
): Promise<T> {
  const watchResourceMock = useK8sWatchResource as jest.Mock;
  watchResourceMock.mockImplementationOnce(() => {
    return [
      fetch(`${mockserver.url}${contract.request.path}`, {
        method: contract.request.method,
        headers: contract.request.headers as Record<string, string>,
      }).then((res) => res.json()),
      true,
      null,
    ];
  });

  const resource = {
    groupVersionKind: contract.groupVersionKind,
    name: contract.resourceName,
    namespace: contract.namespace,
  };

  // eslint-disable-next-line
  const response = useK8sWatchResource<T>(resource);
  return response[0];
}

/**
 * Mock and call the k8sCreateResource method. Use this to simulate sending POST requests to create new resources.
 *
 * @param contract PactContract instance identifying the resource
 * @param mockserver mockserver instance, get this from pact execute function
 * @returns created k8s resource specified by the pact contract's expected response
 */
export async function mockK8sCreateResource<T extends K8sResourceCommon>(
  contract: PactContract<T>,
  mockserver: V3MockServer,
): Promise<T> {
  const createResourceMock = k8sCreateResource as jest.Mock;
  createResourceMock.mockImplementationOnce(async () => {
    const res = await fetch(`${mockserver.url}${contract.request.path}`, {
      method: contract.request.method,
      body: JSON.stringify(contract.request.body),
      headers: contract.request.headers as Record<string, string>,
    });
    return await res.json();
  });
  const body = contract.request.body as K8sResourceCommon;

  return k8sCreateResource({
    model: contract.model,
    queryOptions: {
      name: contract.resourceName,
      ns: contract.namespace,
    },
    resource: body,
  });
}
