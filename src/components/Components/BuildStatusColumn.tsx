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
import { useLatestPipelineRunForComponent } from '../../hooks/usePipelineRunsForApplication';
import { PipelineRunGroupVersionKind } from '../../models';
import { pipelineRunFilterReducer } from '../../shared';
import ExternalLink from '../../shared/components/links/ExternalLink';
import { ComponentKind, PipelineRunKind } from '../../types';
import { getURLForComponentPRs, isPACEnabled } from '../../utils/component-utils';
import { getBuildStatusIcon } from '../../utils/gitops-utils';
import { useBuildLogViewerModal } from '../LogViewer/BuildLogViewer';

type BuildStatusComponentProps = {
  component: ComponentKind;
  allComponents: ComponentKind[];
};

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

  const pipelineRun = useLatestPipelineRunForComponent(component);
  const status = pipelineRunFilterReducer(pipelineRun);
  const buildLogsModal = useBuildLogViewerModal(component);
  const isContainerImage = !component.spec.source?.git?.url;

  const merged = pipelineRunsLoaded && pipelineBuildRuns?.length;

  return merged || !(pipelineRunsLoaded && hasPAC) ? (
    <Flex direction={{ default: 'column' }}>
      {pipelineRun && (
        <FlexItem align={{ default: 'alignRight' }}>
          {getBuildStatusIcon(status)} Build {status}
        </FlexItem>
      )}
      {pipelineRun && !isContainerImage && (
        <FlexItem align={{ default: 'alignRight' }}>
          <Button
            onClick={buildLogsModal}
            variant="link"
            data-testid={`view-build-logs-${component.metadata.name}`}
            isInline
          >
            View logs
          </Button>
        </FlexItem>
      )}
    </Flex>
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
