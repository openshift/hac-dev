import * as React from 'react';
import {
  Alert,
  AlertVariant,
  Button,
  ButtonVariant,
  Label,
  ModalBoxBody,
  ModalBoxFooter,
  Skeleton,
  Text,
  TextContent,
  TextVariants,
  Tooltip,
} from '@patternfly/react-core';
import { Tbody, Thead, Th, Tr, Td, TableComposable } from '@patternfly/react-table';
import usePACState, { PACState } from '../../hooks/usePACState';
import sendIconUrl from '../../imgs/send.svg';
import successIconUrl from '../../imgs/success.svg';
import ExternalLink from '../../shared/components/links/ExternalLink';
import { ComponentKind } from '../../types';
import { enablePAC, getURLForComponentPRs } from '../../utils/component-utils';
import { ComponentProps } from '../modal/createModalLauncher';

type Props = ComponentProps & {
  components: ComponentKind[];
  loading?: boolean;
};

const Row: React.FC<{
  component: ComponentKind;
  onStateChange: (state: PACState) => void;
}> = ({ component, onStateChange }) => {
  const pacState = usePACState(component);
  React.useEffect(() => {
    onStateChange(pacState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pacState]);

  return (
    <Tr data-testid={`component-row ${component.metadata.name}`}>
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
                  <Label>Sample</Label>
                </Tooltip>
              );
            case PACState.disabled:
              return <Label color="blue">Default build</Label>;
            case PACState.pending:
              return <Label color="gold">Pull request sent</Label>;
            case PACState.requested:
              return <Label color="gold">Sending pull request</Label>;
            case PACState.ready:
              return <Label color="green">Custom build</Label>;
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
                <ExternalLink
                  variant={ButtonVariant.secondary}
                  href={getURLForComponentPRs([component])}
                  showIcon
                >
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
            default:
              return null;
          }
        })()}
      </Td>
    </Tr>
  );
};

const CustomizePipeline: React.FC<Props> = ({ components, onClose, loading }) => {
  const [showRequestedAlert, setShowRequestedAlert] = React.useState(false);

  const sortedComponents = !loading
    ? [...components].sort((a, b) => a.metadata.name.localeCompare(b.metadata.name))
    : [];

  const [componnentState, setComponentState] = React.useState<{ [name: string]: PACState }>({});

  const completed = React.useMemo(
    () =>
      Object.values(componnentState).every(
        (state) => state === PACState.ready || state === PACState.sample,
      ),
    [componnentState],
  );

  const hasRequestedState = React.useMemo(
    () => Object.values(componnentState).some((state) => state === PACState.requested),
    [componnentState],
  );

  const allLoading = React.useMemo(
    () => !Object.values(componnentState).some((state) => state !== PACState.loading),
    [componnentState],
  );

  React.useEffect(() => {
    if (hasRequestedState) {
      const timeout = setTimeout(() => {
        setShowRequestedAlert(true);
      }, 5000);
      return () => {
        clearTimeout(timeout);
      };
    }
    setShowRequestedAlert(false);
  }, [hasRequestedState]);

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
          <Text component={TextVariants.p} className="pf-u-color-400">
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
              <Th>Status</Th>
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
        {showRequestedAlert ? (
          <Alert
            isInline
            variant={AlertVariant.warning}
            title="Sending pull request is taking more time than expected"
            className="pf-u-mt-lg"
          >
            Pull request did not react its destination yet.
            <br />
            This might be because you need to install the GitHub application and grant permissions
            for the component repository.
            <br />
            <br />
            <ExternalLink href="https://github.com/apps/appstudio-staging-ci" showIcon>
              Start the flow
            </ExternalLink>
          </Alert>
        ) : undefined}
      </ModalBoxBody>
      <ModalBoxFooter>
        <Button variant={ButtonVariant.link} onClick={onClose}>
          Close
        </Button>
      </ModalBoxFooter>
    </>
  );
};

export default CustomizePipeline;
