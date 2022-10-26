import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  CodeBlock,
  CodeBlockCode,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Flex,
  FlexItem,
  Label,
  LabelGroup,
  Title,
} from '@patternfly/react-core';
import { pipelineRunFilterReducer } from '../../../../shared';
import ExternalLink from '../../../../shared/components/links/ExternalLink';
import { StatusIconWithText } from '../../../../shared/components/pipeline-run-logs/StatusIcon';
import { Timestamp } from '../../../../shared/components/timestamp/Timestamp';
import { PipelineRunLabel } from '../../../consts/pipelinerun';
import { PipelineRunKind } from '../../../types';
import { calculateDuration } from '../../../utils/pipeline-utils';
import PipelineRunVisualization from '../PipelineRunVisualization';
import RelatedPipelineRuns from '../RelatedPipelineRuns';

type PipelineRunDetailsTabProps = {
  pipelineRun: PipelineRunKind;
};
const PipelineRunDetailsTab: React.FC<PipelineRunDetailsTabProps> = ({ pipelineRun }) => {
  const duration = calculateDuration(
    typeof pipelineRun.status?.startTime === 'string' ? pipelineRun.status?.startTime : '',
    typeof pipelineRun.status?.completionTime === 'string'
      ? pipelineRun.status?.completionTime
      : '',
  );

  const getMetadataList = (prop: Record<string, string>) => {
    const labelArray = Object.entries(prop);

    return (
      <Flex>
        <LabelGroup>
          {labelArray.map((label, index) => (
            <FlexItem key={index}>
              <Label color="blue" isTruncated={label.toString().length > 100}>
                {label.toString().replace(',', '=')}{' '}
              </Label>
            </FlexItem>
          ))}
        </LabelGroup>
      </Flex>
    );
  };

  return (
    <>
      <Title headingLevel="h4" className="pf-c-title pf-u-mt-lg pf-u-mb-lg" size="lg">
        Pipeline run details
      </Title>
      <PipelineRunVisualization pipelineRun={pipelineRun} />
      <Flex>
        <Flex flex={{ default: 'flex_3' }}>
          <FlexItem>
            <DescriptionList
              data-test="pipelinerun-details"
              columnModifier={{
                default: '1Col',
              }}
            >
              <DescriptionListGroup>
                <DescriptionListTerm>Name</DescriptionListTerm>
                <DescriptionListDescription>
                  {pipelineRun.metadata?.name ?? '-'}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Namespace</DescriptionListTerm>
                <DescriptionListDescription>
                  {pipelineRun.metadata?.namespace ?? '-'}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Labels</DescriptionListTerm>
                <DescriptionListDescription>
                  {getMetadataList(pipelineRun.metadata?.labels)}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Annotations</DescriptionListTerm>
                <DescriptionListDescription>
                  {getMetadataList(pipelineRun.metadata?.annotations)}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Created at</DescriptionListTerm>
                <DescriptionListDescription>
                  <Timestamp timestamp={pipelineRun.metadata.creationTimestamp ?? '-'} />
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Duration</DescriptionListTerm>
                <DescriptionListDescription>{duration ?? '-'}</DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </FlexItem>
        </Flex>

        <Flex flex={{ default: 'flex_3' }}>
          <FlexItem>
            <DescriptionList
              data-test="pipelinerun-details"
              columnModifier={{
                default: '1Col',
              }}
            >
              <DescriptionListGroup>
                <DescriptionListTerm>Status</DescriptionListTerm>
                <DescriptionListDescription>
                  <StatusIconWithText status={pipelineRunFilterReducer(pipelineRun)} />
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Message</DescriptionListTerm>
                <DescriptionListDescription>
                  {pipelineRun.status?.conditions[0]?.message ?? '-'}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Log snippet</DescriptionListTerm>
                <DescriptionListDescription>
                  <CodeBlock>
                    <CodeBlockCode id="code-content">
                      {pipelineRun.status?.taskRuns[`${pipelineRun.metadata?.name}-show-summary`]
                        ?.status?.taskSpec?.steps[0].script ?? '-'}
                    </CodeBlockCode>
                  </CodeBlock>
                  <Button
                    variant="link"
                    isInline
                    component={(props) => (
                      <Link
                        {...props}
                        to={`/app-studio/pipelineruns/${pipelineRun.metadata?.name}?activeTab=logs`}
                      />
                    )}
                  >
                    See logs
                  </Button>
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Pipeline</DescriptionListTerm>
                <DescriptionListDescription>
                  {pipelineRun.metadata?.labels[PipelineRunLabel.PIPELINE_NAME] ?? '-'}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Application</DescriptionListTerm>
                <DescriptionListDescription>
                  {pipelineRun.metadata?.labels?.[PipelineRunLabel.APPLICATION] ? (
                    <Link
                      to={`/app-studio/applications/${
                        pipelineRun.metadata?.labels[PipelineRunLabel.APPLICATION]
                      }`}
                    >
                      {pipelineRun.metadata?.labels[PipelineRunLabel.APPLICATION]}
                    </Link>
                  ) : (
                    '-'
                  )}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Source</DescriptionListTerm>
                <DescriptionListDescription>
                  {pipelineRun.metadata?.annotations?.[
                    PipelineRunLabel.COMMIT_FULL_REPO_URL_LABEL
                  ] ? (
                    <ExternalLink
                      href={
                        pipelineRun.metadata?.annotations[
                          PipelineRunLabel.COMMIT_FULL_REPO_URL_LABEL
                        ]
                      }
                    >
                      {
                        pipelineRun.metadata?.annotations[
                          PipelineRunLabel.COMMIT_FULL_REPO_URL_LABEL
                        ]
                      }
                    </ExternalLink>
                  ) : (
                    '-'
                  )}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Related pipelines</DescriptionListTerm>
                <DescriptionListDescription>
                  <RelatedPipelineRuns pipelineRun={pipelineRun} />
                </DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </FlexItem>
        </Flex>
      </Flex>
    </>
  );
};

export default React.memo(PipelineRunDetailsTab);
