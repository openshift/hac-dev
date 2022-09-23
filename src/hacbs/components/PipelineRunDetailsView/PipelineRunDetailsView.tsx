import * as React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { Bullseye, Spinner } from '@patternfly/react-core';
import { pipelineRunFilterReducer } from '../../../shared';
import { StatusIconWithText } from '../../../shared/components/pipeline-run-logs/StatusIcon';
import { useNamespace } from '../../../utils/namespace-context-utils';
import { PipelineRunLabel } from '../../consts/pipelinerun';
import { PipelineRunGroupVersionKind } from '../../models';
import { PipelineRunKind } from '../../types';
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

  const [pipelineRun, loaded] = useK8sWatchResource<PipelineRunKind>({
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

  const applicationName = pipelineRun.metadata.labels[PipelineRunLabel.APPLICATION];
  return (
    <>
      <React.Fragment>
        <DetailsPage
          breadcrumbs={[
            { path: '/app-studio/applications', name: 'Applications' },
            {
              path: `/app-studio/applications/${applicationName}`,
              name: applicationName,
            },
            {
              path: `/app-studio/applications/:${pipelineRunName}?activeTab=pipelineRuns`,
              name: 'Pipeline runs',
            },
            {
              path: `/app-studio/applications/:${pipelineRunName}`,
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
              key: 'rerun',
              label: 'Rerun',
              href: '',
              isDisabled: true,
            },
            {
              key: 'cancel',
              label: 'Cancel',
              href: '',
              isDisabled: true,
            },
            {
              key: 'stop',
              label: 'Stop',
              href: '',
              isDisabled: true,
            },
          ]}
          tabs={[
            {
              key: 'detail',
              label: 'Details',
              component: <PipelineRunDetailsTab pipelineRun={pipelineRun} />,
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
