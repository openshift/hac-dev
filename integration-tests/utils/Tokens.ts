import { Common } from './Common';

export class Tokens {
  static removeBindingsAndTokens() {
    cy.getCookie('cs_jwt')
      .should('exist')
      .then((cookie) => {
        const token = cookie.value;
        const namespace = `${Cypress.env('USERNAME').toLowerCase()}-tenant`;

        removeAllResources(token, namespace, 'spiaccesstokenbinding');
        removeAllResources(token, namespace, 'spiaccesstoken');
      });
  }
}

function removeAllResources(token: string, namespace: string, resourceType: string) {
  const getResources = {
    method: 'GET',
    url: `${Common.getOrigin()}/api/k8s/apis/appstudio.redhat.com/v1beta1/namespaces/${namespace}/${resourceType}s`,
    headers: {
      authorization: `Bearer ${token}`,
      accept: 'application/json',
    },
  };

  cy.request(getResources)
    .its('body')
    .then((respBody) => {
      for (const item of respBody.items) {
        const resourceName = item.metadata.name;
        const removeResources = {
          method: 'DELETE',
          url: `${Common.getOrigin()}/api/k8s/apis/appstudio.redhat.com/v1beta1/namespaces/${namespace}/${resourceType}s/${resourceName}`,
          headers: {
            authorization: `Bearer ${token}`,
            accept: 'application/json',
          },
        };
        cy.request(removeResources).should((response) => {
          expect(response.status).to.eq(200);
        });
      }
    });
}
