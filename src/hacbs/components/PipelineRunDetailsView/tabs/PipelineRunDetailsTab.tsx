import * as React from 'react';
import {
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Title,
} from '@patternfly/react-core';
import { calculateDuration } from '../../../utils/pipeline-utils';

type PipelineRunDetailsTabProps = {
  pipelineRun: any;
};

const PipelineRunDetailsTab: React.FC<PipelineRunDetailsTabProps> = ({ pipelineRun }) => {
  const duration = calculateDuration(
    typeof pipelineRun.status?.startTime === 'string' ? pipelineRun.status?.startTime : '',
    typeof pipelineRun.status?.completionTime === 'string'
      ? pipelineRun.status?.completionTime
      : '',
  );
  return (
    <>
      <Title headingLevel="h4" className="pf-c-title pf-u-mt-lg pf-u-mb-lg">
        Pipelinerun details
      </Title>
      <DescriptionList
        columnModifier={{
          default: '2Col',
        }}
      >
        <DescriptionListGroup>
          <DescriptionListTerm>Name</DescriptionListTerm>
          <DescriptionListDescription>{pipelineRun.metadata.name}</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Status</DescriptionListTerm>
          <DescriptionListDescription>
            {pipelineRun.status?.conditions[0].status === 'False' ? 'Failed' : 'Succeeded'}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Namespace</DescriptionListTerm>
          <DescriptionListDescription>{pipelineRun.metadata.namespace}</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Message</DescriptionListTerm>
          <DescriptionListDescription>
            {pipelineRun.status?.conditions[0].message}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Labels</DescriptionListTerm>
          <DescriptionListDescription>-</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Log snippet</DescriptionListTerm>
          <DescriptionListDescription>-</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Created at</DescriptionListTerm>
          <DescriptionListDescription>-</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Pipeline</DescriptionListTerm>
          <DescriptionListDescription>-</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Owner</DescriptionListTerm>
          <DescriptionListDescription>-</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Triggered by</DescriptionListTerm>
          <DescriptionListDescription>-</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Duration</DescriptionListTerm>
          <DescriptionListDescription>{duration}</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Application</DescriptionListTerm>
          <DescriptionListDescription>-</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup />
        <DescriptionListGroup>
          <DescriptionListTerm>Component</DescriptionListTerm>
          <DescriptionListDescription>
            {pipelineRun.metadata.labels['build.appstudio.openshift.io/component']}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup />
        <DescriptionListGroup>
          <DescriptionListTerm>Source</DescriptionListTerm>
          <DescriptionListDescription>-</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup />
        <DescriptionListGroup>
          <DescriptionListTerm>Workspace</DescriptionListTerm>
          <DescriptionListDescription>-</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup />
        <DescriptionListGroup>
          <DescriptionListTerm>Compliance</DescriptionListTerm>
          <DescriptionListDescription>-</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup />
        <DescriptionListGroup>
          <DescriptionListTerm>Environment</DescriptionListTerm>
          <DescriptionListDescription>-</DescriptionListDescription>
        </DescriptionListGroup>
      </DescriptionList>
    </>
  );
};

export default PipelineRunDetailsTab;
