import * as React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import {
  Button,
  ButtonVariant,
  Label,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons/dist/js/icons';
import { TableComposable, Thead, Tbody, Tr, Th, Td } from '@patternfly/react-table';
import { useFormikContext } from 'formik';
import { ImportFormValues } from '../../../components/ImportForm/utils/types';
import { useNamespace } from '../../../components/NamespacedPage/NamespacedPage';
import { PipelineRunGroupVersionKind } from '../../../shared';
import ExternalLink from '../../../shared/components/links/ExternalLink';
import { PipelineKind } from '../../../shared/components/pipeline-run-logs/types';

const BuildSection: React.FunctionComponent = () => {
  const { namespace } = useNamespace();
  const {
    values: { source, components },
  } = useFormikContext<ImportFormValues>();

  const [pipelineRuns, pipelineLoaded] = useK8sWatchResource<PipelineKind[]>({
    groupVersionKind: PipelineRunGroupVersionKind,
    isList: true,
    limit: 1,
    namespace,
    selector: {
      matchExpressions: [
        {
          key: 'build.appstudio.openshift.io/component',
          operator: 'In',
          values: components.map((component) => component.componentStub.componentName),
        },
        {
          key: 'build.appstudio.openshift.io/type',
          operator: 'Equals',
          values: ['build'],
        },
      ],
    },
  });

  // assumes all components come from a single git repo with a single PR to merge
  const merged = pipelineLoaded && pipelineRuns.length > 0;

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
        <Text component={TextVariants.p}>
          <Button
            data-testid="merge-button"
            variant={ButtonVariant.primary}
            component="a"
            href={source}
            target="_blank"
            rel="noopener noreferrer"
            isDisabled={merged}
          >
            Merge pull request <ExternalLinkAltIcon />
          </Button>
        </Text>
      </TextContent>
      <TableComposable aria-label="Components" data-testid="components-table">
        <Thead>
          <Tr>
            <Th>Component</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {components.map((component, rowIndex) => (
            <Tr key={rowIndex} data-testid={`component ${component.componentStub.componentName}`}>
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
                {merged ? (
                  <Label color="green">PR merged</Label>
                ) : (
                  <Label color="orange">Merge build PR</Label>
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
