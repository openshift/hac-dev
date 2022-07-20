import * as React from 'react';
import {
  Card,
  CardBody,
  CardExpandableContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Flex,
  FlexItem,
  Spinner,
  Text,
  TextVariants,
} from '@patternfly/react-core';
import { useLatestPipelineRunsForApplication } from '../../hooks/usePipelineRunsForApplication';
import { pipelineRunFilterReducer, runStatus } from '../../shared';
import { PipelineRunKind } from '../../shared/components/pipeline-run-logs/types';
import { localizeTimeStamp } from '../../utils/day-utils';
import { getBuildStatusIcon } from '../../utils/gitops-utils';

type ComponentCardProps = {
  applicationName: string;
  isSelected?: boolean;
  isExpanded?: boolean;
};

export const ComponentCard: React.FC<ComponentCardProps> = ({
  isSelected = true,
  applicationName,
  isExpanded,
}) => {
  const [pipelineRuns, loaded, error] = useLatestPipelineRunsForApplication(applicationName);
  const [status, timeStamp] = React.useMemo(() => {
    if (loaded && !error && pipelineRuns) {
      const pipelineRun: PipelineRunKind = pipelineRuns.sort?.(
        (a, b) =>
          new Date(b.metadata.creationTimestamp).getTime() -
          new Date(a.metadata.creationTimestamp).getTime(),
      )?.[0];
      const pipelinerunStatus = pipelineRunFilterReducer(pipelineRun);
      return [pipelinerunStatus as runStatus, pipelineRun?.metadata?.creationTimestamp];
    }
    return [null, null];
  }, [error, loaded, pipelineRuns]);
  return (
    <Card isSelectable isSelectableRaised isCompact isSelected={isSelected} isExpanded={isExpanded}>
      <CardHeader>
        <Flex>
          <CardTitle>Components</CardTitle>
          {!isExpanded && pipelineRuns?.length > 0 ? (
            <FlexItem align={{ default: 'alignRight' }}>
              {getBuildStatusIcon(status)} {status}
            </FlexItem>
          ) : null}
        </Flex>
      </CardHeader>
      <CardExpandableContent>
        <CardBody>
          {loaded ? (
            status && pipelineRuns?.length > 0 ? (
              <>
                {getBuildStatusIcon(status)} Build {status}
              </>
            ) : (
              <Text component={TextVariants.small}>No build found</Text>
            )
          ) : (
            <Spinner isSVG size="md" />
          )}
        </CardBody>

        <CardFooter>
          {timeStamp && (
            <Flex>
              <FlexItem>
                <Text component={TextVariants.small}>Last Build</Text>
              </FlexItem>
              <FlexItem align={{ default: 'alignRight' }}>
                <Text
                  component={TextVariants.small}
                  style={{ color: 'var(--pf-global--Color--200)' }}
                >
                  {localizeTimeStamp(timeStamp)}
                </Text>
              </FlexItem>
            </Flex>
          )}
        </CardFooter>
      </CardExpandableContent>
    </Card>
  );
};
