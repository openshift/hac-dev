import * as React from 'react';
import { calculateDuration } from '../../../../utils/pipeline-utils';
import { ColoredStatusIcon } from '../../../topology/StatusIcon';
import { StepStatus } from '../types';

type PipelineRunNodeTooltipProps = {
  label: string;
  description?: string;
  steps?: StepStatus[];
};

const Duration: React.FC<{ startTime?: string | number; endTime?: string | number }> = ({
  startTime,
  endTime,
}) => {
  const [updatedEndTime, setEndTime] = React.useState<string | number>();
  React.useEffect(() => {
    if (endTime == null) {
      const handle = setInterval(() => {
        setEndTime(Date.now());
      }, 1000);
      return () => clearInterval(handle);
    }
  }, [endTime]);
  return <>{startTime != null ? calculateDuration(startTime, endTime || updatedEndTime) : ''}</>;
};

const PipelineRunNodeTooltip: React.FunctionComponent<PipelineRunNodeTooltipProps> = ({
  label,
  steps,
}) => (
  <div className="pipelinerun-node__tooltip--content" data-testid="pipeline-run-tip">
    <div className="pipelinerun-node__tooltip--title">{label}</div>
    {steps?.map((step) => (
      <div key={step.name} className="pipelinerun-node__tooltip--step">
        <div className="pipelinerun-node__tooltip--step-icon">
          <ColoredStatusIcon status={step.status} />
        </div>
        <div className="pipelinerun-node__tooltip--step-name">{step.name}</div>
        <div>
          <Duration startTime={step.startTime} endTime={step.endTime} />
        </div>
      </div>
    ))}
  </div>
);

export default PipelineRunNodeTooltip;
