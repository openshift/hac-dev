import {
  arrayContaining,
  regex,
  like,
  V3Response,
  V3Request,
  equal,
} from '@pact-foundation/pact/src/v3/matchers';
import { ApplicationGroupVersionKind, ApplicationModel } from '../../../src/models/application';
import { ApplicationKind } from '../../../src/types';
import { matchers } from '../../matchers';
import { ApplicationParams, ComponentsParams } from '../../states/state-params';
import { PactContract, getUrlPath } from '../contracts';

export const comp1 = 'gh-component';

const namespace = 'default';
const repo = 'https://github.com/devfile-samples/devfile-sample-java-springboot-basic';
const app = 'myapp';
const path = getUrlPath(ApplicationModel, namespace, app);

const devfileExample = `metadata:\n  attributes:\n    appModelRepository.context: /\n    appModelRepository.url: https://github.com/redhat-appstudio-appdata/asdf-kkanova-match-share\n    gitOpsRepository.context: ./\n    gitOpsRepository.url: https://github.com/redhat-appstudio-appdata/asdf-kkanova-match-share\n  name: asdf\nprojects:\n- git:\n    remotes:\n      origin: ${repo}\n  name: ${comp1}\nschemaVersion: 2.1.0\n`;
const expectedResponseBody = {
  apiVersion: `${ApplicationModel.apiGroup}/${ApplicationModel.apiVersion}`,
  kind: ApplicationModel.kind,
  metadata: {
    creationTimestamp: regex(matchers.dateAndTime, '2022-01-21T13:36:30Z'),
    generation: like(1),
    name: app,
    namespace,
    resourceVersion: like('782971836'),
    uid: regex(matchers.uid, '00fbb7cd-fd2d-48f4-bdc5-3289f8d76c77'),
  },
  status: {
    devfile: regex(`[\\s\\S]*${comp1}[\\s\\S]*`, devfileExample),
    conditions: arrayContaining(
      {
        message: like('Application has been successfully created'),
        reason: equal('OK'),
        status: equal('True'),
        type: equal('Created'),
      },
      {
        message: like('Application has been successfully updated'),
        reason: equal('OK'),
        status: equal('True'),
        type: equal('Updated'),
      },
    ),
  },
};

const request: V3Request = {
  method: 'GET',
  path,
  headers: {
    'Content-type': 'application/json',
  },
};

const response: V3Response = {
  status: 200,
  body: expectedResponseBody,
};

export const getContract: PactContract<ApplicationKind> = {
  request,
  response,
  namespace,
  resourceName: app,
  groupVersionKind: ApplicationGroupVersionKind,
};

export const getAppParams: ApplicationParams = {
  appName: app,
  namespace,
};

export const compParams: ComponentsParams = {
  components: [
    {
      app: getAppParams,
      repo,
      compName: comp1,
    },
  ],
};
