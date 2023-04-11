import * as React from 'react';
import { Label, Tooltip } from '@patternfly/react-core';
import usePACState, { PACState } from '../../hooks/usePACState';
import { ComponentKind } from '../../types';
import { useTrackEvent, TrackEvents } from '../../utils/analytics';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';
import { createCustomizeComponentPipelineModalLauncher } from '../CustomizedPipeline/CustomizePipelinesModal';
import { useModalLauncher } from '../modal/ModalProvider';

type Props = {
  component: ComponentKind;
  onStateChange?: (state: PACState) => void;
  enableAction?: boolean;
};

const ComponentPACStateLabel: React.FC<Props> = ({ component, onStateChange, enableAction }) => {
  const { workspace } = useWorkspaceInfo();
  const track = useTrackEvent();
  const pacState = usePACState(component);
  const showModal = useModalLauncher();

  React.useEffect(() => {
    onStateChange?.(pacState);
    // omit onStateChange because we only need to notify when the state changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pacState]);

  const customizePipeline = React.useMemo(
    () =>
      enableAction
        ? () => {
            track(TrackEvents.ButtonClicked, {
              link_name: 'manage-build-pipeline',
              link_location: 'component-list-label',
              component_name: component.metadata.name,
              app_name: component.spec.application,
              workspace,
            });
            showModal(
              createCustomizeComponentPipelineModalLauncher(
                component.metadata.name,
                component.metadata.namespace,
              ),
            );
          }
        : null,
    [
      enableAction,
      showModal,
      component.metadata.name,
      component.metadata.namespace,
      component.spec.application,
      workspace,
      track,
    ],
  );

  const style = customizePipeline ? { cursor: 'pointer' } : undefined;
  switch (pacState) {
    case PACState.sample:
      return (
        <Tooltip content="This component currently uses our sample build pipeline. To enable automatic rebuild on commits to your main branch and pull requests, fork this sample and upgrade to a custom build pipeline.">
          <Label onClick={customizePipeline} aria-role="button" style={style}>
            Sample
          </Label>
        </Tooltip>
      );
    case PACState.disabled:
      return (
        <Tooltip content="This component currently uses our default build pipeline. To enable automatic rebuild on commits to your main branch and pull requests, upgrade to a custom build pipeline.">
          <Label color="blue" onClick={customizePipeline} aria-role="button" style={style}>
            Default
          </Label>
        </Tooltip>
      );
    case PACState.pending:
      return (
        <Tooltip content="No build pipeline is set for this component. To set a build pipeline for this component, merge the pull request containing the build pipeline we sent to your repository.">
          <Label color="gold" onClick={customizePipeline} aria-role="button" style={style}>
            Merge pull request
          </Label>
        </Tooltip>
      );
    case PACState.requested:
      return (
        <Tooltip content="We sent a pull request to your repository containing the default build pipeline for you to customize. Merge the pull request to set a build pipeline for this component.">
          <Label color="gold" onClick={customizePipeline} aria-role="button" style={style}>
            Sending pull request
          </Label>
        </Tooltip>
      );
    case PACState.ready:
      return (
        <Tooltip content="This component currently uses our custom build pipeline. Commits to your main branch and pull requests will automatically rebuild.">
          <Label
            color="green"
            onClick={customizePipeline}
            aria-role="button"
            style={{ cursor: 'pointer' }}
          >
            Custom
          </Label>
        </Tooltip>
      );

    case PACState.error:
      return (
        <Tooltip content="No build pipeline is set for this component. We attempted to send a pull request to your repository containing the default build pipeline, but the pull request never arrived. To try again, install the GitHub application and grant permissions for this component.">
          <Label color="red" onClick={customizePipeline} aria-role="button" style={style}>
            Pull request failed
          </Label>
        </Tooltip>
      );
    default:
      return null;
  }
};

export default ComponentPACStateLabel;
