import * as React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import {
  Button,
  ButtonVariant,
  Flex,
  FlexItem,
  HelperText,
  HelperTextItem,
  Label,
  Skeleton,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons/dist/js/icons';
import { TableComposable, Thead, Tbody, Tr, Th, Td } from '@patternfly/react-table';
import { useFormikContext } from 'formik';
import { useNamespace } from '../../../components/NamespacedPage/NamespacedPage';
import { PipelineRunGroupVersionKind } from '../../../shared';
import ExternalLink from '../../../shared/components/links/ExternalLink';
import { PipelineKind } from '../../../shared/components/pipeline-run-logs/types';
import { FormValues } from './types';

const BuildSection: React.FunctionComponent = () => {
  const { namespace } = useNamespace();
  const {
    values: { source, components, applicationData },
  } = useFormikContext<FormValues>();

  const [pipelineRuns, pipelineRunsLoaded] = useK8sWatchResource<PipelineKind[]>({
    groupVersionKind: PipelineRunGroupVersionKind,
    isList: true,
    namespace,
    selector: {
      matchExpressions: [
        {
          key: 'build.appstudio.openshift.io/component',
          operator: 'In',
          // find all pipelines related to the newly created components
          values: components.map((component) => component.componentStub.componentName),
        },
        {
          key: 'build.appstudio.openshift.io/type',
          operator: 'Equals',
          values: ['build'],
        },
        {
          key: 'build.appstudio.openshift.io/application',
          operator: 'Equals',
          values: [applicationData.metadata.name],
        },
      ],
    },
  });

  const mergedComponents = pipelineRunsLoaded
    ? components.reduce((acc, component) => {
        if (
          pipelineRuns.find(
            ({ metadata: { labels } }) =>
              labels?.['build.appstudio.openshift.io/component'] ===
              component.componentStub.componentName,
          )
        ) {
          acc.push(component);
        }
        return acc;
      }, [])
    : [];
  const allMerged = mergedComponents.length === components.length;

  return (
    <>
      <TextContent>
        <Text component={TextVariants.h1}>Create builds for your components</Text>
        <Text component={TextVariants.p}>
          To trigger your builds, merge the build pipeline pull request we sent for you.
        </Text>
        <Text component={TextVariants.p}>
          <a href="#">Learn more about pipeline customization</a>
        </Text>
        <Flex spaceItems={{ default: 'spaceItemsMd' }}>
          <FlexItem>
            <Button
              data-testid="merge-button"
              variant={ButtonVariant.primary}
              component="a"
              href={source}
              target="_blank"
              rel="noopener noreferrer"
              isDisabled={allMerged}
            >
              Merge pull request <ExternalLinkAltIcon />
            </Button>
          </FlexItem>
          {pipelineRunsLoaded ? (
            <FlexItem>
              <HelperText>
                <HelperTextItem variant={allMerged ? 'success' : 'error'}>
                  {`${mergedComponents.length} of ${components.length} merged`}
                </HelperTextItem>
              </HelperText>
            </FlexItem>
          ) : null}
        </Flex>
      </TextContent>
      <TableComposable aria-label="Components" data-testid="components-table">
        <Thead>
          <Tr>
            <Th>Component</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {components.map((component) => (
            <Tr
              key={component.componentStub.componentName}
              data-testid={`component ${component.componentStub.componentName}`}
            >
              <Td>
                <div>
                  <b>{component.componentStub.componentName}</b>
                </div>
                <div>
                  <ExternalLink
                    href={component.componentStub.source.git.url}
                    text={component.componentStub.source.git.url}
                  />
                </div>
              </Td>
              <Td>
                {pipelineRunsLoaded ? (
                  mergedComponents.includes(component) ? (
                    <Label color="green">PR merged</Label>
                  ) : (
                    <Label color="orange">Merge build PR</Label>
                  )
                ) : (
                  <Skeleton width="80px" />
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </TableComposable>
    </>
  );
};

export default BuildSection;
