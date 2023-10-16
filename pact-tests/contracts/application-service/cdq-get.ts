import { like, regex } from '@pact-foundation/pact/src/v3/matchers';
import {
  ComponentDetectionQueryGroupVersionKind,
  ComponentDetectionQueryModel,
} from '../../../src/models';
import { ComponentDetectionQueryKind } from '../../../src/types';
import { matchers } from '../../matchers';
import { CDQParams } from '../../states/state-params';
import { PactContract, getUrlPath } from '../contracts';

const namespace = 'default';
const cdq = 'mycdq';
const path = getUrlPath(ComponentDetectionQueryModel, namespace, cdq);
const gitRepoUrl = 'https://github.com/nodeshift-starters/devfile-sample.git';

export const cdqParams: CDQParams = {
  url: gitRepoUrl,
  name: cdq,
  namespace,
};

const expectedGetResponse = {
  apiVersion: `${ComponentDetectionQueryModel.apiGroup}/${ComponentDetectionQueryModel.apiVersion}`,
  kind: ComponentDetectionQueryModel.kind,
  metadata: {
    creationTimestamp: regex(matchers.dateAndTime, '2022-01-21T13:36:30Z'),
    generation: like(1),
    name: cdq,
    namespace,
  },
  spec: {
    git: {
      url: gitRepoUrl,
    },
  },
  status: {
    conditions: [
      {
        lastTransitionTime: regex(matchers.dateAndTime, '2022-06-01T19:46:56Z'),
        message: like('ComponentDetectionQuery is processing'),
        reason: 'Success',
        type: 'Processing',
      },
    ],
  },
};

export const getContract: PactContract<ComponentDetectionQueryKind> = {
  namespace,
  groupVersionKind: ComponentDetectionQueryGroupVersionKind,
  resourceName: cdq,
  request: {
    method: 'GET',
    path,
    headers: { 'Content-Type': 'application/json' },
  },
  response: {
    status: 200,
    body: expectedGetResponse,
  },
  model: ComponentDetectionQueryModel,
};
