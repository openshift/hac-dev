import { pactWith } from 'jest-pact/dist/v3';
import { createContract } from './contracts/application-service/cdq-create';
import { cdqParams, getContract } from './contracts/application-service/cdq-get';
import { mockK8sCreateResource, mockK8sWatchResource } from './contracts/contracts';
import { ProviderStates, setState } from './states/states';

pactWith({ consumer: 'HACdev', provider: 'HAS' }, (interaction) => {
  interaction('Creation of CDQ', ({ provider, execute }) => {
    beforeEach(() => {
      provider
        .uponReceiving('request to create a CDQ')
        .withRequest(createContract.request)
        .willRespondWith(createContract.response);
    });

    execute('Create CDQ', async (mockserver) => {
      const createdCdq = await mockK8sCreateResource(createContract, mockserver);
      expect(createdCdq.metadata.name).toEqual(createContract.resourceName);
    });
  });

  interaction('Creation of CDQ', ({ provider, execute }) => {
    beforeEach(() => {
      setState(provider, ProviderStates.cdqProgressing, cdqParams)
        .uponReceiving('request to return CDQ')
        .withRequest(getContract.request)
        .willRespondWith(getContract.response);
    });

    execute('Get progressing CDQ', async (mockserver) => {
      const returnedCdq = await mockK8sWatchResource(getContract, mockserver);
      expect(returnedCdq.metadata.name).toEqual(getContract.resourceName);
    });
  });
});
