import { pactWith } from 'jest-pact/dist/v3';
import {
  comp1,
  contract,
  appParams,
  compParams,
} from './contracts/application-service/get-application';
import { mockK8sWatchResource } from './contracts/contracts';
import { ProviderStates, setState } from './states/states';

pactWith({ consumer: 'HACdev', provider: 'HAS' }, (interaction) => {
  interaction('Getting application', ({ provider, execute }) => {
    beforeEach(() => {
      setState(provider, ProviderStates.appExists, appParams);
      setState(provider, ProviderStates.appHasComponent, compParams)
        .uponReceiving('Get app with its components.')
        .withRequest(contract.request)
        .willRespondWith(contract.response);
    });

    execute('Get App with Components', async (mockserver) => {
      const returnedApp = await mockK8sWatchResource(contract, mockserver);
      expect(returnedApp.metadata.name).toEqual(contract.resourceName);
      expect(returnedApp.status.devfile).toContain(comp1);
    });
  });
});
