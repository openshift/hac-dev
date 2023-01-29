import * as React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import {
  Button,
  ButtonVariant,
  DataListCell,
  Flex,
  FlexItem,
  Popover,
  Text,
  TextContent,
} from '@patternfly/react-core';
import ExclamationTriangleIcon from '@patternfly/react-icons/dist/js/icons/exclamation-triangle-icon';
import { global_warning_color_100 as warningColor } from '@patternfly/react-tokens/dist/js/global_warning_color_100';
import { PipelineRunLabel, PipelineRunType } from '../../consts/pipelinerun';
import { PipelineRunGroupVersionKind } from '../../models';
import ExternalLink from '../../shared/components/links/ExternalLink';
import { PipelineRunKind } from '../../types';
import { getURLForComponentPRs, isPACEnabled } from '../../utils/component-utils';
import { default as BaseBuildStatusColumn } from '../ComponentsListView/BuildStatusColumn';
import { BuildStatusComponentProps } from '../ComponentsListView/ComponentListView';

const BuildStatusColumn: React.FC<BuildStatusComponentProps> = ({ component, allComponents }) => {
  const hasPAC = isPACEnabled(component);

  const [pipelineBuildRuns, pipelineRunsLoaded] = useK8sWatchResource<PipelineRunKind[]>(
    hasPAC
      ? {
          groupVersionKind: PipelineRunGroupVersionKind,
          isList: true,
          namespace: component.metadata.namespace,
          selector: {
            matchLabels: {
              [PipelineRunLabel.PIPELINE_TYPE]: PipelineRunType.BUILD,
              [PipelineRunLabel.COMPONENT]: component.metadata.name,
            },
          },
          limit: 1,
        }
      : null,
  );

  const merged = pipelineRunsLoaded && pipelineBuildRuns?.length;

  return merged || !(pipelineRunsLoaded && hasPAC) ? (
    <BaseBuildStatusColumn component={component} />
  ) : (
    <DataListCell alignRight>
      <Flex justifyContent={{ default: 'justifyContentFlexEnd' }}>
        <Popover
          position="left"
          bodyContent={(hide) => (
            <div data-test="component-list-item-unmerged-popover">
              <TextContent>
                <Text component="h2">Merge build PR</Text>
                <Text component="p">
                  On creating a new component, a pull request is created to merge the build pipeline
                  that was created for this component. Components cannot be built until the PR is
                  merged.
                </Text>
              </TextContent>
              <Text component="p" className="pf-u-mt-md">
                <Flex>
                  <FlexItem onClick={hide}>
                    <ExternalLink
                      href={getURLForComponentPRs(allComponents)}
                      text="View all pull requests."
                    />
                  </FlexItem>
                </Flex>
              </Text>
            </div>
          )}
        >
          <Button variant={ButtonVariant.link} isInline>
            <ExclamationTriangleIcon color={warningColor.value} /> Merge build PR
          </Button>
        </Popover>
      </Flex>
    </DataListCell>
  );
};

export default BuildStatusColumn;
