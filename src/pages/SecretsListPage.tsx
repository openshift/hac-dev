import React from 'react';
import { Helmet } from 'react-helmet';
import { Divider, PageSection, PageSectionVariants } from '@patternfly/react-core';
import { OpenDrawerRightIcon } from '@patternfly/react-icons/dist/esm/icons/open-drawer-right-icon';
import { HelpTopicLink } from '../components/HelpTopicLink/HelpTopicLink';
import NamespacedPage from '../components/NamespacedPage/NamespacedPage';
import PageAccessCheck from '../components/PageAccess/PageAccessCheck';
import PageLayout from '../components/PageLayout/PageLayout';
import SecretsListView from '../components/Secrets/SecretsListView/SecretsListView';
import { FULL_APPLICATION_TITLE } from '../consts/labels';
import { RemoteSecretModel } from '../models';
import { AccessReviewResources } from '../types';

const SecretsListPage: React.FC = () => {
  const accessReviewResources: AccessReviewResources = [{ model: RemoteSecretModel, verb: 'list' }];

  return (
    <NamespacedPage>
      <PageAccessCheck accessReviewResources={accessReviewResources}>
        <Helmet>
          <title>Secrets | {FULL_APPLICATION_TITLE}</title>
        </Helmet>
        <PageLayout
          title="Secrets"
          description={
            <>
              Manage your build and deployment secrets and their related configurations. You can add
              a secret at the workspace level.
              <br /> All secrets are stored using AWS Secrets Manager to keep your data private.
              <HelpTopicLink topicId={'rhtap-secrets-secrets'}>
                Learn more <OpenDrawerRightIcon />
              </HelpTopicLink>
            </>
          }
        >
          <Divider style={{ background: 'white', paddingTop: 'var(--pf-v5-global--spacer--md)' }} />

          <PageSection variant={PageSectionVariants.light} isFilled>
            <SecretsListView readOnly />
          </PageSection>
        </PageLayout>
      </PageAccessCheck>
    </NamespacedPage>
  );
};

export default SecretsListPage;
