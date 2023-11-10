import * as React from 'react';
import { Button, ButtonVariant, Tooltip } from '@patternfly/react-core';
import { PACState } from '../../hooks/usePACState';

type Props = {
  pacState: PACState;
};

const ComponentBuildTrigger: React.FC<React.PropsWithChildren<Props>> = ({ pacState }) => {
  if (pacState === PACState.disabled) {
    return (
      <Tooltip
        trigger="click"
        content="Trigger a new build manually from the component’s action menu. To enable an automatic trigger with every commit, upgrade the build pipeline plan to custom."
      >
        <Button variant={ButtonVariant.link} isInline>
          Manual
        </Button>
      </Tooltip>
    );
  }
  return (
    <Tooltip
      trigger="click"
      content="A new build pipeline run is automatically triggered with every commit to the source code."
    >
      <Button variant={ButtonVariant.link} isInline>
        Automatic
      </Button>
    </Tooltip>
  );
};

export default ComponentBuildTrigger;
