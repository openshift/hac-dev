import React from 'react';
import ImportForm from '../components/ImportForm/ImportForm';
import NamespacedPage from '../components/NamespacedPage/NamespacedPage';
import PageAccessCheck from '../components/PageAccess/PageAccessCheck';
import { useQuickstartCloseOnUnmount } from '../hooks/useQuickstartCloseOnUnmount';
import { ApplicationModel, ComponentModel } from '../models';
import { getQueryArgument } from '../shared/utils';
import { AccessReviewResources } from '../types';

const ImportPage: React.FunctionComponent<React.PropsWithChildren<unknown>> = () => {
  useQuickstartCloseOnUnmount();

  const applicationName = getQueryArgument('application');

  const accessReviewResources: AccessReviewResources = applicationName
    ? [{ model: ComponentModel, verb: 'create' }]
    : [
        { model: ApplicationModel, verb: 'create' },
        { model: ComponentModel, verb: 'create' },
      ];

  return (
    <NamespacedPage>
      <PageAccessCheck accessReviewResources={accessReviewResources}>
        <ImportForm applicationName={applicationName} />
      </PageAccessCheck>
    </NamespacedPage>
  );
};

export default ImportPage;
