import React from 'react';
import { PageSection } from '@patternfly/react-core';
import { OpenDrawerRightIcon } from '@patternfly/react-icons/dist/esm/icons/open-drawer-right-icon';
import { useApplicationBreadcrumbs } from '../../utils/breadcrumb-utils';
import { HelpTopicLink } from '../HelpTopicLink/HelpTopicLink';
import PageLayout from '../PageLayout/PageLayout';
import GitImportForm from './GitImportForm';
import SampleImportForm from './SampleImportForm';

import './ImportForm.scss';

type ImportFormProps = {
  applicationName?: string;
};

const ImportForm: React.FunctionComponent<ImportFormProps> = ({ applicationName }) => {
  const [reviewMode, setReviewMode] = React.useState(false);

  const applicationBreadcrumbs = useApplicationBreadcrumbs(applicationName);

  const title = reviewMode ? 'Configure your components for deployment' : 'Grab some code';
  const description = reviewMode
    ? 'Review and define deployment settings and options.'
    : 'Provide a link to your GitHub repository or start with a no-fail sample.';
  const helpId = reviewMode ? 'rhtap-import-configure-component' : 'rhtap-import-add-component';

  return (
    <PageLayout
      breadcrumbs={[...applicationBreadcrumbs, { path: '#', name: 'Import' }]}
      title={title}
      description={
        <>
          {description}{' '}
          <HelpTopicLink topicId={helpId} isInline>
            Learn more <OpenDrawerRightIcon />
          </HelpTopicLink>
        </>
      }
    >
      <PageSection isFilled className="import-form">
        <GitImportForm
          applicationName={applicationName}
          reviewMode={reviewMode}
          setReviewMode={setReviewMode}
        />
        <br />
        {!reviewMode && <SampleImportForm applicationName={applicationName} />}
      </PageSection>
    </PageLayout>
  );
};

export default ImportForm;
