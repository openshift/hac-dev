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
import { PipelineRunKind, ComponentKind } from '../../types';
import { default as BaseBuildStatusColumn } from '../ComponentsListView/BuildStatusColumn';
import { BuildStatusComponentProps } from '../ComponentsListView/ComponentListView';

export const PR_BOT_NAME = 'appstudio-staging-ci';
export const GIT_URL_PREFIX = 'https://github.com/';
export const PAC_ANNOTATION_KEY = 'appstudio.openshift.io/pac-provision';

export const hasPACProvisionDone = (component: ComponentKind) =>
  component.metadata.annotations?.[PAC_ANNOTATION_KEY] === 'done';

export const getURLForComponentPRs = (components: ComponentKind[]): string => {
  const repos = components.reduce((acc, component) => {
    const gitURL = component.spec.source?.git?.url;
    if (gitURL && hasPACProvisionDone(component) && gitURL.startsWith('https://github.com/')) {
      acc = `${acc}+repo:${gitURL.replace(GIT_URL_PREFIX, '')}`;
    }
    return acc;
  }, '');
  return `https://github.com/pulls?q=is:pr+is:open+author:app/${PR_BOT_NAME}${repos}`;
};

const BuildStatusColumn: React.FC<BuildStatusComponentProps> = ({ component, allComponents }) => {
  const [pipelineBuildRuns, pipelineRunsLoaded] = useK8sWatchResource<PipelineRunKind[]>({
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
  });

  const merged = pipelineRunsLoaded && pipelineBuildRuns.length;
  const hasPAC = pipelineRunsLoaded && hasPACProvisionDone(component);
  const openPRsURL = getURLForComponentPRs(allComponents);

  return merged || !hasPAC ? (
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
                    <ExternalLink href={openPRsURL} text="View all pull requests." />
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
