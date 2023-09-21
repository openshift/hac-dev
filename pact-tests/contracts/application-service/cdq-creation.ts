import { like, regex } from '@pact-foundation/pact/src/v3/matchers';
import {
  ComponentDetectionQueryGroupVersionKind,
  ComponentDetectionQueryModel,
} from '../../../src/models';
import { ComponentDetectionQueryKind } from '../../../src/types';
import { matchers } from '../../matchers';
import { PactContract, getUrlPath } from '../contracts';
import { CDQParams } from './state-params';

const namespace = 'default';
const cdq = 'mycdq';
const path = getUrlPath(ComponentDetectionQueryModel, namespace, cdq);

export const cdqParams: CDQParams = {
  url: 'https://github.com/nodeshift-starters/devfile-sample.git',
  name: cdq,
  namespace,
};

const requestBody = {
  apiVersion: `${ComponentDetectionQueryModel.apiGroup}/${ComponentDetectionQueryModel.apiVersion}`,
  kind: ComponentDetectionQueryModel.kind,
  metadata: {
    name: cdq,
    namespace,
  },
  spec: {
    git: {
      url: 'https://github.com/nodeshift-starters/devfile-sample.git',
    },
  },
};

const expectedResponse = {
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
      url: 'https://github.com/nodeshift-starters/devfile-sample.git',
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

export const contract: PactContract<ComponentDetectionQueryKind> = {
  namespace,
  groupVersionKind: ComponentDetectionQueryGroupVersionKind,
  resourceName: cdq,
  request: {
    method: 'POST',
    path,
    body: requestBody,
    headers: { 'Content-Type': 'application/json' },
  },
  response: {
    status: 201,
    body: expectedResponse,
  },
  model: ComponentDetectionQueryModel,
};
