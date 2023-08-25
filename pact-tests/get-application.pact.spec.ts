import { pactWith } from 'jest-pact/dist/v3';
import { comp1, comp2, contract } from './contracts/application-service/get-application';
import { mockK8sWatchResource } from './contracts/contracts';

pactWith({ consumer: 'HACdev', provider: 'HAS' }, (interaction) => {
  interaction('API Pact test 2', ({ provider, execute }) => {
    beforeEach(() => {
      provider
        .given(`App ${contract.resourceName} exists and has component ${comp1} and ${comp2}`)
        .uponReceiving('Get app with its components.')
        .withRequest(contract.request)
        .willRespondWith(contract.response);
    });

    execute('Get App with Components', async (mockserver) => {
      const returnedApp = await mockK8sWatchResource(contract, mockserver);
      expect(returnedApp.metadata.name).toEqual(contract.resourceName);
      expect(returnedApp.status.devfile).toContain(comp1);
      expect(returnedApp.status.devfile).toContain(comp2);
    });
  });
});
