import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Flex,
  FlexItem,
  Skeleton,
  Title,
  capitalize,
} from '@patternfly/react-core';
import { ScanStatus } from '../../../components/PipelineRunListView/ScanStatus';
import { useScanResults } from '../../../hooks/useScanResults';
import CommitLabel from '../../../shared/components/commit-label/CommitLabel';
import { Timestamp } from '../../../shared/components/timestamp/Timestamp';
import { Commit } from '../../../types';
import { Snapshot } from '../../../types/coreBuildService';
import { useWorkspaceInfo } from '../../../utils/workspace-context-utils';
import EnvironmentProvisionErrorAlert from '../EnvironmentProvisionErrorAlert';
import { getEnvironmentProvisionError } from '../utils/snapshot-utils';
import SnapshotComponentsList from './SnapshotComponentsList';
import { SnapshotComponentTableData } from './SnapshotComponentsListRow';

interface SnapshotOverviewTabProps {
  snapshot: Snapshot;
  commit?: Commit;
  buildPipelineName?: string;
  environments?: string[];
}

const SnapshotOverviewTab: React.FC<React.PropsWithChildren<SnapshotOverviewTabProps>> = ({
  snapshot,
  commit,
  buildPipelineName,
  environments,
}) => {
  const { workspace } = useWorkspaceInfo();
  const [scanResults, scanLoaded] = useScanResults(buildPipelineName, true);

  const componentsTableData: SnapshotComponentTableData[] = React.useMemo(
    () =>
      snapshot.spec.components.map((component) => {
        return {
          metadata: { uid: component.name, name: component.name },
          application: snapshot.spec.application,
          ...component,
        };
      }),
    [snapshot.spec],
  );

  const errorStatus = getEnvironmentProvisionError(snapshot);

  return (
    <>
      <Title headingLevel="h4" className="pf-v5-c-title pf-v5-u-mt-lg pf-v5-u-mb-lg" size="lg">
        Snapshot details
      </Title>
      <Flex>
        <Flex flex={{ default: 'flex_3' }}>
          <FlexItem>
            <DescriptionList
              data-test="snapshot-details"
              columnModifier={{
                default: '1Col',
              }}
            >
              <DescriptionListGroup>
                <DescriptionListTerm>Created at</DescriptionListTerm>
                <DescriptionListDescription>
                  <Timestamp timestamp={snapshot.metadata.creationTimestamp ?? '-'} />
                </DescriptionListDescription>
              </DescriptionListGroup>
              {commit && (
                <DescriptionListGroup>
                  <DescriptionListTerm>Triggered by</DescriptionListTerm>
                  <DescriptionListDescription data-test="snapshot-commit-link">
                    <Link
                      to={`/application-pipeline/workspaces/${workspace}/applications/${snapshot.spec.application}/commit/${commit.sha}`}
                      title={commit.displayName || commit.shaTitle}
                    >
                      {commit.displayName || commit.shaTitle}{' '}
                      <CommitLabel
                        gitProvider={commit.gitProvider}
                        sha={commit.sha}
                        shaURL={commit.shaURL}
                      />
                    </Link>
                  </DescriptionListDescription>
                </DescriptionListGroup>
              )}
            </DescriptionList>
          </FlexItem>
        </Flex>

        <Flex flex={{ default: 'flex_3' }}>
          <FlexItem>
            <DescriptionList
              data-test="snapshot-details"
              columnModifier={{
                default: '1Col',
              }}
            >
              {environments && (
                <DescriptionListGroup>
                  <DescriptionListTerm>Deployed to</DescriptionListTerm>
                  <DescriptionListDescription>
                    {errorStatus && Array.isArray(errorStatus) && errorStatus.length > 0 ? (
                      <EnvironmentProvisionErrorAlert errorStatus={errorStatus} />
                    ) : (
                      environments.map((env) => (
                        <div key={env}>
                          <Link
                            to={`/application-pipeline/workspaces/${workspace}/applications/${snapshot.spec.application}/deployments`}
                          >
                            {capitalize(env)}
                          </Link>
                        </div>
                      ))
                    )}
                  </DescriptionListDescription>
                </DescriptionListGroup>
              )}

              <DescriptionListGroup>
                <DescriptionListTerm>Vulnerabilities</DescriptionListTerm>
                <DescriptionListDescription>
                  {scanLoaded ? <ScanStatus scanResults={scanResults} /> : <Skeleton />}
                </DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </FlexItem>
        </Flex>
      </Flex>
      <div className="pf-vf-u-mt-lg">
        <SnapshotComponentsList
          components={componentsTableData}
          applicationName={snapshot.spec.application}
        />
      </div>
    </>
  );
};

export default SnapshotOverviewTab;
