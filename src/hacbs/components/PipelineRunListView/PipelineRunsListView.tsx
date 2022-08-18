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
  Spinner,
  Title,
} from '@patternfly/react-core';
import { OutlinedFileImageIcon } from '@patternfly/react-icons/dist/esm/icons/outlined-file-image-icon';
import { Table } from '../../../shared';
import { useNamespace } from '../../../utils/namespace-context-utils';
import { PipelineRunLabel } from '../../consts/pipelinerun';
import { PipelineRunGroupVersionKind } from '../../models';
import { PipelineRunKind } from '../../types';
import { PipelineRunListHeader } from './PipelineRunListHeader';
import PipelineRunListRow from './PipelineRunListRow';

type PipelineRunsListViewProps = { applicationName: string };
const PipelineRunsListView: React.FC<PipelineRunsListViewProps> = ({ applicationName }) => {
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

  if (!loaded) {
    return (
      <Bullseye>
        <Spinner />
      </Bullseye>
    );
  }

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
        Pipelineruns
      </Title>
      <Table
        data={pipelineRuns}
        aria-label="Pipelinerun List"
        Header={PipelineRunListHeader}
        Row={PipelineRunListRow}
        loaded={loaded}
        getRowProps={(obj: PipelineRunKind) => ({
          id: obj.metadata.name,
        })}
      />
    </>
  );
};

export default PipelineRunsListView;
