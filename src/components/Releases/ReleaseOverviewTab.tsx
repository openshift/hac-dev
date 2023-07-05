import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Flex,
  FlexItem,
  Title,
} from '@patternfly/react-core';
import { useReleaseStatus } from '../../hooks/useReleaseStatus';
import { Timestamp } from '../../shared/components/timestamp/Timestamp';
import { ReleaseKind } from '../../types';
import { calculateDuration } from '../../utils/pipeline-utils';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';
import MetadataList from '../PipelineRunDetailsView/MetadataList';
import { StatusIconWithText } from '../topology/StatusIcon';

type ReleaseOverviewTabProps = {
  applicationName: string;
  release: ReleaseKind;
};

const ReleaseOverviewTab: React.FC<ReleaseOverviewTabProps> = ({ applicationName, release }) => {
  const { workspace } = useWorkspaceInfo();
  const pipelineRun = release.status?.processing?.pipelineRun?.split('/')[1];
  const duration = calculateDuration(
    typeof release.status?.startTime === 'string' ? release.status?.startTime : '',
    typeof release.status?.completionTime === 'string' ? release.status?.completionTime : '',
  );
  const status = useReleaseStatus(release);

  return (
    <>
      <Title headingLevel="h4" className="pf-c-title pf-u-mt-lg pf-u-mb-lg" size="lg">
        Release details
      </Title>
      <Flex className="pf-u-py-lg">
        <FlexItem flex={{ default: 'flex_3' }}>
          <DescriptionList
            data-test="release-details"
            columnModifier={{
              default: '1Col',
            }}
          >
            <DescriptionListGroup>
              <DescriptionListTerm>Labels</DescriptionListTerm>
              <DescriptionListDescription>
                <MetadataList metadata={release.metadata?.labels} />
              </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>Annotations</DescriptionListTerm>
              <DescriptionListDescription>
                <MetadataList metadata={release.metadata?.annotations} />
              </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>Created at</DescriptionListTerm>
              <DescriptionListDescription>
                <Timestamp timestamp={release.metadata.creationTimestamp ?? '-'} />
              </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>Duration</DescriptionListTerm>
              <DescriptionListDescription>{duration ?? '-'}</DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>Release Process</DescriptionListTerm>
              <DescriptionListDescription>
                {release.status?.automated ? 'Automatic' : 'Manual'}
              </DescriptionListDescription>
            </DescriptionListGroup>
          </DescriptionList>
        </FlexItem>
        <Flex flex={{ default: 'flex_3' }}>
          <FlexItem flex={{ default: 'flex_3' }}>
            <DescriptionList
              data-test="release-details-col-2"
              columnModifier={{
                default: '1Col',
              }}
            >
              <DescriptionListGroup>
                <DescriptionListTerm>Status</DescriptionListTerm>
                <DescriptionListDescription>
                  <StatusIconWithText
                    status={status}
                    dataTestAttribute={'release-details status'}
                  />
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Release Plan</DescriptionListTerm>
                <DescriptionListDescription>{release.spec.releasePlan}</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Snapshot</DescriptionListTerm>
                <DescriptionListDescription>{release.spec.snapshot}</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Release Target</DescriptionListTerm>
                <DescriptionListDescription>
                  {release.status?.target ?? '-'}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Release Strategy</DescriptionListTerm>
                <DescriptionListDescription>
                  {release.status?.processing?.releaseStrategy?.split('/')[1] ?? '-'}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Pipeline Run</DescriptionListTerm>
                <DescriptionListDescription>
                  {pipelineRun ? (
                    <Link
                      to={`/application-pipeline/workspaces/${workspace}/applications/${applicationName}/pipelineruns/${pipelineRun}`}
                    >
                      {pipelineRun}
                    </Link>
                  ) : (
                    '-'
                  )}
                </DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </FlexItem>
        </Flex>
      </Flex>
    </>
  );
};

export default ReleaseOverviewTab;
