import * as React from 'react';
import { Tooltip } from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons/dist/js/icons/outlined-question-circle-icon';

type HelpTooltipProps = {
  content: React.ReactNode;
};

const HelpTooltipIcon: React.FC<HelpTooltipProps> = ({ content }) => (
  <Tooltip content={content}>
    <OutlinedQuestionCircleIcon />
  </Tooltip>
);

export default HelpTooltipIcon;
