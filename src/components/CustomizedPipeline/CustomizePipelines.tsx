import * as React from 'react';
import {
  Alert,
  AlertActionLink,
  AlertVariant,
  Button,
  ButtonVariant,
  Dropdown,
  DropdownItem,
  DropdownPosition,
  KebabToggle,
  ModalBoxBody,
  ModalBoxFooter,
  pluralize,
  Text,
  TextContent,
  TextVariants,
  Tooltip,
} from '@patternfly/react-core';
import { Tbody, Thead, Th, Tr, Td, TableComposable } from '@patternfly/react-table';
import { PACState } from '../../hooks/usePACState';
import { useStoneSoupGitHubApp } from '../../hooks/useStoneSoupGitHubApp';
import sendIconUrl from '../../imgs/send.svg';
import successIconUrl from '../../imgs/success.svg';
import { ComponentModel } from '../../models';
import ExternalLink from '../../shared/components/links/ExternalLink';
import { ComponentKind } from '../../types';
import { useURLForComponentPRs, enablePAC, disablePAC } from '../../utils/component-utils';
import { useAccessReviewForModel } from '../../utils/rbac';
import { ButtonWithAccessTooltip } from '../ButtonWithAccessTooltip';
import ComponentPACStateLabel from '../Components/ComponentPACStateLabel';
import GitRepoLink from '../GitLink/GitRepoLink';
import { ComponentProps } from '../modal/createModalLauncher';

type Props = ComponentProps & {
  components: ComponentKind[];
};

const ComponentKebab: React.FC<{
  state: PACState;
  component: ComponentKind;
  canPatchComponent?: boolean;
}> = ({ component, state, canPatchComponent }) => {
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
          onClick={() => disablePAC(component)}
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
  const { url: githubAppURL } = useStoneSoupGitHubApp();
  const [pacState, setPacState] = React.useState<PACState>(PACState.loading);
  const onComponentStateChange = React.useCallback(
    (state) => {
      setPacState(state);
      onStateChange(state);
    },
    [onStateChange],
  );
  const prURL = useURLForComponentPRs([component]);
  const [canPatchComponent] = useAccessReviewForModel(ComponentModel, 'patch');

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
                      enablePAC(component);
                    }}
                    isDisabled={!canPatchComponent}
                    tooltip="You don't have access to send a pull request"
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
                  <ExternalLink variant={ButtonVariant.secondary} href={prURL} showIcon>
                    Merge in GitHub
                  </ExternalLink>
                );
              case PACState.ready:
                return (
                  <ExternalLink
                    variant={ButtonVariant.secondary}
                    href={component.spec.source.git.url}
                    showIcon
                  >
                    Edit pipeline in GitHub
                  </ExternalLink>
                );
              case PACState.sample:
                return (
                  <ExternalLink
                    variant={ButtonVariant.secondary}
                    href={`${component.spec.source.git.url.replace(/\.git$/i, '')}/fork`}
                    showIcon
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
                  <ExternalLink href={githubAppURL} showIcon>
                    Install GitHub Application
                  </ExternalLink>
                  {canPatchComponent ? (
                    <AlertActionLink onClick={() => disablePAC(component)}>
                      Roll back to default pipeline
                    </AlertActionLink>
                  ) : (
                    <Tooltip content="You don't have access to roll back">
                      <AlertActionLink isAriaDisabled={!canPatchComponent}>
                        Roll back to default pipeline
                      </AlertActionLink>
                    </Tooltip>
                  )}
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

const CustomizePipeline: React.FC<Props> = ({ components, onClose }) => {
  const { url: githubAppURL } = useStoneSoupGitHubApp();
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

  return (
    <>
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
            <ExternalLink href={githubAppURL} showIcon>
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
        <Button
          variant={ButtonVariant.secondary}
          onClick={onClose}
          data-test="close-button custom-pipeline-modal"
        >
          Close
        </Button>
      </ModalBoxFooter>
    </>
  );
};

export default CustomizePipeline;
