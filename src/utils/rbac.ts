import React from 'react';
import { k8sCreateResource, K8sModelCommon, K8sVerb } from '@openshift/dynamic-plugin-sdk-utils';
import memoize from 'lodash/memoize';
import { SelfSubjectAccessReviewModel } from '../models/rbac';
import {
  AccessReviewResourceAttributes,
  AccessReviewResourceAttributesArray,
  AccessReviewResources,
  SelfSubjectAccessReviewKind,
} from '../types/rbac';
import { useWorkspaceInfo } from './workspace-context-utils';

export const checkAccess = memoize(
  async (group, resource, subresource, namespace, verb) => {
    return k8sCreateResource<SelfSubjectAccessReviewKind>({
      model: SelfSubjectAccessReviewModel,
      resource: {
        apiVersion: 'authorization.k8s.io/v1',
        kind: 'SelfSubjectAccessReview',
        spec: {
          resourceAttributes: {
            group,
            resource,
            subresource,
            namespace,
            verb,
          },
        },
      },
    });
  },
  (...args) => args.join('~'),
);

export const useAccessReview = (
  resourceAttributes: AccessReviewResourceAttributes,
): [boolean, boolean] => {
  const [loaded, setLoaded] = React.useState(false);
  const [isAllowed, setIsAllowed] = React.useState(false);

  React.useEffect(() => {
    // wait for workspace context to load the namespace
    if (resourceAttributes.namespace) {
      checkAccess(
        resourceAttributes.group,
        resourceAttributes.resource,
        resourceAttributes.subresource,
        resourceAttributes.namespace,
        resourceAttributes.verb,
      )
        .then((result) => {
          setIsAllowed(result.status.allowed);
          setLoaded(true);
        })
        .catch((e) => {
          // eslint-disable-next-line no-console
          console.warn(`SelfSubjectAccessReview failed: ${e}`);
          setIsAllowed(true);
          setLoaded(true);
        });
    }
  }, [resourceAttributes]);

  return [isAllowed, loaded];
};

export const useAccessReviewForModel = (model: K8sModelCommon, verb: K8sVerb) => {
  const { namespace } = useWorkspaceInfo();
  return useAccessReview({ group: model.apiGroup, resource: model.plural, namespace, verb });
};

export const useAccessReviews = (
  resourceAttributesArray: AccessReviewResourceAttributesArray,
): [boolean, boolean] => {
  const [loaded, setLoaded] = React.useState(false);
  const [isAllowed, setIsAllowed] = React.useState(false);

  React.useEffect(() => {
    // wait for workspace context to load the namespace
    if (resourceAttributesArray?.[0]?.namespace) {
      const allChecks = [];
      const resourceAccess = [];
      resourceAttributesArray.map((resourceAttributes) => {
        allChecks.push(
          checkAccess(
            resourceAttributes.group,
            resourceAttributes.resource,
            resourceAttributes.subresource,
            resourceAttributes.namespace,
            resourceAttributes.verb,
          ),
        );
      });
      Promise.all(allChecks)
        .then((results) => {
          results.map((result) => {
            resourceAccess.push({
              resource: result.spec.resourceAttributes.resource,
              verb: result.spec.resourceAttributes.verb,
              allowed: result.status.allowed,
            });
          });
          if (resourceAccess.every((access) => access.allowed)) {
            setIsAllowed(true);
          }
          setLoaded(true);
        })
        .catch((e) => {
          // eslint-disable-next-line no-console
          console.warn(`SelfSubjectAccessReview failed: ${e}`);
          setIsAllowed(true);
          setLoaded(true);
        });
    }
  }, [resourceAttributesArray]);

  return [isAllowed, loaded];
};

export const useAccessReviewForModels = (accessReviewResources: AccessReviewResources) => {
  const { namespace } = useWorkspaceInfo();

  const resourceAttributes: AccessReviewResourceAttributesArray = accessReviewResources.map(
    ({ model, verb }) => ({
      group: model.apiGroup,
      resource: model.plural,
      namespace,
      verb,
    }),
  );
  return useAccessReviews(resourceAttributes);
};
