import * as React from 'react';
import { Bullseye, Spinner } from '@patternfly/react-core';
import { PipelineRunLabel } from '../../../consts/pipelinerun';
import { usePipelineRuns } from '../../../hooks/usePipelineRuns';
import { StatusBox } from '../../../shared/components/status-box/StatusBox';
import { PipelineRunKind } from '../../../types';
import PipelineRunEmptyState from '../../PipelineRunDetailsView/PipelineRunEmptyState';
import SnapshotPipelineRunsList from './SnapshotPipelineRunsList';

type SnapshotPipelineRunTabProps = {
  commit?: string;
  snapshotName: string;
  applicationName: string;
  namespace: string;
  customFilter?: (plr: PipelineRunKind) => boolean;
};
const SnapshotPipelineRunTab: React.FC<React.PropsWithChildren<SnapshotPipelineRunTabProps>> = ({
  snapshotName,
  applicationName,
  namespace,
  customFilter,
}) => {
  const [pipelineRuns, loaded, LoadError, getNextPage] = usePipelineRuns(
    namespace,
    React.useMemo(
      () => ({
        selector: {
          matchLabels: { [PipelineRunLabel.APPLICATION]: applicationName },
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

  React.useEffect(() => {
    if (loaded && SnapshotPipelineRuns.length === 0 && getNextPage) {
      getNextPage();
    }
  }, [getNextPage, loaded, SnapshotPipelineRuns.length]);

  SnapshotPipelineRuns?.sort(
    (app1, app2) =>
      +new Date(app2.metadata.creationTimestamp) - +new Date(app1.metadata.creationTimestamp),
  );

  if (!loaded && pipelineRuns.length === 0) {
    return (
      <Bullseye data-test="snapshot-plr-loading">
        <Spinner />
      </Bullseye>
    );
  }

  if (LoadError) {
    <StatusBox loadError={LoadError} loaded={loaded} />;
  }

  if (loaded && (!SnapshotPipelineRuns || SnapshotPipelineRuns.length === 0)) {
    return <PipelineRunEmptyState applicationName={applicationName} />;
  }

  return (
    <SnapshotPipelineRunsList
      customFilter={customFilter}
      snapshotPipelineRuns={SnapshotPipelineRuns}
      loaded={loaded}
      applicationName={applicationName}
      getNextPage={getNextPage}
    />
  );
};

export default SnapshotPipelineRunTab;
