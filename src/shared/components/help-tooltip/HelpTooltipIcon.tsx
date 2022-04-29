import * as React from 'react';
import { Tooltip } from '@patternfly/react-core';
import { QuestionCircleIcon } from '@patternfly/react-icons/dist/js/icons/question-circle-icon';
import { global_palette_black_600 as grayColor } from '@patternfly/react-tokens/dist/js/global_palette_black_600';

type HelpTooltipProps = {
  content: React.ReactNode;
};

const HelpTooltipIcon: React.FC<HelpTooltipProps> = ({ content }) => (
  <Tooltip content={content}>
    <QuestionCircleIcon color={grayColor.value} />
  </Tooltip>
);

export default HelpTooltipIcon;
