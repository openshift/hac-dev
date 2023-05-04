import React from 'react';
import { OpenDrawerRightIcon } from '@patternfly/react-icons/dist/esm/icons/open-drawer-right-icon';
import { HelpTopicLink } from '../components/HelpTopicLink/HelpTopicLink';
import ImportForm from '../components/ImportForm/ImportForm';
import NamespacedPage from '../components/NamespacedPage/NamespacedPage';
import PageAccessCheck from '../components/PageAccess/PageAccessCheck';
import PageLayout from '../components/PageLayout/PageLayout';
import { useQuickstartCloseOnUnmount } from '../hooks/useQuickstartCloseOnUnmount';
import { ApplicationModel, ComponentModel } from '../models';
import { getQueryArgument } from '../shared/utils';
import { AccessReviewResources } from '../types';
import { useApplicationBreadcrumbs } from '../utils/breadcrumb-utils';

const ImportPage: React.FunctionComponent = () => {
  useQuickstartCloseOnUnmount();

  const applicationName = getQueryArgument('application');
  const applicationBreadcrumbs = useApplicationBreadcrumbs(applicationName);

  const accessReviewResources: AccessReviewResources = applicationName
    ? [{ model: ComponentModel, verb: 'create' }]
    : [
        { model: ApplicationModel, verb: 'create' },
        { model: ComponentModel, verb: 'create' },
      ];

  return (
    <NamespacedPage>
      <PageLayout
        breadcrumbs={[...applicationBreadcrumbs, { path: '#', name: 'Import' }]}
        title="Grab some code"
        description={
          <>
            Provide a link to your GitHub repository or start with a no-fail sample.{' '}
            <HelpTopicLink topicId="stonesoup-import-add-component" isInline>
              Learn more <span className="pf-u-screen-reader">about adding components</span>{' '}
              <OpenDrawerRightIcon />
            </HelpTopicLink>
          </>
        }
      >
        <PageAccessCheck accessReviewResources={accessReviewResources}>
          <ImportForm applicationName={applicationName} />
        </PageAccessCheck>
      </PageLayout>
    </NamespacedPage>
  );
};

export default ImportPage;
