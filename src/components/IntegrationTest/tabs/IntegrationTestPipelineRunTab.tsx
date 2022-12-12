import * as React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { Bullseye, Spinner, Title } from '@patternfly/react-core';
import { PipelineRunLabel } from '../../../consts/pipelinerun';
import { IntegrationTestLabels } from '../../../hacbs/components/ImportForm/types';
import { PipelineRunGroupVersionKind } from '../../../models';
import { Table } from '../../../shared';
import { PipelineRunKind } from '../../../types';
import { useNamespace } from '../../../utils/namespace-context-utils';
import PipelineRunEmptyState from '../../PipelineRunDetailsView/PipelineRunEmptyState';
import { PipelineRunListHeader } from '../../PipelineRunListView/PipelineRunListHeader';
import PipelineRunListRow from '../../PipelineRunListView/PipelineRunListRow';

type IntegrationTestPipelineRunTabProps = { applicationName: string; testName: string };
const IntegrationTestPipelineRunTab: React.FC<IntegrationTestPipelineRunTabProps> = ({
  applicationName,
  testName,
}) => {
  const namespace = useNamespace();

  const [pipelineRuns, loaded] = useK8sWatchResource<PipelineRunKind[]>({
    groupVersionKind: PipelineRunGroupVersionKind,
    namespace,
    isList: true,
    selector: {
      matchLabels: {
        [PipelineRunLabel.APPLICATION]: applicationName,
        [IntegrationTestLabels.SCENARIO]: testName,
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
    return <PipelineRunEmptyState applicationName={applicationName} />;
  }

  pipelineRuns?.sort(
    (app1, app2) =>
      +new Date(app2.metadata.creationTimestamp) - +new Date(app1.metadata.creationTimestamp),
  );

  return (
    <>
      <Title headingLevel="h3" className="pf-c-title pf-u-mt-lg pf-u-mb-lg">
        Pipeline runs
      </Title>
      <Table
        data={pipelineRuns}
        aria-label="Pipeline run List"
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

export default IntegrationTestPipelineRunTab;
