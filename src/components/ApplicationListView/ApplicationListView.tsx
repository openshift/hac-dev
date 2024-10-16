import * as React from 'react';
import { Link } from 'react-router-dom';
import { useFeatureFlag } from '@openshift/dynamic-plugin-sdk';
import {
  Bullseye,
  EmptyStateBody,
  PageSection,
  PageSectionVariants,
  SearchInput,
  Spinner,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from '@patternfly/react-core';
import { debounce } from 'lodash-es';
import { HACBS_FLAG } from '../../hacbs/hacbsFeatureFlag';
import { useApplications } from '../../hooks/useApplications';
import { useSearchParam } from '../../hooks/useSearchParam';
import emptyStateImgUrl from '../../imgs/Application.svg';
import imageUrl from '../../imgs/getting-started-illustration.svg';
import { ApplicationModel, ComponentModel } from '../../models';
import { Table } from '../../shared';
import AppEmptyState from '../../shared/components/empty-state/AppEmptyState';
import FilteredEmptyState from '../../shared/components/empty-state/FilteredEmptyState';
import { ApplicationKind } from '../../types';
import { useApplicationBreadcrumbs } from '../../utils/breadcrumb-utils';
import { useAccessReviewForModel } from '../../utils/rbac';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';
import { ButtonWithAccessTooltip } from '../ButtonWithAccessTooltip';
import { GettingStartedCard } from '../GettingStartedCard/GettingStartedCard';
import PageLayout from '../PageLayout/PageLayout';
import { ApplicationListHeader } from './ApplicationListHeader';
import ApplicationListRow from './ApplicationListRow';

const GETTING_STARTED_CARD_KEY = 'application-list-getting-started-card';

const ApplicationListView: React.FC<React.PropsWithChildren<unknown>> = () => {
  const [hacbs] = useFeatureFlag(HACBS_FLAG);
  const { namespace, workspace } = useWorkspaceInfo();
  const applicationBreadcrumbs = useApplicationBreadcrumbs();
  const [canCreateApplication] = useAccessReviewForModel(ApplicationModel, 'create');
  const [canCreateComponent] = useAccessReviewForModel(ComponentModel, 'create');
  const [nameFilter, setNameFilter] = useSearchParam('name', '');

  const [applications, loaded] = useApplications(namespace);
  applications?.sort(
    (app1, app2) =>
      +new Date(app2.metadata.creationTimestamp) - +new Date(app1.metadata.creationTimestamp),
  );

  const filteredApplications = React.useMemo(() => {
    const lowerCaseNameFilter = nameFilter.toLowerCase();
    return applications?.filter(
      (app) =>
        app.spec.displayName?.toLowerCase().includes(lowerCaseNameFilter) ??
        app.metadata.name.includes(lowerCaseNameFilter),
    );
  }, [nameFilter, applications]);

  const onClearFilters = () => {
    setNameFilter('');
  };

  const onNameInput = debounce((n: string) => {
    setNameFilter(n);
  }, 600);

  if (!loaded) {
    return (
      <Bullseye>
        <Spinner />
      </Bullseye>
    );
  }

  return (
    <>
      {!hacbs && applications.length === 0 && (
        <GettingStartedCard
          imgClassName="pf-v5-u-px-2xl-on-xl"
          localStorageKey={GETTING_STARTED_CARD_KEY}
          title="Create and manage your applications"
          imgSrc={imageUrl}
          imgAlt="Illustration showing users managing applications"
        >
          Your application will automatically be deployed to the development environment. Promote it
          across your stages and add components.
        </GettingStartedCard>
      )}
      <PageLayout
        breadcrumbs={applicationBreadcrumbs}
        title="Applications"
        description="An application is 1 or more components running together for building and releasing."
      >
        <PageSection
          padding={{ default: 'noPadding' }}
          variant={PageSectionVariants.light}
          isFilled
        >
          {!applications || applications.length === 0 ? (
            <AppEmptyState
              className="pf-v5-u-mx-lg"
              isXl
              emptyStateImg={emptyStateImgUrl}
              title="Easily onboard your applications"
            >
              <EmptyStateBody>
                Automate the building, testing, and deploying of your applications with just a few
                clicks.
                <br />
                To get started, create an application.
              </EmptyStateBody>
              <ButtonWithAccessTooltip
                variant="primary"
                component={(props) => (
                  <Link {...props} to={`/application-pipeline/workspaces/${workspace}/import`} />
                )}
                isDisabled={!(canCreateApplication && canCreateComponent)}
                tooltip="You don't have access to create an application"
                analytics={{
                  link_name: 'create-application',
                  workspace,
                }}
              >
                Create application
              </ButtonWithAccessTooltip>
            </AppEmptyState>
          ) : (
            <>
              <Toolbar usePageInsets>
                <ToolbarContent>
                  <ToolbarItem className="pf-v5-u-ml-0">
                    <SearchInput
                      name="nameInput"
                      data-test="name-input-filter"
                      type="search"
                      aria-label="name filter"
                      placeholder="Filter by name..."
                      onChange={(e, n) => onNameInput(n)}
                      value={nameFilter}
                    />
                  </ToolbarItem>
                  <ToolbarItem>
                    <ButtonWithAccessTooltip
                      variant="primary"
                      component={(props) => (
                        <Link
                          {...props}
                          to={`/application-pipeline/workspaces/${workspace}/import`}
                        />
                      )}
                      isDisabled={!(canCreateApplication && canCreateComponent)}
                      tooltip="You don't have access to create an application"
                      analytics={{
                        link_name: 'create-application',
                        workspace,
                      }}
                    >
                      Create application
                    </ButtonWithAccessTooltip>
                  </ToolbarItem>
                </ToolbarContent>
              </Toolbar>
              {filteredApplications.length !== 0 ? (
                <Table
                  data={filteredApplications}
                  aria-label="Application List"
                  Header={ApplicationListHeader}
                  Row={ApplicationListRow}
                  loaded
                  getRowProps={(obj: ApplicationKind) => ({
                    id: obj.metadata.name,
                  })}
                />
              ) : (
                <FilteredEmptyState onClearFilters={onClearFilters} />
              )}
            </>
          )}
        </PageSection>
      </PageLayout>
    </>
  );
};

export default ApplicationListView;
