import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateSecondaryActions,
  Title,
} from '@patternfly/react-core';
import { OutlinedFileImageIcon } from '@patternfly/react-icons/dist/esm/icons/outlined-file-image-icon';
import { Table } from '../../../../shared';
import { PipelineRunKind } from '../../../types';
import { PipelineRunListHeader } from '../../PipelineRunListView/PipelineRunListHeader';
import PipelineRunListRow from '../../PipelineRunListView/PipelineRunListRow';

type CommitsPipelineRunTabProps = {
  commit?: string;
  pipelineRuns: PipelineRunKind[];
  applicationName: string;
};
const CommitsPipelineRunTab: React.FC<CommitsPipelineRunTabProps> = ({
  pipelineRuns,
  applicationName,
}) => {
  if (!pipelineRuns || pipelineRuns.length === 0) {
    return (
      <EmptyState>
        <EmptyStateIcon icon={OutlinedFileImageIcon} />
        <Title headingLevel="h4" size="lg">
          Manage your components via pipelines. Monitor CI/CD activity.
        </Title>
        <EmptyStateBody>
          No pipeline run triggered yet.
          <br />
          To get started, create components and merge their pull request for build pipeline.
        </EmptyStateBody>
        {applicationName && (
          <EmptyStateSecondaryActions>
            <Button
              component={(props) => (
                <Link
                  {...props}
                  to={`/app-studio/applications/${applicationName}?activeTab=components`}
                />
              )}
              variant="secondary"
            >
              Go to components tab
            </Button>
          </EmptyStateSecondaryActions>
        )}
      </EmptyState>
    );
  }

  pipelineRuns?.sort(
    (app1, app2) =>
      +new Date(app2.metadata.creationTimestamp) - +new Date(app1.metadata.creationTimestamp),
  );

  return (
    <>
      <Title headingLevel="h4" className="pf-c-title pf-u-mt-lg pf-u-mb-lg">
        Pipeline runs
      </Title>
      <Table
        data={pipelineRuns}
        aria-label="Pipelinerun List"
        Header={PipelineRunListHeader}
        loaded
        Row={PipelineRunListRow}
        getRowProps={(obj: PipelineRunKind) => ({
          id: obj.metadata.name,
        })}
      />
    </>
  );
};

export default CommitsPipelineRunTab;
