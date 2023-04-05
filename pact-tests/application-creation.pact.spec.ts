import 'whatwg-fetch';
import { jest } from '@jest/globals';
import { k8sCreateResource } from '@openshift/dynamic-plugin-sdk-utils';
import { like, term } from '@pact-foundation/pact/src/dsl/matchers';
import { pactWith } from 'jest-pact';
import { createApplication } from '../src/utils/create-utils';
import { PactUrlUtil, Kind } from './pact-test-utils';

jest.mock('@openshift/dynamic-plugin-sdk-utils');

const createResourceMock = k8sCreateResource as jest.Mock;

pactWith({ consumer: 'HACdev', provider: 'HAS' }, (provider) => {
  jest.setTimeout(10000);

  describe('API Pact test', () => {
    test('App is created', async () => {
      const namespace = 'default';
      const app = 'app-to-create';
      const path = `${await PactUrlUtil.getPath(Kind.Application, namespace, app)}`;
      const requestBody = {
        apiVersion: 'appstudio.redhat.com/v1alpha1',
        kind: 'Application',
        metadata: {
          name: app,
          namespace,
        },
        spec: {
          displayName: app,
        },
      };
      const expectedResponse = {
        apiVersion: 'appstudio.redhat.com/v1alpha1',
        kind: 'Application',
        metadata: {
          creationTimestamp: term({
            generate: '2022-01-21T13:36:30Z',
            matcher:
              '^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z|[+-](?:2[0-3]|[01][0-9]):[0-5][0-9])?$',
          }),
          generation: like(1),
          managedFields: [
            {
              apiVersion: 'appstudio.redhat.com/v1alpha1',
              fieldsType: 'FieldsV1',
              fieldsV1: {
                'f:spec': {
                  '.': {},
                  'f:displayName': {},
                },
              },
              manager: like('Mozilla'),
              operation: 'Update',
              time: term({
                generate: '2022-01-21T13:36:30Z',
                matcher:
                  '^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z|[+-](?:2[0-3]|[01][0-9]):[0-5][0-9])?$',
              }),
            },
          ],
          name: app,
          namespace,
          resourceVersion: like('782971836'),
          uid: term({
            generate: '00fbb7cd-fd2d-48f4-bdc5-3289f8d76c77',
            matcher: '^([0-z]{8}-[0-z]{4}-[0-z]{4}-[0-z]{4}-[0-z]{12})$',
          }),
        },
        spec: {
          displayName: app,
        },
      };

      await provider.addInteraction({
        state: `No app with the name ${app} in the ${namespace} namespace exists.`,
        uponReceiving: 'Create an application.',
        withRequest: {
          method: 'POST',
          path,
          body: requestBody,
          headers: {
            'Content-type': 'application/json',
          },
        },
        willRespondWith: {
          status: 201,
          body: expectedResponse,
        },
      });

      // Act
      /* eslint-disable */
      createResourceMock.mockImplementationOnce(() => {
        return fetch(`${provider.mockService.baseUrl}${path}`, {
          method: 'POST',
          body: JSON.stringify(requestBody),
          headers: { 'Content-type': 'application/json' },
        }).then((res) => res.json());
      });
      /* eslint-enable */
      const product = await createApplication(app, namespace);

      expect(product.kind).toEqual(expectedResponse.kind);
    });
  });
});
