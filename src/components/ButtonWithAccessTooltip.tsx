import * as React from 'react';
import { Button, ButtonProps, Tooltip } from '@patternfly/react-core';

export const ButtonWithAccessTooltip: React.FC<ButtonProps & { tooltip: React.ReactNode }> = ({
  isDisabled,
  tooltip,
  ...props
}) => {
  if (isDisabled) {
    return (
      <Tooltip content={tooltip}>
        <Button {...props} component={undefined} isAriaDisabled />
      </Tooltip>
    );
  }
  return <Button {...props} />;
};
