import * as React from 'react';
import { Popover, Tooltip } from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons/dist/js/icons/outlined-question-circle-icon';
import { global_palette_black_600 as grayColor } from '@patternfly/react-tokens/dist/js/global_palette_black_600';

type OutlinedHelpPopoverProps = {
  content: React.ReactNode;
  heading?: React.ReactNode;
};

export const OutlinedHelpPopperIcon: React.FC<OutlinedHelpPopoverProps> = ({
  content,
  heading,
}) => (
  <Popover headerContent={heading} bodyContent={content}>
    <OutlinedQuestionCircleIcon color={grayColor.value} />
  </Popover>
);

type OutlinedHelpTooltipProps = {
  content: React.ReactNode;
};

export const OutlinedHelpTooltipIcon: React.FC<OutlinedHelpTooltipProps> = ({ content }) => (
  <Tooltip content={content}>
    <OutlinedQuestionCircleIcon color={grayColor.value} />
  </Tooltip>
);
