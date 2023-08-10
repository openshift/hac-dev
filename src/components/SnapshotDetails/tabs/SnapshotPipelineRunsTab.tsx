import * as React from 'react';
import { Title } from '@patternfly/react-core';
import { PipelineRunLabel } from '../../../consts/pipelinerun';
import { usePipelineRuns } from '../../../hooks/usePipelineRuns';
import { Table } from '../../../shared';
import { LoadingBox } from '../../../shared/components/status-box/StatusBox';
import { PipelineRunKind } from '../../../types';
import PipelineRunEmptyState from '../../PipelineRunDetailsView/PipelineRunEmptyState';
import { PipelineRunListHeaderWithVulnerabilities } from '../../PipelineRunListView/PipelineRunListHeader';
import { PipelineRunListRowWithVulnerabilities } from '../../PipelineRunListView/PipelineRunListRow';

type SnapshotPipelineRunTabProps = {
  commit?: string;
  snapshotName: string;
  applicationName: string;
  namespace: string;
};
const SnapshotPipelineRunTab: React.FC<SnapshotPipelineRunTabProps> = ({
  snapshotName,
  applicationName,
  namespace,
}) => {
  const [pipelineRuns, loaded, LoadError] = usePipelineRuns(
    namespace,
    React.useMemo(
      () => ({
        selector: {
          matchLabels: {
            [PipelineRunLabel.APPLICATION]: applicationName,
          },
        },
      }),
      [applicationName],
    ),
  );

  const SnapshotPipelineRuns = React.useMemo(() => {
    if (loaded && !LoadError) {
      return pipelineRuns.filter(
        (plr) =>
          plr.metadata?.annotations &&
          plr.metadata.annotations[PipelineRunLabel.SNAPSHOT] === snapshotName,
      );
    }
    return [];
  }, [loaded, LoadError, pipelineRuns, snapshotName]);

  if (!loaded) {
    <LoadingBox />;
  }

  if (loaded && (!SnapshotPipelineRuns || SnapshotPipelineRuns.length === 0)) {
    return <PipelineRunEmptyState applicationName={applicationName} />;
  }

  SnapshotPipelineRuns?.sort(
    (app1, app2) =>
      +new Date(app2.metadata.creationTimestamp) - +new Date(app1.metadata.creationTimestamp),
  );

  return (
    <>
      <Title headingLevel="h4" className="pf-c-title pf-u-mt-lg pf-u-mb-lg">
        Pipeline runs
      </Title>
      <Table
        data={SnapshotPipelineRuns}
        aria-label="Pipelinerun List"
        Header={PipelineRunListHeaderWithVulnerabilities}
        loaded
        Row={PipelineRunListRowWithVulnerabilities}
        getRowProps={(obj: PipelineRunKind) => ({
          id: obj.metadata.name,
        })}
      />
    </>
  );
};

export default SnapshotPipelineRunTab;
