import * as React from 'react';
import {
  Alert,
  AlertActionCloseButton,
  AlertActionLink,
  AlertVariant,
  Text,
  TextContent,
  TextVariants,
  Title,
} from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons/dist/esm/icons/external-link-alt-icon';
import { PipelineRunLabel } from '../../consts/pipelinerun';
import ExternalLink from '../../shared/components/links/ExternalLink';
import { ComponentKind, PipelineRunKind } from '../../types';
import { default as BaseComponentListView } from '../ComponentsListView/ComponentListView';
import BuildStatusColumn, { getURLForComponentPRs, hasPACAnnotation } from './BuildStatusColumn';
import ComponentsFilterToolbarGroups, {
  NEEDS_MERGE_FILTER_ID,
} from './ComponentsFilterToolbarGroups';

type ComponentListViewProps = {
  applicationName: string;
  components: ComponentKind[];
  title?: React.ReactNode;
};

const ComponentListView: React.FC<ComponentListViewProps> = ({ applicationName, components }) => {
  const [mergeAlertHidden, setMergeAlertHidden] = React.useState<boolean>(false);

  const mergeFilter = (
    component: ComponentKind,
    statusFilters: string[],
    pipelineBuildRuns: PipelineRunKind[],
  ) => {
    const unMerged = !pipelineBuildRuns?.find(
      ({ metadata: { labels } }) =>
        labels?.[PipelineRunLabel.COMPONENT] === component.metadata.name,
    );
    return unMerged && statusFilters.includes(NEEDS_MERGE_FILTER_ID);
  };

  const renderToolbarGroups = (
    statusFilters: string[],
    setStatusFilters: (filters: string[]) => void,
    pipelineRuns: PipelineRunKind[],
  ) => (
    <ComponentsFilterToolbarGroups
      components={components}
      pipelineRuns={pipelineRuns}
      statusFilters={statusFilters}
      setStatusFilters={setStatusFilters}
    />
  );

  const renderTitle = (pipelineRuns: PipelineRunKind[]) => {
    const allMerged = components.every(
      (component) =>
        !hasPACAnnotation(component) ||
        pipelineRuns.find(
          ({ metadata: { labels } }) =>
            labels?.[PipelineRunLabel.COMPONENT] === component.metadata.name,
        ),
    );
    return (
      <>
        <Title headingLevel="h3" className="pf-u-mt-lg pf-u-mb-sm">
          Components
        </Title>
        <TextContent>
          <Text component={TextVariants.p}>
            Components are the things that construct the app, they are usually mapped to a repo.{' '}
            <ExternalLink
              href="#"
              text={
                <>
                  Learn more <ExternalLinkAltIcon />
                </>
              }
            />
          </Text>
        </TextContent>
        {!allMerged && !mergeAlertHidden ? (
          <Alert
            className="pf-u-mt-md"
            variant={AlertVariant.warning}
            isInline
            title="Merge pull requests of a build pipeline to your source code"
            actionClose={<AlertActionCloseButton onClose={() => setMergeAlertHidden(true)} />}
            actionLinks={
              <AlertActionLink
                onClick={() => window.open(getURLForComponentPRs(components), '_blank')}
              >
                View all pull requests
              </AlertActionLink>
            }
            data-testid="components-unmerged-build-pr"
          >
            <p>
              In order to trigger your builds, merge the build pipeline pull request we have sent
              for you.
            </p>
          </Alert>
        ) : null}
      </>
    );
  };
  return (
    <BaseComponentListView
      applicationName={applicationName}
      components={components}
      additionalStatusFilter={mergeFilter}
      BuildStatusComponent={BuildStatusColumn}
      renderToolbarGroups={renderToolbarGroups}
      renderTitle={renderTitle}
    />
  );
};

export default ComponentListView;
