import 'whatwg-fetch';
import { jest } from '@jest/globals';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { like, term } from '@pact-foundation/pact/src/dsl/matchers';
import { pactWith } from 'jest-pact';
import { ApplicationGroupVersionKind } from '../src/models';
import { ApplicationKind } from '../src/types';
import { PactUrlUtil, Kind } from './pact-test-utils';

jest.mock('@openshift/dynamic-plugin-sdk-utils');

const watchResourceMock = useK8sWatchResource as jest.Mock;

pactWith({ consumer: 'HACdev', provider: 'HAS' }, (provider) => {
  jest.setTimeout(10000);

  describe('API Pact test 2', () => {
    test('Get App with Components', async () => {
      const namespace = 'default';
      const app = 'myapp';
      const comp1 = 'gh-component';
      const comp2 = 'quay-component';
      const path = `${await PactUrlUtil.getPath(Kind.Application, namespace, app)}`;
      const devfileExample =
        'metadata:\n  attributes:\n    appModelRepository.context: /\n    appModelRepository.url: https://github.com/redhat-appstudio-appdata/asdf-kkanova-match-share\n    gitOpsRepository.context: ./\n    gitOpsRepository.url: https://github.com/redhat-appstudio-appdata/asdf-kkanova-match-share\n  name: asdf\nprojects:\n- git:\n    remotes:\n      origin: https://github.com/sclorg/nodejs-ex\n  name: gh-component\n- git:\n    remotes:\n      origin: https://github.com/devfile-samples/devfile-sample-java-springboot-basic.git\n  name: quay-component\nschemaVersion: 2.1.0\n';
      const expectedResponse = {
        apiVersion: `${ApplicationGroupVersionKind.group}/${ApplicationGroupVersionKind.version}`,
        kind: ApplicationGroupVersionKind.kind,
        metadata: {
          creationTimestamp: term({
            generate: '2022-01-21T13:36:30Z',
            matcher:
              '^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z|[+-](?:2[0-3]|[01][0-9]):[0-5][0-9])?$',
          }),
          generation: like(1),
          name: app,
          namespace,
          resourceVersion: like('782971836'),
          uid: term({
            generate: '00fbb7cd-fd2d-48f4-bdc5-3289f8d76c77',
            matcher: '^([0-z]{8}-[0-z]{4}-[0-z]{4}-[0-z]{4}-[0-z]{12})$',
          }),
        },
        status: {
          devfile: term({
            generate: devfileExample,
            matcher: `((${comp1})[\\s\\S]*(${comp2}))|((${comp2}})[\\s\\S]*(${comp1}))`,
          }),
        },
      };

      await provider.addInteraction({
        state: `App ${app} exists and has component ${comp1} and ${comp2}`,
        uponReceiving: 'Get app with its components.',
        withRequest: {
          method: 'GET',
          path,
          headers: {
            'Content-type': 'application/json',
          },
        },
        willRespondWith: {
          status: 200,
          body: expectedResponse,
        },
      });

      // Act
      /* eslint-disable */
      watchResourceMock.mockImplementationOnce(() => {
        return [
          fetch(`${provider.mockService.baseUrl}${path}`, {
            method: 'GET',
            headers: { 'Content-type': 'application/json' },
          }).then((res) => res.json()),
          true,
          null,
        ];
      });
      /* eslint-enable */
      const resource = {
        groupVersionKind: ApplicationGroupVersionKind,
        name: app,
        namespace,
      };

      const [application] = useK8sWatchResource<ApplicationKind>(resource);

      const returnedApp = await application;
      expect(returnedApp.metadata.name).toEqual(app);
      expect(returnedApp.status.devfile).toContain(comp1);
      expect(returnedApp.status.devfile).toContain(comp2);
    });
  });
});
