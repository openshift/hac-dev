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
import ExternalLink from '../../../shared/components/links/ExternalLink';
import { ErrorDetailsWithStaticLog } from '../../../shared/components/pipeline-run-logs/logs/log-snippet-types';
import { getPLRLogSnippet } from '../../../shared/components/pipeline-run-logs/logs/pipelineRunLogSnippet';
import { Timestamp } from '../../../shared/components/timestamp/Timestamp';
import { PipelineRunKind, TaskRunKind } from '../../../types';
import { getCommitSha, getCommitShortName } from '../../../utils/commits-utils';
import {
  calculateDuration,
  getSbomTaskRun,
  pipelineRunStatus,
  isPipelineV1Beta1,
} from '../../../utils/pipeline-utils';
import { useWorkspaceInfo } from '../../../utils/workspace-context-utils';
import GitRepoLink from '../../GitLink/GitRepoLink';
import { StatusIconWithText } from '../../topology/StatusIcon';
import MetadataList from '../MetadataList';
import PipelineRunVisualization from '../PipelineRunVisualization';
import RelatedPipelineRuns from '../RelatedPipelineRuns';
import { getSourceUrl } from '../utils/pipelinerun-utils';
import RunResultsList from './RunResultsList';
import ScanDescriptionListGroup from './ScanDescriptionListGroup';

type PipelineRunDetailsTabProps = {
  taskRuns: TaskRunKind[];
  pipelineRun: PipelineRunKind;
  error?: unknown;
};
const PipelineRunDetailsTab: React.FC<React.PropsWithChildren<PipelineRunDetailsTabProps>> = ({
  pipelineRun,
  error,
  taskRuns,
}) => {
  const { workspace } = useWorkspaceInfo();
  const results = isPipelineV1Beta1(pipelineRun)
    ? pipelineRun.status?.pipelineResults
    : pipelineRun.status?.results;
  const pipelineRunFailed = (getPLRLogSnippet(pipelineRun, taskRuns) ||
    {}) as ErrorDetailsWithStaticLog;
  const duration = calculateDuration(
    typeof pipelineRun.status?.startTime === 'string' ? pipelineRun.status?.startTime : '',
    typeof pipelineRun.status?.completionTime === 'string'
      ? pipelineRun.status?.completionTime
      : '',
  );
  const sha = getCommitSha(pipelineRun);
  const applicationName = pipelineRun.metadata?.labels[PipelineRunLabel.APPLICATION];
  const buildImage =
    pipelineRun.metadata?.annotations?.[PipelineRunLabel.BUILD_IMAGE_ANNOTATION] ||
    results?.find(({ name }) => name === `IMAGE_URL`)?.value;
  const sourceUrl = getSourceUrl(pipelineRun);
  const pipelineStatus = !error ? pipelineRunStatus(pipelineRun) : null;
  const sbomTaskRun = React.useMemo(() => getSbomTaskRun(taskRuns), [taskRuns]);
  const integrationTestName = pipelineRun.metadata.labels[PipelineRunLabel.TEST_SERVICE_SCENARIO];
  const snapshot =
    pipelineRun.metadata?.annotations?.[PipelineRunLabel.SNAPSHOT] ||
    pipelineRun.metadata?.labels?.[PipelineRunLabel.SNAPSHOT];

  return (
    <>
      <Title headingLevel="h4" className="pf-v5-c-title pf-v5-u-mt-lg pf-v5-u-mb-lg" size="lg">
        Pipeline run details
      </Title>
      <PipelineRunVisualization pipelineRun={pipelineRun} error={error} taskRuns={taskRuns} />
      {!error && (
        <>
          <Flex direction={{ default: 'row' }}>
            <FlexItem style={{ flex: 1 }}>
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
            <FlexItem style={{ flex: 1 }}>
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
                      status={pipelineStatus}
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
                              to={`/application-pipeline/workspaces/${workspace}/applications/${applicationName}/pipelineruns/${pipelineRun.metadata?.name}/logs`}
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
                {snapshot && (
                  <DescriptionListGroup>
                    <DescriptionListTerm>Snapshot</DescriptionListTerm>
                    <DescriptionListDescription>
                      <Link
                        to={`/application-pipeline/workspaces/${workspace}/applications/${applicationName}/snapshots/${snapshot}`}
                      >
                        {snapshot}
                      </Link>
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                )}
                {buildImage && (
                  <DescriptionListGroup>
                    <DescriptionListTerm>Download SBOM</DescriptionListTerm>
                    <DescriptionListDescription>
                      <ClipboardCopy isReadOnly hoverTip="Copy" clickTip="Copied">
                        {`cosign download sbom ${buildImage}`}
                      </ClipboardCopy>
                      <ExternalLink href="https://docs.sigstore.dev/cosign/installation">
                        Install Cosign
                      </ExternalLink>
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                )}
                {sbomTaskRun && (
                  <DescriptionListGroup>
                    <DescriptionListTerm>SBOM</DescriptionListTerm>
                    <DescriptionListDescription>
                      <Link
                        to={`/application-pipeline/workspaces/${workspace}/applications/${
                          sbomTaskRun.metadata.labels[PipelineRunLabel.APPLICATION]
                        }/taskruns/${sbomTaskRun.metadata.name}/logs`}
                      >
                        View SBOM
                      </Link>
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                )}
                <DescriptionListGroup>
                  <DescriptionListTerm>Application</DescriptionListTerm>
                  <DescriptionListDescription>
                    {pipelineRun.metadata?.labels?.[PipelineRunLabel.APPLICATION] ? (
                      <Link
                        to={`/application-pipeline/workspaces/${workspace}/applications/${
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
                <ScanDescriptionListGroup taskRuns={taskRuns} showLogsLink />
                <DescriptionListGroup>
                  <DescriptionListTerm>Component</DescriptionListTerm>
                  <DescriptionListDescription>
                    {pipelineRun.metadata?.labels?.[PipelineRunLabel.COMPONENT] ? (
                      pipelineRun.metadata?.labels?.[PipelineRunLabel.APPLICATION] ? (
                        <Link
                          to={`/application-pipeline/workspaces/${workspace}/applications/${
                            pipelineRun.metadata.labels[PipelineRunLabel.APPLICATION]
                          }/components/${pipelineRun.metadata.labels[PipelineRunLabel.COMPONENT]}`}
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
                        to={`/application-pipeline/workspaces/${workspace}/applications/${
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
                      <GitRepoLink url={sourceUrl} />
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                )}
                {integrationTestName && (
                  <DescriptionListGroup>
                    <DescriptionListTerm>Integration test</DescriptionListTerm>
                    <DescriptionListDescription>
                      <Link
                        to={`/application-pipeline/workspaces/${workspace}/applications/${
                          pipelineRun.metadata.labels[PipelineRunLabel.APPLICATION]
                        }/integrationtests/${integrationTestName}`}
                      >
                        {integrationTestName}
                      </Link>
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

          {results ? (
            <>
              <Divider style={{ padding: 'var(--pf-v5-global--spacer--lg) 0' }} />
              <RunResultsList results={results} status={pipelineStatus} />
            </>
          ) : null}
        </>
      )}
    </>
  );
};

export default React.memo(PipelineRunDetailsTab);
