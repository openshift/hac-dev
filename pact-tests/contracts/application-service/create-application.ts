import { like, regex } from '@pact-foundation/pact/src/v3/matchers';
import { ApplicationGroupVersionKind, ApplicationModel } from '../../../src/models/application';
import { ApplicationKind } from '../../../src/types';
import { matchers } from '../../matchers';
import { PactContract, getUrlPath } from '../contracts';

const namespace = 'default';
const app = 'app-to-create';
const path = getUrlPath(ApplicationModel, namespace, app);

const requestBody = {
  apiVersion: `${ApplicationModel.apiGroup}/${ApplicationModel.apiVersion}`,
  kind: ApplicationModel.kind,
  metadata: {
    name: app,
    namespace,
  },
  spec: {
    displayName: app,
  },
};

const expectedResponse = {
  apiVersion: `${ApplicationModel.apiGroup}/${ApplicationModel.apiVersion}`,
  kind: ApplicationModel.kind,
  metadata: {
    creationTimestamp: regex(matchers.dateAndTime, '2022-01-21T13:36:30Z'),
    generation: like(1),
    managedFields: [
      {
        apiVersion: `${ApplicationModel.apiGroup}/${ApplicationModel.apiVersion}`,
        fieldsType: 'FieldsV1',
        fieldsV1: {
          'f:spec': {
            '.': {},
            'f:displayName': {},
          },
        },
        manager: like('Mozilla'),
        operation: 'Update',
        time: regex(matchers.dateAndTime, '2022-01-21T13:36:30Z'),
      },
    ],
    name: app,
    namespace,
    resourceVersion: like('782971836'),
    uid: regex(matchers.uid, '00fbb7cd-fd2d-48f4-bdc5-3289f8d76c77'),
  },
  spec: {
    displayName: app,
  },
};

export const contract: PactContract<ApplicationKind> = {
  namespace,
  groupVersionKind: ApplicationGroupVersionKind,
  resourceName: app,
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
  model: ApplicationModel,
};
