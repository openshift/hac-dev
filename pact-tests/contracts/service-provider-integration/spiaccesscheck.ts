import { like, regex } from '@pact-foundation/pact/src/v3/matchers';
import { SPIAccessCheckGroupVersionKind, SPIAccessCheckModel } from '../../../src/models';
import { SPIAccessCheckKind } from '../../../src/types';
import { matchers } from '../../matchers';
import { PactContract, getUrlPath } from '../contracts';

const namespace = 'default';
const name = 'test-name-';
const repo = 'https://github.com/hac-test/devfile-sample-code-with-quarkus';
const path = getUrlPath(SPIAccessCheckModel, namespace);

const requestBody = {
  apiVersion: `${SPIAccessCheckModel.apiGroup}/${SPIAccessCheckModel.apiVersion}`,
  kind: SPIAccessCheckModel.kind,
  metadata: {
    generateName: name,
    namespace,
  },
  spec: {
    repoUrl: repo,
  },
};

const expectedResponse = {
  apiVersion: `${SPIAccessCheckModel.apiGroup}/${SPIAccessCheckModel.apiVersion}`,
  kind: SPIAccessCheckModel.kind,
  metadata: {
    creationTimestamp: regex(matchers.dateAndTime, '2022-01-21T13:36:30Z'),
    generateName: name,
    name: regex(`^${name}.*`, `${name}9722c`),
    namespace,
    resourceVersion: like('782971836'),
    uid: regex(matchers.uid, '00fbb7cd-fd2d-48f4-bdc5-3289f8d76c77'),
  },
  spec: {
    repoUrl: repo,
  },
};

export const contract: PactContract<SPIAccessCheckKind> = {
  namespace,
  groupVersionKind: SPIAccessCheckGroupVersionKind,
  resourceName: name,
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
  model: SPIAccessCheckModel,
};
