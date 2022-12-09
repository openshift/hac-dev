import * as React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { Bullseye, Spinner } from '@patternfly/react-core';
import { PipelineRunLabel } from '../../consts/pipelinerun';
import { pipelineRunCancel, pipelineRunStop } from '../../hacbs/utils/pipeline-actions';
import { PipelineRunGroupVersionKind } from '../../models/pipelineruns';
import { pipelineRunFilterReducer } from '../../shared';
import { StatusIconWithText } from '../../shared/components/pipeline-run-logs/StatusIcon';
import { PipelineRunKind } from '../../types';
import { useNamespace } from '../../utils/namespace-context-utils';
import DetailsPage from '../ApplicationDetails/DetailsPage';
import PipelineRunDetailsTab from './tabs/PipelineRunDetailsTab';
import PipelineRunLogsTab from './tabs/PipelineRunLogsTab';
import PipelineRunTaskRunsTab from './tabs/PipelineRunTaskRunsTab';

type PipelineRunDetailsViewProps = {
  pipelineRunName: string;
};

export const PipelineRunDetailsView: React.FC<PipelineRunDetailsViewProps> = ({
  pipelineRunName,
}) => {
  const namespace = useNamespace();

  const [pipelineRun, loaded, error] = useK8sWatchResource<PipelineRunKind>({
    groupVersionKind: PipelineRunGroupVersionKind,
    name: pipelineRunName,
    namespace,
  });

  const plrStatus = React.useMemo(
    () => loaded && pipelineRun && pipelineRunFilterReducer(pipelineRun),
    [loaded, pipelineRun],
  );

  if (!loaded) {
    return (
      <Bullseye>
        <Spinner />
      </Bullseye>
    );
  }

  const applicationName = pipelineRun.metadata?.labels[PipelineRunLabel.APPLICATION];
  return (
    <>
      <React.Fragment>
        <DetailsPage
          breadcrumbs={[
            { path: '/stonesoup/applications', name: 'Applications' },
            {
              path: `/stonesoup/applications/${applicationName}`,
              name: applicationName,
            },
            {
              path: `/stonesoup/applications/${applicationName}?activeTab=pipelineruns`,
              name: 'Pipeline runs',
            },
            {
              path: `/stonesoup/applications/${pipelineRunName}`,
              name: pipelineRunName,
            },
          ]}
          title={
            <>
              <span className="pf-u-mr-sm">{pipelineRunName}</span>
              <StatusIconWithText status={plrStatus} />
            </>
          }
          actions={[
            {
              key: 'stop',
              label: 'Stop',
              tooltip: 'Let the running tasks complete, then execute finally tasks',
              isDisabled: !(plrStatus && plrStatus === 'Running'),
              onClick: () => pipelineRunStop(pipelineRun),
            },
            {
              key: 'cancel',
              label: 'Cancel',
              tooltip: 'Interrupt any executing non finally tasks, then execute finally tasks',
              isDisabled: !(plrStatus && plrStatus === 'Running'),
              onClick: () => pipelineRunCancel(pipelineRun),
            },
          ]}
          tabs={[
            {
              key: 'detail',
              label: 'Details',
              component: <PipelineRunDetailsTab pipelineRun={pipelineRun} error={error} />,
            },
            // {
            //   key: 'yaml',
            //   label: 'YAML',
            //   component: <PipelineRunYamlTab pipelineRun={pipelineRun} />,
            // },
            {
              key: 'taskruns',
              label: 'Task runs',
              component: <PipelineRunTaskRunsTab pipelineRun={pipelineRun} />,
            },
            {
              key: 'logs',
              label: 'Logs',
              component: <PipelineRunLogsTab pipelineRun={pipelineRun} />,
            },
            // {
            //   key: 'events',
            //   label: 'Events',
            //   component: <PipelineRunEventsTab pipelineRun={pipelineRun} />,
            // },
          ]}
        />
      </React.Fragment>
    </>
  );
};

export default PipelineRunDetailsView;
