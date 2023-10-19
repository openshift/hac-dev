import React from 'react';
import { Helmet } from 'react-helmet';
import NamespacedPage from '../components/NamespacedPage/NamespacedPage';
import PageAccessCheck from '../components/PageAccess/PageAccessCheck';
import { UserAccessFormPage } from '../components/UserAccess/UserAccessForm/UserAccessFormPage';
import { FULL_APPLICATION_TITLE } from '../consts/labels';
import { SpaceBindingRequestModel } from '../models';
import { AccessReviewResources } from '../types';
import { useWorkspaceInfo } from '../utils/workspace-context-utils';

const GrantAccessPage: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { workspace } = useWorkspaceInfo();
  const accessReviewResources: AccessReviewResources = [
    { model: SpaceBindingRequestModel, verb: 'create' },
  ];

  return (
    <NamespacedPage>
      <Helmet>
        <title>
          Grant access to workspace, ${workspace} | ${FULL_APPLICATION_TITLE}
        </title>
      </Helmet>
      <PageAccessCheck accessReviewResources={accessReviewResources}>
        <UserAccessFormPage />
      </PageAccessCheck>
    </NamespacedPage>
  );
};

export default GrantAccessPage;
