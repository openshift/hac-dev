import * as React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { Bullseye, Spinner } from '@patternfly/react-core';
import { NamespaceContext } from '../../../components/NamespacedPage/NamespacedPage';
import { PipelineRunGroupVersionKind } from '../../models';
import { PipelineRunKind } from '../../types';
import DetailsPage from '../ApplicationDetails/DetailsPage';
import PipelineRunDetailsTab from './tabs/PipelineRunDetailsTab';
import PipelineRunEnterpriseContractTab from './tabs/PipelineRunEnterpriseContractTab';
import PipelineRunEventsTab from './tabs/PipelineRunEventsTab';
import PipelineRunLogsTab from './tabs/PipelineRunLogsTab';
import PipelineRunTaskRunsTab from './tabs/PipelineRunTaskRunsTab';
import PipelineRunYamlTab from './tabs/PipelineRunYamlTab';

type PipelineRunDetailsViewProps = {
  pipelineRunName: string;
};

export const PipelineRunDetailsView: React.FC<PipelineRunDetailsViewProps> = ({
  pipelineRunName,
}) => {
  const { namespace } = React.useContext(NamespaceContext);

  const [pipelineRun, loaded] = useK8sWatchResource<PipelineRunKind>({
    groupVersionKind: PipelineRunGroupVersionKind,
    name: pipelineRunName,
    namespace,
  });

  if (!loaded) {
    return (
      <Bullseye>
        <Spinner />
      </Bullseye>
    );
  }

  return (
    <>
      <React.Fragment>
        <DetailsPage
          breadcrumbs={[
            { path: '/app-studio/applications', name: 'Applications' },
            {
              path: `/app-studio/applications/:${pipelineRunName}`,
              name: pipelineRunName,
            },
          ]}
          title={pipelineRunName}
          actions={[
            {
              key: 'rerun',
              label: 'Rerun',
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
            {
              key: 'yaml',
              label: 'YAML',
              component: <PipelineRunYamlTab pipelineRun={pipelineRun} />,
            },
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
            {
              key: 'events',
              label: 'Events',
              component: <PipelineRunEventsTab pipelineRun={pipelineRun} />,
            },
            {
              key: 'enterprisecontract',
              label: 'Enterprise Contract',
              component: <PipelineRunEnterpriseContractTab pipelineRun={pipelineRun} />,
            },
          ]}
        />
      </React.Fragment>
    </>
  );
};

export default PipelineRunDetailsView;
