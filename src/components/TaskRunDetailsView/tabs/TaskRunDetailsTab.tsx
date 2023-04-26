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
} from '@patternfly/react-core';
import { TektonResourceLabel } from '../../../consts/pipeline';
import { PipelineRunLabel } from '../../../consts/pipelinerun';
import { ErrorDetailsWithStaticLog } from '../../../shared/components/pipeline-run-logs/logs/log-snippet-types';
import { getTRLogSnippet } from '../../../shared/components/pipeline-run-logs/logs/pipelineRunLogSnippet';
import { Timestamp } from '../../../shared/components/timestamp/Timestamp';
import { TaskRunKind } from '../../../types';
import { calculateDuration, taskRunStatus } from '../../../utils/pipeline-utils';
import { useWorkspaceInfo } from '../../../utils/workspace-context-utils';
import MetadataList from '../../PipelineRunDetailsView/MetadataList';
import RunResultsList from '../../PipelineRunDetailsView/tabs/RunResultsList';
import ScanDescriptionListGroup from '../../PipelineRunDetailsView/tabs/ScanDescriptionListGroup';
import { StatusIconWithText } from '../../topology/StatusIcon';

type TaskRunDetailsTabProps = {
  taskRun: TaskRunKind;
  error: unknown;
};
const TaskRunDetailsTab: React.FC<TaskRunDetailsTabProps> = ({ taskRun, error }) => {
  const { workspace } = useWorkspaceInfo();
  const taskRunFailed = (getTRLogSnippet(taskRun) || {}) as ErrorDetailsWithStaticLog;
  const duration = calculateDuration(
    typeof taskRun.status?.startTime === 'string' ? taskRun.status?.startTime : '',
    typeof taskRun.status?.completionTime === 'string' ? taskRun.status?.completionTime : '',
  );

  const applicationName = taskRun.metadata?.labels[PipelineRunLabel.APPLICATION];
  const status = !error ? taskRunStatus(taskRun) : null;
  const plrName = taskRun.metadata?.labels[TektonResourceLabel.pipelinerun];

  return (
    <>
      <Title headingLevel="h4" className="pf-c-title pf-u-mt-lg pf-u-mb-lg" size="lg">
        Task run details
      </Title>
      {!error && (
        <Flex>
          <Flex flex={{ default: 'flex_3' }}>
            <FlexItem>
              <DescriptionList
                data-test="taskrun-details"
                columnModifier={{
                  default: '1Col',
                }}
              >
                <DescriptionListGroup>
                  <DescriptionListTerm>Name</DescriptionListTerm>
                  <DescriptionListDescription>
                    {taskRun.metadata?.name ?? '-'}
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Namespace</DescriptionListTerm>
                  <DescriptionListDescription>
                    {taskRun.metadata?.namespace ?? '-'}
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Labels</DescriptionListTerm>
                  <DescriptionListDescription>
                    <MetadataList metadata={taskRun.metadata?.labels} />
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Annotations</DescriptionListTerm>
                  <DescriptionListDescription>
                    <MetadataList metadata={taskRun.metadata?.annotations} />
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Created at</DescriptionListTerm>
                  <DescriptionListDescription>
                    <Timestamp timestamp={taskRun.metadata?.creationTimestamp ?? '-'} />
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
                data-test="taskrun-details"
                columnModifier={{
                  default: '1Col',
                }}
              >
                {taskRun.spec.taskRef.name && (
                  <DescriptionListGroup>
                    <DescriptionListTerm>Task</DescriptionListTerm>
                    <DescriptionListDescription>
                      {taskRun.spec.taskRef.name}
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                )}
                <DescriptionListGroup>
                  <DescriptionListTerm>Description</DescriptionListTerm>
                  <DescriptionListDescription>
                    {taskRun.status?.taskSpec?.description || '-'}
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Status</DescriptionListTerm>
                  <DescriptionListDescription>
                    <StatusIconWithText
                      status={status}
                      dataTestAttribute={'taskrun-details status'}
                    />
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <ScanDescriptionListGroup taskRuns={[taskRun]} hideIfNotFound />
                {Object.keys(taskRunFailed).length > 0 && (
                  <>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Message</DescriptionListTerm>
                      <DescriptionListDescription>
                        {taskRunFailed.title ?? '-'}
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Log snippet</DescriptionListTerm>
                      <DescriptionListDescription>
                        <CodeBlock>
                          <CodeBlockCode id="code-content">
                            {taskRunFailed.staticMessage ?? '-'}
                          </CodeBlockCode>
                        </CodeBlock>
                        <Button
                          variant="link"
                          isInline
                          component={(props) => (
                            <Link
                              {...props}
                              to={`/application-pipeline/workspaces/${workspace}/applications/${applicationName}/taskRuns/${taskRun.metadata.name}/logs`}
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
                  <DescriptionListTerm>Pipeline run</DescriptionListTerm>
                  <DescriptionListDescription>
                    {plrName ? (
                      <Link
                        to={`/application-pipeline/workspaces/${workspace}/applications/${applicationName}/pipelineRuns/${plrName}`}
                      >
                        {plrName}
                      </Link>
                    ) : (
                      '-'
                    )}
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Application</DescriptionListTerm>
                  <DescriptionListDescription>
                    {applicationName ? (
                      <Link
                        to={`/application-pipeline/workspaces/${workspace}/applications/${applicationName}`}
                      >
                        {taskRun.metadata?.labels[PipelineRunLabel.APPLICATION]}
                      </Link>
                    ) : (
                      '-'
                    )}
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Component</DescriptionListTerm>
                  <DescriptionListDescription>
                    {taskRun.metadata?.labels?.[PipelineRunLabel.COMPONENT] ? (
                      applicationName ? (
                        <Link
                          to={`/application-pipeline/workspaces/${workspace}/applications/${applicationName}/components?name=${
                            taskRun.metadata.labels[PipelineRunLabel.COMPONENT]
                          }`}
                        >
                          {taskRun.metadata.labels[PipelineRunLabel.COMPONENT]}
                        </Link>
                      ) : (
                        taskRun.metadata.labels[PipelineRunLabel.COMPONENT]
                      )
                    ) : (
                      '-'
                    )}
                  </DescriptionListDescription>
                </DescriptionListGroup>
              </DescriptionList>
            </FlexItem>
          </Flex>
          {taskRun.status?.taskResults ? (
            <>
              <Divider style={{ padding: 'var(--pf-global--spacer--lg) 0' }} />
              <RunResultsList results={taskRun.status.taskResults} status={status} />
            </>
          ) : null}
        </Flex>
      )}
    </>
  );
};

export default React.memo(TaskRunDetailsTab);
