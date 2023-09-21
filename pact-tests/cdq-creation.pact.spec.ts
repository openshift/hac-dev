import { pactWith } from 'jest-pact/dist/v3';
import { contract, cdqParams } from './contracts/application-service/cdq-creation';
import { mockK8sCreateResource } from './contracts/contracts';

pactWith({ consumer: 'HACdev', provider: 'HAS' }, (interaction) => {
  interaction('Creation of CDQ', ({ provider, execute }) => {
    beforeEach(() => {
      provider
        .given(`CDQ exists`, cdqParams)
        .uponReceiving('CDQ was created')
        .withRequest(contract.request)
        .willRespondWith(contract.response);
    });

    execute('Get App with Components', async (mockserver) => {
      const returnedApp = await mockK8sCreateResource(contract, mockserver);
      expect(returnedApp.metadata.name).toEqual(contract.resourceName);
    });
  });
});
