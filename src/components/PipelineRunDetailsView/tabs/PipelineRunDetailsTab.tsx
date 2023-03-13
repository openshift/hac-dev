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
  Title,
  Divider,
  ClipboardCopy,
} from '@patternfly/react-core';
import { PipelineRunLabel } from '../../../consts/pipelinerun';
import { pipelineRunFilterReducer } from '../../../shared';
import ExternalLink from '../../../shared/components/links/ExternalLink';
import { ErrorDetailsWithStaticLog } from '../../../shared/components/pipeline-run-logs/logs/log-snippet-types';
import { getPLRLogSnippet } from '../../../shared/components/pipeline-run-logs/logs/pipelineRunLogSnippet';
import { StatusIconWithText } from '../../../shared/components/pipeline-run-logs/StatusIcon';
import { Timestamp } from '../../../shared/components/timestamp/Timestamp';
import { PipelineRunKind } from '../../../types';
import { getCommitShortName } from '../../../utils/commits-utils';
import { calculateDuration } from '../../../utils/pipeline-utils';
import { useWorkspaceInfo } from '../../../utils/workspace-context-utils';
import MetadataList from '../MetadataList';
import PipelineRunVisualization from '../PipelineRunVisualization';
import RelatedPipelineRuns from '../RelatedPipelineRuns';
import { getSourceUrl } from '../utils/pipelinerun-utils';
import RunResultsList from './RunResultsList';

type PipelineRunDetailsTabProps = {
  pipelineRun: PipelineRunKind;
  error: unknown;
};
const PipelineRunDetailsTab: React.FC<PipelineRunDetailsTabProps> = ({ pipelineRun, error }) => {
  const { workspace } = useWorkspaceInfo();
  const pipelineRunFailed = (getPLRLogSnippet(pipelineRun) || {}) as ErrorDetailsWithStaticLog;
  const duration = calculateDuration(
    typeof pipelineRun.status?.startTime === 'string' ? pipelineRun.status?.startTime : '',
    typeof pipelineRun.status?.completionTime === 'string'
      ? pipelineRun.status?.completionTime
      : '',
  );
  const sha =
    pipelineRun?.metadata?.labels[PipelineRunLabel.COMMIT_LABEL] ||
    pipelineRun?.metadata?.labels[PipelineRunLabel.TEST_SERVICE_COMMIT];
  const applicationName = pipelineRun.metadata?.labels[PipelineRunLabel.APPLICATION];
  const buildImage = pipelineRun.metadata?.annotations?.[PipelineRunLabel.BUILD_IMAGE_ANNOTATION];
  const sourceUrl = getSourceUrl(pipelineRun);
  const pipelineRunStatus = !error ? pipelineRunFilterReducer(pipelineRun) : null;
  return (
    <>
      <Title headingLevel="h4" className="pf-c-title pf-u-mt-lg pf-u-mb-lg" size="lg">
        Pipeline run details
      </Title>
      <PipelineRunVisualization pipelineRun={pipelineRun} error={error} />
      {!error && (
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
                    <MetadataList metadata={pipelineRun.metadata?.labels} />
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Annotations</DescriptionListTerm>
                  <DescriptionListDescription>
                    <MetadataList metadata={pipelineRun.metadata?.annotations} />
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Created at</DescriptionListTerm>
                  <DescriptionListDescription>
                    <Timestamp timestamp={pipelineRun.metadata?.creationTimestamp ?? '-'} />
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
                    <StatusIconWithText
                      status={pipelineRunStatus}
                      dataTestAttribute={'pipelinerun-details status'}
                    />
                  </DescriptionListDescription>
                </DescriptionListGroup>
                {Object.keys(pipelineRunFailed).length > 0 && (
                  <>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Message</DescriptionListTerm>
                      <DescriptionListDescription>
                        {pipelineRunFailed.title ?? '-'}
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Log snippet</DescriptionListTerm>
                      <DescriptionListDescription>
                        <CodeBlock>
                          <CodeBlockCode id="code-content">
                            {pipelineRunFailed.staticMessage ?? '-'}
                          </CodeBlockCode>
                        </CodeBlock>
                        <Button
                          variant="link"
                          isInline
                          component={(props) => (
                            <Link
                              {...props}
                              to={`/stonesoup/workspaces/${workspace}/applications/${applicationName}/pipelineruns/${pipelineRun.metadata?.name}/logs`}
                            />
                          )}
                        >
                          See logs
                        </Button>
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                  </>
                )}
                <DescriptionListGroup>
                  <DescriptionListTerm>Pipeline</DescriptionListTerm>
                  <DescriptionListDescription>
                    {pipelineRun.metadata?.labels[PipelineRunLabel.PIPELINE_NAME] ?? '-'}
                  </DescriptionListDescription>
                </DescriptionListGroup>
                {buildImage && (
                  <DescriptionListGroup>
                    <DescriptionListTerm>Download SBOM</DescriptionListTerm>
                    <DescriptionListDescription>
                      <ClipboardCopy isReadOnly hoverTip="Copy" clickTip="Copied">
                        {`cosign download sbom ${buildImage}`}
                      </ClipboardCopy>
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                )}
                <DescriptionListGroup>
                  <DescriptionListTerm>Application</DescriptionListTerm>
                  <DescriptionListDescription>
                    {pipelineRun.metadata?.labels?.[PipelineRunLabel.APPLICATION] ? (
                      <Link
                        to={`/stonesoup/workspaces/${workspace}/applications/${
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
                  <DescriptionListTerm>Component</DescriptionListTerm>
                  <DescriptionListDescription>
                    {pipelineRun.metadata?.labels?.[PipelineRunLabel.COMPONENT] ? (
                      pipelineRun.metadata?.labels?.[PipelineRunLabel.APPLICATION] ? (
                        <Link
                          to={`/stonesoup/workspaces/${workspace}/applications/${
                            pipelineRun.metadata.labels[PipelineRunLabel.APPLICATION]
                          }/components?name=${
                            pipelineRun.metadata.labels[PipelineRunLabel.COMPONENT]
                          }`}
                        >
                          {pipelineRun.metadata.labels[PipelineRunLabel.COMPONENT]}
                        </Link>
                      ) : (
                        pipelineRun.metadata.labels[PipelineRunLabel.COMPONENT]
                      )
                    ) : (
                      '-'
                    )}
                  </DescriptionListDescription>
                </DescriptionListGroup>

                {sha && (
                  <DescriptionListGroup>
                    <DescriptionListTerm>Commit</DescriptionListTerm>
                    <DescriptionListDescription>
                      <Link
                        to={`/stonesoup/workspaces/${workspace}/applications/${
                          pipelineRun.metadata.labels[PipelineRunLabel.APPLICATION]
                        }/commit/${sha}`}
                      >
                        {getCommitShortName(sha)}
                      </Link>
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                )}
                {sourceUrl && (
                  <DescriptionListGroup>
                    <DescriptionListTerm>Source</DescriptionListTerm>
                    <DescriptionListDescription>
                      <ExternalLink href={sourceUrl}>{sourceUrl}</ExternalLink>{' '}
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                )}
                <DescriptionListGroup>
                  <DescriptionListTerm>Related pipelines</DescriptionListTerm>
                  <DescriptionListDescription>
                    <RelatedPipelineRuns pipelineRun={pipelineRun} />
                  </DescriptionListDescription>
                </DescriptionListGroup>
              </DescriptionList>
            </FlexItem>
          </Flex>
          {pipelineRun.status?.pipelineResults ? (
            <>
              <Divider style={{ padding: 'var(--pf-global--spacer--lg) 0' }} />
              <RunResultsList
                results={pipelineRun.status.pipelineResults}
                status={pipelineRunStatus}
              />
            </>
          ) : null}
        </Flex>
      )}
    </>
  );
};

export default React.memo(PipelineRunDetailsTab);
