import React from 'react';
import { k8sCreateResource, K8sModelCommon, K8sVerb } from '@openshift/dynamic-plugin-sdk-utils';
import memoize from 'lodash/memoize';
import { SelfSubjectAccessReviewModel } from '../models/rbac';
import { AccessReviewResourceAttributes, SelfSubjectAccessReviewKind } from '../types/rbac';
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
  }, [resourceAttributes]);

  return [isAllowed, loaded];
};

export const useAccessReviewForModel = (model: K8sModelCommon, verb: K8sVerb) => {
  const { namespace } = useWorkspaceInfo();
  return useAccessReview({ group: model.apiGroup, resource: model.plural, namespace, verb });
};
