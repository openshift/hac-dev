import { pactWith } from 'jest-pact/dist/v3';
import { createContract } from './contracts/application-service/application-create';
import {
  comp1,
  compParams,
  getAppParams,
  getContract,
} from './contracts/application-service/application-get';
import { mockK8sCreateResource, mockK8sWatchResource } from './contracts/contracts';
import { ProviderStates, setState } from './states/states';

pactWith({ consumer: 'HACdev', provider: 'HAS' }, (interaction) => {
  interaction('Application creation', ({ provider, execute }) => {
    beforeEach(() => {
      provider
        .uponReceiving('Create an application.')
        .withRequest(createContract.request)
        .willRespondWith(createContract.response);
    });

    execute('Create an application.', async (mockserver) => {
      const product = await mockK8sCreateResource(createContract, mockserver);
      expect(product.kind).toEqual(createContract.model.kind);
    });
  });

  interaction('Getting application', ({ provider, execute }) => {
    beforeEach(() => {
      setState(provider, ProviderStates.appExists, getAppParams);
      setState(provider, ProviderStates.appHasComponent, compParams)
        .uponReceiving('Get app with its components')
        .withRequest(getContract.request)
        .willRespondWith(getContract.response);
    });

    execute('Get app with its components', async (mockserver) => {
      const returnedApp = await mockK8sWatchResource(getContract, mockserver);
      expect(returnedApp.metadata.name).toEqual(getContract.resourceName);
      expect(returnedApp.status.devfile).toContain(comp1);
    });
  });
});
