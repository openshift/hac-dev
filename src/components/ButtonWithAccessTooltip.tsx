import * as React from 'react';
import { Tooltip } from '@patternfly/react-core';
import AnalyticsButton from './AnalyticsButton/AnalyticsButton';

export const ButtonWithAccessTooltip: React.FC<
  React.PropsWithChildren<
    React.ComponentProps<typeof AnalyticsButton> & { tooltip: React.ReactNode }
  >
> = ({ isDisabled, tooltip, ...props }) => {
  if (isDisabled) {
    return (
      <Tooltip content={tooltip}>
        <AnalyticsButton {...props} component={undefined} isAriaDisabled />
      </Tooltip>
    );
  }
  return <AnalyticsButton {...props} />;
};
