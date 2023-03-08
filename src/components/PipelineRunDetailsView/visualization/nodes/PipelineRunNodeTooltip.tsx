import * as React from 'react';
import { css } from '@patternfly/react-styles';
import styles from '@patternfly/react-styles/css/components/Topology/topology-pipelines';
import { getRunStatusModifier, RunStatus, StatusIcon } from '@patternfly/react-topology';
import { StepStatus } from '../types';

type PipelineRunNodeTooltipProps = {
  label: string;
  description?: string;
  steps?: StepStatus[];
};

const PipelineRunNodeTooltip: React.FunctionComponent<PipelineRunNodeTooltipProps> = ({
  label,
  description,
  steps,
}) => (
  <div className="pipelinerun-node__tooltip--content" data-testid="pipeline-run-tip">
    <div className="pipelinerun-node__tooltip--title">{label}</div>
    {description ? (
      <div className="pipelinerun-node__tooltip--description">{description}</div>
    ) : null}
    {steps?.map((step) => (
      <div key={step.name} className="pipelinerun-node__tooltip--step">
        <div className="pipelinerun-node__tooltip--step-icon">
          <StatusIcon
            className={css(
              styles.topologyPipelinesStatusIcon,
              getRunStatusModifier(step.status),
              (step.status === RunStatus.Running || step.status === RunStatus.InProgress) &&
                styles.modifiers.spin,
            )}
            status={step.status}
          />
        </div>
        <div className="pipelinerun-node__tooltip--step-name">{step.name}</div>
        <div>{step.duration}</div>
      </div>
    ))}
  </div>
);

export default PipelineRunNodeTooltip;
