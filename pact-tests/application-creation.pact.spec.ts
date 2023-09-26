import { pactWith } from 'jest-pact/dist/v3';
import { contract, params } from './contracts/application-service/create-application';
import { mockK8sCreateResource } from './contracts/contracts';

pactWith({ consumer: 'HACdev', provider: 'HAS' }, (interaction) => {
  interaction('App creation', ({ provider, execute }) => {
    beforeEach(() => {
      provider
        .given("Application doesn't exist", params)
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
