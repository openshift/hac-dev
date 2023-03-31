import React from 'react';
import { Bullseye, Spinner } from '@patternfly/react-core';
import { AccessReviewResources } from '../../types';
import { useAccessReviewForModels } from '../../utils/rbac';
import NoAccessState from './NoAccessState';

type PageAccessCheckProps = {
  accessReviewResources: AccessReviewResources;
  children: React.ReactNode;
  accessDeniedTitle?: React.ReactNode & string;
  accessDeniedBody?: React.ReactNode;
};
const PageAccessCheck: React.FC<PageAccessCheckProps> = ({
  accessReviewResources,
  children,
  accessDeniedTitle,
  accessDeniedBody,
}) => {
  const [hasAccess, accessLoaded] = useAccessReviewForModels(accessReviewResources);
  return !accessLoaded ? (
    <Bullseye>
      <Spinner data-test="spinner" />
    </Bullseye>
  ) : !hasAccess ? (
    <NoAccessState title={accessDeniedTitle} body={accessDeniedBody} />
  ) : (
    <>{children}</>
  );
};

export default PageAccessCheck;
