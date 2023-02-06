import * as React from 'react';
import { Label, Tooltip } from '@patternfly/react-core';
import usePACState, { PACState } from '../../hooks/usePACState';
import { ComponentKind } from '../../types';
import { createCustomizePipelinesModalLauncher } from '../CustomizedPipeline/CustomizePipelinesModal';
import { useModalLauncher } from '../modal/ModalProvider';

type Props = {
  component: ComponentKind;
  onStateChange?: (state: PACState) => void;
};

const ComponentPACStateLabel: React.FC<Props> = ({ component, onStateChange }) => {
  const pacState = usePACState(component);
  const showModal = useModalLauncher();

  React.useEffect(() => {
    onStateChange?.(pacState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pacState]);

  const customizePipeline = React.useCallback(
    () => showModal(createCustomizePipelinesModalLauncher([component])),
    [showModal, component],
  );

  switch (pacState) {
    case PACState.sample:
      return (
        <Tooltip content="You cannot customize the build pipeline of a sample. Fork the sample to your own repository and create a new component.">
          <Label>Sample</Label>
        </Tooltip>
      );
    case PACState.disabled:
      return (
        <Tooltip content="Currently using our default pipeline.">
          <Label
            color="blue"
            onClick={customizePipeline}
            aria-role="button"
            style={{ cursor: 'pointer' }}
          >
            Default build
          </Label>
        </Tooltip>
      );
    case PACState.pending:
      return (
        <Tooltip content="No build pipeline is set for this component. Merge the pull request containing the build pipeline we have sent to your respository.">
          <Label
            color="gold"
            onClick={customizePipeline}
            aria-role="button"
            style={{ cursor: 'pointer' }}
          >
            Pull request sent
          </Label>
        </Tooltip>
      );
    case PACState.requested:
      return (
        <Tooltip content="Currently using our default build pipeline. We've attempted to send a pull request with the default build piepline for you to customize, but it has not reached its destination yet.">
          <Label
            color="gold"
            onClick={customizePipeline}
            aria-role="button"
            style={{ cursor: 'pointer' }}
          >
            Sending pull request
          </Label>
        </Tooltip>
      );
    case PACState.ready:
      return (
        <Tooltip content="Currently using a custom build pipeline merged in your component's repository.">
          <Label
            color="green"
            onClick={customizePipeline}
            aria-role="button"
            style={{ cursor: 'pointer' }}
          >
            Custom build
          </Label>
        </Tooltip>
      );
    default:
      return null;
  }
};

export default ComponentPACStateLabel;
