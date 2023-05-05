import React from 'react';
import { Bullseye, PageSection, Spinner } from '@patternfly/react-core';
import { OpenDrawerRightIcon } from '@patternfly/react-icons/dist/esm/icons/open-drawer-right-icon';
import { useApplicationBreadcrumbs } from '../../utils/breadcrumb-utils';
import { HelpTopicLink } from '../HelpTopicLink/HelpTopicLink';
import PageLayout from '../PageLayout/PageLayout';
import GitImportForm from './GitImportForm';
import SampleImportForm from './SampleImportForm';
import { useValidApplicationName } from './utils/useValidApplicationName';

import './ImportForm.scss';

type ImportFormProps = {
  applicationName?: string;
};

const ImportForm: React.FunctionComponent<ImportFormProps> = ({ applicationName }) => {
  const [reviewMode, setReviewMode] = React.useState(false);
  const [validAppName, appNameloaded] = useValidApplicationName();

  const applicationBreadcrumbs = useApplicationBreadcrumbs(applicationName);

  const title = reviewMode ? 'Configure your components for deployment' : 'Grab some code';
  const description = reviewMode
    ? 'Review and define deployment settings and options.'
    : 'Provide a link to your GitHub repository or start with a no-fail sample.';
  const helpId = reviewMode ? 'rhtap-import-configure-component' : 'rhtap-import-add-component';

  if (!appNameloaded) {
    return (
      <Bullseye>
        <Spinner />
      </Bullseye>
    );
  }

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
          recommendedApplicationName={validAppName}
          reviewMode={reviewMode}
          setReviewMode={setReviewMode}
        />
        <br />
        {!reviewMode && (
          <SampleImportForm
            applicationName={applicationName}
            recommendedApplicationName={validAppName}
          />
        )}
      </PageSection>
    </PageLayout>
  );
};

export default ImportForm;
