import { inspect } from 'util';
import { PactV3 } from '@pact-foundation/pact';
import { JsonMap } from '@pact-foundation/pact/src/common/jsonTypes';
import { ApplicationParams, ComponentsParams } from './state-params';

/**
 * This enum contains definitions for all provider states used by hac-dev
 */
export enum ProviderStates {
  appExists = 'Application exists',
  appNotExists = "Application doesn't exist",
  appHasComponent = 'Application has components',
}

/**
 * Mappings for the state definitions and examples of their expected parameters
 */
const stateParams: Record<ProviderStates, JsonMap | undefined> = {
  'Application exists': { appName: 'app', namespace: 'default' } as ApplicationParams,
  "Application doesn't exist": { appName: 'app', namespace: 'default' } as ApplicationParams,
  'Application has components': {
    components: [{ app: { appName: 'app', namespace: 'default' }, repo: 'url', compName: 'comp' }],
  } as ComponentsParams,
};

/**
 * Declares the use of a provider state for pact tests
 *
 * @param provider pact provider, comes from pact API
 * @param state existing state name from ProviderStates enum
 * @param params optional parameters for the state
 * @returns provider, to facilitate the fluent pact API
 */
export function setState<T extends JsonMap>(
  provider: PactV3,
  state: ProviderStates,
  params?: T,
): PactV3 {
  if (!Object.getOwnPropertyNames(stateParams).includes(state)) {
    throw new Error(`State "${state}" is not defined in provider states.
            \nAvailable states are:\n   "${Object.getOwnPropertyNames(stateParams)}"`);
  }
  if (params) {
    const defaultKeys = Object.getOwnPropertyNames(stateParams[state]);
    for (const key of defaultKeys) {
      if (!Object.getOwnPropertyNames(params).includes(key)) {
        throw new Error(
          `Invalid state parameters:\n"${inspect(params)}"\n has no property "${key}"`,
        );
      }
    }
  }
  return provider.given(state, params);
}
