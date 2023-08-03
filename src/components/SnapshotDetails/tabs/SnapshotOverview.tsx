import * as React from 'react';
import { Link } from 'react-router-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Flex,
  FlexItem,
  Skeleton,
  Title,
} from '@patternfly/react-core';
import { ScanStatus } from '../../../components/PipelineRunListView/ScanStatus';
import { useScanResults } from '../../../hooks/useScanResults';
import { SnapshotEnvironmentBindingGroupVersionKind } from '../../../models';
import { Timestamp } from '../../../shared/components/timestamp/Timestamp';
import { Commit } from '../../../types';
import { Snapshot, SnapshotEnvironmentBinding } from '../../../types/coreBuildService';
import { useWorkspaceInfo } from '../../../utils/workspace-context-utils';
import SnapshotComponentsList from './SnapshotComponentsList';
import { SnapshotComponentTableData } from './SnapshotComponentsListRow';

interface SnapshotOverviewTabProps {
  snapshot: Snapshot;
  commit?: Commit;
  buildPipelineName?: string;
}

const SnapshotOverviewTab: React.FC<SnapshotOverviewTabProps> = ({
  snapshot,
  commit,
  buildPipelineName,
}) => {
  const { workspace } = useWorkspaceInfo();
  const [scanResults, scanLoaded] = useScanResults(buildPipelineName, true);
  const [snapshotEBs, sebLoaded, sebLoadError] = useK8sWatchResource<SnapshotEnvironmentBinding[]>({
    groupVersionKind: SnapshotEnvironmentBindingGroupVersionKind,
    namespace: snapshot.metadata?.namespace,
    isList: true,
  });

  const componentsTableData: SnapshotComponentTableData[] = React.useMemo(
    () =>
      snapshot.spec.components.map((component) => {
        return {
          metadata: { uid: component.name },
          application: snapshot.spec.application,
          ...component,
        };
      }),
    [snapshot.spec],
  );

  const environments = React.useMemo(() => {
    const env = [];
    sebLoaded &&
      !sebLoadError &&
      snapshotEBs.forEach((seb) => {
        if (seb.spec.snapshot === snapshot.metadata.name && seb.spec.environment) {
          env.push(seb.spec.environment);
        }
      });
    return env;
  }, [sebLoadError, sebLoaded, snapshotEBs, snapshot.metadata.name]);

  return (
    <>
      <Title headingLevel="h4" className="pf-c-title pf-u-mt-lg pf-u-mb-lg" size="lg">
        Snapshot details
      </Title>
      <Flex>
        <Flex flex={{ default: 'flex_3' }}>
          <FlexItem>
            <DescriptionList
              data-test="integration-test-details"
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
                  <DescriptionListDescription>
                    <Link
                      to={`/application-pipeline/workspaces/${workspace}/applications/${snapshot.spec.application}/commits/${commit.sha}`}
                      title={commit.shaTitle}
                    >
                      {commit.shaTitle}
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
              data-test="integration-test-details"
              columnModifier={{
                default: '1Col',
              }}
            >
              <DescriptionListGroup>
                <DescriptionListTerm>Deployed to</DescriptionListTerm>
                <DescriptionListDescription>
                  {environments.map((env) => (
                    <div key={env}>
                      <Link
                        to={`/application-pipeline/workspaces/${workspace}/applications/deployments`}
                      >
                        {env}
                      </Link>
                    </div>
                  ))}
                </DescriptionListDescription>
              </DescriptionListGroup>
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
      <SnapshotComponentsList
        components={componentsTableData}
        applicationName={snapshot.spec.application}
      />
    </>
  );
};

export default SnapshotOverviewTab;
