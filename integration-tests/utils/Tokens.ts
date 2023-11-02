import { hacAPIEndpoints } from './APIEndpoints';
import { APIHelper } from './APIHelper';

export class Tokens {
  static removeBindingsAndTokens() {
    removeAllResources('spiaccesstokenbinding');
    removeAllResources('spiaccesstoken');
  }
}

function removeAllResources(resourceType: string) {
  const getResources = {
    method: 'GET',
    url: hacAPIEndpoints.resources(resourceType),
  };
  APIHelper.requestHACAPI(getResources)
    .its('body')
    .then((respBody) => {
      for (const item of respBody.items) {
        const resourceName = item.metadata.name;
        const removeResources = {
          method: 'DELETE',
          url: `${hacAPIEndpoints.resources(resourceType)}/${resourceName}`,
        };
        APIHelper.requestHACAPI(removeResources).its('status').should('equal', 200);
      }
    });
}
