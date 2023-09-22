import * as React from 'react';
import { Label, Skeleton, Tooltip } from '@patternfly/react-core';
import usePACState, { PACState } from '../../hooks/usePACState';
import { ComponentKind } from '../../types';
import { useTrackEvent, TrackEvents } from '../../utils/analytics';
import { useComponentBuildStatus } from '../../utils/component-utils';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';
import { createCustomizeComponentPipelineModalLauncher } from '../CustomizedPipeline/CustomizePipelinesModal';
import { useModalLauncher } from '../modal/ModalProvider';

type Props = {
  component: ComponentKind;
  onStateChange?: (state: PACState) => void;
  enableAction?: boolean;
  pacState?: PACState;
};

const ComponentPACStateLabelInner: React.FC<Props & { pacState: PACState }> = ({
  component,
  onStateChange,
  enableAction,
  pacState,
}) => {
  const { workspace } = useWorkspaceInfo();
  const track = useTrackEvent();
  const showModal = useModalLauncher();
  const buildStatus = useComponentBuildStatus(component);
  const pacError = buildStatus?.pac?.['error-message'];

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
    case PACState.configureRequested:
    case PACState.unconfigureRequested:
      return (
        <Tooltip content="We sent a pull request to your repository containing the default build pipeline for you to customize. Merge the pull request to set a build pipeline for this component.">
          <Label color="gold" onClick={customizePipeline} aria-role="button" style={style}>
            {pacState === PACState.configureRequested ? 'Sending pull request' : 'Rolling back'}
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
        <Tooltip content={pacError}>
          <Label color="red" onClick={customizePipeline} aria-role="button" style={style}>
            Pull request failed
          </Label>
        </Tooltip>
      );

    case PACState.loading:
      return <Skeleton width="100px" screenreaderText="Loading build pipeline plan" />;

    default:
      return null;
  }
};

const ComponentPACStateLabelFetcher: React.FC<Props> = ({
  component,
  onStateChange,
  enableAction,
}) => {
  const pacState = usePACState(component);
  return (
    <ComponentPACStateLabelInner
      component={component}
      pacState={pacState}
      onStateChange={onStateChange}
      enableAction={enableAction}
    />
  );
};

const ComponentPACStateLabel: React.FC<Props> = ({ component, pacState, ...rest }) => {
  if (pacState) {
    return <ComponentPACStateLabelInner component={component} pacState={pacState} {...rest} />;
  }
  return <ComponentPACStateLabelFetcher component={component} {...rest} />;
};

export default ComponentPACStateLabel;
