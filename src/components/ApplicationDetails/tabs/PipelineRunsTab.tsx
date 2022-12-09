import * as React from 'react';
import PipelineRunListView from '../../PipelineRunListView/PipelineRunsListView';

type PipelineRunsTabProps = {
  applicationName: string;
};

const PipelineRunsTab: React.FC<PipelineRunsTabProps> = ({ applicationName }) => {
  return <PipelineRunListView applicationName={applicationName} />;
};

export default PipelineRunsTab;
