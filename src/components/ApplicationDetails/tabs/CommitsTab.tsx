import * as React from 'react';
import { Link } from 'react-router-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import {
  Bullseye,
  EmptyState,
  EmptyStateIcon,
  Title,
  EmptyStateBody,
  Button,
  EmptyStateSecondaryActions,
  Spinner,
} from '@patternfly/react-core';
import { OutlinedFileImageIcon } from '@patternfly/react-icons/dist/esm/icons/outlined-file-image-icon';
import { PipelineRunLabel } from '../../../consts/pipelinerun';
import { PipelineRunGroupVersionKind } from '../../../models';
import { PipelineRunKind } from '../../../types';
import { getCommitsFromPLRs } from '../../../utils/commits-utils';
import { useNamespace } from '../../../utils/namespace-context-utils';
import CommitsListView from '../../Commits/CommitsListView';

type CommitTabProps = {
  applicationName: string;
};

const CommitsTab: React.FC<CommitTabProps> = ({ applicationName }) => {
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
    () => (loaded && pipelineRuns && getCommitsFromPLRs(pipelineRuns)) ?? [],
    [pipelineRuns, loaded],
  );

  if (!loaded) {
    return (
      <Bullseye>
        <Spinner />
      </Bullseye>
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
              to={`/stonesoup/applications/${applicationName}?activeTab=components`}
            />
          )}
          variant="secondary"
        >
          Go to components tab
        </Button>
      </EmptyStateSecondaryActions>
    </EmptyState>
  ) : (
    <CommitsListView commits={commits} />
  );
};

export default CommitsTab;
