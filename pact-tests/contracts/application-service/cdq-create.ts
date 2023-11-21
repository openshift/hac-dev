import { like, regex } from '@pact-foundation/pact/src/v3/matchers';
import {
  ComponentDetectionQueryGroupVersionKind,
  ComponentDetectionQueryModel,
} from '../../../src/models';
import { ComponentDetectionQueryKind } from '../../../src/types';
import { matchers } from '../../matchers';
import { PactContract, getUrlPath } from '../contracts';

const namespace = 'default';
const cdq = 'mycdq';
const path = getUrlPath(ComponentDetectionQueryModel, namespace, cdq);
const gitRepoUrl = 'https://github.com/nodeshift-starters/devfile-sample.git';

const createRequestBody = {
  apiVersion: `${ComponentDetectionQueryModel.apiGroup}/${ComponentDetectionQueryModel.apiVersion}`,
  kind: ComponentDetectionQueryModel.kind,
  metadata: {
    name: cdq,
    namespace,
  },
  spec: {
    git: {
      url: gitRepoUrl,
    },
  },
};

const expectedCreateResponse = {
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
};

export const createContract: PactContract<ComponentDetectionQueryKind> = {
  namespace,
  groupVersionKind: ComponentDetectionQueryGroupVersionKind,
  resourceName: cdq,
  request: {
    method: 'POST',
    path,
    body: createRequestBody,
    headers: { 'Content-Type': 'application/json' },
  },
  response: {
    status: 201,
    body: expectedCreateResponse,
  },
  model: ComponentDetectionQueryModel,
};
