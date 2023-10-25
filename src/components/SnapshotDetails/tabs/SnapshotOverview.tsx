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
} from '@patternfly/react-core';
import { ScanStatus } from '../../../components/PipelineRunListView/ScanStatus';
import { SnapshotLabels } from '../../../consts/pipelinerun';
import { useScanResults } from '../../../hooks/useScanResults';
import { Timestamp } from '../../../shared/components/timestamp/Timestamp';
import { Commit } from '../../../types';
import { Snapshot } from '../../../types/coreBuildService';
import { useWorkspaceInfo } from '../../../utils/workspace-context-utils';
import EnvironmentProvisionErrorAlert from '../../IntegrationTest/EnvironmentProvisionErrorAlert';
import SnapshotComponentsList from './SnapshotComponentsList';
import { SnapshotComponentTableData } from './SnapshotComponentsListRow';

interface SnapshotOverviewTabProps {
  snapshot: Snapshot;
  commit?: Commit;
  buildPipelineName?: string;
  environments?: string[];
}

const SnapshotOverviewTab: React.FC<SnapshotOverviewTabProps> = ({
  snapshot,
  commit,
  buildPipelineName,
  environments,
}) => {
  const { workspace } = useWorkspaceInfo();
  const [scanResults, scanLoaded] = useScanResults(buildPipelineName, true);

  const getEnvironmentProvisionError = (snpsht) => {
    const ENV_PROVISION_ERR = 'EnvironmentProvisionError';
    const itsStatus =
      snpsht.metadata?.annotations &&
      snpsht.metadata?.annotations[SnapshotLabels.ITS_STATUS_ANNOTATION];
    // const itsStatus =
    //   '[{"scenario":"app-sample-go-basic-enterprise-contract","status":"EnvironmentProvisionError","lastUpdateTime":"2023-09-20T16:00:38.969982048Z","details":"Failed to find deploymentTargetClass with right provisioner for copy of existingEnvironment","startTime":"2023-09-20T16:00:17.970660813Z","completionTime":"2023-09-20T16:00:38.969982048Z"}]';
    if (!itsStatus) {
      return null;
    }
    let errorStatus = null;
    try {
      const formattedItsStatus = JSON.parse(itsStatus);
      if (Array.isArray(formattedItsStatus) && formattedItsStatus.length > 0) {
        errorStatus = formattedItsStatus?.find((status) => status.status === ENV_PROVISION_ERR);
      } else if (formattedItsStatus?.Status === ENV_PROVISION_ERR) {
        errorStatus = formattedItsStatus;
      }
      return errorStatus;
    } catch (e) {
      return null;
    }
  };

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
                      {commit.displayName || commit.shaTitle}
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
                    {!errorStatus ? (
                      environments.map((env) => (
                        <div key={env}>
                          <Link
                            to={`/application-pipeline/workspaces/${workspace}/applications/${snapshot.spec.application}/deployments`}
                          >
                            {env}
                          </Link>
                        </div>
                      ))
                    ) : (
                      <EnvironmentProvisionErrorAlert
                        errMsg={errorStatus.details}
                        timeStamp={errorStatus.lastUpdateTime}
                        scenario={errorStatus.scenario}
                      />
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
