import * as React from 'react';
import {
  Alert,
  AlertActionLink,
  AlertVariant,
  Button,
  ButtonVariant,
  Label,
  ModalBoxBody,
  ModalBoxFooter,
  pluralize,
  Skeleton,
  Text,
  TextContent,
  TextVariants,
  Tooltip,
} from '@patternfly/react-core';
import { Tbody, Thead, Th, Tr, Td, TableComposable } from '@patternfly/react-table';
import usePACState, { PACState } from '../../hooks/usePACState';
import { useStoneSoupGitHubApp } from '../../hooks/useStoneSoupGitHubApp';
import sendIconUrl from '../../imgs/send.svg';
import successIconUrl from '../../imgs/success.svg';
import ExternalLink from '../../shared/components/links/ExternalLink';
import { ComponentKind } from '../../types';
import { useURLForComponentPRs, enablePAC, disablePAC } from '../../utils/component-utils';
import { ComponentProps } from '../modal/createModalLauncher';

type Props = ComponentProps & {
  components: ComponentKind[];
};

const Row: React.FC<{
  component: ComponentKind;
  onStateChange: (state: PACState) => void;
}> = ({ component, onStateChange }) => {
  const { url: githubAppURL } = useStoneSoupGitHubApp();
  const pacState = usePACState(component);
  const prURL = useURLForComponentPRs([component]);

  React.useEffect(() => {
    onStateChange(pacState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pacState]);

  return (
    <>
      <Tr
        data-testid={`component-row ${component.metadata.name}`}
        style={pacState === PACState.error ? { borderBottom: 0 } : {}}
      >
        <Td>
          <div>
            <b>{component.metadata.name}</b>
          </div>
          <div>
            Code repository:{' '}
            <ExternalLink href={component.spec.source.git.url}>
              {component.spec.source.git.url}
            </ExternalLink>
          </div>
        </Td>

        <Td>
          {(() => {
            switch (pacState) {
              case PACState.loading:
                return <Skeleton width="100px" />;
              case PACState.sample:
                return (
                  <Tooltip content="You cannot customize the build pipeline of a sample. Fork the sample to your own repository and create a new component.">
                    <Label data-testid="sample-state">Sample</Label>
                  </Tooltip>
                );
              case PACState.disabled:
                return (
                  <Label color="blue" data-testid="default-state">
                    Default build
                  </Label>
                );
              case PACState.pending:
                return (
                  <Label color="gold" data-testid="pending-state">
                    Pull request sent
                  </Label>
                );
              case PACState.requested:
                return (
                  <Label color="gold" data-testid="requested-state">
                    Sending pull request
                  </Label>
                );
              case PACState.error:
                return (
                  <Label color="gold" data-testid="error-state">
                    Install GitHub app
                  </Label>
                );
              case PACState.ready:
                return (
                  <Label color="green" data-testid="ready-state">
                    Custom build
                  </Label>
                );
              default:
                return null;
            }
          })()}
        </Td>
        <Td className="pf-u-text-align-right">
          {(() => {
            switch (pacState) {
              case PACState.disabled:
                return (
                  <Button
                    onClick={() => {
                      enablePAC(component);
                    }}
                  >
                    Send pull request
                  </Button>
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

              case PACState.error:
                return (
                  <Button
                    onClick={() => {
                      enablePAC(component);
                    }}
                  >
                    Resend pull request
                  </Button>
                );
              default:
                return null;
            }
          })()}
        </Td>
      </Tr>
      {pacState === PACState.error ? (
        <Tr>
          <Td colSpan={3} style={{ paddingTop: 0 }}>
            <Alert
              isInline
              variant={AlertVariant.warning}
              title="Unable to send pull request"
              actionLinks={
                <>
                  <ExternalLink href={githubAppURL} showIcon>
                    Install GitHub Application
                  </ExternalLink>
                  <AlertActionLink onClick={() => disablePAC(component)}>Cancel</AlertActionLink>
                </>
              }
            >
              Please ensure the GitHub application is installed and grant permissions for this
              component repository.
            </Alert>
          </Td>
        </Tr>
      ) : null}
    </>
  );
};

const CustomizePipeline: React.FC<Props> = ({ components, onClose }) => {
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
          <Text component={TextVariants.h2}>
            {completed
              ? 'Components upgraded to using custom build pipeline'
              : 'Customize build pipeline'}
          </Text>
          <Text component={TextVariants.p}>
            {completed ? (
              'Your commits will trigger a new build using the merged pipeline. You can always customize the build pipeline from your source code.'
            ) : (
              <>
                Customize build pipeline in your component&apos;s repository and trigger new builds
                automatically when pushing commits.
                <br />
                We&apos;ll send you a pull request containing the default build pipeline definition
                for your component. You can customize it before or after merging.
                <br />
                At the moment, once opt-in, you cannot roll back to the default build method.
              </>
            )}
          </Text>
        </TextContent>
        <div className="pf-u-mt-lg" />
        {alert}
        <TableComposable>
          <Thead>
            <Tr>
              <Th>Component</Th>
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
        <Button onClick={onClose} data-test="close-button custom-pipeline-modal">
          Close
        </Button>
      </ModalBoxFooter>
    </>
  );
};

export default CustomizePipeline;
