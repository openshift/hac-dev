import * as React from 'react';
import { Link } from 'react-router-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import {
  Bullseye,
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateSecondaryActions,
  PageSection,
  PageSectionVariants,
  Spinner,
  Text,
  Title,
} from '@patternfly/react-core';
import { OutlinedFileImageIcon } from '@patternfly/react-icons/dist/esm/icons/outlined-file-image-icon';
import { useNamespace } from '../../../utils/namespace-context-utils';
import { PipelineRunLabel } from '../../consts/pipelinerun';
import { PipelineRunGroupVersionKind } from '../../models';
import { PipelineRunKind } from '../../types';
import { getCommitsFromPLRs } from '../../utils/commits-utils';
import CommitsListView from './CommitsListView';

const COMMIT_LIMIT = 5;

const AppRecentCommits = ({ applicationName }) => {
  const namespace = useNamespace();

  const [pipelineRuns, loaded] = useK8sWatchResource<PipelineRunKind[]>({
    groupVersionKind: PipelineRunGroupVersionKind,
    namespace,
    isList: true,
    selector: {
      matchLabels: {
        [PipelineRunLabel.APPLICATION]: applicationName,
      },
    },
  });

  const commits = React.useMemo(
    () => (loaded && pipelineRuns && getCommitsFromPLRs(pipelineRuns, COMMIT_LIMIT)) ?? [],
    [pipelineRuns, loaded],
  );

  if (!loaded) {
    return (
      <PageSection padding={{ default: 'noPadding' }} variant={PageSectionVariants.light} isFilled>
        <Title size="lg" headingLevel="h3" className="pf-c-title pf-u-mt-lg pf-u-mb-sm">
          Recent commits
        </Title>
        <Text className="pf-u-mb-lg">
          Monitor your commits and their pipeline progression across all components
        </Text>
        <Bullseye>
          <Spinner />
        </Bullseye>
      </PageSection>
    );
  }

  return !commits || commits.length === 0 ? (
    <EmptyState>
      <EmptyStateIcon icon={OutlinedFileImageIcon} />
      <Title headingLevel="h4" size="lg">
        Monitor your commits and their pipeline progression across all components
      </Title>
      <EmptyStateBody>
        No commits found yet. <br />
        To get started, create components and merge their pull request for build pipeline.
      </EmptyStateBody>
      <EmptyStateSecondaryActions>
        <Button
          component={(props) => (
            <Link
              {...props}
              to={`/app-studio/applications/${applicationName}?activeTab=components&hacbs=true`}
            />
          )}
          variant="secondary"
          data-test="go-to-components-tab"
        >
          Go to components tab
        </Button>
      </EmptyStateSecondaryActions>
    </EmptyState>
  ) : (
    <CommitsListView commits={commits} applicationName={applicationName} recentOnly />
  );
};

export default AppRecentCommits;
