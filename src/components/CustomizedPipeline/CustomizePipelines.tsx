import * as React from 'react';
import {
  Alert,
  AlertVariant,
  Button,
  ButtonVariant,
  Dropdown,
  DropdownItem,
  DropdownPosition,
  KebabToggle,
  Modal,
  ModalBoxBody,
  ModalBoxFooter,
  ModalBoxHeader,
  pluralize,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';
import { Tbody, Thead, Th, Tr, Td, TableComposable } from '@patternfly/react-table';
import { useApplicationPipelineGitHubApp } from '../../hooks/useApplicationPipelineGitHubApp';
import { PACState } from '../../hooks/usePACState';
import sendIconUrl from '../../imgs/send.svg';
import successIconUrl from '../../imgs/success.svg';
import { ComponentModel } from '../../models';
import ExternalLink from '../../shared/components/links/ExternalLink';
import { ComponentKind } from '../../types';
import { useTrackEvent, TrackEvents } from '../../utils/analytics';
import { enablePAC, disablePAC, useComponentBuildStatus } from '../../utils/component-utils';
import { useAccessReviewForModel } from '../../utils/rbac';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';
import AnalyticsButton from '../AnalyticsButton/AnalyticsButton';
import { ButtonWithAccessTooltip } from '../ButtonWithAccessTooltip';
import ComponentPACStateLabel from '../Components/ComponentPACStateLabel';
import GitRepoLink from '../GitLink/GitRepoLink';
import { RawComponentProps } from '../modal/createModalLauncher';

type Props = RawComponentProps & {
  components: ComponentKind[];
};

const ComponentKebab: React.FC<{
  state: PACState;
  component: ComponentKind;
  canPatchComponent?: boolean;
}> = ({ component, state, canPatchComponent }) => {
  const { workspace } = useWorkspaceInfo();
  const track = useTrackEvent();
  const [isOpen, setOpen] = React.useState(false);
  return (
    <Dropdown
      onSelect={() => setOpen(false)}
      toggle={<KebabToggle onToggle={() => setOpen((v) => !v)} id="toggle-id-6" />}
      isOpen={isOpen}
      isPlain
      position={DropdownPosition.right}
      dropdownItems={[
        <DropdownItem
          key="roll-back"
          isDisabled={![PACState.error, PACState.pending, PACState.ready].includes(state)}
          onClick={() => {
            track(TrackEvents.ButtonClicked, {
              link_name: 'disable-pac',
              link_location: 'manage-builds-pipelines-action',
              component_name: component.metadata.name,
              app_name: component.spec.application,
              workspace,
            });
            disablePAC(component).then(() => {
              track('Disable PAC', {
                component_name: component.metadata.name,
                app_name: component.spec.application,
                workspace,
              });
            });
          }}
          tooltip={canPatchComponent ? undefined : "You don't have access to roll back"}
          isAriaDisabled={!canPatchComponent}
        >
          Roll back to default pipeline
        </DropdownItem>,
      ]}
    />
  );
};

const Row: React.FC<{
  component: ComponentKind;
  onStateChange: (state: PACState) => void;
}> = ({ component, onStateChange }) => {
  const { workspace } = useWorkspaceInfo();
  const track = useTrackEvent();
  const { url: githubAppURL } = useApplicationPipelineGitHubApp();
  const [pacState, setPacState] = React.useState<PACState>(PACState.loading);
  const onComponentStateChange = React.useCallback(
    (state) => {
      setPacState(state);
      onStateChange(state);
    },
    [onStateChange],
  );
  const [canPatchComponent] = useAccessReviewForModel(ComponentModel, 'patch');
  const buildStatus = useComponentBuildStatus(component);
  const prURL = buildStatus?.pac?.['merge-url'];

  React.useEffect(() => {
    onStateChange(pacState);
    // omit onStateChange because we only want to notify when state changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pacState]);

  return (
    <>
      <Tr
        data-testid={`component-row ${component.metadata.name}`}
        style={
          pacState === PACState.error || pacState === PACState.sample ? { borderBottom: 0 } : {}
        }
      >
        <Td>
          <div>
            <b>{component.metadata.name}</b>
          </div>
          <div>
            Code repository:{' '}
            <GitRepoLink
              url={component.spec.source.git.url}
              revision={component.spec.source.git.revision}
              context={component.spec.source.git.context}
            />
          </div>
        </Td>

        <Td>
          <ComponentPACStateLabel onStateChange={onComponentStateChange} component={component} />
        </Td>
        <Td className="pf-u-text-align-right">
          {(() => {
            switch (pacState) {
              case PACState.disabled:
              case PACState.error:
                return (
                  <ButtonWithAccessTooltip
                    onClick={() => {
                      enablePAC(component).then(() => {
                        track('Enable PAC', {
                          component_name: component.metadata.name,
                          app_name: component.spec.application,
                          workspace,
                        });
                      });
                    }}
                    isDisabled={!canPatchComponent}
                    tooltip="You don't have access to send a pull request"
                    analytics={{
                      link_name: 'send-pull-request',
                      link_location: 'manage-builds-pipelines',
                      component_name: component.metadata.name,
                      app_name: component.spec.application,
                      workspace,
                    }}
                  >
                    Send pull request
                  </ButtonWithAccessTooltip>
                );
              case PACState.requested:
                return (
                  <Button spinnerAriaValueText="Sending pull request" isLoading isDisabled>
                    Sending pull request
                  </Button>
                );
              case PACState.pending:
                return (
                  <ExternalLink
                    variant={ButtonVariant.secondary}
                    href={prURL || component.spec.source.git.url}
                    analytics={{
                      link_name: 'merge-pull-request',
                      link_location: 'manage-builds-pipelines',
                      component_name: component.metadata.name,
                      app_name: component.spec.application,
                      git_url: component.spec.source.git.url,
                      url: prURL,
                      workspace,
                    }}
                  >
                    Merge in GitHub
                  </ExternalLink>
                );
              case PACState.ready:
                return (
                  <ExternalLink
                    variant={ButtonVariant.secondary}
                    href={component.spec.source.git.url}
                    analytics={{
                      link_name: 'edit-pipeline-in-github',
                      link_location: 'manage-builds-pipelines',
                      component_name: component.metadata.name,
                      app_name: component.spec.application,
                      git_url: component.spec.source.git.url,
                      workspace,
                    }}
                  >
                    Edit pipeline in GitHub
                  </ExternalLink>
                );
              case PACState.sample:
                return (
                  <ExternalLink
                    variant={ButtonVariant.secondary}
                    href={`${component.spec.source.git.url.replace(/\.git$/i, '')}/fork`}
                    analytics={{
                      link_name: 'fork-sample',
                      link_location: 'manage-builds-pipelines',
                      component_name: component.metadata.name,
                      app_name: component.spec.application,
                      git_url: component.spec.source.git.url,
                      workspace,
                    }}
                  >
                    Fork sample
                  </ExternalLink>
                );
              default:
                return null;
            }
          })()}
        </Td>
        <Td>
          <ComponentKebab
            component={component}
            state={pacState}
            canPatchComponent={canPatchComponent}
          />
        </Td>
      </Tr>
      {pacState === PACState.sample ? (
        <Tr>
          <Td colSpan={4} style={{ paddingTop: 0 }}>
            <Alert isInline variant={AlertVariant.info} title="Samples cannot be upgraded">
              To upgrade to a custom build pipeline, fork your sample and create a new component
              first. Then we&apos;ll send a pull request to your repository containing the default
              build pipeline for you to customize.
            </Alert>
          </Td>
        </Tr>
      ) : null}
      {pacState === PACState.error ? (
        <Tr>
          <Td colSpan={4} style={{ paddingTop: 0 }}>
            <Alert
              isInline
              variant={AlertVariant.warning}
              title="Pull request failed to reach its destination"
              actionLinks={
                <>
                  <ExternalLink
                    href={githubAppURL}
                    analytics={{
                      link_name: 'install-github-app',
                      link_location: 'manage-builds-pipelines',
                      component_name: component.metadata.name,
                      app_name: component.spec.application,
                      workspace,
                    }}
                  >
                    Install GitHub Application
                  </ExternalLink>
                  <ButtonWithAccessTooltip
                    variant={ButtonVariant.link}
                    onClick={() =>
                      disablePAC(component).then(() => {
                        track('Disable PAC', {
                          component_name: component.metadata.name,
                          app_name: component.spec.application,
                          workspace,
                        });
                      })
                    }
                    isAriaDisabled={!canPatchComponent}
                    tooltip="You don't have access to roll back"
                    analytics={{
                      link_name: 'disable-pac',
                      link_location: 'manage-builds-pipelines-alert',
                      component_name: component.metadata.name,
                      app_name: component.spec.application,
                      workspace,
                    }}
                  >
                    Roll back to default pipeline
                  </ButtonWithAccessTooltip>
                </>
              }
            >
              We attempted to send a pull request to your repository containing the default build
              pipeline, but the pull request never arrived. To try again, install the GitHub
              application and grant permissions for this component.
            </Alert>
          </Td>
        </Tr>
      ) : null}
    </>
  );
};

const CustomizePipeline: React.FC<Props> = ({ components, onClose, modalProps }) => {
  const track = useTrackEvent();
  const { workspace } = useWorkspaceInfo();
  const { url: githubAppURL } = useApplicationPipelineGitHubApp();
  const sortedComponents = React.useMemo(
    () => [...components].sort((a, b) => a.metadata.name.localeCompare(b.metadata.name)),
    [components],
  );

  const [componentState, setComponentState] = React.useState<{ [name: string]: PACState }>({});

  const completed = React.useMemo(
    () =>
      Object.values(componentState).every(
        (state) => state === PACState.ready || state === PACState.sample,
      ),
    [componentState],
  );

  const allLoading = React.useMemo(
    () => !Object.values(componentState).some((state) => state !== PACState.loading),
    [componentState],
  );

  const count = React.useMemo(
    () => Object.values(componentState).filter((state) => state === PACState.ready).length,
    [componentState],
  );

  const totalCount = React.useMemo(
    () => Object.values(componentState).filter((state) => state !== PACState.sample).length,
    [componentState],
  );

  const applicationName = components[0].spec.application;

  const trackedOnClose = React.useCallback(() => {
    track(TrackEvents.ButtonClicked, {
      link_name: 'manage-build-pipelines-close',
      app_name: applicationName,
      workspace,
    });
    onClose();
  }, [onClose, applicationName, workspace, track]);

  return (
    <Modal {...modalProps} onClose={trackedOnClose}>
      <ModalBoxHeader />
      <ModalBoxBody>
        <TextContent
          className="pf-u-text-align-center pf-u-pt-lg"
          style={{ visibility: allLoading ? 'hidden' : undefined }}
        >
          <Text component={TextVariants.p}>
            <img style={{ width: 100 }} src={completed ? successIconUrl : sendIconUrl} />
          </Text>
          <Text component={TextVariants.h2}>Manage build pipelines</Text>
          <Text component={TextVariants.p}>
            Add some automation by upgrading your default build pipelines to custom build pipelines.
            Custom build pipelines are pipelines as code, set on your component&apos;s repository.
            With custom build pipelines, commits to your main branch and pull requests will
            automatically rebuild. You can always roll back to default.
          </Text>
          <Text component={TextVariants.p}>
            Ready to upgrade? To get started, install our GitHub application and grant permission to
            your repositories.
          </Text>
          <Text component={TextVariants.p}>
            <ExternalLink
              href={githubAppURL}
              analytics={{
                link_name: 'install-github-app',
                link_location: 'manage-builds-pipelines',
                workspace,
              }}
            >
              Install GitHub application
            </ExternalLink>
          </Text>
        </TextContent>
        <div className="pf-u-mt-lg" />
        {alert}
        <TableComposable>
          <Thead>
            <Tr>
              <Th>Component</Th>
              <Th modifier="fitContent">Build pipeline status</Th>
              <Th />
              <Th />
            </Tr>
          </Thead>
          <Tbody>
            {sortedComponents.map((component) => (
              <Row
                key={component.metadata.name}
                component={component}
                onStateChange={(pacState) =>
                  setComponentState((prevState) => ({
                    ...prevState,
                    [component.metadata.name]: pacState,
                  }))
                }
              />
            ))}
          </Tbody>
        </TableComposable>
        {totalCount > 0 ? (
          <p
            className={`pf-u-pt-lg ${
              count === totalCount ? 'pf-u-success-color-100' : 'pf-u-color-400'
            }`}
          >
            {`${count} of ${pluralize(totalCount, 'component')} upgraded to custom build`}
          </p>
        ) : undefined}
      </ModalBoxBody>
      <ModalBoxFooter>
        <AnalyticsButton
          variant={ButtonVariant.secondary}
          onClick={trackedOnClose}
          data-test="close-button custom-pipeline-modal"
        >
          Close
        </AnalyticsButton>
      </ModalBoxFooter>
    </Modal>
  );
};

export default CustomizePipeline;
