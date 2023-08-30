import { pactWith } from 'jest-pact/dist/v3';
import { contract } from './contracts/application-service/create-application';
import { mockK8sCreateResource } from './contracts/contracts';

pactWith({ consumer: 'HACdev', provider: 'HAS' }, (interaction) => {
  interaction('API Pact test', ({ provider, execute }) => {
    beforeEach(() => {
      provider
        .given(
          `No app with the name ${contract.resourceName} in the ${contract.namespace} namespace exists.`,
        )
        .uponReceiving('Create an application.')
        .withRequest(contract.request)
        .willRespondWith(contract.response);
    });

    execute('App is created', async (mockserver) => {
      const product = await mockK8sCreateResource(contract, mockserver);
      expect(product.kind).toEqual(contract.model.kind);
    });
  });
});
