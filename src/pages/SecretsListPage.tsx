import React from 'react';
import { Helmet } from 'react-helmet';
import { Divider, PageSection, PageSectionVariants } from '@patternfly/react-core';
import NamespacedPage from '../components/NamespacedPage/NamespacedPage';
import PageAccessCheck from '../components/PageAccess/PageAccessCheck';
import PageLayout from '../components/PageLayout/PageLayout';
import SecretsListView from '../components/Secrets/SecretsListView/SecretsListView';
import { FULL_APPLICATION_TITLE } from '../consts/labels';
import { RemoteSecretModel } from '../models';
import ExternalLink from '../shared/components/links/ExternalLink';
import { AccessReviewResources } from '../types';
import { useWorkspaceBreadcrumbs } from '../utils/breadcrumb-utils';

const SecretsListPage: React.FC<React.PropsWithChildren<unknown>> = () => {
  const accessReviewResources: AccessReviewResources = [{ model: RemoteSecretModel, verb: 'list' }];
  const breadcrumbs = useWorkspaceBreadcrumbs();
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
              Manage your secrets and their related configurations. You can add a secret at the
              workspace level.
              <br /> All secrets are stored using AWS Secrets Manager to keep your data private.{' '}
              <ExternalLink href="https://konflux-ci.dev/docs/how-tos/configuring/creating-secrets/">
                Learn more
              </ExternalLink>
            </>
          }
          breadcrumbs={[
            ...breadcrumbs,
            {
              path: '#',
              name: 'Secrets',
            },
          ]}
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
